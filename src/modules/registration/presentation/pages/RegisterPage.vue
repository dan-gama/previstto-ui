<template>
  <q-page class="register-page">

    <div class="register-viewport">
      <!-- LADO ESQUERDO -->
      <section class="register-left">

        <div class="register-left-box">
          <!-- botão voltar -->
            <div class="register-back">
              <q-btn
                flat
                no-caps
                icon="chevron_left"
                label="Página inicial"
                class="back-home-btn"
                :to="{ name: 'Home' }"
              />
            </div>
        </div>
      </section>

      <!-- LADO DIREITO -->
      <section class="register-right">
        <div class="register-form-wrapper">
          <q-stepper
            flat
            animated
            header-nav
            v-model="step"
            color="primary"
            class="register-stepper"
          >
            <q-step
              :name="1"
              title="Perfil"
              caption="Configuração do perfil de sua conta"
              icon="edit"
              :done="step > 1"
            >
              <div class="q-mb-lg">
                <div class="text-h4 text-weight-medium">Perfil</div>
                <div class="text-subtitle1 text-grey-7">
                  Vamos iniciar configurando o seu perfil.
                </div>
              </div>
              <q-form ref="formStep1" @submit.prevent="nextStep" greedy>
                <div class="row q-col-gutter-lg">
                  <div class="col-12 col-md-6">
                    <q-select
                      outlined
                      map-options
                      clearable
                      label="Perfil"
                      hint="Qual perfil combina mais com você?"
                      v-model="formModel.profileType"
                      :options="PROFILE"
                      @update:model-value="toggleProfile"
                      :rules="[required('Informe o seu perfil')]"
                      />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-input
                      outlined
                      v-model="formModel.name"
                      label="Nome do perfil"
                      hint="Escolha um nome para o seu perfil."
                      :rules="[required('Informe seu nome')]"
                      >
                    </q-input>
                  </div>
                  <div class="col-12 col-md-12">
                    <div>
                      <q-tabs
                        v-model="tabPerfil"
                        align="justify"
                        narrow-indicator
                        class="q-mb-lg"
                      >
                        <q-tab class="text-purple" name="perfilA" :label="participantsLabel[0].label" v-if="participantsLabel[0].visible" />
                        <q-tab class="text-orange" name="perfilB" :label="participantsLabel[1].label" v-if="participantsLabel[1].visible" />
                      </q-tabs>
                      <div class="q-gutter-y-sm">
                        <q-tab-panels
                          v-model="tabPerfil"
                          animated
                          transition-prev="scale"
                          transition-next="scale"
                          class="bg-purple text-white text-center"
                        >
                          <q-tab-panel name="perfilA" class="q-pa-sm" v-if="participantsLabel[0].visible">
                            <q-card flat bordered>
                              <q-card-section>
                                <div class="row q-col-gutter-md q-pb-md">
                                  <div class="col-12 col-md-5">
                                    <q-input
                                      outlined
                                      v-model="formModel.participants[0].name"
                                      label="Nome"
                                      hint="Se preferir, informe um nome fictício para manter anonimato."
                                      :rules="[required('Informe seu nome')]"
                                      >
                                    </q-input>
                                  </div>
                                  <div class="col-12 col-md-3">
                                    <q-select
                                      outlined
                                      emit-value
                                      map-options
                                      clearable
                                      label="Orientação sexual"
                                      v-model="formModel.participants[0].genre"
                                      :options="PROFILE_GENRE"
                                      :rules="[required('Informe o seu gênero')]"
                                      />
                                  </div>
                                  <div class="col-12 col-md-4">
                                    <q-input
                                      outlined
                                      clearable
                                      hint="Obrigatório ser maior de 18 anos."
                                      label="Data de nascimento"
                                      v-model="formModel.participants[0].birthDate"
                                      mask="##/##/####"
                                      :rules="[
                                        required('Informe sua data de nascimento'),
                                        dateIfNotEmpty(),
                                        ageMin(18, 'É obrigatório ser maior que 18 anos.')
                                      ]">
                                      <template v-slot:append>
                                        <q-icon name="event" class="cursor-pointer">
                                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                            <q-date v-model="formModel.participants[0].birthDate" mask="DD/MM/YYYY">
                                              <div class="row items-center justify-end">
                                                <q-btn v-close-popup label="Close" color="primary" flat />
                                              </div>
                                            </q-date>
                                          </q-popup-proxy>
                                        </q-icon>
                                      </template>
                                    </q-input>
                                  </div>
                                  <div class="col-12 col-md-6">
                                    <q-select
                                      outlined
                                      emit-value
                                      map-options
                                      clearable
                                      hint="Informação opcional: se preferir, informe seu tipo físico."
                                      label="Tipo físico"
                                      v-model="formModel.participants[0].bodyType"
                                      :options="BODY_TYPE"
                                      />
                                  </div>
                                  <div class="col-12 col-md-6">
                                    <q-select
                                      outlined
                                      emit-value
                                      map-options
                                      multiple
                                      use-chips
                                      hint="Você pratica algum papel. Dúvidas, vá em '?'"
                                      label="Papel"
                                      v-model="formModel.participants[0].role"
                                      :options="ROLES">
                                      <template v-slot:append>
                                        <InfoTooltip
                                          title="Papel"
                                          description="Papéis representam como cada pessoa prefere se posicionar nas dinâmicas. Lembrando que, todas as dinâmicas devem ser baseadas em consentimento, respeito e comunicação entre as partes.<br><br><b>Cuckold</b>: É o homem que sente prazer em ver ou saber que sua parceira se relaciona com outras pessoas. Normalmente, isso envolve confiança, cumplicidade e uma dinâmica onde ele pode participar de forma ativa, passiva ou apenas apreciar a situação.<br><br><b>Hotwife:</b> É a mulher que, dentro de um relacionamento, tem liberdade (geralmente com consentimento do parceiro) para se relacionar com outras pessoas. Ela costuma ser o centro da dinâmica, com foco na autonomia, desejo e experiências fora da relação principal.<br><br><b>Bull:</b> É o homem que participa da dinâmica com casais, principalmente em contextos como cuckold ou hotwife. Geralmente é alguém convidado para interagir com a mulher do casal, sempre com respeito, consentimento e alinhamento entre todos.<br><br><b>Dominador:</b> É a pessoa que gosta de assumir o controle durante as interações. Costuma conduzir a dinâmica, tomar decisões e liderar, sempre com base em consentimento, limites claros e respeito mútuo.<br><br><b>Submisso:</b> É quem sente prazer em ceder o controle ao outro dentro de uma dinâmica. Confia no dominador para conduzir a experiência, sempre com comunicação aberta e limites bem definidos."
                                          size="28px"
                                        />
                                      </template>
                                    </q-select>
                                  </div>
                                </div>
                              </q-card-section>
                            </q-card>
                          </q-tab-panel>
                          <q-tab-panel name="perfilB" class="q-pa-sm" v-if="participantsLabel[1].visible">
                            <q-card flat bordered>
                              <q-card-section>
                                <div class="row q-col-gutter-md q-pb-md">
                                  <div class="col-12 col-md-5">
                                    <q-input
                                      outlined
                                      v-model="formModel.participants[1].name"
                                      label="Nome"
                                      hint="Se preferir, informe um nome fictício para manter anonimato."
                                      :rules="[required('Informe seu nome')]"
                                      >
                                    </q-input>
                                  </div>
                                  <div class="col-12 col-md-3">
                                    <q-select
                                      outlined
                                      emit-value
                                      map-options
                                      clearable
                                      label="Orientação sexual"
                                      v-model="formModel.participants[1].genre"
                                      :options="PROFILE_GENRE"
                                      :rules="[required('Informe o seu gênero')]"
                                      />
                                  </div>
                                  <div class="col-12 col-md-4">
                                    <q-input
                                      outlined
                                      clearable
                                      hint="Obrigatório ser maior de 18 anos."
                                      label="Data de nascimento"
                                      v-model="formModel.participants[1].birthDate"
                                      mask="##/##/####"
                                      :rules="[
                                        required('Informe sua data de nascimento'),
                                        dateIfNotEmpty(),
                                        ageMin(18, 'É obrigatório ser maior que 18 anos.')
                                      ]">
                                      <template v-slot:append>
                                        <q-icon name="event" class="cursor-pointer">
                                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                            <q-date v-model="formModel.participants[0].birthDate" mask="DD/MM/YYYY">
                                              <div class="row items-center justify-end">
                                                <q-btn v-close-popup label="Close" color="primary" flat />
                                              </div>
                                            </q-date>
                                          </q-popup-proxy>
                                        </q-icon>
                                      </template>
                                    </q-input>
                                  </div>
                                  <div class="col-12 col-md-6">
                                    <q-select
                                      outlined
                                      emit-value
                                      map-options
                                      clearable
                                      hint="Informação opcional: se preferir, informe seu tipo físico."
                                      label="Tipo físico"
                                      v-model="formModel.participants[1].bodyType"
                                      :options="BODY_TYPE"
                                      />
                                  </div>
                                  <div class="col-12 col-md-6">
                                    <q-select
                                      outlined
                                      emit-value
                                      map-options
                                      multiple
                                      use-chips
                                      hint="Você pratica algum papel. Dúvidas, vá em '?'"
                                      label="Papel"
                                      v-model="formModel.participants[1].role"
                                      :options="ROLES"/>
                                  </div>
                                </div>
                              </q-card-section>
                            </q-card>
                          </q-tab-panel>

                        </q-tab-panels>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row justify-end q-mt-xl">
                  <q-btn
                    label="Next"
                    icon-right="arrow_forward"
                    color="primary"
                    unelevated
                    no-caps
                    @click="nextStep"
                  />
                </div>
              </q-form>
            </q-step>

            <q-step
              :name="2"
              title="Perfil e Localidade"
              caption="Nome de sua conta"
              icon="badge"
              :done="step > 2"
            >
              <q-form ref="formStep2" @submit.prevent="nextStep" greedy>
                <div class="row q-col-gutter-lg">
                  <div class="col-12 col-md-6">
                    <div class="q-mb-lg">
                      <div class="text-h4 text-weight-medium">Conta</div>
                      <div class="text-subtitle1 text-grey-7">
                        Escolha um nome para a sua conta
                      </div>
                    </div>
                    <q-input
                      v-model="formModel.profileName"
                      lazy-rules
                      debounce="500"
                      hint="Esse será o seu endereço no weblovers."
                      :rules="[required('Informe o nome de sua conta'), checkProfileExists]"
                      outlined>
                      <template v-slot:prepend>
                        <div class="url-prefix">
                          https://www.weblovers.com.br/
                        </div>
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-md-6">
                    <div class="q-mb-lg">
                      <div class="text-h4 text-weight-medium">Localidade</div>
                      <div class="text-subtitle1 text-grey-7">
                        Informe a sua cidade
                      </div>
                    </div>
                    <q-select
                      v-model="formModel.city"
                      outlined
                      use-input
                      fill-input
                      hide-selected
                      clearable
                      emit-value
                      map-options
                      hint="Informar sua cidade é muito importante para se relacionar com outros perfis."
                      input-debounce="300"
                      label="Cidade"
                      :options="filteredCities"
                      option-label="label"
                      option-value="value"
                      @filter="filterCities"
                      @update:model-value="onSelectCity"
                    >
                      <template #no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            {{ noOptionMessage }}
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>
                </div>
              </q-form>
              <div class="row justify-between q-mt-xl">
                <q-btn
                  label="Back"
                  icon="arrow_back"
                  flat
                  no-caps
                  color="primary"
                  @click="step = 1"
                />
                <q-btn
                  label="Next"
                  icon-right="arrow_forward"
                  color="primary"
                  unelevated
                  no-caps
                  @click="nextStep"
                />
              </div>
            </q-step>
            <q-step
              :name="3"
              title="Interesses e Desejos"
              caption="Aqui pega fogo!"
              icon="badge"
              :done="step > 3">
              <q-form ref="formStep3" @submit.prevent="nextStep" greedy>
                <div class="row q-col-gutter-lg">
                  <div class="col-12 col-md-12">
                    <div class="q-mb-lg">
                      <div class="text-h4 text-weight-medium">Interesses</div>
                      <div class="text-subtitle1 text-grey-7">
                        Quais são os seus interesses?
                      </div>
                    </div>
                    <div class="row q-col-gutter-md">
                      <div>
                        <q-tabs
                          v-model="tabPreferences"
                          align="justify"
                          narrow-indicator
                          class="q-mb-lg">
                          <q-tab class="text-purple" name="pref1" label="Interesses"/>
                          <q-tab class="text-purple" name="pref2" label="Dinâmicas"/>
                          <q-tab class="text-purple" name="pref3" label="Práticas"/>
                          <q-tab class="text-purple" name="pref4" label="Fantasias/Fetiches"/>
                        </q-tabs>
                        <div class="q-gutter-y-sm">
                          <q-tab-panels
                            v-model="tabPreferences"
                            animated
                            transition-prev="scale"
                            transition-next="scale"
                            class="bg-purple text-purple text-center">

                            /* Interesses */
                            <q-tab-panel name="pref1" class="q-pa-sm">
                              <q-card flat bordered>
                                <q-card-section>
                                  <div class="text-subtitle2">Texto explicativo</div>
                                </q-card-section>
                                <q-card-section class="q-py-none">
                                  <div class="row q-col-gutter-md q-pb-md">
                                    <div class="col-md-3"  v-for="options in INTEREST_OPTIONS" :key="options.key">
                                      <q-card class="interest-card">
                                        <q-img
                                          :src=options.image
                                          class="interest-card__image">
                                          <div class="absolute-bottom card-title-overlay">
                                            {{ options.label }}
                                          </div>
                                        </q-img>
                                        <q-card-actions class="q-pa-none">
                                          <q-toggle
                                            v-model=interests[options.key]
                                            checked-icon="check"
                                            color="green"
                                            unchecked-icon="clear"
                                            class="q-pa-none q-ma-none"/>
                                        </q-card-actions>
                                      </q-card>
                                    </div>
                                  </div>
                                </q-card-section>
                              </q-card>
                            </q-tab-panel>

                            /* Dinâmicas */
                            <q-tab-panel name="pref2" class="q-pa-sm">
                              <q-card flat bordered>
                                <q-card-section>
                                  <div class="text-subtitle2">Texto explicativo</div>
                                </q-card-section>
                                <q-card-section class="q-py-none">
                                  <div class="row q-col-gutter-md q-pb-md">
                                    <div class="col-12 col-md-4 check-options" v-for="item in DYNAMICS_OPTIONS" :key="item.key">
                                      <q-checkbox
                                        size="xs"
                                        v-model="dynamics[item.key]"
                                        :label=item.label
                                      />
                                      <InfoTooltip
                                        :title=item.label
                                        :description=item.description
                                      />
                                    </div>
                                  </div>
                                </q-card-section>
                              </q-card>
                            </q-tab-panel>

                            /* Práticas */
                            <q-tab-panel name="pref3" class="q-pa-sm">
                              <q-card flat bordered>
                                <q-card-section>
                                  <div class="text-subtitle2">Texto explicativo</div>
                                </q-card-section>
                                <q-card-section class="q-py-none">
                                  <div class="row q-col-gutter-md q-pb-md">
                                    <div class="col-12 col-md-4 check-options" v-for="item in PRACTICES_OPTIONS" :key="item.key">
                                      <q-checkbox
                                        size="xs"
                                        v-model="practices[item.key]"
                                        :label=item.label
                                      />
                                      <InfoTooltip
                                        :title=item.label
                                        :description=item.description
                                      />
                                    </div>
                                  </div>
                                </q-card-section>
                              </q-card>
                            </q-tab-panel>

                            /* Fantasias/Fetiches */
                            <q-tab-panel name="pref4" class="q-pa-sm">
                              <q-card flat bordered>
                                <q-card-section>
                                  <div class="text-subtitle2">Texto explicativo</div>
                                </q-card-section>
                                <q-card-section class="q-py-none">
                                  <div class="row q-col-gutter-md q-pb-md">
                                    <div class="col-12 col-md-4 check-options" v-for="item in FETISHES_OPTIONS" :key="item.key">
                                      <q-checkbox
                                        size="xs"
                                        v-model="fetishes[item.key]"
                                        :label=item.label
                                      />
                                      <InfoTooltip
                                        :title=item.label
                                        :description=item.description
                                      />
                                    </div>
                                  </div>
                                </q-card-section>
                              </q-card>
                            </q-tab-panel>
                          </q-tab-panels>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </q-form>
              <div class="row justify-between q-mt-xl">
                <q-btn
                  label="Back"
                  icon="arrow_back"
                  flat
                  no-caps
                  color="primary"
                  @click="step = 1"
                />
                <q-btn
                  label="Next"
                  icon-right="arrow_forward"
                  color="primary"
                  unelevated
                  no-caps
                  @click="nextStep"
                />
              </div>
            </q-step>
            <q-step
              :name="4"
              title="Autenticação"
              caption="Defina o seu login"
              icon="badge"
              :done="step > 4"
            >
              <div class="q-mb-lg">
                <div class="text-h4 text-weight-medium">Como você prefere acessar?</div>
                <div class="text-subtitle1 text-grey-7">
                  Cria sua conta rapidinho usando suas redes sociais ou, se preferir, use seu e-mail para um cadastro exclusivo.
                </div>
              </div>

              <div class="login-form-wrapper">
                <div class="social-login">
                <q-btn flat round icon="fab fa-facebook-f" class="social-btn facebook" size="sm" />
                <q-btn flat round icon="fab fa-google" class="social-btn google" size="sm" />
                <q-btn flat round icon="fab fa-x-twitter" class="social-btn twitter" size="sm" />
              </div>
              <div class="divider">
                <span>ou</span>
              </div>
                <q-form class="login-form">
                  <q-input
                    v-model="formModel.email"
                    label="Email"
                    outlined
                    dense/>

                  <q-input
                    v-model="formModel.password"
                    label="Senha"
                    :type="showPassword ? 'text' : 'password'"
                    outlined
                    dense>
                    <template #append>
                      <q-icon
                        :name="showPassword ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="showPassword = !showPassword"/>
                    </template>
                  </q-input>

                  <q-input
                    v-model="confirmPassword"
                    label="Confirme sua senha"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    outlined
                    dense>
                    <template #append>
                      <q-icon
                        :name="showConfirmPassword ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="showConfirmPassword = !showConfirmPassword"/>
                    </template>
                  </q-input>

                </q-form>
              </div>
              <div class="row justify-between q-mt-xl">
                <q-btn
                  label="Back"
                  icon="arrow_back"
                  flat
                  no-caps
                  color="primary"
                  @click="step = 1"
                />
                <q-btn
                  label="Finalizar"
                  icon-right="check"
                  color="primary"
                  unelevated
                  no-caps
                  @click="nextStep"
                />
              </div>
            </q-step>
          </q-stepper>
        </div>
      </section>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

