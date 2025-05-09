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
import { useCategories } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Trash2, Pencil, Loader2, X, Check   } from "lucide-react";
import { Input } from '@/components/ui/input';
import { DeleteCategoryError } from '@/utils/Errors';

const TabCategories = () => {

    const [categoryUpdating, setCategoryUpdating] = useState(null)
    const [editedName, setEditedName] = useState('')

    const [categoryCreating, setCategoryCreating] = useState(false)
    const [newCategoryName, setNewCategoryName] = useState('')

    const {categories, updateCategory, createCategory, deleteCategory} = useCategories()

    const [warningDialog, setWarningDialog] = useState(false)
    const [categoryDeletingId, setCategoryDeletingId] = useState(null)
    const [errorProductCount, setErrorProductCount] = useState(null)


    
    const [deleteOption, setDeleteOption] = useState('reassign')

    useEffect(() => {
       console.log(warningDialog)
      }, [warningDialog]);

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
            setWarningDialog(false)

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
                <DialogHeader><DialogTitle> Aviso! A categoria {categoryDeletingId} possui {errorProductCount} produtos vinculados a ela! Como deseja prosseguir?</DialogTitle></DialogHeader>

                        
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

        <Button variant='success' className='mb-3' onClick={() => setCategoryCreating(true)}>New Category</Button>

        <div className="rounded-md border "> 
            <Table>
                <TableHeader>
                    <TableRow className="[&_th]:bg-muted/50 [&_th]:hover:bg-muted">
                        <TableHead key={"category_id_head"}>Id</TableHead>
                        <TableHead key={"category_name_head"}>Category Name</TableHead>
                        <TableHead key={"category_action_head"}>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories.map((category, index) => (
                        <TableRow className={`${index % 2 === 0 ? 'bg-teal-300/50' : 'bg-teal-600/70'} hover:bg-teal-400`} key={`category_row_${category.id}`}>
                            <TableCell className='text-base pl-3' key={`category_id_${category.id}`}>{category.id}</TableCell>
                            <TableCell className='w-150' key={`category_name_${category.id}`}>
                                {categoryUpdating?.id == category.id ? (<Input className='bg-white w-50' type="text" value={editedName} onChange={(e) => setEditedName(e.target.value)}/>) : category.name}
                            </TableCell>
                            <TableCell className="flex gap-2" key={`category_action_${category.id}`}>
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
            
                                <Button variant="destructive" size="icon" onClick={() => submitDeleteCategory(category.id, "void")}>
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
                    <TableRow className='bg-blue-300 hover:bg-blue-300' key={`new_category_row`}>
                        <TableCell key={`new_category_id`}>New</TableCell>
                        <TableCell className='w-150' key={`new_category_name`}>
                            <Input className='bg-white w-50' type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)}/>
                        </TableCell>
                        <TableCell className="flex gap-2" key={`new_category_actions`}>
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
        </div>
        
        
        </>
    )

}

export default TabCategories