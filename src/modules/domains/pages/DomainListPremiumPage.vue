<template>
  <q-page class="domain-page q-pa-md">
    <!-- Cabeçalho -->
    <div class="page-header q-mb-lg">
      <div>
        <div class="text-h5 text-weight-bold">Domínios</div>
        <div class="text-subtitle2 text-grey-7">
          Gerencie categorias, bancos, cartões e outros cadastros do sistema
        </div>
      </div>

      <div class="row q-gutter-sm">
        <q-btn
          outline
          color="primary"
          icon="download"
          label="Exportar"
          no-caps
          class="header-btn"
        />
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
    </div>

    <!-- Cards resumo -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-sm-6 col-lg-3">
        <q-card flat bordered class="summary-card">
          <q-card-section class="row items-center no-wrap">
            <div class="summary-icon bg-blue-1 text-primary">
              <q-icon name="dataset" size="24px" />
            </div>

            <div class="q-ml-md">
              <div class="summary-label">Total de registros</div>
              <div class="summary-value">{{ filteredRows.length }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-lg-3">
        <q-card flat bordered class="summary-card">
          <q-card-section class="row items-center no-wrap">
            <div class="summary-icon bg-green-1 text-positive">
              <q-icon name="check_circle" size="24px" />
            </div>

            <div class="q-ml-md">
              <div class="summary-label">Ativos</div>
              <div class="summary-value">{{ activeCount }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-lg-3">
        <q-card flat bordered class="summary-card">
          <q-card-section class="row items-center no-wrap">
            <div class="summary-icon bg-red-1 text-negative">
              <q-icon name="cancel" size="24px" />
            </div>

            <div class="q-ml-md">
              <div class="summary-label">Inativos</div>
              <div class="summary-value">{{ inactiveCount }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-lg-3">
        <q-card flat bordered class="summary-card">
          <q-card-section class="row items-center no-wrap">
            <div class="summary-icon bg-purple-1 text-purple">
              <q-icon name="category" size="24px" />
            </div>

            <div class="q-ml-md">
              <div class="summary-label">Tipos exibidos</div>
              <div class="summary-value">{{ selectedType ? 1 : domainTypeOptions.length }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Grid -->
    <q-card flat bordered class="domain-card">
      <!-- toolbar -->
      <q-card-section class="table-toolbar">
        <div class="toolbar-left">
          <div class="toolbar-title">Lista de registros</div>
          <div class="toolbar-subtitle">
            {{ filteredRows.length }} registro(s) encontrado(s)
          </div>
        </div>

        <div class="toolbar-right">
          <q-input
            v-model="search"
            outlined
            dense
            clearable
            class="search-input"
            label="Pesquisar por nome ou descrição"
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>

          <q-select
            v-model="selectedType"
            outlined
            dense
            clearable
            emit-value
            map-options
            class="filter-select"
            label="Filtrar por tipo"
            :options="domainTypeOptions"
          />

          <q-select
            v-model="selectedStatus"
            outlined
            dense
            clearable
            emit-value
            map-options
            class="filter-select"
            label="Status"
            :options="statusOptions"
          />
        </div>
      </q-card-section>

      <q-separator />

      <q-table
        :rows="filteredRows"
        :columns="columns"
        row-key="id"
        :loading="loading"
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
            <q-chip
              dense
              class="type-chip"
              :class="getTypeChipClass(props.value)"
            >
              <q-icon
                :name="getTypeIcon(props.value)"
                size="16px"
                class="q-mr-xs"
              />
              {{ formatType(props.value) }}
            </q-chip>
          </q-td>
        </template>

        <template #body-cell-name="props">
          <q-td :props="props">
            <div class="text-weight-medium text-body1">
              {{ props.value }}
            </div>
            <div class="text-caption text-grey-6">
              ID: {{ props.row.id }}
            </div>
          </q-td>
        </template>

        <template #body-cell-description="props">
          <q-td :props="props">
            <div class="description-cell">
              {{ props.value || 'Sem descrição informada' }}
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
              icon="more_vert"
              color="grey-7"
              class="action-menu-btn"
            >
              <q-menu auto-close anchor="bottom right" self="top right">
                <q-list style="min-width: 180px">
                  <q-item clickable v-ripple>
                    <q-item-section avatar>
                      <q-icon name="visibility" />
                    </q-item-section>
                    <q-item-section>Visualizar</q-item-section>
                  </q-item>

                  <q-item
                    clickable
                    v-ripple
                    :to="{ name: 'domain-edit', params: { id: props.row.id } }"
                  >
                    <q-item-section avatar>
                      <q-icon name="edit" color="primary" />
                    </q-item-section>
                    <q-item-section>Editar</q-item-section>
                  </q-item>

                  <q-separator />

                  <q-item clickable v-ripple>
                    <q-item-section avatar>
                      <q-icon name="toggle_off" color="orange" />
                    </q-item-section>
                    <q-item-section>
                      {{ props.row.active ? 'Desativar' : 'Ativar' }}
                    </q-item-section>
                  </q-item>

                  <q-item clickable v-ripple>
                    <q-item-section avatar>
                      <q-icon name="delete" color="negative" />
                    </q-item-section>
                    <q-item-section>Excluir</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-td>
        </template>

        <template #no-data>
          <div class="full-width empty-state">
            <q-icon name="inventory_2" size="52px" color="grey-5" />
            <div class="empty-title">Nenhum domínio encontrado</div>
            <div class="empty-subtitle">
              Tente ajustar os filtros ou cadastre um novo domínio.
            </div>

            <q-btn
              color="primary"
              icon="add"
              label="Novo domínio"
              no-caps
              unelevated
              class="q-mt-md"
              :to="{ name: 'domain-create' }"
            />
          </div>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { QTableColumn } from 'quasar'
import { domainService } from '../services/domain.service'
import type { DomainModel } from '../models/domain.model'

const loading = ref(false)
const rows = ref<DomainModel[]>([])

const search = ref('')
const selectedType = ref<string | null>(null)
const selectedStatus = ref<boolean | null>(null)

const domainTypeOptions = [
  { label: 'Categoria', value: 'CATEGORY' },
  { label: 'Banco', value: 'BANK' },
  { label: 'Cartão de Crédito', value: 'CREDIT_CARD' },
  { label: 'Bandeira', value: 'CARD_BRAND' },
]

const statusOptions = [
  { label: 'Ativo', value: true },
  { label: 'Inativo', value: false },
]

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
    label: '',
    field: 'actions',
    align: 'center',
  },
]

const filteredRows = computed(() => {
  return rows.value.filter((item) => {
    const text = `${item.name} ${item.description} ${item.type}`.toLowerCase()
    const matchesSearch = !search.value || text.includes(search.value.toLowerCase())
    const matchesType = !selectedType.value || item.type === selectedType.value
    const matchesStatus =
      selectedStatus.value === null || item.active === selectedStatus.value

    return matchesSearch && matchesType && matchesStatus
  })
})

const activeCount = computed(() => rows.value.filter((item) => item.active).length)
const inactiveCount = computed(() => rows.value.filter((item) => !item.active).length)

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

function getTypeIcon(type: string): string {
  const map: Record<string, string> = {
    CATEGORY: 'category',
    BANK: 'account_balance',
    CREDIT_CARD: 'credit_card',
    CARD_BRAND: 'bookmark',
  }

  return map[type] ?? 'dataset'
}

function getTypeChipClass(type: string): string {
  const map: Record<string, string> = {
    CATEGORY: 'chip-category',
    BANK: 'chip-bank',
    CREDIT_CARD: 'chip-card',
    CARD_BRAND: 'chip-brand',
  }

  return map[type] ?? 'chip-default'
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
}

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

.domain-card {
  border-radius: 20px;
  background: #ffffff;
  border: 1px solid #e9eef5;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
  overflow: hidden;
}

.table-toolbar {
  display: flex;
  align-items: flex-start;
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
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.search-input {
  width: 320px;
  max-width: 100%;
}

.filter-select {
  width: 180px;
  max-width: 100%;
}

:deep(.search-input .q-field__control),
:deep(.filter-select .q-field__control) {
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
  transition: background 0.2s ease, transform 0.2s ease;
}

:deep(.domain-table tbody tr:hover) {
  background: #f8fbff;
}

:deep(.domain-table tbody td) {
  height: 68px;
  border-color: #eef2f7;
  color: #334155;
}

.description-cell {
  color: #64748b;
  max-width: 340px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.type-chip {
  border-radius: 10px;
  font-weight: 600;
  padding-left: 6px;
  padding-right: 6px;
}

.chip-category {
  background: #e0f2fe;
  color: #0369a1;
}

.chip-bank {
  background: #dcfce7;
  color: #166534;
}

.chip-card {
  background: #f3e8ff;
  color: #7e22ce;
}

.chip-brand {
  background: #ffedd5;
  color: #c2410c;
}

.chip-default {
  background: #e5e7eb;
  color: #374151;
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

.action-menu-btn {
  border-radius: 10px;
}

.empty-state {
  min-height: 240px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 32px;
}

.empty-title {
  font-size: 18px;
  font-weight: 700;
  color: #334155;
}

.empty-subtitle {
  font-size: 14px;
  color: #64748b;
  text-align: center;
}

@media (max-width: 1024px) {
  .toolbar-right {
    width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 768px) {
  .search-input,
  .filter-select {
    width: 100%;
  }
}
</style>
