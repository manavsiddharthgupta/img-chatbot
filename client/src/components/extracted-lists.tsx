import { useQuery } from '@tanstack/react-query'

interface ImageData {
  id: string
  imagePath: string
  userInputText: string
  extractedText: string
  createdAt: string
}

interface ApiResponse {
  data: ImageData[]
  message: string
}

const fetchImageData = async (): Promise<ApiResponse> => {
  const response = await fetch(
    `${process.env.REACT_APP_BASE_API_URL}/imganalysis`
  )
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

const ExtractedLists = () => {
  const {
    data: imageList,
    isLoading,
    isError
  } = useQuery<ApiResponse, Error>({
    queryKey: ['imageData'],
    queryFn: fetchImageData
  })

  if (isLoading) return <OuterCard>Loading...</OuterCard>
  if (isError) {
    return (
      <OuterCard>
        <p className='text-red-500 text-sm'>
          Failed to load forums. Please try again later.
        </p>
      </OuterCard>
    )
  }

  return (
    <OuterCard>
      <h1 className='text-lg font-semibold mb-6'>
        {imageList?.data.length ?? 0} Extracted Image Data
      </h1>
      <div className='flex flex-col gap-3'>
        {imageList?.data.map((image) => (
          <ImageCard key={image.id} image={image} />
        ))}
      </div>
    </OuterCard>
  )
}

const ImageCard = ({ image }: { image: ImageData }) => (
  <div className='block w-full p-6 border rounded-xl hover:bg-accent hover:text-accent-foreground'>
    <h2 className='font-medium text-lg mb-1'>{image.userInputText}</h2>
    <p className='text-sm'>{image.extractedText}</p>
    <p className='text-xs font-medium text-muted-foreground mt-2 text-right'>
      {new Date(image.createdAt).toLocaleString()}
    </p>
  </div>
)

const OuterCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className='w-full'>{children}</div>
)

export default ExtractedLists
