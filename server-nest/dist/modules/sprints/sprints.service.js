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
exports.SprintsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const crypto_1 = require("crypto");
const sprint_entity_1 = require("../../entities/sprint.entity");
const project_entity_1 = require("../../entities/project.entity");
const task_entity_1 = require("../../entities/task.entity");
let SprintsService = class SprintsService {
    sprintsRepository;
    projectsRepository;
    tasksRepository;
    constructor(sprintsRepository, projectsRepository, tasksRepository) {
        this.sprintsRepository = sprintsRepository;
        this.projectsRepository = projectsRepository;
        this.tasksRepository = tasksRepository;
    }
    async create(org_id, createSprintDto) {
        const project = await this.projectsRepository.findOne({
            where: { id: createSprintDto.project_id, org_id },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        const sprint = this.sprintsRepository.create({
            id: (0, crypto_1.randomUUID)(),
            ...createSprintDto,
        });
        await this.sprintsRepository.save(sprint);
        return { success: true, data: sprint };
    }
    async findAll(org_id, project_id) {
        const queryBuilder = this.sprintsRepository
            .createQueryBuilder('sprint')
            .leftJoin(project_entity_1.Project, 'project', 'sprint.project_id = project.id')
            .where('project.org_id = :org_id', { org_id });
        if (project_id) {
            queryBuilder.andWhere('sprint.project_id = :project_id', { project_id });
        }
        const sprints = await queryBuilder.select('sprint.*').getRawMany();
        return { success: true, data: sprints };
    }
    async findOne(id, org_id) {
        const sprint = await this.sprintsRepository
            .createQueryBuilder('sprint')
            .leftJoin(project_entity_1.Project, 'project', 'sprint.project_id = project.id')
            .where('sprint.id = :id', { id })
            .andWhere('project.org_id = :org_id', { org_id })
            .select('sprint.*')
            .getRawOne();
        if (!sprint) {
            throw new common_1.NotFoundException('Sprint not found');
        }
        return { success: true, data: sprint };
    }
    async update(id, org_id, updateSprintDto) {
        const sprint = await this.findOne(id, org_id);
        await this.sprintsRepository.update(id, updateSprintDto);
        const updated = await this.sprintsRepository.findOne({ where: { id } });
        return { success: true, data: updated };
    }
    async remove(id, org_id) {
        await this.findOne(id, org_id);
        await this.sprintsRepository.delete(id);
        return { success: true, message: 'Sprint deleted successfully' };
    }
    async getStats(id, org_id) {
        await this.findOne(id, org_id);
        const tasks = await this.tasksRepository.find({ where: { sprint_id: id } });
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter((task) => task.status === 'done').length;
        return {
            success: true,
            data: {
                total_tasks: totalTasks,
                completed_tasks: completedTasks,
                completion_rate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
            },
        };
    }
    async findActiveSprint(project_id, org_id) {
        const sprint = await this.sprintsRepository
            .createQueryBuilder('sprint')
            .leftJoin(project_entity_1.Project, 'project', 'sprint.project_id = project.id')
            .where('sprint.project_id = :project_id', { project_id })
            .andWhere('project.org_id = :org_id', { org_id })
            .andWhere('sprint.status = :status', { status: 'active' })
            .select('sprint.*')
            .orderBy('sprint.created_at', 'DESC')
            .getRawOne();
        return { success: true, data: sprint || null };
    }
    async startSprint(id, org_id) {
        const sprint = await this.sprintsRepository.findOne({ where: { id } });
        await this.findOne(id, org_id);
        if (!sprint) {
            throw new common_1.NotFoundException('Sprint not found');
        }
        sprint.status = 'active';
        await this.sprintsRepository.save(sprint);
        return { success: true, data: sprint };
    }
    async completeSprint(id, org_id) {
        const sprint = await this.sprintsRepository.findOne({ where: { id } });
        await this.findOne(id, org_id);
        if (!sprint) {
            throw new common_1.NotFoundException('Sprint not found');
        }
        sprint.status = 'completed';
        await this.sprintsRepository.save(sprint);
        return { success: true, data: sprint };
    }
    async addTaskToSprint(sprint_id, task_id, org_id) {
        await this.findOne(sprint_id, org_id);
        const task = await this.tasksRepository
            .createQueryBuilder('task')
            .leftJoin(project_entity_1.Project, 'project', 'task.project_id = project.id')
            .where('task.id = :task_id', { task_id })
            .andWhere('project.org_id = :org_id', { org_id })
            .select('task.*')
            .getRawOne();
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        await this.tasksRepository.update(task_id, { sprint_id });
        return { success: true, message: 'Task added to sprint' };
    }
    async removeTaskFromSprint(sprint_id, task_id, org_id) {
        await this.findOne(sprint_id, org_id);
        const task = await this.tasksRepository
            .createQueryBuilder('task')
            .leftJoin(project_entity_1.Project, 'project', 'task.project_id = project.id')
            .where('task.id = :task_id', { task_id })
            .andWhere('project.org_id = :org_id', { org_id })
            .select('task.*')
            .getRawOne();
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        await this.tasksRepository.update(task_id, { sprint_id: null });
        return { success: true, message: 'Task removed from sprint' };
    }
};
exports.SprintsService = SprintsService;
exports.SprintsService = SprintsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sprint_entity_1.Sprint)),
    __param(1, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __param(2, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SprintsService);
//# sourceMappingURL=sprints.service.js.map