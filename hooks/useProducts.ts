"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllProducts, getAllCategories, createProduct, updateProduct, deleteProduct } from "@/lib/actions/product.actions";
import type { GetProductsParams, Product } from "@/types";
import { toast } from "sonner";

const PRODUCTS_QUERY_KEY = ["products"];
const CATEGORIES_QUERY_KEY = ["categories"];

interface UseProductsOptions {
  initialParams?: GetProductsParams;
}

interface UseProductsReturn {
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null;
  categories: string[];
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  params: GetProductsParams;
  setParams: (params: GetProductsParams | ((prev: GetProductsParams) => GetProductsParams)) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearch: (search: string) => void;
  setCategory: (category: string) => void;
  setSortBy: (sortBy: GetProductsParams["sortBy"]) => void;
  setSortOrder: (sortOrder: GetProductsParams["sortOrder"]) => void;
  setPriceRange: (price: string) => void;
  refreshProducts: () => Promise<void>;
  createProduct: (data: Parameters<typeof createProduct>[0]) => Promise<void>;
  updateProduct: (data: Parameters<typeof updateProduct>[0]) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export function useProducts({ initialParams = {} }: UseProductsOptions = {}): UseProductsReturn {
  const queryClient = useQueryClient();

  const [params, setParams] = useState<GetProductsParams>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
    ...initialParams,
  });

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, params],
    queryFn: async () => {
      const result = await getAllProducts(params);
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
    placeholderData: (previousData) => previousData,
  });

  const { data: categoriesData } = useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: async () => {
      const result = await getAllCategories();
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
    staleTime: 1000 * 60 * 10,
  });

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      } else {
        toast.error(result.message);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create product");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      } else {
        toast.error(result.message);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update product");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      } else {
        toast.error(result.message);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete product");
    },
  });

  const refreshProducts = async () => {
    await refetch();
  };

  const handleCreateProduct = async (data: Parameters<typeof createProduct>[0]) => {
    await createMutation.mutateAsync(data);
  };

  const handleUpdateProduct = async (data: Parameters<typeof updateProduct>[0]) => {
    await updateMutation.mutateAsync(data);
  };

  const handleDeleteProduct = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  const setPage = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
  };

  const setLimit = (limit: number) => {
    setParams((prev) => ({ ...prev, limit, page: 1 }));
  };

  const setSearch = (search: string) => {
    setParams((prev) => ({ ...prev, search, page: 1 }));
  };

  const setCategory = (category: string) => {
    setParams((prev) => ({ ...prev, category, page: 1 }));
  };

  const setSortBy = (sortBy: GetProductsParams["sortBy"]) => {
    setParams((prev) => ({ ...prev, sortBy }));
  };

  const setSortOrder = (sortOrder: GetProductsParams["sortOrder"]) => {
    setParams((prev) => ({ ...prev, sortOrder }));
  };

  const setPriceRange = (price: string) => {
    setParams((prev) => ({ ...prev, price, page: 1 }));
  };

  const updateParams = (newParams: GetProductsParams | ((prev: GetProductsParams) => GetProductsParams)) => {
    setParams((prev) => {
      if (typeof newParams === "function") return newParams(prev);
      const hasPageChange = "page" in newParams;
      return { ...prev, ...newParams, ...(hasPageChange ? {} : { page: 1 }) };
    });
  };

  return {
    products: data?.products ?? [],
    pagination: data?.pagination ?? null,
    categories: categoriesData ?? [],
    isLoading,
    isFetching,
    error,
    params,
    setParams: updateParams,
    setPage,
    setLimit,
    setSearch,
    setCategory,
    setSortBy,
    setSortOrder,
    setPriceRange,
    refreshProducts,
    createProduct: handleCreateProduct,
    updateProduct: handleUpdateProduct,
    deleteProduct: handleDeleteProduct,
  };
}