/* Constants */
import { PROFILE } from '../../domain/constants/profiles'
import { PROFILE_GENRE } from '../../domain/constants/profile-genres'
import { BODY_TYPE } from '../../domain/constants/body-types'
import { ROLES } from '../../domain/constants/roles'
import { INTERESTS, INTEREST_OPTIONS } from '../../domain/constants/interests'
import { DYNAMICS, DYNAMICS_OPTIONS } from '../../domain/constants/dynamics'
import { PRACTICES, PRACTICES_OPTIONS } from '../../domain/constants/practices'
import { FETISHES, FETISHES_OPTIONS } from '../../domain/constants/fetishes'
import { RegisterService } from '../../infrastructure/services/registration.service'

/* Models */
import { RegisterFormModel } from '../models/register-form.model'
import { ProfileParticipantModel } from '../models/register-form-profile-participant.model'

/*  Validations && Utils */
import { SharedRules } from 'src/shared/domain/validation/form-rules'
import { normalizeText, right } from 'src/shared/utils/text.utils'

/* Mocks */
import { citiesMock, CityOption } from 'src/shared/mocks/cities.mock'

/*  Components */
import InfoTooltip from 'src/shared/components/InfoTooltip/InfoTooltip.vue'
import { notify } from 'src/shared/utils/notify.utils'

