import React from 'react';
import { useSalesData } from '@/hooks/useSalesData';
import PieChartCard  from '@/components/charts/PieChart';
import BarChartCard from '@/components/charts/BarChart';
import AreaChartCard from '@/components/charts/AreaChart';

const Dashboard = () => {
  const { chartData, isLoading, error } = useSalesData();

  const chartConfig = {
    totalQuantity: {
      label: "Quantidade Vendida",
      color: "#8884d8",
    },
    totalProfit: {
      label: "Lucro Total",
      color: "#82ca9d",
    },
  };

  if (error) return <div>Error loading data</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {/* Gráfico de Quantidade */}

      <BarChartCard chartData={chartData} isLoading={isLoading}/>

      {/* Gráfico de Lucro */}
      <AreaChartCard chartData={chartData} isLoading={isLoading}/>

      <div className="md:col-span-1">
        <PieChartCard />
      </div>
      
    </div>
  );
};

export default Dashboard;