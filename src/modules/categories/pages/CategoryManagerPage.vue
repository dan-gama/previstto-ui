/* eslint-disable @typescript-eslint/no-explicit-any */
<template>
  <q-page class="domain-page q-pa-md">
    <div class="page-header q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold">Categorias</div>
        <div class="text-subtitle2 text-grey-7">
          Gerencie categorias, subcategorias, previsões de gasto e tags
        </div>
      </div>

      <div class="row q-gutter-sm">
        <q-btn
          color="primary"
          icon="add"
          label="Nova Categoria"
          no-caps
          unelevated
          class="header-btn"
          @click="newCategory"
        />

        <q-btn
          outline
          color="primary"
          icon="add"
          label="Nova Subcategoria"
          no-caps
          class="header-btn"
          :disable="!selectedCategory"
          @click="newSubcategory"
        />
      </div>
    </div>

    <q-card flat bordered class="domain-card">
      <q-card-section class="table-toolbar">
        <div class="toolbar-left">
          <div class="toolbar-title">Planejamento por categoria</div>
          <div class="toolbar-subtitle">
            Visualize o orçamento e expanda para ver as subcategorias
          </div>
        </div>

        <div class="toolbar-right">
          <q-input
            v-model="filter"
            outlined
            dense
            clearable
            class="search-input"
            label="Pesquisar categoria"
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </q-card-section>

      <q-separator />

      <q-table
        v-model:expanded="expanded"
        :rows="categoryRows"
        :columns="columns"
        row-key="id"
        :filter="filter"
        flat
        class="domain-table"
        :pagination="{ rowsPerPage: 10 }"
      >
        <template #body="props">
          <q-tr
            :props="props"
            class="category-row"
            :class="{ 'category-row-selected': selectedCategory?.id === props.row.id }"
            @click="selectCategory(props.row)"
          >
            <q-td auto-width>
              <q-btn
                v-if="getChildren(props.row.id).length"
                flat
                round
                dense
                size="sm"
                :icon="props.expand ? 'keyboard_arrow_down' : 'keyboard_arrow_right'"
                @click.stop="props.expand = !props.expand"
              >
                <q-tooltip>
                  {{ props.expand ? 'Recolher' : 'Expandir' }}
                </q-tooltip>
              </q-btn>
            </q-td>

            <q-td key="name" :props="props">
              <div class="row items-center no-wrap">
                <q-icon
                  name="folder"
                  color="primary"
                  size="20px"
                  class="q-mr-sm"
                />

                <div>
                  <div class="text-weight-medium">{{ props.row.name }}</div>
                  <div class="text-caption text-grey-6">
                    {{ getChildren(props.row.id).length ? 'Categoria agrupadora' : 'Categoria simples' }}
                  </div>
                </div>
              </div>
            </q-td>

            <q-td key="forecast" :props="props">
              <div class="text-weight-medium">
                {{ formatCurrency(getCategoryBudget(props.row)) }}
              </div>

              <div
                v-if="getChildren(props.row.id).length"
                class="text-caption text-grey-6"
              >
                Calculado pelas subcategorias
              </div>
            </q-td>

            <q-td key="tags" :props="props">
              <div class="row q-gutter-xs">
                <q-chip
                  v-for="tag in props.row.tags"
                  :key="tag"
                  dense
                  square
                  class="tag-chip"
                >
                  {{ tag }}
                </q-chip>

                <span v-if="!props.row.tags.length" class="text-grey-5">-</span>
              </div>
            </q-td>

            <q-td key="active" :props="props">
              <q-badge
                rounded
                :class="props.row.active ? 'status-active' : 'status-inactive'"
              >
                <q-icon
                  :name="props.row.active ? 'check_circle' : 'cancel'"
                  size="14px"
                  class="q-mr-xs"
                />
                {{ props.row.active ? 'Ativo' : 'Inativo' }}
              </q-badge>
            </q-td>

            <q-td key="actions" :props="props" class="text-center">
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
                @click.stop="editRow(props.row)"
              >
                <q-tooltip>Editar</q-tooltip>
              </q-btn>
            </q-td>
          </q-tr>

          <q-tr
            v-for="child in getChildren(props.row.id)"
            v-show="props.expand"
            :key="child.id"
            class="subcategory-row"
          >
            <q-td />

            <q-td>
              <div class="row items-center no-wrap subcategory-name">
                <q-icon
                  name="subdirectory_arrow_right"
                  color="grey-6"
                  size="20px"
                  class="q-mr-sm"
                />

                <div class="text-weight-medium">
                  {{ child.name }}
                </div>
              </div>
            </q-td>

            <q-td>
              <div class="text-weight-medium">
                {{ formatCurrency(child.forecast) }}
              </div>
            </q-td>

            <q-td>
              <span class="text-grey-6">
                Herdadas da categoria
              </span>
            </q-td>

            <q-td>
              <q-badge
                rounded
                :class="child.active ? 'status-active' : 'status-inactive'"
              >
                <q-icon
                  :name="child.active ? 'check_circle' : 'cancel'"
                  size="14px"
                  class="q-mr-xs"
                />
                {{ child.active ? 'Ativo' : 'Inativo' }}
              </q-badge>
            </q-td>

            <q-td class="text-center">
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
                @click="editRow(child)"
              >
                <q-tooltip>Editar</q-tooltip>
              </q-btn>
            </q-td>
          </q-tr>
        </template>

        <template #bottom-row v-if="rows.length > 0">
          <q-tr class="total-row">
            <q-td />
            <q-td class="text-weight-bold">Total planejado</q-td>
            <q-td class="text-weight-bold">
              {{ formatCurrency(totalBudget) }}
            </q-td>
            <q-td colspan="3" />
          </q-tr>
        </template>

        <template #no-data>
          <div class="full-width row flex-center q-gutter-sm empty-state">
            <q-icon name="inbox" size="40px" color="grey-5" />
            <div class="text-grey-7">
              Nenhuma categoria encontrada.
            </div>
          </div>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="formDialog">
      <q-card class="form-dialog-card">
        <q-card-section class="dialog-header">
          <div class="dialog-title">{{ formTitle }}</div>
          <div class="dialog-subtitle">{{ formSubtitle }}</div>
        </q-card-section>

        <q-separator />

        <q-card-section class="dialog-body">
          <q-form class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.name"
                outlined
                label="Nome"
                class="app-field"
                :rules="[required()]"
              />
            </div>

            <div class="col-12 col-md-6">
              <money-input
                v-model="form.forecast"
                label="Previsão de gasto (R$)"
                class="app-field"
                :rules="[decimalGreaterThanZero()]"
              />
            </div>

            <div class="col-12" v-if="form.type === 'category'">
              <q-select
                v-model="form.tags"
                outlined
                multiple
                use-chips
                use-input
                new-value-mode="add-unique"
                label="Tags disponíveis"
                class="app-field"
                hint="As subcategorias herdam as tags cadastradas aqui"
                :options="form.tags"
                @new-value="onNewTag"
              >
                <template #prepend>
                  <q-icon name="local_offer" />
                </template>
              </q-select>
            </div>

            <div class="col-12" v-else>
              <q-banner rounded class="subcategory-tag-info">
                <template #avatar>
                  <q-icon name="info" color="primary" />
                </template>

                As tags são herdadas da categoria principal:
                <strong>{{ parentCategory?.name }}</strong>.
              </q-banner>
            </div>

            <div class="col-12">
              <q-toggle
                v-model="form.active"
                label="Registro ativo"
                color="primary"
              />
            </div>
          </q-form>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="dialog-footer">
          <q-btn
            flat
            no-caps
            label="Cancelar"
            v-close-popup
          />

          <q-btn
            color="primary"
            no-caps
            unelevated
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
import { computed, onMounted, ref } from 'vue'
import type { QTableColumn } from 'quasar'
import { Notify } from 'quasar'
import { CategoryForm, CategoryItem } from '../models/category.model'
import { categoryService } from '../services/category.service'
import { SharedRules } from '@/shared/domain/validation/form-rules'
import MoneyInput from '@/shared/components/MoneyInput/MoneyInput.vue'

