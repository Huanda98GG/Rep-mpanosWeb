import { VictimsService } from './victims.service';
import { CreateVictimDto } from './dto/create-victim.dto';
import { UpdateVictimDto } from './dto/update-victim.dto';
export declare class VictimsController {
    private svc;
    constructor(svc: VictimsService);
    create(body: CreateVictimDto, req: any): import(".prisma/client").Prisma.Prisma__VictimClient<{
        id: number;
        name: string;
        createdAt: Date;
        skills: string | null;
        lastSeen: Date | null;
        status: string;
        capturedBy: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    listAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        name: string;
        createdAt: Date;
        skills: string | null;
        lastSeen: Date | null;
        status: string;
        capturedBy: number;
    }[]>;
    myVictims(req: any): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        name: string;
        createdAt: Date;
        skills: string | null;
        lastSeen: Date | null;
        status: string;
        capturedBy: number;
    }[]>;
    get(id: string): import(".prisma/client").Prisma.Prisma__VictimClient<{
        id: number;
        name: string;
        createdAt: Date;
        skills: string | null;
        lastSeen: Date | null;
        status: string;
        capturedBy: number;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, body: UpdateVictimDto): import(".prisma/client").Prisma.Prisma__VictimClient<{
        id: number;
        name: string;
        createdAt: Date;
        skills: string | null;
        lastSeen: Date | null;
        status: string;
        capturedBy: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__VictimClient<{
        id: number;
        name: string;
        createdAt: Date;
        skills: string | null;
        lastSeen: Date | null;
        status: string;
        capturedBy: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
