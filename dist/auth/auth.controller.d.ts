import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        user: {
            id: any;
            email: any;
            name: any;
            lastName: any;
            role: any;
        };
        access_token: string;
    }>;
    register(registerDto: RegisterDto): Promise<{
        user: {
            id: any;
            email: any;
            name: any;
            lastName: any;
            role: any;
        };
        access_token: string;
    }>;
    me(req: any): Promise<import("../users/schemas/user.schema").User>;
}
