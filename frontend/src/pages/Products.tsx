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
import { useCategories } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import ProductsForm from '@/components/forms/ProductsForm';
import { Trash2, Pencil, Loader2, X, Check   } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CsvUploader } from '@/components/CsvUploader';
import { Input } from '@/components/ui/input';
import { DeleteCategoryError } from '@/utils/Errors';


const Products = () => {

    const {products, deleteProduct, deletingStates} = useProducts()
    



const TabProducts = () => {
    
    const [DialogIsOpen, setDialogIsOpen] = useState(false)
    const [productUpdating, setProductUpdating] = useState(null)
    
    const handleNewProduct = () => {
        setProductUpdating(null)
        setDialogIsOpen(true)
    }

    const handleProductUpdate = (product) => {
        setProductUpdating(product)
        setDialogIsOpen(true)
    }

    // Função auxiliar para verificar o estado ao deletar um produto
    const isDeleting = (productId: number) => deletingStates.some(state => state.id === productId && state.isDeleting);

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
                        <TableCell key={`product_name_${product.id}`}>{product.name}</TableCell>
                        <TableCell key={`product_description_${product.id}`}>{product.description}</TableCell>
                        <TableCell key={`product_price_${product.id}`}>{product.price}</TableCell>
                        <TableCell key={`product_${product.id}_category`}>{product.category_name}</TableCell>
                        <TableCell key={`product_brand_${product.id}`}>{product.brand}</TableCell>
                        <TableCell className="flex gap-2" key={`action_buttons_${product.id}`}>
                            <Button variant="destructive" size="icon" onClick={() => deleteProduct(product.id)} disabled={isDeleting(product.id)}>
                            {isDeleting(product.id) ? 
                            ( <Loader2 className="animate-spin"/>)  
                            :
                            (<Trash2 className="h-5 w-5"/>)  
                            }
                            
                           
                            </Button>
    
                            <Button variant="warning" size="icon" onClick={() => handleProductUpdate(product)}> 
                                <Pencil className="h-5 w-5" />
                            </Button>

                        </TableCell>
                    </TableRow>

                ))}
            </TableBody>
        </Table>

        <Button variant="success" onClick={() => handleNewProduct()}>New Product</Button>

        <Dialog open={DialogIsOpen} onOpenChange={setDialogIsOpen}>


        <DialogContent>
            <DialogHeader><DialogTitle>{productUpdating ? `Update product ${productUpdating.id}` : 'New Product'}</DialogTitle></DialogHeader>

            <ProductsForm productUpdating={productUpdating} onSuccess={() => setDialogIsOpen(false)}/>

        </DialogContent>
        </Dialog>
            </>
        )
}


