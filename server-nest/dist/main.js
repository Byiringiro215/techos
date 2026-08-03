"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: ['http://localhost:5173', 'http://localhost:3000'],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    app.setGlobalPrefix('api');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('TechOS API')
        .setDescription('The Operating System for Software Companies - Complete API Documentation')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('Auth', 'Authentication and authorization')
        .addTag('Projects', 'Project management')
        .addTag('Tasks', 'Task management with subtasks')
        .addTag('Sprints', 'Sprint planning and management')
        .addTag('Users', 'User management')
        .addTag('Organizations', 'Organization settings')
        .addTag('Meetings', 'Meeting management with participants')
        .addTag('Channels', 'Communication channels')
        .addTag('Messages', 'Real-time messaging')
        .addTag('Notifications', 'Real-time notifications')
        .addTag('CRM', 'Customer relationship management')
        .addTag('Finance', 'Financial management')
        .addTag('HR', 'Human resources')
        .addTag('Documents', 'Document management')
        .addTag('Calendar', 'Calendar and events')
        .addTag('Goals', 'Goals and OKRs')
        .addTag('Announcements', 'Company announcements')
        .addTag('Product', 'Product management')
        .addTag('Analytics', 'Analytics and insights')
        .addTag('Dashboards', 'Role-based dashboards')
        .addTag('Reports', 'Custom reports')
        .addTag('Integrations', 'External integrations')
        .addTag('AI Assistant', 'AI-powered assistant')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        customSiteTitle: 'TechOS API Documentation',
        customCss: '.swagger-ui .topbar { display: none }',
        swaggerOptions: {
            persistAuthorization: true,
            docExpansion: 'none',
            filter: true,
            showRequestDuration: true,
        },
    });
    const port = process.env.PORT || 4000;
    await app.listen(port);
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 TechOS Backend Server Started Successfully!         ║
║                                                           ║
║   📍 Server:        http://localhost:${port}                   ║
║   📚 API Docs:      http://localhost:${port}/api/docs          ║
║   🔧 Environment:   ${process.env.NODE_ENV || 'development'}                      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
}
bootstrap();
//# sourceMappingURL=main.js.map