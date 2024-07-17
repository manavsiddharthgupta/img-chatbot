import { CardContent, CardFooter } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { Button } from '../components/ui/button'
import { useState } from 'react'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Image, LoaderCircle, UploadIcon } from 'lucide-react'
import { toast } from 'sonner'
import { uploadFilesToS3 } from '../lib/s3'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { validateFile } from '../lib/utils'

const Form = () => {
  const [image, setImage] = useState<File | null>(null)
  const [text, setText] = useState<string | null>(null)
  const [imageURI, setImageURI] = useState<string | null>(null)
  const [uploadingStatus, setUploadingStatus] = useState(false)
  const [mutationStatus, setMutationStatus] = useState(false)

  const queryClient = useQueryClient()
  const analyzeImageMutation = useMutation({
    mutationFn: async ({
      textInput,
      imageUrl
    }: {
      textInput: string
      imageUrl: string
    }) => {
      const response = await fetch(
        process.env.REACT_APP_BASE_API_URL + '/imganalysis',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            textInput,
            imageUrl,
            useAI: false
          })
        }
      )
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    },
    onSuccess: (data: any) => {
      console.log('Analysis successful:', data)
      setImageURI(null)
      setImage(null)
      setText(null)
      setMutationStatus(false)
      queryClient.invalidateQueries({ queryKey: ['imageData'] })
    },
    onError: (error: any) => {
      setMutationStatus(false)
      toast('Error analyzing image:', {
        description: `${error}`
      })
      console.error('Error analyzing image:', error)
    }
  })

  const uploadToS3 = async (file: File) => {
    try {
      validateFile(file)
      setUploadingStatus(true)
      const fileUrl = await uploadFilesToS3('ence-invoice', file.name, file)
      if (fileUrl) {
        setImageURI(fileUrl)
        setUploadingStatus(false)
      } else {
        setImageURI(null)
        throw new Error('Invalid bucket image URI')
      }
    } catch (error) {
      setUploadingStatus(false)
      toast('Error uploading image:', {
        description: `${error}`
      })
      console.log(error)
    }
  }

  const handleAnalyze = () => {
    if (!imageURI || !text) {
      toast('Invalid Image or Text Input')
      console.error('Invalid Image or Text Input')
      return
    }
    setMutationStatus(true)
    analyzeImageMutation.mutate({ textInput: text, imageUrl: imageURI })
  }

  return (
    <>
      <CardContent>
        <form>
          <div className='grid w-full items-center gap-4'>
            <div className='flex flex-col space-y-1.5'>
              <Label htmlFor='image'>Image</Label>
              <div className='border border-dashed rounded-lg relative h-16'>
                {uploadingStatus && <UploadingImage />}
                {imageURI && image && !uploadingStatus && (
                  <FileUi fileName={image.name} />
                )}
                {!uploadingStatus && !imageURI && <UploadUi />}
                <Input
                  id='image'
                  className='absolute top-0 w-full h-full opacity-0'
                  type='file'
                  accept='image/*'
                  onChange={async (event) => {
                    if (!event.target.files) {
                      return
                    }
                    await uploadToS3(event.target.files[0])
                    setImage(event.target.files[0])
                  }}
                  required
                />
              </div>
            </div>
            <div className='flex flex-col space-y-1.5'>
              <Label htmlFor='text'>Text</Label>
              <Textarea
                value={text || ''}
                onChange={(e) => {
                  setText(e.target.value)
                }}
                placeholder='Enter any additional text'
                id='text'
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleAnalyze}
          disabled={mutationStatus}
          className='w-full'
        >
          {mutationStatus && (
            <LoaderCircle size={18} className='animate-spin mr-1.5' />
          )}
          Analyze
        </Button>
      </CardFooter>
    </>
  )
}

export default Form

const UploadUi = () => {
  return (
    <div className='flex gap-4 py-6 justify-center items-center'>
      <UploadIcon size={18} />
      <p className='text-xs'>
        Upload an Image
        <span className='pl-1 text-muted-foreground'>
          PNG, JPG, WEBP up to 5MB
        </span>
      </p>
    </div>
  )
}

const UploadingImage = () => {
  return (
    <div className='flex gap-2 py-6 justify-center items-center'>
      <LoaderCircle className='animate-spin' size={18} />
      <p className='text-xs'>Uploading an Image</p>
    </div>
  )
}

const FileUi = ({ fileName }: { fileName: string }) => {
  return (
    <div className='flex gap-4 py-6 justify-center items-center'>
      <Image size={18} />
      <p className='text-xs max-w-64 truncate'>{fileName}</p>
    </div>
  )
}
