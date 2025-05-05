
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CsvUploader } from '@/components/CsvUploader';
import TabCategories from '@/components/Categories';
import TabProducts from '@/components/Products';

const Products = () => {

    return (
        <div className="pl-3 mt-3 mb-3 pr-3">

        <Tabs defaultValue="products_tab" >
        <TabsList className='mb-3'>
            <TabsTrigger className="data-[state=inactive]:cursor-pointer" value="products_tab">Products</TabsTrigger>
            <TabsTrigger className="data-[state=inactive]:cursor-pointer" value="categories">Categories</TabsTrigger>
            <TabsTrigger className="data-[state=inactive]:cursor-pointer" value="csv_uploader">CSV Uploader</TabsTrigger>
        </TabsList>

        <TabsContent value="products_tab"> <TabProducts/> </TabsContent>
        <TabsContent value="categories"> <TabCategories/> </TabsContent>
        <TabsContent value="csv_uploader"> <CsvUploader/> </TabsContent>
        </Tabs>



        </div>
    )
}

export default Products