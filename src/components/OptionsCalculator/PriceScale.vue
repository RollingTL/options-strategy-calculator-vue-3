<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  width: number
  height: number
  paddingX: number
  paddingY: number
  priceScaleData: PriceScaleData
}>()

const numberPadding = ref(8)

const innerPriceScaleData = computed(() => {
  if (props.priceScaleData[0].price === 0)
    return props.priceScaleData.slice(0, props.priceScaleData.length - 1)
  else return props.priceScaleData.slice(1, props.priceScaleData.length - 1)
})
</script>

<template>
  <g>
    <line
      v-for="line in innerPriceScaleData"
      :key="line.price"
      :x1="line.x + paddingX"
      :y1="paddingY"
      :x2="line.x + paddingX"
      :y2="height + paddingY"
      class="svg-price-line"
    />
    <g v-for="(line, index) in innerPriceScaleData" :key="`text-${line.price}`">
      <g v-if="index % 3 == 0">
        <text
          :x="line.x + paddingX"
          :y="paddingY - numberPadding"
          class="svg-text"
          text-anchor="middle"
        >
          {{ line.price }}
        </text>

        <text
          :x="line.x + paddingX"
          :y="paddingY + height + 12 + numberPadding"
          class="svg-text"
          text-anchor="middle"
        >
          {{ line.price }}
        </text>
      </g>
    </g>
  </g>
</template>

<style scoped>
.svg-price-line {
  stroke: var(--primary-gray-lighter);
  stroke-width: 0.5;
}
.svg-text {
  font-size: 12px;
  fill: var(--primary-text-lighter);
}
</style>
