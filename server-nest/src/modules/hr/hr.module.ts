import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HrController } from './hr.controller';
import { HrService } from './hr.service';
import { Employee } from '../../entities/employee.entity';
import { LeaveRequest } from '../../entities/leave-request.entity';
import { User } from '../../entities/user.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, LeaveRequest, User]),
    NotificationsModule,
  ],
  controllers: [HrController],
  providers: [HrService],
  exports: [HrService],
})
export class HrModule {}
