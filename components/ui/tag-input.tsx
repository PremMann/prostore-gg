'use client';

import { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TagInputProps {
    value: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
    suggestions?: string[];
    label?: string;
    className?: string;
}

export function TagInput({
    value = [],
    onChange,
    placeholder = 'Type and press Enter',
    suggestions = [],
    className,
}: TagInputProps) {
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const addTag = (tag: string) => {
        const trimmedTag = tag.trim();
        if (trimmedTag && !value.includes(trimmedTag)) {
            onChange([...value, trimmedTag]);
        }
        setInputValue('');
        setShowSuggestions(false);
    };

    const removeTag = (tagToRemove: string) => {
        onChange(value.filter((tag) => tag !== tagToRemove));
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (inputValue.trim()) {
                addTag(inputValue);
            }
        } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
            removeTag(value[value.length - 1]);
        }
    };

    const filteredSuggestions = suggestions.filter(
        (suggestion) =>
            suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
            !value.includes(suggestion)
    );

    const availableSuggestions = suggestions.filter((s) => !value.includes(s));

    return (
        <div className={cn("space-y-2", className)}>
            {/* Tags Display */}
            {value.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {value.map((tag) => (
                        <Badge
                            key={tag}
                            variant="secondary"
                            className="flex items-center gap-1 px-2.5 py-1 text-sm"
                        >
                            {tag}
                            <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="ml-1 hover:text-destructive transition-colors"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}

            {/* Input with Suggestions */}
            <div className="relative">
                <Input
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder={placeholder}
                />

                {/* Suggestions Dropdown */}
                {showSuggestions && inputValue && filteredSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-40 overflow-auto">
                        {filteredSuggestions.map((suggestion) => (
                            <button
                                key={suggestion}
                                type="button"
                                className="w-full px-3 py-2 text-left hover:bg-muted text-sm transition-colors"
                                onMouseDown={() => addTag(suggestion)}
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Add Buttons for Common Values */}
            {availableSuggestions.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {availableSuggestions.slice(0, 8).map((suggestion) => (
                        <button
                            key={suggestion}
                            type="button"
                            className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md border border-dashed border-muted-foreground/40 text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors"
                            onClick={() => addTag(suggestion)}
                        >
                            + {suggestion}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// Predefined suggestions
export const SIZE_SUGGESTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'];
export const COLOR_SUGGESTIONS = [
    'Black',
    'White', 
    'Red',
    'Blue',
    'Green',
    'Yellow',
    'Orange',
    'Purple',
    'Pink',
    'Gray',
    'Brown',
    'Navy',
    'Beige',
    'Teal',
];

// Re-export color utilities from shared lib
export { getColorHex, COLOR_MAP } from '@/lib/colors';
