<template>
  <q-page class="domain-page q-pa-md">
    <div class="page-header q-mb-md">
      <div class="row q-gutter-sm items-center">
        <q-btn-toggle
          v-model="financialType"
          unelevated
          no-caps
          class="planning-toggle"
          :class="financialType === 'expense' ? 'planning-toggle-expense' : 'planning-toggle-income'"
          :toggle-color="financialType === 'expense' ? 'negative' : 'positive'"
          :options="[
            { label: 'Despesas', value: 'expense', icon: 'trending_down' },
            { label: 'Receitas', value: 'income', icon: 'trending_up' },
          ]"
        />

        <q-btn
          :color="financialType === 'expense' ? 'negative' : 'positive'"
          icon="add"
          :label="financialType === 'expense' ? 'Nova despesa' : 'Nova receita'"
          no-caps
          unelevated
          class="header-btn"
        />
      </div>
    </div>

    <transaction-table
      v-model:filter="filter"
      :columns="columns"
      :financial-type="financialType"
      :rows="filteredTableRows"
      @edit="editRow"
    />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import TransactionTable from '../components/TransactionTable.vue'
import { useTransactionManager } from '../composables/useTransactionManager.js'

const {
  columns,
  filter,
  filteredTableRows,
  financialType,
  loadInitialData,
  editRow,
} = useTransactionManager()

onMounted(() => {
  loadInitialData()
})
</script>

<style lang="scss" scoped>
@import "src/css/list-page.scss";
@import "src/css/dialog.scss";

.planning-toggle {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e9eef5;
  background: #ffffff;
}

.planning-toggle-expense {
  box-shadow: 0 4px 14px rgba(180, 35, 24, 0.08);
}

.planning-toggle-income {
  box-shadow: 0 4px 14px rgba(24, 121, 78, 0.08);
}
</style>
