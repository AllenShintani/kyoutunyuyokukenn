export const recognizeImage = async (url: string, worker: any) => {
  console.log(worker)
  if (!worker) return console.log('workerがnull')
  const { data } = await worker.recognize(url)
  console.log(data.text)
}
