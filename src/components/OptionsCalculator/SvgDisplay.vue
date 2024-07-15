<script setup lang="ts">
import ProfitScale from '@/components/OptionsCalculator/ProfitScale.vue'
import PriceScale from '@/components/OptionsCalculator/PriceScale.vue'
import InfoLines from '@/components/OptionsCalculator/InfoLines.vue'
import GraphLine from '@/components/OptionsCalculator/GraphLine.vue'

import { computed } from 'vue'

const props = defineProps<{
  optionsData: OptionData
  containerWidth: number
  containerHeight: number
  priceStep: number
  profitStep: number
  profitCurrentScale: number
  priceCurrentScale: number
}>()

const paddingX = 60
const paddingY = 30

const width = computed(() => props.containerWidth - 2 * paddingX)
const height = computed(() => props.containerHeight - 2 * paddingY)

const metaPoints = computed(() => {
  const metaPoints: MetaPoints = []
  metaPoints.push({
    price: 0,
    profit: calculateProfit(0, props.optionsData),
    type: 'zero'
  })
  for (let i = 0; i < props.optionsData.length; i++) {
    if (props.optionsData[i].checked) {
      const price = props.optionsData[i].strike_price
      metaPoints.push({
        price: price,
        profit: calculateProfit(price, props.optionsData),
        type: 'strike'
      })
    }
  }
  metaPoints.push({
    price: 100000,
    profit: calculateProfit(100000, props.optionsData),
    type: 'million'
  })
  metaPoints.sort((a, b) => a.price - b.price)
  //////////////////
  const newPoints: MetaPoints = []

  for (let i = 0; i < metaPoints.length - 1; i++) {
    const currentPoint = metaPoints[i]
    const nextPoint = metaPoints[i + 1]

    if (
      (currentPoint.profit > 0 && nextPoint.profit < 0) ||
      (currentPoint.profit < 0 && nextPoint.profit > 0)
    ) {
      // Calculate the crossing point
      const priceDifference = nextPoint.price - currentPoint.price
      const profitDifference = nextPoint.profit - currentPoint.profit
      const zeroCrossingPrice =
        currentPoint.price - currentPoint.profit * (priceDifference / profitDifference)

      newPoints.push({
        price: zeroCrossingPrice,
        profit: 0,
        type: 'break-point'
      })
    }
  }
  ///////////////////

  metaPoints.push(...newPoints)
  metaPoints.sort((a, b) => a.price - b.price)

  return metaPoints
})

const maxProfitLossData = computed(() => {
  const points = metaPoints.value
  if (points.length === 0) {
    return { maxProfit: 0, maxLoss: 0 }
  }
  const profits = points.filter((point) => point.profit >= 0).map((point) => point.profit)
  const losses = points.filter((point) => point.profit < 0).map((point) => point.profit)

  let maxProfit = Math.max(...profits)
  if (maxProfit > 10000) maxProfit = Infinity

  let maxLoss = Math.min(...losses)
  if (maxLoss < -10000) maxLoss = Infinity

  return { maxProfit: parseFloat(maxProfit.toFixed(3)), maxLoss: parseFloat(maxLoss.toFixed(3)) }
})

const breakPointsData = computed(() => {
  const points = metaPoints.value
  const breakPoints = points
    .filter((point) => point.type === 'break-point')
    .map((point) => point.price.toFixed(2))
  return breakPoints.join(', ')
})

const priceCenter = computed(() => {
  const breakPoints = metaPoints.value.filter((option) => option.type === 'break-point')
  if (breakPoints.length > 0) {
    return breakPoints[breakPoints.length - 1].price
  }
  const strikePoints = metaPoints.value.filter((option) => option.type === 'strike')

  const strikePrices = strikePoints.map((option) => option.price)
  const minStrikePrice = Math.min(...strikePrices)
  const maxStrikePrice = Math.max(...strikePrices)
  return (minStrikePrice + maxStrikePrice) / 2
})

const offsetX = computed(() => {
  const centerX = priceCenter.value * props.priceCurrentScale
  const offsetX = centerX - width.value / 2
  return offsetX
})

