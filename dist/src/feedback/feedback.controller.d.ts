import { FeedbackService } from './feedback.service';
export declare class FeedbackController {
    private svc;
    constructor(svc: FeedbackService);
    create(body: any): import(".prisma/client").Prisma.Prisma__FeedbackClient<{
        id: number;
        createdAt: Date;
        author: string | null;
        message: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    list(): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        createdAt: Date;
        author: string | null;
        message: string;
    }[]>;
}
