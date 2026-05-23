import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(body: {
        email: string;
        pass: string;
    }): Promise<{
        access_token: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
    }>;
    register(body: any): Promise<{
        name: string;
        id: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.UserRole;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
