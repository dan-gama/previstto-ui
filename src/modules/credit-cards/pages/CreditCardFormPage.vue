<template>
  <q-page class="domain-page q-pa-md">
    <!-- Header -->
    <div class="page-header q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold">
          {{ isEditMode ? 'Editar cartão de crédito' : 'Novo cartão de crédito' }}
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
        :to="{ name: 'credit-card-list' }"
      />
    </div>

    <!-- Form Card -->
    <q-card flat bordered class="form-card">
      <q-card-section class="form-header">
        <div class="form-title">
          Dados do cartão de crédito
        </div>

        <div class="form-subtitle">
          Campos básicos do cadastro
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="form-body">
        <q-form @submit.prevent="onSubmit" class="row q-col-gutter-lg" ref="form" greedy>
          <div class="col-12 col-md-4">
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
              input-debounce="300"
              v-model="model.brand"
              label="Bandeira"
              class="app-field"
              :options="creditCardBrandOptions"
              :rules="[required()]"
              @filter="(val, update) => filterFn(val, update, creditCardBrandOptionsOriginal, (v) => creditCardBrandOptions = v)"
            />
          </div>

          <div class="col-12 col-md-4">
            <q-input
              outlined
              unmasked-value
              mask="####"
              v-model.number="model.digits"
              maxlength="4"
              label="4 últimos dígitos"
              :rules="[required(), exactLength(4, 'Esse campo deve conter 4 números')]"
              class="app-field no-spinner"
            />
          </div>

          <div class="col-12 col-md-4">
            <money-input
              v-model="model.limit"
              label="Limite (R$)"
              class="app-field"
              :rules="[decimalGreaterThanZero()]"
            />
          </div>

          <!-- <div class="col-12 col-md-4">
            <q-field
              outlined
              stack-label
              label="Limite (R$)"
              v-model="model.limit"
              class="app-field"

            >
              <template v-slot:control>
                <money3
                  v-model="model.limit"
                  v-bind="moneyConfig"
                  @focus="$event.target.select()"
                  class="q-field__input text-right"
                  style="border: none; outline: none; background: transparent; width: 100%; color: inherit;"
                >
                </money3>
              </template>
            </q-field>
          </div> -->

          <div class="col-12 col-md-4">
            <q-select
              outlined
              emit-value
              map-options
              clearable
              use-input
              input-debounce="300"
              v-model="model.bank"
              label="Banco"
              class="app-field"
              :options="bankOptions"
              @filter="(val, update) => filterFn(val, update, bankOptionsOriginal, (v) => bankOptions = v)"
            />
          </div>

          <div class="col-12 col-md-4">
            <q-input
              v-model="model.description"
              outlined
              label="Observação"
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
          :to="{ name: 'credit-card-list' }"
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
import { domainService } from '@/modules/domains/services/domain.service'
import { SharedRules } from '@/shared/domain/validation/form-rules'
import { SelectOptions } from '@/shared/dtos/select-options'
import { useSelectFilter } from '@/shared/utils/filter-select'
import { notify } from '@/shared/utils/notify.utils'
import { CreditCardForm } from '../models/credit-card.model'
import { creditCardService } from '../services/credit-card-service'
import { Money3Component as money3 } from 'v-money3'
import { CreditCardMapper } from '../mappers/credit-card.mapper'
import MoneyInput from '@/shared/components/MoneyInput/MoneyInput.vue'

const { filterFn } = useSelectFilter();
const { decimalGreaterThanZero, required, exactLength } = SharedRules;

const loading = ref<boolean>(false);
const route = useRoute()
const router = useRouter()

const saving = ref(false)

const moneyConfig = {
  decimal: ',',
  thousands: '.',
  precision: 2,
  masked: false,
}

const form = ref();
const model = ref<CreditCardForm>({
  name: null,
  brand: null,
  bank: null,
  digits: null,
  limit: 0,
  description: null,
  active: true,
});

const isEditMode = computed(() => !!route.params.id)

const creditCardBrandOptionsOriginal = ref<SelectOptions[]>([]);
const creditCardBrandOptions = ref<SelectOptions[]>([]);
const bankOptions = ref<SelectOptions[]>([]);
const bankOptionsOriginal = ref<SelectOptions[]>([]);

async function loadDomains() {
  loading.value = true;

  try {
    const [creditCardBrands, banks] = await Promise.all([
      domainService.getCreditCardBrands(),
      domainService.getBanks()
    ])

    bankOptionsOriginal.value = banks;
    bankOptions.value = banks;

    creditCardBrandOptionsOriginal.value = creditCardBrands
    creditCardBrandOptions.value = creditCardBrands

  } finally {
    loading.value = false;
  }
}

async function loadCreditCard() {
  if (!route.params.id) return

  const creditCard = await creditCardService.findById(String(route.params.id));

  if (!creditCard) {
    notify.error('Cartão de crédito não encontrado')

    router.push({
      name: 'credit-card-list',
    })

    return
  }

  model.value = {
    name: creditCard.name,
    brand: creditCard.brand,
    bank: creditCard.bank,
    digits: creditCard.digits,
    limit: creditCard.limit,
    description: creditCard.description,
    active: creditCard.active
  }
}

async function onSubmit() {

  /* Verifica se os dados estão válidos */
  console.log(model.value.limit);

  const valid = await form.value.validate(true);
  if (!valid) return

  saving.value = true

  try {

    console.log('limit-before', model.value.limit);

    model.value.limit = Number(model.value.limit);

    // model.value.limit = decimalToNumber(model.value.limit);

    // console.log('limit-after', model.value.limit);


    if (isEditMode.value) {
      await creditCardService.update(String(route.params.id), CreditCardMapper.toUpdate(model.value));
      notify.success('Cartão de crédito atualizado')
    } else {
      await creditCardService.create(CreditCardMapper.toCreate(model.value));
      notify.success('Cartão de crédito criado com sucesso');
    }

    router.push({
      name: 'credit-card-list',
    })
  } finally { saving.value = false }
}

onMounted(() => {
  loadDomains();
  if (isEditMode.value) {
    loadCreditCard();
  }
})
</script>

<style lang="scss" scoped>
@import "src/css/form-page.scss";
</style>