const TabCategories = () => {

    const {categories, updateCategory, createCategory, deleteCategory} = useCategories()

    const [categoryUpdating, setCategoryUpdating] = useState(null)
    const [editedName, setEditedName] = useState('')

    const [categoryCreating, setCategoryCreating] = useState(false)
    const [newCategoryName, setNewCategoryName] = useState('')

    const [categoryDeletingId, setCategoryDeletingId] = useState(null)
    const [errorProductCount, setErrorProductCount] = useState(null)
    const [warningDialog, setWarningDialog] = useState(false)
    const [deleteOption, setDeleteOption] = useState('reassign')


    const handleCategoryUpdate = async (category) => {
        
        setCategoryUpdating(category)
        setEditedName(category.name);
    }

    const submitEditingCategory = async () =>{
        try {
            if (!categoryUpdating) return;
            
            const response = await updateCategory({
              id: categoryUpdating.id,
              data: { name: editedName } 
            });
        
            if (response) {
              setCategoryUpdating(null);
              setEditedName(''); // Limpa o estado
            }
          } catch (error) {
            console.error('Erro ao atualizar categoria:', error);
          }
    }

    const submitNewCategory = async () => {
        try {
            if (!categoryCreating) return;

            const response = await createCategory({name: newCategoryName});

            if (response) {
                setCategoryCreating(false)
                setNewCategoryName('')
            }

        } catch (error) {
            console.error('Erro ao adicionar categoria:', error);
        }
    }

    const submitDeleteCategory = async (category_id, delete_params) => {
        
        try {
            await deleteCategory({id: category_id, delete_params: delete_params})

        } catch (error) {

            if (error instanceof DeleteCategoryError) {
                setWarningDialog(true)
                setCategoryDeletingId(category_id)
                console.log("Detalhes: ", error.status.detail.products_count)
                setErrorProductCount(error.status.detail.products_count)
            }

            else console.error(error)
       
            

        }
        
    }


    return (
        <>
        <Dialog open={warningDialog} onOpenChange={setWarningDialog}>
            <DialogContent>
                <DialogHeader><DialogTitle> Aviso! A categoria {categoryDeletingId} possui {errorProductCount} produto() vinculados a ela! Como deseja prosseguir?</DialogTitle></DialogHeader>

                        
            <div className="flex items-center mb-4">
                <input checked={deleteOption === 'force_delete'} onChange={(e) => setDeleteOption(e.target.value)} type="radio" value="force_delete" name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                <label htmlFor="default-radio-1" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Deletar todos os produtos vinculados</label>
            </div>

            <div className="flex items-center">
                <input checked={deleteOption === 'reassign'} onChange={(e) => setDeleteOption(e.target.value)} type="radio" value="reassign" name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                <label htmlFor="default-radio-2" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Alterar a categoria dos produtos para "Outros"</label>
            </div>

            {deleteOption === 'force_delete' && (
                <p className="text-red-600">ATENÇÃO: A exclusão dos produtos também removerá permanentemente TODOS os registros de vendas associados!</p>
            )}

        <Button variant="destructive" size="sm" onClick={() => submitDeleteCategory(categoryDeletingId, deleteOption)}>
            Continuar
        </Button>
        
        <Button variant="success" size="sm" onClick={() => setWarningDialog(false)}>
            Cancelar
        </Button>

            </DialogContent>
        </Dialog>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead key={"category_id_head"}>Id</TableHead>
                    <TableHead key={"category_name_head"}>Category Name</TableHead>
                    <TableHead key={"category_action_head"}>Action</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {categories.map(category => (
                    <TableRow key={`category_row_${category.id}`}>

                        <TableCell key={`category_id_${category.id}`}>{category.id}</TableCell> 

                        <TableCell key={`category_name_${category.id}`}>
                            {categoryUpdating?.id == category.id ? (<Input type="text" value={editedName} onChange={(e) => setEditedName(e.target.value)}/>) : category.name} 
                        </TableCell>

                        <TableCell key={`category_action_${category.id}`}>

                            {categoryUpdating?.id == category.id ? (
                               <>
                                <Button variant="destructive" size="icon" onClick={() => setCategoryUpdating(null)}>
                                    <X className="h-6 w-6"/>
                                </Button>

                                <Button variant="success" size="icon" onClick={() => submitEditingCategory()}>
                                    <Check />
                                </Button>

                               </>
                            ) : (
                                <>
                                
                            <Button variant="destructive" size="icon" onClick={() => submitDeleteCategory(category.id)}>

                                <Trash2 className="h-5 w-5"/>

                                {/* {isDeleting(product.id) ? 
                                ( <Loader2 className="animate-spin"/>)  
                                :
                                (<Trash2 className="h-5 w-5"/>)  
                                } */}


                            </Button>

                            <Button variant="warning" size="icon" onClick={() => handleCategoryUpdate(category)}> 
                                <Pencil className="h-5 w-5" />
                            </Button>
                                </>
                            )
                        
                        }


                        </TableCell>

                    </TableRow>
                ))}

            {categoryCreating && (
                <TableRow key={`new_category_row`}>
                    <TableCell key={`new_category_id`}>New</TableCell> 
    
                    <TableCell key={`new_category_name`}>
                        <Input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)}/>
                    </TableCell> 
    
                    <TableCell key={`new_category_actions`}>
    
                        <Button variant="destructive" size="icon" onClick={() => setCategoryCreating(false)}>
                            <X className="h-6 w-6"/>
                        </Button>

                        <Button variant="success" size="icon" onClick={() => submitNewCategory()}>
                            <Check />
                        </Button>
    
                    </TableCell>  
                </TableRow>
            )}



            </TableBody>


        </Table>
        <Button onClick={() => setCategoryCreating(true)}>New Category</Button>
        </>
    )
}


    return (
        <>

        
        <Tabs defaultValue="products_tab" >
        <TabsList>
            <TabsTrigger value="products_tab">Products</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="csv_uploader">CSV Uploader</TabsTrigger>
        </TabsList>
        <TabsContent value="products_tab"> <TabProducts/> </TabsContent>
        
        <TabsContent value="categories"><TabCategories/></TabsContent>
        <TabsContent value="csv_uploader"> <CsvUploader/> </TabsContent>
        </Tabs>

       

            


        </>
    )
}

export default Products