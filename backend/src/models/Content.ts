import { Schema, model } from "mongoose";
import { options, seoFields, slug } from "./shared.js";
const serviceSchema = new Schema(
  {
    title: { type: String, required: true },
    slug,
    eyebrow: String,
    summary: String,
    description: String,
    includes: [String],
    audience: [String],
    related: [String],
    category: String,
    order: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    featuredImage: String,
    notFor: [String],
    requiredDocuments: [String],
    processSteps: [String],
    costFactors: [String],
    timingFactors: [String],
    authorities: [String],
    delayCauses: [String],
    reviewedAt: Date,
    ar: {
      title: String,
      eyebrow: String,
      summary: String,
      description: String,
      includes: [String],
      audience: [String],
      notFor: [String],
      requiredDocuments: [String],
      processSteps: [String],
      costFactors: [String],
      timingFactors: [String],
      delayCauses: [String],
      faqs: [{ question: String, answer: String, _id: false }],
    },
    faqs: [{ question: String, answer: String, _id: false }],
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    ...seoFields,
  },
  options,
);
const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug,
    description: String,
    ...seoFields,
  },
  options,
);
const postSchema = new Schema(
  {
    title: { type: String, required: true },
    slug,
    excerpt: String,
    content: String,
    featuredImage: String,
    scheduledAt: Date,
    authorName: String,
    category: String,
    tags: [String],
    publishedAt: Date,
    status: {
      type: String,
      enum: ["draft", "review", "published"],
      default: "draft",
      index: true,
    },
    relatedServices: [String],
    sources: [{ title: String, url: String, reviewedAt: Date }],
    ...seoFields,
  },
  options,
);
const faqSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    service: { type: Schema.Types.ObjectId, ref: "Service" },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  options,
);
const testimonialSchema = new Schema(
  {
    name: { type: String, required: true },
    company: String,
    rating: { type: Number, min: 1, max: 5 },
    review: { type: String, required: true },
    reviewDate: Date,
    source: String,
    published: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  options,
);
const settingSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    value: Schema.Types.Mixed,
    group: String,
  },
  options,
);
const clientLogoSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    imageData: { type: String, required: true, select: false },
    mimeType: {
      type: String,
      required: true,
      enum: ["image/png", "image/jpeg", "image/webp"],
    },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true, index: true },
  },
  options,
);
export const Service = model("Service", serviceSchema);
export const Category = model("Category", categorySchema);
export const BlogPost = model("BlogPost", postSchema);
export const FAQ = model("FAQ", faqSchema);
export const Testimonial = model("Testimonial", testimonialSchema);
export const SiteSetting = model("SiteSetting", settingSchema);
export const ClientLogo = model("ClientLogo", clientLogoSchema);
