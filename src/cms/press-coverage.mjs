const press = (slug, title, excerpt, date, sourceLabel, source, image, imageAlt, html) => ({
  id: slug, slug, path: `/media/${slug}/`, title, excerpt, date, modified: date,
  sourceLabel, source, image, imageAlt, imageCredit: `Image from the original ${sourceLabel} coverage.`,
  html, author: '', categories: [], mediaType: 'press', video: '', captions: '', transcript: '',
  seo: { title: `${sourceLabel}: ${title} | Finbharat`, description: excerpt },
});
export const defaultPressCoverage = [
  press('smestreet-next-100-million-indians',
    'FinBharat to Democratize Wealth Creation for the Next 100 Million Indians',
    'SMEStreet explores Finbharat’s ambition to help first-time investors take part in wealth creation through clearer financial education and accessible investment journeys.',
    '2026-09-30T05:35:37Z', 'SMEStreet',
    'https://smestreet.in/infocus/finbharat-to-democratize-wealth-creation-for-the-next-100-million-indians-12592501',
    '/press/smestreet-founders.webp', 'D. Ramanathan and Rakesh Kumar, Finbharat cofounders, pictured in SMEStreet’s coverage',
    '<p>SMEStreet looks at Finbharat’s ambition to bring more first-time investors into formal wealth creation. The coverage discusses financial education, different income levels and the needs of people who have been underserved by investment platforms.</p><p>Read the original report for the publication’s full account and the founders’ comments.</p>'),
  press('businessline-investment-platform-for-bharat',
    'Finance professionals unite to launch new investment platform for ‘Bharat’',
    'Businessline speaks with the founders about Finbharat’s planned platform for first-time investors, and the role of familiar languages and voice-led support.',
    '2026-09-17T15:46:55Z', 'The Hindu Businessline',
    'https://www.thehindubusinessline.com/money-and-banking/finance-professionals-unite-to-launch-new-investment-platform-for-bharat/article71477076.ece',
    '/press/businessline-d-ramanathan.webp', 'D. Ramanathan, Finbharat cofounder, managing director and CEO, pictured in Businessline’s coverage',
    '<p>Businessline reports on the founders’ plans for an investment platform designed around first-time investors. The interview covers accessible investment journeys, local-language communication and a proposed voice-based assistant.</p><p>The article describes plans as reported at the time of publication. Read the original interview for the complete context.</p>'),
];
