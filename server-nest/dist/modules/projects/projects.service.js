"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const crypto_1 = require("crypto");
const project_entity_1 = require("../../entities/project.entity");
const sprint_entity_1 = require("../../entities/sprint.entity");
const task_entity_1 = require("../../entities/task.entity");
const activity_log_service_1 = require("../../common/services/activity-log.service");
let ProjectsService = class ProjectsService {
    projectsRepository;
    sprintsRepository;
    tasksRepository;
    activityLogService;
    constructor(projectsRepository, sprintsRepository, tasksRepository, activityLogService) {
        this.projectsRepository = projectsRepository;
        this.sprintsRepository = sprintsRepository;
        this.tasksRepository = tasksRepository;
        this.activityLogService = activityLogService;
    }
    async create(org_id, actor, createProjectDto) {
        const { client_name, ...rest } = createProjectDto;
        const project = this.projectsRepository.create({
            id: (0, crypto_1.randomUUID)(),
            org_id,
            name: rest.name,
            description: rest.description,
            priority: rest.priority || 'medium',
            start_date: rest.start_date,
            end_date: rest.end_date,
            budget: rest.budget,
            created_by: actor?.id,
            status: (rest.status || 'active').toLowerCase().replace(/\s+/g, '_'),
            metadata: client_name ? { client_name } : {},
        });
        await this.projectsRepository.save(project);
        await this.activityLogService.log({
            org_id,
            actor,
            action: 'created',
            resource_type: 'projects',
            resource_id: project.id,
            summary: `created project "${project.name || 'Untitled'}"`,
        });
        return {
            success: true,
            data: this.withProjectExtras(project),
        };
    }
    timelineProgress(start_date, end_date) {
        if (!start_date || !end_date)
            return 0;
        const start = new Date(start_date).getTime();
        const end = new Date(end_date).getTime();
        if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start)
            return 0;
        const now = Date.now();
        if (now <= start)
            return 0;
        if (now >= end)
            return 100;
        return Math.round(((now - start) / (end - start)) * 100);
    }
    withProjectExtras(project) {
        const client_name = project.metadata?.client_name || null;
        return {
            ...project,
            client_name,
            owner_name: client_name,
            progress: this.timelineProgress(project.start_date, project.end_date),
        };
    }
    async findAll(org_id, status) {
        const where = { org_id };
        if (status) {
            where.status = status;
        }
        const projects = await this.projectsRepository.find({ where });
        const projectsWithCounts = await Promise.all(projects.map(async (project) => {
            const taskCount = await this.tasksRepository.count({
                where: { project_id: project.id },
            });
            const sprintCount = await this.sprintsRepository.count({
                where: { project_id: project.id },
            });
            return {
                ...this.withProjectExtras(project),
                task_count: taskCount,
                sprint_count: sprintCount,
            };
        }));
        return {
            success: true,
            data: projectsWithCounts,
        };
    }
    async findOne(id, org_id) {
        const project = await this.projectsRepository.findOne({
            where: { id, org_id },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        const sprints = await this.sprintsRepository.find({
            where: { project_id: id },
        });
        const tasks = await this.tasksRepository.find({
            where: { project_id: id },
        });
        return {
            success: true,
            data: {
                ...this.withProjectExtras(project),
                sprints,
                tasks,
            },
        };
    }
    async update(id, org_id, updateProjectDto, actor) {
        const project = await this.projectsRepository.findOne({
            where: { id, org_id },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        const { client_name, ...rest } = updateProjectDto;
        Object.assign(project, rest);
        if (client_name !== undefined) {
            project.metadata = { ...(project.metadata || {}), client_name };
        }
        await this.projectsRepository.save(project);
        await this.activityLogService.log({
            org_id,
            actor,
            action: 'updated',
            resource_type: 'projects',
            resource_id: project.id,
            summary: `updated project "${project.name || 'Untitled'}"`,
            changes: updateProjectDto,
        });
        return {
            success: true,
            data: this.withProjectExtras(project),
        };
    }
    async remove(id, org_id, actor) {
        const project = await this.projectsRepository.findOne({
            where: { id, org_id },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        const name = project.name;
        await this.projectsRepository.remove(project);
        await this.activityLogService.log({
            org_id,
            actor,
            action: 'deleted',
            resource_type: 'projects',
            resource_id: id,
            summary: `deleted project "${name || 'Untitled'}"`,
        });
        return {
            success: true,
            message: 'Project deleted successfully',
        };
    }
    async getProjectStats(id, org_id) {
        const project = await this.projectsRepository.findOne({
            where: { id, org_id },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        const tasks = await this.tasksRepository.find({
            where: { project_id: id },
        });
        const stats = {
            total_tasks: tasks.length,
            completed_tasks: tasks.filter((t) => t.status === 'done').length,
            in_progress_tasks: tasks.filter((t) => t.status === 'in-progress').length,
            todo_tasks: tasks.filter((t) => t.status === 'todo').length,
            total_estimated_hours: tasks.reduce((sum, t) => sum + (t.estimated_hours || 0), 0),
            total_logged_hours: tasks.reduce((sum, t) => sum + (t.time_logged || 0), 0),
        };
        return {
            success: true,
            data: stats,
        };
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __param(1, (0, typeorm_1.InjectRepository)(sprint_entity_1.Sprint)),
    __param(2, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        activity_log_service_1.ActivityLogService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map