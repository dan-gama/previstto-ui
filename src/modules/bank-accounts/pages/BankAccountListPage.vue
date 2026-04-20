<template>
  <q-page class="domain-page q-pa-md">
    <div class="page-header q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold">Contas Bancárias</div>
        <div class="text-subtitle2 text-grey-7">
          Gerencie suas contas bancárias
        </div>
      </div>

      <q-btn
        color="primary"
        icon="add"
        label="Nova Conta Bancária"
        no-caps
        unelevated
        class="header-btn"
        :to="{ name: 'bank-account-create' }"
      />
    </div>

    <q-card flat bordered class="domain-card">
      <q-card-section class="table-toolbar">
        <div class="toolbar-left">
          <div class="toolbar-title">Lista de registros</div>
          <div class="toolbar-subtitle">
            Visualize e edite as contas bancárias cadastradas
          </div>
        </div>

        <div class="toolbar-right">
          <q-input
            v-model="filter"
            outlined
            dense
            clearable
            class="search-input"
            label="Pesquisar conta bancária"
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

        <template #body-cell-bankName="props">
          <q-td :props="props">
            <div class="text-weight-medium">{{ props.value }}</div>
          </q-td>
        </template>

        <template #body-cell-accountTypeName="props">
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
              :to="{ name: 'domain-edit', params: { id: props.row.id } }"
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
import { BankAccountList } from '../models/bank-account-list.'
import { bankAccountService } from '../services/bank-account.service'

const loading = ref(false)
const filter = ref('')
const rows = ref<BankAccountList[]>([])

const columns: QTableColumn[] = [
  { name: 'name', label: 'Conta bancária', field: 'name', align: 'left', sortable: true, },
  { name: 'bankName', label: 'Banco', field: 'bankName', align: 'left', sortable: true, },
  { name: 'accountTypeName', label: 'Tipo de Conta', field: 'accountTypeName', align: 'left', sortable: true, },
  { name: 'active', label: 'Status', field: 'active', align: 'left', sortable: true, },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'center', sortable: false, },
]

async function loadBankAccount() {
  loading.value = true

  try {
    rows.value = await bankAccountService.findAll()
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadBankAccount();
})
</script>

<style lang="scss" scoped>
@import "src/css/list-page.scss";
</style>
