<template>
  <q-page class="domain-page q-pa-md">
    <div class="page-header q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold">Domínios</div>
        <div class="text-subtitle2 text-grey-7">
          Gerencie categorias, bancos, cartões e outros cadastros do sistema
        </div>
      </div>

      <q-btn
        color="primary"
        icon="add"
        label="Novo domínio"
        no-caps
        unelevated
        class="header-btn"
        :to="{ name: 'domain-create' }"
      />
    </div>

    <q-card flat bordered class="domain-card">
      <q-card-section class="table-toolbar">
        <div class="toolbar-left">
          <div class="toolbar-title">Lista de registros</div>
          <div class="toolbar-subtitle">
            Visualize e edite os domínios cadastrados
          </div>
        </div>

        <div class="toolbar-right">
          <q-input
            v-model="filter"
            outlined
            dense
            clearable
            class="search-input"
            label="Pesquisar domínio"
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

        <template #body-cell-type="props">
          <q-td :props="props">
            <q-badge
              color="grey-2"
              text-color="grey-8"
              class="type-badge"
            >
              {{ formatType(props.value) }}
            </q-badge>
          </q-td>
        </template>

        <template #body-cell-name="props">
          <q-td :props="props">
            <div class="text-weight-medium">{{ props.value }}</div>
          </q-td>
        </template>

        <template #body-cell-description="props">
          <q-td :props="props">
            <div class="description-cell">
              {{ props.value || '-' }}
            </div>
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
              Nenhum domínio encontrado.
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
import { domainService } from '../services/domain.service'
import type { DomainModel } from '../models/domain.model'

const loading = ref(false)
const filter = ref('')
const rows = ref<DomainModel[]>([])

const columns: QTableColumn[] = [
  {
    name: 'type',
    label: 'Tipo',
    field: 'type',
    align: 'left',
    sortable: true,
  },
  {
    name: 'name',
    label: 'Nome',
    field: 'name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'description',
    label: 'Descrição',
    field: 'description',
    align: 'left',
  },
  {
    name: 'active',
    label: 'Status',
    field: 'active',
    align: 'left',
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Ações',
    field: 'actions',
    align: 'center',
  },
]

async function loadDomains() {
  loading.value = true

  try {
    rows.value = await domainService.findAll()
  } finally {
    loading.value = false
  }
}

function formatType(type: string): string {
  const map: Record<string, string> = {
    CATEGORY: 'Categoria',
    BANK: 'Banco',
    CREDIT_CARD: 'Cartão de Crédito',
    CARD_BRAND: 'Bandeira',
  }

  return map[type] ?? type
}

onMounted(() => {
  loadDomains()
})
</script>

<style scoped>
.domain-page {
  background: #f8fafc;
  min-height: 100%;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.header-btn {
  border-radius: 12px;
  padding-left: 14px;
  padding-right: 14px;
}

.domain-card {
  border-radius: 18px;
  background: #ffffff;
  border: 1px solid #e9eef5;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
  overflow: hidden;
}

.table-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding: 20px;
}

.toolbar-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.toolbar-title {
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
}

.toolbar-subtitle {
  font-size: 13px;
  color: #6b7280;
}

.toolbar-right {
  min-width: 280px;
}

.search-input {
  width: 320px;
  max-width: 100%;
}

:deep(.search-input .q-field__control) {
  border-radius: 12px;
}

.domain-table {
  background: transparent;
}

:deep(.domain-table thead tr th) {
  font-weight: 700;
  font-size: 13px;
  color: #64748b;
  background: #f8fafc;
  border-bottom: 1px solid #e9eef5;
}

:deep(.domain-table tbody tr) {
  transition: background 0.2s ease;
}

:deep(.domain-table tbody tr:hover) {
  background: #f8fbff;
}

:deep(.domain-table tbody td) {
  height: 62px;
  border-color: #eef2f7;
  color: #334155;
}

.type-badge {
  padding: 7px 10px;
  border-radius: 10px;
  font-weight: 600;
}

.description-cell {
  color: #64748b;
  max-width: 320px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-active {
  background: #e8f7ee;
  color: #18794e;
  padding: 6px 10px;
  font-weight: 700;
}

.status-inactive {
  background: #fdecec;
  color: #b42318;
  padding: 6px 10px;
  font-weight: 700;
}

.action-btn {
  border-radius: 10px;
  margin: 0 2px;
}

.empty-state {
  min-height: 180px;
  flex-direction: column;
}

@media (max-width: 768px) {
  .table-toolbar {
    align-items: stretch;
  }

  .toolbar-right {
    width: 100%;
    min-width: unset;
  }

  .search-input {
    width: 100%;
  }
}
</style>
