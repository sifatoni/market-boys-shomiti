export declare class EmailService {
    private readonly logger;
    private resend;
    constructor();
    sendMonthlyDueNotification(params: {
        to: string;
        memberName: string;
        memberNumber: string;
        dueAmount: number;
        dueDate: string;
        month: string;
        year: number;
    }): Promise<void>;
    sendDepositConfirmation(params: {
        to: string;
        memberName: string;
        memberNumber: string;
        amount: number;
        date: string;
        description?: string;
    }): Promise<void>;
}
