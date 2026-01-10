'use client';

import { useLanguage } from '@/components/catalog/language-context';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function LanguageToggle() {
    const { language, toggleLanguage } = useLanguage();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Globe className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Toggle language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => { if (language !== 'en') toggleLanguage(); }}>
                    English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { if (language !== 'km') toggleLanguage(); }}>
                    ខ្មែរ (Khmer)
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
