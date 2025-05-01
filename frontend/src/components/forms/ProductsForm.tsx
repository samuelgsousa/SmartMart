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
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover"
import {useProducts} from '../../hooks/useProducts'
import { Product } from "@/interfaces/interfaces"

const ProductsForm = ({productUpdating, onSuccess}) => {


}

export default ProductsForm