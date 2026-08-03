import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.usersService.findAll(user.org_id);
  }

  @Get(':id')
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.usersService.findOne(id, user.org_id);
  }

  @Put(':id')
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() updateData: any) {
    return this.usersService.update(id, user.org_id, updateData);
  }
}
