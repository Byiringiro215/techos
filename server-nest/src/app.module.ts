import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Import all entities
import { entities } from './entities';

// Import common module
import { CommonModule } from './common/common.module';

// Import all modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { SprintsModule } from './modules/sprints/sprints.module';
import { MeetingsModule } from './modules/meetings/meetings.module';
import { ChannelsModule } from './modules/channels/channels.module';
import { MessagesModule } from './modules/messages/messages.module';
import { CrmModule } from './modules/crm/crm.module';
import { FinanceModule } from './modules/finance/finance.module';
import { HrModule } from './modules/hr/hr.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { GoalsModule } from './modules/goals/goals.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { ProductModule } from './modules/product/product.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import { AiModule } from './modules/ai/ai.module';
import { ReportsModule } from './modules/reports/reports.module';

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // Database
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DATABASE_PATH || './techos.db',
      entities: entities,
      synchronize: true, // Set to false in production
      logging: process.env.NODE_ENV === 'development',
    }),
    
    // Rate limiting
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    
    // Common services
    CommonModule,
    
    // Feature modules
    AuthModule,
    UsersModule,
    OrganizationsModule,
    ProjectsModule,
    TasksModule,
    SprintsModule,
    MeetingsModule,
    ChannelsModule,
    MessagesModule,
    CrmModule,
    FinanceModule,
    HrModule,
    DocumentsModule,
    CalendarModule,
    NotificationsModule,
    GoalsModule,
    AnnouncementsModule,
    ProductModule,
    AnalyticsModule,
    DashboardModule,
    IntegrationsModule,
    AiModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
