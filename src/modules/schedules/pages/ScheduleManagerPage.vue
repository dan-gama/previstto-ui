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
          :label="financialType === 'expense' ? 'Nova despesa futura' : 'Nova receita futura'"
          no-caps
          unelevated
          class="header-btn"
          @click="newFutureEntry"
        />
      </div>
    </div>

    <!-- Cards resumo -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-sm-6 col-lg-3">
        <q-card flat bordered class="summary-card">
          <q-card-section class="row items-center no-wrap">
            <div
              class="summary-icon"
              :class="financialType === 'expense' ? 'bg-red-1 text-negative' : 'bg-green-1 text-positive'"
            >
              <q-icon
                :name="financialType === 'expense' ? 'trending_down' : 'trending_up'"
                size="24px"
              />
            </div>

            <div class="q-ml-md">
              <div class="summary-label">
                {{ financialType === 'expense' ? 'Despesas previstas' : 'Receitas previstas' }}
              </div>
              <div class="summary-value">
                {{ formatCurrency(totalAmount) }}
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-lg-3">
        <q-card flat bordered class="summary-card">
          <q-card-section class="row items-center no-wrap">
            <div class="summary-icon bg-orange-1 text-orange">
              <q-icon name="schedule" size="24px" />
            </div>

            <div class="q-ml-md">
              <div class="summary-label">Pendentes no mês</div>
              <div class="summary-value">{{ pendingCount }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-lg-3">
        <q-card flat bordered class="summary-card">
          <q-card-section class="row items-center no-wrap">
            <div class="summary-icon bg-blue-1 text-primary">
              <q-icon name="autorenew" size="24px" />
            </div>

            <div class="q-ml-md">
              <div class="summary-label">Recorrentes</div>
              <div class="summary-value">{{ recurringCount }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-lg-3">
        <q-card flat bordered class="summary-card">
          <q-card-section class="row items-center no-wrap">
            <div class="summary-icon bg-purple-1 text-purple">
              <q-icon name="payments" size="24px" />
            </div>

            <div class="q-ml-md">
              <div class="summary-label">Parcelados</div>
              <div class="summary-value">{{ installmentCount }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

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
            label="Pesquisar lançamento"
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </q-card-section>

      <q-separator />

      <q-table
        :rows="filteredRows"
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
              <span v-if="props.row.subcategoryName">
                / {{ props.row.subcategoryName }}
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

        <template #body-cell-dueDate="props">
          <q-td :props="props">
            <div class="text-weight-medium">
              {{ formatDate(props.row.dueDate) }}
            </div>
            <div class="text-caption text-grey-6">
              {{ getDueText(props.row) }}
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

        <template #body-cell-status="props">
          <q-td :props="props">
            <q-badge
              rounded
              :class="props.row.status === 'pending' ? 'status-pending' : 'status-active'"
            >
              <q-icon
                :name="props.row.status === 'pending' ? 'schedule' : 'check_circle'"
                size="14px"
                class="q-mr-xs"
              />
              {{ props.row.status === 'pending' ? 'Pendente' : 'Confirmado' }}
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
              @click="editRow(props.row)"
            >
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <template #bottom-row v-if="filteredRows.length > 0">
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
              Nenhum lançamento futuro encontrado.
            </div>
          </div>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="formDialog">
      <q-card class="form-dialog-card">
        <q-card-section
          class="dialog-header"
          :class="financialType === 'expense' ? 'dialog-header-expense' : 'dialog-header-income'"
        >
          <div class="row items-center justify-between no-wrap">
            <div class="row items-center no-wrap">
              <div class="dialog-icon">
                <q-icon
                  :name="financialType === 'expense' ? 'trending_down' : 'trending_up'"
                  size="24px"
                />
              </div>

              <div class="q-ml-md">
                <div class="dialog-title">
                  {{ formTitle }}
                </div>

                <div class="dialog-subtitle">
                  Cadastre receitas e despesas futuras, recorrentes ou parceladas
                </div>
              </div>
            </div>

            <q-btn flat round dense icon="close" class="dialog-close-btn" v-close-popup />
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="dialog-body">
          <q-form class="row q-col-gutter-md" @submit.prevent="onSubmit" ref="form" greedy>
            <div class="col-12 col-md-8">
              <q-input
                v-model="model.description"
                outlined
                label="Descrição"
                class="app-field"
                :rules="[required()]"
              />
            </div>

            <div class="col-12 col-md-4">
              <money-input
                v-model="model.amount"
                label="Valor (R$)"
                class="app-field"
                :rules="[required()]"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-select
                v-model="model.categoryId"
                outlined
                emit-value
                map-options
                label="Categoria"
                class="app-field"
                :options="categoryOptions"
                :rules="[required()]"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-select
                v-model="model.personId"
                outlined
                emit-value
                map-options
                clearable
                label="Pessoa"
                class="app-field"
                :options="personOptions"
              />
            </div>

            <div class="col-12 col-md-4">
              <q-input
                v-model="model.dueDate"
                outlined
                type="date"
                label="Primeiro vencimento"
                class="app-field"
                :rules="[required()]"
              />
            </div>

            <div class="col-12 col-md-4">
              <q-select
                v-model="model.recurrenceType"
                outlined
                emit-value
                map-options
                label="Recorrência"
                class="app-field"
                :options="recurrenceOptions"
              />
            </div>

            <div class="col-12 col-md-4" v-if="model.recurrenceType === 'installments'">
              <q-input
                v-model.number="model.totalInstallments"
                outlined
                type="number"
                label="Quantidade de parcelas"
                class="app-field"
              />
            </div>

            <div class="col-12">
              <q-toggle
                v-model="model.active"
                label="Lançamento futuro ativo"
                color="primary"
              />
            </div>
          </q-form>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="dialog-footer">
          <q-btn flat no-caps label="Cancelar" v-close-popup />

          <q-btn
            color="primary"
            no-caps
            unelevated
            :loading="saving"
            label="Salvar"
            class="save-btn"
            @click="onSubmit"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { QTableColumn } from 'quasar'
import { SharedRules } from '@/shared/domain/validation/form-rules'
import MoneyInput from '@/shared/components/MoneyInput/MoneyInput.vue'
import { notify } from '@/shared/utils/notify.utils'

const installmentCount = computed(() => {
  return filteredRows.value.filter((item) => item.recurrenceType === 'installments').length
})

type FinancialType = 'expense' | 'income'
type RecurrenceType = 'none' | 'monthly' | 'installments'
type FutureEntryStatus = 'pending' | 'confirmed'

interface FutureEntry {
  id: string
  financialType: FinancialType
  description: string
  amount: number
  categoryId: string
  categoryName: string
  subcategoryName?: string
  personId?: string | null
  personName?: string | null
  dueDate: string
  recurrenceType: RecurrenceType
  totalInstallments?: number | null
  currentInstallment?: number | null
  active: boolean
  status: FutureEntryStatus
}

interface FutureEntryForm {
  id: string | null
  financialType: FinancialType
  description: string
  amount: number
  categoryId: string | null
  personId: string | null
  dueDate: string
  recurrenceType: RecurrenceType
  totalInstallments: number | null
  active: boolean
}

const { required } = SharedRules

const financialType = ref<FinancialType>('expense')
const filter = ref('')
const saving = ref(false)
const formDialog = ref(false)
const form = ref()

const rows = ref<FutureEntry[]>([
  {
    id: '1',
    financialType: 'expense',
    description: 'Conta de energia',
    amount: 350,
    categoryId: 'moradia',
    categoryName: 'Moradia',
    subcategoryName: 'Contas',
    personId: 'familia',
    personName: 'Família',
    dueDate: '2026-05-15',
    recurrenceType: 'monthly',
    active: true,
    status: 'pending',
  },
  {
    id: '2',
    financialType: 'expense',
    description: 'Parcela Peugeot 208',
    amount: 1450,
    categoryId: 'transporte',
    categoryName: 'Transporte',
    subcategoryName: 'Financiamento',
    personId: 'danilo',
    personName: 'Danilo',
    dueDate: '2026-05-10',
    recurrenceType: 'monthly',
    active: true,
    status: 'pending',
  },
  {
    id: '3',
    financialType: 'expense',
    description: 'Netflix',
    amount: 55.9,
    categoryId: 'assinaturas',
    categoryName: 'Assinaturas',
    subcategoryName: 'Streaming',
    personId: 'familia',
    personName: 'Família',
    dueDate: '2026-05-12',
    recurrenceType: 'monthly',
    active: true,
    status: 'pending',
  },
  {
    id: '4',
    financialType: 'income',
    description: 'Salário GEAP',
    amount: 8000,
    categoryId: 'salario',
    categoryName: 'Salário',
    personId: 'danilo',
    personName: 'Danilo',
    dueDate: '2026-05-10',
    recurrenceType: 'monthly',
    active: true,
    status: 'pending',
  },
  {
    id: '5',
    financialType: 'income',
    description: 'Recebimento empréstimo',
    amount: 500,
    categoryId: 'emprestimos',
    categoryName: 'Empréstimos recebidos',
    dueDate: '2026-05-20',
    recurrenceType: 'installments',
    totalInstallments: 2,
    currentInstallment: 1,
    active: true,
    status: 'pending',
  },
])

const model = ref<FutureEntryForm>({
  id: null,
  financialType: financialType.value,
  description: '',
  amount: 0,
  categoryId: null,
  personId: null,
  dueDate: '',
  recurrenceType: 'monthly',
  totalInstallments: null,
  active: true,
})

const columns: QTableColumn[] = [
  { name: 'description', label: 'Lançamento', field: 'description', align: 'left', sortable: true },
  { name: 'amount', label: 'Valor', field: 'amount', align: 'left', sortable: true },
  { name: 'dueDate', label: 'Vencimento', field: 'dueDate', align: 'left', sortable: true },
  { name: 'recurrence', label: 'Recorrência', field: 'recurrenceType', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'center', sortable: false },
]

const recurrenceOptions = [
  { label: 'Sem recorrência', value: 'none' },
  { label: 'Mensal', value: 'monthly' },
  { label: 'Parcelado', value: 'installments' },
]

const categoryOptions = [
  { label: 'Moradia', value: 'moradia' },
  { label: 'Transporte', value: 'transporte' },
  { label: 'Assinaturas', value: 'assinaturas' },
  { label: 'Salário', value: 'salario' },
  { label: 'Empréstimos recebidos', value: 'emprestimos' },
]

const personOptions = [
  { label: 'Geral/Família', value: 'familia' },
  { label: 'Danilo', value: 'danilo' },
  { label: 'Adriana', value: 'adriana' },
  { label: 'Lucas', value: 'lucas' },
]

const filteredRows = computed(() => {
  return rows.value.filter((item) => item.financialType === financialType.value)
})

const totalAmount = computed(() => {
  return filteredRows.value.reduce((total, item) => total + item.amount, 0)
})

const pendingCount = computed(() => {
  return filteredRows.value.filter((item) => item.status === 'pending').length
})

const recurringCount = computed(() => {
  return filteredRows.value.filter((item) => item.recurrenceType !== 'none').length
})

const formTitle = computed(() => {
  if (model.value.id) {
    return financialType.value === 'expense'
      ? 'Editar despesa futura'
      : 'Editar receita futura'
  }

  return financialType.value === 'expense'
    ? 'Nova despesa futura'
    : 'Nova receita futura'
})

function newFutureEntry() {
  model.value = {
    id: null,
    financialType: financialType.value,
    description: '',
    amount: 0,
    categoryId: null,
    personId: null,
    dueDate: '',
    recurrenceType: 'monthly',
    totalInstallments: null,
    active: true,
  }

  formDialog.value = true
}

function editRow(row: FutureEntry) {
  model.value = {
    id: row.id,
    financialType: row.financialType,
    description: row.description,
    amount: row.amount,
    categoryId: row.categoryId,
    personId: row.personId || null,
    dueDate: row.dueDate,
    recurrenceType: row.recurrenceType,
    totalInstallments: row.totalInstallments || null,
    active: row.active,
  }

  formDialog.value = true
}

async function onSubmit() {
  const valid = await form.value.validate(true)
  if (!valid) return

  saving.value = true

  try {
    notify.success('Lançamento futuro salvo com sucesso')
    formDialog.value = false
  } finally {
    saving.value = false
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString('pt-BR')
}

function formatRecurrence(row: FutureEntry) {
  if (row.recurrenceType === 'monthly') return 'Mensal'

  if (row.recurrenceType === 'installments') {
    return `${row.currentInstallment || 1}/${row.totalInstallments || '-'} parcelas`
  }

  return 'Único'
}

function getDueText(row: FutureEntry) {
  if (row.recurrenceType === 'monthly') {
    return 'Recorrente mensal'
  }

  if (row.recurrenceType === 'installments') {
    return 'Lançamento parcelado'
  }

  return 'Lançamento único'
}
</script>

<style lang="scss" scoped>
@import "src/css/list-page.scss";
@import "src/css/dialog.scss";

.summary-card {
  border-radius: 18px;
  background: #fff;
  border: 1px solid #e9eef5;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
}

.summary-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.summary-label {
  font-size: 13px;
  color: #64748b;
}

.summary-value {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.2;
}

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

.recurrence-badge {
  background: #e8f0ff;
  color: #1d4ed8;
  padding: 6px 10px;
  font-weight: 700;
}

.status-pending {
  background: #fff7ed;
  color: #c2410c;
  padding: 6px 10px;
  font-weight: 700;
}
</style>
