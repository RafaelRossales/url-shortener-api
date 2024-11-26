import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignInDto {

    @IsString()
    @IsEmail()
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    readonly password: string; 
}
