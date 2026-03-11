import { PartialType } from '@nestjs/swagger';
import { CreateTeacherDto } from './create.teachers.dto';

export class UpdateTeachersDto extends PartialType(CreateTeacherDto) {}
