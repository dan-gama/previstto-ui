<!-- src/modules/registration/pages/RegisterWizardPage.vue -->
/*
  1. Selecione o tipo de conta: Solteiro, Casal;
  2. Informe o nome do perfil, e defina o nome e orientação sexual dos participantes do perfil;
  3. Vocês tem interesse em: Homem, Mulher, Casal (Ele/Ela), Casal(Ele/Ele), Casal(Ela/Ela), Mulher Trans, CD, Travesti
  4. O que vocês desejam: Troca de Casal, Ménage Masc., Ménage Fem., Sexo no mesmo ambiente, Ainda não me decidi.
  5. Localização (Cidade, Estado)
  6. Autenticação (Auth próprio, Google, Facebook ou X)
*/
<!-- src/modules/registration/pages/RegisterWizardPage.vue -->
<template>
  <q-page class="q-pa-sm q-pa-md-md q-pa-lg-lg">
    <div class="wl-shell">
      <div class="wl-header">
        <div>
          <div class="text-h5 text-weight-bold">Criar seu perfil</div>
          <div class="text-body2 text-grey-7">
            Cadastro guiado em etapas — cada campo tem explicação para você não ficar na dúvida.
          </div>
        </div>

        <q-btn flat icon="arrow_back" label="Voltar" @click="goHome" />
      </div>

      <q-card class="wl-card" bordered>
        <q-card-section>
          <!-- Top indicator: title + "Passo X de N" + dots -->
          <div class="wl-indicator q-mb-md">
            <div class="wl-indicator__top">
              <div>
                <div class="text-subtitle1 text-weight-medium">
                  {{ currentStepMeta.title }}
                </div>
                <div class="text-caption text-grey-7">
                  Passo {{ step }} de {{ totalSteps }} • {{ currentStepMeta.caption }}
                </div>
              </div>

              <q-linear-progress class="wl-progress" rounded :value="progress" />
            </div>

            <div class="wl-dots" aria-label="Indicador de passos">
              <button
                v-for="n in totalSteps"
                :key="n"
                class="wl-dot"
                type="button"
                :class="{
                  'wl-dot--active': n === step,
                  'wl-dot--done': n < step
                }"
                :title="stepMeta[n].title"
                @click="goToStep(n)"
              />
            </div>
          </div>

          <!-- Stepper without header -->
          <q-stepper v-model="step" animated flat :header-nav="false" :alternative-labels="false">
            <!-- STEP 1 -->
            <q-step :name="1">
              <div class="wl-step wl-step--wide">
                <div class="text-subtitle1 text-weight-medium">Selecione o tipo de conta</div>
                <div class="text-body2 text-grey-7 q-mt-xs">
                  Isso define quantos participantes existirão dentro do mesmo perfil.
                </div>

                <div class="row q-col-gutter-md q-mt-md">
                  <div class="col-12 col-md-6" v-for="opt in accountTypeOptions" :key="opt.value">
                    <q-card
                      class="wl-pick"
                      bordered
                      :class="{ 'wl-pick--active': form.accountType === opt.value }"
                      clickable
                      @click="form.accountType = opt.value"
                    >
                      <q-card-section>
                        <div class="text-subtitle1 text-weight-bold">{{ opt.label }}</div>
                        <div class="text-caption text-grey-7">{{ opt.help }}</div>
                      </q-card-section>
                    </q-card>
                  </div>
                </div>

                <div class="row justify-end q-mt-lg">
                  <q-btn color="primary" label="Continuar" @click="nextFromStep1" />
                </div>
              </div>
            </q-step>

            <!-- STEP 2 (NEW): Username -->
            <q-step :name="2">
              <div class="wl-step wl-step--narrow">
                <div class="text-subtitle1 text-weight-medium">Nome do perfil (username)</div>
                <div class="text-body2 text-grey-7 q-mt-xs">
                  Esse nome é <b>público</b> e vira sua URL. Escolha algo simples e memorável.
                  Ex.: <b>weblovers.com.br/casallegal</b>
                </div>

                <q-input
                  v-model.trim="form.username"
                  class="q-mt-md"
                  outlined
                  label="Nome do perfil (username)"
                  hint="Sem espaços. Use letras/números/ponto/underline."
                  :error="showErrors && !isUsernameValid"
                  :error-message="usernameError"
                />

                <q-banner rounded class="bg-grey-2 q-mt-sm">
                  Preview: <b>weblovers.com.br/{{ normalizedUsername || 'seuusername' }}</b>
                </q-banner>

                <div class="row justify-between q-mt-lg">
                  <q-btn flat label="Voltar" @click="step = 1" />
                  <q-btn color="primary" label="Continuar" @click="nextFromStep2" />
                </div>
              </div>
            </q-step>

            <!-- STEP 3 (NEW): Participants -->
            <q-step :name="3">
              <div class="wl-step wl-step--wide">
                <div class="text-subtitle1 text-weight-medium">Dados dos participantes</div>
                <div class="text-body2 text-grey-7 q-mt-xs">
                  Preencha o <b>nome</b> e a <b>orientação sexual</b> de cada participante. Isso ajuda a melhorar
                  compatibilidade e sugestões dentro do app.
                </div>

                <div class="q-mt-md">
                  <q-banner rounded class="bg-grey-2">
                    Participantes: <b>{{ form.participants.length }}</b>
                    <span class="text-grey-7">({{ form.accountType === 'COUPLE' ? 'Casal' : 'Solteiro' }})</span>
                  </q-banner>
                </div>

                <div class="column q-gutter-md q-mt-md">
                  <q-card v-for="(p, idx) in form.participants" :key="idx" bordered class="wl-profile-card">
                    <q-card-section class="row items-center justify-between">
                      <div class="text-subtitle2 text-weight-bold">Participante {{ idx + 1 }}</div>
                    </q-card-section>
                    <q-separator />
                    <q-card-section>
                      <div class="row q-col-gutter-md">
                        <div class="col-12 col-md-6">
                          <q-input
                            v-model.trim="p.name"
                            outlined
                            label="Nome"
                            :error="showErrors && !p.name"
                            error-message="Informe o nome"
                          />
                        </div>
                        <div class="col-12 col-md-6">
                          <q-select
                            v-model="p.orientation"
                            outlined
                            emit-value
                            map-options
                            :options="participantOrientationOptions"
                            label="Orientação sexual"
                            :error="showErrors && !p.orientation"
                            error-message="Selecione a orientação"
                          />
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>

                <div class="row justify-between q-mt-lg">
                  <q-btn flat label="Voltar" @click="step = 2" />
                  <q-btn color="primary" label="Continuar" @click="nextFromStep3" />
                </div>
              </div>
            </q-step>

            <!-- STEP 4 (was 3): Interests -->
            <q-step :name="4">
              <div class="wl-step wl-step--wide">
                <div class="text-subtitle1 text-weight-medium">Vocês têm interesse em…</div>
                <div class="text-body2 text-grey-7 q-mt-xs">
                  Selecione os tipos de perfis que vocês têm interesse. Isso melhora busca e compatibilidade.
                </div>

                <q-option-group
                  v-model="form.interests"
                  class="q-mt-md"
                  type="checkbox"
                  :options="interestOptions"
                />

                <div class="row justify-between q-mt-lg">
                  <q-btn flat label="Voltar" @click="step = 3" />
                  <q-btn color="primary" label="Continuar" @click="nextFromStep4" />
                </div>
              </div>
            </q-step>

            <!-- STEP 5 (was 4): Desires -->
            <q-step :name="5">
              <div class="wl-step wl-step--wide">
                <div class="text-subtitle1 text-weight-medium">O que vocês desejam…</div>
                <div class="text-body2 text-grey-7 q-mt-xs">
                  Selecione o que melhor descreve seu objetivo. Você pode marcar mais de um.
                </div>

                <q-option-group
                  v-model="form.desires"
                  class="q-mt-md"
                  type="checkbox"
                  :options="desireOptions"
                />

                <div class="row justify-between q-mt-lg">
                  <q-btn flat label="Voltar" @click="step = 4" />
                  <q-btn color="primary" label="Continuar" @click="nextFromStep5" />
                </div>
              </div>
            </q-step>

            <!-- STEP 6 (was 5): Location -->
            <q-step :name="6">
              <div class="wl-step wl-step--narrow">
                <div class="text-subtitle1 text-weight-medium">Localização</div>
                <div class="text-body2 text-grey-7 q-mt-xs">
                  Usamos sua localização para mostrar perfis e eventos relevantes próximos a você.
                </div>

                <div class="row q-col-gutter-md q-mt-md">
                  <div class="col-12 col-md-5">
                    <q-select
                      v-model="form.location.state"
                      outlined
                      :options="stateOptions"
                      label="Estado (UF)"
                      emit-value
                      map-options
                      :error="showErrors && !form.location.state"
                      error-message="Selecione o estado"
                    />
                  </div>
                  <div class="col-12 col-md-7">
                    <q-input
                      v-model.trim="form.location.city"
                      outlined
                      label="Cidade"
                      :error="showErrors && !form.location.city"
                      error-message="Informe a cidade"
                    />
                  </div>
                </div>

                <div class="row justify-between q-mt-lg">
                  <q-btn flat label="Voltar" @click="step = 5" />
                  <q-btn color="primary" label="Continuar" @click="nextFromStep6" />
                </div>
              </div>
            </q-step>

            <!-- STEP 7 (was 6): Auth -->
            <q-step :name="7">
              <div class="wl-step wl-step--wide">
                <div class="text-subtitle1 text-weight-medium">Autenticação</div>
                <div class="text-body2 text-grey-7 q-mt-xs">
                  Escolha como vocês preferem entrar no WebLovers. No MVP, isso pode ser “mock”; depois você integra OAuth
                  (Google/Facebook/X) no backend e consome aqui.
                </div>

                <div class="row q-col-gutter-md q-mt-md">
                  <div class="col-12 col-md-6" v-for="opt in authOptions" :key="opt.value">
                    <q-card
                      class="wl-pick"
                      bordered
                      :class="{ 'wl-pick--active': form.authProvider === opt.value }"
                      clickable
                      @click="form.authProvider = opt.value"
                    >
                      <q-card-section class="row items-center q-gutter-sm">
                        <q-icon :name="opt.icon" size="20px" />
                        <div>
                          <div class="text-subtitle2 text-weight-bold">{{ opt.label }}</div>
                          <div class="text-caption text-grey-7">{{ opt.help }}</div>
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                </div>

                <div class="row justify-between q-mt-lg">
                  <q-btn flat label="Voltar" @click="step = 6" />
                  <q-btn color="primary" label="Concluir (mock)" @click="finish" />
                </div>
              </div>
            </q-step>
          </q-stepper>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

