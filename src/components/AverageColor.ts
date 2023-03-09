export const AverageColor = (
  imgData: ImageData,
  oldImgData: ImageData | null,
  fps: number
) => {
  const width = imgData.width
  const height = imgData.height

  //新しい写真の色の平均を計算する
  const tempaveImageData = new Uint32Array(width * height * 4)
  const data = imgData.data
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const pos = 4 * (i * width + j)
      tempaveImageData[pos] += data[pos]
      tempaveImageData[pos + 1] += data[pos + 1]
      tempaveImageData[pos + 2] += data[pos + 2]
      tempaveImageData[pos + 3] += data[pos + 3]
    }
  }
  const aveImageData = new ImageData(width, height)
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const pos = 4 * (i * width + j)
      aveImageData.data[pos] = tempaveImageData[pos] / fps
      aveImageData.data[pos + 1] = tempaveImageData[pos + 1] / fps
      aveImageData.data[pos + 2] = tempaveImageData[pos + 2] / fps
      aveImageData.data[pos + 3] = tempaveImageData[pos + 3] / fps
    }
  }

  //それまでcanvasに描かれた画像が0枚ならimageDataだけ計算して返す
  if (oldImgData === null) {
    console.log('canvasに書かれた画像はなし')
    return aveImageData
  }

  //これまで描かれた写真の平均を計算。
  const tempaveImageDatas = new Uint32Array(width * height * 4)

  if (oldImgData.data) {
    const datas = oldImgData.data
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const pos = 4 * (i * width + j)
        tempaveImageDatas[pos] += datas[pos]
        tempaveImageDatas[pos + 1] += datas[pos + 1]
        tempaveImageDatas[pos + 2] += datas[pos + 2]
        tempaveImageDatas[pos + 3] += datas[pos + 3]
      }
    }

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const pos = 4 * (i * width + j)
        aveImageData.data[pos] += tempaveImageDatas[pos] * ((fps - 1) / fps)
        aveImageData.data[pos + 1] +=
          tempaveImageDatas[pos + 1] * ((fps - 1) / fps)

        aveImageData.data[pos + 2] +=
          tempaveImageDatas[pos + 2] * ((fps - 1) / fps)

        aveImageData.data[pos + 3] +=
          tempaveImageDatas[pos + 3] * ((fps - 1) / fps)
      }
    }

    return aveImageData
  }
}
