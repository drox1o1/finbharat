# Supplied FAQ and legal content

Imported on 13 October 2026 from the client's `FAQ-Finbharat.docx` and `TC -FINBHARAT.docx`.

- `/faq/`: all 94 questions across 15 expandable topics, including the source disclaimer. The client explicitly confirmed the Purse, Way2Wealth support, Shriram, NPS and insurance references on 13 October 2026.
- `/terms/`: the terms of use section, including the commission disclosure table.
- `/privacy/`: the privacy policy from the beginning of the terms document.

The wording is retained from the documents. Formatting changes are limited to headings, paragraph breaks, lists, table markup and clickable links. The empty “Date of last revision” label was omitted; no effective date or missing postal contact address was invented. Source references such as SIPL, Way2Wealth and Finbharat Brokers Private Limited remain as supplied. Importing the text does not constitute independent verification of its legal statements or current product terms.

## Editing

In WordPress, open **Website pages** and choose **Frequently asked questions**, **Terms and conditions**, or **Privacy**. FAQ topics have individual rich-text body fields. Preserve the topic structure; the frontend controls the accordion layout. Publish after editing.

The plugin seed and `src/cms/client-documents.json` contain the portable baseline. The Vercel demo currently builds from `content/demo-content.json`; WordPress changes do not automatically update that saved snapshot. Export content and commit the new snapshot for a demo update, or configure the documented hosted CMS publishing workflow for live editing.

The hosted Studio demo was updated directly, so it may contain content newer than the local Studio copy. Do not overwrite it with an older local preview snapshot.
