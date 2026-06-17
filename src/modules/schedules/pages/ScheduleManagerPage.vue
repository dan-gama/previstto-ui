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

        <template #body-cell-dueDate="props">
          <q-td :props="props">
            <div class="text-weight-medium">
              {{ formatDate(props.row.dueDate) }}
            </div>
            <div class="text-caption text-grey-6">
              {{ RecurrenceTypeLabel[props.row.recurrence as RecurrenceType] }}
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
              @click="editRow(props.row.id)"
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
      <q-card class="form-dialog-card" v-drag>
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
            <div class="col-12 col-md-4">
              <q-select
                v-model="model.recurrence"
                outlined
                emit-value
                map-options
                label="Recorrência"
                class="app-field"
                :options="recurrenceOptions"
              />
            </div>
            <div class="col-12 col-md-4">
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
            <div class="col-12 col-md-4">
              <q-select
                v-model="model.creditBank"
                outlined
                emit-value
                map-options
                clearable
                use-input
                input-debounce="300"
                label="Conta bancária"
                class="app-field"
                :options="transactionSourceOptions"
                @filter="(val, update) => filterFn(val, update, transactionSourceOptionsOriginal, (v) => transactionSourceOptions = v)"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-select
                v-model="model.person"
                outlined
                emit-value
                map-options
                clearable
                use-input
                input-debounce="300"
                label="Persona"
                class="app-field"
                :options="personOptions"
                @filter="(val, update) => filterFn(val, update, personOptionsOriginal, (v) => personOptions = v)"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                outlined
                clearable
                label="Primeiro vencimento"
                v-model="model.startingOn"
                mask="##/##/####"
                :rules="[
                  required('Informe sua data de nascimento')
                ]">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="model.startingOn" mask="DD/MM/YYYY">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-8">
              <q-select
                v-model="model.category"
                :options="filteredOptions"
                emit-value
                outlined
                map-options
                use-input
                clearable
                input-debounce="300"
                label="Categoria"
                class="app-field"
                @filter="filterFnCategory"
                @update:model-value="loadTags"
              >
                <!-- Como o item aparece DEPOIS de selecionado -->
                <template v-slot:selected-item="scope">
                  <div v-if="scope.opt" class="row items-center q-gutter-xs">
                    <span v-if="scope.opt.parentName" class="text-caption text-grey-6">
                      {{ scope.opt.parentName }} /
                    </span>
                    <span class="text-weight-medium text-grey-9">
                      {{ scope.opt.pureLabel }}
                    </span>
                  </div>
                </template>
                <!-- Como os itens aparecem na LISTA DO MENU (Dropdown) -->
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps" class="category-item">
                    <q-item-section>
                      <div class="row items-center justify-between no-wrap full-width">
                        <!-- Nome do item (Subcategoria ou Categoria Única) -->
                        <span :class="scope.opt.isSub ? 'text-weight-regular text-grey-9 q-pl-sm' : 'text-weight-bold text-primary'">
                          {{ scope.opt.pureLabel }}
                        </span>
                        <!-- Badge indicando a Categoria Pai (Apenas para subcategorias) -->
                        <q-badge
                          v-if="scope.opt.isSub && scope.opt.parentName"
                          outline
                          color="grey-6"
                          class="text-caption text-weight-regular q-px-sm"
                        >
                          {{ scope.opt.parentName }}
                        </q-badge>
                      </div>
                    </q-item-section>
                  </q-item>
                </template>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey-6 text-caption text-center">
                      Nenhuma categoria encontrada
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="col-12 col-md-4">
              <q-select
                v-model="model.tag"
                outlined
                emit-value
                map-options
                clearable
                use-input
                input-debounce="300"
                label="Tag"
                class="app-field"
                :options="tagOptions"
                @filter="(val, update) => filterFn(val, update, tagOptionsOriginal, (v) => tagOptions = v)"
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

          <q-btn
            flat
            round
            dense
            icon="delete"
            color="negative"
            class="action-btn"
            v-if="model.id"
            @click="onDelete(model.id)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <confirm-delete-dialog
      v-model="deleteDialog"
      :loading="deleting"
      title="Excluir agendamento"
      message="Tem certeza que deseja excluir este agendamento?"
      description="Todas as informações vinculadas a este registro poderão ser afetadas."
      confirm-label="Excluir"
      @confirm="confirmDelete"
    />
  </q-page>
