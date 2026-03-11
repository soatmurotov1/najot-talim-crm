import { Injectable, NotFoundException } from '@nestjs/common';
import { MailerService } from 'src/common/email/mailer.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { CreateStudentDto } from './dto/create.students.dto';
import { hashPassword } from 'src/common/bcrypt/bcrypt';
import { UpdateStudentDto } from './dto/update.students.dto';

@Injectable()
export class StudentsService {
  constructor(
    private prisma: PrismaService,
    private mailerService: MailerService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async createStudent(payload: CreateStudentDto, file?: Express.Multer.File) {
    let photoUrl: string | null = null;

    if (file) {
      photoUrl = await this.cloudinaryService.uploadFile(file, 'students');
    }

    await this.prisma.student.create({
      data: {
        ...payload,
        password: await hashPassword(payload.password),
        photo: photoUrl,
        birth_date: new Date(payload.birth_date),
      },
    });

    await this.mailerService.sendEmail(
      payload.email,
      payload.email,
      payload.password,
    );

    return {
      success: true,
      message: 'Student successfully created',
    };
  }

  async getAllStudents() {
    const Students = await this.prisma.student.findMany();

    return {
      success: true,
      data: Students,
    };
  }

  async getOneStudent(id: number) {
    const Student = await this.prisma.student.findUnique({ where: { id } });
    if (!Student) {
      throw new NotFoundException('Student is Not found');
    }

    return {
      success: true,
      data: Student,
    };
  }

  async updateStudent(id: number, payload: UpdateStudentDto) {
    const Student = await this.prisma.student.findUnique({ where: { id } });
    if (!Student) {
      throw new NotFoundException('Student is Not found');
    }
    await this.prisma.student.update({ where: { id }, data: payload });

    return {
      success: true,
      message: 'Student updated successfully',
    };
  }

  async deleteStudent(id: number) {
    const Student = await this.prisma.student.findUnique({ where: { id } });
    if (!Student) {
      throw new NotFoundException('Student is Not found');
    }
    await this.prisma.student.delete({ where: { id } });
  }
}
