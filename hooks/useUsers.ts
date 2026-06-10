"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, deleteUser, createUser, updateUser, signOutUser } from "@/lib/actions/user.actions";
import type { User } from "@/types";
import { toast } from "sonner";

const USERS_QUERY_KEY = ["users"];

interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  sortBy?: 'name' | 'email' | 'createdAt' | 'role';
  sortOrder?: 'asc' | 'desc';
}

interface UseUsersOptions {
  initialParams?: GetUsersParams;
}

interface UseUsersReturn {
  users: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  params: GetUsersParams;
  setParams: (params: GetUsersParams | ((prev: GetUsersParams) => GetUsersParams)) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearch: (search: string) => void;
  setRole: (role: string) => void;
  setSortBy: (sortBy: GetUsersParams["sortBy"]) => void;
  setSortOrder: (sortOrder: GetUsersParams["sortOrder"]) => void;
  refreshUsers: () => Promise<void>;
  createUser: (data: Parameters<typeof createUser>[0]) => Promise<void>;
  updateUser: (userId: string, data: Parameters<typeof updateUser>[1]) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  signOutUser: () => Promise<void>;
}

export function useUsers({ initialParams = {} }: UseUsersOptions = {}): UseUsersReturn {
  const queryClient = useQueryClient();

  const [params, setParams] = useState<GetUsersParams>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
    ...initialParams,
  });

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: [...USERS_QUERY_KEY, params],
    queryFn: async () => {
      const result = await getAllUsers(params);
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
    placeholderData: (previousData) => previousData,
  });

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      } else {
        toast.error(result.message);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create user");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: Parameters<typeof updateUser>[1] }) => {
      return updateUser(userId, data);
    },
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      } else {
        toast.error(result.message);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update user");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      } else {
        toast.error(result.message);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete user");
    },
  });

  const signOutMutation = useMutation({
    mutationFn: signOutUser,
    onSuccess: () => {
      window.location.href = "/";
    },
    onError: (error) => {
      toast.error(error.message || "Failed to sign out");
    },
  });

  const refreshUsers = async () => {
    await refetch();
  };

  const handleCreateUser = async (data: Parameters<typeof createUser>[0]) => {
    await createMutation.mutateAsync(data);
  };

  const handleUpdateUser = async (userId: string, data: Parameters<typeof updateUser>[1]) => {
    await updateMutation.mutateAsync({ userId, data });
  };

  const handleDeleteUser = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  const handleSignOutUser = async () => {
    await signOutMutation.mutateAsync();
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

  const setRole = (role: string) => {
    setParams((prev) => ({ ...prev, role, page: 1 }));
  };

  const setSortBy = (sortBy: GetUsersParams["sortBy"]) => {
    setParams((prev) => ({ ...prev, sortBy }));
  };

  const setSortOrder = (sortOrder: GetUsersParams["sortOrder"]) => {
    setParams((prev) => ({ ...prev, sortOrder }));
  };

  const updateParams = (newParams: GetUsersParams | ((prev: GetUsersParams) => GetUsersParams)) => {
    setParams((prev) => (typeof newParams === "function" ? newParams(prev) : { ...prev, ...newParams, page: 1 }));
  };

  return {
    users: data?.users ?? [],
    pagination: data?.pagination ?? null,
    isLoading,
    isFetching,
    error,
    params,
    setParams: updateParams,
    setPage,
    setLimit,
    setSearch,
    setRole,
    setSortBy,
    setSortOrder,
    refreshUsers,
    createUser: handleCreateUser,
    updateUser: handleUpdateUser,
    deleteUser: handleDeleteUser,
    signOutUser: handleSignOutUser,
  };
}