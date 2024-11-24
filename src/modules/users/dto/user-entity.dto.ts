
import { IsDateString,IsString } from "class-validator";

export class UserEntityDto {

    @IsString()
    readonly id: string;

    @IsString()
    readonly name: string;

    @IsString()
    readonly email: string;

    @IsString()
    readonly password: string; 

    @IsDateString()
    readonly createdAt: Date;
    
    @IsDateString()
    readonly updatedAt: Date;
}
