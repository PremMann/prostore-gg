import { getColorHex, isLightColor } from '@/lib/colors';
import { cn } from '@/lib/utils';

interface ColorSwatchProps {
    color: string;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    className?: string;
}

export function ColorSwatch({ 
    color, 
    size = 'md', 
    showLabel = true,
    className 
}: ColorSwatchProps) {
    const hex = getColorHex(color);
    const isLight = isLightColor(color);
    
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
    };

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <span
                className={cn(
                    "rounded-full border-2 shadow-sm",
                    sizeClasses[size],
                    isLight ? "border-gray-300" : "border-transparent"
                )}
                style={{ backgroundColor: hex }}
                title={color}
            />
            {showLabel && (
                <span className="text-sm capitalize">{color}</span>
            )}
        </div>
    );
}

interface ColorSwatchListProps {
    colors: string[];
    size?: 'sm' | 'md' | 'lg';
    showLabels?: boolean;
    className?: string;
}

export function ColorSwatchList({ 
    colors, 
    size = 'md', 
    showLabels = true,
    className 
}: ColorSwatchListProps) {
    if (!colors || colors.length === 0) return null;

    return (
        <div className={cn("flex flex-wrap gap-3", className)}>
            {colors.map((color) => (
                <ColorSwatch 
                    key={color} 
                    color={color} 
                    size={size}
                    showLabel={showLabels}
                />
            ))}
        </div>
    );
}