</template>

<script setup lang="ts">
import { vDrag } from '@/components/vDrag/v-drag'
import { computed, onMounted, ref } from 'vue'
import type { QTableColumn } from 'quasar'
import { SharedRules } from '@/shared/domain/validation/form-rules'
import { notify } from '@/shared/utils/notify.utils'
import { scheduleService } from '../services/schedule.services'
import { ScheduleForm, ScheduleItem, CategoryOption } from '../models/schedule.model'
import { RecurrenceType, RecurrenceTypeLabel } from '../types/RecurrenceType'
import { FinancialType } from '@/shared/domain/types/FinancialType'
import { CategorySelect } from '@/shared/domain/interfaces/CategorySelect'
import { categoryService } from '@/modules/categories/services/category.service'
import { bankAccountService } from '@/modules/bank-accounts/services/bank-account.service'
import { personService } from '@/modules/persons/services/person.service'
import { useSelectFilter } from '@/shared/utils/filter-select'
import { SelectOptions } from '@/shared/dtos/select-options'
import { ScheduleMapper } from '../mappers/schedule.mapper'
import { formatDateInput } from '@/shared/utils/date.utils'
import MoneyInput from '@/shared/components/MoneyInput/MoneyInput.vue'
import ConfirmDeleteDialog from '@/shared/components/ConfirmDeleteDialog/ConfirmDeleteDialog.vue'
import { transactionService } from '@/modules/transactions/services/transaction.service'

const { filterFn } = useSelectFilter();

const deleteDialog = ref(false);
const deleting = ref(false);
const selectedDeleteId = ref<string | null>(null);


// 1. Dados brutos (Exemplo baseado na estrutura padrão)
// const rawCategories = ref<CategorySelect[]>([]);

// 2. Transforma a árvore em uma lista plana adaptada
const flattenedOptions = computed<CategoryOption[]>(() => {
  const options: CategoryOption[] = []

  categorySelects.value.forEach((cat: CategorySelect) => {
    const hasSub = cat.subCategories && cat.subCategories.length > 0

    if (hasSub) {
      // Regra: Se tem subcategoria, a categoria pai vira apenas um "Header" desabilitado na lista limpa
      options.push({
        label: cat.name.toLowerCase(),
        pureLabel: cat.name,
        value: cat.id,
        disable: true,
        isSub: false,
        tags: cat.tags,
      })

      cat.subCategories.forEach(sub => {
        options.push({
          // O 'label' junta pai + filho internamente para que a busca encontre por qualquer um dos dois termos
          label: `${cat.name} ${sub.name}`.toLowerCase(),
          pureLabel: sub.name,
          value: sub.id,
          isSub: true,
          parentName: cat.name,
          tags: cat.tags,
        })
      })
    } else {
      // Regra: Sem subcategoria, a categoria pai é totalmente selecionável
      options.push({
        label: cat.name.toLowerCase(),
        pureLabel: cat.name,
        value: cat.id,
        isSub: false,
        tags: cat.tags,
      })
    }
  })

  return options
})

// 3. Estados de busca controle
const searchFilter = ref<string>('')

// 4. Filtro Avançado Contextual
const filteredOptions = computed<CategoryOption[]>(() => {
  const needle = searchFilter.value.toLowerCase().trim()

  if (!needle) return flattenedOptions.value

  // Passo 1: Verifica se o usuário digitou o nome de alguma Categoria Pai inteira ou parcial
  const exactParentMatch = categorySelects.value.find((cat: CategorySelect) =>
    cat.name.toLowerCase().includes(needle) && cat.subCategories?.length > 0
  )

  if (exactParentMatch) {
    // Regra nova: Se digitou o nome da categoria pai, filtra para mostrar APENAS as subcategorias dela!
    return flattenedOptions.value.filter(opt => opt.parentName === exactParentMatch.name)
  }

  // Passo 2: Se não for busca por categoria pai, faz a busca textual padrão nas subcategorias
  return flattenedOptions.value.filter(opt => opt.label.includes(needle))
})

