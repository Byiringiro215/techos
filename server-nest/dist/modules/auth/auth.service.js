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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcryptjs"));
const crypto_1 = require("crypto");
const user_entity_1 = require("../../entities/user.entity");
const organization_entity_1 = require("../../entities/organization.entity");
let AuthService = class AuthService {
    usersRepository;
    organizationsRepository;
    jwtService;
    constructor(usersRepository, organizationsRepository, jwtService) {
        this.usersRepository = usersRepository;
        this.organizationsRepository = organizationsRepository;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const { email, password, firstName, lastName, role, organizationName } = registerDto;
        const existingUser = await this.usersRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new common_1.ConflictException('Email already exists');
        }
        let organization = await this.organizationsRepository.findOne({
            where: { slug: 'techos-company' }
        });
        if (!organization) {
            organization = this.organizationsRepository.create({
                id: (0, crypto_1.randomUUID)(),
                name: organizationName || 'TechOS Company',
                slug: 'techos-company',
            });
            await this.organizationsRepository.save(organization);
        }
        const password_hash = await bcrypt.hash(password, 10);
        const user = this.usersRepository.create({
            id: (0, crypto_1.randomUUID)(),
            org_id: organization.id,
            email,
            password_hash,
            first_name: firstName,
            last_name: lastName,
            role: role,
            status: 'active',
        });
        await this.usersRepository.save(user);
        const token = this.jwtService.sign({
            sub: user.id,
            email: user.email,
            org_id: user.org_id,
            role: user.role,
        });
        return {
            success: true,
            data: {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    role: user.role,
                    org_id: user.org_id,
                },
            },
        };
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.status !== 'active') {
            throw new common_1.UnauthorizedException('Account is not active');
        }
        const token = this.jwtService.sign({
            sub: user.id,
            email: user.email,
            org_id: user.org_id,
            role: user.role,
        });
        return {
            success: true,
            data: {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    role: user.role,
                    org_id: user.org_id,
                },
            },
        };
    }
    async getProfile(userId) {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
            relations: ['organization'],
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return {
            success: true,
            data: {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.role,
                avatar: user.avatar,
                org_id: user.org_id,
                organization: user.organization,
                preferences: user.preferences,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(organization_entity_1.Organization)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map