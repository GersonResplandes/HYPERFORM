import { z } from 'zod';

const createEnrollmentSchema = z.object({
  student_id: z.string().uuid(),
  plan_id: z.string().uuid(),
  start_date: z.coerce.date(),
  user_id: z.string().uuid(),
});

describe('createEnrollmentSchema', () => {
  it('valida dados válidos', () => {
    const data = {
      student_id: 'a3e1b2c4-5d6f-4a7b-8c9d-0e1f2a3b4c5d',
      plan_id: 'b4e2c3d5-6e7f-5b8c-9d0e-1f2a3b4c5d6e',
      start_date: '2024-08-01T00:00:00.000Z',
      user_id: '550e8400-e29b-41d4-a716-446655440000',
    };

    const parsed = createEnrollmentSchema.safeParse(data);
    expect(parsed.success).toBe(true);
  });

  it('rejeita UUID inválido', () => {
    const data = {
      student_id: 'invalid-uuid',
      plan_id: 'b4e2c3d5-6e7f-5b8c-9d0e-1f2a3b4c5d6e',
      start_date: '2024-08-01T00:00:00.000Z',
      user_id: '550e8400-e29b-41d4-a716-446655440000',
    };

    const parsed = createEnrollmentSchema.safeParse(data);
    expect(parsed.success).toBe(false);
  });

  it('rejeita data inválida', () => {
    const data = {
      student_id: 'a3e1b2c4-5d6f-4a7b-8c9d-0e1f2a3b4c5d',
      plan_id: 'b4e2c3d5-6e7f-5b8c-9d0e-1f2a3b4c5d6e',
      start_date: 'invalid-date',
      user_id: '550e8400-e29b-41d4-a716-446655440000',
    };

    const parsed = createEnrollmentSchema.safeParse(data);
    expect(parsed.success).toBe(false);
  });
});