// 5. Função de Filtro exigida pelo Quasar (com tipagem estrita contra ESLint)
const filterFnCategory = (val: string, update: (callback: () => void) => void): void => {
  update(() => {
    searchFilter.value = val
  })
}



















const installmentCount = computed(() => {
  return filteredRows.value.filter((item) => item.recurrence === 'installments').length
})

type FutureEntryStatus = 'pending' | 'confirmed'



interface FutureEntry {
  id: string
  type: FinancialType
  description: string
  amount: number
  categoryId: string
  categoryName: string
  subcategoryName?: string
  personId?: string | null
  personName?: string | null
  dueDate: string
  recurrence: RecurrenceType
  totalInstallments?: number | null
  currentInstallment?: number | null
  active: boolean
  status: FutureEntryStatus
}

const { required } = SharedRules

const financialType = ref<FinancialType>('expense')
const filter = ref('')
const saving = ref(false)
const formDialog = ref(false)
const form = ref()

const rows = ref<ScheduleItem[]>([])

const model = ref<ScheduleForm>({
  id: null,
  type: financialType.value,
  description: '',
  amount: 0,
  category: null,
  creditBank: null,
  person: null,
  startingOn: null,
  recurrence: 'monthly',
  installment: null,
  active: true,
  tag: null,
})

const columns: QTableColumn[] = [
  { name: 'description', label: 'Lançamento', field: 'description', align: 'left', sortable: true },
  { name: 'amount', label: 'Valor', field: 'amount', align: 'left', sortable: true },
  { name: 'startingOn', label: 'Começando em', field: 'startingOn', align: 'left', sortable: true },
  { name: 'recurrence', label: 'Recorrência', field: 'recurrenceType', align: 'left' },
  { name: 'active', label: 'Status', field: 'active', align: 'left' },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'center', sortable: false },
]

const recurrenceOptions = Object.entries(RecurrenceTypeLabel).map(([key, value]) => ({
  value: key as RecurrenceType,
  label: value
}));

// const bankAccountOptions = ref<Array<SelectOptions>>([]);
// const bankAccountOptionsOriginal = ref<Array<SelectOptions>>([]);
const transactionSourceOptions = ref<Array<SelectOptions>>([]);
const transactionSourceOptionsOriginal = ref<Array<SelectOptions>>([]);
const personOptions = ref<Array<SelectOptions>>([]);
const personOptionsOriginal = ref<Array<SelectOptions>>([]);
const tagOptions = ref<Array<SelectOptions>>([]);
const tagOptionsOriginal = ref<Array<SelectOptions>>([]);
const categorySelects = ref<Array<CategorySelect>>([]);
const categorySelectsOriginal = ref<Array<CategorySelect>>([]);

const filteredRows = computed(() => {
  return rows.value.filter((item) => item.type === financialType.value)
})

const totalAmount = computed(() => {
  return filteredRows.value.reduce((total, item) => total + item.amount, 0)
})

const pendingCount = computed(() => {
  // return filteredRows.value.filter((item) => ['pending', 'overdue'].includes(item.status)).length
  return 0;
})

const recurringCount = computed(() => {
  return filteredRows.value.filter((item) => item.recurrence !== 'none').length
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
    type: financialType.value,
    description: '',
    amount: 0,
    category: null,
    person: null,
    startingOn: '',
    recurrence: 'monthly',
    installment: null,
    active: true,
    creditBank: null,
    tag: null,
  }

  formDialog.value = true
}

async function editRow(id: string) {
  model.value = await scheduleService.findById(id);

  // Formata a data padrão input
  model.value.startingOn = formatDateInput(model.value.startingOn);

  formDialog.value = true
}

