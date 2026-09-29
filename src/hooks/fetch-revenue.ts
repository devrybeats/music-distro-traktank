interface MonthlyReport {
  month: number;
  year: number;
  earnings: number;
}

export interface Payout {
  amount: number;
  createdAt: string;
  id: string;
  status: string;
  updatedAt: string;
  userId: string;
}

interface CachedEarnings {
  message: string;
  earnings: number;
  monthlyReports: MonthlyReport[];
}

export const fetchRevenue = async (userId: string | undefined) => {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl || !userId) return { message: "", earnings: 0, monthlyReports: [] };
    const response = await fetch(
      `${backendUrl}/api/payment/revenue/${userId}`,
    );

    if (!response.ok) {
      return { message: "", earnings: 0, monthlyReports: [] };
    }

    const revenueData = (await response.json()) as CachedEarnings;
    return revenueData;
  } catch (error) {
    console.warn("fetchRevenue failed:", error);
    return { message: "", earnings: 0, monthlyReports: [] };
  }
};

export const fetchPayout = async (userId: string | undefined) => {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl || !userId) return [];
    const response = await fetch(
      `${backendUrl}/api/payment/payouts/${userId}`,
    );

    if (!response.ok) {
      return [];
    }

    const payout = (await response.json()) as Payout[];
    return payout;
  } catch (error) {
    console.warn("fetchPayout failed:", error);
    return [];
  }
};
