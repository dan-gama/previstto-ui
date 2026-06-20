<template>
  <q-dialog v-model="dialog">
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
                {{ title }}
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
        <q-form ref="form" class="row q-col-gutter-md" greedy @submit.prevent="submitForm">
          <div class="col-12 col-md-4">
            <q-select
              v-model="schedule.recurrence"
              outlined
              emit-value
              map-options
              label="Recorrencia"
              class="app-field"
              :options="recurrenceOptions"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model="schedule.description"
              outlined
              label="Descricao"
              class="app-field"
              :rules="[required()]"
            />
          </div>
          <div class="col-12 col-md-4">
            <money-input
              v-model="schedule.amount"
              label="Valor (R$)"
              class="app-field"
              :rules="[required()]"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-select
              v-model="schedule.creditBank"
              outlined
              emit-value
              map-options
              clearable
              use-input
              input-debounce="300"
              label="Conta bancaria"
              class="app-field"
              :options="transactionSourceOptions"
              @filter="filterTransactionSources"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-select
              v-model="schedule.person"
              outlined
              emit-value
              map-options
              clearable
              use-input
              input-debounce="300"
              label="Pessoa"
              class="app-field"
              :options="personOptions"
              @filter="filterPersons"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model="schedule.startingOn"
              outlined
              clearable
              label="Primeiro vencimento"
              mask="##/##/####"
              :rules="[required('Informe o primeiro vencimento')]"
            >
              <template #append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="schedule.startingOn" mask="DD/MM/YYYY">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Fechar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-8">
            <q-select
              v-model="schedule.category"
              :options="categoryOptions"
              emit-value
              outlined
              map-options
              use-input
              clearable
              input-debounce="300"
              label="Categoria"
              class="app-field"
              @filter="filterCategoryOptions"
              @update:model-value="emit('load-tags')"
            >
              <template #selected-item="scope">
                <div v-if="scope.opt" class="row items-center q-gutter-xs">
                  <span v-if="scope.opt.parentName" class="text-caption text-grey-6">
                    {{ scope.opt.parentName }} /
                  </span>
                  <span class="text-weight-medium text-grey-9">
                    {{ scope.opt.pureLabel }}
                  </span>
                </div>
              </template>
              <template #option="scope">
                <q-item v-bind="scope.itemProps" class="category-item">
                  <q-item-section>
                    <div class="row items-center justify-between no-wrap full-width">
                      <span :class="scope.opt.isSub ? 'text-weight-regular text-grey-9 q-pl-sm' : 'text-weight-bold text-primary'">
                        {{ scope.opt.pureLabel }}
                      </span>
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
              <template #no-option>
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
              v-model="schedule.tag"
              outlined
              emit-value
              map-options
              clearable
              use-input
              input-debounce="300"
              label="Tag"
              class="app-field"
              :options="tagOptions"
              @filter="filterTags"
            />
          </div>
          <div class="col-12">
            <q-toggle
              v-model="schedule.active"
              label="Lancamento futuro ativo"
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
          @click="submitForm"
        />

        <q-btn
          v-if="schedule.id"
          flat
          round
          dense
          icon="delete"
          color="negative"
          class="action-btn"
          @click="emit('delete', schedule.id)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { vDrag } from '@/components/vDrag/v-drag'
import MoneyInput from '@/shared/components/MoneyInput/MoneyInput.vue'
import { SelectOptions } from '@/shared/dtos/select-options'
import { SharedRules } from '@/shared/domain/validation/form-rules'
import { FinancialType } from '@/shared/domain/types/FinancialType'
import { useSelectFilter } from '@/shared/utils/filter-select'
import { CategoryOption, ScheduleForm } from '../models/schedule.model'
import { RecurrenceType } from '../types/RecurrenceType'

type FormRef = {
  validate: (shouldFocus?: boolean) => Promise<boolean>
}

const props = defineProps<{
  categoryOptions: CategoryOption[]
  financialType: FinancialType
  filterCategoryOptions: (val: string, update: (callback: () => void) => void) => void
  personOptionsOriginal: SelectOptions[]
  recurrenceOptions: Array<{ value: RecurrenceType; label: string }>
  saving: boolean
  tagOptionsOriginal: SelectOptions[]
  title: string
  transactionSourceOptionsOriginal: SelectOptions[]
}>()

const emit = defineEmits<{
  (event: 'delete', id: string): void
  (event: 'load-tags'): void
  (event: 'save'): void
}>()

const dialog = defineModel<boolean>({ required: true })
const schedule = defineModel<ScheduleForm>('schedule', { required: true })
const personOptions = defineModel<SelectOptions[]>('personOptions', { required: true })
const tagOptions = defineModel<SelectOptions[]>('tagOptions', { required: true })
const transactionSourceOptions = defineModel<SelectOptions[]>('transactionSourceOptions', { required: true })

const { required } = SharedRules
const { filterFn } = useSelectFilter()
const form = ref<FormRef | null>(null)

async function submitForm() {
  const valid = await form.value?.validate(true)
  if (!valid) return

  emit('save')
}

function filterTransactionSources(val: string, update: (callback: () => void) => void) {
  filterFn(val, update, props.transactionSourceOptionsOriginal, (value) => {
    transactionSourceOptions.value = value
  })
}

function filterPersons(val: string, update: (callback: () => void) => void) {
  filterFn(val, update, props.personOptionsOriginal, (value) => {
    personOptions.value = value
  })
}

function filterTags(val: string, update: (callback: () => void) => void) {
  filterFn(val, update, props.tagOptionsOriginal, (value) => {
    tagOptions.value = value
  })
}
</script>

<style lang="scss" scoped>
@import "src/css/dialog.scss";
@import "src/css/list-page.scss";

.category-item {
  min-height: 40px;

  &.q-manual-focusable--disabled {
    opacity: 1 !important;
    background-color: #f8fafc;

    .text-primary {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #64748b !important;
    }
  }
}
</style>
