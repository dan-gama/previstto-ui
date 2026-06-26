<template>
  <q-layout view="lHh Lpr lFf" class="main-layout">
    <q-header class="app-header">
      <q-toolbar class="header-toolbar">
        <div class="header-left">
          <q-btn
            flat
            round
            dense
            icon="menu"
            class="header-icon-btn"
            @click="toggleDrawer"
          >
            <q-tooltip>Exibir ou ocultar menu</q-tooltip>
          </q-btn>

          <div class="header-context">
            <div class="header-title">Controle Financeiro</div>
            <div class="header-subtitle">
              Gestão financeira pessoal e administrativa
            </div>
          </div>
        </div>

        <q-space />

        <div class="header-right">
          <q-btn
            unelevated
            no-caps
            color="negative"
            icon="remove_circle_outline"
            label="Nova despesa"
            class="header-action-btn"
          />

          <q-btn
            unelevated
            no-caps
            color="positive"
            icon="add_circle_outline"
            label="Nova receita"
            class="header-action-btn"
          />

          <q-btn
            flat
            round
            dense
            icon="notifications_none"
            class="header-icon-btn"
          >
            <q-badge floating rounded color="negative">
              3
            </q-badge>

            <q-tooltip>Notificações</q-tooltip>
          </q-btn>

          <q-btn
            flat
            round
            dense
            :icon="isDark ? 'light_mode' : 'dark_mode'"
            class="header-icon-btn"
            @click="toggleTheme"
          >
            <q-tooltip>
              {{ isDark ? 'Usar tema claro' : 'Usar tema escuro' }}
            </q-tooltip>
          </q-btn>

          <q-btn
            flat
            no-caps
            class="user-menu-btn"
          >
            <q-avatar
              size="34px"
              color="primary"
              text-color="white"
            >
              DG
            </q-avatar>

            <div class="user-menu-text">
              <div class="user-menu-name">Danilo</div>
              <div class="user-menu-role">Administrador</div>
            </div>

            <q-icon name="keyboard_arrow_down" class="q-ml-sm" />

            <q-menu
              auto-close
              anchor="bottom right"
              self="top right"
              class="user-dropdown"
            >
              <q-list style="min-width: 220px">
                <q-item clickable v-ripple>
                  <q-item-section avatar>
                    <q-icon name="person" />
                  </q-item-section>
                  <q-item-section>Meu perfil</q-item-section>
                </q-item>

                <q-item clickable v-ripple>
                  <q-item-section avatar>
                    <q-icon name="settings" />
                  </q-item-section>
                  <q-item-section>Preferências</q-item-section>
                </q-item>

                <q-item clickable v-ripple @click="toggleTheme">
                  <q-item-section avatar>
                    <q-icon :name="isDark ? 'light_mode' : 'dark_mode'" />
                  </q-item-section>
                  <q-item-section>
                    {{ isDark ? 'Usar tema claro' : 'Usar tema escuro' }}
                  </q-item-section>
                </q-item>

                <q-separator />

                <q-item clickable v-ripple>
                  <q-item-section avatar>
                    <q-icon name="logout" color="negative" />
                  </q-item-section>
                  <q-item-section>Sair</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="drawerMini ? 84 : 280"
      :mini="drawerMini"
      class="erp-drawer"
    >
      <div class="drawer-wrapper">
        <!-- Topo -->
        <div class="drawer-top">
          <div class="brand-row" :class="{ 'brand-row-mini': drawerMini }">
            <div class="brand-logo">
              <q-icon name="account_balance_wallet" size="24px" />
            </div>

            <transition name="fade">
              <div v-if="!drawerMini" class="brand-text">
                <div class="brand-title">Finance ERP</div>
                <div class="brand-subtitle">Gestão financeira</div>
              </div>
            </transition>
          </div>

          <div class="drawer-toggle">
            <q-btn
              flat
              round
              dense
              :icon="drawerMini ? 'chevron_right' : 'chevron_left'"
              @click="drawerMini = !drawerMini"
            >
              <q-tooltip>
                {{ drawerMini ? 'Expandir menu' : 'Recolher menu' }}
              </q-tooltip>
            </q-btn>
          </div>
        </div>

        <!-- Usuário -->
        <div class="user-section" :class="{ 'user-section-mini': drawerMini }">
          <q-avatar size="42px" color="primary" text-color="white">
            DG
          </q-avatar>

          <transition name="fade">
            <div v-if="!drawerMini" class="user-text">
              <div class="user-name">Danilo Gama</div>
              <div class="user-role">Administrador</div>
            </div>
          </transition>
        </div>

        <q-separator class="drawer-separator" />

        <!-- Menus -->
        <div class="menu-scroll">
          <!-- Cadastros -->
          <div class="menu-group">
            <div v-if="!drawerMini" class="menu-group-title">Cadastros</div>

            <q-list class="menu-list">
              <q-item
                clickable
                v-ripple
                :to="{ name: 'domain-list' }"
                class="menu-item"
                active-class="menu-item-active"
              >
                <q-item-section avatar class="menu-icon-section">
                  <q-icon name="dataset" />
                </q-item-section>

                <q-item-section v-if="!drawerMini">
                  <q-item-label>Domínios</q-item-label>
                </q-item-section>

                <q-tooltip v-if="drawerMini" anchor="center right" self="center left">
                  Domínios
                </q-tooltip>
              </q-item>

              <q-item clickable v-ripple class="menu-item" to="/categories">
                <q-item-section avatar class="menu-icon-section">
                  <q-icon name="category" />
                </q-item-section>

                <q-item-section v-if="!drawerMini">
                  <q-item-label>Categorias</q-item-label>
                </q-item-section>

                <q-tooltip v-if="drawerMini" anchor="center right" self="center left">
                  Categorias
                </q-tooltip>
              </q-item>

              <q-item clickable v-ripple class="menu-item" to="/bank-accounts">
                <q-item-section avatar class="menu-icon-section">
                  <q-icon name="account_balance" />
                </q-item-section>

                <q-item-section v-if="!drawerMini">
                  <q-item-label>Bancos</q-item-label>
                </q-item-section>

                <q-tooltip v-if="drawerMini" anchor="center right" self="center left">
                  Bancos
                </q-tooltip>
              </q-item>

              <q-item clickable v-ripple class="menu-item" to="/credit-cards">
                <q-item-section avatar class="menu-icon-section">
                  <q-icon name="credit_card" />
                </q-item-section>

                <q-item-section v-if="!drawerMini">
                  <q-item-label>Cartões</q-item-label>
                </q-item-section>

                <q-tooltip v-if="drawerMini" anchor="center right" self="center left">
                  Cartões
                </q-tooltip>
              </q-item>

              <q-item clickable v-ripple class="menu-item" to="/persons">
                <q-item-section avatar class="menu-icon-section">
                  <q-icon name="person" />
                </q-item-section>

                <q-item-section v-if="!drawerMini">
                  <q-item-label>Pessoas</q-item-label>
                </q-item-section>

                <q-tooltip v-if="drawerMini" anchor="center right" self="center left">
                  Pessoas
                </q-tooltip>
              </q-item>

              <q-item clickable v-ripple class="menu-item" to="/schedules">
                <q-item-section avatar class="menu-icon-section">
                  <q-icon name="schedule" />
                </q-item-section>

                <q-item-section v-if="!drawerMini">
                  <q-item-label>Agendamento</q-item-label>
                </q-item-section>

                <q-tooltip v-if="drawerMini" anchor="center right" self="center left">
                  Agendamento
                </q-tooltip>
              </q-item>

              <q-item clickable v-ripple class="menu-item" to="/transactions">
                <q-item-section avatar class="menu-icon-section">
                  <q-icon name="money" />
                </q-item-section>

                <q-item-section v-if="!drawerMini">
                  <q-item-label>Lançamentos</q-item-label>
                </q-item-section>

                <q-tooltip v-if="drawerMini" anchor="center right" self="center left">
                  Lançamentos
                </q-tooltip>
              </q-item>
            </q-list>
          </div>

          <!-- Financeiro -->
          <div class="menu-group">
            <div v-if="!drawerMini" class="menu-group-title">Financeiro</div>

            <q-list class="menu-list">
              <q-item clickable v-ripple class="menu-item">
                <q-item-section avatar class="menu-icon-section">
                  <q-icon name="trending_down" />
                </q-item-section>

                <q-item-section v-if="!drawerMini">
                  <q-item-label>Despesas</q-item-label>
                </q-item-section>

                <q-tooltip v-if="drawerMini" anchor="center right" self="center left">
                  Despesas
                </q-tooltip>
              </q-item>

              <q-item clickable v-ripple class="menu-item">
                <q-item-section avatar class="menu-icon-section">
                  <q-icon name="trending_up" />
                </q-item-section>

                <q-item-section v-if="!drawerMini">
                  <q-item-label>Receitas</q-item-label>
                </q-item-section>

                <q-tooltip v-if="drawerMini" anchor="center right" self="center left">
                  Receitas
                </q-tooltip>
              </q-item>

              <q-item clickable v-ripple class="menu-item">
                <q-item-section avatar class="menu-icon-section">
                  <q-icon name="sync_alt" />
                </q-item-section>

                <q-item-section v-if="!drawerMini">
                  <q-item-label>Transferências</q-item-label>
                </q-item-section>

                <q-tooltip v-if="drawerMini" anchor="center right" self="center left">
                  Transferências
                </q-tooltip>
              </q-item>
            </q-list>
          </div>

          <!-- Relatórios -->
          <div class="menu-group">
            <div v-if="!drawerMini" class="menu-group-title">Relatórios</div>

            <q-list class="menu-list">
              <q-item clickable v-ripple class="menu-item">
                <q-item-section avatar class="menu-icon-section">
                  <q-icon name="bar_chart" />
                </q-item-section>

                <q-item-section v-if="!drawerMini">
                  <q-item-label>Resumo geral</q-item-label>
                </q-item-section>

                <q-tooltip v-if="drawerMini" anchor="center right" self="center left">
                  Resumo geral
                </q-tooltip>
              </q-item>

              <q-item clickable v-ripple class="menu-item">
                <q-item-section avatar class="menu-icon-section">
                  <q-icon name="insights" />
                </q-item-section>

                <q-item-section v-if="!drawerMini">
                  <q-item-label>Análises</q-item-label>
                </q-item-section>

                <q-tooltip v-if="drawerMini" anchor="center right" self="center left">
                  Análises
                </q-tooltip>
              </q-item>
            </q-list>
          </div>

          <!-- Configurações -->
          <div class="menu-group">
            <div v-if="!drawerMini" class="menu-group-title">Configurações</div>

            <q-list class="menu-list">
              <q-item clickable v-ripple class="menu-item">
                <q-item-section avatar class="menu-icon-section">
                  <q-icon name="settings" />
                </q-item-section>

                <q-item-section v-if="!drawerMini">
                  <q-item-label>Preferências</q-item-label>
                </q-item-section>

                <q-tooltip v-if="drawerMini" anchor="center right" self="center left">
                  Preferências
                </q-tooltip>
              </q-item>

              <q-item clickable v-ripple class="menu-item">
                <q-item-section avatar class="menu-icon-section">
                  <q-icon name="manage_accounts" />
                </q-item-section>

                <q-item-section v-if="!drawerMini">
                  <q-item-label>Usuários</q-item-label>
                </q-item-section>

                <q-tooltip v-if="drawerMini" anchor="center right" self="center left">
                  Usuários
                </q-tooltip>
              </q-item>
            </q-list>
          </div>
        </div>

        <!-- Rodapé -->
        <div class="drawer-footer">
          <q-btn
            flat
            no-caps
            class="footer-btn"
            :class="{ 'footer-btn-mini': drawerMini }"
          >
            <q-icon name="logout" />
            <span v-if="!drawerMini" class="q-ml-sm">Sair</span>

            <q-tooltip v-if="drawerMini" anchor="center right" self="center left">
              Sair
            </q-tooltip>
          </q-btn>
        </div>
      </div>
    </q-drawer>

    <q-page-container class="page-container">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const leftDrawerOpen = ref(true)
