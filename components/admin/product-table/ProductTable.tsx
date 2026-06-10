"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductRow } from "./ProductRow";
import { ProductTableToolbar } from "./ProductTableToolbar";
import { ProductTableSkeleton } from "./ProductTableSkeleton";
import type { Product, GetProductsParams } from "@/types";

interface ProductTableProps {
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null;
  params: GetProductsParams;
  isLoading: boolean;
  isFetching: boolean;
  onParamsChange: (params: Partial<GetProductsParams>) => void;
  onEdit: (product: Product) => void;
  onClone: (product: Product) => void;
  onDelete: (id: string) => void;
  onAddClick: () => void;
  onExport: () => void;
  onImport: () => void;
  onBulkDelete: () => void;
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

export function ProductTable({
  products,
  pagination,
  params,
  isLoading,
  isFetching,
  onParamsChange,
  onEdit,
  onClone,
  onDelete,
  onAddClick,
  onExport,
  onImport,
  onBulkDelete,
  selectedIds,
  onSelectionChange,
}: ProductTableProps) {
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      onSelectionChange(products.map((p) => p.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handlePageChange = (page: number) => {
    onParamsChange({ page });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Products Management</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ProductTableToolbar
          params={params}
          onParamsChange={onParamsChange}
          onAddClick={onAddClick}
          selectedCount={selectedIds.length}
          onExport={onExport}
          onImport={onImport}
          onBulkDelete={onBulkDelete}
        />

        <div className="rounded-md border">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-12">
                    <input
                      type="checkbox"
                      checked={selectAll && products.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Product</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Price</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Stock</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Rating</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {(isLoading || isFetching) && products.length === 0 ? (
                  <ProductTableSkeleton />
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <ProductRow
                      key={product.id}
                      product={product}
                      onEdit={onEdit}
                      onClone={onClone}
                      onDelete={onDelete}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-2 py-4">
            <div className="text-sm text-muted-foreground">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
              {pagination.total} products
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <div className="text-sm font-medium">
                Page {pagination.page} of {pagination.totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}