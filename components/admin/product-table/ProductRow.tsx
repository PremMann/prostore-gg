"use client";

import { memo, useState, useRef } from "react";
import { Edit, Trash2, Copy, MoreVertical, Package } from "lucide-react";
import { InventoryLogModal } from "./InventoryLogModal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductRowProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onClone: (product: Product) => void;
}

export const ProductRow = memo(function ProductRow({ product, onEdit, onDelete, onClone }: ProductRowProps) {
  const [stockHistoryOpen, setStockHistoryOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewPos, setPreviewPos] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (imgRef.current) {
      const rect = imgRef.current.getBoundingClientRect();
      setPreviewPos({ x: rect.right + 12, y: rect.top });
      setPreviewOpen(true);
    }
  };

  return (
    <>
    <tr className="border-b transition-colors hover:bg-muted/50">
      <td className="p-4 align-middle">
        <div className="flex items-center gap-3">
          {product.images?.[0] && (
            <div
              ref={imgRef}
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={() => setPreviewOpen(false)}
            >
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-10 w-10 rounded object-cover border cursor-pointer"
              />
              {previewOpen && (
                <div
                  className="fixed z-50 shadow-xl rounded-lg overflow-hidden border bg-background"
                  style={{
                    left: previewPos.x,
                    top: previewPos.y,
                    width: 240,
                    height: 240,
                  }}
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.images.length > 1 && (
                    <div className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                      +{product.images.length - 1} more
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <div>
            <p className="font-medium">{product.name}</p>
            <p className="text-xs text-muted-foreground truncate max-w-[200px]">{product.slug}</p>
          </div>
        </div>
      </td>
      <td className="p-4 align-middle">
        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors">
          {product.category}
        </span>
      </td>
      <td className="p-4 align-middle font-medium">${product.price}</td>
      <td className="p-4 align-middle">
        <span className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
          product.stock === 0 ? "bg-red-100 text-red-700" :
          product.stock < 10 ? "bg-amber-100 text-amber-700" :
          "bg-emerald-100 text-emerald-700"
        )}>
          {product.stock} {product.stock === 0 ? "Out of Stock" : product.stock < 10 ? "Low Stock" : "In Stock"}
        </span>
      </td>
      <td className="p-4 align-middle">
        <div className="flex items-center gap-1">
          <span className="font-medium">{product.rating}</span>
          <span className="text-amber-500">★</span>
          <span className="text-xs text-muted-foreground">({product.numReviews})</span>
        </div>
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
            <DropdownMenuItem onClick={() => onEdit(product)}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onClone(product)}>
              <Copy className="mr-2 h-4 w-4" /> Clone
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStockHistoryOpen(true)}>
              <Package className="mr-2 h-4 w-4" /> Stock History
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" onClick={() => onDelete(product.id)}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
    <InventoryLogModal
      productId={product.id}
      productName={product.name}
      open={stockHistoryOpen}
      setOpen={setStockHistoryOpen}
    />
    </>
  );
});

ProductRow.displayName = "ProductRow";