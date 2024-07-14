<script setup lang="ts">
import { useOptionsData } from '@/components/OptionsCalculator/useOptionsData'
import OptionsList from '@/components/OptionsCalculator/OptionsList.vue'
import OptionsGraph from '@/components/OptionsCalculator/OptionsGraph.vue'

const {
  optionsData,
  toggleChecked,
  toggleCallPut,
  toggleLongShort,
  updateStrikePrice,
  updateBid,
  updateAsk
} = useOptionsData()
</script>

<template>
  <div>
    <h1>Options Profit Calculator</h1>
    <div class="container">
      <div class="calculator">
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
</style>
