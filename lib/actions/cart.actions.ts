'use server';

import { cookies } from 'next/headers';
import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { cartItemSchema, insertCartSchema } from '../validators';
import { calcPrice, formatError } from '../utils';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { CartItem } from '@/types';
import { Prisma } from '@prisma/client';

// Calculate cart prices based on items
const calcCartPrices = (items: CartItem[]) => {
  const prices = calcPrice(items);
  return {
    itemsPrice: prices.itemsPrice,
    shippingPrice: prices.shippingPrice,
    taxPrice: prices.taxPrice,
    totalPrice: prices.totalPrice,
  };
};

export async function addToCart(data: CartItem) {
  // Check for session
  const session = await auth();
  if (!session) {
    redirect(`/sign-in?callbackUrl=/product/${data.slug}`);
  }

  try {
    // Check for "session cart id" cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) {
      // Create new session cart id
      const newSessionCartId = crypto.randomUUID();
      // Clone the request cookies
      (await cookies()).set('sessionCartId', newSessionCartId);
    }

    // Get session cart id again to be sure
    const currentSessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!currentSessionCartId) throw new Error('Could not create session cart id');

    // Get user and their cart
    // Get user and their cart
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // Get cart
    const cart = await getMyCart();

    // Parse and validate item
    const item = cartItemSchema.parse(data);

    // Find product in db
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });
    if (!product) throw new Error('Product not found');

    if (!cart) {
      // Create new cart object
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: currentSessionCartId,
        ...calcCartPrices([item]),
      });

      // Add to database
      await prisma.cart.create({
        data: newCart,
      });

      // Revalidate product page
      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} added to cart`,
      };
    } else {
      // Check if item exists in cart
      const existItem = (cart.items as CartItem[]).find(
        (x) => x.productId === item.productId
      );

      if (existItem) {
        // Check stock
        if (product.stock < existItem.qty + 1) {
          throw new Error('Not enough stock');
        }

        // Increase quantity
        (cart.items as CartItem[]).find(
          (x) => x.productId === item.productId
        )!.qty = existItem.qty + 1;
      } else {
        // Check stock
        if (product.stock < 1) {
          throw new Error('Not enough stock');
        }

        // Add item to cart
        (cart.items as CartItem[]).push(item);
      }

      // Recalculate prices
      const calcPrices = calcCartPrices(cart.items as CartItem[]);

      // Update cart
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.InputJsonValue[],
          ...calcPrices,
        },
      });


      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} ${existItem ? 'quantity updated' : 'added to cart'
          }`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getMyCart() {
  const sessionCartId = (await cookies()).get('sessionCartId')?.value;
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  if (!sessionCartId) return undefined;

  // Search by user ID if logged in, otherwise by sessionCartId
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });

  return cart;
}

export async function removeItemFromCart(productId: string) {
  try {
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error("Cart Session not found");

    // Get product to invalidate path later
    const product = await prisma.product.findFirst({ where: { id: productId } });
    if (!product) throw new Error("Product not found");

    const cart = await getMyCart();
    if (!cart) throw new Error("Cart not found");

    // Filter out item
    const newItems = (cart.items as CartItem[]).filter((item) => item.productId !== productId);

    // Recalculate
    const calcPrices = calcCartPrices(newItems);

    // Update
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: newItems as Prisma.InputJsonValue[],
        ...calcPrices
      }
    });

    revalidatePath(`/product/${product.slug}`);
    revalidatePath('/cart');

    return { success: true, message: `${product.name} removed from cart` };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateCartItemQuantity(productId: string, quantity: number) {
  try {
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error("Cart Session not found");

    const cart = await getMyCart();
    if (!cart) throw new Error("Cart not found");

    // Retrieve original item to verify existence
    const existItem = (cart.items as CartItem[]).find((x) => x.productId === productId);
    if (!existItem) throw new Error("Item not found");

    // Get product to check stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new Error("Product not found");

    // Handle quantity update
    if (quantity < 1) {
      // If reduced to 0 or less, remove it? usually yes 
      // But prompt says removeItemFromCart is separate. 
      // I will assume remove if < 1 OR throw error. 
      // Standard UX is remove.
      // I'll call remove internally or logic here. logic here is safer.
      const newItems = (cart.items as CartItem[]).filter((x) => x.productId !== productId);

      // Recalculate
      const calcPrices = calcCartPrices(newItems);

      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: newItems as Prisma.InputJsonValue[],
          ...calcPrices
        }
      });

      revalidatePath(`/product/${product.slug}`);
      revalidatePath('/cart');
      return { success: true, message: `${product.name} removed from cart` };
    }

    // Check stock
    if (product.stock < quantity) {
      throw new Error('Not enough stock');
    }

    // Update quantity
    (cart.items as CartItem[]).find((x) => x.productId === productId)!.qty = quantity;

    // Recalculate
    const calcPrices = calcCartPrices(cart.items as CartItem[]);

    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items as Prisma.InputJsonValue[],
        ...calcPrices
      }
    });

    revalidatePath(`/product/${product.slug}`);
    revalidatePath('/cart');

    return {
      success: true,
      message: `${product.name} quantity updated`
    };

  } catch (error) {
    return {
      success: false,
      message: formatError(error)
    };
  }
}