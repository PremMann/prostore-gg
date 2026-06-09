import { z } from "zod";
import { insertProductSchema } from "./validators";
import type { Product } from "@/types";

interface ImportRow {
  rowNumber: number;
  data: Record<string, string>;
  errors: string[];
}

type ImportableProduct = Omit<Product, "id" | "rating" | "numReviews" | "createdAt" | "variants" | "dimensions" | "tags" | "weight" | "metaTitle" | "metaDescription"> & {
  tags?: string[];
  weight?: number | null;
  dimensions?: Record<string, unknown> | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  variants?: { size: string; color: string; stock: number; sku: string; priceAdjustment: number }[];
};

interface ImportResult {
  validProducts: Array<{
    rowNumber: number;
    product: ImportableProduct;
  }>;
  errorRows: ImportRow[];
  totalRows: number;
}

function normalizeHeader(header: string): string {
  const map: Record<string, string> = {
    "product name": "name",
    "productname": "name",
    "sku": "productCode",
    "product code": "productCode",
    "qty": "stock",
    "quantity": "stock",
    "desc": "description",
    "khmer name": "nameKh",
    "khmer": "nameKh",
  };
  const lower = header.toLowerCase().trim();
  return map[lower] || lower;
}

export function parseCSV(text: string): ImportResult {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length < 2) {
    return { validProducts: [], errorRows: [], totalRows: 0 };
  }

  const headers = lines[0].split(",").map((h) => normalizeHeader(h.trim()));
  const rows: ImportRow[] = [];
  const validProducts: ImportResult["validProducts"] = [];
  const errorRows: ImportRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const data: Record<string, string> = {};
    const rowErrors: string[] = [];

    headers.forEach((header, index) => {
      data[header] = (values[index] || "").trim();
    });

    // Basic validation
    if (!data.name) rowErrors.push("Name is required");
    if (!data.slug) data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-");
    if (!data.category) rowErrors.push("Category is required");
    if (!data.brand) rowErrors.push("Brand is required");
    if (!data.price || isNaN(Number(data.price))) rowErrors.push("Valid price is required");
    if (!data.stock || isNaN(Number(data.stock))) rowErrors.push("Valid stock is required");

    if (rowErrors.length > 0) {
      errorRows.push({ rowNumber: i + 1, data, errors: rowErrors });
    } else {
      const sizes = data.sizes ? data.sizes.split(";").map((s) => s.trim()).filter(Boolean) : [];
      let colors: { name: string; imageUrl: string }[] = [];
      if (data.colors) {
        colors = data.colors.split(";").map((c) => ({ name: c.trim(), imageUrl: "" }));
      }
      const images = data.images ? data.images.split(";").map((i) => i.trim()).filter(Boolean) : [];

      validProducts.push({
        rowNumber: i + 1,
        product: {
          name: data.name,
          nameKh: data.nameKh || "",
          slug: data.slug,
          productCode: data.productCode || "",
          category: data.category,
          brand: data.brand,
          price: data.price,
          stock: parseInt(data.stock) || 0,
          description: data.description || "",
          images: images.length > 0 ? images : ["/placeholder.png"],
          isFeatured: false,
          banner: null,
          sizes,
          colors,
          tags: [],
          weight: null,
          dimensions: null,
          metaTitle: null,
          metaDescription: null,
          variants: [],
        },
      });
    }

    rows.push({ rowNumber: i + 1, data, errors: [] });
  }

  return {
    validProducts,
    errorRows,
    totalRows: lines.length - 1,
  };
}

function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current);
  return values;
}

export async function importProducts(
  products: ImportResult["validProducts"],
  onProgress?: (imported: number, total: number) => void
): Promise<{ imported: number; errors: { rowNumber: number; error: string }[] }> {
  const { createProduct } = await import("./actions/product.actions");
  const errors: { rowNumber: number; error: string }[] = [];
  let imported = 0;

  for (let i = 0; i < products.length; i++) {
    try {
      const result = await createProduct(products[i].product as unknown as z.infer<typeof insertProductSchema>);
      if (result.success) {
        imported++;
      } else {
        errors.push({ rowNumber: products[i].rowNumber, error: result.message });
      }
    } catch (err) {
      errors.push({ rowNumber: products[i].rowNumber, error: String(err) });
    }
    onProgress?.(i + 1, products.length);
  }

  return { imported, errors };
}