type AccountType = 'SINGLE' | 'COUPLE'
type ParticipantOrientation = 'HETERO' | 'HOMO' | 'BI' | 'PAN' | 'TRANS' | 'CROSS' | 'OTHER'
type AuthProvider = 'LOCAL' | 'GOOGLE' | 'FACEBOOK' | 'X'

type Participant = {
  name: string
  orientation: ParticipantOrientation | null
}

const $q = useQuasar()
const router = useRouter()

const totalSteps = 7
const step = ref(1)
const showErrors = ref(false)

const stepMeta: Record<number, { title: string; caption: string }> = {
  1: { title: 'Tipo de conta', caption: 'Solteiro ou Casal' },
  2: { title: 'Nome do perfil', caption: 'Defina seu username público' },
  3: { title: 'Participantes', caption: 'Dados dos participantes do perfil' },
  4: { title: 'Interesses', caption: 'Quem vocês procuram' },
  5: { title: 'Desejos', caption: 'O que vocês buscam' },
  6: { title: 'Localização', caption: 'Cidade e Estado' },
  7: { title: 'Autenticação', caption: 'Como vocês vão entrar' }
}

const currentStepMeta = computed(() => stepMeta[step.value])
const progress = computed(() => Math.min(step.value / totalSteps, 1))

const accountTypeOptions = [
  { label: 'Solteiro', value: 'SINGLE' as AccountType, help: 'Perfil com 1 participante' },
  { label: 'Casal', value: 'COUPLE' as AccountType, help: 'Perfil com 2 participantes' },
]

