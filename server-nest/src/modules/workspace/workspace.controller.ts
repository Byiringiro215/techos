import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceRecordDto } from './dto/create-workspace-record.dto';

@Controller('workspace')
@UseGuards(JwtAuthGuard)
export class WorkspaceController {
  constructor(private workspaceService: WorkspaceService) {}

  @Get('activity')
  listActivity(
    @CurrentUser() user: any,
    @Query('entity_type') entity_type?: string,
    @Query('entity_id') entity_id?: string,
    @Query('actor_id') actor_id?: string,
  ) {
    return this.workspaceService.listActivity(user.org_id, entity_type, entity_id, actor_id);
  }

  @Get(':type')
  list(@CurrentUser() user: any, @Param('type') type: string) {
    return this.workspaceService.list(user.org_id, type);
  }

  @Get(':type/:id')
  get(@CurrentUser() user: any, @Param('type') type: string, @Param('id') id: string) {
    return this.workspaceService.get(user.org_id, type, id);
  }

  @Post(':type')
  create(
    @CurrentUser() user: any,
    @Param('type') type: string,
    @Body() dto: CreateWorkspaceRecordDto,
  ) {
    return this.workspaceService.create(user.org_id, type, user, dto);
  }

  @Put(':type/:id')
  update(
    @CurrentUser() user: any,
    @Param('type') type: string,
    @Param('id') id: string,
    @Body() dto: CreateWorkspaceRecordDto,
  ) {
    return this.workspaceService.update(user.org_id, type, id, user, dto);
  }

  @Delete(':type/:id')
  remove(@CurrentUser() user: any, @Param('type') type: string, @Param('id') id: string) {
    return this.workspaceService.remove(user.org_id, type, id, user);
  }
}
