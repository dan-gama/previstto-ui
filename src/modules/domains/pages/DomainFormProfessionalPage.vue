<template>
  <q-page class="domain-page q-pa-md">
    <!-- Header -->
    <div class="page-header q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold">
          {{ isEditMode ? 'Editar domínio' : 'Novo domínio' }}
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
        :to="{ name: 'domain-list' }"
      />
    </div>

    <!-- Form Card -->
    <q-card flat bordered class="form-card">
      <q-card-section class="form-header">
        <div class="form-title">
          Dados do domínio
        </div>

        <div class="form-subtitle">
          Campos básicos do cadastro
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="form-body">
        <q-form
          @submit="onSubmit"
          class="row q-col-gutter-lg"
        >
          <div class="col-12 col-md-4">
            <q-select
              v-model="form.type"
              outlined
              label="Tipo"
              :options="domainTypes"
              emit-value
              map-options
              :rules="[required]"
              class="app-field"
            />
          </div>

          <div class="col-12 col-md-8">
            <q-input
              v-model="form.name"
              outlined
              label="Nome"
              :rules="[required]"
              class="app-field"
            />
          </div>

          <div class="col-12">
            <q-input
              v-model="form.description"
              outlined
              autogrow
              type="textarea"
              label="Descrição"
              class="app-field"
            />
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

      <!-- Footer Actions -->
      <q-card-actions align="right" class="form-footer">
        <q-btn
          flat
          no-caps
          label="Cancelar"
          :to="{ name: 'domain-list' }"
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
      </q-card-actions>
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
  { label: 'Bandeira', value: 'CARD_BRAND' },
]

const isEditMode = computed(() => !!route.params.id)

function required(value: string) {
  return !!value || 'Campo obrigatório'
}

async function loadDomain() {
  if (!route.params.id) return

  const domain = await domainService.findById(
    String(route.params.id)
  )

  if (!domain) {
    Notify.create({
      type: 'negative',
      message: 'Registro não encontrado',
    })

    router.push({
      name: 'domain-list',
    })

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
      await domainService.update(
        String(route.params.id),
        form.value
      )

      Notify.create({
        type: 'positive',
        message: 'Registro atualizado',
      })
    } else {
      await domainService.create(
        form.value
      )

      Notify.create({
        type: 'positive',
        message: 'Registro criado',
      })
    }

    router.push({
      name: 'domain-list',
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

<style scoped>
.domain-page {
  background: #f8fafc;
  min-height: 100%;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap:16px;
  flex-wrap: wrap;
}

.back-btn {
  border-radius: 12px;
}

.form-card {
  width: "100%";
  border-radius: 20px;
  background: #fff;
  border: 1px solid #e9eef5;
  box-shadow: 0 10px 30px rgba(15,23,42,.05);
  overflow: hidden;
}

.form-header {
  padding: 22px;
}

.form-title {
  font-size:16px;
  font-weight:700;
  color:#1f2937;
}

.form-subtitle {
  font-size:13px;
  color:#6b7280;
  margin-top:4px;
}

.form-body {
  padding: 32px;
}

.form-footer {
  padding: 18px 22px;
}

.save-btn {
  border-radius: 12px;
  padding-left: 18px;
  padding-right:18px;
}

:deep(.app-field .q-field__control) {
  border-radius: 12px;
}

@media (max-width:768px) {
  .form-body {
    padding:20px;
  }
}
</style>
