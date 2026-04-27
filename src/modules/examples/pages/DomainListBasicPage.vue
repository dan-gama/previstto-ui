<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-col-gutter-md q-mb-md">
      <div class="col">
        <div class="text-h5">Domínios</div>
        <div class="text-subtitle2 text-grey-7">
          Gerencie categorias, bancos, cartões e outros cadastros do sistema
        </div>
      </div>

      <div class="col-auto">
        <q-btn
          color="primary"
          icon="add"
          label="Novo domínio"
          :to="{ name: 'domain-create' }"
        />
      </div>
    </div>

    <q-card flat bordered>
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-input
              v-model="filter"
              outlined
              dense
              label="Pesquisar"
              clearable
            >
              <template #prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
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
      >
        <template #body-cell-active="props">
          <q-td :props="props">
            <q-badge :color="props.value ? 'positive' : 'negative'">
              {{ props.value ? 'Ativo' : 'Inativo' }}
            </q-badge>
          </q-td>
        </template>

        <template #body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              flat
              round
              dense
              icon="edit"
              color="primary"
              :to="{ name: 'domain-edit', params: { id: props.row.id } }"
            />
          </q-td>
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

onMounted(() => {
  loadDomains()
})
</script>
