<script setup lang="ts">
import OptionsList from '@/components/OptionsCalculator/OptionsList.vue'
import OptionsGraph from '@/components/OptionsCalculator/OptionsGraph.vue'

import { ref } from 'vue'

const sampleData: OptionData = [
  {
    strike_price: 100,
    type: 'Call',
    bid: 10.05,
    ask: 12.04,
    long_short: 'long',
    checked: true
  },
  {
    strike_price: 102.5,
    type: 'Call',
    bid: 12.1,
    ask: 14,
    long_short: 'long',
    checked: true
  },
  {
    strike_price: 103,
    type: 'Put',
    bid: 14,
    ask: 15.5,
    long_short: 'short',
    checked: true
  },
  {
    strike_price: 105,
    type: 'Put',
    bid: 16,
    ask: 18,
    long_short: 'long',
    checked: true
  }
]

const optionsData = ref<OptionData>(sampleData)

const toggleChecked = (index: number) => {
  if (optionsData.value[index]) {
    optionsData.value[index].checked = !optionsData.value[index].checked
  }
}

const toggleCallPut = (index: number) => {
  if (optionsData.value[index]) {
    if (optionsData.value[index].type === 'Call') {
      optionsData.value[index].type = 'Put'
    } else {
      optionsData.value[index].type = 'Call'
    }
  }
}

const toggleLongShort = (index: number) => {
  if (optionsData.value[index]) {
    if (optionsData.value[index].long_short === 'long') {
      optionsData.value[index].long_short = 'short'
    } else {
      optionsData.value[index].long_short = 'long'
    }
  }
}

const updateStrikePrice = (newValue: number, index: number) => {
  optionsData.value[index].strike_price = newValue
}
const updateBid = (newValue: number, index: number) => {
  optionsData.value[index].bid = newValue
}
const updateAsk = (newValue: number, index: number) => {
  optionsData.value[index].ask = newValue
}
</script>

<template>
  <div>
    <h1>Options Profit Calculator</h1>
    <div class="container">
      <div class="calculator" v-if="optionsData.length > 0">
        <OptionsList
          :options-data="optionsData"
          @option-clicked="toggleChecked"
          @swap-call-put="toggleCallPut"
          @swap-long-short="toggleLongShort"
          @update-strike-price="updateStrikePrice"
          @update-bid="updateBid"
          @update-ask="updateAsk"
        />
        <OptionsGraph :checked-options-data="optionsData" />
      </div>
      <div class="warning" v-else>Invalid data!</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.calculator {
  max-width: 960px;
  margin: auto;
  box-shadow:
    0 0 5px rgba(0, 0, 0, 0.1),
    0 0 20px rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
  padding-bottom: 1rem;
  /* padding-top: 1rem; */
}
.warning {
  max-width: 960px;
  margin: auto;
}
.info {
  text-align: left;
}
</style>
