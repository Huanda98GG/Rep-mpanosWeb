import { PrismaService } from '../prisma.service';
export declare class RewardsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(title: string): import(".prisma/client").Prisma.Prisma__RewardClient<{
        id: number;
        createdAt: Date;
        title: string;
        awardedTo: number | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    list(): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        createdAt: Date;
        title: string;
        awardedTo: number | null;
    }[]>;
    assign(id: number, awardedTo: number): import(".prisma/client").Prisma.Prisma__RewardClient<{
        id: number;
        createdAt: Date;
        title: string;
        awardedTo: number | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    historyForUser(userId: number): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        createdAt: Date;
        title: string;
        awardedTo: number | null;
    }[]>;
}
