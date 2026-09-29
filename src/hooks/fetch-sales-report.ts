// Interface for the performance metrics of streaming platforms or countries
interface PerformanceMetrics {
  trackDownloads: number; // Total number of track downloads
  streams: number; // Total number of streams
  totalSales: number; // Total sales
  earnings: number; // Total earnings
}

interface DateMetrics {
  date: string; // Date of the report
  year: number; // Year of the report
  month: number; // Month of the report
}

// Interface for the monthly report
interface MonthlyReport extends PerformanceMetrics, DateMetrics {
  // You can add additional properties specific to MonthlyReport if needed
}

interface IStoreReport extends PerformanceMetrics {
  name: string;
}

interface ICountryReport extends PerformanceMetrics {
  name: string;
  id: string;
}

export const fetchMonthlyReports = async (userId: string | undefined) => {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl || !userId) return [];
    const response = await fetch(
      `${backendUrl}/api/sales-report/month/${userId}`,
    );

    if (!response.ok) {
      return [];
    }

    const monthlySalesReport = (await response.json()) as MonthlyReport[];
    return monthlySalesReport;
  } catch (error) {
    console.warn("fetchMonthlyReports failed:", error);
    return [];
  }
};

export const fetchReportByStore = async (userId: string | undefined) => {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl || !userId) return [];
    const response = await fetch(
      `${backendUrl}/api/sales-report/store/${userId}`,
    );

    if (!response.ok) {
      return [];
    }

    const reportByStore = (await response.json()) as IStoreReport[];
    return reportByStore;
  } catch (error) {
    console.warn("fetchReportByStore failed:", error);
    return [];
  }
};

export const fetchReportByCountry = async (userId: string | undefined) => {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl || !userId) return [];
    const response = await fetch(
      `${backendUrl}/api/sales-report/country/${userId}`,
    );

    if (!response.ok) {
      return [];
    }

    const reportByCountry = (await response.json()) as ICountryReport[];
    return reportByCountry;
  } catch (error) {
    console.warn("fetchReportByCountry failed:", error);
    return [];
  }
};
