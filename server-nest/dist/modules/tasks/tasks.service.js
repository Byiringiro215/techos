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
const user_entity_1 = require("../../entities/user.entity");
const activity_log_service_1 = require("../../common/services/activity-log.service");
const project_visibility_1 = require("../../common/utils/project-visibility");
const org_admin_1 = require("../../common/utils/org-admin");
function normalizeAssigneeFields(dto) {
    const fromArray = Array.isArray(dto?.assignee_ids)
        ? dto.assignee_ids.filter((id) => typeof id === 'string' && !!id.trim())
        : [];
    const fromSingle = dto?.assignee_id && typeof dto.assignee_id === 'string' && dto.assignee_id.trim()
        ? [dto.assignee_id]
        : [];
    const ids = [...new Set(fromArray.length ? fromArray : fromSingle)];
    return {
        assignee_ids: ids,
        assignee_id: ids[0] ?? null,
    };
}
let TasksService = class TasksService {
    tasksRepository;
    projectsRepository;
    usersRepository;
    activityLogService;
    constructor(tasksRepository, projectsRepository, usersRepository, activityLogService) {
        this.tasksRepository = tasksRepository;
        this.projectsRepository = projectsRepository;
        this.usersRepository = usersRepository;
        this.activityLogService = activityLogService;
    }
    async getAccessibleProjectIds(org_id, user) {
        const projects = await this.projectsRepository.find({ where: { org_id } });
        return projects.filter((p) => (0, project_visibility_1.canViewProject)(p, user)).map((p) => p.id);
    }
    async assertProjectAccess(project_id, org_id, user) {
        const project = await this.projectsRepository.findOne({ where: { id: project_id, org_id } });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        (0, project_visibility_1.assertCanViewProject)(project, user);
        return project;
    }
    async create(org_id, actor, createTaskDto) {
        (0, org_admin_1.assertDeliveryAdmin)(actor, 'create tasks');
        await this.assertProjectAccess(createTaskDto.project_id, org_id, actor);
        const { assignee_id, assignee_ids } = normalizeAssigneeFields(createTaskDto);
        const task = this.tasksRepository.create({
            id: (0, crypto_1.randomUUID)(),
            org_id,
            title: createTaskDto.title,
            description: createTaskDto.description,
            project_id: createTaskDto.project_id,
            sprint_id: createTaskDto.sprint_id,
            parent_task_id: createTaskDto.parent_task_id,
            status: createTaskDto.status || 'todo',
            priority: createTaskDto.priority || 'medium',
            assignee_id: assignee_id || undefined,
            assignee_ids: assignee_ids.length ? assignee_ids : undefined,
            estimated_hours: createTaskDto.estimated_hours,
            story_points: createTaskDto.story_points,
            due_date: createTaskDto.due_date,
            tags: createTaskDto.tags,
            reporter_id: actor?.id,
        });
        const saved = await this.tasksRepository.save(task);
        await this.activityLogService.log({
            org_id,
            actor,
            action: 'created',
            resource_type: 'tasks',
            resource_id: saved.id,
            summary: `created task "${saved.title || 'Untitled'}"`,
        });
        return { success: true, data: await this.enrichTask(saved) };
    }
    parseAssigneeIds(task) {
        let ids = [];
        const raw = task?.assignee_ids;
        if (Array.isArray(raw)) {
            ids = raw.filter(Boolean);
        }
        else if (typeof raw === 'string' && raw.trim()) {
            try {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed))
                    ids = parsed.filter(Boolean);
            }
            catch {
            }
        }
        if (!ids.length && task?.assignee_id)
            ids = [task.assignee_id];
        return [...new Set(ids)];
    }
    async enrichTasks(tasks) {
        const allIds = [
            ...new Set(tasks.flatMap((t) => this.parseAssigneeIds(t))),
        ];
        if (!allIds.length) {
            return tasks.map((t) => ({
                ...t,
                assignee_ids: [],
                assignee_name: null,
                assignees: [],
            }));
        }
        const users = await this.usersRepository.find({ where: { id: (0, typeorm_2.In)(allIds) } });
        const byId = Object.fromEntries(users.map((u) => [
            u.id,
            {
                id: u.id,
                name: u.name || `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email,
            },
        ]));
        return tasks.map((t) => {
            const ids = this.parseAssigneeIds(t);
            const assignees = ids.map((id) => byId[id]).filter(Boolean);
            return {
                ...t,
                assignee_ids: ids,
                assignee_id: ids[0] || t.assignee_id || null,
                assignee_name: assignees[0]?.name || null,
                assignees,
            };
        });
    }
    async enrichTask(task) {
        const [enriched] = await this.enrichTasks([task]);
        return enriched;
    }
    async findAll(org_id, filters, user) {
        const allowedIds = await this.getAccessibleProjectIds(org_id, user);
        if (!allowedIds.length) {
            return { success: true, data: [] };
        }
        if (filters?.project_id) {
            await this.assertProjectAccess(filters.project_id, org_id, user);
        }
        const queryBuilder = this.tasksRepository
            .createQueryBuilder('task')
            .leftJoin(project_entity_1.Project, 'project', 'task.project_id = project.id')
            .where('project.org_id = :org_id', { org_id })
            .andWhere('task.project_id IN (:...allowedIds)', { allowedIds });
        if (filters?.project_id) {
            queryBuilder.andWhere('task.project_id = :project_id', { project_id: filters.project_id });
        }
        if (filters?.status) {
            queryBuilder.andWhere('task.status = :status', { status: filters.status });
        }
        if (filters?.assignee_id) {
            queryBuilder.andWhere('(task.assignee_id = :assignee_id OR task.assignee_ids LIKE :assignee_like)', {
                assignee_id: filters.assignee_id,
                assignee_like: `%${filters.assignee_id}%`,
            });
        }
        if (filters?.sprint_id === 'null' || filters?.sprint_id === 'none') {
            queryBuilder.andWhere('task.sprint_id IS NULL');
        }
        else if (filters?.sprint_id) {
            queryBuilder.andWhere('task.sprint_id = :sprint_id', { sprint_id: filters.sprint_id });
        }
        const tasks = await queryBuilder.select('task.*').orderBy('task.created_at', 'DESC').getRawMany();
        return { success: true, data: await this.enrichTasks(tasks) };
    }
    async findOne(id, org_id, user) {
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
        await this.assertProjectAccess(task.project_id, org_id, user);
        return { success: true, data: await this.enrichTask(task) };
    }
    async update(id, org_id, updateTaskDto, actor) {
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
        await this.assertProjectAccess(task.project_id, org_id, actor);
        const patch = { ...updateTaskDto };
        delete patch.id;
        delete patch.org_id;
        delete patch.created_at;
        delete patch.assignee_name;
        delete patch.assignees;
        delete patch.owner;
        delete patch.assignee;
        delete patch.statusVariant;
        delete patch.dueDate;
        delete patch.createdAt;
        delete patch.updatedAt;
        if (patch.sprint_id === '' || patch.sprint_id === 'null') {
            patch.sprint_id = null;
        }
        if (patch.project_id && patch.project_id !== task.project_id) {
            await this.assertProjectAccess(patch.project_id, org_id, actor);
        }
        if (patch.assignee_ids !== undefined || patch.assignee_id !== undefined) {
            if (Array.isArray(patch.assignee_ids)) {
                const ids = [
                    ...new Set(patch.assignee_ids.filter((id) => typeof id === 'string' && id.trim())),
                ];
                patch.assignee_ids = ids.length ? ids : null;
                patch.assignee_id = ids[0] || null;
            }
            else if (patch.assignee_id === null || patch.assignee_id === '') {
                patch.assignee_id = null;
                patch.assignee_ids = null;
            }
            else {
                const normalized = normalizeAssigneeFields(patch);
                patch.assignee_id = normalized.assignee_id;
                patch.assignee_ids = normalized.assignee_ids.length ? normalized.assignee_ids : null;
            }
        }
        await this.tasksRepository.update(id, patch);
        const updated = await this.tasksRepository.findOne({ where: { id } });
        await this.activityLogService.log({
            org_id,
            actor,
            action: 'updated',
            resource_type: 'tasks',
            resource_id: id,
            summary: `updated task "${updated?.title || task.title || 'Untitled'}"`,
            changes: patch,
        });
        return { success: true, data: await this.enrichTask(updated) };
    }
    async remove(id, org_id, actor) {
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
        await this.assertProjectAccess(task.project_id, org_id, actor);
        await this.tasksRepository.delete(id);
        await this.activityLogService.log({
            org_id,
            actor,
            action: 'deleted',
            resource_type: 'tasks',
            resource_id: id,
            summary: `deleted task "${task.title || 'Untitled'}"`,
        });
        return { success: true, message: 'Task deleted successfully' };
    }
    async getSubtasks(task_id, org_id, user) {
        await this.findOne(task_id, org_id, user);
        const subtasks = await this.tasksRepository.find({
            where: { parent_task_id: task_id },
            order: { created_at: 'ASC' },
        });
        return { success: true, data: await this.enrichTasks(subtasks) };
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __param(1, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        activity_log_service_1.ActivityLogService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map