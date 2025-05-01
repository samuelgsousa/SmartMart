import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";

import {
Dialog,
DialogContent,
DialogHeader,
DialogTitle,
} from "@/components/ui/dialog"

import {useProducts} from '../hooks/useProducts'

const Products = () => {

    const {products} = useProducts()

    useEffect(() => {
        if (products) console.log(products)
    }, [products]);

    return (
        <>
    
            
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead key={"product_id_head"}>Product Id</TableHead>
                    <TableHead key={"product_name_head"}>Product Name</TableHead>
                    <TableHead key={"description_head"}>Description</TableHead>
                    <TableHead key={"price_head"}>Price</TableHead>
                    <TableHead key={"category_head"}>Category</TableHead>
                    <TableHead key={"brand_head"}>Brand</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {products.map(product => (
                    <TableRow key={`product_row_${product.id}`}>
                        <TableCell key={`product_id_${product.id}`}>{product.id}</TableCell>
                        <TableCell key={`product_name_${product.name}`}>{product.name}</TableCell>
                        <TableCell key={`product_description_${product.description}`}>{product.description}</TableCell>
                        <TableCell key={`product_price_${product.price}`}>{product.price}</TableCell>
                        <TableCell key={`product_category_id_${product.category_id}`}>{product.category_id}</TableCell>
                        <TableCell key={`product_brand_${product.brand}`}>{product.brand}</TableCell>
                    </TableRow>

                ))}
            </TableBody>
        </Table>

        </>
    )
}

export default Products