const participantOrientationOptions = [
  { label: 'Heterossexual', value: 'HETERO' as ParticipantOrientation },
  { label: 'Homossexual', value: 'HOMO' as ParticipantOrientation },
  { label: 'Bissexual', value: 'BI' as ParticipantOrientation },
  { label: 'Pansexual', value: 'PAN' as ParticipantOrientation },
  { label: 'Transexual', value: 'TRANS' as ParticipantOrientation },
  { label: 'Cross Dressing (CD)', value: 'CROSS' as ParticipantOrientation },
  { label: 'Outro / Prefiro não informar', value: 'OTHER' as ParticipantOrientation },
]

// Step 4 options (exactly as you listed)
const interestOptions = [
  { label: 'Homem', value: 'MAN' },
  { label: 'Mulher', value: 'WOMAN' },
  { label: 'Casal (Ele/Ela)', value: 'COUPLE_HE' },
  { label: 'Casal (Ele/Ele)', value: 'COUPLE_HH' },
  { label: 'Casal (Ela/Ela)', value: 'COUPLE_WW' },
  { label: 'Mulher Trans', value: 'TRANS_WOMAN' },
  { label: 'CD', value: 'CD' },
  { label: 'Travesti', value: 'TRAVESTI' },
]

// Step 5 options (exactly as you listed)
const desireOptions = [
  { label: 'Troca de Casal', value: 'SWAP' },
  { label: 'Ménage Masc.', value: 'MENAGE_M' },
  { label: 'Ménage Fem.', value: 'MENAGE_F' },
  { label: 'Sexo no mesmo ambiente', value: 'SAME_ROOM' },
  { label: 'Ainda não me decidi', value: 'UNSURE' },
]

