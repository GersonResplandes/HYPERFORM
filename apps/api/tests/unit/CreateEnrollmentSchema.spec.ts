import { z } from 'zod';

const uuidRegex =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
const createEnrollmentSchema = z.object({
  student_id: z.string().regex(uuidRegex, 'Invalid UUID'),
  plan_id: z.string().regex(uuidRegex, 'Invalid UUID'),
  start_date: z.coerce.date(),
});

describe('createEnrollmentSchema', () => {
  it('valida dados válidos', () => {
    const data = {
      student_id: 'a3e1b2c4-5d6f-4a7b-8c9d-0e1f2a3b4c5d',
      plan_id: 'b4c5d6e7-8f9a-4b1c-2d3e-4f5a6b7c8d9e',
      start_date: '2024-08-01T00:00:00.000Z',
    };
    const parsed = createEnrollmentSchema.safeParse(data);
    expect(parsed.success).toBe(true);
  });

  it('rejeita UUID inválido', () => {
    const data = {
      student_id: 'invalido',
      plan_id: 'b4c5d6e7-8f9a-4b1c-2d3e-4f5a6b7c8d9e',
      start_date: '2024-08-01T00:00:00.000Z',
    };
    const parsed = createEnrollmentSchema.safeParse(data);
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0].message).toMatch(/Invalid UUID/);
    }
  });
});
