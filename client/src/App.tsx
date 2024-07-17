import ExtractedLists from './components/extracted-lists'
import Form from './components/form'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription
} from './components/ui/card'

function App() {
  return (
    <>
      <main className='sm:px-20 px-4 sm:pt-16 py-4 max-w-7xl mx-auto'>
        <div className='md:flex flex-row gap-16'>
          <div className='md:w-[410px] h-fit md:sticky md:top-8'>
            <Card className='w-full h-fit'>
              <CardHeader>
                <CardTitle>Analyze Your Image</CardTitle>
                <CardDescription>
                  Upload an image and we'll extract the text and other relevant
                  information for you.
                </CardDescription>
              </CardHeader>
              <Form />
            </Card>
          </div>
          <div className='h-fit md:w-[calc(100%-464px)] mt-12 md:mt-0 w-full'>
            <ExtractedLists />
          </div>
        </div>
      </main>
      {/* <footer className='w-full border border-black h-10 absolute bottom-0'></footer> */}
    </>
  )
}

export default App
