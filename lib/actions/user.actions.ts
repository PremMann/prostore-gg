'use server';

import { signInFormSchema, signUpFormSchema, insertUserSchema, updateUserSchema } from '../validators';
import { signIn, signOut } from '@/auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { hashSync } from 'bcrypt-ts-edge';
import { prisma } from '@/db/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { Prisma } from '@prisma/client';
import { formatError, convertToPlainObject } from '../utils';

// Sign in the user with credentials
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    await signIn('credentials', user);

    return { success: true, message: 'Signed in successfully' };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: 'Invalid email or password' };
  }
}

// Sign user out
export async function signOutUser() {
  await signOut();
}

// Sign up user
export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });

    const plainPassword = user.password;

    user.password = hashSync(user.password);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    await signIn('credentials', {
      email: user.email,
      password: plainPassword,
    });

    return { success: true, message: 'User registered successfully' };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) };
  }
}

// Get all users for admin dashboard with pagination, search, and filtering
interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  sortBy?: 'name' | 'email' | 'createdAt' | 'role';
  sortOrder?: 'asc' | 'desc';
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function getAllUsers(params: GetUsersParams = {}) {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      role,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params;

    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const whereConditions: object[] = [];

    // Search filter (name or email)
    if (search) {
      whereConditions.push({
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      });
    }

    // Role filter
    if (role) {
      whereConditions.push({ role });
    }

    const where = whereConditions.length > 0 ? { AND: whereConditions } : {};

    // Get total count for pagination
    const totalCount = await prisma.user.count({ where });

    // Fetch users with filters and pagination
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        phoneNumber: true,
        emailVerified: true,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    });

    const pagination: PaginationInfo = {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    };

    return {
      success: true,
      data: {
        users: convertToPlainObject(users),
        pagination,
      },
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Create new user (Admin)
export async function createUser(data: z.infer<typeof insertUserSchema>) {
  try {
    const user = insertUserSchema.parse(data);

    // Check if email already exists
    const existingUser = await prisma.user.findFirst({
      where: { email: user.email },
    });

    if (existingUser) {
      return { success: false, message: 'User with this email already exists' };
    }

    const hashedPassword = hashSync(user.password);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role,
      },
    });

    revalidatePath('/admin/dashboard');

    return { success: true, message: 'User created successfully' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Get user by ID
export async function getUserById(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    return { success: true, data: convertToPlainObject(user) };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Update user
export async function updateUser(userId: string, data: z.infer<typeof updateUserSchema>) {
  try {
    const userToUpdate = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userToUpdate) {
      return { success: false, message: 'User not found' };
    }

    const validatedData = updateUserSchema.parse(data);
    const updateData: Prisma.UserUpdateInput = {
      name: validatedData.name,
      email: validatedData.email,
      role: validatedData.role,
    };

    if (validatedData.password) {
      updateData.password = hashSync(validatedData.password);
    }

    await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    revalidatePath('/admin/dashboard');

    return { success: true, message: 'User updated successfully' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Delete user
export async function deleteUser(userId: string) {
  try {
    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath('/admin/dashboard');

    return { success: true, message: 'User deleted successfully' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
