<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-col-gutter-md q-mb-md">
      <div class="col">
        <div class="text-h5">
          {{ isEditMode ? 'Editar domínio' : 'Novo domínio' }}
        </div>
        <div class="text-subtitle2 text-grey-7">
          Preencha os dados do domínio
        </div>
      </div>

      <div class="col-auto">
        <q-btn
          flat
          color="primary"
          icon="arrow_back"
          label="Voltar"
          :to="{ name: 'domain-list' }"
        />
      </div>
    </div>

    <q-card flat bordered>
      <q-card-section>
        <q-form @submit="onSubmit" class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-select
              v-model="form.type"
              outlined
              label="Tipo"
              :options="domainTypes"
              emit-value
              map-options
              :rules="[required]"
            />
          </div>

          <div class="col-12 col-md-8">
            <q-input
              v-model="form.name"
              outlined
              label="Nome"
              :rules="[required]"
            />
          </div>

          <div class="col-12">
            <q-input
              v-model="form.description"
              outlined
              type="textarea"
              label="Descrição"
              autogrow
            />
          </div>

          <div class="col-12">
            <q-toggle
              v-model="form.active"
              label="Ativo"
            />
          </div>

          <div class="col-12">
            <div class="row justify-end q-gutter-sm">
              <q-btn
                flat
                label="Cancelar"
                :to="{ name: 'domain-list' }"
              />
              <q-btn
                color="primary"
                type="submit"
                :label="isEditMode ? 'Atualizar' : 'Salvar'"
                :loading="saving"
              />
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Notify } from 'quasar'
import { domainService } from '../services/domain.service'

const route = useRoute()
const router = useRouter()

const saving = ref(false)

const form = ref({
  type: '',
  name: '',
  description: '',
  active: true,
})

const domainTypes = [
  { label: 'Categoria', value: 'CATEGORY' },
  { label: 'Banco', value: 'BANK' },
  { label: 'Cartão de Crédito', value: 'CREDIT_CARD' },
  { label: 'Bandeira do Cartão', value: 'CARD_BRAND' },
]

const isEditMode = computed(() => !!route.params.id)

function required(value: string) {
  return !!value || 'Campo obrigatório'
}

async function loadDomain() {
  const id = String(route.params.id)

  if (!id) {
    return
  }

  const domain = await domainService.findById(id)

  if (!domain) {
    Notify.create({
      type: 'negative',
      message: 'Registro não encontrado.',
    })
    await router.push({ name: 'domain-list' })
    return
  }

  form.value = {
    type: domain.type,
    name: domain.name,
    description: domain.description,
    active: domain.active,
  }
}

async function onSubmit() {
  saving.value = true

  try {
    if (isEditMode.value) {
      await domainService.update(String(route.params.id), form.value)

      Notify.create({
        type: 'positive',
        message: 'Registro atualizado com sucesso.',
      })
    } else {
      await domainService.create(form.value)

      Notify.create({
        type: 'positive',
        message: 'Registro criado com sucesso.',
      })
    }

    await router.push({ name: 'domain-list' })
  } catch {
    Notify.create({
      type: 'negative',
      message: 'Erro ao salvar registro.',
    })
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  if (isEditMode.value) {
    loadDomain()
  }
})
</script>
