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
