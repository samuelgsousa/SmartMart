import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../ui/select"

import { useCategories } from "@/hooks/useCategories"
import { useProducts } from "@/hooks/useProducts"

const formSchema = z.object({
    name: z.string() // Primeiro verifica se é string
    .min(1, { message: "O nome não pode estar vazio" }) // Depois valida o comprimento
    .max(250, { message: "O nome deve ter no máximo 250 caracteres" }),

    description: z.string().optional(),

    price: z.coerce
    .number({invalid_type_error: "Preço deve ser um número",})
    .positive("Preço não pode ser negativo ou zero"),

    category_id: z.coerce    .number({
        invalid_type_error: "Selecione uma categoria válida!", // Se não for número
      })
      .positive("Selecione uma categoria!")
      .min(1, "Selecione uma categoria!"),

    brand: z.string() 
    .min(1, { message: "A marca não pode estar vazia" }) 
    .max(45, { message: "A marca deve ter no máximo 45 caracteres" }),

  })

const ProductsForm = ({productUpdating, onSuccess}) => {

    const {categories} = useCategories()
    const {createProduct, isCreating, updateProduct, isUpdating} = useProducts()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: productUpdating || {
            name: '',
            description: '',
            price: 0,
            category_id: 0,
            brand: ''
            },
    })

    const onSubmit = async (data) => {
        console.log("Dados a serem enviados: ", data)

        try {
            if (productUpdating) await updateProduct({id: productUpdating.id, data})
            else await createProduct(data)
        
            onSuccess()
        } catch (error) {
            alert("Falha ao enviar produto!")
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            {/* Nome do produto */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                    <FormControl>
                        <Input type={"text"} placeholder="product name" {...field} />
                    </FormControl>
                  <FormMessage />
                </FormItem>
                
              )}
            />

            {/* Descrição do produto */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                    <FormControl>
                        <Input type={"text"} placeholder="description" {...field} />
                    </FormControl>
                  <FormMessage />
                </FormItem>
                
              )}
            />

            {/* Valor do produto */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priece</FormLabel>
                  <FormControl>
                    <Input type={"number"} placeholder="value" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
                
              )}
            />

        {/* Select da categoria */}
          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} value={String(field.value)}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="0">Select a category</SelectItem>

                               {categories?.map(category => (
                                <SelectItem key={category.id} value={String(category.id)}>{category.name}</SelectItem>
                              ))} 

                            </SelectContent>
                        </Select>
                    <FormMessage />
                </FormItem>
            )}
            />

            {/* Marca do produto */}
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                    <FormControl>
                        <Input type={"text"} placeholder="description" {...field} />
                    </FormControl>
                  <FormMessage />
                </FormItem>
                
              )}
            />

            <Button type="submit">Submit</Button>
        </form>
        </Form>
    )


}

export default ProductsForm