const drawerMini = ref(false)

const isDark = computed(() => $q.dark.isActive)

function toggleDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function toggleTheme() {
  $q.dark.set(!isDark.value)
}
</script>

<style scoped>
.main-layout {
  background: #f8fafc;
}

.app-header {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e9eef5;
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.04);
  color: #0f172a;
}

.header-toolbar {
  min-height: 72px;
  padding: 0 16px;
  gap: 16px;
  display: flex;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 260px;
}

.header-context {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.header-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.2;
}

.header-subtitle {
  font-size: 12px;
  color: #64748b;
  line-height: 1.2;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;
}

.header-action-btn {
  border-radius: 12px;
  padding-left: 10px;
  padding-right: 10px;
  font-weight: 600;
}

.header-icon-btn {
  color: #475569;
  border-radius: 12px;
}

.header-icon-btn:hover {
  background: #f1f5f9;
}

.user-menu-btn {
  display: flex;
  align-items: center;
  gap: 16px; /* antes 10px */
  padding: 6px 10px;
  border-radius: 14px;
  color: #0f172a;
}

.user-menu-btn:hover {
  background: #f8fafc;
}

.user-menu-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.15;
  padding-left: 5px;
}

.user-menu-name {
  font-size: 13px;
  font-weight: 700;
}

