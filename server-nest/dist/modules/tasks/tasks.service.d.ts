import { Repository } from 'typeorm';
import { Task } from '../../entities/task.entity';
import { Project } from '../../entities/project.entity';
import { User } from '../../entities/user.entity';
import { ActivityLogService } from '../../common/services/activity-log.service';
import { ProjectViewer } from '../../common/utils/project-visibility';
import { NotificationsService } from '../notifications/notifications.service';
export declare class TasksService {
    private tasksRepository;
    private projectsRepository;
    private usersRepository;
    private activityLogService;
    private notificationsService;
    constructor(tasksRepository: Repository<Task>, projectsRepository: Repository<Project>, usersRepository: Repository<User>, activityLogService: ActivityLogService, notificationsService: NotificationsService);
    private getAccessibleProjectIds;
    private assertProjectAccess;
    create(org_id: string, actor: any, createTaskDto: any): Promise<{
        success: boolean;
        data: any;
    }>;
    private parseAssigneeIds;
    private enrichTasks;
    private enrichTask;
    findAll(org_id: string, filters?: any, user?: ProjectViewer): Promise<{
        success: boolean;
        data: any[];
    }>;
    findOne(id: string, org_id: string, user?: ProjectViewer): Promise<{
        success: boolean;
        data: any;
    }>;
    update(id: string, org_id: string, updateTaskDto: any, actor?: any): Promise<{
        success: boolean;
        data: any;
    }>;
    remove(id: string, org_id: string, actor?: any): Promise<{
        success: boolean;
        message: string;
    }>;
    getSubtasks(task_id: string, org_id: string, user?: ProjectViewer): Promise<{
        success: boolean;
        data: any[];
    }>;
}
