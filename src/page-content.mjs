export const motto = 'Keeping wealth simple. For everyone in Bharat.';

export const founders = [
  {
    name: 'D. Ramanathan', initials: 'DR', credential: 'CFP CM',
    role: 'Co-founder, Managing Director & CEO',
    company: 'FinBharat Technology Private Limited',
    location: 'Greater Chennai Area',
    biography: 'Managing Director & CEO at FinBharat Technology Private Limited. Reimagining wealth creation for Bharat.',
    linkedin: 'https://www.linkedin.com/in/d-ramanathan-cfp-cm-791b151b/',
  },
  {
    name: 'Rakesh K', initials: 'RK', credential: 'IIMC alumnus',
    role: 'Co-founder',
    company: 'FinBharat Technology Private Limited',
    location: 'Chennai, Tamil Nadu, India',
    biography: 'Co-founder at Finbharat Technology and an IIMC alumnus, based in Chennai, Tamil Nadu.',
    linkedin: 'https://www.linkedin.com/in/rakeshkgogetter/',
  },
];

export const productContent = {
  mutual: {
    name: 'Mutual funds', path: '/mutual-funds/', calculator: 'sip', art: 'milestones',
    headline: ['Mutual funds.', 'Made understandable.'],
    introduction: 'Your goals deserve more than jargon. Understand the possibilities, know the risks, and explore what investing over time could look like.',
    caption: 'A little understanding. A longer view.',
    heading: 'Understand the investment. Own the decision.',
    explanation: 'Mutual funds pool money from investors and invest in assets such as shares or bonds. The value can rise or fall with the underlying investments. Different funds have different objectives and risks.',
    source: 'https://investor.sebi.gov.in/investment-assetclasses.html', sourceLabel: 'SEBI: understanding investment assets',
    concepts: [
      { label: 'A SIP', title: 'A regular step, on your terms.', body: 'A systematic investment plan is a way to invest a chosen amount at regular intervals. It is a contribution method, not a separate asset class.', point: 'A regular investment schedule does not remove market risk or assure a profit.', icon: 'repeat', visual: 'rhythm' },
      { label: 'A one-time investment', title: 'One contribution. A considered choice.', body: 'A one-time investment puts an amount into a fund in a single contribution. Your choice of fund, time horizon and risk comfort still matter.', point: 'The value remains linked to the underlying investments, whatever the contribution method.', icon: 'layers', visual: 'layers' },
      { label: 'Risk & understanding', title: 'Read the risk. Look beyond the return.', body: 'Understand the scheme objective, asset mix, Riskometer, fees and redemption terms before deciding. Your needs and your ability to accept changes in value matter.', point: 'Past performance is not a guarantee of future returns. These explanations are educational.', icon: 'shield', visual: 'balance' },
    ],
    steps: [
      ['Start with your purpose', 'What are you planning for, and when might you need the money?'],
      ['Understand the fund', 'Consider its objective, underlying assets, costs and risks.'],
      ['Explore the possibilities', 'Use assumptions to see how time and contributions could interact.'],
      ['Make an informed decision', 'Take the time you need. A calculator is a planning aid, not a recommendation.'],
    ],
    calculatorHeading: 'Small steps. A clearer picture.',
    calculatorCopy: 'Use the SIP calculator to explore regular contributions, a starting investment, and a return assumption you choose.',
    faqs: [
      ['What is a mutual fund?', 'A mutual fund pools money from investors to invest in a portfolio of assets. Its value depends on the underlying investments and can go up or down.'],
      ['What is a SIP?', 'A SIP, or systematic investment plan, is a way to make regular contributions to an investment. It does not guarantee returns or eliminate market risk.'],
      ['Can mutual fund investments lose value?', 'Yes. Mutual funds are subject to market and other risks. Read the scheme documents, Riskometer and terms, and consider your circumstances before investing.'],
      ['Can I invest through this website?', 'This website provides educational information and illustrative calculators. It does not accept investments or list verified available funds. Product availability will be shared when confirmed.'],
    ],
  },
  fixed: {
    name: 'Fixed deposits', path: '/fixed-deposits/', calculator: 'fd', art: 'pathways',
    headline: ['Fixed deposits.', 'A clearer plan.'],
    introduction: 'Know the amount. Understand the timeline. See how interest is calculated. A thoughtful plan starts with knowing what the terms mean.',
    caption: 'Clear terms. More considered choices.',
    heading: 'A familiar idea. Worth understanding fully.',
    explanation: 'A fixed deposit places an amount with an institution for a chosen period under its deposit terms. The rate, tenure, interest treatment and withdrawal conditions shape the outcome.',
    source: 'https://www.rbi.org.in/scripts/FAQView.aspx?Id=18', sourceLabel: 'RBI: bank deposit guidance',
    concepts: [
      { label: 'Rate & tenure', title: 'Two numbers. A lot of context.', body: 'The interest rate and the time your deposit is held both affect the estimate. Use the actual rate and tenure in the institution’s terms when planning.', point: 'A calculator’s sample rate is an assumption, not a current offer from an institution.', icon: 'clock', visual: 'rhythm' },
      { label: 'Compounding', title: 'Understand what happens to the interest.', body: 'When interest is reinvested, future interest is calculated on a growing balance. The calculator lets you explore annual, half-yearly, quarterly or monthly compounding.', point: 'Interest payout deposits work differently from deposits that reinvest interest.', icon: 'layers', visual: 'layers' },
      { label: 'Before you commit', title: 'The terms deserve your attention.', body: 'Check the institution, interest payout options, maturity instructions, applicable taxes and any early withdrawal conditions before placing a deposit.', point: 'Early withdrawal can change the interest received. Check the applicable deposit terms.', icon: 'shield', visual: 'balance' },
    ],
    steps: [
      ['Choose your amount', 'Start with an amount that fits your circumstances.'],
      ['Understand the terms', 'Read the rate, tenure, payout and withdrawal conditions.'],
      ['Explore the estimate', 'See invested amount and interest separately in the calculator.'],
      ['Plan the next step', 'Check maturity instructions and the institution’s actual terms.'],
    ],
    calculatorHeading: 'Your deposit, in plain numbers.',
    calculatorCopy: 'Estimate maturity value and total interest with the principal, rate, tenure and compounding frequency you choose.',
    faqs: [
      ['What is a fixed deposit?', 'A fixed deposit holds an amount with an institution for a specified period under agreed terms. Read the institution’s conditions for the applicable rate, payout and withdrawal rules.'],
      ['How does compounding affect an FD?', 'With reinvested interest, compounding applies interest to the growing balance. More frequent compounding changes the maturity estimate when the nominal annual rate is the same.'],
      ['Does the FD calculator include tax or withdrawal penalties?', 'No. It assumes a constant rate and reinvested interest, without tax, fees or early withdrawals. Actual outcomes may differ.'],
      ['Can I open a fixed deposit on this website?', 'This website provides educational information and an illustrative FD calculator. It does not open deposits or advertise verified institution offers. Availability will be shared when confirmed.'],
    ],
  },
};
