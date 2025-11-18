import { JwtService } from '@nestjs/jwt';
import { Role } from '../common/enums/role.enum';
interface DevLoginDto {
    userId: string;
    role: Role;
}
export declare class DevAuthController {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    login(body: DevLoginDto): {
        access_token: string;
    };
}
export {};
