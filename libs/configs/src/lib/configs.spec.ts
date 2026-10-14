import { Configs } from './configs';
import type { ConfigSource, ConfigValues } from './sources/config-source';
import { EnvFileConfigSource } from './sources/env-file.source';

class InMemoryConfigSource implements ConfigSource {
  constructor(public values: ConfigValues) {}

  load = jest.fn(async () => ({ ...this.values }));
}

let source: InMemoryConfigSource;

/** Minimal config set: passes every loaded value through, plus one default. */
class TestConfigs extends Configs {
  protected setUpConfigSource() {
    return source;
  }

  protected setUpConfigsFromInit() {
    this.configs = {
      ...this.initialConfig,
      WITH_DEFAULT: this.initialConfig['WITH_DEFAULT'] || 'fallback',
    };
  }
}

/** Creates a config set over the given values, without loading them. */
const createConfigs = (values: ConfigValues = {}) => {
  source = new InMemoryConfigSource(values);
  return new TestConfigs();
};

/** Creates a config set over the given values and loads them. */
const loadConfigs = (values: ConfigValues) => createConfigs(values).setUp();

describe('Configs', () => {
  describe('setUp', () => {
    it('loads values from the source and returns the same instance', async () => {
      const configs = createConfigs({ NAME: 'value' });

      await expect(configs.setUp()).resolves.toBe(configs);
      expect(source.load).toHaveBeenCalledTimes(1);
      expect(configs.get('NAME')).toBe('value');
    });

    it('has no values before setUp', () => {
      const configs = createConfigs({ NAME: 'value' });

      expect(configs.get('NAME')).toBeUndefined();
      expect(source.load).not.toHaveBeenCalled();
    });

    it('applies defaults from setUpConfigsFromInit', async () => {
      const configs = await loadConfigs({});

      expect(configs.get('WITH_DEFAULT')).toBe('fallback');
    });
  });

  describe('get', () => {
    it('returns the raw string value', async () => {
      const configs = await loadConfigs({ NAME: 'value' });

      expect(configs.get('NAME')).toBe('value');
    });

    it('returns undefined for a missing key', async () => {
      const configs = await loadConfigs({});

      expect(configs.get('MISSING')).toBeUndefined();
    });
  });

  describe('getNumber', () => {
    it.each([
      ['42', 42],
      [' 42 ', 42],
      ['-1.5', -1.5],
      ['0', 0],
    ])('parses %p as %p', async (raw, expected) => {
      const configs = await loadConfigs({ VALUE: raw });

      expect(configs.getNumber('VALUE')).toBe(expected);
    });

    it.each(['', '   ', 'abc', 'Infinity', 'NaN'])('returns undefined for %p', async (raw) => {
      const configs = await loadConfigs({ VALUE: raw });

      expect(configs.getNumber('VALUE')).toBeUndefined();
    });

    it('returns undefined for a missing key', async () => {
      const configs = await loadConfigs({});

      expect(configs.getNumber('MISSING')).toBeUndefined();
    });
  });

  describe('getBoolean', () => {
    it.each([
      ['true', true],
      ['TRUE', true],
      [' True ', true],
      ['false', false],
      ['FALSE', false],
    ])('parses %p as %p', async (raw, expected) => {
      const configs = await loadConfigs({ VALUE: raw });

      expect(configs.getBoolean('VALUE')).toBe(expected);
    });

    it.each(['', 'yes', '1', '0'])('returns undefined for %p', async (raw) => {
      const configs = await loadConfigs({ VALUE: raw });

      expect(configs.getBoolean('VALUE')).toBeUndefined();
    });

    it('returns undefined for a missing key', async () => {
      const configs = await loadConfigs({});

      expect(configs.getBoolean('MISSING')).toBeUndefined();
    });
  });

  describe('required', () => {
    it('returns values that are present and valid', async () => {
      const configs = await loadConfigs({ NAME: 'value', PORT: '3000', DEBUG: 'true' });

      expect(configs.required.get('NAME')).toBe('value');
      expect(configs.required.getNumber('PORT')).toBe(3000);
      expect(configs.required.getBoolean('DEBUG')).toBe(true);
    });

    it('returns false and 0 instead of throwing', async () => {
      const configs = await loadConfigs({ PORT: '0', DEBUG: 'false' });

      expect(configs.required.getNumber('PORT')).toBe(0);
      expect(configs.required.getBoolean('DEBUG')).toBe(false);
    });

    it.each(['get', 'getNumber', 'getBoolean'] as const)(
      '%s throws when the key is missing',
      async (getter) => {
        const configs = await loadConfigs({});

        expect(() => configs.required[getter]('MISSING')).toThrow(
          'MISSING not found in configuration',
        );
      },
    );

    it.each(['get', 'getNumber', 'getBoolean'] as const)(
      '%s throws when the value is empty',
      async (getter) => {
        const configs = await loadConfigs({ EMPTY: '  ' });

        expect(() => configs.required[getter]('EMPTY')).toThrow(
          'EMPTY not found in configuration',
        );
      },
    );

    it('getNumber throws when the value is not a number', async () => {
      const configs = await loadConfigs({ PORT: 'abc' });

      expect(() => configs.required.getNumber('PORT')).toThrow('PORT has an invalid value: "abc"');
    });

    it('getBoolean throws when the value is not a boolean', async () => {
      const configs = await loadConfigs({ DEBUG: 'yes' });

      expect(() => configs.required.getBoolean('DEBUG')).toThrow(
        'DEBUG has an invalid value: "yes"',
      );
    });
  });

  describe('getAll / getAllInitial', () => {
    it('getAllInitial returns values as loaded, getAll returns processed values', async () => {
      const configs = await loadConfigs({ NAME: 'value' });

      expect(configs.getAllInitial()).toEqual({ NAME: 'value' });
      expect(configs.getAll()).toEqual({ NAME: 'value', WITH_DEFAULT: 'fallback' });
    });

    it('returns copies that do not affect the instance', async () => {
      const configs = await loadConfigs({ NAME: 'value' });

      configs.getAll()['NAME'] = 'changed';
      configs.getAllInitial()['NAME'] = 'changed';

      expect(configs.get('NAME')).toBe('value');
      expect(configs.getAllInitial()['NAME']).toBe('value');
    });
  });

  describe('usesSource', () => {
    it('matches the source class the config set was created with', () => {
      const configs = createConfigs();

      expect(configs.usesSource(InMemoryConfigSource)).toBe(true);
      expect(configs.usesSource(EnvFileConfigSource)).toBe(false);
    });
  });
});
