import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guard/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/guard/decarator.roles';
import { CreateRoomDto } from './dto/create-room.dto';

@Controller('rooms')
@ApiBearerAuth()
export class RoomsController {
  constructor(private readonly roomService: RoomsService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Get('all')
  getAllRoom() {
    return this.roomService.getAllRoom();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Post()
  createRoom(@Body() payload: CreateRoomDto) {
    return this.roomService.createRoom(payload);
  }
}
