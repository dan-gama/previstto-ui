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
        <q-form @submit.prevent="onSubmit" class="row q-col-gutter-lg" ref="form" greedy>
          <div class="col-12 col-md-12">
            <q-input
              v-model="model.name"
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
              :disable="isEditMode"
              input-debounce="300"
              v-model="model.bank"
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
              v-model="model.accountType"
              label="Tipo de conta"
              class="app-field"
              :options="accountTypeOptions"
              :rules="[required('Informe o tipo de conta')]"
              @filter="(val, update) => filterFn(val, update, accountTypeOptionsOriginal, (v) => accountTypeOptions = v)"
            />
          </div>

          <div class="col-12 col-md-4">
            <q-input
              outlined
              v-money
              :disable="isEditMode"
              v-model.lazy="model.balance"
              label="Saldo atual"
              :rules="[required()]"
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
import { bankAccountService } from '../services/bank-account.service'
import { domainService } from '@/modules/domains/services/domain.service'
import { BankAccountForm } from '../models/bank-account.model'
import { SharedRules } from '@/shared/domain/validation/form-rules'
import { SelectOptions } from '@/shared/dtos/select-options'
import { useSelectFilter } from '@/shared/utils/filter-select'
import { notify } from '@/shared/utils/notify.utils'
import { BankAccountMapper } from '../mappers/bank-account.mapper'

const { filterFn } = useSelectFilter();
const { required } = SharedRules;

const loading = ref<boolean>(false);
const route = useRoute()
const router = useRouter()

const saving = ref(false)

const form = ref();
const model = ref<BankAccountForm>({
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
      domainService.getBanks(),
      domainService.getAccountTypes(),
    ])

    bankOptionsOriginal.value = banks;
    bankOptions.value = banks;

    accountTypeOptionsOriginal.value = accountTypes;
    accountTypeOptions.value = accountTypes;
  } finally {
    loading.value = false;
  }
}

async function loadBankAccount() {
  if (!route.params.id) return

  const accountBank = await bankAccountService.findById(String(route.params.id))

  if (!accountBank) {
    notify.error('Conta bancária não encontrada')

    router.push({
      name: 'bank-accounts-list',
    })

    return
  }

  model.value = {
    accountType: accountBank.accountType,
    bank: accountBank.bank,
    name: accountBank.name,
    balance: accountBank.balance,
    active: accountBank.active,
  }

}

async function onSubmit() {

  /* Verifica se os dados estão válidos */
  const valid = await form.value.validate(true);
  if (!valid) return

  saving.value = true

  try {
    if (isEditMode.value) {
      await bankAccountService.update(String(route.params.id), BankAccountMapper.toUpdate(model.value));
      notify.success('Conta bancária atualizada')
    } else {
      await bankAccountService.create(BankAccountMapper.toCreate(model.value));
      notify.success('Conta bancária criada com sucesso');
    }

    router.push({
      name: 'bank-accounts-list',
    })
  } finally { saving.value = false }
}

onMounted(() => {
  loadDomains();
  if (isEditMode.value) {
    loadBankAccount();
  }
})
</script>

<style lang="scss" scoped>
@import "src/css/form-page.scss";
</style>
