# Discovery and SEO foundation

## Verified public information

- Name: Raneem Businessmen Services
- Established: 2001; current website states 25+ years of UAE experience
- Client-provided approved figure: 100,000+ clients served
- Office: Office 3, Sultan Lootah Building, Al Qusais 2, Dubai, UAE
- Phone / WhatsApp: +971 50 951 5270
- Public site email: `hr.rbsuae@gmail.com`
- Core public services: business setup and licensing, PRO services, visa processing, document attestation, legal translation and trade-licence services

Contact records show another email in some public profiles. Confirm the single preferred address before launch and update `frontend/lib/site.ts`.

## Current-site assessment

The current homepage communicates the core offer and trust claims, but concentrates most search intents on one page. The rebuild separates high-intent services, adds contextual links and FAQs, centralises contact data, uses server-rendered metadata and creates a content/API foundation. Before domain cutover, export the full indexed URL list from Search Console and the live CMS; search indexing alone is not a complete inventory.

## Initial intent map

| Page | Primary intent | Supporting intent |
|---|---|---|
| `/services/business-setup-uae` | business setup UAE | company formation UAE |
| `/services/business-setup-dubai` | business setup Dubai | company formation Dubai |
| `/services/mainland-company-formation` | mainland company formation Dubai | mainland licence |
| `/services/free-zone-company-formation` | free zone company setup UAE | UAE free zone company |
| `/services/pro-services-dubai` | PRO services Dubai | government PRO services |
| `/services/uae-visa-services` | UAE visa services | visa assistance Dubai |
| `/services/document-attestation-dubai` | document attestation Dubai | certificate attestation |
| `/services/legal-translation-dubai` | legal translation Dubai | Arabic legal translation |
| `/services/trade-license-renewal-dubai` | trade licence renewal Dubai | licence renewal service |

## Content governance

Regulatory facts must store source URL and review date. Prefer UAE Government, ICP, GDRFA, MOHRE, Dubai DET, MOF, FTA and the relevant free-zone authority. Draft content must not publish until reviewed. Avoid exact fees, guaranteed outcomes and universal timelines unless an official current source supports the exact scope.

## Redirect considerations

The framework contains redirects from the requested legacy-style public paths to canonical service URLs. Add every actual historic URL after Search Console/export review. Redirect each retired URL to the closest equivalent; do not blanket-redirect to the homepage.
