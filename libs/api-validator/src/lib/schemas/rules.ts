import { z } from 'zod';
import { createSchemaValidator } from '../core';

const RuleBodySchema = z.union([
  z.record(z.string(), z.unknown()),
  z.string().transform((val, ctx) => {
    try {
      const parsed: unknown = JSON.parse(val);
      const recordResult = z.record(z.string(), z.unknown()).safeParse(parsed);
      if (!recordResult.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid ruleBody JSON',
          path: ['ruleBody'],
        });
        return z.NEVER;
      }

      return recordResult.data;
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid ruleBody JSON',
        path: ['ruleBody'],
      });
      return z.NEVER;
    }
  }),
]);

export const CreateRuleDtoSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  ruleBody: RuleBodySchema,
});

export const UpdateRuleDtoSchema = CreateRuleDtoSchema.partial();

export const RuleResponseDtoSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string(),
  ruleBody: z.unknown(),
  authorId: z.number().int(),
});

export const PaginatedRulesDtoSchema = z.object({
  rules: z.array(RuleResponseDtoSchema),
  total: z.number().int(),
});

export const CreateRuleDtoSchemaValidator = createSchemaValidator(CreateRuleDtoSchema);
export const UpdateRuleDtoSchemaValidator = createSchemaValidator(UpdateRuleDtoSchema);