// Minimal UF list (can expand later)
const stateOptions = [
  { label: 'SP', value: 'SP' }, { label: 'RJ', value: 'RJ' }, { label: 'MG', value: 'MG' }, { label: 'ES', value: 'ES' },
  { label: 'PR', value: 'PR' }, { label: 'SC', value: 'SC' }, { label: 'RS', value: 'RS' },
  { label: 'BA', value: 'BA' }, { label: 'PE', value: 'PE' }, { label: 'CE', value: 'CE' }, { label: 'DF', value: 'DF' },
]

const authOptions = [
  { label: 'Auth próprio', value: 'LOCAL' as AuthProvider, icon: 'key', help: 'Usuário/senha ou magic link' },
  { label: 'Google', value: 'GOOGLE' as AuthProvider, icon: 'fa-brands fa-google', help: 'Entrar com sua conta Google' },
  { label: 'Facebook', value: 'FACEBOOK' as AuthProvider, icon: 'fa-brands fa-facebook', help: 'Entrar com Facebook' },
  { label: 'X', value: 'X' as AuthProvider, icon: 'fa-brands fa-x-twitter', help: 'Entrar com X (Twitter)' },
]

const form = reactive({
  accountType: null as AccountType | null,
  username: '',
  participants: [] as Participant[],
  interests: [] as string[],
  desires: [] as string[],
  location: {
    state: '' as string,
    city: '',
  },
  authProvider: null as AuthProvider | null,
})

function goHome() {
  router.push({ name: 'home' })
}

function slugifyUsername(v: string) {
  return v
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9._]/g, '')
    .replace(/^\.+|\.+$/g, '')
}

const normalizedUsername = computed(() => slugifyUsername(form.username))

const isUsernameValid = computed(() => {
  const u = normalizedUsername.value
  return u.length >= 3 && u.length <= 20
})

const usernameError = computed(() => {
  const u = normalizedUsername.value
  if (!u) return 'Informe o nome do perfil'
  if (u.length < 3) return 'Mínimo de 3 caracteres'
  if (u.length > 20) return 'Máximo de 20 caracteres'
  return ''
})

function createEmptyParticipant(): Participant {
  return { name: '', orientation: null }
}

