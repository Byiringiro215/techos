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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const crypto_1 = require("crypto");
const feature_entity_1 = require("../../entities/feature.entity");
const epic_entity_1 = require("../../entities/epic.entity");
const bug_entity_1 = require("../../entities/bug.entity");
const release_entity_1 = require("../../entities/release.entity");
const customer_feedback_entity_1 = require("../../entities/customer-feedback.entity");
const roadmap_entity_1 = require("../../entities/roadmap.entity");
const project_entity_1 = require("../../entities/project.entity");
const user_entity_1 = require("../../entities/user.entity");
const project_visibility_1 = require("../../common/utils/project-visibility");
const notifications_service_1 = require("../notifications/notifications.service");
let ProductService = class ProductService {
    featureRepository;
    epicRepository;
    bugRepository;
    releaseRepository;
    feedbackRepository;
    roadmapRepository;
    projectRepository;
    userRepository;
    notificationsService;
    constructor(featureRepository, epicRepository, bugRepository, releaseRepository, feedbackRepository, roadmapRepository, projectRepository, userRepository, notificationsService) {
        this.featureRepository = featureRepository;
        this.epicRepository = epicRepository;
        this.bugRepository = bugRepository;
        this.releaseRepository = releaseRepository;
        this.feedbackRepository = feedbackRepository;
        this.roadmapRepository = roadmapRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.notificationsService = notificationsService;
    }
    async createFeature(org_id, createDto) {
        const feature = this.featureRepository.create({
            id: (0, crypto_1.randomUUID)(),
            org_id,
            ...createDto,
            status: createDto.status || 'backlog',
            priority: createDto.priority || 'medium',
            votes: 0,
        });
        await this.featureRepository.save(feature);
        return { success: true, data: feature };
    }
    async findAllFeatures(org_id, filters) {
        const query = this.featureRepository.createQueryBuilder('feature')
            .where('feature.org_id = :org_id', { org_id });
        if (filters?.status)
            query.andWhere('feature.status = :status', { status: filters.status });
        if (filters?.priority)
            query.andWhere('feature.priority = :priority', { priority: filters.priority });
        if (filters?.epic_id)
            query.andWhere('feature.epic_id = :epic_id', { epic_id: filters.epic_id });
        if (filters?.release_id)
            query.andWhere('feature.release_id = :release_id', { release_id: filters.release_id });
        query.orderBy('feature.votes', 'DESC').addOrderBy('feature.created_at', 'DESC');
        const features = await query.getMany();
        return { success: true, data: features };
    }
    async findOneFeature(id, org_id) {
        const feature = await this.featureRepository.findOne({ where: { id, org_id } });
        if (!feature)
            throw new common_1.NotFoundException('Feature not found');
        return { success: true, data: feature };
    }
    async updateFeature(id, org_id, updateDto) {
        const feature = await this.featureRepository.findOne({ where: { id, org_id } });
        if (!feature)
            throw new common_1.NotFoundException('Feature not found');
        Object.assign(feature, updateDto);
        await this.featureRepository.save(feature);
        return { success: true, data: feature };
    }
    async removeFeature(id, org_id) {
        const feature = await this.featureRepository.findOne({ where: { id, org_id } });
        if (!feature)
            throw new common_1.NotFoundException('Feature not found');
        await this.featureRepository.remove(feature);
        return { success: true, message: 'Feature deleted successfully' };
    }
    async voteFeature(id, org_id) {
        const feature = await this.featureRepository.findOne({ where: { id, org_id } });
        if (!feature)
            throw new common_1.NotFoundException('Feature not found');
        feature.votes += 1;
        await this.featureRepository.save(feature);
        return { success: true, data: feature };
    }
    async createEpic(org_id, createDto) {
        const epic = this.epicRepository.create({
            id: (0, crypto_1.randomUUID)(),
            org_id,
            ...createDto,
            status: createDto.status || 'planned',
            progress: 0,
        });
        await this.epicRepository.save(epic);
        return { success: true, data: epic };
    }
    async findAllEpics(org_id, filters) {
        const query = this.epicRepository.createQueryBuilder('epic')
            .where('epic.org_id = :org_id', { org_id });
        if (filters?.status)
            query.andWhere('epic.status = :status', { status: filters.status });
        query.orderBy('epic.created_at', 'DESC');
        const epics = await query.getMany();
        return { success: true, data: epics };
    }
    async findOneEpic(id, org_id) {
        const epic = await this.epicRepository.findOne({ where: { id, org_id } });
        if (!epic)
            throw new common_1.NotFoundException('Epic not found');
        const features = await this.featureRepository.find({ where: { epic_id: id, org_id } });
        return { success: true, data: { ...epic, features } };
    }
    async updateEpic(id, org_id, updateDto) {
        const epic = await this.epicRepository.findOne({ where: { id, org_id } });
        if (!epic)
            throw new common_1.NotFoundException('Epic not found');
        Object.assign(epic, updateDto);
        await this.epicRepository.save(epic);
        return { success: true, data: epic };
    }
    async removeEpic(id, org_id) {
        const epic = await this.epicRepository.findOne({ where: { id, org_id } });
        if (!epic)
            throw new common_1.NotFoundException('Epic not found');
        await this.epicRepository.remove(epic);
        return { success: true, message: 'Epic deleted successfully' };
    }
    async createBug(org_id, reporter_id, createDto) {
        if (createDto.project_id) {
            const project = await this.projectRepository.findOne({
                where: { id: createDto.project_id, org_id },
            });
            if (!project)
                throw new common_1.NotFoundException('Project not found');
        }
        const bug = this.bugRepository.create({
            id: (0, crypto_1.randomUUID)(),
            org_id,
            reporter_id,
            title: createDto.title,
            description: createDto.description || createDto.steps_to_reproduce || createDto.title,
            status: createDto.status || 'open',
            severity: createDto.severity || createDto.priority || 'medium',
            priority: createDto.priority || createDto.severity || 'medium',
            project_id: createDto.project_id || null,
            assignee_id: createDto.assignee_id || null,
            steps_to_reproduce: createDto.steps_to_reproduce || null,
            expected_behavior: createDto.expected_behavior || null,
            actual_behavior: createDto.actual_behavior || null,
            environment: createDto.environment || null,
        });
        await this.bugRepository.save(bug);
        if (bug.assignee_id && bug.assignee_id !== reporter_id) {
            const reporter = await this.userRepository.findOne({ where: { id: reporter_id } }).catch(() => null);
            const reporterName = reporter
                ? `${reporter.first_name || ''} ${reporter.last_name || ''}`.trim() || reporter.email
                : 'Someone';
            this.notificationsService.create(org_id, {
                user_id: bug.assignee_id,
                type: 'bug_assigned',
                title: 'Bug Assigned to You',
                message: `${reporterName} assigned bug "${bug.title}" to you`,
                link: `/bugs`,
                metadata: { bug_id: bug.id },
            }).catch(() => null);
        }
        return { success: true, data: await this.enrichBug(bug) };
    }
    async enrichBugs(bugs) {
        if (!bugs.length)
            return [];
        const projectIds = [...new Set(bugs.map((b) => b.project_id).filter(Boolean))];
        const userIds = [
            ...new Set(bugs.flatMap((b) => [b.assignee_id, b.reporter_id].filter(Boolean))),
        ];
        const [projects, users] = await Promise.all([
            projectIds.length
                ? this.projectRepository.find({ where: { id: (0, typeorm_2.In)(projectIds) } })
                : Promise.resolve([]),
            userIds.length
                ? this.userRepository.find({ where: { id: (0, typeorm_2.In)(userIds) } })
                : Promise.resolve([]),
        ]);
        const projectName = Object.fromEntries(projects.map((p) => [p.id, p.name]));
        const userName = Object.fromEntries(users.map((u) => [
            u.id,
            u.name || `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email,
        ]));
        return bugs.map((b) => ({
            ...b,
            project_name: b.project_id ? projectName[b.project_id] || null : null,
            assignee_name: b.assignee_id ? userName[b.assignee_id] || null : null,
            reporter_name: b.reporter_id ? userName[b.reporter_id] || null : null,
        }));
    }
    async enrichBug(bug) {
        const [enriched] = await this.enrichBugs([bug]);
        return enriched;
    }
    async findAllBugs(org_id, filters, user) {
        const query = this.bugRepository.createQueryBuilder('bug')
            .where('bug.org_id = :org_id', { org_id });
        if (filters?.status)
            query.andWhere('bug.status = :status', { status: filters.status });
        if (filters?.severity)
            query.andWhere('bug.severity = :severity', { severity: filters.severity });
        if (filters?.priority)
            query.andWhere('bug.priority = :priority', { priority: filters.priority });
        if (filters?.assignee_id)
            query.andWhere('bug.assignee_id = :assignee_id', { assignee_id: filters.assignee_id });
        if (filters?.project_id)
            query.andWhere('bug.project_id = :project_id', { project_id: filters.project_id });
        query.orderBy('bug.priority', 'DESC').addOrderBy('bug.created_at', 'DESC');
        let bugs = await query.getMany();
        const role = String(user?.role || '').toLowerCase();
        if (role && role !== 'ceo') {
            const projects = await this.projectRepository.find({ where: { org_id } });
            const allowed = new Set(projects.filter((p) => (0, project_visibility_1.canViewProject)(p, user)).map((p) => p.id));
            bugs = bugs.filter((b) => !b.project_id || allowed.has(b.project_id));
        }
        return { success: true, data: await this.enrichBugs(bugs) };
    }
    async findOneBug(id, org_id) {
        const bug = await this.bugRepository.findOne({ where: { id, org_id } });
        if (!bug)
            throw new common_1.NotFoundException('Bug not found');
        return { success: true, data: await this.enrichBug(bug) };
    }
    async updateBug(id, org_id, updateDto) {
        const bug = await this.bugRepository.findOne({ where: { id, org_id } });
        if (!bug)
            throw new common_1.NotFoundException('Bug not found');
        Object.assign(bug, updateDto);
        await this.bugRepository.save(bug);
        return { success: true, data: bug };
    }
    async removeBug(id, org_id) {
        const bug = await this.bugRepository.findOne({ where: { id, org_id } });
        if (!bug)
            throw new common_1.NotFoundException('Bug not found');
        await this.bugRepository.remove(bug);
        return { success: true, message: 'Bug deleted successfully' };
    }
    async createRelease(org_id, createDto) {
        const release = this.releaseRepository.create({
            id: (0, crypto_1.randomUUID)(),
            org_id,
            ...createDto,
            status: createDto.status || 'planned',
        });
        await this.releaseRepository.save(release);
        return { success: true, data: release };
    }
    async findAllReleases(org_id, filters) {
        const query = this.releaseRepository.createQueryBuilder('release')
            .where('release.org_id = :org_id', { org_id });
        if (filters?.status)
            query.andWhere('release.status = :status', { status: filters.status });
        query.orderBy('release.release_date', 'DESC');
        const releases = await query.getMany();
        return { success: true, data: releases };
    }
    async findOneRelease(id, org_id) {
        const release = await this.releaseRepository.findOne({ where: { id, org_id } });
        if (!release)
            throw new common_1.NotFoundException('Release not found');
        const features = await this.featureRepository.find({ where: { release_id: id, org_id } });
        return { success: true, data: { ...release, features } };
    }
    async updateRelease(id, org_id, updateDto) {
        const release = await this.releaseRepository.findOne({ where: { id, org_id } });
        if (!release)
            throw new common_1.NotFoundException('Release not found');
        Object.assign(release, updateDto);
        await this.releaseRepository.save(release);
        return { success: true, data: release };
    }
    async removeRelease(id, org_id) {
        const release = await this.releaseRepository.findOne({ where: { id, org_id } });
        if (!release)
            throw new common_1.NotFoundException('Release not found');
        await this.releaseRepository.remove(release);
        return { success: true, message: 'Release deleted successfully' };
    }
    async createFeedback(org_id, createDto) {
        const feedback = this.feedbackRepository.create({
            id: (0, crypto_1.randomUUID)(),
            org_id,
            ...createDto,
            status: createDto.status || 'new',
            type: createDto.type || 'feature_request',
        });
        await this.feedbackRepository.save(feedback);
        return { success: true, data: feedback };
    }
    async findAllFeedback(org_id, filters) {
        const query = this.feedbackRepository.createQueryBuilder('feedback')
            .where('feedback.org_id = :org_id', { org_id });
        if (filters?.type)
            query.andWhere('feedback.type = :type', { type: filters.type });
        if (filters?.status)
            query.andWhere('feedback.status = :status', { status: filters.status });
        if (filters?.contact_id)
            query.andWhere('feedback.contact_id = :contact_id', { contact_id: filters.contact_id });
        query.orderBy('feedback.created_at', 'DESC');
        const feedbacks = await query.getMany();
        return { success: true, data: feedbacks };
    }
    async findOneFeedback(id, org_id) {
        const feedback = await this.feedbackRepository.findOne({ where: { id, org_id } });
        if (!feedback)
            throw new common_1.NotFoundException('Feedback not found');
        return { success: true, data: feedback };
    }
    async updateFeedback(id, org_id, updateDto) {
        const feedback = await this.feedbackRepository.findOne({ where: { id, org_id } });
        if (!feedback)
            throw new common_1.NotFoundException('Feedback not found');
        Object.assign(feedback, updateDto);
        await this.feedbackRepository.save(feedback);
        return { success: true, data: feedback };
    }
    async removeFeedback(id, org_id) {
        const feedback = await this.feedbackRepository.findOne({ where: { id, org_id } });
        if (!feedback)
            throw new common_1.NotFoundException('Feedback not found');
        await this.feedbackRepository.remove(feedback);
        return { success: true, message: 'Feedback deleted successfully' };
    }
    async createRoadmap(org_id, createDto) {
        const roadmap = this.roadmapRepository.create({
            id: (0, crypto_1.randomUUID)(),
            org_id,
            ...createDto,
            status: createDto.status || 'active',
            type: createDto.type || 'product',
            items: createDto.items || [],
        });
        await this.roadmapRepository.save(roadmap);
        return { success: true, data: roadmap };
    }
    async findAllRoadmaps(org_id, filters) {
        const query = this.roadmapRepository.createQueryBuilder('roadmap')
            .where('roadmap.org_id = :org_id', { org_id });
        if (filters?.type)
            query.andWhere('roadmap.type = :type', { type: filters.type });
        if (filters?.status)
            query.andWhere('roadmap.status = :status', { status: filters.status });
        query.orderBy('roadmap.created_at', 'DESC');
        const roadmaps = await query.getMany();
        return { success: true, data: roadmaps };
    }
    async findOneRoadmap(id, org_id) {
        const roadmap = await this.roadmapRepository.findOne({ where: { id, org_id } });
        if (!roadmap)
            throw new common_1.NotFoundException('Roadmap not found');
        return { success: true, data: roadmap };
    }
    async updateRoadmap(id, org_id, updateDto) {
        const roadmap = await this.roadmapRepository.findOne({ where: { id, org_id } });
        if (!roadmap)
            throw new common_1.NotFoundException('Roadmap not found');
        Object.assign(roadmap, updateDto);
        await this.roadmapRepository.save(roadmap);
        return { success: true, data: roadmap };
    }
    async removeRoadmap(id, org_id) {
        const roadmap = await this.roadmapRepository.findOne({ where: { id, org_id } });
        if (!roadmap)
            throw new common_1.NotFoundException('Roadmap not found');
        await this.roadmapRepository.remove(roadmap);
        return { success: true, message: 'Roadmap deleted successfully' };
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(feature_entity_1.Feature)),
    __param(1, (0, typeorm_1.InjectRepository)(epic_entity_1.Epic)),
    __param(2, (0, typeorm_1.InjectRepository)(bug_entity_1.Bug)),
    __param(3, (0, typeorm_1.InjectRepository)(release_entity_1.Release)),
    __param(4, (0, typeorm_1.InjectRepository)(customer_feedback_entity_1.CustomerFeedback)),
    __param(5, (0, typeorm_1.InjectRepository)(roadmap_entity_1.Roadmap)),
    __param(6, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __param(7, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notifications_service_1.NotificationsService])
], ProductService);
//# sourceMappingURL=product.service.js.map