<template>
  <q-page class="domain-page q-pa-md">
    <!-- Header -->
    <div class="page-header q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold">
          {{ isEditMode ? 'Editar pessoa' : 'Nova pessoa' }}
        </div>

        <div class="text-subtitle2 text-grey-7">
          Preencha as informações do cadastro
        </div>
      </div>

      <q-btn
        flat
        no-caps
        icon="arrow_back"
        label="Voltar"
        color="primary"
        class="back-btn"
        :to="{ name: 'person-list' }"
      />
    </div>

    <!-- Form Card -->
    <q-card flat bordered class="form-card">
      <q-card-section class="form-header">
        <div class="form-title">
          Dados da pessoa
        </div>

        <div class="form-subtitle">
          Campos básicos do cadastro
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="form-body">
        <q-form @submit.prevent="onSubmit" class="row q-col-gutter-lg" ref="form" greedy>
          <div class="col-12 col-md-6">
            <q-input
              v-model="model.name"
              outlined
              label="Nome"
              :rules="[required()]"
              class="app-field"
            />
          </div>

          <div class="col-12 col-md-6">
            <q-input
              v-model="model.nickName"
              outlined
              label="Apelido"
              class="app-field"
            />
          </div>

          <div class="col-12 col-md-12">
            <q-input
              v-model="model.description"
              outlined
              label="Descrição"
              class="app-field"
            />
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

      <!-- Footer Actions -->
      <q-card-actions align="right" class="form-footer">
        <q-btn
          flat
          no-caps
          label="Cancelar"
          :to="{ name: 'person-list' }"
        />

        <q-btn
          color="primary"
          no-caps
          unelevated
          :loading="saving"
          :label="isEditMode ? 'Atualizar' : 'Salvar'"
          @click="onSubmit"
          class="save-btn"
        />

        <q-btn
          flat
          round
          dense
          icon="delete"
          color="negative"
          class="action-btn"
          v-if="isEditMode"
          @click="onDelete(route.params.id as string)"
        >
          <q-tooltip>Excluir</q-tooltip>
        </q-btn>
      </q-card-actions>
    </q-card>

    <confirm-delete-dialog
      v-model="deleteDialog"
      :loading="deleting"
      title="Excluir pessoa"
      message="Tem certeza que deseja excluir esta pessoa?"
      description="Todas as informações vinculadas a este registro poderão ser afetadas."
      confirm-label="Excluir"
      @confirm="confirmDelete"
    />
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { SharedRules } from '@/shared/domain/validation/form-rules'
import { notify } from '@/shared/utils/notify.utils'
import { PersonForm } from '../models/person.model'
import { personService } from '../services/person.service'
import { PersonMapper } from '../mappers/person.mapper'
import ConfirmDeleteDialog from '@/shared/components/ConfirmDeleteDialog/ConfirmDeleteDialog.vue'

const { required } = SharedRules;

const deleteDialog = ref(false);
const deleting = ref(false);
const selectedDeleteId = ref<string | null>(null);

const route = useRoute()
const router = useRouter()

const saving = ref(false)

const form = ref();
const model = ref<PersonForm>({
  name: '',
  nickName: null,
  description: null,
  active: true,
});

const isEditMode = computed(() => !!route.params.id)

async function loadPerson() {
  if (!route.params.id) return

  const person = await personService.findById(String(route.params.id))

  if (!person) {
    notify.error('Pessoa não encontrada')

    router.push({
      name: 'person-list',
    })

    return
  }

  model.value = {
    name: person.name,
    nickName: person.nickName,
    description: person.description,
    active: person.active,
  }
}

async function onSubmit() {

  /* Verifica se os dados estão válidos */
  const valid = await form.value.validate(true);
  if (!valid) return

  saving.value = true

  try {
    if (isEditMode.value) {
      await personService.update(String(route.params.id), PersonMapper.toUpdate(model.value));
      notify.success('Pessoa atualizada')
    } else {
      await personService.create(PersonMapper.toCreate(model.value));
      notify.success('Pessoa criada com sucesso');
    }

    router.push({
      name: 'person-list',
    })
  } finally { saving.value = false }
}

async function onDelete(id: string) {
  selectedDeleteId.value = id;
  deleteDialog.value = true;
}

async function confirmDelete() {
  if (!selectedDeleteId.value) return;

  deleting.value = true;

  try {
    await personService.delete(selectedDeleteId.value);

    deleteDialog.value = false;
    selectedDeleteId.value = null;

    notify.success('Pessoa excluída com sucesso');

    router.push({
      name: 'person-list',
    })

  } finally {
    deleting.value = false;
  }
}

onMounted(() => {
  if (isEditMode.value) {
    loadPerson();
  }
})
</script>

<style lang="scss" scoped>
@import "src/css/form-page.scss";
</style>
