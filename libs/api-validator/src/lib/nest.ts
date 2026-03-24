import 'reflect-metadata';
import {
  BadRequestException,
  Injectable,
  type ArgumentMetadata,
  type PipeTransform,
} from '@nestjs/common';
import { z } from 'zod';

import type { SchemaValidator } from './core';

const VALIDATOR_METADATA_KEY = 'trading-bot:api-validator:schema-validator';

export function Validate(validator: SchemaValidator): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(VALIDATOR_METADATA_KEY, validator, target);
  };
}

export function getSchemaValidator(metatype: unknown): SchemaValidator | null {
  if (!metatype || typeof metatype !== 'function') return null;
  return (
    (Reflect.getMetadata(VALIDATOR_METADATA_KEY, metatype) as
      | SchemaValidator
      | undefined) ?? null
  );
}

@Injectable()
export class SchemaValidationPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata): unknown {
    const validator = getSchemaValidator(metadata.metatype);
    if (!validator) return value;

    try {
      return validator.schema.parse(value);
    } catch (err) {
      if (err instanceof z.ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',
          errors: err.issues,
        });
      }

      throw err;
    }
  }
}
