import { PrismaService } from '../prisma.service';
export declare class StatsController {
    private prisma;
    constructor(prisma: PrismaService);
    leaderboard(): Promise<any[]>;
}