async function onSubmit() {
  const valid = await form.value.validate(true)
  if (!valid) return

  saving.value = true

  try {
    // Formata o campo decimal
    model.value.amount = Number(model.value.amount);

    // Insert
    if (!model.value.id) {
      await scheduleService.create(ScheduleMapper.toCreate(model.value));
      notify.success('Agendamento criado com sucesso.');
    // Update
    } else {
      await scheduleService.update(model.value.id, ScheduleMapper.toUpdate(model.value));
      notify.success('Agendamento atualizado com sucesso.');
    }

    // Atualiza a lista de agendamento
    loadSchedules();

  } finally {
    formDialog.value = false
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
  if (row.recurrence === 'monthly') return 'Mensal'

  if (row.recurrence === 'installment') {
    return `${row.currentInstallment || 1}/${row.totalInstallments || '-'} parcelas`
  }

  return 'Único'
}

function getDueText(row: FutureEntry) {
  if (row.recurrence === 'monthly') {
    return 'Recorrente mensal'
  }

  if (row.recurrence === 'installment') {
    return 'Lançamento parcelado'
  }

  return 'Lançamento único'
}

async function loadSchedules() {
  try {
    rows.value = await scheduleService.findAll();
  } catch (error) {

  }
}

async function loadCategoriesSelect() {
  try {
    categorySelects.value = await categoryService.getSelect(financialType.value);
    categorySelectsOriginal.value = categorySelects.value;
  } catch (error) {}
}

async function loadPersonsSelect() {
  try {
    personOptions.value = await personService.getSelect();
    personOptionsOriginal.value = personOptions.value;
  } catch (error) {}
}

async function loadTransactionSourceSelect() {
  try {
    transactionSourceOptions.value = await transactionService.getTransactionSourceSelect();
    transactionSourceOptionsOriginal.value = transactionSourceOptions.value;
  } catch (error) {

  }
}

function loadTags() {
  try {
    model.value.tag = null;
    tagOptions.value = [];
    tagOptionsOriginal.value = [];

    if (!model.value.category) {
      return;
    }

    for (const category of categorySelectsOriginal.value) {
      // 1. Verifica se o ID pertence à categoria principal
      if (category.id === model.value.category) {
        tagOptions.value = category.tags.map((m) => ({
          label: m,
          value: m
        }));

        tagOptionsOriginal.value = tagOptions.value;
        return
      }

      // 2. Verifica se o ID pertence a alguma subcategoria
      const hasSubCategory = category.subCategories?.some(sub => sub.id === model.value.category);
      if (hasSubCategory) {
        tagOptions.value = category.tags.map((m) => ({
          label: m,
          value: m
        }));

        tagOptionsOriginal.value = tagOptions.value;
        return
      }
    }
  } catch (error) {

  }
}

async function onDelete(id: string) {
  selectedDeleteId.value = id;
  deleteDialog.value = true;
}

async function confirmDelete() {
  if (!selectedDeleteId.value) return;

  deleting.value = true;

  try {
    await scheduleService.delete(selectedDeleteId.value);

    deleteDialog.value = false;
    formDialog.value = false;
    selectedDeleteId.value = null;

    // Atualiza a lista de agendamento
    loadSchedules();

    notify.success('Conta bancária excluída com sucesso');

  } finally {
    deleting.value = false;
  }
}

onMounted(() => {
  loadSchedules();
  loadCategoriesSelect();
  loadTransactionSourceSelect();
  loadPersonsSelect();
});
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

.category-item {
  min-height: 40px;

  // Customização para os headers de categorias desabilitados (Pai)
  &.q-manual-focusable--disabled {
    opacity: 1 !important; // Remove o visual semi-transparente padrão do Quasar
    background-color: #f8fafc; // Dá um leve fundo de seção de menu

    .text-primary {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #64748b !important; // Transforma o pai em um label de seção cinza elegante
    }
  }
}
</style>
