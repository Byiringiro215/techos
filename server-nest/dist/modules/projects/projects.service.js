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
let ProjectsService = class ProjectsService {
    projectsRepository;
    sprintsRepository;
    tasksRepository;
    constructor(projectsRepository, sprintsRepository, tasksRepository) {
        this.projectsRepository = projectsRepository;
        this.sprintsRepository = sprintsRepository;
        this.tasksRepository = tasksRepository;
    }
    async create(org_id, user_id, createProjectDto) {
        const project = this.projectsRepository.create({
            id: (0, crypto_1.randomUUID)(),
            org_id,
            ...createProjectDto,
            created_by: user_id,
            status: 'active',
        });
        await this.projectsRepository.save(project);
        return {
            success: true,
            data: project,
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
                ...project,
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
                ...project,
                sprints,
                tasks,
            },
        };
    }
    async update(id, org_id, updateProjectDto) {
        const project = await this.projectsRepository.findOne({
            where: { id, org_id },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        Object.assign(project, updateProjectDto);
        await this.projectsRepository.save(project);
        return {
            success: true,
            data: project,
        };
    }
    async remove(id, org_id) {
        const project = await this.projectsRepository.findOne({
            where: { id, org_id },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        await this.projectsRepository.remove(project);
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
        typeorm_2.Repository])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map