const { required, dateIfNotEmpty, ageMin } = SharedRules
const noOptionMessage = ref('Digite pelo menos 3 letras para buscar sua cidade...')

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const confirmPassword = ref('')
const interests = ref({...INTERESTS})
const dynamics = ref({...DYNAMICS})
const practices = ref({...PRACTICES})
const fetishes = ref({...FETISHES})
const tabPerfil = ref('perfilA');
const tabPreferences = ref('pref1')

const isValidatinProfile = ref(false);

const filteredCities = ref<CityOption[]>([])

const service = new RegisterService();

service.checkProfile('dannboy');

function filterCities(val: string, update: (callbackFn: () => void) => void): void {
  update(() => {
    const search = normalizeText(val)

    if (search.length < 3) {
      filteredCities.value = []
      noOptionMessage.value = 'Digite pelo menos 3 letras para buscar sua cidade...'
      return
    }

    const results = citiesMock.filter((item) =>
      normalizeText(item.label).includes(search)
    )

    filteredCities.value = results

    if (results.length === 0) {
      noOptionMessage.value = 'Nenhuma cidade encontrada'
    }
  })
}

function onSelectCity(selectedValue: string | null): void {
  const selectedCity = citiesMock.find(
    (item) => item.value === selectedValue
  )
}

const createDefaultParticipants = (): ProfileParticipantModel => ({
  name: null,
  genre: null,
  birthDate: null,
  bodyType: null,
  role: [],
});

