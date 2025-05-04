import { useSales } from "@/hooks/useSales";

type ChartData = {
    date: string; 
    totalQuantity: number;
    totalProfit: number;
  }[]

export const useSalesData = () => {
  const { sales, isLoading, error } = useSales();

  const processData = () => {
    if (!sales) return [];

    // Agrupando vendas por data/mês
    const groupedData = sales.reduce((acc, sale) => {
      const date = new Date(sale.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      if (!acc[monthKey]) {
        acc[monthKey] = {
          date: monthKey,
          totalQuantity: 0,
          totalProfit: 0
        };
      }
      
      acc[monthKey].totalQuantity += sale.quantity;
      acc[monthKey].totalProfit += sale.total_price;
      
      return acc;
    }, {} as Record<string, ChartData[number]>);

    return Object.values(groupedData).sort((a, b) => a.date.localeCompare(b.date));
  };

  return {
    chartData: processData(),
    isLoading,
    error
  };
};