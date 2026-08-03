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
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const crypto_1 = require("crypto");
const task_entity_1 = require("../../entities/task.entity");
const project_entity_1 = require("../../entities/project.entity");
let TasksService = class TasksService {
    tasksRepository;
    projectsRepository;
    constructor(tasksRepository, projectsRepository) {
        this.tasksRepository = tasksRepository;
        this.projectsRepository = projectsRepository;
    }
    async create(org_id, user_id, createTaskDto) {
        const project = await this.projectsRepository.findOne({
            where: { id: createTaskDto.project_id, org_id },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        const task = this.tasksRepository.create({
            id: (0, crypto_1.randomUUID)(),
            ...createTaskDto,
            reporter_id: user_id,
        });
        await this.tasksRepository.save(task);
        return { success: true, data: task };
    }
    async findAll(org_id, filters) {
        const queryBuilder = this.tasksRepository
            .createQueryBuilder('task')
            .leftJoin(project_entity_1.Project, 'project', 'task.project_id = project.id')
            .where('project.org_id = :org_id', { org_id });
        if (filters?.project_id) {
            queryBuilder.andWhere('task.project_id = :project_id', { project_id: filters.project_id });
        }
        if (filters?.status) {
            queryBuilder.andWhere('task.status = :status', { status: filters.status });
        }
        if (filters?.assignee_id) {
            queryBuilder.andWhere('task.assignee_id = :assignee_id', { assignee_id: filters.assignee_id });
        }
        const tasks = await queryBuilder.select('task.*').getRawMany();
        return { success: true, data: tasks };
    }
    async findOne(id, org_id) {
        const task = await this.tasksRepository
            .createQueryBuilder('task')
            .leftJoin(project_entity_1.Project, 'project', 'task.project_id = project.id')
            .where('task.id = :id', { id })
            .andWhere('project.org_id = :org_id', { org_id })
            .select('task.*')
            .getRawOne();
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        return { success: true, data: task };
    }
    async update(id, org_id, updateTaskDto) {
        const task = await this.tasksRepository
            .createQueryBuilder('task')
            .leftJoin(project_entity_1.Project, 'project', 'task.project_id = project.id')
            .where('task.id = :id', { id })
            .andWhere('project.org_id = :org_id', { org_id })
            .select('task.*')
            .getRawOne();
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        await this.tasksRepository.update(id, updateTaskDto);
        const updated = await this.tasksRepository.findOne({ where: { id } });
        return { success: true, data: updated };
    }
    async remove(id, org_id) {
        const task = await this.tasksRepository
            .createQueryBuilder('task')
            .leftJoin(project_entity_1.Project, 'project', 'task.project_id = project.id')
            .where('task.id = :id', { id })
            .andWhere('project.org_id = :org_id', { org_id })
            .select('task.*')
            .getRawOne();
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        await this.tasksRepository.delete(id);
        return { success: true, message: 'Task deleted successfully' };
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __param(1, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], TasksService);
//# sourceMappingURL=tasks.service.js.map