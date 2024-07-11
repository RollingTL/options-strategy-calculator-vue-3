<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  width: number
  height: number
  paddingX: number
  paddingY: number
  profitCurrentScale: number
  priceCurrentScale: number
  priceScaleData: PriceScaleData
  checkedOptionsData: OptionData
}>()

// const numberPadding = 8

const points = computed(() => {
  const thePoints = []
  const centerY = props.height / 2
  const startPrice = props.priceScaleData[0].price
  const startX = props.priceScaleData[0].x

  // Calculate start and end points
  let profit = calculateProfit(startPrice)
  thePoints.push({
    price: startPrice,
    x: startX,
    type: 'start',
    profit: profit,
    y: centerY - profit * props.profitCurrentScale
  })

  const endPrice = props.priceScaleData[props.priceScaleData.length - 1].price
  const endX = props.priceScaleData[props.priceScaleData.length - 1].x
  profit = calculateProfit(endPrice)
  thePoints.push({
    price: endPrice,
    x: endX,
    type: 'end',
    profit: profit,
    y: centerY - profit * props.profitCurrentScale
  })

  // Calculate break even points
  for (let i = 0; i < props.checkedOptionsData.length; i++) {
    if (props.checkedOptionsData[i].checked) {
      const price = props.checkedOptionsData[i].strike_price
      const currentX = startX + (price - startPrice) * props.priceCurrentScale
      profit = calculateProfit(price)
      thePoints.push({
        price: price,
        x: currentX,
        type: 'break',
        profit: profit,
        y: centerY - profit * props.profitCurrentScale
      })
    }
  }

  // Sort points by x-coordinate
  thePoints.sort((a, b) => a.x - b.x)

  return thePoints
})

const pointsFiltered = computed(() => points.value.filter((item) => item.type === 'break'))

const pathDataTop = computed(() => {
  const thePoints = points.value
  if (thePoints.length === 0) return ''
  let pathData = `M ${thePoints[0].x} ${thePoints[0].y}`
  for (let i = 1; i < thePoints.length; i++) pathData += ` L ${thePoints[i].x} ${thePoints[i].y}`
  pathData += ` L ${thePoints[thePoints.length - 1].x} ${props.height / 2 + 10} L ${thePoints[0].x} ${props.height / 2 + 10}`

  return pathData
})

const pathDataBottom = computed(() => {
  const thePoints = points.value
  if (thePoints.length === 0) return ''
  let pathData = `M ${thePoints[0].x} ${thePoints[0].y}`
  for (let i = 1; i < thePoints.length; i++) pathData += ` L ${thePoints[i].x} ${thePoints[i].y}`
  pathData += ` L ${thePoints[thePoints.length - 1].x} ${props.height / 2 - 10} L ${thePoints[0].x} ${props.height / 2 - 10}`

  return pathData
})

const calculateProfit = (price) => {
  let profit = 0
  for (const option of props.checkedOptionsData) {
    if (option.checked) {
      if (option.type === 'Call') {
        if (option.long_short === 'long') {
          if (price <= option.strike_price) profit += 0
          else profit += price - option.strike_price
          profit -= option.ask
        } else if (option.long_short === 'short') {
          if (price <= option.strike_price) profit += 0
          else profit -= price - option.strike_price
          profit += option.bid
        }
      } else if (option.type === 'Put') {
        if (option.long_short === 'long') {
          if (price >= option.strike_price) profit += 0
          else profit -= price - option.strike_price
          profit -= option.ask
        } else if (option.long_short === 'short') {
          if (price >= option.strike_price) profit += 0
          else profit += price - option.strike_price
          profit += option.bid
        }
      }
    }
  }
  return profit
}

const maxProfitLossData = computed(() => {
  const filteredItems = points.value.filter((item) => item.type !== 'start' && item.type !== 'end')
  const profits = filteredItems.map((item) => item.profit)
  const lowestProfit = Math.min(...profits)
  const highestProfit = Math.max(...profits)
  const zeroPriceProfit = Math.round(calculateProfit(0) * 100) / 100
  const hugePriceProfit = Math.round(calculateProfit(1000000) * 100) / 100
  let profitsArray = [lowestProfit, highestProfit, zeroPriceProfit, hugePriceProfit]

  // Filter positive and negative profits
  let positiveProfits = profitsArray.filter((profit) => profit > 0)
  let negativeProfits = profitsArray.filter((profit) => profit < 0)

  // Find maximum of positive profits
  let maxProfit = positiveProfits.length > 0 ? Math.max(...positiveProfits) : 0

  // Find minimum of negative profits (maximum loss)
  let maxLoss = negativeProfits.length > 0 ? Math.min(...negativeProfits) : 0
  if (maxProfit > 100000) maxProfit = 'Infinity'
  if (maxLoss < -100000) maxLoss = 'Infinity'
  else maxLoss = maxLoss * -1
  return { maxProfit: maxProfit, maxLoss: maxLoss }
})

