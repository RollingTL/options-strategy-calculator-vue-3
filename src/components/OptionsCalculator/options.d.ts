type OptionData = {
  strike_price: number
  type: 'Call' | 'Put'
  bid: number
  ask: number
  long_short: 'long' | 'short'
  checked: boolean
}[]
type ProfitScaleData = {
  profit: number
  height: number
}[]
type PriceScaleData = {
  price: number
  x: number
  index: number
}[]
type Points = {
  price: number
  x: number
  type: 'start' | 'break' | 'end'
  profit: number
  y: number
}[]
type MetaPoints = {
  price: number
  profit: number
  type: 'zero' | 'strike' | 'break-point' | 'million'
}[]

// type Point = {
//   x: number
//   y: number
// }
