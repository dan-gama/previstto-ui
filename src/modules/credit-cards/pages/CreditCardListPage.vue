<template>
  <q-page class="domain-page q-pa-md">
    <div class="page-header q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold">Cartões de Crédito</div>
        <div class="text-subtitle2 text-grey-7">
          Gerencie seus cartões de crédito
        </div>
      </div>

      <q-btn
        color="primary"
        icon="add"
        label="Novo Cartão de Crédito"
        no-caps
        unelevated
        class="header-btn"
        :to="{ name: 'credit-card-new' }"
      />
    </div>

    <q-card flat bordered class="domain-card">
      <q-card-section class="table-toolbar">
        <div class="toolbar-left">
          <div class="toolbar-title">Lista de registros</div>
          <div class="toolbar-subtitle">
            Visualize e edite os cartõs de crédito cadastrados
          </div>
        </div>

        <div class="toolbar-right">
          <q-input
            v-model="filter"
            outlined
            dense
            clearable
            class="search-input"
            label="Pesquisar cartão de crédito"
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
        :loading="loading"
        :filter="filter"
        flat
        class="domain-table"
        :pagination="{ rowsPerPage: 10 }"
      >
        <template #loading>
          <q-inner-loading showing>
            <q-spinner size="32px" color="primary" />
          </q-inner-loading>
        </template>

        <template #body-cell-name="props">
          <q-td :props="props">
            <div class="text-weight-medium">{{ props.value }}</div>
          </q-td>
        </template>

        <template #body-cell-brandName="props">
          <q-td :props="props">
            <div class="text-weight-medium">{{ props.value }}</div>
          </q-td>
        </template>

        <template #body-cell-digits="props">
          <q-td :props="props">
            <div class="text-weight-medium">{{ props.value }}</div>
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
            <q-btn
              flat
              round
              dense
              icon="visibility"
              color="grey-7"
              class="action-btn"
            >
              <q-tooltip>Visualizar</q-tooltip>
            </q-btn>

            <q-btn
              flat
              round
              dense
              icon="edit"
              color="primary"
              class="action-btn"
              :to="{ name: 'credit-card-edit', params: { id: props.row.id } }"
            >
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <template #no-data>
          <div class="full-width row flex-center q-gutter-sm empty-state">
            <q-icon name="inbox" size="40px" color="grey-5" />
            <div class="text-grey-7">
              Nenhum registro encontrado.
            </div>
          </div>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { QTableColumn } from 'quasar'
import { CreditCardList } from '../models/credit-card.model'
import { creditCardService } from '../services/credit-card-service'

const loading = ref(false)
const filter = ref('')
const rows = ref<CreditCardList[]>([])

const columns: QTableColumn[] = [
  { name: 'name', label: 'Cartão de Crédito', field: 'name', align: 'left', sortable: true, },
  { name: 'brandName', label: 'Bandeira', field: 'brandName', align: 'left', sortable: true, },
  { name: 'digits', label: '4 últimos dígitos', field: 'digits', align: 'left', sortable: true, },
  { name: 'active', label: 'Status', field: 'active', align: 'left', sortable: true, },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'center', sortable: false, },
]

async function loadCreditCards() {
  loading.value = true

  try {
    rows.value = await creditCardService.findAll()
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadCreditCards();
})
</script>

<style lang="scss" scoped>
@import "src/css/list-page.scss";
</style>

