//共通入浴券げ変わるたびに変更しなければいけない
const TrueRgba1: number[] = [55, 72, 88, 255]
const TrueRgba2: number[] = [189, 182, 174, 255]
const TrueRgba3: number[] = [21, 35, 46, 255]
const TrueRgba4: number[] = [210, 205, 199, 255]
const TrueRgba5: number[] = [193, 189, 180, 255]
const TrueRgba6: number[] = [21, 27, 15, 255]
const TrueArrayRgba = [
  TrueRgba1,
  TrueRgba2,
  TrueRgba3,
  TrueRgba4,
  TrueRgba5,
  TrueRgba6,
]

export const CulcRGBA = (ArrayRgba: Uint8ClampedArray[]) => {
  console.log(ArrayRgba)
  const IsNumRgba: number[] = []
  for (const i of ArrayRgba) {
    IsNumRgba.push(i[0]),
      IsNumRgba.push(i[1]),
      IsNumRgba.push(i[2]),
      IsNumRgba.push(i[3])
  }
  console.log(IsNumRgba)
  const TrueAllRgba = TrueArrayRgba.flatMap((num) => num)
  console.log(TrueAllRgba)
  for (let i = 0; i < IsNumRgba.length; i++) {
    if (Math.abs(TrueAllRgba[i] - IsNumRgba[i]) > 20) {
      console.log(i)
      console.log(Math.abs(TrueAllRgba[i] - IsNumRgba[i]))
      return false
    }
  }
  return true
}
