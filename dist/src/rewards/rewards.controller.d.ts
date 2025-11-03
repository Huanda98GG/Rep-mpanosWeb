import { RewardsService } from './rewards.service';
import { CreateRewardDto } from './create-reward.dto';
import { AssignRewardDto } from './assign-reward.dto';
export declare class RewardsController {
    private svc;
    constructor(svc: RewardsService);
    create(body: CreateRewardDto): import(".prisma/client").Prisma.Prisma__RewardClient<{
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
    assign(id: string, body: AssignRewardDto): import(".prisma/client").Prisma.Prisma__RewardClient<{
        id: number;
        createdAt: Date;
        title: string;
        awardedTo: number | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    history(id: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        createdAt: Date;
        title: string;
        awardedTo: number | null;
    }[]>;
}
