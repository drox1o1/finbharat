import { useId, useRef, useState } from 'react';
import { ArrowUpRight, CircleHelp, Landmark, Target, TrendingUp } from 'lucide-react';
import { AnimatedAmount } from './AnimatedAmount';
import { MotionDetails } from './Interactive';
import { calculateFD, calculateSIP, calculateGoal, formatINR } from './calculations.mjs';

export const disclaimer = 'These calculations are illustrative and not financial advice. Actual returns, rates, taxes, and outcomes may vary.';
export const calculatorInfo = {
  sip: { title: 'Mutual Fund / SIP Calculator', label: 'Mutual fund / SIP', path: '/calculators/sip/', Icon: TrendingUp, intro: 'See how regular investments could build over time. Explore the balance between what you put in and what it could become.' },
  fd: { title: 'FD Calculator', label: 'Fixed deposit', path: '/calculators/fd/', Icon: Landmark, intro: 'Estimate your fixed deposit maturity amount and interest, using the rate, tenure and compounding frequency you choose.' },
  goal: { title: 'Goal-Based Calculator', label: 'Goal-based planning', path: '/calculators/goal/', Icon: Target, intro: 'Put a plan behind something that matters to you. Account for inflation, your savings and the time you have.' },
};

const initialValues = {
  sip: { monthly: '5000', rate: '10', years: '10', initial: '0' },
  fd: { principal: '100000', rate: '7', years: '5', frequency: '4' },
  goal: { name: 'A home of my own', cost: '1000000', years: '10', inflation: '6', savings: '100000', rate: '10' },
};

function NumberField({ label, value, onChange, min = 0, max, step = 1, suffix, prefix, hint }) {
  const id = useId();
  const numeric = Number(value);
  const error = value === '' || !Number.isFinite(numeric) ? 'Enter a number to see your estimate.' : numeric < min || numeric > max ? `Choose a value between ${min.toLocaleString('en-IN')} and ${max.toLocaleString('en-IN')}.` : !Number.isInteger(numeric / step) && step >= 1 ? 'Use a whole number for this amount.' : null;
  return <div className="number-field">
    <div className="field-heading"><label htmlFor={id}>{label}</label><div className={`numeric-control ${error ? 'has-error' : ''}`}><span aria-hidden="true">{prefix}</span><input id={id} type="number" inputMode="decimal" min={min} max={max} step={step} value={value} onChange={e => onChange(e.target.value)} aria-invalid={Boolean(error)} aria-describedby={`${id}-hint`} /><span aria-hidden="true">{suffix}</span></div></div>
    <input className="range" type="range" aria-label={`${label} slider`} min={min} max={max} step={step} value={Number.isFinite(numeric) ? Math.max(min, Math.min(max, numeric)) : min} onChange={e => onChange(e.target.value)} style={{ '--range-progress': `${Math.max(0, Math.min(100, (numeric - min) / (max - min) * 100))}%` }} />
    <div className="range-labels" aria-hidden="true"><span>{prefix}{min.toLocaleString('en-IN')}{suffix}</span><span>{prefix}{max.toLocaleString('en-IN')}{suffix}</span></div>
    <p id={`${id}-hint`} className={error ? 'field-error' : 'field-hint'}>{error || hint || 'Adjust the slider or enter your own value.'}</p>
  </div>;
}

function validValues(type, values) {
  const bounds = type === 'fd' ? { principal: [0, 10000000], rate: [0, 20], years: [1, 30], frequency: [1, 12] } : type === 'sip' ? { monthly: [0, 100000], rate: [0, 30], years: [1, 40], initial: [0, 10000000] } : { cost: [1, 10000000], years: [1, 40], inflation: [0, 20], savings: [0, 10000000], rate: [0, 30] };
  return Object.entries(bounds).every(([key, [min, max]]) => values[key] !== '' && Number.isFinite(Number(values[key])) && Number(values[key]) >= min && Number(values[key]) <= max && (!['years', 'monthly', 'principal', 'initial', 'cost', 'savings'].includes(key) || Number.isInteger(Number(values[key]))));
}

