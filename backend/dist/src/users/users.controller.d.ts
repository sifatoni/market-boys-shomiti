import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    resetPassword(id: string, body: {
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
    removeUser(id: string): Promise<{
        message: string;
    }>;
}
