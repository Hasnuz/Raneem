import type { Request, Response } from "express";
import { z } from "zod";
import { Service } from "../models/Content.js";

const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(1500),
      }),
    )
    .min(1)
    .max(12),
});

type KnowledgeItem = {
  title: string;
  slug?: string;
  keywords: string[];
  answer: string;
};

const knowledge: KnowledgeItem[] = [
  {
    title: "Business setup in the UAE",
    slug: "business-setup-uae",
    keywords: [
      "business setup",
      "company setup",
      "company formation",
      "start company",
      "open company",
      "new business",
      "تأسيس شركة",
      "فتح شركة",
      "إنشاء شركة",
    ],
    answer:
      "Raneem can help compare UAE company structures, review activities and jurisdiction options, prepare documents, coordinate licensing and support post-licence requirements.",
  },
  {
    title: "Dubai mainland company formation",
    slug: "mainland-company-formation",
    keywords: [
      "mainland",
      "dubai mainland",
      "ded license",
      "det license",
      "شركة بر رئيسي",
      "شركة في دبي",
    ],
    answer:
      "Mainland setup may suit businesses needing broad UAE market access or particular activities and premises. Raneem assists with activity review, trade-name reservation, initial approval, licensing and establishment support.",
  },
  {
    title: "Free-zone company formation",
    slug: "free-zone-company-formation",
    keywords: [
      "free zone",
      "freezone",
      "فري زون",
      "منطقة حرة",
      "free zone company",
    ],
    answer:
      "Raneem helps compare UAE free zones based on activity, facilities, visa capacity and operating needs, then coordinates the selected application and post-licence steps.",
  },
  {
    title: "PRO services",
    slug: "pro-services-dubai",
    keywords: [
      "pro service",
      "government transaction",
      "government service",
      "labour transaction",
      "immigration transaction",
      "خدمات حكومية",
      "معاملات",
      "مندوب",
    ],
    answer:
      "Raneem provides PRO coordination for company, labour, immigration, licence and recurring government-document processes in Dubai and the UAE.",
  },
  {
    title: "UAE visa services",
    slug: "uae-visa-services",
    keywords: [
      "visa",
      "employment visa",
      "investor visa",
      "partner visa",
      "family visa",
      "residence visa",
      "تأشيرة",
      "فيزا",
      "إقامة",
    ],
    answer:
      "Raneem coordinates eligible employment, investor, partner and family visa processes, including document review and related medical and Emirates ID stages. Eligibility must be confirmed for each case.",
  },
  {
    title: "Trade licence renewal",
    slug: "trade-license-renewal-dubai",
    keywords: [
      "license renewal",
      "licence renewal",
      "renew license",
      "trade license",
      "trade licence",
      "رخصة تجارية",
      "تجديد الرخصة",
    ],
    answer:
      "Raneem supports trade licence renewals, requirement checks, amendments and related immigration or labour coordination. Requirements depend on the authority and company records.",
  },
  {
    title: "Document attestation",
    slug: "document-attestation-dubai",
    keywords: [
      "attestation",
      "certificate attestation",
      "document attestation",
      "mofa",
      "embassy attestation",
      "تصديق",
      "تصديق مستندات",
      "تصديق شهادة",
    ],
    answer:
      "Raneem coordinates attestation for educational, personal and corporate documents, including embassy or consular stages and MOFA support where applicable.",
  },
  {
    title: "Legal translation",
    slug: "legal-translation-dubai",
    keywords: [
      "translation",
      "legal translation",
      "arabic translation",
      "translate document",
      "ترجمة",
      "ترجمة قانونية",
    ],
    answer:
      "Raneem coordinates Arabic and English legal translation for personal and corporate documents intended for UAE authorities and organisations.",
  },
  {
    title: "Visa cancellation and status changes",
    keywords: [
      "visa cancellation",
      "cancel visa",
      "change status",
      "status change",
      "inside country visa",
      "إلغاء تأشيرة",
      "إلغاء إقامة",
      "تعديل الوضع",
    ],
    answer:
      "Raneem can coordinate eligible visa cancellation and status-change processes. The route depends on the sponsor, visa type, applicant location and current immigration record.",
  },
  {
    title: "Emirates ID and medical process",
    keywords: [
      "emirates id",
      "medical test",
      "medical fitness",
      "biometrics",
      "هوية إماراتية",
      "فحص طبي",
      "بصمة",
    ],
    answer:
      "For applicable residence applications, Raneem can help coordinate the medical fitness, Emirates ID application and related immigration stages. The exact sequence depends on the visa route and application status.",
  },
  {
    title: "Company amendments",
    keywords: [
      "company amendment",
      "license amendment",
      "change activity",
      "change partner",
      "change trade name",
      "تعديل رخصة",
      "تغيير نشاط",
      "تغيير شريك",
    ],
    answer:
      "Raneem can assist with eligible company and licence amendments such as activity, trade-name, partner or company-record changes. Required approvals and documents vary by authority and amendment type.",
  },
  {
    title: "Corporate bank account preparation",
    keywords: [
      "bank account",
      "business bank account",
      "corporate account",
      "فتح حساب بنكي",
      "حساب شركة",
    ],
    answer:
      "Raneem can help organise company documents commonly requested during corporate bank-account preparation. Account approval and compliance decisions remain entirely with the selected bank.",
  },
];

