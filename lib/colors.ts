// Color name to hex mapping
export const COLOR_MAP: Record<string, string> = {
    'black': '#000000',
    'white': '#FFFFFF',
    'red': '#EF4444',
    'blue': '#3B82F6',
    'green': '#22C55E',
    'yellow': '#EAB308',
    'orange': '#F97316',
    'purple': '#A855F7',
    'pink': '#EC4899',
    'gray': '#6B7280',
    'grey': '#6B7280',
    'brown': '#92400E',
    'navy': '#1E3A8A',
    'beige': '#D4C4A8',
    'teal': '#14B8A6',
    'gold': '#CA8A04',
    'silver': '#9CA3AF',
    'maroon': '#7F1D1D',
    'olive': '#65A30D',
    'cyan': '#06B6D4',
    'magenta': '#D946EF',
    'lime': '#84CC16',
    'indigo': '#6366F1',
    'coral': '#F97171',
    'turquoise': '#2DD4BF',
    'lavender': '#C4B5FD',
    'peach': '#FDBA74',
    'mint': '#86EFAC',
    'cream': '#FEF3C7',
    'charcoal': '#374151',
    'burgundy': '#881337',
    'khaki': '#BEF264',
    'tan': '#D4A76A',
};

export function getColorHex(colorName: string): string {
    const normalizedName = colorName.toLowerCase().trim();
    return COLOR_MAP[normalizedName] || '#CBD5E1'; // Default to slate-300 if not found
}

export function isLightColor(colorName: string): boolean {
    const lightColors = ['white', 'beige', 'cream', 'yellow', 'lime', 'mint', 'peach', 'lavender', 'khaki'];
    return lightColors.includes(colorName.toLowerCase());
}
