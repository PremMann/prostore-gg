'use client';
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, SunMoon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

const ModeToggle = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // When mounted on client, now we can show the UI
    useEffect(() => setMounted(true), []);

    if (!mounted) return null;
  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="focus-visible:ring-0 focus-visible:ring-offset-0">
                {theme === 'system' ? <SunMoon /> : theme === 'dark' ? <Moon /> : <Sun />}
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" forceMount>
            <DropdownMenuLabel>Choose Theme</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white z-50" />
            <DropdownMenuCheckboxItem checked={ theme === 'system' } onClick={ (checked) => setTheme( checked ? 'system' : theme ?? 'light' ) }>
                System
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={ theme === 'light' } onClick={ (checked) => setTheme( checked ? 'light' : theme ?? 'light' ) }>
                Light
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={ theme === 'dark' } onClick={ (checked) => setTheme( checked ? 'dark' : theme ?? 'light' ) }>
                Dark
            </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
    </DropdownMenu>
  );
} 
export default ModeToggle;