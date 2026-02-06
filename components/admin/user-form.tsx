"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createUser, updateUser } from "@/lib/actions/user.actions";
import { toast } from "sonner";
import { insertUserSchema, updateUserSchema } from "@/lib/validators";
import { User } from "@/types";

export default function UserForm({
    setOpen,
    onSuccess,
    user
}: {
    setOpen: (open: boolean) => void;
    onSuccess?: () => void;
    user?: User | null;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        role: user?.role || "user",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        try {
            // Validation
            let result;
            if (user?.id) {
                // Update mode
                const updateData = {
                    name: formData.name,
                    email: formData.email,
                    role: formData.role,
                    password: formData.password || undefined,
                };

                const parsed = updateUserSchema.safeParse(updateData);
                if (!parsed.success) {
                    const newErrors: Record<string, string> = {};
                    parsed.error.issues.forEach((err) => {
                        if (err.path[0]) newErrors[err.path[0] as string] = err.message;
                    });
                    setErrors(newErrors);
                    setIsLoading(false);
                    return;
                }

                result = await updateUser(user.id, parsed.data);
            } else {
                // Create mode
                if (formData.password !== formData.confirmPassword) {
                    setErrors({ confirmPassword: "Passwords do not match" });
                    setIsLoading(false);
                    return;
                }

                const createData = {
                    name: formData.name,
                    email: formData.email,
                    role: formData.role,
                    password: formData.password,
                };

                const parsed = insertUserSchema.safeParse(createData);
                if (!parsed.success) {
                    const newErrors: Record<string, string> = {};
                    parsed.error.issues.forEach((err) => {
                        if (err.path[0]) newErrors[err.path[0] as string] = err.message;
                    });
                    setErrors(newErrors);
                    setIsLoading(false);
                    return;
                }

                result = await createUser(parsed.data);
            }

            if (result.success) {
                toast.success(result.message);
                onSuccess?.();
                setOpen(false);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}
                >
                    <SelectTrigger id="role">
                        <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                </Select>
                {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Password {user?.id && "(Leave blank to keep current)"}</Label>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={user?.id ? "••••••" : "Required"}
                    required={!user?.id}
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>

            {!user?.id && (
                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm Password"
                        required
                    />
                    {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? (user?.id ? "Updating..." : "Creating...") : (user?.id ? "Update User" : "Create User")}
                </Button>
            </div>
        </form>
    );
}
