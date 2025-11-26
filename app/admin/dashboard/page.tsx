import AdminDashboard from "@/components/admin/admin-dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Dashboard | ProStore",
    description: "Manage your store, users, and products.",
};

export default function AdminDashboardPage() {
    return <AdminDashboard />;
}
