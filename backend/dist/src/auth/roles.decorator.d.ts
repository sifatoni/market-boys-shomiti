export interface Role {
    ADMIN: string;
    MEMBER: string;
}
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: string[]) => import("@nestjs/common").CustomDecorator<string>;