const priceScaleData = computed(() => {
  const dollarsPerScaleLine = props.priceStep / props.priceCurrentScale
  const lines: PriceScaleData = []
  const centerX = width.value / 2
  const centerPrice = priceCenter.value

  let closestPrice = Math.floor(centerPrice / dollarsPerScaleLine) * dollarsPerScaleLine
  let closestX = centerX - (centerPrice - closestPrice) * props.priceCurrentScale

  lines.push({
    price: parseFloat(closestPrice.toFixed(2)),
    x: closestX,
    index: 2
  })

  let currentX = closestX + props.priceStep
  let currentPrice = closestPrice + (currentX - closestX) / props.priceCurrentScale
  let index = 1
  while (currentX < width.value + props.priceStep) {
    lines.push({
      price: parseFloat(currentPrice.toFixed(2)),
      x: currentX,
      index: index
    })
    currentX = currentX + props.priceStep
    currentPrice = closestPrice + (currentX - closestX) / props.priceCurrentScale
    index++
  }

  currentX = closestX - props.priceStep
  currentPrice = closestPrice - (closestX - currentX) / props.priceCurrentScale
  index = 1
  while (currentX > 0 - props.priceStep) {
    if (currentPrice >= 0) {
      lines.push({
        price: parseFloat(currentPrice.toFixed(2)),
        x: currentX,
        index: index
      })
    }
    currentX = currentX - props.priceStep
    currentPrice = closestPrice - (closestX - currentX) / props.priceCurrentScale
    index++
  }

  return lines.sort((a, b) => a.price - b.price)
})

const profitScaleData = computed(() => {
  const lines: ProfitScaleData = []
  lines.push({
    profit: 0,
    height: height.value / 2
  })

  let currentY = height.value / 2 - props.profitStep
  while (currentY > 0) {
    lines.push({
      profit: (height.value / 2 - currentY) / props.profitCurrentScale,
      height: currentY
    })
    currentY = currentY - props.profitStep
  }

  currentY = height.value / 2 + props.profitStep
  while (currentY < height.value) {
    lines.push({
      profit: (height.value / 2 - currentY) / props.profitCurrentScale,
      height: currentY
    })
    currentY = currentY + props.profitStep
  }

  return lines
})

function calculateProfit(price: number, optionsData: OptionData) {
  let profit = 0
  for (const option of optionsData) {
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
</script>

<template>
  <div>
    <div class="results-info">
      <div class="column">
        <div class="text-label">Max Profit:</div>
        <div class="profit-value">{{ maxProfitLossData.maxProfit }}</div>
      </div>
      <div class="column">
        <div class="text-label">Max Loss:</div>
        <div class="loss-value">{{ maxProfitLossData.maxLoss }}</div>
      </div>
      <div class="column">
        <div class="text-label">Break Even Points:</div>
        <div class="points-value">{{ breakPointsData }}</div>
      </div>
    </div>
    <svg
      :width="containerWidth"
      :height="containerHeight"
      :viewBox="`0 0 ${containerWidth} ${containerHeight}`"
      class="svg-container"
    >
      <rect :x="paddingX" :y="paddingY" :width="width" :height="height" class="svg-rect" />
      <ProfitScale
        :width="width"
        :height="height"
        :padding-x="paddingX"
        :padding-y="paddingY"
        :profit-scale-data="profitScaleData"
      />
      <PriceScale
        :width="width"
        :height="height"
        :padding-x="paddingX"
        :padding-y="paddingY"
        :price-scale-data="priceScaleData"
      />
      <InfoLines
        :width="width"
        :height="height"
        :padding-x="paddingX"
        :padding-y="paddingY"
        :meta-points="metaPoints"
        :price-current-scale="priceCurrentScale"
        :offset-x="offsetX"
      />
      <GraphLine
        :width="width"
        :height="height"
        :padding-x="paddingX"
        :padding-y="paddingY"
        :meta-points="metaPoints"
        :profit-current-scale="profitCurrentScale"
        :price-current-scale="priceCurrentScale"
        :offset-x="offsetX"
      />
    </svg>
  </div>
</template>

<style scoped lang="scss">
.svg-rect {
  stroke: var(--primary-gray-lighter);
  stroke-width: 0.7;
  fill: white;
}
.results-info {
  text-align: left;
  padding: 1rem 2rem;
  display: flex;
  gap: 2rem;
  .column {
    .text-label {
      font-size: 12px;
      color: var(--primary-text-lighter);
      padding-bottom: 7px;
      @media screen and (max-width: 640px) {
        font-size: 10px;
      }
    }
    .profit-value {
      font-size: 18px;
      color: var(--green-text);
      @media screen and (max-width: 640px) {
        font-size: 16px;
      }
    }
    .loss-value {
      font-size: 18px;
      color: var(--red-text);
      @media screen and (max-width: 640px) {
        font-size: 16px;
      }
    }
    .points-value {
      font-size: 18px;
      color: var(--primary-text-lighter);
      @media screen and (max-width: 640px) {
        font-size: 16px;
      }
    }
  }
  @media screen and (max-width: 640px) {
    padding: 0.6em 1rem;
  }
}
</style>
