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
var AuthService_1;
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
const employee_entity_1 = require("../../entities/employee.entity");
const notification_entity_1 = require("../../entities/notification.entity");
const channel_member_entity_1 = require("../../entities/channel-member.entity");
const meeting_participant_entity_1 = require("../../entities/meeting-participant.entity");
const SEEDED_CEO_EMAIL = 'ceo@gmail.com';
const SEEDED_CEO_PASSWORD = 'Ceo@2026';
const SEEDED_CISO_EMAIL = 'ciso@gmail.com';
const SEEDED_CISO_PASSWORD = 'Ciso@2026';
let AuthService = AuthService_1 = class AuthService {
    usersRepository;
    organizationsRepository;
    employeesRepository;
    notificationsRepository;
    channelMembersRepository;
    meetingParticipantsRepository;
    jwtService;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(usersRepository, organizationsRepository, employeesRepository, notificationsRepository, channelMembersRepository, meetingParticipantsRepository, jwtService) {
        this.usersRepository = usersRepository;
        this.organizationsRepository = organizationsRepository;
        this.employeesRepository = employeesRepository;
        this.notificationsRepository = notificationsRepository;
        this.channelMembersRepository = channelMembersRepository;
        this.meetingParticipantsRepository = meetingParticipantsRepository;
        this.jwtService = jwtService;
    }
    async onModuleInit() {
        await this.seedCeoAccount();
        await this.seedCisoAccount();
    }
    shouldKeepCeoOnly() {
        const flag = (process.env.SEED_CEO_ONLY || '').toLowerCase();
        return flag === 'true' || flag === '1';
    }
    async purgeNonCeoUsers(orgId) {
        if (!this.shouldKeepCeoOnly())
            return;
        const extras = await this.usersRepository.find({ where: { org_id: orgId } });
        const toRemove = extras.filter((u) => (u.email || '').toLowerCase() !== SEEDED_CEO_EMAIL);
        if (!toRemove.length)
            return;
        const ids = toRemove.map((u) => u.id);
        await this.employeesRepository.delete({ user_id: (0, typeorm_2.In)(ids) });
        await this.notificationsRepository.delete({ user_id: (0, typeorm_2.In)(ids) });
        await this.channelMembersRepository.delete({ user_id: (0, typeorm_2.In)(ids) });
        await this.meetingParticipantsRepository.delete({ user_id: (0, typeorm_2.In)(ids) });
        await this.usersRepository.delete({ id: (0, typeorm_2.In)(ids) });
        this.logger.warn(`Removed ${ids.length} non-CEO user(s) (SEED_CEO_ONLY bootstrap cleanup)`);
    }
    async seedCeoAccount() {
        let organization = await this.organizationsRepository.findOne({
            where: { slug: 'techos-company' },
        });
        if (!organization) {
            organization = this.organizationsRepository.create({
                id: (0, crypto_1.randomUUID)(),
                name: 'TechOS Company',
                slug: 'techos-company',
            });
            await this.organizationsRepository.save(organization);
            this.logger.log('Seeded organization: TechOS Company');
        }
        const existingCeo = await this.usersRepository.findOne({
            where: { email: SEEDED_CEO_EMAIL },
        });
        if (existingCeo) {
            existingCeo.password_hash = await bcrypt.hash(SEEDED_CEO_PASSWORD, 10);
            existingCeo.role = user_entity_1.UserRole.CEO;
            existingCeo.status = 'active';
            existingCeo.first_name = 'Alliance';
            existingCeo.last_name = '';
            existingCeo.name = 'Alliance';
            existingCeo.org_id = organization.id;
            await this.usersRepository.save(existingCeo);
            this.logger.log(`CEO account ready: ${SEEDED_CEO_EMAIL}`);
        }
        else {
            const password_hash = await bcrypt.hash(SEEDED_CEO_PASSWORD, 10);
            const ceo = this.usersRepository.create({
                id: (0, crypto_1.randomUUID)(),
                org_id: organization.id,
                email: SEEDED_CEO_EMAIL,
                password_hash,
                first_name: 'Alliance',
                last_name: '',
                name: 'Alliance',
                role: user_entity_1.UserRole.CEO,
                status: 'active',
            });
            await this.usersRepository.save(ceo);
            this.logger.log(`Seeded CEO account: ${SEEDED_CEO_EMAIL} / ${SEEDED_CEO_PASSWORD}`);
        }
        await this.purgeNonCeoUsers(organization.id);
    }
    async seedCisoAccount() {
        if (this.shouldKeepCeoOnly())
            return;
        const organization = await this.organizationsRepository.findOne({
            where: { slug: 'techos-company' },
        });
        if (!organization)
            return;
        const password_hash = await bcrypt.hash(SEEDED_CISO_PASSWORD, 10);
        const existing = await this.usersRepository.findOne({
            where: { email: SEEDED_CISO_EMAIL },
        });
        if (existing) {
            existing.password_hash = password_hash;
            existing.role = user_entity_1.UserRole.CISO;
            existing.status = 'active';
            existing.first_name = 'CISO';
            existing.last_name = 'User';
            existing.name = 'CISO User';
            existing.org_id = organization.id;
            await this.usersRepository.save(existing);
            this.logger.log(`CISO account ready: ${SEEDED_CISO_EMAIL}`);
            return;
        }
        const ciso = this.usersRepository.create({
            id: (0, crypto_1.randomUUID)(),
            org_id: organization.id,
            email: SEEDED_CISO_EMAIL,
            password_hash,
            first_name: 'CISO',
            last_name: 'User',
            name: 'CISO User',
            role: user_entity_1.UserRole.CISO,
            status: 'active',
        });
        await this.usersRepository.save(ciso);
        this.logger.log(`Seeded CISO account: ${SEEDED_CISO_EMAIL} / ${SEEDED_CISO_PASSWORD}`);
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
                    preferences: user.preferences,
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
                    preferences: user.preferences,
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
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(organization_entity_1.Organization)),
    __param(2, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __param(3, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __param(4, (0, typeorm_1.InjectRepository)(channel_member_entity_1.ChannelMember)),
    __param(5, (0, typeorm_1.InjectRepository)(meeting_participant_entity_1.MeetingParticipant)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map