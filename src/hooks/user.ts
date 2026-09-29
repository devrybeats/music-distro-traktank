type User = {
  name: string;
  email: string;
  image: string;
};
import { type Social, type UserInformation } from "@prisma/client";

// Type for the combined user and social details
export type UserWithSocialDetails = {
  userInfo: UserInformation;
  userSocialUrls: Social;
};

export const fetchProfilePhoto = async (user_id: string) => {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) return { name: "", email: "", image: "" };
    const response = await fetch(
      `${backendUrl}/api/profile-photo/${user_id}`,
    );

    if (!response.ok) {
      return { name: "", email: "", image: "" };
    }

    const photo = (await response.json()) as User;
    return photo;
  } catch (error) {
    console.warn("fetchProfilePhoto failed:", error);
    return { name: "", email: "", image: "" };
  }
};

export const fetchUserInfo = async (user_id: string) => {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) return { userInfo: {} as any, userSocialUrls: {} as any };
    const response = await fetch(
      `${backendUrl}/api/user-info/${user_id}`,
      {
        next: {
          revalidate: 0,
        },
      },
    );

    if (!response.ok) {
      return { userInfo: {} as any, userSocialUrls: {} as any };
    }

    const userInfo = (await response.json()) as UserWithSocialDetails;
    return userInfo;
  } catch (error) {
    console.warn("fetchUserInfo failed:", error);
    return { userInfo: {} as any, userSocialUrls: {} as any };
  }
};
