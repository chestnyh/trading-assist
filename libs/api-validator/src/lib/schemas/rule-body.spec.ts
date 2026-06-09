import { RuleBodySchema, ActionSchema } from './rule-body';
import * as fs from 'fs';
import * as path from 'path';

describe('RuleBodySchema', () => {
  describe('ActionSchema', () => {
    it('should validate a simple log action', () => {
      const result = ActionSchema.safeParse({
        type: 'log',
        arguments: {
          message: 'Test message',
          level: 'info',
        },
      });
      expect(result.success).toBe(true);
    });

    it('should accept legacy binance_get_ticker for backward compatibility', () => {
      const result = ActionSchema.safeParse({
        type: 'binance_get_ticker',
        arguments: {
          symbol: 'BTCUSDT',
        },
      });
      expect(result.success).toBe(true);
    });

    it('should reject unknown action type', () => {
      const result = ActionSchema.safeParse({
        type: 'unknown_action',
        arguments: {},
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toMatch(/Invalid discriminator value|Invalid option|expected one of/);
      }
    });

    it('should validate sequence with child actions', () => {
      const result = ActionSchema.safeParse({
        type: 'sequence',
        arguments: {
          do: [
            {
              type: 'log',
              arguments: { message: 'First' },
            },
            {
              type: 'log',
              arguments: { message: 'Second' },
            },
          ],
        },
      });
      expect(result.success).toBe(true);
    });

    it('should reject sequence without do array', () => {
      const result = ActionSchema.safeParse({
        type: 'sequence',
        arguments: {},
      });
      expect(result.success).toBe(false);
    });

    it('should reject sequence with empty do array', () => {
      const result = ActionSchema.safeParse({
        type: 'sequence',
        arguments: {
          do: [],
        },
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least one action');
      }
    });

    it('should validate if_then with both slots', () => {
      const result = ActionSchema.safeParse({
        type: 'if_then',
        arguments: {
          if: {
            type: 'resolve',
            arguments: { expression: 'true' },
          },
          then: [
            {
              type: 'log',
              arguments: { message: 'Then branch' },
            },
          ],
        },
      });
      expect(result.success).toBe(true);
    });

    it('should reject if_then without then slot', () => {
      const result = ActionSchema.safeParse({
        type: 'if_then',
        arguments: {
          if: {
            type: 'resolve',
            arguments: { expression: 'true' },
          },
        },
      });
      expect(result.success).toBe(false);
    });

    it('should validate timeout with single child', () => {
      const result = ActionSchema.safeParse({
        type: 'timeout',
        arguments: {
          timeout: 1000,
          do: {
            type: 'log',
            arguments: { message: 'Timeout message' },
          },
        },
      });
      expect(result.success).toBe(true);
    });
  });

  describe('config-examples validation', () => {
    // Navigate from api-validator to workspace root, then to config-examples
    const configExamplesDir = path.join(__dirname, '..', '..', '..', '..', '..', 'apps', 'auto-trader', 'config-examples');
    
    // Get all JSON files from config-examples
    const configFiles = fs.readdirSync(configExamplesDir)
      .filter(file => file.endsWith('.json'));

    it.each(configFiles)('should validate %s', (filename) => {
      const filePath = path.join(configExamplesDir, filename);
      const content = fs.readFileSync(filePath, 'utf-8');
      const ruleBody = JSON.parse(content);

      // Some configs have name/description at top level, extract the actual action
      const actionBody = ruleBody.type ? ruleBody : ruleBody.arguments?.do;

      const result = RuleBodySchema.safeParse(actionBody);
      if (!result.success) {
        console.log(`Validation failed for ${filename}:`, JSON.stringify(result.error.issues, null, 2));
      }
      expect(result.success).toBe(true);
    });
  });
});
