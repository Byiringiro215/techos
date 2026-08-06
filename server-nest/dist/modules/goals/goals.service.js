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
exports.GoalsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const crypto_1 = require("crypto");
const goal_entity_1 = require("../../entities/goal.entity");
const user_entity_1 = require("../../entities/user.entity");
const activity_log_service_1 = require("../../common/services/activity-log.service");
let GoalsService = class GoalsService {
    goalRepository;
    usersRepository;
    activityLogService;
    constructor(goalRepository, usersRepository, activityLogService) {
        this.goalRepository = goalRepository;
        this.usersRepository = usersRepository;
        this.activityLogService = activityLogService;
    }
    async create(org_id, createDto, actor) {
        const goal = this.goalRepository.create({
            id: (0, crypto_1.randomUUID)(),
            org_id,
            ...createDto,
            status: 'active',
            progress: 0,
        });
        await this.goalRepository.save(goal);
        await this.activityLogService.log({
            org_id,
            actor,
            action: 'created',
            resource_type: 'goals',
            resource_id: goal.id,
            summary: `created goal "${goal.title || 'Untitled'}"`,
        });
        return { success: true, data: goal };
    }
    async withOwnerNames(goals) {
        const ownerIds = [...new Set(goals.map((g) => g.owner_id).filter(Boolean))];
        const owners = ownerIds.length
            ? await this.usersRepository.find({ where: { id: (0, typeorm_2.In)(ownerIds) } })
            : [];
        const ownerMap = new Map(owners.map((u) => [u.id, u]));
        return goals.map((goal) => {
            const owner = ownerMap.get(goal.owner_id);
            const owner_name = owner
                ? `${owner.first_name || ''} ${owner.last_name || ''}`.trim() || owner.email
                : '—';
            return { ...goal, owner_name };
        });
    }
    async findAll(org_id, filters) {
        const query = this.goalRepository.createQueryBuilder('goal')
            .where('goal.org_id = :org_id', { org_id });
        if (filters?.type) {
            query.andWhere('goal.type = :type', { type: filters.type });
        }
        if (filters?.status) {
            query.andWhere('goal.status = :status', { status: filters.status });
        }
        if (filters?.owner_id) {
            query.andWhere('goal.owner_id = :owner_id', { owner_id: filters.owner_id });
        }
        if (filters?.quarter) {
            query.andWhere('goal.quarter = :quarter', { quarter: filters.quarter });
        }
        if (filters?.parent_goal_id) {
            query.andWhere('goal.parent_goal_id = :parent_goal_id', { parent_goal_id: filters.parent_goal_id });
        }
        query.orderBy('goal.created_at', 'DESC');
        const goals = await query.getMany();
        return { success: true, data: await this.withOwnerNames(goals) };
    }
    async findOne(id, org_id) {
        const goal = await this.goalRepository.findOne({
            where: { id, org_id },
        });
        if (!goal) {
            throw new common_1.NotFoundException('Goal not found');
        }
        const childGoals = await this.goalRepository.find({
            where: { parent_goal_id: id, org_id },
        });
        return {
            success: true,
            data: {
                ...goal,
                child_goals: childGoals,
            }
        };
    }
    async update(id, org_id, updateDto, actor) {
        const goal = await this.goalRepository.findOne({
            where: { id, org_id },
        });
        if (!goal) {
            throw new common_1.NotFoundException('Goal not found');
        }
        if (updateDto.key_results) {
            const totalProgress = updateDto.key_results.reduce((sum, kr) => {
                const krProgress = (kr.current / kr.target) * 100;
                return sum + krProgress;
            }, 0);
            updateDto.progress = Math.min(100, totalProgress / updateDto.key_results.length);
        }
        Object.assign(goal, updateDto);
        await this.goalRepository.save(goal);
        await this.activityLogService.log({
            org_id,
            actor,
            action: 'updated',
            resource_type: 'goals',
            resource_id: goal.id,
            summary: `updated goal "${goal.title || 'Untitled'}"`,
            changes: updateDto,
        });
        return { success: true, data: goal };
    }
    async remove(id, org_id, actor) {
        const goal = await this.goalRepository.findOne({
            where: { id, org_id },
        });
        if (!goal) {
            throw new common_1.NotFoundException('Goal not found');
        }
        const title = goal.title;
        await this.goalRepository.remove(goal);
        await this.activityLogService.log({
            org_id,
            actor,
            action: 'deleted',
            resource_type: 'goals',
            resource_id: id,
            summary: `deleted goal "${title || 'Untitled'}"`,
        });
        return { success: true, message: 'Goal deleted successfully' };
    }
    async updateKeyResult(id, org_id, keyResultIndex, current) {
        const goal = await this.goalRepository.findOne({
            where: { id, org_id },
        });
        if (!goal) {
            throw new common_1.NotFoundException('Goal not found');
        }
        if (!goal.key_results || !goal.key_results[keyResultIndex]) {
            throw new common_1.NotFoundException('Key result not found');
        }
        goal.key_results[keyResultIndex].current = current;
        const totalProgress = goal.key_results.reduce((sum, kr) => {
            const krProgress = (kr.current / kr.target) * 100;
            return sum + Math.min(100, krProgress);
        }, 0);
        goal.progress = totalProgress / goal.key_results.length;
        await this.goalRepository.save(goal);
        return { success: true, data: goal };
    }
    async getAlignment(org_id) {
        const companyGoals = await this.goalRepository.find({
            where: { org_id, type: 'company', status: 'active' },
        });
        const alignment = await Promise.all(companyGoals.map(async (companyGoal) => {
            const departmentGoals = await this.goalRepository.find({
                where: { org_id, parent_goal_id: companyGoal.id },
            });
            const departmentWithTeamGoals = await Promise.all(departmentGoals.map(async (deptGoal) => {
                const teamGoals = await this.goalRepository.find({
                    where: { org_id, parent_goal_id: deptGoal.id },
                });
                return { ...deptGoal, team_goals: teamGoals };
            }));
            return {
                ...companyGoal,
                department_goals: departmentWithTeamGoals,
            };
        }));
        return { success: true, data: alignment };
    }
    async getProgressReport(org_id, quarter) {
        const query = this.goalRepository.createQueryBuilder('goal')
            .where('goal.org_id = :org_id', { org_id })
            .andWhere('goal.status = :status', { status: 'active' });
        if (quarter) {
            query.andWhere('goal.quarter = :quarter', { quarter });
        }
        const goals = await query.getMany();
        const report = {
            total_goals: goals.length,
            by_type: {
                company: goals.filter(g => g.type === 'company').length,
                department: goals.filter(g => g.type === 'department').length,
                team: goals.filter(g => g.type === 'team').length,
                individual: goals.filter(g => g.type === 'individual').length,
            },
            average_progress: goals.reduce((sum, g) => sum + g.progress, 0) / goals.length || 0,
            on_track: goals.filter(g => g.progress >= 70).length,
            at_risk: goals.filter(g => g.progress < 70 && g.progress >= 40).length,
            off_track: goals.filter(g => g.progress < 40).length,
        };
        return { success: true, data: report };
    }
    async getKeyResults(goal_id, org_id) {
        const goal = await this.goalRepository.findOne({ where: { id: goal_id, org_id } });
        if (!goal) {
            throw new common_1.NotFoundException('Goal not found');
        }
        return { success: true, data: goal.key_results || [] };
    }
    async createKeyResult(org_id, createDto) {
        const goal = await this.goalRepository.findOne({ where: { id: createDto.goal_id, org_id } });
        if (!goal) {
            throw new common_1.NotFoundException('Goal not found');
        }
        const keyResult = {
            id: (0, crypto_1.randomUUID)(),
            title: createDto.title,
            target: Number(createDto.target || 0),
            current: Number(createDto.current || 0),
            unit: createDto.unit || '',
        };
        goal.key_results = [...(goal.key_results || []), keyResult];
        await this.goalRepository.save(goal);
        return { success: true, data: keyResult };
    }
    async updateKeyResultById(org_id, key_result_id, updateDto) {
        const goals = await this.goalRepository.find({ where: { org_id } });
        const goal = goals.find((entry) => (entry.key_results || []).some((kr) => kr.id === key_result_id));
        if (!goal) {
            throw new common_1.NotFoundException('Key result not found');
        }
        goal.key_results = (goal.key_results || []).map((kr) => kr.id === key_result_id ? { ...kr, ...updateDto } : kr);
        await this.goalRepository.save(goal);
        return {
            success: true,
            data: (goal.key_results || []).find((kr) => kr.id === key_result_id),
        };
    }
    async deleteKeyResultById(org_id, key_result_id) {
        const goals = await this.goalRepository.find({ where: { org_id } });
        const goal = goals.find((entry) => (entry.key_results || []).some((kr) => kr.id === key_result_id));
        if (!goal) {
            throw new common_1.NotFoundException('Key result not found');
        }
        goal.key_results = (goal.key_results || []).filter((kr) => kr.id !== key_result_id);
        await this.goalRepository.save(goal);
        return { success: true, message: 'Key result deleted successfully' };
    }
};
exports.GoalsService = GoalsService;
exports.GoalsService = GoalsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(goal_entity_1.Goal)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        activity_log_service_1.ActivityLogService])
], GoalsService);
//# sourceMappingURL=goals.service.js.map