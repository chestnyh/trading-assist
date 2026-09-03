import {
  CreateUserRuleSettingDtoSchema,
  UpdateUserRuleSettingDtoSchema,
} from './rules-settings';


const ServiceCode = {
  BINANCE: 'BINANCE',
  BYBIT: 'BYBIT',
  KRAKEN: 'KRAKEN',
  TELEGRAM: 'TELEGRAM',
  EMAIL: 'EMAIL',
  DISCORD_WEBHOOKS: 'DISCORD_WEBHOOKS',
  SLACK_WEBHOOKS: 'SLACK_WEBHOOKS',
  SMS_TWILIO: 'SMS_TWILIO',
  PUSH_NOTIFICATIONS_ONESIGNAL: 'PUSH_NOTIFICATIONS_ONESIGNAL',
  WHATSAPP_BUSINESS: 'WHATSAPP_BUSINESS',
  WEBHOOKS: 'WEBHOOKS',
}

const validBase = {
  name: 'My Binance Bot',
  code: 'BINANCE_MAIN_01',
  serviceCode: ServiceCode.BINANCE,
  configuration: { ApiKey: 'key' },
};

describe('CreateUserRuleSettingDtoSchema', () => {
  it('should accept a valid setting without a description', () => {
    const result = CreateUserRuleSettingDtoSchema.safeParse(validBase);
    expect(result.success).toBe(true);
  });

  it('should accept a description with more than 10 characters', () => {
    const result = CreateUserRuleSettingDtoSchema.safeParse({
      ...validBase,
      description: 'Rule for spot trading',
    });
    expect(result.success).toBe(true);
  });

  it('should accept an empty string description', () => {
    const result = CreateUserRuleSettingDtoSchema.safeParse({
      ...validBase,
      description: '',
    });
    expect(result.success).toBe(true);
  });

  it('should accept a description shorter than 10 characters', () => {
    const result = CreateUserRuleSettingDtoSchema.safeParse({
      ...validBase,
      description: 'short',
    });
    expect(result.success).toBe(true);
  });

  it('should accept multi-line and unicode descriptions', () => {
    const result = CreateUserRuleSettingDtoSchema.safeParse({
      ...validBase,
      description: 'Line one\nLine two — with emoji 🚀',
    });
    expect(result.success).toBe(true);
  });

  it('should reject a non-string description', () => {
    const result = CreateUserRuleSettingDtoSchema.safeParse({
      ...validBase,
      description: 123,
    } as unknown);
    expect(result.success).toBe(false);
  });
});

describe('UpdateUserRuleSettingDtoSchema', () => {
  it('should accept clearing a description with an empty string', () => {
    const result = UpdateUserRuleSettingDtoSchema.safeParse({
      description: '',
    });
    expect(result.success).toBe(true);
  });

  it('should accept a partial update without description', () => {
    const result = UpdateUserRuleSettingDtoSchema.safeParse({
      name: 'Renamed Bot',
    });
    expect(result.success).toBe(true);
  });
});
