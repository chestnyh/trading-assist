import { z } from 'zod';

// Known valid action types (including legacy binance_get_ticker for backward compatibility)
const VALID_ACTION_TYPES = [
  'log',
  'debug',
  'add_to_heap',
  'delete_from_heap',
  'if_then',
  'parallel',
  'sequence',
  'resolve',
  'timeout',
  'interval',
  'for_each',
  'cron',
  'includes',
  'stop_sequence',
  'binance_get_ticker', // Legacy but accepted for backward compatibility
  'binance_spot_get_ticker',
  'binance_spot_get_klines',
  'binance_um_futures_get_ticker',
  'binance_um_features_exchange_info',
  'telegram_send_message',
] as const;

// No legacy types are strictly rejected - all valid types are accepted
const LEGACY_ACTION_TYPES: string[] = [];

// Action types with required child slots configuration
const ACTION_CHILD_SLOTS: Record<string, { key: string; multiple: boolean }[]> = {
  if_then: [
    { key: 'if', multiple: false },
    { key: 'then', multiple: true },
  ],
  parallel: [{ key: 'do', multiple: true }],
  sequence: [{ key: 'do', multiple: true }],
  for_each: [{ key: 'do', multiple: true }],
  timeout: [{ key: 'do', multiple: false }],
  interval: [{ key: 'do', multiple: false }],
  cron: [{ key: 'do', multiple: false }],
};

// Recursive action schema
export const ActionNodeSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    type: z.string().superRefine((val, ctx) => {
      // Check if it's a legacy type
      if (LEGACY_ACTION_TYPES.includes(val as any)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Action type "${val}" is legacy and not supported. Use "binance_spot_get_ticker" instead.`,
        });
        return;
      }
      // Check if it's a known valid type
      if (!VALID_ACTION_TYPES.includes(val as any)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Unknown action type "${val}". Valid types are: ${VALID_ACTION_TYPES.join(', ')}`,
        });
      }
    }),
    arguments: z.record(z.string(), z.unknown()).refine(
      (val) => Object.keys(val).length > 0 || true, // arguments can be empty object for actions like stop_sequence
      { message: 'Arguments must be an object' }
    ),
    name: z.string().optional(),
    description: z.string().optional(),
  }).superRefine((val, ctx) => {
    const actionType = val.type;
    const childSlots = ACTION_CHILD_SLOTS[actionType];

    if (!childSlots) {
      // Actions without child slots should not have them in arguments
      return;
    }

    // Validate required child slots
    for (const slot of childSlots) {
      const slotValue = val.arguments[slot.key];
      const path = ['arguments', slot.key];

      if (slotValue === undefined || slotValue === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Required child slot "${slot.key}" is missing for action type "${actionType}"`,
          path,
        });
        continue;
      }

      if (slot.multiple) {
        // Multiple slot should be an array, but we also accept single object for compatibility
        // Normalize to array for validation
        const items = Array.isArray(slotValue) ? slotValue : [slotValue];

        if (items.length === 0) {
          // Empty arrays are not allowed for multiple slots
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Child slot "${slot.key}" must have at least one action for action type "${actionType}"`,
            path,
          });
        } else {
          // Validate each child action in the array
          items.forEach((child, index) => {
            const childResult = ActionNodeSchema.safeParse(child);
            if (!childResult.success) {
              childResult.error.issues.forEach((issue) => {
                ctx.addIssue({
                  ...issue,
                  path: [...path, index.toString(), ...issue.path],
                });
              });
            }
          });
        }
      } else {
        // Single slot must be an object (action)
        const childResult = ActionNodeSchema.safeParse(slotValue);
        if (!childResult.success) {
          childResult.error.issues.forEach((issue) => {
            ctx.addIssue({
              ...issue,
              path: [...path, ...issue.path],
            });
          });
        }
      }
    }
  })
);

// Main rule body schema
export const RuleBodySchema = z.union([
  // Direct object format
  ActionNodeSchema,
  // String format that parses to JSON
  z.string().transform((val, ctx) => {
    try {
      const parsed = JSON.parse(val);
      const result = ActionNodeSchema.safeParse(parsed);
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
export type RuleBody = z.infer<typeof RuleBodySchema>;
