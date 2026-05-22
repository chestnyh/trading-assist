import { z } from 'zod';

export type AnyZodSchema = z.ZodTypeAny;

export interface SchemaValidator<TSchema extends AnyZodSchema = AnyZodSchema> {
  schema: TSchema;
}

export function createSchemaValidator<TSchema extends AnyZodSchema>(
  schema: TSchema
): SchemaValidator<TSchema> {
  return { schema };
}
