import { useRef, useState } from 'react'
import React from 'react'
import Webcam from 'react-webcam'
import type { NextPage } from 'next'
import styled from 'styled-components'
import { useEffect } from 'react'
import { createWorker } from 'tesseract.js'
import { exportJpeg } from 'src/components/ExportJpeg'
import { CulcRGBA } from '@/components/CulcRGBA'
import { recognizeImage } from '@/components/RecognizeImage'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  min-height: 100vh;
  padding: 0 0.5rem;
`

const Main = styled.main`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 0;
`
const videoConstraints = {
  width: 720,
  height: 360,
  facingMode: 'user',
}

const OCRImg = {
  width: 240,
  height: 160,
  facingMode: 'user',
}
const OCR2Img = {
  width: 230,
  height: 80,
  facingMode: 'user',
}

const Home: NextPage = () => {
  const [isCaptureEnable, setCaptureEnable] = useState<boolean>(false)
  const webcamRef = useRef<Webcam>(null)
  //動画から何も加工していない画像のURL
  const [url, setUrl] = useState<string | null>(null)
  //加工した画像のURL
  const [afterUrl, setAfterUrl] = useState<string | undefined>(undefined)
  const [ocrUrl, setOcrUrl] = useState<string | undefined>(undefined)
  const [ocr2Url, setOcr2Url] = useState<string | undefined>(undefined)

  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)
  //const inputRef = useRef<HTMLInputElement>(null)
  const [worker, setWorker] = useState<any>(null)
  //s3からgetした加工し終わった画像のURL

  //canvasの要素を作成
  useEffect(() => {
    const canvaselem = document.createElement('canvas')
    canvaselem.width = videoConstraints.width
    canvaselem.height = videoConstraints.height
    const ctx = canvaselem.getContext('2d')

    setContext(ctx)
  }, [])

  useEffect(() => {
    const initWorker = async () => {
      const newWorker = await createWorker() // Add 'await' here
      await newWorker.load()
      await newWorker.loadLanguage('jpn')
      await newWorker.initialize('jpn')
      setWorker(newWorker)
      console.log('workerEffect実行')
    }
    initWorker()
  }, [])

  const interval = (dumyfps: number) => {
    const fps = 1000 / dumyfps
    setTimeout(() => {
      //元のwebカメラの動画のスクショ
      const movie = webcamRef.current?.getScreenshot() //as string | null
      //console.log(movie)
      if (movie) {
        setUrl(movie)
      }
      if (context !== null && typeof movie === 'string') {
        const img = new Image()
        img.src = movie
        img.onload = async () => {
          //canvas上に画像を描画
          context.drawImage(img, 0, 0)

          //ここで色を判別(これは共通入浴券げ変わるたびに変更しなければいけない)
          const rgba1 = context.getImageData(250, 50, 1, 1)
          const rgba2 = context.getImageData(290, 340, 1, 1)
          const rgba3 = context.getImageData(350, 250, 1, 1)
          const rgba4 = context.getImageData(470, 20, 1, 1)
          const rgba5 = context.getImageData(260, 320, 1, 1)
          const rgba6 = context.getImageData(480, 250, 1, 1)
          const ArrayRgba = [
            rgba1.data,
            rgba2.data,
            rgba3.data,
            rgba4.data,
            rgba5.data,
            rgba6.data,
          ]
          const JudgeCard: boolean = CulcRGBA(ArrayRgba)
          console.log(JudgeCard)
          //線を引く(これは都度変更しなければいけないわけではないが、視覚的に確認するため)
          context.beginPath()
          //上から下に
          context.moveTo(250, 50)
          context.lineTo(250, 50)
          context.lineWidth = 5
          context.stroke()
          context.beginPath()
          //
          context.beginPath()
          context.moveTo(290, 340)
          context.lineTo(290, 330)
          context.lineWidth = 5
          context.stroke()
          //
          context.beginPath()
          context.moveTo(350, 250)
          context.lineTo(350, 240)
          context.lineWidth = 5
          context.stroke()
          //
          context.beginPath()
          context.moveTo(470, 20)
          context.lineTo(470, 10)
          context.lineWidth = 5
          context.stroke()
          //
          context.beginPath()
          context.moveTo(260, 320)
          context.lineTo(260, 310)
          context.lineWidth = 5
          context.stroke()
          //
          context.beginPath()
          context.moveTo(480, 250)
          context.lineTo(480, 240)
          context.lineWidth = 5
          context.stroke()
          context.beginPath()
          /*
          OCR読み取りが正しいか判断するプログラム
          */

          /*
          共通入浴券と認識できた時の処理
          */

          //ここから下の処理は視覚的に確認するためのもので、実際の挙動には関係ない
          const imageData = context.getImageData(0, 0, 720, 360)
          //OCRの読み取り座標。都度変更必要
          const OCRData = context.getImageData(
            260,
            40,
            OCRImg.width,
            OCRImg.height
          )
          const OCR2Data = context.getImageData(
            260,
            120,
            OCR2Img.width,
            OCR2Img.height
          )
          const exportURL = exportJpeg(imageData, videoConstraints)
          const exportOCR = exportJpeg(OCRData, OCRImg)
          const exportOCR2 = exportJpeg(OCR2Data, OCR2Img)
          setOcrUrl(exportOCR as string)
          setOcr2Url(exportOCR2 as string)
          setAfterUrl(exportURL as string)
          //recognizeImage(exportOCR as string, worker)
          recognizeImage(exportOCR2 as string, worker)
          //processImage(exportOCR as string)
        }
      }

      interval(dumyfps)
    }, dumyfps)
  }

  return (
    <Container>
      <Main>
        <h1>カメラアプリ</h1>

        {isCaptureEnable || (
          <button
            onClick={() => {
              setCaptureEnable(true)
              interval(500)
            }}
          >
            開始
          </button>
        )}
        {isCaptureEnable && (
          <>
            <div>
              <button onClick={() => setCaptureEnable(false)}>終了</button>
            </div>
            <div>
              <Webcam
                audio={false}
                width={720}
                height={360}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
              />
            </div>
          </>
        )}
        {url && (
          <>
            <div>
              <button
                onClick={() => {
                  setUrl(null)
                }}
              >
                削除
              </button>
            </div>

            <div>
              <img
                src={afterUrl}
                alt="平均化画像"
              />
              <canvas
                id="canvas-out"
                width={videoConstraints.width}
                height={videoConstraints.height}
              />
            </div>
            <div>
              <img
                src={ocrUrl}
                alt="OCR"
              />
              <canvas
                width={OCRImg.width}
                height={OCRImg.height}
              />
            </div>
            <div>
              <img
                src={ocr2Url}
                alt="OCR"
              />
              <canvas
                width={OCR2Img.width}
                height={OCR2Img.height}
              />
            </div>
          </>
        )}
      </Main>
    </Container>
  )
}

export default Home
