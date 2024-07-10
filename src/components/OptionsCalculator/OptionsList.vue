<script setup lang="ts">
// import { onUpdated } from 'vue'

import PriceInput from '@/components/OptionsCalculator/PriceInput.vue'
import BidAskInput from '@/components/OptionsCalculator/BidAskInput.vue'

const props = defineProps<{
  optionsData: OptionData[]
}>()

const emit = defineEmits([
  'update-strike-price',
  'update-bid',
  'update-ask',
  'option-clicked',
  'swap-call-put',
  'swap-long-short'
])

const emitUpdateStrikePrice = (newPrice: number, index: number) => {
  emit('update-strike-price', newPrice, index)
}
const emitUpdateBid = (newBid: number, index: number) => {
  emit('update-bid', newBid, index)
}
const emitUpdateAsk = (newAsk: number, index: number) => {
  emit('update-ask', newAsk, index)
}
</script>

<template>
  <div>
    <table>
      <tr
        v-for="(item, index) in props.optionsData"
        :key="'option' + index"
        :class="{ call: item.type === 'Call', off: !item.checked }"
      >
        <td class="type">
          <button
            class="button-round"
            :class="{ call: item.type === 'Call', put: item.type === 'Put' }"
            :disabled="!item.checked"
            @click="emit('swap-call-put', index)"
          >
            {{ item.type }}
          </button>
        </td>
        <td class="strike">
          <PriceInput
            :price="item.strike_price.toString()"
            :readonly="!item.checked"
            @update:price="(newPrice) => emitUpdateStrikePrice(newPrice, index)"
          />
        </td>
        <td class="long-short" :class="item.long_short">
          <button
            class="button-round"
            :class="{
              long: item.long_short === 'long',
              short: item.long_short === 'short'
            }"
            :disabled="!item.checked"
            @click="emit('swap-long-short', index)"
          >
            {{ item.long_short }}
          </button>
        </td>
        <td class="bid-ask">
          <BidAskInput
            :bid="item.bid.toString()"
            @update:bid="(newBid) => emitUpdateBid(newBid, index)"
            :ask="item.ask.toString()"
            @update:ask="(newAsk) => emitUpdateAsk(newAsk, index)"
            :readonly="!item.checked"
          />
        </td>

        <td class="right">
          <input
            type="checkbox"
            class="switch"
            :checked="item.checked"
            @change="$emit('option-clicked', index)"
          />
        </td>
      </tr>
    </table>
  </div>
</template>

<style lang="scss" scoped>
table {
  width: 100%;
  border-collapse: collapse;
  max-width: 960px;
}

tr {
  border-bottom: 1px solid var(--primary-gray-lighter-2);
}
tr:first-child {
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
}
tr:first-child td {
  padding-top: 1.1rem;
}
tr:first-child td:first-child {
  padding-top: 1.1rem;
  border-top-left-radius: 1rem;
}
tr:first-child td:last-child {
  padding-top: 1.1rem;
  border-top-right-radius: 1rem;
}
tr td {
  background-color: var(--red-light);
  color: var(--red-dark);
}
tr.call td {
  background-color: var(--green-light);
  color: var(--green-dark);
}

td {
  padding: 12px 4px;
  text-align: left;
  white-space: nowrap;
}
td.type {
  padding-left: 24px;
  width: 7%;
  /* font-weight: 500; */
}
td.strike,
td.bid-ask {
  width: 7%;
}
td.long-short {
  width: 14%;
}

td.right {
  width: 14%;
  text-align: right;
  padding-right: 24px;
}

tr.off td {
  color: var(--primary-text-disabled);
  background-color: var(--primary-background-disabled);
}

@media screen and (max-width: 640px) {
  table {
    font-size: 12px;
  }
  td.type {
    padding-left: 12px;
  }

  td.right {
    padding-right: 12px;
  }
}
.button-round {
  border-radius: 11px;
  font-size: 16px;
  line-height: 1.4;
  padding: 0 11px;
  text-transform: capitalize;
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
}
.button-round.call {
  color: var(--green-dark);
  border: 1px solid var(--green-medium);
  background-color: transparent;
}
.button-round.put {
  color: var(--red-dark);
  border: 1px solid var(--red-medium);
  background-color: transparent;
}
.button-round.long {
  color: var(--green-dark);
  border: 1px solid var(--green-medium);
  background-color: var(--green-light-accent);
}
.button-round.short {
  color: var(--red-dark);
  border: 1px solid var(--red-medium);
  background-color: var(--red-light-accent);
}
.button-round:hover {
  box-shadow: 0 0 0 3px var(--tab-hover-color);
  transform: scale(1.1);
}

.button-round:active {
  outline: none;
  transform: scale(0.95);
}

.button-round:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px var(--tab-hover-color);
}
.button-round:disabled {
  cursor: not-allowed;
  pointer-events: none;
  background-color: transparent;
  border-color: var(--primary-text-disabled);
  color: var(--primary-text-disabled);
}

input[type='checkbox'] {
  cursor: pointer;
}

input[type='checkbox'] {
  /* border-bottom: 1px solid hsla(210, 19%, 89%, 1); */

  box-sizing: border-box;
  width: 20px;
  height: 20px;
  margin: 0;
  padding: 0;
  border: 1px solid var(--primary-gray);
  border-radius: 5px;
  appearance: none;
  background-color: white;
  outline: none;
  transition: outline 0.1s;
}

input[type='checkbox']:checked {
  background-size: 12px; /* Adjust this size to control the size of the SVG */
  background-position: center;
  background-repeat: no-repeat;
}

input[type='checkbox']:not(:disabled):checked {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20" viewBox="0 0 32 32" xml:space="preserve"><path style="fill: %230F68C1" d="M11.941,28.877l-11.941-11.942l5.695-5.696l6.246,6.246l14.364-14.364L32,8.818"/></svg>');
}

@media (hover: hover) {
  input[type='checkbox']:not(:disabled):hover {
    outline: 3px solid var(--tab-hover-color);
    transform: scale(1.05);
  }
}

input[type='checkbox']:focus-visible {
  outline: 3px solid var(--tab-hover-color);
  transform: scale(1.05);
}

@media (prefers-reduced-motion: reduce) {
  input[type='checkbox'] {
    transition: none;
  }
}

@media screen and (max-width: 640px) {
  .button-round {
    font-size: 12px;
  }
  input[type='checkbox'] {
    width: 16px;
    height: 16px;
    border-radius: 3px;
  }
  input[type='checkbox']:checked {
    background-size: 9px; /* Adjust this size to control the size of the SVG */
  }
}
</style>
