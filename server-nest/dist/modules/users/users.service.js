"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcryptjs"));
const crypto_1 = require("crypto");
const user_entity_1 = require("../../entities/user.entity");
const employee_entity_1 = require("../../entities/employee.entity");
const workspace_service_1 = require("../workspace/workspace.service");
let UsersService = class UsersService {
    usersRepository;
    employeesRepository;
    workspaceService;
    constructor(usersRepository, employeesRepository, workspaceService) {
        this.usersRepository = usersRepository;
        this.employeesRepository = employeesRepository;
        this.workspaceService = workspaceService;
    }
    async findAll(org_id) {
        const users = await this.usersRepository.find({ where: { org_id } });
        return { success: true, data: users.map((user) => this.safeUser(user)) };
    }
    async findOne(id, org_id) {
        const user = await this.usersRepository.findOne({ where: { id, org_id } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return { success: true, data: this.safeUser(user) };
    }
    async update(id, org_id, actor, updateData) {
        const user = await this.usersRepository.findOne({ where: { id, org_id } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const isSelf = actor.id === id;
        const isCeo = actor.role === user_entity_1.UserRole.CEO;
        if (!isSelf && !isCeo) {
            throw new common_1.ForbiddenException('Only CEO can update other users');
        }
        if (!isCeo && (updateData.role || updateData.status)) {
            throw new common_1.ForbiddenException('Only CEO can update role or status');
        }
        Object.assign(user, updateData);
        await this.usersRepository.save(user);
        return { success: true, data: this.safeUser(user) };
    }
    async createByCeo(org_id, actor, dto) {
        if (actor.role !== user_entity_1.UserRole.CEO) {
            throw new common_1.ForbiddenException('Only CEO can invite users');
        }
        const email = dto.email.trim().toLowerCase();
        const existingUser = await this.usersRepository
            .createQueryBuilder('user')
            .where('LOWER(user.email) = LOWER(:email)', { email })
            .getOne();
        if (existingUser) {
            throw new common_1.ConflictException('A user with this email has already been invited');
        }
        const generatedPassword = this.generateTemporaryPassword();
        const password_hash = await bcrypt.hash(generatedPassword, 10);
        const user = this.usersRepository.create({
            id: (0, crypto_1.randomUUID)(),
            org_id,
            email,
            first_name: dto.firstName,
            last_name: dto.lastName,
            role: dto.role,
            status: 'active',
            password_hash,
        });
        try {
            await this.usersRepository.save(user);
        }
        catch (error) {
            if (error?.code === '23505' || String(error?.message || '').toLowerCase().includes('unique')) {
                throw new common_1.ConflictException('A user with this email has already been invited');
            }
            throw error;
        }
        const roleLabel = dto.role.replace(/_/g, ' ');
        const employee = this.employeesRepository.create({
            id: (0, crypto_1.randomUUID)(),
            org_id,
            user_id: user.id,
            department: roleLabel,
            position: (dto.position || '').trim() || roleLabel,
            employment_type: dto.employment_type || 'full-time',
            start_date: new Date().toISOString().slice(0, 10),
            status: dto.status || 'active',
            salary: dto.salary != null ? Number(dto.salary) : undefined,
        });
        await this.employeesRepository.save(employee);
        const displayName = `${dto.firstName} ${dto.lastName}`.trim();
        await this.workspaceService.recordActivity(org_id, 'employees', employee.id, 'created', `invited employee "${displayName}"`, actor);
        return {
            success: true,
            data: {
                user: this.safeUser(user),
                employee,
                temporary_password: generatedPassword,
            },
        };
    }
    async updateMyProfile(org_id, user_id, dto) {
        const user = await this.usersRepository.findOne({ where: { id: user_id, org_id } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (dto.first_name !== undefined)
            user.first_name = dto.first_name;
        if (dto.last_name !== undefined)
            user.last_name = dto.last_name;
        if (dto.avatar !== undefined)
            user.avatar = dto.avatar;
        await this.usersRepository.save(user);
        return { success: true, data: this.safeUser(user) };
    }
    async updateMyPassword(org_id, user_id, currentPassword, newPassword) {
        const user = await this.usersRepository.findOne({ where: { id: user_id, org_id } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const valid = await bcrypt.compare(currentPassword, user.password_hash);
        if (!valid) {
            throw new common_1.UnauthorizedException('Current password is incorrect');
        }
        user.password_hash = await bcrypt.hash(newPassword, 10);
        await this.usersRepository.save(user);
        return { success: true, message: 'Password updated successfully' };
    }
    safeUser(user) {
        const { password_hash, two_factor_secret, ...safe } = user;
        return safe;
    }
    generateTemporaryPassword() {
        const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
        let value = '';
        for (let i = 0; i < 20; i++) {
            value += alphabet[Math.floor(Math.random() * alphabet.length)];
        }
        return value;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        workspace_service_1.WorkspaceService])
], UsersService);
//# sourceMappingURL=users.service.js.map