.user-menu-role {
  font-size: 11px;
  color: #64748b;
}

.user-dropdown {
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid #e9eef5;
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.10);
}

.header-shadow {
  border-bottom: 1px solid #e9eef5;
  box-shadow: 0 4px 18px rgba(15, 23, 42, 0.04);
}

.erp-drawer {
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  color: #1e293b;
}

.drawer-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.drawer-top {
  padding: 18px 14px 8px 14px;
}

.brand-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 10px;
}

.brand-row-mini {
  justify-content: center;
}

.brand-logo {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 18px rgba(37, 99, 235, 0.25);
  flex-shrink: 0;
}

.brand-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.2;
}

.brand-subtitle {
  font-size: 12px;
  color: #64748b;
}

.drawer-toggle {
  display: flex;
  justify-content: flex-end;
  padding-right: 4px;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px 18px 20px;
}

.user-section-mini {
  justify-content: center;
  padding-left: 0;
  padding-right: 0;
}

.user-text {
  min-width: 0;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
}

.user-role {
  font-size: 12px;
  color: #64748b;
}

.drawer-separator {
  margin: 0 14px 10px 14px;
}

.menu-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 8px 10px 16px 10px;
}

.menu-group + .menu-group {
  margin-top: 18px;
}

.menu-group-title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #94a3b8;
  padding: 0 14px 8px 14px;
}

