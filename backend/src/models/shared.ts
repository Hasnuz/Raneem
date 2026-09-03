export const seoFields = {
  seoTitle: { type: String, trim: true, maxlength: 70 },
  seoDescription: { type: String, trim: true, maxlength: 170 },
  canonicalUrl: { type: String, trim: true },
  focusKeyword: { type: String, trim: true },
  secondaryKeywords: [String],
  ogTitle: String,
  ogDescription: String,
  ogImage: String,
  noIndex: { type: Boolean, default: false },
  noFollow: { type: Boolean, default: false },
};
export const slug = {
  type: String,
  required: true,
  unique: true,
  index: true,
  lowercase: true,
  trim: true,
};
export const options = {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_: unknown, ret: Record<string, unknown>) => {
      delete ret.__v;
      return ret;
    },
  },
};