function ensureParticipants() {
  const desired = form.accountType === 'COUPLE' ? 2 : form.accountType === 'SINGLE' ? 1 : 0
  while (form.participants.length < desired) form.participants.push(createEmptyParticipant())
  if (form.participants.length > desired) form.participants.splice(desired)
}

watch(() => form.accountType, () => ensureParticipants())

/**
 * Dots navigation:
 * - liberado clicar apenas em passos anteriores
 * - avançar somente pelos botões "Continuar"
 */
function canJumpTo(target: number) {
  return target <= step.value
}

function goToStep(target: number) {
  if (!canJumpTo(target)) return
  step.value = target
}

function nextFromStep1() {
  showErrors.value = true
  if (!form.accountType) {
    $q.notify({ type: 'negative', message: 'Selecione o tipo de conta.' })
    return
  }
  ensureParticipants()
  step.value = 2
  showErrors.value = false
}

function nextFromStep2() {
  showErrors.value = true
  if (!isUsernameValid.value) {
    $q.notify({ type: 'negative', message: 'Defina um nome de perfil (username) válido.' })
    return
  }
  step.value = 3
  showErrors.value = false
}

function nextFromStep3() {
  showErrors.value = true
  const invalid = form.participants.some(p => !p.name || !p.orientation)
  if (invalid) {
    $q.notify({ type: 'negative', message: 'Preencha nome e orientação de todos os participantes.' })
    return
  }
  step.value = 4
  showErrors.value = false
}

function nextFromStep4() {
  showErrors.value = true
  if (!form.interests.length) {
    $q.notify({ type: 'negative', message: 'Selecione ao menos 1 interesse.' })
    return
  }
  step.value = 5
  showErrors.value = false
}

function nextFromStep5() {
  showErrors.value = true
  if (!form.desires.length) {
    $q.notify({ type: 'negative', message: 'Selecione ao menos 1 desejo.' })
    return
  }
  step.value = 6
  showErrors.value = false
}

function nextFromStep6() {
  showErrors.value = true
  if (!form.location.state || !form.location.city) {
    $q.notify({ type: 'negative', message: 'Informe Estado e Cidade.' })
    return
  }
  step.value = 7
  showErrors.value = false
}

function finish() {
  showErrors.value = true
  if (!form.authProvider) {
    $q.notify({ type: 'negative', message: 'Selecione uma forma de autenticação.' })
    return
  }

  $q.notify({ type: 'positive', message: 'Cadastro concluído (mock)!' })
  router.push({ name: 'home' })
}
</script>

<style scoped>
.wl-shell {
  width: min(1100px, 100%);
  margin: 0 auto;
}

.wl-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}
@media (max-width: 599px) {
  .wl-header {
    flex-direction: column;
    align-items: stretch;
  }
}

.wl-card {
  width: 100%;
  border-radius: 16px;
}

/* Indicator */
.wl-indicator {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.wl-indicator__top {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.wl-progress {
  height: 8px;
}

/* Dots */
.wl-dots {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.wl-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  border: 1px solid rgba(0,0,0,0.18);
  background: rgba(0,0,0,0.06);
  cursor: pointer;
  padding: 0;
  outline: none;
  transition: transform 120ms ease, background 120ms ease, border-color 120ms ease;
}

.wl-dot:hover {
  transform: scale(1.12);
}

.wl-dot--done {
  background: rgba(0,0,0,0.20);
  border-color: rgba(0,0,0,0.22);
}

.wl-dot--active {
  background: var(--q-primary);
  border-color: var(--q-primary);
  transform: scale(1.25);
}

/* Steps widths */
.wl-step {
  padding: 6px 0;
  width: 100%;
}
.wl-step--narrow {
  max-width: 760px;
  margin: 0 auto;
}
.wl-step--wide {
  max-width: 1100px;
  margin: 0 auto;
}

/* Pick cards */
.wl-pick {
  border-radius: 14px;
  transition: transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease;
}
.wl-pick:hover { transform: translateY(-2px); }
.wl-pick--active {
  border-color: var(--q-primary);
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
}

.wl-profile-card { border-radius: 14px; }
</style>
