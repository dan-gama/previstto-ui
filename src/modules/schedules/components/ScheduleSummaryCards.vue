<template>
  <div class="row q-col-gutter-md q-mb-md">
    <div class="col-12 col-sm-6 col-lg-3">
      <q-card flat bordered class="summary-card">
        <q-card-section class="row items-center no-wrap">
          <div
            class="summary-icon"
            :class="financialType === 'expense' ? 'bg-red-1 text-negative' : 'bg-green-1 text-positive'"
          >
            <q-icon
              :name="financialType === 'expense' ? 'trending_down' : 'trending_up'"
              size="24px"
            />
          </div>

          <div class="q-ml-md">
            <div class="summary-label">
              {{ financialType === 'expense' ? 'Despesas previstas' : 'Receitas previstas' }}
            </div>
            <div class="summary-value">
              {{ formatCurrency(totalAmount) }}
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="col-12 col-sm-6 col-lg-3">
      <q-card flat bordered class="summary-card">
        <q-card-section class="row items-center no-wrap">
          <div class="summary-icon bg-orange-1 text-orange">
            <q-icon name="schedule" size="24px" />
          </div>

          <div class="q-ml-md">
            <div class="summary-label">Pendentes no mes</div>
            <div class="summary-value">{{ pendingCount }}</div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="col-12 col-sm-6 col-lg-3">
      <q-card flat bordered class="summary-card">
        <q-card-section class="row items-center no-wrap">
          <div class="summary-icon bg-blue-1 text-primary">
            <q-icon name="autorenew" size="24px" />
          </div>

          <div class="q-ml-md">
            <div class="summary-label">Recorrentes</div>
            <div class="summary-value">{{ recurringCount }}</div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="col-12 col-sm-6 col-lg-3">
      <q-card flat bordered class="summary-card">
        <q-card-section class="row items-center no-wrap">
          <div class="summary-icon bg-purple-1 text-purple">
            <q-icon name="payments" size="24px" />
          </div>

          <div class="q-ml-md">
            <div class="summary-label">Parcelados</div>
            <div class="summary-value">{{ installmentCount }}</div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FinancialType } from '@/shared/domain/types/FinancialType'

defineProps<{
  financialType: FinancialType
  totalAmount: number
  pendingCount: number
  recurringCount: number
  installmentCount: number
}>()

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}
</script>

<style lang="scss" scoped>
.summary-card {
  border-radius: 18px;
  background: #fff;
  border: 1px solid #e9eef5;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
}

.summary-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.summary-label {
  font-size: 13px;
  color: #64748b;
}

.summary-value {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.2;
}
</style>
