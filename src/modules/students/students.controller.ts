import { Body, Controller, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { StudentsService } from './students.service';
import { AuthGuard } from 'src/common/guard/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { CreateStudentDto } from './dto/create.students.dto';
import { Roles } from 'src/common/guard/decarator.roles';

@Controller('students')
@ApiBearerAuth()
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}
  @ApiOperation({ summary: `${Role.SUPERADMIN}, ${Role.ADMIN}` })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fullName: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
        birth_date: { type: 'string', example: '2026-01-02' },
        photo: { type: 'string', format: 'binary', nullable: true },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: memoryStorage(),
    }),
  )
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Post()
  createStudent(
    @Body() payload: CreateStudentDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.studentsService.createStudent(payload, file);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Get('all')
  getAllStudent() {
    return this.studentsService.getAllStudents();
  }

  @Get(':id')
  getOneStudent(@Param('id') id: string) {
    return this.studentsService.getOneStudent(+id);
  }
}
