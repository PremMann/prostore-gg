"use client";

import { useState } from "react";
import { Search, Filter, Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import type { GetProductsParams } from "@/types";
import { cn } from "@/lib/utils";

interface ProductTableToolbarProps {
  params: GetProductsParams;
  onParamsChange: (params: Partial<GetProductsParams>) => void;
  onAddClick: () => void;
  selectedCount: number;
  onExport: () => void;
  onImport: () => void;
  onBulkDelete: () => void;
}

export function ProductTableToolbar({
  params,
  onParamsChange,
  onAddClick,
  selectedCount,
  onExport,
  onImport,
  onBulkDelete,
}: ProductTableToolbarProps) {
  const [searchInput, setSearchInput] = useState(params.search || "");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onParamsChange({ search: searchInput || undefined, page: 1 });
  };

  const handleCategoryChange = (value: string) => {
    onParamsChange({ category: value || undefined, page: 1 });
  };

  const handleSortChange = (field: GetProductsParams["sortBy"]) => {
    onParamsChange({ sortBy: field, page: 1 });
  };

  const handleSortOrderChange = (order: GetProductsParams["sortOrder"]) => {
    onParamsChange({ sortOrder: order });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4 p-4 bg-card border rounded-lg">
      <div className="flex flex-1 gap-2">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-8"
          />
        </form>

        <Select value={params.category || ""} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {PRODUCT_CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={params.sortBy || "createdAt"} onValueChange={(value) => handleSortChange(value as GetProductsParams["sortBy"])}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Created Date</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="price">Price</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          onClick={() => handleSortOrderChange(params.sortOrder === "asc" ? "desc" : "asc")}
          title={params.sortOrder === "asc" ? "Ascending" : "Descending"}
          className={cn("h-10", params.sortOrder && "bg-muted")}
        >
          {params.sortOrder === "asc" ? (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m18 15-6-6-6 6" />
            </svg>
          ) : (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m6 9 6 6 6-6" />
            </svg>
          )}
        </Button>

        <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {selectedCount > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{selectedCount} selected</span>
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="mr-1 h-3 w-3" />
              Export
            </Button>
            <Button variant="destructive" size="sm" onClick={onBulkDelete}>
              <svg className="mr-1 h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              Delete
            </Button>
          </div>
        )}

        <Button variant="outline" onClick={onImport}>
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Import
        </Button>
        <Button onClick={onAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-4 pt-4 border-t">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-muted-foreground mb-1">Price Range</label>
            <Input
              type="text"
              placeholder="e.g. 10-100"
              value={params.price || ""}
              onChange={(e) => onParamsChange({ price: e.target.value || undefined, page: 1 })}
            />
          </div>
        </div>
      )}
    </div>
  );
}