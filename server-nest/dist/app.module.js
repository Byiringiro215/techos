"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const throttler_1 = require("@nestjs/throttler");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const entities_1 = require("./entities");
const common_module_1 = require("./common/common.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const organizations_module_1 = require("./modules/organizations/organizations.module");
const projects_module_1 = require("./modules/projects/projects.module");
const tasks_module_1 = require("./modules/tasks/tasks.module");
const sprints_module_1 = require("./modules/sprints/sprints.module");
const meetings_module_1 = require("./modules/meetings/meetings.module");
const channels_module_1 = require("./modules/channels/channels.module");
const messages_module_1 = require("./modules/messages/messages.module");
const crm_module_1 = require("./modules/crm/crm.module");
const finance_module_1 = require("./modules/finance/finance.module");
const hr_module_1 = require("./modules/hr/hr.module");
const documents_module_1 = require("./modules/documents/documents.module");
const calendar_module_1 = require("./modules/calendar/calendar.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const goals_module_1 = require("./modules/goals/goals.module");
const announcements_module_1 = require("./modules/announcements/announcements.module");
const product_module_1 = require("./modules/product/product.module");
const analytics_module_1 = require("./modules/analytics/analytics.module");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const integrations_module_1 = require("./modules/integrations/integrations.module");
const ai_module_1 = require("./modules/ai/ai.module");
const reports_module_1 = require("./modules/reports/reports.module");
const ciso_module_1 = require("./modules/ciso/ciso.module");
const workspace_module_1 = require("./modules/workspace/workspace.module");
function buildTypeOrmOptions(config) {
    const dbType = (config.get('DATABASE_TYPE') || 'sqlite').toLowerCase();
    const isDev = config.get('NODE_ENV') !== 'production';
    const synchronize = (config.get('DATABASE_SYNC') || (isDev ? 'true' : 'false')) === 'true';
    if (dbType === 'postgres' || dbType === 'postgresql') {
        return {
            type: 'postgres',
            host: config.get('DATABASE_HOST', 'localhost'),
            port: Number(config.get('DATABASE_PORT') || 5432),
            username: config.get('DATABASE_USER', 'techos'),
            password: config.get('DATABASE_PASSWORD', 'techos'),
            database: config.get('DATABASE_NAME', 'techos'),
            entities: entities_1.entities,
            synchronize,
            logging: isDev,
            retryAttempts: 10,
            retryDelay: 3000,
        };
    }
    return {
        type: 'sqlite',
        database: config.get('DATABASE_PATH', './techos.db'),
        entities: entities_1.entities,
        synchronize,
        logging: isDev,
    };
}
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => buildTypeOrmOptions(config),
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 100,
                },
            ]),
            common_module_1.CommonModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            organizations_module_1.OrganizationsModule,
            projects_module_1.ProjectsModule,
            tasks_module_1.TasksModule,
            sprints_module_1.SprintsModule,
            meetings_module_1.MeetingsModule,
            channels_module_1.ChannelsModule,
            messages_module_1.MessagesModule,
            crm_module_1.CrmModule,
            finance_module_1.FinanceModule,
            hr_module_1.HrModule,
            documents_module_1.DocumentsModule,
            calendar_module_1.CalendarModule,
            notifications_module_1.NotificationsModule,
            goals_module_1.GoalsModule,
            announcements_module_1.AnnouncementsModule,
            product_module_1.ProductModule,
            analytics_module_1.AnalyticsModule,
            dashboard_module_1.DashboardModule,
            integrations_module_1.IntegrationsModule,
            ai_module_1.AiModule,
            reports_module_1.ReportsModule,
            ciso_module_1.CisoModule,
            workspace_module_1.WorkspaceModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map