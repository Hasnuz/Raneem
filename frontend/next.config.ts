import type { NextConfig } from "next";
const nextConfig: NextConfig = { images: { formats: ["image/avif", "image/webp"] }, poweredByHeader: false,
  async redirects(){return [
    {source:"/business-setup-uae",destination:"/services/business-setup-uae",permanent:true},{source:"/business-setup-dubai",destination:"/services/business-setup-dubai",permanent:true},{source:"/business-setup/mainland-company-formation",destination:"/services/mainland-company-formation",permanent:true},{source:"/business-setup/free-zone-company-formation",destination:"/services/free-zone-company-formation",permanent:true},{source:"/pro-services-dubai",destination:"/services/pro-services-dubai",permanent:true},{source:"/visa-services-uae",destination:"/services/uae-visa-services",permanent:true},{source:"/document-attestation-dubai",destination:"/services/document-attestation-dubai",permanent:true},{source:"/legal-translation-dubai",destination:"/services/legal-translation-dubai",permanent:true},{source:"/trade-license-renewal-dubai",destination:"/services/trade-license-renewal-dubai",permanent:true}
  ]}
};
export default nextConfig;