const { required, decimalGreaterThanZero } = SharedRules;
const filter = ref('')
const formDialog = ref(false)
const expanded = ref<string[]>(['1', '2'])
const selectedCategory = ref<CategoryItem | null>(null)

const rows = ref<CategoryItem[]>([
  // {
  //   id: '1',
  //   name: 'Veículos',
  //   type: 'category',
  //   parentId: null,
  //   forecast: 0,
  //   active: true,
  //   tags: ['manutenção', 'combustível', 'financiamento'],
  // },

  // {
  //   id: '1',
  //   name: 'Família',
  //   type: 'category',
  //   parentId: null,
  //   budget: 0,
  //   active: true,
  //   tags: ['alimentação', 'mercado', 'delivery', 'farmácia', 'educação', 'transporte'],
  // },
  // { id: '1-1', name: 'Geral', type: 'subcategory', parentId: '1', budget: 800, active: true, tags: [] },
  // { id: '1-2', name: 'Danilo', type: 'subcategory', parentId: '1', budget: 700, active: true, tags: [] },
  // { id: '1-3', name: 'Adriana', type: 'subcategory', parentId: '1', budget: 700, active: true, tags: [] },
  // { id: '1-4', name: 'Lucas', type: 'subcategory', parentId: '1', budget: 500, active: true, tags: [] },

  // {
  //   id: '2',
  //   name: 'Automóvel',
  //   type: 'category',
  //   parentId: null,
  //   budget: 0,
  //   active: true,
  //   tags: ['combustível', 'manutenção', 'seguro', 'estacionamento', 'pedágio'],
  // },
  // { id: '2-1', name: 'Carro principal', type: 'subcategory', parentId: '2', budget: 1200, active: true, tags: [] },
  // { id: '2-2', name: 'Moto', type: 'subcategory', parentId: '2', budget: 450, active: true, tags: [] },

  // {
  //   id: '3',
  //   name: 'Pets',
  //   type: 'category',
  //   parentId: null,
  //   budget: 0,
  //   active: true,
  //   tags: ['ração', 'veterinário', 'banho e tosa', 'medicamentos'],
  // },
  // { id: '3-1', name: 'Geral', type: 'subcategory', parentId: '3', budget: 300, active: true, tags: [] },
  // { id: '3-2', name: 'Veterinário', type: 'subcategory', parentId: '3', budget: 250, active: true, tags: [] },

  // {
  //   id: '4',
  //   name: 'Casa',
  //   type: 'category',
  //   parentId: null,
  //   budget: 0,
  //   active: true,
  //   tags: ['água', 'energia', 'internet', 'manutenção', 'limpeza'],
  // },
  // { id: '4-1', name: 'Contas fixas', type: 'subcategory', parentId: '4', budget: 950, active: true, tags: [] },
  // { id: '4-2', name: 'Manutenção', type: 'subcategory', parentId: '4', budget: 400, active: true, tags: [] },

  // {
  //   id: '5',
  //   name: 'Cartões de crédito',
  //   type: 'category',
  //   parentId: null,
  //   budget: 0,
  //   active: true,
  //   tags: ['assinaturas', 'parcelados', 'compras online', 'serviços'],
  // },
  // { id: '5-1', name: 'Nubank', type: 'subcategory', parentId: '5', budget: 1800, active: true, tags: [] },
  // { id: '5-2', name: 'Itaú', type: 'subcategory', parentId: '5', budget: 1200, active: true, tags: [] },
  // { id: '5-3', name: 'XP', type: 'subcategory', parentId: '5', budget: 900, active: false, tags: [] },

  // {
  //   id: '6',
  //   name: 'Lazer',
  //   type: 'category',
  //   parentId: null,
  //   budget: 600,
  //   active: true,
  //   tags: ['cinema', 'restaurante', 'viagem', 'eventos'],
  // },

  // {
  //   id: '7',
  //   name: 'Saúde',
  //   type: 'category',
  //   parentId: null,
  //   budget: 750,
  //   active: true,
  //   tags: ['consulta', 'exames', 'farmácia', 'academia'],
  // },
])

