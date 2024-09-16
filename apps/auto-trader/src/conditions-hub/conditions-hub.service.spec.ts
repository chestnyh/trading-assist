import { ConditionsHubService } from './conditions-hub.service';

describe('ConditionsHubService', () => {
  let service: ConditionsHubService;

  beforeEach(() => {
    service = new ConditionsHubService();
  });

  it('should evaluate equality condition correctly', () => {
    const condition = { __eq: { value: 'age', equalTo: 30 } };
    const checkObj = { age: 30 };
    expect(service.evaluate(condition, checkObj)).toBe(true);
  });

  it('should evaluate greater than condition correctly', () => {
    const condition = { __gt: { value: 'score', greaterThan: 80 } };
    const checkObj = { score: 85 };
    expect(service.evaluate(condition, checkObj)).toBe(true);
  });

  it('should evaluate AND logical connector correctly', () => {
    const condition = {
      __and: [
        { __eq: { value: 'status', equalTo: 'active' } },
        { __gt: { value: 'age', greaterThan: 18 } }
      ]
    };
    const checkObj = { status: 'active', age: 25 };
    expect(service.evaluate(condition, checkObj)).toBe(true);
  });

  it('should evaluate OR logical connector correctly', () => {
    const condition = {
      __or: [
        { __eq: { value: 'role', equalTo: 'admin' } },
        { __gte: { value: 'level', greaterThanOrEqualTo: 5 } }
      ]
    };
    const checkObj = { role: 'user', level: 7 };
    expect(service.evaluate(condition, checkObj)).toBe(true);
  });

  it('should throw error for undefined operator', () => {
    const condition = { __invalid: { value: 'test', invalid: true } };
    const checkObj = { test: true };
    expect(() => service.evaluate(condition, checkObj)).toThrow('Operator __invalid is not defined.');
  });
});