const formModel = reactive<RegisterFormModel>({
  name: null,
  profileType: null,
  participants: [createDefaultParticipants(), createDefaultParticipants()],
  profileName: null,
  city: null,
  email: null,
  password : null,
})

const participantsLabel = [
  { visible: false, label: '' },
  { visible: false, label: '' },
]

const toggleProfile = (profile: any) => {
  participantsLabel[0].visible = false;
  participantsLabel[1].visible = false;
  participantsLabel[0].label = '';
  participantsLabel[1].label = '';

  if (['homem', 'mulher'].includes(profile.value)) {
    participantsLabel[0].visible = true;
    participantsLabel[0].label = profile.label;
  }

  if (['casal_hm'].includes(profile.value)) {
    participantsLabel[0].visible = true;
    participantsLabel[0].label = 'Casal - Ele';

    participantsLabel[1].visible = true;
    participantsLabel[1].label = 'Casal - Ela';
  }

  if (['casal_hh'].includes(profile.value)) {
    participantsLabel[0].visible = true;
    participantsLabel[0].label = 'Casal - Ele';

    participantsLabel[1].visible = true;
    participantsLabel[1].label = 'Casal - Ele';
  }

  if (['casal_mm'].includes(profile.value)) {
    participantsLabel[0].visible = true;
    participantsLabel[0].label = 'Casal - Ela';

    participantsLabel[1].visible = true;
    participantsLabel[1].label = 'Casal - Ela';
  }
};

