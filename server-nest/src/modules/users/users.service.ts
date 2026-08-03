import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(org_id: string) {
    const users = await this.usersRepository.find({ where: { org_id } });
    return { success: true, data: users };
  }

  async findOne(id: string, org_id: string) {
    const user = await this.usersRepository.findOne({ where: { id, org_id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { success: true, data: user };
  }

  async update(id: string, org_id: string, updateData: Partial<User>) {
    const user = await this.usersRepository.findOne({ where: { id, org_id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, updateData);
    await this.usersRepository.save(user);
    return { success: true, data: user };
  }
}
