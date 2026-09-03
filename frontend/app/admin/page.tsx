import { AdminDashboard } from "@/components/AdminDashboard";
export const metadata = {
  title: "Raneem Admin",
  robots: { index: false, follow: false },
};
export default function AdminPage() {
  return <AdminDashboard />;
}
