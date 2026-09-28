import assert from 'node:assert/strict';

// Runs through the browser tool with a tab from the documented browser API.
export async function checkCalculators(tab, origin = 'http://localhost:4173') {
  const ui = tab.playwright;
  const fill = (label, value) => ui.getByLabel(label, { exact: true }).fill(value);
  const amount = () => ui.locator('output .sr-only').textContent();
  const goal = name => ui.getByRole('radio', { name, exact: true });
  await tab.goto(`${origin}/`);
  await ui.getByRole('tab', { name: 'Fixed deposit', exact: true }).click();
  assert(await ui.getByLabel('Principal amount', { exact: true }).isVisible(), 'Switching from SIP to FD must leave a working calculator');
  await fill('Principal amount', '100000');
  await fill('Annual interest rate', '10');
  await fill('Tenure', '2');
  await ui.getByLabel('Compounding frequency').selectOption('1');
  assert.equal(await amount(), '₹1,21,000');
  await ui.getByLabel('Compounding frequency').selectOption('12');
  assert.equal(await amount(), '₹1,22,039');
  await fill('Principal amount', '-1');
  assert.equal(await ui.getByLabel('Principal amount', { exact: true }).getAttribute('aria-invalid'), 'true');
  assert.equal(await ui.locator('output').count(), 0, 'Invalid input must hide the estimate without crashing');
  await fill('Principal amount', '100000');
  assert.equal(await amount(), '₹1,22,039');
  await ui.getByRole('tab', { name: 'Goal-based planning', exact: true }).click();
  assert(await goal('Child education').isVisible());
  assert(await goal('Car').isVisible());
  assert(await goal('Financial freedom').isVisible());
  await fill('Current goal cost', '12000');
  await fill('Current savings', '0');
  await fill('Years until your goal', '1');
  await fill('Expected annual inflation', '0');
  await fill('Expected annual return', '0');
  assert.equal(await amount(), '₹1,000');
  await goal('Car').check();
  assert.notEqual(await amount(), '₹1,000', 'Choosing another goal must recalculate');
  await fill('Current goal cost', '600000');
  await goal('Financial freedom').check();
  await fill('Current goal cost', '20000000');
  assert.equal(await ui.getByLabel('Current goal cost', { exact: true }).getAttribute('aria-invalid'), 'false', 'Larger financial freedom targets must be supported');
  await goal('Car').check();
  assert.equal(await ui.getByLabel('Current goal cost', { exact: true }).getAttribute('value'), '600000', 'Each goal must preserve edited inputs');
  await goal('Child education').check();
  assert.equal(await amount(), '₹1,000', 'Returning to a goal must restore its estimate');
  await fill('Current goal cost', '');
  assert.equal(await ui.locator('output').count(), 0);
  await fill('Current goal cost', '12000');
  assert.equal(await amount(), '₹1,000');
  for (const name of ['Mutual fund / SIP', 'Fixed deposit', 'Goal-based planning', 'Fixed deposit', 'Mutual fund / SIP']) {
    await ui.getByRole('tab', { name, exact: true }).click();
    assert.equal(await ui.locator('output').count(), 1, `Calculator must survive repeated switches to ${name}`);
  }
  await tab.goto(`${origin}/calculators/fd/`);
  await fill('Annual interest rate', '0');
  assert.equal(await amount(), '₹1,00,000');
  await tab.goto(`${origin}/fixed-deposits/`);
  await fill('Principal amount', '200000');
  await fill('Annual interest rate', '0');
  assert.equal(await amount(), '₹2,00,000');
  await tab.goto(`${origin}/calculators/goal/`);
  await goal('Financial freedom').check();
  await fill('Current savings', '100000000');
  assert.equal(await amount(), '₹0', 'A funded goal must not require a negative contribution');
  assert(await ui.getByText('These calculations are illustrative and not financial advice. Actual returns, rates, taxes, and outcomes may vary.', { exact: true }).isVisible());
  const errors = await tab.dev.logs({ levels: ['error'], limit: 50 });
  assert.equal(errors.length, 0, `Calculator flows must not produce console errors: ${errors.map(error => error.message).join('; ')}`);
  return 'Passed calculator switching, FD compounding, goal selection, saved goal inputs, invalid-input recovery, standalone routes and embedded FD.';
}
