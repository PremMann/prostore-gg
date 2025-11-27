"use client";

import React, { useState, useEffect } from "react";
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
    Ban,
    AlertTriangle,
    TrendingUp,
    ArrowUp,
    ArrowDown,
    ChevronLeft,
    ChevronRight,
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

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    image: string | null;
    createdAt: Date;
    phoneNumber: string | null;
    emailVerified: Date | null;
}

interface Product {
    id: string;
    name: string;
    slug: string;
    category: string;
    price: string; // Decimal is returned as string/number usually, check convertToPlainObject
    stock: number;
    rating: string;
    createdAt: Date;
    images: string[];
}

// --- Main Admin Dashboard Component ---

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<"dashboard" | "users" | "products">("dashboard");
    const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
    const [users, setUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Pagination state
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);

    // Filter and sort state
    const [roleFilter, setRoleFilter] = useState<string>("");
    const [sortBy, setSortBy] = useState<'name' | 'email' | 'createdAt' | 'role'>('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Product State
    const [products, setProducts] = useState<Product[]>([]);
    const [productPage, setProductPage] = useState(1);
    const [productTotalPages, setProductTotalPages] = useState(1);
    const [productTotalCount, setProductTotalCount] = useState(0);
    const [productSearch, setProductSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [productSortBy, setProductSortBy] = useState<'name' | 'price' | 'rating' | 'createdAt'>('createdAt');
    const [productSortOrder, setProductSortOrder] = useState<'asc' | 'desc'>('desc');
    const [categories, setCategories] = useState<string[]>([]);

    // Toggle Dark Mode (Mock implementation - ideally use next-themes)
    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    // Fetch users when users tab is active or when filters/pagination change
    useEffect(() => {
        const fetchUsers = async () => {
            if (activeTab === "users") {
                setIsLoading(true);
                try {
                    const { getAllUsers } = await import("@/lib/actions/user.actions");
                    const result = await getAllUsers({
                        page,
                        limit,
                        search: searchQuery,
                        role: roleFilter || undefined,
                        sortBy,
                        sortOrder,
                    });
                    if (result.success && result.data) {
                        setUsers(result.data.users);
                        setTotalPages(result.data.pagination.totalPages);
                        setTotalUsers(result.data.pagination.total);
                    } else {
                        toast.error(result.message || "Failed to fetch users");
                    }
                } catch {
                    toast.error("Failed to fetch users");
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchUsers();
    }, [activeTab, page, limit, searchQuery, roleFilter, sortBy, sortOrder]);

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            if (activeTab === "products") {
                setIsLoading(true);
                try {
                    const { getAllProducts, getAllCategories } = await import("@/lib/actions/product.actions");

                    // Fetch categories if not already loaded
                    if (categories.length === 0) {
                        const catResult = await getAllCategories();
                        if (catResult.success && catResult.data) {
                            setCategories(catResult.data as string[]);
                        }
                    }

                    const result = await getAllProducts({
                        page: productPage,
                        limit, // Reuse same limit
                        search: productSearch,
                        category: categoryFilter || undefined,
                        sortBy: productSortBy,
                        sortOrder: productSortOrder,
                    });

                    if (result.success && result.data) {
                        setProducts(result.data.products as unknown as Product[]);
                        setProductTotalPages(result.data.pagination.totalPages);
                        setProductTotalCount(result.data.pagination.total);
                    } else {
                        toast.error(result.message || "Failed to fetch products");
                    }
                } catch {
                    toast.error("Failed to fetch products");
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchProducts();
    }, [activeTab, productPage, limit, productSearch, categoryFilter, productSortBy, productSortOrder, categories.length]);

    // Sync dark mode with HTML element
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDarkMode]);

    // Filter Users
    const handleDeleteUser = (id: string) => {
        setUsers(users.filter((u) => u.id !== id));
        toast.success("User deleted successfully");
    };

    // --- Sub-Components ---

    const SidebarContent = () => (
        <div className="flex h-full flex-col gap-4">
            <div className="flex h-14 items-center border-b px-6">
                <Package className="mr-2 h-6 w-6 text-primary" />
                <span className="text-lg font-bold tracking-tight">ProStore Admin</span>
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
                </nav>
            </div>
            <div className="mt-auto border-t p-4">
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
            </div>
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
                                    className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                                />
                            </div>
                        </form>
                    </div>
                    <div className="flex items-center gap-2">
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
                                <DropdownMenuItem>Settings</DropdownMenuItem>
                                <DropdownMenuItem>Support</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Logout</DropdownMenuItem>
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
                            </CardHeader>
                            <CardContent>
                                {/* Filter Controls */}
                                <div className="flex flex-wrap gap-4 mb-4">
                                    {/* Search */}
                                    <div className="relative flex-1 min-w-[200px]">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search users..."
                                            value={searchQuery}
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value);
                                                setPage(1); // Reset to first page on search
                                            }}
                                            className="pl-8"
                                        />
                                    </div>

                                    {/* Role Filter */}
                                    <select
                                        value={roleFilter}
                                        onChange={(e) => {
                                            setRoleFilter(e.target.value);
                                            setPage(1);
                                        }}
                                        className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    >
                                        <option value="">All Roles</option>
                                        <option value="admin">Admin</option>
                                        <option value="user">User</option>
                                    </select>

                                    {/* Sort By */}
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as 'name' | 'email' | 'createdAt' | 'role')}
                                        className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
                                        onClick={() => setSortOrder(order => order === 'asc' ? 'desc' : 'asc')}
                                        title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                                    >
                                        {sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
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
                                                {isLoading ? (
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
                                                                        <DropdownMenuItem>
                                                                            <Edit className="mr-2 h-4 w-4" /> Edit
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem>
                                                                            <Ban className="mr-2 h-4 w-4" /> Suspend
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuSeparator />
                                                                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteUser(user.id)}>
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
                                <div className="flex items-center justify-between px-2 py-4">
                                    <div className="text-sm text-muted-foreground">
                                        Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalUsers)} of {totalUsers} users
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                        >
                                            <ChevronLeft className="h-4 w-4 mr-1" />
                                            Previous
                                        </Button>
                                        <div className="text-sm font-medium">
                                            Page {page} of {totalPages}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                            disabled={page === totalPages}
                                        >
                                            Next
                                            <ChevronRight className="h-4 w-4 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === "products" && (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Products Management</CardTitle>
                                <Button>
                                    <Package className="mr-2 h-4 w-4" />
                                    Add Product
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {/* Filter Controls */}
                                <div className="flex flex-wrap gap-4 mb-4">
                                    {/* Search */}
                                    <div className="relative flex-1 min-w-[200px]">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search products..."
                                            value={productSearch}
                                            onChange={(e) => {
                                                setProductSearch(e.target.value);
                                                setProductPage(1);
                                            }}
                                            className="pl-8"
                                        />
                                    </div>

                                    {/* Category Filter */}
                                    <select
                                        value={categoryFilter}
                                        onChange={(e) => {
                                            setCategoryFilter(e.target.value);
                                            setProductPage(1);
                                        }}
                                        className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>

                                    {/* Sort By */}
                                    <select
                                        value={productSortBy}
                                        onChange={(e) => setProductSortBy(e.target.value as 'name' | 'price' | 'rating' | 'createdAt')}
                                        className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    >
                                        <option value="createdAt">Sort by: Created Date</option>
                                        <option value="name">Sort by: Name</option>
                                        <option value="price">Sort by: Price</option>
                                        <option value="rating">Sort by: Rating</option>
                                    </select>

                                    {/* Sort Order Toggle */}
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setProductSortOrder(order => order === 'asc' ? 'desc' : 'asc')}
                                        title={productSortOrder === 'asc' ? 'Ascending' : 'Descending'}
                                    >
                                        {productSortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                                    </Button>
                                </div>

                                <div className="rounded-md border">
                                    <div className="relative w-full overflow-auto">
                                        <table className="w-full caption-bottom text-sm">
                                            <thead className="[&_tr]:border-b">
                                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Price</th>
                                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Stock</th>
                                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Rating</th>
                                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="[&_tr:last-child]:border-0">
                                                {isLoading ? (
                                                    <tr>
                                                        <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                                            Loading products...
                                                        </td>
                                                    </tr>
                                                ) : products.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                                            No products found
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    products.map((product) => (
                                                        <tr key={product.id} className="border-b transition-colors hover:bg-muted/50">
                                                            <td className="p-4 align-middle font-medium">{product.name}</td>
                                                            <td className="p-4 align-middle">
                                                                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground">
                                                                    {product.category}
                                                                </span>
                                                            </td>
                                                            <td className="p-4 align-middle">${product.price}</td>
                                                            <td className="p-4 align-middle">{product.stock}</td>
                                                            <td className="p-4 align-middle">{product.rating}</td>
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
                                                                        <DropdownMenuItem>
                                                                            <Edit className="mr-2 h-4 w-4" /> Edit
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuSeparator />
                                                                        <DropdownMenuItem className="text-red-600">
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
                                <div className="flex items-center justify-between px-2 py-4">
                                    <div className="text-sm text-muted-foreground">
                                        Showing {((productPage - 1) * limit) + 1} to {Math.min(productPage * limit, productTotalCount)} of {productTotalCount} products
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setProductPage(p => Math.max(1, p - 1))}
                                            disabled={productPage === 1}
                                        >
                                            <ChevronLeft className="h-4 w-4 mr-1" />
                                            Previous
                                        </Button>
                                        <div className="text-sm font-medium">
                                            Page {productPage} of {productTotalPages}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setProductPage(p => Math.min(productTotalPages, p + 1))}
                                            disabled={productPage === productTotalPages}
                                        >
                                            Next
                                            <ChevronRight className="h-4 w-4 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </main>
            </div >
        </div >
    );
}
