import { PrismaService } from '../prisma.service';
export declare class FeedbackService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        author?: string;
        message: string;
    }): import(".prisma/client").Prisma.Prisma__FeedbackClient<{
        id: number;
        createdAt: Date;
        author: string | null;
        message: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        createdAt: Date;
        author: string | null;
        message: string;
    }[]>;
}
