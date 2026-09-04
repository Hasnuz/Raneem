export const site = {
  name: "Raneem Businessmen Services",
  shortName: "Raneem",
  url: "https://raneembms.com",
  phoneDisplay: "+971 50 951 5270",
  phone: "+971509515270",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "971509515270",
  email: "hr.rbsuae@gmail.com",
  address: "Office 3, Sultan Lootah Building, Al Qusais 2, Dubai, UAE",
  maps: "https://www.google.com/maps/search/?api=1&query=Raneem+Businessmen+Services+Al+Qusais+2+Dubai",
};
export const waLink = (
  message = "Hello Raneem, I would like a free consultation.",
) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
