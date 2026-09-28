import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateFD, calculateSIP, calculateGoal, formatINR } from '../src/calculations.mjs';

test('FD uses the supplied compounding frequency', () => {
  assert.equal(calculateFD({ principal: 100000, rate: 10, years: 2, frequency: 1 }).final, 121000.00000000001);
  assert.ok(Math.abs(calculateFD({ principal: 100000, rate: 7, years: 5, frequency: 4 }).final - 141477.8195755835) < 0.01);
});
test('zero interest FD preserves principal', () => {
  assert.deepEqual(calculateFD({ principal: 123456, rate: 0, years: 2, frequency: 12 }), { invested: 123456, growth: 0, final: 123456 });
});
test('SIP agrees with explicit beginning-of-month cashflows', () => {
  const actual = calculateSIP({ monthly: 5000, rate: 12, years: 2, initial: 10000 });
  let balance = 10000;
  for (let month = 0; month < 24; month++) balance = (balance + 5000) * 1.01;
  assert.ok(Math.abs(actual.final - balance) < 0.0001);
  assert.equal(actual.invested, 130000);
});
test('zero-return SIP handles initial investment without division by zero', () => {
  assert.deepEqual(calculateSIP({ monthly: 1000, rate: 0, years: 1, initial: 5000 }), { invested: 17000, growth: 0, final: 17000 });
});
test('goal savings and monthly investment reach the inflation-adjusted target', () => {
  const goal = calculateGoal({ cost: 1000000, years: 10, inflation: 6, savings: 200000, rate: 10 });
  const projection = calculateSIP({ monthly: goal.monthlyRequired, rate: 10, years: 10, initial: 200000 });
  assert.ok(Math.abs(goal.futureCost - projection.final) < 0.01);
  assert.ok(Math.abs(calculateSIP({ monthly: 0, rate: 10, years: 10, initial: goal.oneTime }).final + goal.projectedSavings - goal.futureCost) < 0.01);
});
test('fully funded goals have no negative contributions and zero-rate goals work', () => {
  assert.equal(calculateGoal({ cost: 10000, years: 1, inflation: 0, savings: 20000, rate: 0 }).monthlyRequired, 0);
  assert.equal(calculateGoal({ cost: 12000, years: 1, inflation: 0, savings: 0, rate: 0 }).monthlyRequired, 1000);
});
test('currency uses Indian grouping and no false precision', () => {
  assert.equal(formatINR(1234567.89), '₹12,34,568');
});