const breakEvenPoints = computed(() => {
  const crossings = []
  const zeroLineY = props.height / 2
  const data = points.value

  for (let i = 0; i < data.length - 1; i++) {
    const p1 = data[i]
    const p2 = data[i + 1]

    if ((p1.y < zeroLineY && p2.y > zeroLineY) || (p1.y > zeroLineY && p2.y < zeroLineY)) {
      const t = (zeroLineY - p1.y) / (p2.y - p1.y)
      const price = p1.price + t * (p2.price - p1.price)
      crossings.push(price.toFixed(2))
    }
  }
  return crossings.join(', ')
})
</script>

<template>
  <g>
    <!-- Render strike points -->
    <line
      v-for="(line, index) in pointsFiltered"
      :key="`strike-${line.price}-${index}`"
      :x1="line.x + paddingX"
      :y1="paddingY"
      :x2="line.x + paddingX"
      :y2="paddingY + height"
      class="svg-strike-point"
    />

    <!-- Render profit path with gradients and filters -->
    <g>
      <defs>
        <!-- Filters for gradient -->
        <filter id="redFilter">
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.894
                    0 0 0 0 0.118
                    0 0 0 0 0.349
                    0 0 0 1 0"
          />
        </filter>
        <filter id="greenFilter">
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.090
                    0 0 0 0 0.737
                    0 0 0 0 0.624
                    0 0 0 1 0"
          />
        </filter>

        <!-- Masks for top and bottom gradients -->
        <mask id="maskTop">
          <rect :x="0" :y="0" :width="width" :height="height / 2" fill="white" />
        </mask>
        <mask id="maskBottom">
          <rect :x="0" :y="height / 2" :width="width" :height="height / 2" fill="white" />
        </mask>

        <!-- Linear gradients for top and bottom -->
        <linearGradient id="gradientTop" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="rgba(204, 204, 204, 30%)" />
          <stop offset="50%" stop-color="rgba(204, 204, 204, 0)" />
        </linearGradient>
        <linearGradient id="gradientBottom" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="50%" stop-color="rgba(204, 204, 204, 0)" />
          <stop offset="100%" stop-color="rgba(204, 204, 204, 30%)" />
        </linearGradient>
      </defs>

      <!-- Top path with gradient and filter -->
      <g mask="url(#maskTop)" :transform="`translate(${paddingX}, ${paddingY})`">
        <path
          :d="pathDataTop"
          class="svg-profit-line"
          stroke="red"
          stroke-width="2"
          fill="url(#gradientTop)"
          filter="url(#greenFilter)"
        />
      </g>

      <!-- Bottom path with gradient and filter -->
      <g mask="url(#maskBottom)" :transform="`translate(${paddingX}, ${paddingY})`">
        <path
          :d="pathDataBottom"
          class="svg-profit-line"
          stroke="red"
          stroke-width="2"
          fill="url(#gradientBottom)"
          filter="url(#redFilter)"
        />
      </g>
    </g>

    <!-- Display max profit, max loss, and break even points -->
    <g>
      <text :x="24" :y="18" class="svg-text">
        <tspan class="text-label">Max Profit:</tspan>
        <tspan x="24" dy="26px" class="profit-value">{{ maxProfitLossData.maxProfit }}</tspan>
      </text>
      <text :x="124" :y="18" class="svg-text">
        <tspan class="text-label">Max Loss:</tspan>
        <tspan x="124" dy="26px" class="loss-value">{{ maxProfitLossData.maxLoss }}</tspan>
      </text>
      <text :x="224" :y="18" class="svg-text">
        <tspan class="text-label">Break Even Points:</tspan>
        <tspan x="224" dy="26px" class="points-value">{{ breakEvenPoints }}</tspan>
      </text>
    </g>
  </g>
</template>

<style scoped>
.svg-strike-point {
  stroke: var(--primary-gray-darker);
  stroke-width: 1;
}
.svg-profit-line {
  background-color: hsla(344, 80%, 49%, 1);
  background-color: hsla(170, 80%, 46%, 1);
}
.text-label {
  font-size: 12px;
  fill: var(--primary-text-lighter);
  @media screen and (max-width: 640px) {
    font-size: 10px;
  }
}
.profit-value {
  font-size: 18px;
  fill: var(--green-text);
  @media screen and (max-width: 640px) {
    font-size: 14px;
  }
}
.loss-value {
  font-size: 18px;
  fill: var(--red-text);
  @media screen and (max-width: 640px) {
    font-size: 14px;
  }
}
.points-value {
  font-size: 18px;
  fill: var(--primary-text-lighter);
  @media screen and (max-width: 640px) {
    font-size: 14px;
  }
}
</style>
