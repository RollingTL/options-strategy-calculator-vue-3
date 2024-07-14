<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  width: number
  height: number
  paddingX: number
  paddingY: number
  priceCurrentScale: number
  offsetX: number
  metaPoints: MetaPoints
}>()
type MetaPoints = {
  price: number
  profit: number
  type: 'zero' | 'strike' | 'break-point' | 'million'
}[]
const breakPoints = computed(() => {
  const breakPoints = props.metaPoints.filter((item) => item.type === 'break-point')

  const result = breakPoints.map((item) => {
    // Do something with each item, for example:
    return item.price * props.priceCurrentScale - props.offsetX
  })

  return result.filter((item) => item > 0 && item < props.width)
})
const strikePoints = computed(() => {
  const breakPoints = props.metaPoints.filter((item) => item.type === 'strike')

  const result = breakPoints.map((item) => {
    // Do something with each item, for example:
    return item.price * props.priceCurrentScale - props.offsetX
  })

  return result.filter((item) => item > 0 && item < props.width)
})
const zeroPoint = computed(() => {
  const breakPoints = props.metaPoints.filter((item) => item.type === 'zero')

  const result = breakPoints.map((item) => {
    // Do something with each item, for example:
    return item.price * props.priceCurrentScale - props.offsetX
  })

  return result.filter((item) => item > 0 && item < props.width)
})
</script>

<template>
  <g :transform="`translate(${paddingX}, ${paddingY})`">
    {{ breakPoints }}
    <line
      v-for="(item, index) in breakPoints"
      :key="'break' + index"
      :x1="item"
      :y1="0"
      :x2="item"
      :y2="height"
      class="break-line"
    />
    <line
      v-for="(item, index) in strikePoints"
      :key="'strike' + index"
      :x1="item"
      :y1="0"
      :x2="item"
      :y2="height"
      class="strike-line"
    />
    <line
      v-for="(item, index) in zeroPoint"
      :key="'zero' + index"
      :x1="item"
      :y1="0"
      :x2="item"
      :y2="height"
      class="strike-line"
    />
  </g>
</template>
<style scoped>
.break-line {
  stroke: var(--primary-text-lighter-2);
  stroke-width: 1;
}
.strike-line {
  stroke: var(--primary-gray);
  stroke-width: 1;
}
</style>
