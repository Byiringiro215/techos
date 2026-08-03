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
let SprintsService = class SprintsService {
    sprintsRepository;
    projectsRepository;
    constructor(sprintsRepository, projectsRepository) {
        this.sprintsRepository = sprintsRepository;
        this.projectsRepository = projectsRepository;
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
};
exports.SprintsService = SprintsService;
exports.SprintsService = SprintsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sprint_entity_1.Sprint)),
    __param(1, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SprintsService);
//# sourceMappingURL=sprints.service.js.map