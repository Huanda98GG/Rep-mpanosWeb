import { PrismaService } from '../prisma.service';
export declare class VictimsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        name: string;
        skills?: string;
        lastSeen?: string;
        status?: string;
        capturedBy: number;
    }): import(".prisma/client").Prisma.Prisma__VictimClient<{
        id: number;
        name: string;
        createdAt: Date;
        skills: string | null;
        lastSeen: Date | null;
        status: string;
        capturedBy: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        name: string;
        createdAt: Date;
        skills: string | null;
        lastSeen: Date | null;
        status: string;
        capturedBy: number;
    }[]>;
    findByCapturer(userId: number): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        name: string;
        createdAt: Date;
        skills: string | null;
        lastSeen: Date | null;
        status: string;
        capturedBy: number;
    }[]>;
    findOne(id: number): import(".prisma/client").Prisma.Prisma__VictimClient<{
        id: number;
        name: string;
        createdAt: Date;
        skills: string | null;
        lastSeen: Date | null;
        status: string;
        capturedBy: number;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: number, data: any): import(".prisma/client").Prisma.Prisma__VictimClient<{
        id: number;
        name: string;
        createdAt: Date;
        skills: string | null;
        lastSeen: Date | null;
        status: string;
        capturedBy: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: number): import(".prisma/client").Prisma.Prisma__VictimClient<{
        id: number;
        name: string;
        createdAt: Date;
        skills: string | null;
        lastSeen: Date | null;
        status: string;
        capturedBy: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
