import React from 'react';
import { useSalesData } from '@/hooks/useSalesData';
import { 
  Area, 
  AreaChart, 
  Bar, 
  BarChart, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PieChartCard } from '@/components/charts/PieChart';

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
      <Card>
        <CardHeader>
          <CardTitle>Quantidade de Vendas Mensais</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          {isLoading ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date"
                  tickFormatter={(value) => 
                    new Date(value).toLocaleDateString('pt-BR', { 
                      month: 'short', 
                      year: '2-digit' 
                    })
                  }
                />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="totalQuantity"
                  fill={chartConfig.totalQuantity.color}
                  name={chartConfig.totalQuantity.label}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Gráfico de Lucro */}
      <Card>
        <CardHeader>
          <CardTitle>Lucro Mensal</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          {isLoading ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date"
                  tickFormatter={(value) => 
                    new Date(value).toLocaleDateString('pt-BR', { 
                      month: 'short', 
                      year: '2-digit' 
                    })
                  }
                />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="totalProfit"
                  stroke={chartConfig.totalProfit.color}
                  fill={chartConfig.totalProfit.color}
                  fillOpacity={0.3}
                  name={chartConfig.totalProfit.label}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <div className="md:col-span-1">
        <PieChartCard />
      </div>
      
    </div>
  );
};

export default Dashboard;