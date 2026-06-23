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
          @update:model-value="loadCategoriesSelect"
        />

        <q-btn
          :color="financialType === 'expense' ? 'negative' : 'positive'"
          icon="add"
          :label="financialType === 'expense' ? 'Nova despesa futura' : 'Nova receita futura'"
          no-caps
          unelevated
          class="header-btn"
          @click="newFutureEntry"
        />
      </div>
    </div>

    <schedule-summary-cards
      :financial-type="financialType"
      :total-amount="totalAmount"
      :pending-count="pendingCount"
      :recurring-count="recurringCount"
      :installment-count="installmentCount"
    />

    <schedule-table
      v-model:filter="filter"
      :columns="columns"
      :financial-type="financialType"
      :rows="filteredTableRows"
      :total-amount="totalAmount"
      @edit="editRow"
    />

    <schedule-form-dialog
      v-model="formDialog"
      v-model:schedule="model"
      v-model:transaction-source-options="transactionSourceOptions"
      v-model:person-options="personOptions"
      v-model:tag-options="tagOptions"
      :category-options="filteredCategoryOptions"
      :bank-account-options-original="bankAccountOptionsOriginal"
      :credit-card-options-original="creditCardOptionsOriginal"
      :financial-type="financialType"
      :filter-category-options="filterCategoryOptions"
      :person-options-original="personOptionsOriginal"
      :recurrence-options="recurrenceOptions"
      :saving="saving"
      :tag-options-original="tagOptionsOriginal"
      :title="formTitle"
      @delete="onDelete"
      @load-tags="loadTags"
      @save="saveSchedule"
    />

    <confirm-delete-dialog
      v-model="deleteDialog"
      :loading="deleting"
      title="Excluir agendamento"
      message="Tem certeza que deseja excluir este agendamento?"
      description="Todas as informacoes vinculadas a este registro poderao ser afetadas."
      confirm-label="Excluir"
      @confirm="confirmDelete"
    />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import ConfirmDeleteDialog from '@/shared/components/ConfirmDeleteDialog/ConfirmDeleteDialog.vue'
import ScheduleFormDialog from '../components/ScheduleFormDialog.vue'
import ScheduleSummaryCards from '../components/ScheduleSummaryCards.vue'
import ScheduleTable from '../components/ScheduleTable.vue'
import { useScheduleManager } from '../composables/useScheduleManager'

const {
  columns,
  deleteDialog,
  deleting,
  filter,
  filteredCategoryOptions,
  bankAccountOptionsOriginal,
  creditCardOptionsOriginal,
  filteredTableRows,
  financialType,
  formDialog,
  formTitle,
  installmentCount,
  loadCategoriesSelect,
  loadInitialData,
  loadTags,
  model,
  onDelete,
  pendingCount,
  personOptions,
  personOptionsOriginal,
  recurrenceOptions,
  recurringCount,
  saveSchedule,
  editRow,
  confirmDelete,
  newFutureEntry,
  saving,
  tagOptions,
  tagOptionsOriginal,
  totalAmount,
  transactionSourceOptions,
  filterCategoryOptions,
} = useScheduleManager()

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
