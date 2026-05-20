/* eslint-disable @typescript-eslint/no-explicit-any */
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
          :label="financialType === 'expense' ? 'Nova Despesa' : 'Nova Receita'"
          no-caps
          unelevated
          class="header-btn"
          @click="newCategory"
        />
        <q-btn
          outline
          :color="financialType === 'expense' ? 'negative' : 'positive'"
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
          <div class="toolbar-title">
            {{ financialType === 'expense' ? 'Planejamento de despesas' : 'Planejamento de receitas' }}
          </div>
          <div class="toolbar-subtitle">
            {{ financialType === 'expense'
              ? 'Visualize o orçamento de despesas e expanda para ver as subcategorias'
              : 'Visualize a previsão de receitas e expanda para ver as subcategorias'
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
            <q-td class="text-weight-bold">
              {{ financialType === 'expense' ? 'Total de despesas planejadas' : 'Total de receitas previstas' }}
            </q-td>
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
        <q-card-section
          class="dialog-header"
          :class="financialType === 'expense'
            ? 'dialog-header-expense'
            : 'dialog-header-income'"
        >
          <div class="row items-center justify-between no-wrap">
            <div class="row items-center no-wrap">
              <div class="dialog-icon">
                <q-icon
                  :name="model.type === 'category'
                    ? 'folder'
                    : 'subdirectory_arrow_right'"
                  size="24px"
                />
              </div>

              <div class="q-ml-md">
                <div class="dialog-title">
                  {{ formTitle }}
                </div>

                <div class="dialog-subtitle">
                  {{ formSubtitle }}
                </div>
              </div>
            </div>

            <q-btn
              flat
              round
              dense
              icon="close"
              class="dialog-close-btn"
              v-close-popup
            />
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="dialog-body">
          <q-form class="row q-col-gutter-md" @submit.prevent="onSubmit" ref="form" greedy>
            <div class="col-12 col-md-6">
              <q-input
                v-model="model.name"
                outlined
                label="Nome"
                class="app-field"
                :rules="[required()]"
              />
            </div>

            <div class="col-12 col-md-6">
              <money-input
                v-model="model.forecast"
                label="Previsão de gasto (R$)"
                class="app-field"
                :disable="isCategoryWithChildren"
                :hint="budgetHint"
                :rules="[required()]"
              />
            </div>

            <div class="col-12" v-if="model.type === 'category'">
              <div class="tag-field app-field">
                <q-input
                  v-model="tagInput"
                  outlined
                  label="Tags disponíveis"
                  hint="Digite uma tag e pressione Enter"
                  @keyup.enter.prevent="addTag"
                >
                  <template #prepend>
                    <q-icon name="local_offer" />
                  </template>

                  <template #append>
                    <q-btn
                      flat
                      round
                      dense
                      icon="add"
                      @click="addTag"
                    />
                  </template>
                </q-input>

                <div class="tag-list-box q-mt-sm">
                <div class="tag-list-header">
                  <q-icon name="sell" size="16px" />
                  <span>Tags cadastradas</span>
                </div>

                <div v-if="model.tags.length" class="tag-list-content">
                  <q-chip
                    v-for="tag in model.tags"
                    :key="tag"
                    removable
                    dense
                    class="tag-chip"
                    @remove="removeTag(tag)"
                  >
                    {{ tag }}
                  </q-chip>
                </div>

                <div v-else class="tag-list-empty">
                  Nenhuma tag cadastrada ainda.
                </div>
              </div>
              </div>
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
                v-model="model.active"
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
            v-if="model.id && !isCategoryWithChildren"
            @click="onDelete(model.id as string)"
          >
            <q-tooltip>Excluir</q-tooltip>
          </q-btn>

        </q-card-actions>
      </q-card>
    </q-dialog>

    <confirm-delete-dialog
      v-model="deleteDialog"
      :loading="deleting"
      title="Excluir categoria"
      message="Tem certeza que deseja excluir esta categoria?"
      description="Todas as informações vinculadas a este registro poderão ser afetadas."
      confirm-label="Excluir"
      @confirm="confirmDelete"
    />
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { QTableColumn } from 'quasar'
import { CategoryForm, CategoryItem } from '../models/category.model'
import { categoryService } from '../services/category.service'
import { SharedRules } from '@/shared/domain/validation/form-rules'
import { CategoryMapper } from '../mappers/category.mapper'
import { notify } from '@/shared/utils/notify.utils'
import MoneyInput from '@/shared/components/MoneyInput/MoneyInput.vue'
import ConfirmDeleteDialog from '@/shared/components/ConfirmDeleteDialog/ConfirmDeleteDialog.vue'
import { FinancialType } from '@/shared/domain/types/FinancialType'

const financialType = ref<FinancialType>('expense');
const deleteDialog = ref(false);
const deleting = ref(false);
const selectedDeleteId = ref<string | null>(null);

const { required } = SharedRules;
const saving = ref(false);
const form = ref();
const filter = ref('')
const formDialog = ref(false)
const expanded = ref<string[]>(['1', '2'])
const selectedCategory = ref<CategoryItem | null>(null)
const tagOptions = ref<string[]>([])
const tagInput = ref('');

const rows = ref<CategoryItem[]>([])

const model = ref<CategoryForm>({
  id: null,
  parentId: null,
  type: 'category',
  financialType: financialType.value,
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
  return rows.value.filter((item) => item.type === 'category' && item.financialType === financialType.value)
})

const parentCategory = computed(() => {
  if (!model.value.parentId) return null

  return rows.value.find((item) => item.id === model.value.parentId) || null
})

const isCategoryWithChildren = computed(() => {
  if (model.value.type !== 'category' || !model.value.id) return false

  return getChildren(model.value.id).length > 0
})

const budgetHint = computed(() => {
  if (isCategoryWithChildren.value) {
    return 'Categoria com subcategorias usa previsão calculada pela soma das subcategorias'
  }

  return 'Informe a previsão quando a categoria não possuir subcategorias'
})

const totalBudget = computed(() => {
  return categoryRows.value.reduce((total, category) => {
    return total + getCategoryBudget(category)
  }, 0)
})

const formTitle = computed(() => {
  if (!model.value.id) {
    return model.value.type === 'category'
      ? 'Nova categoria'
      : 'Nova subcategoria'
  }

  return model.value.type === 'category'
    ? 'Editar categoria'
    : 'Editar subcategoria'
})

const formSubtitle = computed(() => {
  if (model.value.type === 'category') {
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
  return rows.value.filter((item) => item.type === 'subcategory' && item.parentId === parentId && item.financialType === financialType.value)
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
  tagInput.value = '';

  model.value = {
    id: null,
    parentId: null,
    type: 'category',
    financialType: financialType.value,
    name: '',
    forecast: 0,
    active: true,
    tags: [],
  }

  formDialog.value = true
}

function newSubcategory() {
  tagOptions.value = [];

  if (!selectedCategory.value) {
    notify.warning('Selecione uma categoria para criar uma subcategoria')
    return
  }

  model.value = {
    id: null,
    parentId: selectedCategory.value.id,
    type: 'subcategory',
    financialType: financialType.value,
    name: '',
    forecast: 0,
    active: true,
    tags: [],
  }

  formDialog.value = true
}

function editRow(row: CategoryItem) {
  tagInput.value = '';

  if (row.type === 'category') {
    selectedCategory.value = row
    tagOptions.value = [...row.tags]
  } else {
    selectedCategory.value = rows.value.find((item) => item.id === row.parentId) || null
    tagOptions.value = []
  }

  model.value = {
    id: row.id,
    parentId: row.parentId,
    type: row.type,
    financialType: row.financialType,
    name: row.name,
    forecast: row.forecast,
    active: row.active,
    tags: [...row.tags],
  }

  formDialog.value = true
}

async function onSubmit() {
  const valid = await form.value.validate(true);
  if (!valid) return

  saving.value = true;

  try {
    // Formata o campo decimal
    model.value.forecast = Number(model.value.forecast)

    // Insert
    if (!model.value.id) {
      // Verifica se é categoria ou subcategoria
      if (model.value.type === 'category') {
        await categoryService.create(CategoryMapper.toCreate(model.value));
      } else {
        await categoryService.createSubCategory(CategoryMapper.toCreate(model.value));
      }
    // Update
    } else {
      await categoryService.update(model.value.id, CategoryMapper.toUpdate(model.value));
    }

    notify.success('Categoria criada com sucesso');

    // Atualiza a lista
    loadCategories();

  } finally {
    saving.value = false;
    formDialog.value = false;
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
    await categoryService.delete(selectedDeleteId.value);

    await loadCategories();

    formDialog.value = false;
    deleteDialog.value = false;
    selectedDeleteId.value = null;

  } finally {
    deleting.value = false;
  }
}

function normalizeTag(value: string) {
  return value.trim().toLowerCase()
}

function addTag() {
  const normalized = normalizeTag(tagInput.value)

  if (!normalized) return

  if (!model.value.tags.includes(normalized)) {
    model.value.tags = [...model.value.tags, normalized]
  }

  if (!tagOptions.value.includes(normalized)) {
    tagOptions.value = [...tagOptions.value, normalized]
  }

  tagInput.value = ''
}

function removeTag(tag: string) {
  model.value.tags = model.value.tags.filter((item) => item !== tag)
}

onMounted(() => {
  loadCategories();
});

</script>

<style lang="scss" scoped>
@import "src/css/list-page.scss";
@import "src/css/dialog.scss";
@import "src/css/tag.scss";

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

.total-row {
  background: #f8fafc;
  font-weight: 700;
}

.subcategory-tag-info {
  background: #f8fafc;
  color: #334155;
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
</style>
