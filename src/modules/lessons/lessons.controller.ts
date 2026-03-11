import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { AuthGuard } from 'src/common/guard/jwt-auth.guard';
import { Roles } from 'src/common/guard/decarator.roles';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonServise: LessonsService) {}

  @ApiOperation({
    summary: `${Role.SUPERADMIN}, ${Role.ADMIN}, ${Role.TEACHER}`,
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN', 'TEACHER')
  @Post()
  createStudentGroup(@Body() payload: CreateLessonDto, @Req() req: Request) {
    return this.lessonServise.createLesson(payload, req['user']);
  }
}
