<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  width: number
  height: number
  paddingX: number
  paddingY: number
  profitScaleData: ProfitScaleData
}>()

const numberPadding = ref(8)
</script>

<template>
  <g v-for="(line, index) in profitScaleData" :key="`line-${index}`">
    <!-- Profit lines and text above zero -->
    <line
      v-if="index % 2 == 0"
      :x1="paddingX"
      :y1="paddingY + line.height"
      :x2="paddingX + width"
      :y2="paddingY + line.height"
      class="svg-profit-line"
    />
    <line
      v-else
      :x1="paddingX"
      :y1="paddingY + line.height"
      :x2="paddingX + width"
      :y2="paddingY + line.height"
      class="svg-profit-line-2"
    />
    <g v-if="index % 2 == 0">
      <text
        :x="paddingX - numberPadding"
        :y="paddingY + line.height"
        class="svg-text"
        text-anchor="end"
        dominant-baseline="middle"
      >
        {{ line.profit }}
      </text>
      <text
        :x="paddingX + width + numberPadding"
        :y="paddingY + line.height"
        class="svg-text"
        text-anchor="start"
        dominant-baseline="middle"
      >
        {{ line.profit }}
      </text>
    </g>
  </g>
  <line
    :x1="paddingX"
    :y1="paddingY + height / 2"
    :x2="paddingX + width"
    :y2="paddingY + height / 2"
    class="svg-zero-profit-line"
  />
</template>

<style scoped>
.svg-zero-profit-line {
  stroke: var(--primary-gray);
  stroke-width: 1;
}
.svg-profit-line {
  stroke: var(--primary-gray-lighter);
  stroke-width: 0.5;
}
.svg-profit-line-2 {
  stroke: var(--primary-gray-lighter);
  stroke-width: 0.3;
}
.svg-text {
  font-size: 12px;
  fill: var(--primary-text-lighter-2);
}
</style>