const step = ref<1 | 2 | 3 | 4>(4)
const formStep1 = ref()
const formStep2 = ref()
const formStep3 = ref()
const formStep4 = ref()

// Mapa dos forms para saber qual form o step irá validar
const formsMap = {
  1: formStep1,
  2: formStep2,
  3: formStep3,
  4: formStep4
}

const nextStep = async () => {

  notify.success('Cadastro realizado com sucesso.');

  const form = formsMap[step.value]

  const valid = await form.value.validate(true);
  if (!valid) {
    return
  }

  /* Tipo de Conta, ao clicar no botão -> Next, ele passa pelas abas primeiro, antes de passar para o próximo step */
  if (step.value === 1 && participantsLabel[1].visible && tabPerfil.value === 'perfilA') {
    tabPerfil.value = 'perfilB'
    return
  }

  /* Interesses e Desejos, ao clicar no botão -> Next, ele passa pelas abas primeiro, antes de passar para o próximo step */
  if (step.value === 3 && right(tabPreferences.value, 1) != '4') {
    const tab = 'pref' + (Number.parseInt(right(tabPreferences.value, 1)) + 1).toString()
    tabPreferences.value = tab;
    return
  }

  step.value++;
}

const checkProfileExists = async (val: string) => {
  console.log('val: ', val);

  return false || 'Este nome de conta já está em uso';
}