const containsArabic = (value: string) => /[\u0600-\u06ff]/.test(value);
const normalize = (value: string) =>
  value
    .toLowerCase()
    .replaceAll("bussiness", "business")
    .replaceAll("busines", "business")
    .replaceAll("lisence", "license")
    .replaceAll("licence", "license")
    .replaceAll("attastation", "attestation")
    .replaceAll("attestation", "attestation")
    .replaceAll("freezone", "free zone")
    .replace(/[^a-z0-9\u0600-\u06ff\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

function score(question: string, item: KnowledgeItem) {
  return Math.max(
    0,
    ...item.keywords.map((keyword) => {
      const normalizedKeyword = normalize(keyword);
      if (question.includes(normalizedKeyword))
        return Math.max(2, normalizedKeyword.split(" ").length * 2);
      return normalizedKeyword
        .split(" ")
        .filter((word) => word.length > 2 && question.includes(word)).length;
    }),
  );
}

function serviceLink(slug?: string) {
  return slug ? `\n\nLearn more: /services/${slug}` : "";
}

export async function chat(req: Request, res: Response) {
  const parsed = chatSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: "Please enter a shorter message" });

  const latest = [...parsed.data.messages]
    .reverse()
    .find((message) => message.role === "user")?.content;
  if (!latest)
    return res.status(400).json({ error: "Please enter a question" });

  const question = normalize(latest);
  const conversationQuestion = normalize(
    parsed.data.messages
      .filter((message) => message.role === "user")
      .slice(-3)
      .map((message) => message.content)
      .join(" "),
  );
  const arabic = containsArabic(latest);
  const staticContext = knowledge
    .map((item) => ({ item, score: score(conversationQuestion, item) }))
    .sort((a, b) => b.score - a.score)[0];

  if (
    /^(hi|hello|hey|good morning|good evening|مرحبا|السلام|اهلا)/.test(question)
  )
    return res.json({
      answer: arabic
        ? "مرحباً! يمكنني مساعدتك في خدمات تأسيس الشركات، التأشيرات، المعاملات الحكومية، تجديد الرخص، تصديق المستندات والترجمة. ما الخدمة التي تحتاجها؟"
        : "Hello! I can help you find information about company setup, visas, PRO services, licence renewals, attestation and translation. What do you need help with?",
    });

  if (/price|cost|fee|how much|quotation|quote|سعر|تكلفة|رسوم/.test(question))
    return res.json({
      answer: arabic
        ? "تختلف الرسوم حسب نوع الخدمة والجهة والنشاط وعدد التأشيرات والموافقات المطلوبة. أرسل تفاصيل طلبك عبر نموذج الاستفسار أو واتساب للحصول على عرض مناسب لحالتك."
        : `${staticContext && staticContext.score >= 2 ? `For ${staticContext.item.title}, ` : ""}fees depend on the authority, activity, visa requirements and approvals involved. Share your activity, preferred jurisdiction, number of owners and visa needs through the enquiry form or WhatsApp for an accurate quotation.`,
      suggestions: [
        "What information is needed for a quote?",
        "How can I contact Raneem?",
      ],
    });

  if (/how long|duration|time|days|timeline|مدة|كم يوم|وقت/.test(question))
    return res.json({
      answer: arabic
        ? "تختلف مدة الإنجاز حسب نوع المعاملة والجهة الحكومية واكتمال المستندات والموافقات. يمكن لفريق رنيم تأكيد المدة المتوقعة بعد مراجعة حالتك."
        : `${staticContext && staticContext.score >= 2 ? `For ${staticContext.item.title}, ` : ""}processing time varies by the authority, document readiness and required approvals. The team can give a realistic estimate after checking your documents and current status.`,
      suggestions: ["What documents will I need?", "Request a consultation"],
    });

  if (
    /document|documents|required|requirement|paperwork|مستند|مستندات|اوراق|متطلبات/.test(
      question,
    )
  )
    return res.json({
      answer:
        staticContext && staticContext.score >= 2
          ? `Documents for ${staticContext.item.title} depend on the applicant, authority and current status. Commonly requested items can include passport copies, contact details, photographs, existing company or visa records, and service-specific supporting documents. Raneem will provide a confirmed checklist after reviewing your case.`
          : "Document requirements depend on the service and authority. Tell me whether you need company setup, a visa, licence renewal, attestation or translation, and I can guide you more specifically.",
      suggestions: [
        "Business setup documents",
        "Visa documents",
        "Attestation documents",
      ],
    });

  if (
    /contact|phone|call|whatsapp|email|location|address|اتصال|هاتف|واتساب|عنوان|موقع/.test(
      question,
    )
  )
    return res.json({
      answer: arabic
        ? "يمكنك التواصل مع رنيم عبر الهاتف أو واتساب على +971 50 951 5270، أو إرسال طلبك من خلال نموذج الاستفسار في الموقع. مكتبنا في القصيص 2، دبي."
        : "You can call or WhatsApp Raneem on +971 50 951 5270, or submit the website enquiry form. Our office is in Al Qusais 2, Dubai.",
    });

  const managed = await Service.find({ status: "published" })
    .select("title slug summary description category")
    .lean();
  const dynamicKnowledge: KnowledgeItem[] = managed.map((service) => ({
    title: service.title,
    slug: service.slug,
    keywords: [
      service.title,
      service.slug.replaceAll("-", " "),
      service.category || "",
    ].filter(Boolean),
    answer:
      `${service.summary || ""}${service.description ? ` ${service.description}` : ""}`.trim(),
  }));
  const matches = [...dynamicKnowledge, ...knowledge]
    .map((item) => ({ item, score: score(conversationQuestion, item) }))
    .sort((a, b) => b.score - a.score);
  const match = matches[0];

  if (match && match.score >= 2)
    return res.json({
      answer: arabic
        ? `${match.item.answer}\n\nللتأكد من المتطلبات الحالية الخاصة بحالتك، تواصل مع فريق رنيم عبر نموذج الاستفسار أو واتساب.${serviceLink(match.item.slug)}`
        : `${match.item.answer}\n\nCurrent requirements should be confirmed for your particular case. You can contact the Raneem team through the enquiry form or WhatsApp.${serviceLink(match.item.slug)}`,
      suggestions: [
        "What documents will I need?",
        "How long does it take?",
        "How much does it cost?",
      ],
    });

  return res.json({
    answer: arabic
      ? "يمكنني الإجابة عن خدمات رنيم المتعلقة بتأسيس الشركات، التأشيرات، المعاملات الحكومية، الرخص، التصديق والترجمة. حاول ذكر الخدمة المطلوبة، أو تواصل مع الفريق عبر واتساب للحصول على مساعدة مباشرة."
      : "I can help with Raneem’s company setup, visa, PRO, licensing, attestation and translation services. Please mention the service you need, or use WhatsApp for direct help from the team.",
    suggestions: [
      "Start a company in the UAE",
      "Visa services",
      "PRO services",
      "Document attestation",
    ],
  });
}
