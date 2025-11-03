import { VictimsService } from '../../src/victims/victims.service';

describe('VictimsService (unit)', () => {
  test('create calls prisma.victim.create with converted lastSeen', async () => {
    const created = { id: 1, name: 'V', lastSeen: new Date() };
    const mockPrisma: any = {
      victim: {
        create: jest.fn().mockResolvedValue(created),
        findMany: jest.fn().mockResolvedValue([created]),
        findUnique: jest.fn().mockResolvedValue(created),
        update: jest.fn().mockResolvedValue(created),
        delete: jest.fn().mockResolvedValue(created),
      },
    };
    const svc = new VictimsService(mockPrisma as any);
    const res = await svc.create({ name: 'V', skills: 's', lastSeen: '2025-01-01', status: 'captured', capturedBy: 1 });
    expect(mockPrisma.victim.create).toHaveBeenCalled();

    const list = await svc.findAll();
    expect(Array.isArray(list)).toBe(true);

    const byCapturer = await svc.findByCapturer(1);
    expect(Array.isArray(byCapturer)).toBe(true);

    const one = await svc.findOne(1);
    expect(one).toBeDefined();

    const upd = await svc.update(1, { status: 'transformed' });
    expect(upd).toHaveProperty('id');

    const del = await svc.remove(1);
    expect(del).toHaveProperty('id');
  });
});