const form = ref<CategoryForm>({
  id: null,
  parentId: null,
  type: 'category',
  name: '',
  forecast: 0,
  active: true,
  tags: [],
})

const columns: QTableColumn[] = [
  { name: 'expand', label: '', field: 'expand', align: 'left' },
  { name: 'name', label: 'Categoria / Subcategoria', field: 'name', align: 'left', sortable: true },
  { name: 'forecast', label: 'Previsão', field: 'forecast', align: 'left', sortable: true },
  { name: 'tags', label: 'Tags da categoria', field: 'tags', align: 'left' },
  { name: 'active', label: 'Status', field: 'active', align: 'left', sortable: true },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'center', sortable: false },
]

const categoryRows = computed(() => {
  return rows.value.filter((item) => item.type === 'category')
})

const parentCategory = computed(() => {
  if (!form.value.parentId) return null

  return rows.value.find((item) => item.id === form.value.parentId) || null
})

// const isCategoryWithChildren = computed(() => {
//   if (form.value.type !== 'category' || !form.value.id) return false

//   return getChildren(form.value.id).length > 0
// })

// const budgetHint = computed(() => {
//   if (isCategoryWithChildren.value) {
//     return 'Categoria com subcategorias usa previsão calculada pela soma das subcategorias'
//   }

