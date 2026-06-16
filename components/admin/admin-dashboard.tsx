"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    LayoutDashboard,
    Users,
    Package,
    Menu,
    Search,
    Bell,
    Sun,
    Moon,
    MoreVertical,
    Trash2,
    Edit,
    AlertTriangle,
    TrendingUp,
    ArrowUp,
    ArrowDown,
    ChevronLeft,
    ChevronRight,
    Home,
    AlertCircle,
    Bot,
    MessageSquare,
    CheckCircle2,
    XCircle,
    Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import ProductForm from "./product-form";
import UserForm from "./user-form";
import { ProductTable } from "./product-table";
import { CSVImportModal } from "./product-table/CSVImportModal";
import { BotAudioSettings } from "./BotAudioSettings";
import { useProducts } from "@/hooks/useProducts";
import { useUsers } from "@/hooks/useUsers";
import { getInventoryAlerts } from "@/lib/actions/inventory.actions";
import { signOutUser } from "@/lib/actions/user.actions";
import { exportProductsToCSV } from "@/lib/export";
import { Product, User } from "@/types";

// --- Mock Data ---

const KPI_DATA = [
    {
        title: "Total Revenue",
        value: "$45,231.89",
        change: "+20.1% from last month",
        icon: TrendingUp,
        color: "text-emerald-500",
    },
    {
        title: "New Orders",
        value: "+235",
        change: "+180.1% from last month",
        icon: Package,
        color: "text-blue-500",
    },
    {
        title: "Active Users",
        value: "1,200",
        change: "+19% from last month",
        icon: Users,
        color: "text-violet-500",
    },
    {
        title: "Stock Alerts",
        value: "12 Critical",
        change: "Requires attention",
        icon: AlertTriangle,
        color: "text-amber-500",
    },
];

const RECENT_ACTIVITY = [
    { id: "USR-9821", name: "Alice Freeman", email: "alice@example.com", date: "2024-03-15" },
    { id: "USR-2314", name: "Bob Smith", email: "bob@example.com", date: "2024-03-14" },
    { id: "USR-8722", name: "Charlie Brown", email: "charlie@example.com", date: "2024-03-14" },
    { id: "USR-1293", name: "Diana Prince", email: "diana@example.com", date: "2024-03-13" },
    { id: "USR-5541", name: "Evan Wright", email: "evan@example.com", date: "2024-03-12" },
];

type AdminTab = "dashboard" | "users" | "products" | "chatbot";

type ChatbotStatus = {
    webhook: {
        verifyTokenConfigured: boolean;
        pageAccessTokenConfigured: boolean;
    };
    telegram: {
        botTokenConfigured: boolean;
        chatIdConfigured: boolean;
    };
};

type MessengerLead = {
    id: string;
    psid: string;
    productId: string | null;
    productName: string;
    customerMessage: string;
    status: "new" | "contacted" | "closed";
    createdAt: string;
};

const CHATBOT_FLOW_STEPS = [
    "Greeting or product keyword shows the product carousel.",
    "Customer selects a product.",
    "Bot shows all color images for the selected product.",
    "Customer sends another message within 30 minutes.",
    "Telegram lead is sent and the lead is saved for admin review.",
];

const CHATBOT_KEYWORDS = [
    "hi",
    "hello",
    "សួស្តី",
    "ជំរាបសួរ",
    "shop",
    "product",
    "buy",
    "order",
    "មើល",
    "ទិញ",
    "អាវ",
    "ខោ",
];


