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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const crypto_1 = require("crypto");
const project_entity_1 = require("../../entities/project.entity");
const task_entity_1 = require("../../entities/task.entity");
const sprint_entity_1 = require("../../entities/sprint.entity");
const user_entity_1 = require("../../entities/user.entity");
const bug_entity_1 = require("../../entities/bug.entity");
const kpi_entity_1 = require("../../entities/kpi.entity");
let AnalyticsService = class AnalyticsService {
    projectRepository;
    taskRepository;
    sprintRepository;
    userRepository;
    bugRepository;
    kpiRepository;
    constructor(projectRepository, taskRepository, sprintRepository, userRepository, bugRepository, kpiRepository) {
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.sprintRepository = sprintRepository;
        this.userRepository = userRepository;
        this.bugRepository = bugRepository;
        this.kpiRepository = kpiRepository;
    }
    async getProjectAnalytics(org_id, project_id) {
        const query = this.projectRepository.createQueryBuilder('project')
            .where('project.org_id = :org_id', { org_id });
        if (project_id) {
            query.andWhere('project.id = :project_id', { project_id });
        }
        const projects = await query.getMany();
        const analytics = await Promise.all(projects.map(async (project) => {
            const tasks = await this.taskRepository.find({
                where: { project_id: project.id, org_id },
            });
            const completedTasks = tasks.filter(t => t.status === 'done');
            const totalEstimatedHours = tasks.reduce((sum, t) => sum + (t.estimated_hours || 0), 0);
            const totalLoggedHours = tasks.reduce((sum, t) => sum + (t.time_logged || 0), 0);
            return {
                project_id: project.id,
                project_name: project.name,
                total_tasks: tasks.length,
                completed_tasks: completedTasks.length,
                in_progress_tasks: tasks.filter(t => t.status === 'in_progress').length,
                pending_tasks: tasks.filter(t => t.status === 'todo').length,
                completion_rate: tasks.length ? (completedTasks.length / tasks.length) * 100 : 0,
                estimated_hours: totalEstimatedHours,
                logged_hours: totalLoggedHours,
                efficiency: totalEstimatedHours ? (totalLoggedHours / totalEstimatedHours) * 100 : 0,
            };
        }));
        return { success: true, data: project_id ? analytics[0] : analytics };
    }
    async getTeamProductivity(org_id, start_date, end_date) {
        const users = await this.userRepository.find({ where: { org_id } });
        const productivity = await Promise.all(users.map(async (user) => {
            const tasksQuery = this.taskRepository.createQueryBuilder('task')
                .where('task.org_id = :org_id', { org_id })
                .andWhere('task.assignee_id = :user_id', { user_id: user.id });
            if (start_date) {
                tasksQuery.andWhere('task.created_at >= :start_date', { start_date });
            }
            if (end_date) {
                tasksQuery.andWhere('task.created_at <= :end_date', { end_date });
            }
            const tasks = await tasksQuery.getMany();
            const completedTasks = tasks.filter(t => t.status === 'done');
            return {
                user_id: user.id,
                user_name: user.name,
                total_tasks: tasks.length,
                completed_tasks: completedTasks.length,
                in_progress_tasks: tasks.filter(t => t.status === 'in_progress').length,
                completion_rate: tasks.length ? (completedTasks.length / tasks.length) * 100 : 0,
                total_logged_hours: tasks.reduce((sum, t) => sum + (t.time_logged || 0), 0),
            };
        }));
        return { success: true, data: productivity };
    }
    async getSprintAnalytics(org_id, sprint_id) {
        const query = this.sprintRepository.createQueryBuilder('sprint')
            .where('sprint.org_id = :org_id', { org_id });
        if (sprint_id) {
            query.andWhere('sprint.id = :sprint_id', { sprint_id });
        }
        const sprints = await query.getMany();
        const analytics = await Promise.all(sprints.map(async (sprint) => {
            const tasks = await this.taskRepository.find({
                where: { sprint_id: sprint.id, org_id },
            });
            const completedTasks = tasks.filter(t => t.status === 'done');
            const totalPoints = tasks.reduce((sum, t) => sum + (t.story_points || 0), 0);
            const completedPoints = completedTasks.reduce((sum, t) => sum + (t.story_points || 0), 0);
            return {
                sprint_id: sprint.id,
                sprint_name: sprint.name,
                status: sprint.status,
                total_tasks: tasks.length,
                completed_tasks: completedTasks.length,
                total_story_points: totalPoints,
                completed_story_points: completedPoints,
                velocity: completedPoints,
                completion_rate: tasks.length ? (completedTasks.length / tasks.length) * 100 : 0,
            };
        }));
        return { success: true, data: sprint_id ? analytics[0] : analytics };
    }
    async getBugAnalytics(org_id) {
        const bugs = await this.bugRepository.find({ where: { org_id } });
        const analytics = {
            total_bugs: bugs.length,
            open_bugs: bugs.filter(b => b.status === 'open').length,
            in_progress_bugs: bugs.filter(b => b.status === 'in_progress').length,
            resolved_bugs: bugs.filter(b => b.status === 'resolved').length,
            closed_bugs: bugs.filter(b => b.status === 'closed').length,
            by_severity: {
                critical: bugs.filter(b => b.severity === 'critical').length,
                high: bugs.filter(b => b.severity === 'high').length,
                medium: bugs.filter(b => b.severity === 'medium').length,
                low: bugs.filter(b => b.severity === 'low').length,
            },
            by_priority: {
                high: bugs.filter(b => b.priority === 'high').length,
                medium: bugs.filter(b => b.priority === 'medium').length,
                low: bugs.filter(b => b.priority === 'low').length,
            },
        };
        return { success: true, data: analytics };
    }
    async getTimeTracking(org_id, user_id, project_id) {
        const query = this.taskRepository.createQueryBuilder('task')
            .where('task.org_id = :org_id', { org_id });
        if (user_id) {
            query.andWhere('task.assignee_id = :user_id', { user_id });
        }
        if (project_id) {
            query.andWhere('task.project_id = :project_id', { project_id });
        }
        const tasks = await query.getMany();
        const analytics = {
            total_estimated_hours: tasks.reduce((sum, t) => sum + (t.estimated_hours || 0), 0),
            total_logged_hours: tasks.reduce((sum, t) => sum + (t.time_logged || 0), 0),
            tasks_with_time_logged: tasks.filter(t => t.time_logged > 0).length,
            average_logged_per_task: tasks.length ?
                tasks.reduce((sum, t) => sum + (t.time_logged || 0), 0) / tasks.length : 0,
            efficiency_rate: tasks.reduce((sum, t) => sum + (t.estimated_hours || 0), 0) ?
                (tasks.reduce((sum, t) => sum + (t.time_logged || 0), 0) /
                    tasks.reduce((sum, t) => sum + (t.estimated_hours || 0), 0)) * 100 : 0,
        };
        return { success: true, data: analytics };
    }
    async getOverview(org_id) {
        const [projects, tasks, sprints, bugs, users] = await Promise.all([
            this.projectRepository.find({ where: { org_id } }),
            this.taskRepository.find({ where: { org_id } }),
            this.sprintRepository.find({ where: { org_id } }),
            this.bugRepository.find({ where: { org_id } }),
            this.userRepository.find({ where: { org_id } }),
        ]);
        const overview = {
            projects: {
                total: projects.length,
                active: projects.filter(p => p.status === 'active').length,
                completed: projects.filter(p => p.status === 'completed').length,
            },
            tasks: {
                total: tasks.length,
                todo: tasks.filter(t => t.status === 'todo').length,
                in_progress: tasks.filter(t => t.status === 'in_progress').length,
                done: tasks.filter(t => t.status === 'done').length,
            },
            sprints: {
                total: sprints.length,
                active: sprints.filter(s => s.status === 'active').length,
                completed: sprints.filter(s => s.status === 'completed').length,
            },
            bugs: {
                total: bugs.length,
                open: bugs.filter(b => b.status === 'open').length,
                resolved: bugs.filter(b => b.status === 'resolved').length,
            },
            team: {
                total_members: users.length,
                active_members: users.filter(u => u.status === 'active').length,
            },
        };
        return { success: true, data: overview };
    }
    async createKPI(org_id, owner_id, createDto) {
        const kpi = this.kpiRepository.create({
            id: (0, crypto_1.randomUUID)(),
            org_id,
            owner_id,
            ...createDto,
            current: 0,
        });
        await this.kpiRepository.save(kpi);
        return { success: true, data: kpi };
    }
    async getAllKPIs(org_id, filters) {
        const query = this.kpiRepository.createQueryBuilder('kpi')
            .where('kpi.org_id = :org_id', { org_id });
        if (filters?.category) {
            query.andWhere('kpi.category = :category', { category: filters.category });
        }
        if (filters?.owner_id) {
            query.andWhere('kpi.owner_id = :owner_id', { owner_id: filters.owner_id });
        }
        const kpis = await query.getMany();
        return { success: true, data: kpis };
    }
    async updateKPI(id, org_id, updateDto) {
        const kpi = await this.kpiRepository.findOne({ where: { id, org_id } });
        if (!kpi) {
            throw new Error('KPI not found');
        }
        Object.assign(kpi, updateDto);
        await this.kpiRepository.save(kpi);
        return { success: true, data: kpi };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __param(1, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __param(2, (0, typeorm_1.InjectRepository)(sprint_entity_1.Sprint)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(4, (0, typeorm_1.InjectRepository)(bug_entity_1.Bug)),
    __param(5, (0, typeorm_1.InjectRepository)(kpi_entity_1.KPI)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map