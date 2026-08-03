import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Project } from '../../entities/project.entity';
import { Task } from '../../entities/task.entity';
import { Sprint } from '../../entities/sprint.entity';
import { Bug } from '../../entities/bug.entity';
import { Goal } from '../../entities/goal.entity';
import { Meeting } from '../../entities/meeting.entity';
import { Notification } from '../../entities/notification.entity';
import { Announcement } from '../../entities/announcement.entity';
import { Invoice } from '../../entities/invoice.entity';
import { Expense } from '../../entities/expense.entity';
import { LeaveRequest } from '../../entities/leave-request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      Task,
      Sprint,
      Bug,
      Goal,
      Meeting,
      Notification,
      Announcement,
      Invoice,
      Expense,
      LeaveRequest,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
