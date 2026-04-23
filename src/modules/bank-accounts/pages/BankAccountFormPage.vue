<template>
  <q-page class="domain-page q-pa-md">
    <!-- Header -->
    <div class="page-header q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold">
          {{ isEditMode ? 'Editar conta bancária' : 'Nova conta bancária' }}
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
        :to="{ name: 'bank-accounts-list' }"
      />
    </div>

    <!-- Form Card -->
    <q-card flat bordered class="form-card">
      <q-card-section class="form-header">
        <div class="form-title">
          Dados da conta bancária
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
          <div class="col-12 col-md-12">
            <q-input
              v-model="form.name"
              outlined
              label="Nome"
              :rules="[required()]"
              class="app-field"
            />
          </div>

          <div class="col-12 col-md-4">
            <q-select
              outlined
              emit-value
              map-options
              clearable
              use-input
              input-debounce="300"
              v-model="form.bank"
              label="Banco"
              class="app-field"
              :options="bankOptions"
              :rules="[required('Informe o banco')]"
              @filter="(val, update) => filterFn(val, update, bankOptionsOriginal, (v) => bankOptions = v)"
            />
          </div>

          <div class="col-12 col-md-4">
            <q-select
              outlined
              emit-value
              map-options
              clearable
              use-input
              input-debounce="300"
              v-model="form.accountType"
              label="Tipo de conta"
              class="app-field"
              :options="accountTypeOptions"
              :rules="[required('Informe o tipo de conta')]"
              @filter="(val, update) => filterFn(val, update, accountTypeOptionsOriginal, (v) => accountTypeOptions = v)"
            />
          </div>

          <div class="col-12 col-md-4">
            <q-input
              v-model.lazy="form.balance"
              outlined
              label="Saldo atual"
              :rules="[required()]"
              class="app-field"
              v-money
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
          :to="{ name: 'bank-accounts-list' }"
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
import { bankAccountService } from '../services/bank-account.service'
import { BankAccountForm } from '../models/bank-account-form'
import { SharedRules } from '@/shared/domain/validation/form-rules'
import { SelectOptions } from '@/shared/dtos/select-options'
import { useSelectFilter } from '@/shared/utils/filter-select'

const { filterFn } = useSelectFilter();
const { required } = SharedRules;

const loading = ref<boolean>(false);
const route = useRoute()
const router = useRouter()

const saving = ref(false)

const form = ref<BankAccountForm>({
  name: null,
  bank: null,
  accountType: null,
  active: true,
  balance: 0,
});

const isEditMode = computed(() => !!route.params.id)

const bankOptions = ref<SelectOptions[]>([]);
const bankOptionsOriginal = ref<SelectOptions[]>([]);
const accountTypeOptions = ref<SelectOptions[]>([]);
const accountTypeOptionsOriginal = ref<SelectOptions[]>([]);

async function loadDomains() {
  loading.value = true;

  try {
    const [banks, accountTypes] = await Promise.all([
      bankAccountService.getBanks(),
      bankAccountService.getAccountTypes(),
    ])

    bankOptionsOriginal.value = banks;
    bankOptions.value = banks;

    accountTypeOptionsOriginal.value = accountTypes;
    accountTypeOptions.value = accountTypes;
  } finally {
    loading.value = false;
  }
}

async function loadDomain() {
  if (!route.params.id) return

  // const domain = await domainService.findById(
  //   String(route.params.id)
  // )

  // if (!domain) {
  //   Notify.create({
  //     type: 'negative',
  //     message: 'Registro não encontrado',
  //   })

  //   router.push({
  //     name: 'domain-list',
  //   })

  //   return
  // }

  // form.value = {
  //   type: domain.type,
  //   name: domain.name,
  //   description: domain.description,
  //   active: domain.active,
  // }
}

async function onSubmit() {
  saving.value = true

  try {
    if (isEditMode.value) {
      // await domainService.update(
      //   String(route.params.id),
      //   form.value
      // )

      // Notify.create({
      //   type: 'positive',
      //   message: 'Registro atualizado',
      // })
    } else {
      await bankAccountService.create(
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
  loadDomains();
  if (isEditMode.value) {
    loadDomain()
  }
})
</script>

<style lang="scss" scoped>
@import "src/css/form-page.scss";
</style>
