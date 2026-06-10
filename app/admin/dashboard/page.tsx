import AdminDashboard from "@/components/admin/admin-dashboard";
import { QueryProvider } from "@/providers/QueryProvider";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Dashboard | PROMELODY",
    description: "Manage your store, users, and products.",
};

export default function AdminDashboardPage() {
    return (
        <QueryProvider>
            <AdminDashboard />
        </QueryProvider>
    );
}