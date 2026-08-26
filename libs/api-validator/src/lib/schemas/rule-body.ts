import { z } from 'zod';

// Base action schema with common fields
const BaseActionSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});

// Simple action schemas (no child actions)
const LogAction = BaseActionSchema.extend({
  type: z.literal('log'),
  arguments: z.object({
    message: z.string(),
  }),
});

const DebugAction = BaseActionSchema.extend({
  type: z.literal('debug'),
  arguments: z.object({
    message: z.string(),
  }),
});

const AddToHeapAction = BaseActionSchema.extend({
  type: z.literal('add_to_heap'),
  arguments: z.union([
    z.object({
      key: z.string(),
      value: z.unknown(),
    }),
    z.object({
      items: z.array(z.object({
        key: z.string(),
        value: z.unknown(),
      })),
    }),
  ]),
});

const DeleteFromHeapAction = BaseActionSchema.extend({
  type: z.literal('delete_from_heap'),
  arguments: z.object({
    key: z.string(),
  }),
});

const StopSequenceAction = BaseActionSchema.extend({
  type: z.literal('stop_sequence'),
  arguments: z.object({}),
});

const ResolveAction = BaseActionSchema.extend({
  type: z.literal('resolve'),
  arguments: z.union([
    z.object({
      expression: z.string(),
    }),
    z.object({
      expression: z.record(z.string(), z.unknown()),
    }),
    z.object({
      value: z.unknown(),
    }),
  ]),
});

const IncludesAction = BaseActionSchema.extend({
  type: z.literal('includes'),
  arguments: z.union([
    z.object({
      array: z.array(z.unknown()),
      item: z.unknown(),
    }),
    z.object({
      arr: z.union([z.array(z.unknown()), z.string()]),
      check: z.unknown(),
      saveTo: z.string(),
    }),
  ]),
});

// Binance action schemas
const BinanceGetTickerAction = BaseActionSchema.extend({
  type: z.literal('binance_get_ticker'),
  arguments: z.object({
    symbol: z.string(),
  }),
});

const BinanceSpotGetTickerAction = BaseActionSchema.extend({
  type: z.literal('binance_spot_get_ticker'),
  arguments: z.object({
    symbol: z.string(),
  }),
});

const BinanceSpotGetKlinesAction = BaseActionSchema.extend({
  type: z.literal('binance_spot_get_klines'),
  arguments: z.object({
    symbol: z.string(),
    interval: z.string(),
    limit: z.number().optional(),
  }),
});

const BinanceUmFuturesGetTickerAction = BaseActionSchema.extend({
  type: z.literal('binance_um_futures_get_ticker'),
  arguments: z.object({
    symbol: z.string(),
  }),
});

const BinanceUmFeaturesExchangeInfoAction = BaseActionSchema.extend({
  type: z.literal('binance_um_features_exchange_info'),
  arguments: z.object({}),
});

// Telegram action schemas
const TelegramSendMessageAction = BaseActionSchema.extend({
  type: z.literal('telegram_send_message'),
  arguments: z.union([
    z.object({
      chatId: z.union([z.string(), z.number()]),
      text: z.string(),
    }),
    z.object({
      botId: z.string(),
      message: z.string(),
    }),
  ]),
});

// Recursive action schema for self-referencing actions
const ActionSchema: z.ZodType<any> = z.lazy(() =>
  z.discriminatedUnion('type', [
    LogAction,
    DebugAction,
    AddToHeapAction,
    DeleteFromHeapAction,
    StopSequenceAction,
    ResolveAction,
    IncludesAction,
    BinanceGetTickerAction,
    BinanceSpotGetTickerAction,
    BinanceSpotGetKlinesAction,
    BinanceUmFuturesGetTickerAction,
    BinanceUmFeaturesExchangeInfoAction,
    TelegramSendMessageAction,
    // Complex actions with child actions
    BaseActionSchema.extend({
      type: z.literal('if_then'),
      arguments: z.object({
        if: ActionSchema,
        then: z.union([ActionSchema, z.array(ActionSchema)]),
      }),
    }),
    BaseActionSchema.extend({
      type: z.literal('parallel'),
      arguments: z.object({
        do: z.array(ActionSchema).min(1, 'Parallel actions must have at least one action'),
      }),
    }),
    BaseActionSchema.extend({
      type: z.literal('sequence'),
      arguments: z.object({
        do: z.array(ActionSchema).min(1, 'Sequence actions must have at least one action'),
      }),
    }),
    BaseActionSchema.extend({
      type: z.literal('for_each'),
      arguments: z.object({
        arr: z.union([z.array(z.unknown()), z.string()]),
        do: z.union([ActionSchema, z.array(ActionSchema)]),
      }),
    }),
    BaseActionSchema.extend({
      type: z.literal('timeout'),
      arguments: z.object({
        timeout: z.number(),
        do: ActionSchema,
      }),
    }),
    BaseActionSchema.extend({
      type: z.literal('interval'),
      arguments: z.object({
        interval: z.number(),
        do: ActionSchema,
      }),
    }),
    BaseActionSchema.extend({
      type: z.literal('cron'),
      arguments: z.object({
        schedule: z.string(),
        do: ActionSchema,
      }),
    }),
  ])
);

// Main rule body schema
export const RuleBodySchema = z.union([
  // Direct object format
  ActionSchema,
  // String format that parses to JSON
  z.string().transform((val, ctx) => {
    try {
      const parsed = JSON.parse(val);
      const result = ActionSchema.safeParse(parsed);
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          ctx.addIssue({
            ...issue,
            path: ['ruleBody', ...issue.path],
          });
        });
        return z.NEVER;
      }
      return result.data;
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid JSON in ruleBody string',
        path: ['ruleBody'],
      });
      return z.NEVER;
    }
  }),
]);

// Export the type
type RuleBody = z.infer<typeof RuleBodySchema>;

// Export the action schema for external use
export { ActionSchema };
