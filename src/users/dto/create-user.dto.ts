
import { UserEntityDto } from "./user-entity.dto";
import { OmitType, PartialType } from "@nestjs/mapped-types";

export class CreateUserDto extends PartialType(
    OmitType(UserEntityDto, ['id', 'createdAt', 'updatedAt'] as const)
) {}
