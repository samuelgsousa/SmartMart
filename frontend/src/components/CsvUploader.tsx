import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { parse } from 'papaparse'
import { useProducts } from '@/hooks/useProducts'

export function CsvUploader() {
  const [previewData, setPreviewData] = useState<any[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const { bulkCreate } = useProducts()

  const [csvFile, setCsvFile] = useState(null)

  const onSubmit = async () => {
      // Enviar para API
      const resposta = await bulkCreate(csvFile)
      console.log(resposta)
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setIsProcessing(true)
    
    try {
      // Ler e parsear o CSV
      const results = await new Promise<any>((resolve, reject) => {
        parse(file, {
          header: true,
          complete: (results) => resolve(results.data),
          error: reject
        })
      })

      // Validação básica
      if (!results.length || !results[0].name) {
        throw new Error('Formato de CSV inválido')
      }

      // Mostrar preview
      setPreviewData(results.slice(0, 5))
      setCsvFile(results)

      
    } catch (error) {
      console.error('Erro no processamento:', error)
      alert(error instanceof Error ? error.message : 'Erro desconhecido')
    } finally {
      setIsProcessing(false)
    }
  }, [bulkCreate])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    maxFiles: 1,
    disabled: isProcessing
  })

  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          ${isDragActive ? 'border-primary bg-muted' : 'border-muted-foreground'}`}
      >
        <input {...getInputProps()} />
        
        {isProcessing ? (
          <div className="text-muted-foreground">
            Processando arquivo...
          </div>
        ) : (
          <div>
            <p className="text-muted-foreground">
              {isDragActive 
                ? 'Solte o arquivo CSV aqui' 
                : 'Arraste ou clique para selecionar um CSV'}
            </p>
            <Button 
              type="button"
              variant="outline"
              className="mt-4"
            >
              Selecionar Arquivo
            </Button>
          </div>
        )}
      </div>

      {previewData?.length > 0 && (
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Preview (primeiras 5 linhas):</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  {Object.keys(previewData[0]).map((header) => (
                    <th key={header} className="text-left p-2 border-b">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value: any, i) => (
                      <td key={i} className="p-2 border-b">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button onClick={() => onSubmit()}>Enviar</Button>
          <Button variant="destructive" onClick={() => {
            setCsvFile(null)
            setPreviewData(null)
            }}>Limpar</Button>
        </div>
      )}
    </div>
  )
}