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
    Plus,
    Trash2,
    Edit,
    Ban,
    AlertTriangle,
    TrendingUp,
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
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

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
    role: "Admin" | "User";
    status: "Active" | "Suspended";
}

const INITIAL_USERS: User[] = [
    { id: "U-001", name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
    { id: "U-002", name: "Jane Smith", email: "jane@example.com", role: "User", status: "Active" },
    { id: "U-003", name: "Robert Johnson", email: "robert@example.com", role: "User", status: "Suspended" },
    { id: "U-004", name: "Emily Davis", email: "emily@example.com", role: "User", status: "Active" },
    { id: "U-005", name: "Michael Wilson", email: "michael@example.com", role: "Admin", status: "Active" },
];

// --- Main Admin Dashboard Component ---

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<"dashboard" | "users" | "products">("dashboard");
    const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
    const [users, setUsers] = useState<User[]>(INITIAL_USERS);
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    // Form State
    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        role: "User",
        status: "Active",
    });

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

    // Filter Users
    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle Create User
    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple validation
        if (!newUser.name || !newUser.email) {
            toast.error("Please fill in all required fields");
            return;
        }

        const user: User = {
            id: `U-${Math.floor(Math.random() * 1000)}`,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role as "Admin" | "User",
            status: newUser.status as "Active" | "Suspended",
        };

        setUsers([user, ...users]);
        setIsCreateDialogOpen(false);
        setNewUser({ name: "", email: "", role: "User", status: "Active" });
        toast.success("User created successfully");
    };

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
                                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Create User
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Create New User</DialogTitle>
                                        </DialogHeader>
                                        <form onSubmit={handleCreateUser} className="grid gap-4 py-4">
                                            <div className="grid gap-2">
                                                <label htmlFor="name" className="text-sm font-medium">
                                                    Name
                                                </label>
                                                <Input
                                                    id="name"
                                                    value={newUser.name}
                                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <label htmlFor="email" className="text-sm font-medium">
                                                    Email
                                                </label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={newUser.email}
                                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <label htmlFor="role" className="text-sm font-medium">
                                                        Role
                                                    </label>
                                                    <select
                                                        id="role"
                                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                        value={newUser.role}
                                                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                                    >
                                                        <option value="User">User</option>
                                                        <option value="Admin">Admin</option>
                                                    </select>
                                                </div>
                                                <div className="grid gap-2">
                                                    <label htmlFor="status" className="text-sm font-medium">
                                                        Status
                                                    </label>
                                                    <select
                                                        id="status"
                                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                        value={newUser.status}
                                                        onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                                                    >
                                                        <option value="Active">Active</option>
                                                        <option value="Suspended">Suspended</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="flex justify-end gap-2 mt-4">
                                                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                                    Cancel
                                                </Button>
                                                <Button type="submit">Create User</Button>
                                            </div>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-4">
                                    <Input
                                        placeholder="Search users..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="max-w-sm"
                                    />
                                </div>
                                <div className="rounded-md border">
                                    <div className="relative w-full overflow-auto">
                                        <table className="w-full caption-bottom text-sm">
                                            <thead className="[&_tr]:border-b">
                                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
                                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Role</th>
                                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="[&_tr:last-child]:border-0">
                                                {filteredUsers.map((user) => (
                                                    <tr key={user.id} className="border-b transition-colors hover:bg-muted/50">
                                                        <td className="p-4 align-middle font-medium">{user.id}</td>
                                                        <td className="p-4 align-middle">{user.name}</td>
                                                        <td className="p-4 align-middle">{user.email}</td>
                                                        <td className="p-4 align-middle">
                                                            <span className={cn(
                                                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                                                                user.role === "Admin" ? "bg-primary/10 text-primary" : "bg-secondary text-secondary-foreground"
                                                            )}>
                                                                {user.role}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 align-middle">
                                                            <span className={cn(
                                                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
                                                                user.status === "Active" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                                            )}>
                                                                {user.status}
                                                            </span>
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
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === "products" && (
                        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
                            <div className="flex flex-col items-center gap-1 text-center">
                                <h3 className="text-2xl font-bold tracking-tight">
                                    No products added
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    You can start selling as soon as you add a product.
                                </p>
                                <Button className="mt-4">Add Product</Button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
