//eslint-disable-next-line
import React from 'react'
import { useRef, useState, useEffect } from 'react'
import { createWorker } from 'tesseract.js'

const App: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [worker, setWorker] = useState<any>(null)

  useEffect(() => {
    const initWorker = async () => {
      const newWorker = await createWorker() // Add 'await' here
      await newWorker.load()
      await newWorker.loadLanguage('jpn')
      await newWorker.initialize('jpn')
      setWorker(newWorker)
    }

    initWorker()

    return () => {
      if (worker) {
        worker.terminate().catch((error) => {
          console.error('Error terminating worker:', error)
        })
      }
    }
  }, [])

  // ... (rest of the component code)

  const recognizeImage = async (file: File) => {
    if (!worker) return console.log('特に')

    const { data } = await worker.recognize(file)
    console.log(data.text)
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files

    if (files && files.length > 0) {
      await recognizeImage(files[0])
    }
  }

  return (
    <div>
      <input
        type="file"
        ref={inputRef}
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  )
}

export default App
