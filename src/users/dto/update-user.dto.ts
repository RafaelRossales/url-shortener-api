import { OmitType, PartialType } from '@nestjs/mapped-types';
import { UserEntityDto } from './user-entity.dto';

export class UpdateUserDto extends PartialType(
    OmitType(UserEntityDto, ['createdAt', 'updatedAt'] as const)
) {}
