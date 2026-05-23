declare const JwtStrategy_base: new (...args: unknown[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor();
    validate(payload: any): Promise<{
        userId: any;
        email: any;
        role: any;
    }>;
}
export {};
