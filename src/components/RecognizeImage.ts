import type React from 'react'
import { useRef, useState } from 'react'
import Tesseract from 'tesseract.js'
import cv from '@techstark/opencv-js'

export const recognizeImage = async (url: string, worker: any) => {
  console.log(worker)
  if (!worker) return console.log('workerがnull')
  const { data } = await worker.recognize(url, {
    tessedit_ocr_engine_mode: 1,
    tessedit_pageseg_mode: 3,
    //元号変わったら追加してください。
    tessedit_char_whitelist: '0123456789月日年令和昭和平成大正明治',
  })
  console.log(data.text)
}

/*
import cv from '@techstark/opencv-js'
import Tesseract from 'tesseract.js'

export const processImage = async (OcrUrl: string) => {
  // Load image using OpenCV.js
  const imgElement = new Image()
  imgElement.src = OcrUrl
  await new Promise((resolve) => {
    imgElement.onload = () => {
      resolve(true)
    }
  })
  const src = cv.imread(imgElement)
  const dst = new cv.Mat()
  const binaryImage = new cv.Mat()

  // Convert the image to grayscale
  cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY)

  // Apply binary thresholding
  const thresholdValue = 80
  const maxValue = 255
  cv.threshold(dst, binaryImage, thresholdValue, maxValue, cv.THRESH_BINARY)

  // Create a canvas element and draw the binary OpenCV image
  const canvas = document.createElement('canvas')
  canvas.width = binaryImage.cols
  canvas.height = binaryImage.rows
  const ctx = canvas.getContext('2d')
  const imgData = ctx!.createImageData(canvas.width, canvas.height)
  imgData.data.set(new Uint8ClampedArray(binaryImage.data))
  ctx!.putImageData(imgData, 0, 0)

  // Perform OCR using Tesseract.js
  try {
    const result = await Tesseract.recognize(canvas, 'jpn', {
      // Your other Tesseract options
    })

    // Display the OCR result
    console.log(result.data.text)
  } catch (err) {
    console.error('Error while performing OCR:', err)
  } finally {
    // Clean up OpenCV objects
    src.delete()
    dst.delete()
    binaryImage.delete()
  }
}
*/
