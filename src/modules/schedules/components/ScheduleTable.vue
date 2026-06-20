<template>
  <q-card flat bordered class="domain-card">
    <q-card-section class="table-toolbar">
      <div class="toolbar-left">
        <div class="toolbar-title">
          {{ financialType === 'expense' ? 'Agenda de despesas' : 'Agenda de receitas' }}
        </div>

        <div class="toolbar-subtitle">
          {{ financialType === 'expense'
            ? 'Visualize despesas futuras, recorrentes e parceladas'
            : 'Visualize receitas futuras, recorrentes e parceladas'
          }}
        </div>
      </div>

      <div class="toolbar-right">
        <q-input
          v-model="filter"
          outlined
          dense
          clearable
          class="search-input"
          label="Pesquisar lancamento"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </q-card-section>

    <q-separator />

    <q-table
      :rows="rows"
      :columns="columns"
      row-key="id"
      :filter="filter"
      flat
      class="domain-table"
      :pagination="{ rowsPerPage: 10 }"
    >
      <template #body-cell-description="props">
        <q-td :props="props">
          <div class="text-weight-medium">{{ props.row.description }}</div>
          <div class="text-caption text-grey-6">
            {{ props.row.categoryName }}
            <span v-if="props.row.subCategoryName">
              / {{ props.row.subCategoryName }}
            </span>
          </div>
        </q-td>
      </template>

      <template #body-cell-amount="props">
        <q-td :props="props">
          <div
            class="text-weight-bold"
            :class="financialType === 'expense' ? 'text-negative' : 'text-positive'"
          >
            {{ formatCurrency(props.row.amount) }}
          </div>
        </q-td>
      </template>

      <template #body-cell-startingOn="props">
        <q-td :props="props">
          <div class="text-weight-medium">
            {{ formatDate(props.row.startingOn) }}
          </div>
          <div class="text-caption text-grey-6">
            {{ recurrenceLabels[props.row.recurrence as RecurrenceType] }}
          </div>
        </q-td>
      </template>

      <template #body-cell-recurrence="props">
        <q-td :props="props">
          <q-badge rounded class="recurrence-badge">
            {{ formatRecurrence(props.row) }}
          </q-badge>
        </q-td>
      </template>

      <template #body-cell-active="props">
        <q-td :props="props">
          <q-badge
            rounded
            :class="props.value ? 'status-active' : 'status-inactive'"
          >
            <q-icon
              :name="props.value ? 'check_circle' : 'cancel'"
              size="14px"
              class="q-mr-xs"
            />
            {{ props.value ? 'Ativo' : 'Inativo' }}
          </q-badge>
        </q-td>
      </template>

      <template #body-cell-actions="props">
        <q-td :props="props" class="text-center">
          <q-btn flat round dense icon="visibility" color="grey-7" class="action-btn">
            <q-tooltip>Visualizar</q-tooltip>
          </q-btn>

          <q-btn
            flat
            round
            dense
            icon="edit"
            color="primary"
            class="action-btn"
            @click="emit('edit', props.row.id)"
          >
            <q-tooltip>Editar</q-tooltip>
          </q-btn>
        </q-td>
      </template>

      <template #bottom-row v-if="rows.length > 0">
        <q-tr class="total-row">
          <q-td class="text-weight-bold">Total previsto</q-td>
          <q-td class="text-weight-bold">
            {{ formatCurrency(totalAmount) }}
          </q-td>
          <q-td colspan="4" />
        </q-tr>
      </template>

      <template #no-data>
        <div class="full-width row flex-center q-gutter-sm empty-state">
          <q-icon name="event_busy" size="40px" color="grey-5" />
          <div class="text-grey-7">
            Nenhum lancamento futuro encontrado.
          </div>
        </div>
      </template>
    </q-table>
  </q-card>
</template>

<script setup lang="ts">
import type { QTableColumn } from 'quasar'
import { FinancialType } from '@/shared/domain/types/FinancialType'
import { ScheduleItem } from '../models/schedule.model'
import { RecurrenceType, RecurrenceTypeLabel } from '../types/RecurrenceType'

defineProps<{
  columns: QTableColumn[]
  financialType: FinancialType
  rows: ScheduleItem[]
  totalAmount: number
}>()

const emit = defineEmits<{
  (event: 'edit', id: string): void
}>()

const filter = defineModel<string>('filter', { required: true })
const recurrenceLabels = RecurrenceTypeLabel

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function formatDate(value: string | Date) {
  const date = typeof value === 'string' ? value : value.toISOString().slice(0, 10)
  return new Date(`${date}T00:00:00`).toLocaleDateString('pt-BR')
}

function formatRecurrence(row: ScheduleItem) {
  if (row.recurrence === 'monthly') return 'Mensal'
  if (row.recurrence === 'installment') return 'Parcelado'

  return 'Unico'
}
</script>

<style lang="scss" scoped>
@import "src/css/list-page.scss";

.recurrence-badge {
  background: #e8f0ff;
  color: #1d4ed8;
  padding: 6px 10px;
  font-weight: 700;
}
</style>
