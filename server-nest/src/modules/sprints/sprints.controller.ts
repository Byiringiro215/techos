import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { SprintsService } from './sprints.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('sprints')
@UseGuards(JwtAuthGuard)
export class SprintsController {
  constructor(private sprintsService: SprintsService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() createSprintDto: any) {
    return this.sprintsService.create(user.org_id, createSprintDto);
  }

  @Get()
  findAll(@CurrentUser() user: any, @Query('project_id') project_id?: string) {
    return this.sprintsService.findAll(user.org_id, project_id);
  }

  @Get(':id')
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.sprintsService.findOne(id, user.org_id);
  }

  @Put(':id')
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() updateSprintDto: any) {
    return this.sprintsService.update(id, user.org_id, updateSprintDto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.sprintsService.remove(id, user.org_id);
  }
}
