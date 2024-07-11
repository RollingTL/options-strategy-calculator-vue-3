<script setup lang="ts">
import ProfitScale from '@/components/OptionsCalculator/ProfitScale.vue'
import PriceScale from '@/components/OptionsCalculator/PriceScale.vue'
import ProfitLine from '@/components/OptionsCalculator/ProfitLine.vue'

import { ref, computed } from 'vue'

const props = defineProps<{
  checkedOptionsData: OptionData
  containerWidth: number
  containerHeight: number
  priceStep: number
  profitStep: number
  profitCurrentScale: number
  priceCurrentScale: number
}>()

const paddingX = ref(60)
const paddingY = ref(90)

const width = computed(() => props.containerWidth - 2 * paddingX.value)
const height = computed(() => props.containerHeight - 2 * paddingY.value)

const priceAverageValue = computed(() => {
  const checkedOptions = props.checkedOptionsData.filter((option) => option.checked === true)
  const totalStrikePrice = checkedOptions.reduce((sum, option) => sum + option.strike_price, 0)
  return totalStrikePrice / checkedOptions.length
})

const priceScaleData = computed(() => {
  const dollarsPerScaleLine = props.priceStep / props.priceCurrentScale
  const lines: PriceScaleData = []
  const centerX = width.value / 2
  const centerPrice = priceAverageValue.value

  let closestPrice = Math.floor(centerPrice / dollarsPerScaleLine) * dollarsPerScaleLine
  let closestX = centerX - (centerPrice - closestPrice) * props.priceCurrentScale

  lines.push({
    price: closestPrice,
    x: closestX,
    index: 2
  })

  let currentX = closestX + props.priceStep
  let currentPrice = closestPrice + (currentX - closestX) / props.priceCurrentScale
  let index = 1
  while (currentX < width.value + props.priceStep) {
    lines.push({
      price: currentPrice,
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
        price: currentPrice,
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
</script>

<template>
  <div>
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
        :price-current-scale="priceCurrentScale"
        :price-scale-data="priceScaleData"
      />
      <ProfitLine
        :width="width"
        :height="height"
        :padding-x="paddingX"
        :padding-y="paddingY"
        :profit-current-scale="profitCurrentScale"
        :price-current-scale="priceCurrentScale"
        :price-scale-data="priceScaleData"
        :checked-options-data="checkedOptionsData"
      />
    </svg>
  </div>
</template>

<style scoped>
.svg-rect {
  stroke: hsla(210, 29%, 74%, 1);
  stroke-width: 1;
  fill: white;
}
</style>
