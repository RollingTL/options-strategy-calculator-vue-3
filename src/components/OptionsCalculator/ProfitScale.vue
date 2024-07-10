<template>
  <g>
    <!-- Profit lines and text above zero -->
    <line
      v-for="line in profitScaleData"
      :key="line.profit"
      :x1="paddingX"
      :y1="paddingY + line.height"
      :x2="paddingX + width"
      :y2="paddingY + line.height"
      class="svg-profit-line"
    />
    <text
      v-for="line in profitScaleData"
      :key="`text-above-left-${line.profit}`"
      :x="paddingX - numberPadding"
      :y="paddingY + line.height"
      class="svg-text"
      text-anchor="end"
      dominant-baseline="middle"
    >
      {{ line.profit }}
    </text>
    <text
      v-for="line in profitScaleData"
      :key="`text-above-right-${line.profit}`"
      :x="paddingX + width + numberPadding"
      :y="paddingY + line.height"
      class="svg-text"
      text-anchor="start"
      dominant-baseline="middle"
    >
      {{ line.profit }}
    </text>

    <line
      :x1="paddingX"
      :y1="paddingY + height / 2"
      :x2="paddingX + width"
      :y2="paddingY + height / 2"
      class="svg-zero-profit-line"
    />
  </g>
</template>

<script setup>
const { defineProps } = Vue

const props = defineProps({
  width: Number,
  height: Number,
  paddingX: Number,
  paddingY: Number,
  profitScaleData: Array
})

const numberPadding = 8
</script>

<style scoped>
.svg-zero-profit-line {
  stroke: var(--primary-gray-darker);
  stroke-width: 1;
}
.svg-profit-line {
  stroke: var(--primary-gray-lighter);
  stroke-width: 0.5;
}
.svg-text {
  font-size: 12px;
  fill: var(--primary-text-lighter);
}
</style>