</script>

<style scoped>
.register-page {
  position: relative;
  background: #ffffff;
  overflow: hidden;
}

.register-viewport {
  position: absolute;
  inset: 0;
  display: flex;
  overflow: hidden;
  background: #ffffff;
}

.register-left {
  flex: 0 0 20%;
  min-width: 220px;
}

.register-left-box {
  width: 100%;
  height: 100%;
  background: #f4f3f7;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
}

.register-right {
  flex: 1;
  min-width: 0;
  padding: 32px 48px;
  box-sizing: border-box;
  overflow-y: auto;
  background: #ffffff;

  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.register-form-wrapper {
  width: 100%;
  max-width: 980px;
}

.register-stepper {
  background: transparent;
}

.url-prefix {
  display: flex;
  align-items: center;
  height: 100%;
  background: #f7f7fa;
  color: #2962ff;
  font-size: 16px;
  padding: 0 12px;
  white-space: nowrap;
  margin-left: -10px;
}

.card-title-overlay {
  padding: 6px 6px;
  font-size: 12px;
  line-height: 1.2;
  min-height: unset;
  background: rgba(0, 0, 0, 0.35);
}

.interest-card {
  width: 140px;
  min-width: 140px;
  overflow: hidden;
  padding: 0;
}

.interest-card__image {
  width: 140px;
  height: 140px;
  display: block;
}

.check-options {
  text-align: left;
  font-size: 14px;
}

.login-form-wrapper {
  width: 100%;
  max-width: 390px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.signin-btn {
  width: 100%;
  background: #7367f0;
  color: #ffffff;
  border-radius: 10px;
}

.social-btn {
  width: 38px;
  height: 38px;
}

.facebook {
  background: #eef1ff;
  color: #7367f0;
}

.google {
  background: #fff1f1;
  color: #ea4335;
}

.twitter {
  background: #eef7ff;
  color: #1da1f2;
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.divider {
    position: relative;
    text-align: center;
    margin: 24px 0;
  }

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  border-top: 1px solid #e5e5e5;
}

.divider span {
  position: relative;
  background: #ffffff;
  padding: 0 12px;
  color: #999999;
}

:deep(.interest-card__image) {
  opacity: 0.7;
}

:deep(.interest-card) {
  padding: 0;
}

:deep(.back-home-btn) {
  color: #555;
  transition: color .2s ease;
}

:deep(.back-home-btn:hover) {
  background: transparent !important;
  color: #7367f0;
}

:deep(.back-home-btn .q-icon) {
  transition: transform .2s ease;
}

:deep(.back-home-btn:hover .q-icon) {
  transform: translateX(-2px);
}

:deep(.back-home-btn .q-focus-helper) {
  display: none;
}

@media (max-width: 1024px) {
  .register-left {
    flex: 0 0 24%;
    min-width: 180px;
  }

  .register-right {
    padding: 24px 32px;
  }
}

@media (max-width: 768px) {
  .register-left {
    display: none;
  }

  .register-right {
    padding: 20px;
  }

  .register-form-wrapper {
    max-width: 100%;
  }
}
</style>
