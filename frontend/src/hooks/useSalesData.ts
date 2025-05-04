import { useSales } from "@/hooks/useSales";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "./useCategories";

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

export const useCategoryData = () => {
    const { sales, isLoading: salesLoading } = useSales();
    const { products, isLoading: productsLoading } = useProducts();
    const { categories, isLoading: categoriesLoading } = useCategories(); 
  
    const processCategoryData = () => {
      if (!sales || !products || !categories) return [];
  
      // Criando mapa de categorias
      const categoryMap = categories.reduce((acc, category) => {
        acc[category.id] = category.name;
        return acc;
      }, {} as Record<number, string>);
  
      //Mapeando produtos para acesso rápido
      const productMap = products.reduce((acc, product) => {
        acc[product.id] = product;
        return acc;
      }, {} as Record<number, typeof products[number]>);
  
      // Agrupando vendas por categoria
      const categoryData = sales.reduce((acc, sale) => {
        const product = productMap[sale.product_id];
        if (!product) return acc;
  
        const categoryId = product.category_id;
        const categoryName = categoryMap[categoryId] || `Categoria ${categoryId}`;
        
        acc[categoryName] = (acc[categoryName] || 0) + sale.quantity;
        return acc;
      }, {} as Record<string, number>);
  
      // Transformando em array formatada
      return Object.entries(categoryData).map(([name, value]) => ({
        name,
        value,
      }));
    };
  
    return {
      categoryData: processCategoryData(),
      isLoading: salesLoading || productsLoading || categoriesLoading,
    };
  };