// --- Main Admin Dashboard Component ---

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
    const [isDarkMode, setIsDarkMode] = useState(true);

    // Product State (React Query)
    const {
        products,
        pagination: productPagination,
        params: productParams,
        isLoading: productsLoading,
        deleteProduct: deleteProductMutation,
        setParams: setProductParams,
    } = useProducts();

    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
    const [isCSVImportOpen, setIsCSVImportOpen] = useState(false);

    // User State (React Query)
    const {
        users,
        pagination: userPagination,
        params: userParams,
        isLoading: usersLoading,
        setSearch: setSearchQuery,
        setRole: setRoleFilter,
        setSortBy: setSortBy,
        setSortOrder: setSortOrder,
        deleteUser: deleteUserMutation,
        setParams: setUserParams,
    } = useUsers();

    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isUserDeleteDialogOpen, setIsUserDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);

    // Low stock alerts
    const [lowStockProducts, setLowStockProducts] = useState<Product[] | undefined>(undefined);
    const [chatbotStatus, setChatbotStatus] = useState<ChatbotStatus | null>(null);
    const [messengerLeads, setMessengerLeads] = useState<MessengerLead[]>([]);
    const [isChatbotLoading, setIsChatbotLoading] = useState(false);
    const [botAudioSettings, setBotAudioSettings] = useState<Record<string, string>>({ greetingAudioUrl: '', productAudioUrl: '' });

    useEffect(() => {
        getInventoryAlerts(15).then((res) => {
            if (res.success && res.data) setLowStockProducts(res.data);
        });
    }, []);

    useEffect(() => {
        if (activeTab !== "chatbot") return;

        const loadChatbotData = async () => {
            setIsChatbotLoading(true);
            try {
                const [statusRes, leadsRes, audioRes] = await Promise.all([
                    fetch("/api/chatbot/status"),
                    fetch("/api/messenger-leads?limit=10"),
                    fetch("/api/bot-settings"),
                ]);

                if (!statusRes.ok || !leadsRes.ok) {
                    throw new Error("Failed to load chatbot data");
                }

                const statusData = await statusRes.json();
                const leadsData = await leadsRes.json();
                const audioData = audioRes.ok ? await audioRes.json() : {};
                setChatbotStatus(statusData);
                setMessengerLeads(leadsData.leads ?? []);
                setBotAudioSettings(audioData);
            } catch {
                toast.error("Failed to load chatbot data");
            } finally {
                setIsChatbotLoading(false);
            }
        };

        loadChatbotData();
    }, [activeTab]);

    // Toggle Dark Mode (Mock implementation - ideally use next-themes)
    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    // Sync dark mode with HTML element
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDarkMode]);

    // User Management Handlers
    const confirmDeleteUser = (id: string) => {
        setUserToDelete(id);
        setIsUserDeleteDialogOpen(true);
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;
        await deleteUserMutation(userToDelete);
        setIsUserDeleteDialogOpen(false);
        setUserToDelete(null);
    };

    const confirmDeleteProduct = (id: string) => {
        setProductToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteProduct = async () => {
        if (!productToDelete) return;
        await deleteProductMutation(productToDelete);
        setIsDeleteDialogOpen(false);
        setProductToDelete(null);
    };

    const handleExport = () => {
        if (products.length === 0) {
            toast.error("No products to export");
            return;
        }
        exportProductsToCSV(products, `products-export-${new Date().toISOString().split("T")[0]}.csv`);
        toast.success(`Exported ${products.length} products`);
    };

    const handleBulkDelete = () => {
        if (selectedProductIds.length === 0) return;
        const count = selectedProductIds.length;
        Promise.all(selectedProductIds.map((id) => deleteProductMutation(id)))
            .then(() => {
                toast.success(`Deleted ${count} products`);
                setSelectedProductIds([]);
            })
            .catch(() => {
                toast.error("Failed to delete some products");
            });
    };

    const handleLeadStatusChange = async (id: string, status: MessengerLead["status"]) => {
        const previousLeads = messengerLeads;
        setMessengerLeads((leads) => leads.map((lead) => lead.id === id ? { ...lead, status } : lead));

        try {
            const res = await fetch("/api/messenger-leads", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status }),
            });

            if (!res.ok) throw new Error("Failed to update lead");
            toast.success("Lead status updated");
        } catch {
            setMessengerLeads(previousLeads);
            toast.error("Failed to update lead status");
        }
    };

    // --- Sub-Components ---

    const SidebarContent = () => (
        <div className="flex h-full flex-col gap-4">
            <div className="flex h-14 items-center border-b px-6">
                <Package className="mr-2 h-6 w-6 text-primary" />
                <span className="text-lg font-bold tracking-tight">PROMELODY ADMIN</span>
            </div>
            <div className="flex-1 overflow-auto py-2">
                <nav className="grid items-start px-4 text-sm font-medium">
                    <Button
                        variant={activeTab === "dashboard" ? "secondary" : "ghost"}
                        className="justify-start"
                        onClick={() => setActiveTab("dashboard")}
                    >
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                    </Button>
                    <Button
                        variant={activeTab === "users" ? "secondary" : "ghost"}
                        className="justify-start"
                        onClick={() => setActiveTab("users")}
                    >
                        <Users className="mr-2 h-4 w-4" />
                        Users
                    </Button>
                    <Button
                        variant={activeTab === "products" ? "secondary" : "ghost"}
                        className="justify-start"
                        onClick={() => setActiveTab("products")}
                    >
                        <Package className="mr-2 h-4 w-4" />
                        Products
                    </Button>
                    <Button
                        variant={activeTab === "chatbot" ? "secondary" : "ghost"}
                        className="justify-start"
                        onClick={() => setActiveTab("chatbot")}
                    >
                        <Bot className="mr-2 h-4 w-4" />
                        Chat Bot
                    </Button>
                </nav>
            </div>
            {/* <div className="mt-auto border-t p-4">
                <Card>
                    <CardHeader className="p-4">
                        <CardTitle className="text-sm">Pro Plan</CardTitle>
                        <div className="text-xs text-muted-foreground">
                            Your team is on the Pro plan.
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <Button size="sm" className="w-full">
                            Upgrade
                        </Button>
                    </CardContent>
                </Card>
            </div> */}
        </div>
    );

    return (
        <div className={cn("flex min-h-screen w-full bg-muted/40", isDarkMode ? "dark" : "")}>
            {/* Sidebar (Desktop) */}
            <div className="hidden border-r bg-background md:block md:w-64 lg:w-72">
                <SidebarContent />
            </div>

            <div className="flex flex-1 flex-col">
                {/* Header */}
                <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-6 shadow-sm">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="md:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0">
                            <SidebarContent />
                        </SheetContent>
                    </Sheet>
                    <div className="w-full flex-1">
                        <form>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search..."
                                    autoComplete="off"
                                    suppressHydrationWarning
                                    className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                                />
                            </div>
                        </form>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/" title="Go to Store" target="_blank" rel="noopener noreferrer">
                                <Home className="h-5 w-5" />
                            </Link>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={toggleTheme}>
                            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </Button>
                        <Button variant="ghost" size="icon">
                            <Bell className="h-5 w-5" />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <span className="text-xs font-bold text-primary">AD</span>
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer" onClick={async () => {
                                    await signOutUser();
                                    window.location.href = '/';
                                }}>Logout</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                    {activeTab === "dashboard" && (
                        <>
                            {/* KPI Grid */}
                            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                                {KPI_DATA.map((kpi, index) => (
                                    <Card key={index}>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">
                                                {kpi.title}
                                            </CardTitle>
                                            <kpi.icon className={cn("h-4 w-4", kpi.color)} />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">{kpi.value}</div>
                                            <p className="text-xs text-muted-foreground">
                                                {kpi.change}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {lowStockProducts && lowStockProducts.length > 0 && (
                                <Card className="border-amber-200 bg-amber-50/50">
                                    <CardHeader className="flex flex-row items-center gap-2 pb-2">
                                        <AlertCircle className="h-5 w-5 text-amber-500" />
                                        <CardTitle className="text-sm font-medium text-amber-800">Low Stock Alerts</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {lowStockProducts!.slice(0, 5).map((p: Product) => (
                                                <div key={p.id} className="flex items-center justify-between text-sm">
                                                    <span className="text-amber-700 font-medium truncate">{p.name}</span>
                                                    <span className="text-amber-600 font-bold ml-2">{p.stock} left</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                                {/* Recent Activity */}
                                <Card className="xl:col-span-2">
                                    <CardHeader>
                                        <CardTitle>Recent Activity</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-8">
                                            {RECENT_ACTIVITY.map((activity) => (
                                                <div key={activity.id} className="flex items-center">
                                                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                        {activity.name.charAt(0)}
                                                    </div>
                                                    <div className="ml-4 space-y-1">
                                                        <p className="text-sm font-medium leading-none">
                                                            {activity.name}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {activity.email}
                                                        </p>
                                                    </div>
                                                    <div className="ml-auto font-medium text-sm text-muted-foreground">
                                                        {activity.date}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Sales Chart Placeholder */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Revenue Trend</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-[300px] w-full rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-dashed">
                                            <div className="text-center">
                                                <TrendingUp className="h-10 w-10 text-primary mx-auto mb-2 opacity-50" />
                                                <p className="text-muted-foreground text-sm">Chart Visualization Placeholder</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </>
                    )}

                    {activeTab === "users" && (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Users Management</CardTitle>
                                <Dialog open={isUserModalOpen} onOpenChange={(open) => {
                                    setIsUserModalOpen(open);
                                    if (!open) setEditingUser(null);
                                }}>
                                    <DialogTrigger asChild>
                                        <Button onClick={() => setEditingUser(null)}>
                                            <Users className="mr-2 h-4 w-4" />
                                            Add User
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
                                            <DialogDescription>
                                                {editingUser ? "Update user details below." : "Fill in the details below to create a new user."}
                                            </DialogDescription>
                                        </DialogHeader>
                                        <UserForm setOpen={setIsUserModalOpen} user={editingUser} />
                                    </DialogContent>
                                </Dialog>

                                {/* Delete User Confirmation Dialog */}
                                <Dialog open={isUserDeleteDialogOpen} onOpenChange={setIsUserDeleteDialogOpen}>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle className="flex items-center gap-2 text-red-600">
                                                <AlertTriangle className="h-5 w-5" />
                                                Confirm Deletion
                                            </DialogTitle>
                                            <DialogDescription>
                                                Are you sure you want to delete this user? This action cannot be undone.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter className="gap-2 sm:gap-0">
                                            <Button variant="outline" onClick={() => setIsUserDeleteDialogOpen(false)}>
                                                Cancel
                                            </Button>
                                            <Button variant="destructive" onClick={handleDeleteUser} disabled={usersLoading}>
                                                {usersLoading ? "Deleting..." : "Delete User"}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </CardHeader>
                            <CardContent>
                                {/* Filter Controls */}
                                <div className="flex flex-wrap gap-4 mb-4">
                                    {/* Search */}
                                    <div className="relative flex-1 min-w-[200px]">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search users..."
                                            value={userParams?.search || ""}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-8"
                                        />
                                    </div>

                                    {/* Role Filter */}
                                    <select
                                        value={userParams?.role || ""}
                                        onChange={(e) => setRoleFilter(e.target.value)}
                                        className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
                                    >
                                        <option value="">All Roles</option>
                                        <option value="admin">Admin</option>
                                        <option value="user">User</option>
                                    </select>

                                    {/* Sort By */}
                                    <select
                                        value={userParams?.sortBy || "createdAt"}
                                        onChange={(e) => setSortBy(e.target.value as 'name' | 'email' | 'createdAt' | 'role')}
                                        className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
                                    >
                                        <option value="createdAt">Sort by: Created Date</option>
                                        <option value="name">Sort by: Name</option>
                                        <option value="email">Sort by: Email</option>
                                        <option value="role">Sort by: Role</option>
                                    </select>

                                    {/* Sort Order Toggle */}
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setSortOrder(userParams?.sortOrder === 'asc' ? 'desc' : 'asc')}
                                        title={userParams?.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                                    >
                                        {userParams?.sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                                    </Button>
                                </div>

                                <div className="rounded-md border">
                                    <div className="relative w-full overflow-auto">
                                        <table className="w-full caption-bottom text-sm">
                                            <thead className="[&_tr]:border-b">
                                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Role</th>
                                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Phone</th>
                                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Created Date</th>
                                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="[&_tr:last-child]:border-0">
                                                {usersLoading ? (
                                                    <tr>
                                                        <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                                            Loading users...
                                                        </td>
                                                    </tr>
                                                ) : users.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                                            No users found
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    users.map((user) => (
                                                        <tr key={user.id} className="border-b transition-colors hover:bg-muted/50">
                                                            <td className="p-4 align-middle">{user.name}</td>
                                                            <td className="p-4 align-middle">{user.email}</td>
                                                            <td className="p-4 align-middle">
                                                                <span className={cn(
                                                                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                                                                    user.role === "admin" ? "bg-primary/10 text-primary" : "bg-secondary text-secondary-foreground"
                                                                )}>
                                                                    {user.role}
                                                                </span>
                                                            </td>
                                                            <td className="p-4 align-middle">{user.phoneNumber || "N/A"}</td>
                                                            <td className="p-4 align-middle">
                                                                {new Date(user.createdAt).toLocaleDateString()}
                                                            </td>
                                                            <td className="p-4 align-middle text-right">
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                                            <span className="sr-only">Open menu</span>
                                                                            <MoreVertical className="h-4 w-4" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                        <DropdownMenuItem onClick={() => {
                                                                            setEditingUser(user);
                                                                            setIsUserModalOpen(true);
                                                                        }}>
                                                                            <Edit className="mr-2 h-4 w-4" /> Edit
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuSeparator />
                                                                        <DropdownMenuItem className="text-red-600" onClick={() => confirmDeleteUser(user.id)}>
                                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Pagination Controls */}
                                {userPagination && (
                                    <div className="flex items-center justify-between px-2 py-4">
                                        <div className="text-sm text-muted-foreground">
                                            Showing {((userPagination.page - 1) * userPagination.limit) + 1} to {Math.min(userPagination.page * userPagination.limit, userPagination.total)} of {userPagination.total} users
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setUserParams({ page: userPagination.page - 1 })}
                                                disabled={userPagination.page === 1}
                                            >
                                                <ChevronLeft className="h-4 w-4 mr-1" />
                                                Previous
                                            </Button>
                                            <div className="text-sm font-medium">
                                                Page {userPagination.page} of {userPagination.totalPages}
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setUserParams({ page: userPagination.page + 1 })}
                                                disabled={userPagination.page === userPagination.totalPages}
                                            >
                                                Next
                                                <ChevronRight className="h-4 w-4 ml-1" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === "products" && (
                        <>
                            <ProductTable
                                products={products}
                                pagination={productPagination}
                                params={productParams}
                                isLoading={productsLoading}
                                isFetching={false}
                                onParamsChange={(newParams) => setProductParams(newParams)}
                                onEdit={(product) => {
                                    setEditingProduct(product);
                                    setIsProductModalOpen(true);
                                }}
                                onDelete={confirmDeleteProduct}
                                onClone={(product) => {
                                    setEditingProduct({
                                        ...product,
                                        id: "",
                                        createdAt: new Date(),
                                        name: `${product.name} (Copy)`,
                                        slug: `${product.slug}-copy`,
                                    });
                                    setIsProductModalOpen(true);
                                }}
                                onAddClick={() => {
                                    setEditingProduct(null);
                                    setIsProductModalOpen(true);
                                }}
                                onExport={handleExport}
                                onImport={() => setIsCSVImportOpen(true)}
                                onBulkDelete={handleBulkDelete}
                                selectedIds={selectedProductIds}
                                onSelectionChange={setSelectedProductIds}
                            />

                            {/* Product Form Modal */}
                            <Dialog open={isProductModalOpen} onOpenChange={(open) => {
                                setIsProductModalOpen(open);
                                if (!open) setEditingProduct(null);
                            }}>
                                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                                    <ProductForm setOpen={setIsProductModalOpen} product={editingProduct} />
                                </DialogContent>
                            </Dialog>

                            {/* Delete Confirmation Dialog */}
                            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle className="flex items-center gap-2 text-red-600">
                                            <AlertTriangle className="h-5 w-5" />
                                            Confirm Deletion
                                        </DialogTitle>
                                        <DialogDescription>
                                            Are you sure you want to delete this product? This action cannot be undone and will permanently remove the product from the catalog.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter className="gap-2 sm:gap-0">
                                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button variant="destructive" onClick={handleDeleteProduct}>
                                            Delete Product
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            {/* CSV Import Modal */}
                            <CSVImportModal
                                open={isCSVImportOpen}
                                onOpenChange={setIsCSVImportOpen}
                                onSuccess={() => setProductParams({ page: 1 })}
                            />
                        </>
                    )}

                    {activeTab === "chatbot" && (
                        <div className="space-y-6">
                            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h1 className="text-2xl font-semibold tracking-tight">Chat Bot</h1>
                                    <p className="text-sm text-muted-foreground">
                                        Manage the Messenger product flow, Telegram alerts, and customer leads.
                                    </p>
                                </div>
                                <Button variant="outline" onClick={() => setActiveTab("products")}>
                                    <Package className="mr-2 h-4 w-4" />
                                    Manage Products
                                </Button>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Webhook</CardTitle>
                                        <Bot className="h-4 w-4 text-blue-500" />
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span>Verify token</span>
                                            {chatbotStatus?.webhook.verifyTokenConfigured ? (
                                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                            ) : (
                                                <XCircle className="h-4 w-4 text-red-500" />
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span>Page token</span>
                                            {chatbotStatus?.webhook.pageAccessTokenConfigured ? (
                                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                            ) : (
                                                <XCircle className="h-4 w-4 text-red-500" />
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Telegram</CardTitle>
                                        <Send className="h-4 w-4 text-emerald-500" />
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span>Bot token</span>
                                            {chatbotStatus?.telegram.botTokenConfigured ? (
                                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                            ) : (
                                                <XCircle className="h-4 w-4 text-red-500" />
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span>Chat ID</span>
                                            {chatbotStatus?.telegram.chatIdConfigured ? (
                                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                            ) : (
                                                <XCircle className="h-4 w-4 text-red-500" />
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Recent Leads</CardTitle>
                                        <MessageSquare className="h-4 w-4 text-violet-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{messengerLeads.length}</div>
                                        <p className="text-xs text-muted-foreground">Latest saved Messenger leads</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Lead Capture</CardTitle>
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">30 min</div>
                                        <p className="text-xs text-muted-foreground">Selected product state expiry</p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Audio Settings */}
                            <BotAudioSettings initialSettings={botAudioSettings} />

                            <div className="grid gap-4 lg:grid-cols-3">
                                <Card className="lg:col-span-2">
                                    <CardHeader>
                                        <CardTitle>Messenger Leads</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="rounded-md border">
                                            <div className="relative w-full overflow-auto">
                                                <table className="w-full caption-bottom text-sm">
                                                    <thead className="[&_tr]:border-b">
                                                        <tr className="border-b">
                                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Product</th>
                                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Message</th>
                                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Time</th>
                                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="[&_tr:last-child]:border-0">
                                                        {isChatbotLoading ? (
                                                            <tr>
                                                                <td colSpan={4} className="p-8 text-center text-muted-foreground">
                                                                    Loading chatbot data...
                                                                </td>
                                                            </tr>
                                                        ) : messengerLeads.length === 0 ? (
                                                            <tr>
                                                                <td colSpan={4} className="p-8 text-center text-muted-foreground">
                                                                    No Messenger leads yet
                                                                </td>
                                                            </tr>
                                                        ) : (
                                                            messengerLeads.map((lead) => (
                                                                <tr key={lead.id} className="border-b transition-colors hover:bg-muted/50">
                                                                    <td className="p-4 align-top">
                                                                        <div className="font-medium">{lead.productName}</div>
                                                                        <div className="text-xs text-muted-foreground">PSID: {lead.psid}</div>
                                                                    </td>
                                                                    <td className="max-w-[280px] p-4 align-top">
                                                                        <p className="line-clamp-3">{lead.customerMessage}</p>
                                                                    </td>
                                                                    <td className="p-4 align-top text-muted-foreground">
                                                                        {new Date(lead.createdAt).toLocaleString()}
                                                                    </td>
                                                                    <td className="p-4 align-top">
                                                                        <select
                                                                            value={lead.status}
                                                                            onChange={(e) => handleLeadStatusChange(lead.id, e.target.value as MessengerLead["status"])}
                                                                            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                                                                        >
                                                                            <option value="new">New</option>
                                                                            <option value="contacted">Contacted</option>
                                                                            <option value="closed">Closed</option>
                                                                        </select>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className="space-y-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Current Bot Flow</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ol className="space-y-3 text-sm">
                                                {CHATBOT_FLOW_STEPS.map((step, index) => (
                                                    <li key={step} className="flex gap-3">
                                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                                                            {index + 1}
                                                        </span>
                                                        <span className="text-muted-foreground">{step}</span>
                                                    </li>
                                                ))}
                                            </ol>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Trigger Keywords</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex flex-wrap gap-2">
                                                {CHATBOT_KEYWORDS.map((keyword) => (
                                                    <span
                                                        key={keyword}
                                                        className="rounded-md border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground"
                                                    >
                                                        {keyword}
                                                    </span>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    )}

                </main>
            </div >
        </div >
    );
}