//   return 'Informe a previsão quando a categoria não possuir subcategorias'
// })

const totalBudget = computed(() => {
  return categoryRows.value.reduce((total, category) => {
    return total + getCategoryBudget(category)
  }, 0)
})

const formTitle = computed(() => {
  if (!form.value.id) {
    return form.value.type === 'category'
      ? 'Nova categoria'
      : 'Nova subcategoria'
  }

  return form.value.type === 'category'
    ? 'Editar categoria'
    : 'Editar subcategoria'
})

const formSubtitle = computed(() => {
  if (form.value.type === 'category') {
    return 'Cadastre a categoria principal e as tags disponíveis'
  }

  return 'Cadastre a previsão da subcategoria'
})

async function loadCategories() {
  // loading.value = true

  try {
    rows.value = await categoryService.findAll();
  } catch (error) {
    // loading.value = false
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function getChildren(parentId: string) {
  return rows.value.filter((item) => item.type === 'subcategory' && item.parentId === parentId)
}

function getCategoryBudget(category: CategoryItem) {
  const children = getChildren(category.id)

  if (children.length) {
    return children.reduce((total, child) => total + child.forecast, 0)
  }

  return category.forecast
}

function selectCategory(row: CategoryItem) {
  selectedCategory.value = row
}

function newCategory() {
  form.value = {
    id: null,
    parentId: null,
    type: 'category',
    name: '',
    forecast: 0,
    active: true,
    tags: [],
  }

  formDialog.value = true
}

function newSubcategory() {
  if (!selectedCategory.value) {
    Notify.create({
      type: 'warning',
      message: 'Selecione uma categoria para criar uma subcategoria.',
    })
    return
  }

  form.value = {
    id: null,
    parentId: selectedCategory.value.id,
    type: 'subcategory',
    name: '',
    forecast: 0,
    active: true,
    tags: [],
  }

  formDialog.value = true
}

function editRow(row: CategoryItem) {
  if (row.type === 'category') {
    selectedCategory.value = row
  } else {
    selectedCategory.value = rows.value.find((item) => item.id === row.parentId) || null
  }

  form.value = {
    id: row.id,
    parentId: row.parentId,
    type: row.type,
    name: row.name,
    forecast: row.forecast,
    active: row.active,
    tags: [...row.tags],
  }

  formDialog.value = true
}

function onNewTag(
  value: string,
  done: (item?: string, mode?: 'add' | 'add-unique' | 'toggle') => void,
) {
  if (form.value.type !== 'category') {
    done()
    return
  }

  const normalized = value.trim().toLowerCase()

  if (!normalized) {
    done()
    return
  }

  done(normalized, 'add-unique')
}

function onSubmit() {
  if (!form.value.name) return

  Notify.create({
    type: 'positive',
    message: 'Categoria salva com sucesso.',
  })

  formDialog.value = false
}

onMounted(() => {
  loadCategories();
})
</script>

<style lang="scss" scoped>
@import "src/css/list-page.scss";

.category-row {
  cursor: pointer;
}

.category-row-selected {
  background: #f8fbff;
}

.subcategory-row {
  background: #fcfdff;
}

.subcategory-name {
  padding-left: 28px;
}

.tag-chip {
  background: #e8f0ff;
  color: #1d4ed8;
  border-radius: 8px;
  font-weight: 600;
}

.total-row {
  background: #f8fafc;
  font-weight: 700;
}

.form-dialog-card {
  width: 720px;
  max-width: 95vw;
  border-radius: 18px;
  overflow: hidden;
}

.dialog-header {
  padding: 22px;
}

.dialog-title {
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
}

.dialog-subtitle {
  font-size: 13px;
  color: #6b7280;
  margin-top: 4px;
}

.dialog-body {
  padding: 28px;
}

.dialog-footer {
  padding: 18px 22px;
}

.save-btn {
  border-radius: 12px;
  padding-left: 18px;
  padding-right: 18px;
}

.subcategory-tag-info {
  background: #f8fafc;
  color: #334155;
}

:deep(.app-field .q-field__control) {
  border-radius: 12px;
}
</style>
