export const AverageColor = (
  imgData: ImageData,
  oldImgData: ImageData | null,
  fps: number
) => {
  const width = imgData.width
  const height = imgData.height

  const aveImageData = new ImageData(width, height)

  //それまでcanvasに描かれた画像が0枚ならimageDataだけ計算して返す
  if (oldImgData === null) {
    //console.log('canvasに書かれた画像はなし')
    return aveImageData
  }

  const tempaveImageDatas = new Uint8Array(width * height * 4)
  /*
  for (let y = 0;y < height; y++){
    for (let x = 0;x<width;x++){
      let r = x;
      let g = y;
      let b = 0;

      aveImageData.data[(x+y*height)*4] = r
      
      
    }
  }
  */
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

    return imgData
  }
}
