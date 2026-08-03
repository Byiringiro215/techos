import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { User, UserRole } from '../../entities/user.entity';
import { Organization } from '../../entities/organization.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Organization)
    private organizationsRepository: Repository<Organization>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName, role, organizationName } = registerDto;

    // Check if user exists
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Get or create the single organization
    let organization = await this.organizationsRepository.findOne({
      where: { slug: 'techos-company' } // Single organization for all users
    });

    if (!organization) {
      // Create organization if it doesn't exist (first user registration)
      organization = this.organizationsRepository.create({
        id: randomUUID(),
        name: organizationName || 'TechOS Company',
        slug: 'techos-company',
      });
      await this.organizationsRepository.save(organization);
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Create user with selected role
    const user = this.usersRepository.create({
      id: randomUUID(),
      org_id: organization.id,
      email,
      password_hash,
      first_name: firstName,
      last_name: lastName,
      role: role, // Use the role provided by user
      status: 'active',
    });
    await this.usersRepository.save(user);

    // Generate token
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

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (user.status !== 'active') {
      throw new UnauthorizedException('Account is not active');
    }

    // Generate token
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

  async getProfile(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['organization'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
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
}
