export type Service = {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  description: string;
  includes: string[];
  audience: string[];
  notFor?: string[];
  requiredDocuments?: string[];
  processSteps?: string[];
  costFactors?: string[];
  timingFactors?: string[];
  authorities?: string[];
  delayCauses?: string[];
  reviewedAt?: string;
  faq: { q: string; a: string }[];
  related: string[];
};
export const services: Service[] = [
  {
    slug: "business-setup-uae",
    title: "Business Setup in the UAE",
    eyebrow: "COMPANY FORMATION · UAE",
    summary:
      "Practical support for selecting a jurisdiction, preparing documents and coordinating your UAE company formation.",
    description:
      "The right setup depends on your activity, ownership, market, visa needs and chosen authority. Raneem helps you compare the practical implications before coordinating each stage of the application.",
    includes: [
      "Activity and jurisdiction guidance",
      "Trade-name and initial approval coordination",
      "Licence application support",
      "Visa and establishment support",
      "Ongoing PRO and renewal assistance",
    ],
    audience: [
      "First-time founders",
      "International investors",
      "Existing companies entering the UAE",
    ],
    related: [
      "business-setup-dubai",
      "mainland-company-formation",
      "free-zone-company-formation",
    ],
    faq: [
      {
        q: "How do I choose between mainland, free zone and offshore?",
        a: "The suitable route depends on where you will trade, the activity, ownership structure, office needs and visa plans. A consultation should assess these factors before an application is started.",
      },
      {
        q: "How much does UAE company formation cost?",
        a: "Costs vary by jurisdiction, activity, licence, premises, visas and approvals. Raneem provides a requirement-based estimate after reviewing your plans.",
      },
      {
        q: "What documents are normally requested?",
        a: "Authorities commonly request identity, contact and proposed company information, but exact requirements depend on the shareholders, activity and authority.",
      },
    ],
  },
  {
    slug: "business-setup-dubai",
    title: "Business Setup in Dubai",
    eyebrow: "COMPANY FORMATION · DUBAI",
    summary:
      "Form a Dubai company with clear guidance across licensing, approvals, documentation and post-licence support.",
    description:
      "Dubai offers different company-formation routes. We help founders understand the operational differences and coordinate applications with the relevant authority.",
    includes: [
      "Mainland and free-zone comparison",
      "Business activity review",
      "Licence and approval coordination",
      "Investor and employee visa support",
      "PRO services after formation",
    ],
    audience: [
      "Dubai-based entrepreneurs",
      "Foreign investors",
      "Companies expanding into Dubai",
    ],
    related: [
      "business-setup-uae",
      "mainland-company-formation",
      "free-zone-company-formation",
    ],
    faq: [
      {
        q: "Can a foreign investor start a company in Dubai?",
        a: "Many structures allow foreign ownership, but the applicable position depends on the activity, legal form and authority. Current requirements should be checked for each application.",
      },
      {
        q: "How long does setup take?",
        a: "Timing varies with the activity, approvals, documents and chosen jurisdiction. Raneem will outline likely stages after reviewing the case.",
      },
    ],
  },
  {
    slug: "mainland-company-formation",
    title: "Mainland Company Formation",
    eyebrow: "BUSINESS SETUP · DUBAI",
    summary:
      "Dubai mainland licensing support for businesses that want broad access to the UAE market.",
    description:
      "A mainland structure may suit businesses serving customers across the UAE or requiring specific premises and activities. We coordinate the licence journey and related government processes.",
    includes: [
      "Activity and legal-form review",
      "Trade-name reservation",
      "Initial approval support",
      "Licence documentation",
      "Visa and labour establishment support",
    ],
    audience: [
      "Local-market businesses",
      "Professional service firms",
      "Growing SMEs",
    ],
    related: ["business-setup-dubai", "trade-license", "pro-services-dubai"],
    faq: [
      {
        q: "Is a mainland company right for every business?",
        a: "No. Suitability depends on commercial plans, activity, premises, staffing and regulatory needs.",
      },
      {
        q: "Are office premises required?",
        a: "Premises requirements vary by activity, legal form and authority. Confirm the current rule before committing to a lease.",
      },
    ],
  },
  {
    slug: "free-zone-company-formation",
    title: "Free Zone Company Formation",
    eyebrow: "BUSINESS SETUP · UAE",
    summary:
      "Compare free-zone options based on activity, facilities, visa capacity and operating model.",
    description:
      "UAE free zones differ in permitted activities, facilities, processes and cost components. Raneem helps narrow the options and coordinates the selected application.",
    includes: [
      "Free-zone comparison",
      "Package and activity review",
      "Application preparation",
      "Licence coordination",
      "Visa and post-licence support",
    ],
    audience: [
      "International founders",
      "Digital and consulting businesses",
      "Export-oriented companies",
    ],
    related: ["business-setup-uae", "business-setup-dubai", "investor-visa"],
    faq: [
      {
        q: "Which UAE free zone should I choose?",
        a: "Choose against actual needs: activity, customer location, facilities, visa allocation and budget—not a headline package alone.",
      },
      {
        q: "Can a free-zone company trade in the mainland?",
        a: "The permitted route depends on the activity and current regulatory framework. Obtain case-specific guidance before trading.",
      },
    ],
  },
  {
    slug: "pro-services-dubai",
    title: "PRO Services in Dubai",
    eyebrow: "GOVERNMENT TRANSACTIONS · DUBAI",
    summary:
      "Reliable coordination for company, labour, immigration and government-document processes.",
    description:
      "Raneem supports businesses that need consistent handling of recurring government transactions, document preparation, applications and follow-up.",
    includes: [
      "Government transaction coordination",
      "Labour and immigration assistance",
      "Licence renewals and amendments",
      "Employee visa processing",
      "Document clearing and follow-up",
    ],
    audience: [
      "SMEs without an internal PRO",
      "HR and operations teams",
      "Established UAE companies",
    ],
    related: [
      "uae-visa-services",
      "trade-license-renewal-dubai",
      "document-attestation-dubai",
    ],
    faq: [
      {
        q: "What are PRO services?",
        a: "PRO services support administrative applications and liaison processes involving UAE authorities for companies, employees and investors.",
      },
      {
        q: "Can Raneem support employee visas?",
        a: "Yes. Raneem assists with employment visa and related labour and immigration coordination, subject to the applicable authority requirements.",
      },
      {
        q: "Can you handle recurring company transactions?",
        a: "Yes. Ongoing support can cover agreed renewals, amendments and employee-related processes.",
      },
    ],
  },
  {
    slug: "uae-visa-services",
    title: "UAE Visa Services",
    eyebrow: "VISA SUPPORT · UAE",
    summary:
      "Application coordination for employment, investor, partner, family and eligible long-term visa routes.",
    description:
      "Visa requirements and validity can change and depend on the applicant and sponsor. We review the case, explain the current process and coordinate the required steps.",
    includes: [
      "Visa route review",
      "Document checklist",
      "Application coordination",
      "Medical and Emirates ID process support",
      "Renewal and cancellation assistance",
    ],
    audience: [
      "Employers and HR teams",
      "Investors and partners",
      "Families and individuals",
    ],
    related: ["employment-visa", "investor-visa", "family-visa"],
    faq: [
      {
        q: "Which UAE visa route applies to me?",
        a: "That depends on your sponsor, purpose, professional or investment status and current eligibility rules.",
      },
      {
        q: "Can you guarantee visa approval?",
        a: "No service provider can guarantee an authority decision. Raneem can help prepare and coordinate a compliant application.",
      },
    ],
  },
  {
    slug: "document-attestation-dubai",
    title: "Document Attestation in Dubai",
    eyebrow: "DOCUMENT SERVICES · DUBAI",
    summary:
      "Attestation coordination for personal, educational and corporate documents used in the UAE.",
    description:
      "The route depends on where a document was issued and where it will be used. Raneem checks the document context and coordinates the appropriate stages.",
    includes: [
      "Requirement review",
      "Embassy or consular coordination where applicable",
      "MOFA attestation assistance",
      "Certificate and corporate document support",
      "Collection and delivery coordination",
    ],
    audience: [
      "Employees and job seekers",
      "Families",
      "Companies using overseas documents",
    ],
    related: [
      "certificate-attestation",
      "mofa-attestation",
      "legal-translation-dubai",
    ],
    faq: [
      {
        q: "Which documents can require attestation?",
        a: "Educational, civil-status and corporate documents may require attestation depending on their intended use.",
      },
      {
        q: "Is MOFA attestation always the only step?",
        a: "Not necessarily. The full chain depends on the issuing country, document type and receiving authority.",
      },
    ],
  },
  {
    slug: "legal-translation-dubai",
    title: "Legal Translation in Dubai",
    eyebrow: "ARABIC & ENGLISH · DUBAI",
    summary:
      "Coordination of legal translation for documents submitted to UAE authorities and organisations.",
    description:
      "Some official uses require translation by an appropriately authorised translator. We help identify the receiving body’s requirement and arrange the work accordingly.",
    includes: [
      "Arabic and English translation coordination",
      "Personal and corporate documents",
      "Submission-format review",
      "Attestation-related translation support",
      "Document collection and delivery",
    ],
    audience: [
      "Businesses",
      "Visa applicants",
      "Individuals submitting foreign-language documents",
    ],
    related: [
      "document-attestation-dubai",
      "mofa-attestation",
      "pro-services-dubai",
    ],
    faq: [
      {
        q: "Does every translated document need legal translation?",
        a: "No. The receiving organisation determines whether ordinary or legally certified translation is required.",
      },
      {
        q: "Can you translate and attest the same document?",
        a: "Raneem can coordinate both where the document and intended use require those stages.",
      },
    ],
  },
  {
    slug: "trade-license-renewal-dubai",
    title: "Trade Licence Renewal in Dubai",
    eyebrow: "LICENSING SUPPORT · DUBAI",
    summary:
      "Keep your company records and licence current with organised renewal coordination and follow-up.",
    description:
      "Renewal requirements can vary with the authority, activity, lease, external approvals and company records. We identify open requirements early and coordinate the submission.",
    includes: [
      "Licence status review",
      "Document checklist",
      "Renewal submission support",
      "Amendment coordination",
      "Related immigration and labour support",
    ],
    audience: [
      "Dubai mainland companies",
      "Free-zone entities",
      "Operations and finance teams",
    ],
    related: ["trade-license", "pro-services-dubai", "government-transactions"],
    faq: [
      {
        q: "When should renewal preparation begin?",
        a: "Begin early enough to resolve lease, approval or company-record issues before expiry. The appropriate lead time depends on the authority and case.",
      },
      {
        q: "Can changes be made during renewal?",
        a: "Some amendments can be coordinated with or around renewal, depending on the authority and type of change.",
      },
    ],
  },
];
export const bySlug = (slug: string) => services.find((s) => s.slug === slug);
