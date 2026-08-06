import { OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../entities/user.entity';
import { Organization } from '../../entities/organization.entity';
import { Employee } from '../../entities/employee.entity';
import { Notification } from '../../entities/notification.entity';
import { ChannelMember } from '../../entities/channel-member.entity';
import { MeetingParticipant } from '../../entities/meeting-participant.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService implements OnModuleInit {
    private usersRepository;
    private organizationsRepository;
    private employeesRepository;
    private notificationsRepository;
    private channelMembersRepository;
    private meetingParticipantsRepository;
    private jwtService;
    private readonly logger;
    constructor(usersRepository: Repository<User>, organizationsRepository: Repository<Organization>, employeesRepository: Repository<Employee>, notificationsRepository: Repository<Notification>, channelMembersRepository: Repository<ChannelMember>, meetingParticipantsRepository: Repository<MeetingParticipant>, jwtService: JwtService);
    onModuleInit(): Promise<void>;
    private shouldKeepCeoOnly;
    private purgeNonCeoUsers;
    private seedCeoAccount;
    register(registerDto: RegisterDto): Promise<{
        success: boolean;
        data: {
            token: string;
            user: {
                id: string;
                email: string;
                first_name: string;
                last_name: string;
                role: UserRole;
                org_id: string;
                preferences: any;
            };
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        success: boolean;
        data: {
            token: string;
            user: {
                id: string;
                email: string;
                first_name: string;
                last_name: string;
                role: UserRole;
                org_id: string;
                preferences: any;
            };
        };
    }>;
    getProfile(userId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            email: string;
            first_name: string;
            last_name: string;
            role: UserRole;
            avatar: string;
            org_id: string;
            organization: Organization;
            preferences: any;
        };
    }>;
}
