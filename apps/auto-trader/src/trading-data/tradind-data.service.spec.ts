import { TradingDataService } from './trading-data.service';

describe('TradingDataService', () => {
  let service: TradingDataService;

  beforeEach(() => {
    service = new TradingDataService();
  });

  describe('set method', () => {
    it('should set a simple property', () => {
      service.set('name', 'Alice');
      expect(service.get('name')).toBe('Alice');
    });

    it('should set a nested object property', () => {
      service.set('user.profile.age', 30);
      expect(service.get('user.profile.age')).toBe(30);
    });

    it('should set an array element', () => {
      service.set('users.[0]', { name: 'Bob' });
      expect(service.get('users.[0].name')).toBe('Bob');
    });

    it('should push to the end of an array', () => {
      service.set('users.[]', { name: 'Charlie' });
      service.set('users.[]', { name: 'David' });
      expect(service.get('users.[1].name')).toBe('David');
    });

    it('should handle mixed object and array paths', () => {
      service.set('company.departments.[0].employees.[1].position', 'Manager');
      expect(service.get('company.departments.[0].employees.[1].position')).toBe('Manager');
    });
  });

  describe('get method', () => {
    beforeEach(() => {
      service.set('users', [
        { name: 'Alice', age: 30 },
        { name: 'Bob', age: 25 }
      ]);
      service.set('settings.theme.darkMode', true);
    });

    it('should get a simple property', () => {
      expect(service.get('settings.theme.darkMode')).toBe(true);
    });

    it('should get an array element', () => {
      expect(service.get('users.[0].name')).toBe('Alice');
    });

    it('should get the last element of an array', () => {
      expect(service.get('users.[].name')).toBe('Bob');
    });

    it('should return undefined for non-existent paths', () => {
      expect(service.get('nonexistent.path')).toBeUndefined();
    });

    it('should return a default value for non-existent paths', () => {
      expect(service.get('nonexistent.path', 'default')).toBe('default');
    });

    it('should handle arrays in the middle of the path', () => {
      service.set('company.departments.[0].name', 'IT');
      expect(service.get('company.departments.[0].name')).toBe('IT');
    });
  });

  describe('edge cases', () => {
    it('should handle empty string keys', () => {
      service.set('', 'root');
      expect(service.get('')).toBe('root');
    });

    it('should handle numeric keys', () => {
      service.set('0', 'zero');
      expect(service.get('0')).toBe('zero');
    });

    it('should throw error when trying to push to a non-array', () => {
      service.set('notAnArray', {});
      expect(() => service.set('notAnArray.[]', 'value')).toThrow('Cannot push to a non-array');
    });
  });
});