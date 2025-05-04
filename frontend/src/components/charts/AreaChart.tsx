import { 
  Area, 
  AreaChart, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

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

const AreaChartCard = ({chartData, isLoading}) => {

    return (
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
    )
}

export default AreaChartCard