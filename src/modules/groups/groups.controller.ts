import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { Role } from '@prisma/client';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guard/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/guard/decarator.roles';
import { CreateGroupDto } from './dto/create-group.dto';

@Controller('groups')
@ApiBearerAuth()
export class GroupsController {
  constructor(private readonly groupService: GroupsService) {}

  @ApiOperation({
    summary: `${Role.SUPERADMIN}, ${Role.ADMIN}, ${Role.TEACHER}`,
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN', 'TEACHER')
  @Get('lesson/:groupId')
  getGroupLessons(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Req() req: Request,
  ) {
    return this.groupService.getGroupLessons(groupId, req['user']);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Get('all')
  getAllGroup() {
    return this.groupService.getAllGroup();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Post()
  createGroup(@Body() payload: CreateGroupDto, @Req() req: Request) {
    return this.groupService.createGroup(payload, req['user']);
  }
}
