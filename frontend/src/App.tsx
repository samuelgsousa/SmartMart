import React from"react";
import { useState, useEffect, useMemo  } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";

import SalesService from "./services/sales.service" 

// Função para “humanizar” a chave, ex: "total_price" -> "Total Price"

const humanize = (key: string) =>
    key
      .split("_")
      .map(w => w[0].toUpperCase() + w.slice(1))
      .join(" ");

// Formata valores conforme a coluna, ex: data ou preço
const formatCellValue = (value: any, key: string) => {
    if (key === "date" && typeof value === "string") {
      return new Date(value).toLocaleDateString();
    }
    if (key === "total_price" && typeof value === "number") {
      return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }
    return String(value);
  };
  


function App() {

    const [sales, setSales] = useState<any[]>([]);




    useEffect(() => {
        SalesService.getAll().then(data => {
          setSales(data);
        });
      }, []);

    return (
        <>
        <h1 className="text-3xl font-bold underline">Smart Mart</h1>

        <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead key={"product_name"}>Product Name</TableHead>
                    <TableHead key={"total_price"}>Total Price</TableHead>
                    <TableHead key={"quantity"}>Quantity</TableHead>
                    <TableHead key={"date"}>Date</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
            {sales.map(sale => (
                <TableRow key={sale.id}>
                    <TableCell key={"product_name_cell"}>{sale.product_name}</TableCell>
                    <TableCell key={"total_price_cell"}>{sale.total_price}</TableCell>
                    <TableCell key={"quantity_cell"}>{sale.quantity}</TableCell>
                    <TableCell key={"date"}>{new Date(sale.date).toLocaleDateString()}</TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>

      
        </>
  );
  }
  
  export default App;