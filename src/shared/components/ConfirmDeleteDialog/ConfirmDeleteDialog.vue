<template>
  <q-dialog
    v-model="dialogModel"
    persistent
  >
    <q-card class="confirm-dialog-card">
      <q-card-section class="dialog-header">
        <div class="icon-wrapper">
          <q-icon name="delete_outline" size="28px" />
        </div>

        <div>
          <div class="dialog-title">
            {{ title }}
          </div>

          <div class="dialog-subtitle">
            {{ message }}
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section
        v-if="description"
        class="dialog-body"
      >
        <q-banner rounded class="warning-banner">
          <template #avatar>
            <q-icon name="warning_amber" color="negative" />
          </template>

          {{ description }}
        </q-banner>
      </q-card-section>

      <q-card-actions align="right" class="dialog-footer">
        <q-btn
          flat
          no-caps
          label="Cancelar"
          color="grey-7"
          :disable="loading"
          @click="onCancel"
        />

        <q-btn
          unelevated
          no-caps
          color="negative"
          icon="delete_outline"
          :label="confirmLabel"
          :loading="loading"
          class="confirm-btn"
          @click="onConfirm"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: boolean
  title?: string
  message?: string
  description?: string
  confirmLabel?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Confirmar exclusão',
  message: 'Tem certeza que deseja excluir este item?',
  description: 'Esta ação não poderá ser desfeita.',
  confirmLabel: 'Excluir',
  loading: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
  cancel: []
}>()

const dialogModel = computed({
  get: () => props.modelValue,
  set: (value: boolean) => {
    emit('update:modelValue', value)
  },
})

function onCancel() {
  emit('cancel')
  dialogModel.value = false
}

function onConfirm() {
  emit('confirm')
}
</script>

<style scoped>
.confirm-dialog-card {
  width: 480px;
  max-width: 95vw;
  border-radius: 20px;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #e9eef5;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.14);
}

.dialog-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 24px;
}

.icon-wrapper {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: #fdecec;
  color: #b42318;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dialog-title {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.2;
}

.dialog-subtitle {
  font-size: 14px;
  color: #64748b;
  margin-top: 6px;
  line-height: 1.5;
}

.dialog-body {
  padding: 20px 24px;
}

.warning-banner {
  background: #fff7ed;
  color: #9a3412;
  border: 1px solid #fed7aa;
}

.dialog-footer {
  padding: 18px 24px;
  gap: 8px;
}

.confirm-btn {
  border-radius: 12px;
  padding-left: 16px;
  padding-right: 16px;
}
</style>
