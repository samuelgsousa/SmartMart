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
        <p>Página de produtos!</p>
        </>
    )
}

export default Products