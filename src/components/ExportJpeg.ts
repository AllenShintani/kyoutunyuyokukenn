const videoConstraints = {
  width: 720,
  height: 360,
  facingMode: 'user',
}

//canvasを作成
export const exportJpeg = (AveImageData: ImageData) => {
  const exportcanvas = document.createElement('canvas')
  exportcanvas.width = videoConstraints.width
  exportcanvas.height = videoConstraints.height
  const exportctx = exportcanvas.getContext('2d', {
    willReadFrequently: true,
  })
  //canvasに画像を描画し、URLを取得
  if (exportctx) {
    exportctx.putImageData(AveImageData, 0, 0)
    const exportURL = exportcanvas.toDataURL('image/jpeg')
    return exportURL
  }
}
