<template>
  <q-field
    outlined
    stack-label
    class="money-input"
    v-model="internalValue"
    :label="label"
    :rules="rules"
    :disable="disable"
  >
    <template v-slot:control>
      <money3
        v-model="internalValue"
        v-bind="moneyConfig"
        class="q-field__input text-right"
        @focus="$event.target.select()"
      />
    </template>
  </q-field>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Money3Component as money3 } from 'v-money3';

interface Props {
  modelValue: number;
  label?: string;
  rules?: any[];
  disable?: boolean
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue']);

// Configuração única para todo o projeto
const moneyConfig = {
  decimal: ',',
  thousands: '.',
  precision: 2,
  masked: false
}

// Sincroniza o valor interno com o v-model do pai
const internalValue = computed({
  get: () => props.modelValue,
  set: (val) => {
    let numericValue: number | null = val;

    if (typeof val === 'string' && val !== '') {
      numericValue = parseFloat(val);
    }

    if (isNaN(numericValue as number)) numericValue = null

    emit('update:modelValue', numericValue)
  }
})

</script>

<style scoped>
  .q-field__input {
    border: none;
    outline: none;
    background: transparent;
    width: 100%;
    color: inherit;
    padding: 0;
  }
</style>
