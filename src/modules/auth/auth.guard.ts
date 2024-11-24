import {CanActivate, ExecutionContext, Injectable, UnauthorizedException }  from "@nestjs/common"
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from    'express';


@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector
    ) {}

    canActivate(context: ExecutionContext): boolean {
        const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
            context.getHandler(),
            context.getClass()
        ]);

        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const token = this.extractToken(request);

        if (!token) {
            throw new UnauthorizedException('Unauthorized access');
        }

        try {
            const payload = this.jwtService.verify(token,{
                secret:process.env.JWT_SECRET
            });
            request.user = payload;
            return true;
        } catch (error) {
            throw new UnauthorizedException('Unauthorized access');
        }
    }

    private extractToken(request:Request) {
        const [type, token] = request.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('Unauthorized access');
        }
        return type === 'Bearer ' ? token : null;
    }
}

