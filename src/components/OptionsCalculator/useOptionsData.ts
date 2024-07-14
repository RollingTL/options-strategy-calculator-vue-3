import { ref } from 'vue'

// Define your initial data
const defaultData: OptionData = [
  {
    strike_price: 420,
    type: 'Call',
    bid: 25.75,
    ask: 26.0,
    long_short: 'long',
    checked: true
  },
  {
    strike_price: 425,
    type: 'Call',
    bid: 23.5,
    ask: 23.75,
    long_short: 'long',
    checked: true
  },
  {
    strike_price: 420,
    type: 'Put',
    bid: 21.3,
    ask: 21.55,
    long_short: 'short',
    checked: true
  },
  {
    strike_price: 425,
    type: 'Put',
    bid: 23.4,
    ask: 23.7,
    long_short: 'long',
    checked: true
  }
]

export function useOptionsData() {
  // Initialize optionsData with initialData or from localStorage
  const optionsData = ref<OptionData>(defaultData)

  const savedData = localStorage.getItem('optionsData')
  if (savedData) {
    optionsData.value = JSON.parse(savedData)
  } else {
    optionsData.value = defaultData
  }
  const setOptionsData = (data: OptionData) => {
    optionsData.value = JSON.parse(JSON.stringify(data))
    localStorage.setItem('optionsData', JSON.stringify(optionsData.value))
  }
  const toggleChecked = (index: number) => {
    if (optionsData.value[index]) {
      optionsData.value[index].checked = !optionsData.value[index].checked
    }
    localStorage.setItem('optionsData', JSON.stringify(optionsData.value))
  }

  const toggleCallPut = (index: number) => {
    if (optionsData.value[index]) {
      if (optionsData.value[index].type === 'Call') {
        optionsData.value[index].type = 'Put'
      } else {
        optionsData.value[index].type = 'Call'
      }
    }
    localStorage.setItem('optionsData', JSON.stringify(optionsData.value))
  }

  const toggleLongShort = (index: number) => {
    if (optionsData.value[index]) {
      if (optionsData.value[index].long_short === 'long') {
        optionsData.value[index].long_short = 'short'
      } else {
        optionsData.value[index].long_short = 'long'
      }
    }
    localStorage.setItem('optionsData', JSON.stringify(optionsData.value))
  }

  const updateStrikePrice = (newValue: number, index: number) => {
    optionsData.value[index].strike_price = newValue
    localStorage.setItem('optionsData', JSON.stringify(optionsData.value))
  }
  const updateBid = (newValue: number, index: number) => {
    optionsData.value[index].bid = newValue
    localStorage.setItem('optionsData', JSON.stringify(optionsData.value))
  }
  const updateAsk = (newValue: number, index: number) => {
    optionsData.value[index].ask = newValue
    localStorage.setItem('optionsData', JSON.stringify(optionsData.value))
  }

  return {
    optionsData,
    setOptionsData,
    toggleChecked,
    toggleCallPut,
    toggleLongShort,
    updateStrikePrice,
    updateBid,
    updateAsk
  }
}