.menu-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.menu-item {
  min-height: 48px;
  border-radius: 14px;
  color: #334155;
  padding-left: 10px;
  padding-right: 10px;
  transition: all 0.2s ease;
}

.menu-item:hover {
  background: #eef4ff;
  color: #1d4ed8;
}

.menu-item-active {
  background: linear-gradient(90deg, #e8f0ff 0%, #edf4ff 100%);
  color: #1d4ed8;
  font-weight: 700;
  box-shadow: inset 3px 0 0 #2563eb;
}

.menu-icon-section {
  min-width: 32px;
  color: inherit;
}

.drawer-footer {
  padding: 12px 14px 18px 14px;
  border-top: 1px solid #e9eef5;
}

.footer-btn {
  width: 100%;
  min-height: 46px;
  border-radius: 14px;
  justify-content: flex-start;
  color: #475569;
  background: transparent;
}

.footer-btn:hover {
  background: #f1f5f9;
}

.footer-btn-mini {
  justify-content: center;
  padding-left: 0;
  padding-right: 0;
}

.page-container {
  background: #f8fafc;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 1200px) {
  .user-menu-text {
    display: none;
  }
}

@media (max-width: 960px) {
  .header-subtitle {
    display: none;
  }
}

@media (max-width: 768px) {
  .header-action-btn .q-btn__content span {
    display: none;
  }

  .header-toolbar {
    padding: 0 10px;
    gap: 10px;
  }

  .header-left {
    min-width: unset;
  }
}
</style>