export function Calculator({ type = 'sip', embedded = false }) {
  const [values, setValues] = useState(initialValues[type]);
  const resultRef = useRef(null);
  const valid = validValues(type, values);
  const numbers = Object.fromEntries(Object.entries(values).filter(([key]) => key !== 'name').map(([key, value]) => [key, Number(value)]));
  const result = valid ? (type === 'fd' ? calculateFD(numbers) : type === 'sip' ? calculateSIP(numbers) : calculateGoal(numbers)) : null;
  const set = key => value => setValues(previous => ({ ...previous, [key]: value }));
  const field = (key, label, props) => <NumberField key={key} label={label} value={values[key]} onChange={set(key)} {...props} />;
  const contribution = result && result.final > 0 ? Math.min(100, result.invested / result.final * 100) : 100;
  return <div className={`calculator-workspace ${embedded ? 'embedded' : ''}`}>
    <form className="calculator-form" onSubmit={e => e.preventDefault()} aria-label={calculatorInfo[type].title}>
      <div className="form-topline"><h3>Your {type === 'goal' ? 'goal' : 'numbers'}. Your possibilities.</h3><CircleHelp size={18} aria-hidden="true" /></div>
      {type === 'goal' && <div className="goal-name"><label htmlFor="goal-name">Goal name</label><input id="goal-name" type="text" value={values.name} maxLength={80} onChange={e => set('name')(e.target.value)} placeholder="What are you planning for?" /></div>}
      {type === 'sip' && field('monthly', 'Monthly investment', { max: 100000, prefix: '₹' })}
      {type === 'sip' && field('initial', 'Initial investment (optional)', { max: 10000000, prefix: '₹' })}
      {type === 'fd' && field('principal', 'Principal amount', { max: 10000000, prefix: '₹' })}
      {type === 'goal' && field('cost', 'Current goal cost', { min: 1, max: 10000000, prefix: '₹' })}
      {type === 'goal' && field('savings', 'Current savings', { max: 10000000, prefix: '₹' })}
      {field('years', type === 'goal' ? 'Years until your goal' : type === 'fd' ? 'Tenure' : 'Investment duration', { min: 1, max: type === 'fd' ? 30 : 40, suffix: ' yr' })}
      {type === 'goal' && field('inflation', 'Expected annual inflation', { max: 20, step: 0.1, suffix: '%' })}
      {field('rate', type === 'fd' ? 'Annual interest rate' : 'Expected annual return', { max: type === 'fd' ? 20 : 30, step: 0.1, suffix: '%', hint: type === 'fd' ? 'Use the rate applicable to your deposit.' : 'An assumption you choose, not a promised return.' })}
      {type === 'fd' && <div className="select-field"><label htmlFor="compounding">Compounding frequency</label><select id="compounding" value={values.frequency} onChange={e => set('frequency')(e.target.value)}><option value="1">Annually</option><option value="2">Half-yearly</option><option value="4">Quarterly</option><option value="12">Monthly</option></select></div>}
      <p className="input-note">Your numbers stay in your browser. No account needed.</p>
    </form>
    <div className="calculator-result" ref={resultRef}>
      <div className="result-top"><span>AN ILLUSTRATIVE ESTIMATE</span><TrendingUp size={20} aria-hidden="true" /></div>
      <div className="result-announcement" role="status" aria-live="polite" aria-atomic="true">
        {result ? <><p className="result-label">{type === 'goal' ? 'Required monthly investment' : type === 'fd' ? 'Estimated maturity amount' : 'Your estimated future value'}</p><AnimatedAmount value={type === 'goal' ? result.monthlyRequired : result.final} /><p className="result-time">{type === 'goal' ? `For ${values.name.trim() || 'your goal'}, in ${values.years} years` : `At the end of ${values.years} years`}</p></> : <p className="result-error">Check the highlighted fields to see your estimate.</p>}
      </div>
      {result && <><div className="donut-wrap"><div className="donut" style={{ background: `conic-gradient(#B9CED0 0% ${contribution}%, #A69CC6 ${contribution}% 100%)` }} aria-hidden="true"><div className="donut-center"><span>{type === 'goal' ? 'Future goal cost' : 'Small steps.'}</span><strong>{type === 'goal' ? formatINR(result.futureCost) : 'More possibilities.'}</strong></div></div></div>
        <dl className="result-breakdown"><div><dt><i className="legend-dot contribution" />{type === 'goal' ? 'Projected existing savings' : type === 'fd' ? 'Invested amount' : 'Estimated invested amount'}</dt><dd>{formatINR(type === 'goal' ? result.projectedSavings : result.invested)}</dd></div><div><dt><i className="legend-dot growth" />{type === 'goal' ? 'Remaining goal gap' : type === 'fd' ? 'Total interest' : 'Estimated returns'}</dt><dd>{type === 'goal' ? formatINR(result.growth) : `${result.growth > 0 ? '↗ +' : ''}${formatINR(result.growth)}`}</dd></div></dl>
        {type === 'goal' && <><div className="goal-alternative"><span>Estimated future goal cost</span><strong>{formatINR(result.futureCost)}</strong><span>Alternative additional one-time investment</span><strong>{formatINR(result.oneTime)}</strong></div><div className="goal-progress"><label htmlFor="goal-progress">Current savings cover {Math.round(result.progress)}% of future cost</label><progress id="goal-progress" max="100" value={result.progress} /><p>At your assumed return, existing savings could cover {Math.round(result.projectedProgress)}% by your goal date.</p></div></>}
      </>}
      {result && <div className="result-context"><p className="result-assumption">{values.rate}% annual {type === 'fd' ? 'interest' : 'return'} assumption · {values.years} years</p><MotionDetails className="result-insight"><summary>Ask Finbharat <span>Understand this estimate <CircleHelp size={16} aria-hidden="true" /></span></summary><p>{type === 'goal' ? `At ${values.inflation}% inflation, your goal could cost ${formatINR(result.futureCost)}. The monthly estimate covers the gap after projected growth of your existing savings.` : type === 'fd' ? `Your ${formatINR(result.invested)} deposit could earn ${formatINR(result.growth)} in interest. This assumes interest is reinvested ${values.frequency} time${values.frequency === '1' ? '' : 's'} per year at a constant rate.` : `About ${Math.round(contribution)}% of this estimate comes from your contributions. The rest is projected growth using your chosen return. Try a lower return assumption to see a more cautious scenario.`}</p><p className="insight-limitation">An explanation of your inputs, not an AI recommendation. Taxes and fees are excluded.</p></MotionDetails><a className="result-app-link" href="/#download">Explore the Finbharat app <ArrowUpRight size={16} aria-hidden="true" /></a><span className="result-app-status">Download availability to be confirmed.</span></div>}
      <p className="result-footnote">{type === 'goal' ? 'The one-time amount is an alternative to monthly investing, in addition to your current savings.' : 'A starting point for a conversation with your future.'}</p>
    </div>
    <div className="calculator-disclaimer"><CircleHelp size={17} aria-hidden="true" /><p>{disclaimer}</p></div>
    <details className="assumptions"><summary>Understand the calculation and assumptions</summary><div>{type === 'fd' ? <p>Compound interest: A = P × (1 + r/n)^(n × t). P is your principal, r is the annual rate as a decimal, n is compounding periods per year, and t is tenure in years. Assumes a constant rate, reinvested interest and no tax, fees or early withdrawals.</p> : type === 'sip' ? <p>Monthly SIP: M × ((1 + i)^m − 1) / i × (1 + i), plus the initial investment × (1 + i)^m. M is your monthly contribution, i is the annual rate divided by 12, and m is total months. Contributions occur at the beginning of each month. Assumes a constant return without taxes, fees or missed contributions. Market returns can be negative; this model explores non-negative return assumptions.</p> : <p>Future cost = current cost × (1 + inflation)^years. Current savings are grown at the annual return divided by 12, compounded monthly. The remaining shortfall is divided by a beginning-of-month SIP annuity factor to estimate the monthly contribution. The alternative additional one-time amount is the discounted shortfall. No fees, taxes or withdrawals are included. At zero return, the shortfall is divided evenly across the months.</p>}<p>All inputs are user-provided assumptions. Displayed rupee amounts are rounded to whole rupees; these are projections, not guaranteed outcomes.</p></div></details>
    {embedded && <a className="text-link calculator-full-link" href={calculatorInfo[type].path}>Explore the {type === 'sip' ? 'SIP' : type === 'fd' ? 'FD' : 'goal'} calculator <ArrowUpRight size={16} /></a>}
  </div>;
}
