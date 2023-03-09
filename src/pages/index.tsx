import { useRef, useState } from 'react'
import React from 'react'
import Webcam from 'react-webcam'
import type { NextPage } from 'next'
import styled from 'styled-components'
import { useEffect } from 'react'
import { AverageColor } from 'src/components/AverageColor'
import { exportJpeg } from 'src/components/ExportJpeg'

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

let oldImgData: ImageData | null = null

const Home: NextPage = () => {
  const [isCaptureEnable, setCaptureEnable] = useState<boolean>(false)
  const webcamRef = useRef<Webcam>(null)
  //動画から何も加工していない画像のURL
  const [url, setUrl] = useState<string | null>(null)
  //加工した画像のURL
  const [afterUrl, setAfterUrl] = useState<string | undefined>(undefined)
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)
  //s3からgetした加工し終わった画像のURL

  //canvasの要素を作成
  useEffect(() => {
    const canvaselem = document.createElement('canvas')
    canvaselem.width = videoConstraints.width
    canvaselem.height = videoConstraints.height
    const ctx = canvaselem.getContext('2d')
    setContext(ctx)
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
          //画像処理可能なImageData型に変換
          const imageData = context.getImageData(0, 0, 720, 360)
          //画像の色の平均値を取得
          const aveImageData = imageData
          //処理が終わったImageData型の画像を取得、保存
          const result = AverageColor(
            aveImageData,
            oldImgData,
            fps
          ) as ImageData
          oldImgData = result
          const exportURL = exportJpeg(result)
          setAfterUrl(exportURL as string)
          //const s3URL = await s3GetObject(s3, command)
          //setS3AfterUrl(s3URL)
          //console.log(exportURL)
          //URLsの数と同じ
        }
      }

      interval(dumyfps)
    }, dumyfps)
  }

  //if (process.env.)

  return (
    <Container>
      <Main>
        <h1>カメラアプリ</h1>

        {isCaptureEnable || (
          <button
            onClick={() => {
              setCaptureEnable(true)
              interval(50)
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
          </>
        )}
      </Main>
    </Container>
  )
}

export default Home
