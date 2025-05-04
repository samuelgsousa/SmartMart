import { 
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

const BarChartCard = ({chartData, isLoading}) => {
     
    //Gráfico de Quantidade 
    return (
            
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
    )
}

export default BarChartCard