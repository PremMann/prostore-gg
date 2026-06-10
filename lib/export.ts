import type { Product } from "@/types";

export function exportProductsToCSV(products: Product[], filename = "products.csv") {
  const headers = [
    "Name",
    "Slug",
    "Category",
    "Brand",
    "Price",
    "Stock",
    "Rating",
    "Reviews",
    "Description",
    "Product Code",
    "Sizes",
    "Colors",
    "Is Featured",
    "Created At",
  ];

  const rows = products.map((p) => [
    escapeCsvField(p.name),
    escapeCsvField(p.slug),
    escapeCsvField(p.category),
    escapeCsvField(p.brand),
    p.price,
    p.stock,
    p.rating,
    p.numReviews,
    escapeCsvField(p.description),
    escapeCsvField(p.productCode || ""),
    escapeCsvField((p.sizes || []).join("; ")),
    escapeCsvField((p.colors || []).map((c: { name: string; imageUrl: string }) => c.name).join("; ")),
    p.isFeatured ? "Yes" : "No",
    p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function escapeCsvField(value: string | number | boolean): string {
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}