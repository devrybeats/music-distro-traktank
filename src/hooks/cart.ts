export type CartType = {
  id: string;
  product: string;
  productId: string;
  description: string;
  price: number;
  quantity?: number;
  user_id: string;
  status: string;
};

export const fetchCartItems = async (user_id: string) => {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl || !user_id) return [];
    const response = await fetch(
      `${backendUrl}/api/cart/${user_id}`,
      {
        next: {
          revalidate: 0,
        },
      },
    );

    if (!response.ok) {
      return [];
    }

    const cartItems = (await response.json()) as CartType[];
    return cartItems;
  } catch (error) {
    console.warn("fetchCartItems failed:", error);
    return [];
  }
};

export const fetchUserInfo = async (user_id: string) => {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl || !user_id) return null;
    const response = await fetch(
      `${backendUrl}/api/user-info/${user_id}`,
      {
        next: {
          revalidate: 0,
        },
      },
    );

    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.warn("fetchUserInfo failed:", error);
    return null;
  }
};
