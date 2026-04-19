<template>
  <q-icon
    :name="icon"
    :size="size"
    :color="color"
    class="cursor-pointer info-tooltip-icon q-pl-xs"
    v-if="description">
    <q-tooltip
      :delay="delay"
      :anchor="anchor"
      :self="self"
      class="custom-tooltip">
      <div v-if="title" class="tooltip-title">
        {{ title }}
      </div>
      <div class="tooltip-description" v-html="description"></div>
    </q-tooltip>
  </q-icon>
</template>

<script setup lang="ts">
  type TooltipPosition =
  | 'top left'
  | 'top middle'
  | 'top right'
  | 'top start'
  | 'top end'
  | 'center left'
  | 'center middle'
  | 'center right'
  | 'center start'
  | 'center end'
  | 'bottom left'
  | 'bottom middle'
  | 'bottom right'
  | 'bottom start'
  | 'bottom end'

  interface Props {
    title?: string;
    description: string;
    icon?: string;
    size?: string;
    color?: string;
    delay?: number;
    anchor?: TooltipPosition;
    self?: TooltipPosition;
  }

  withDefaults(defineProps<Props>(), {
    title: '',
    icon: 'help',
    size: '18px',
    color: 'purple-6',
    delay: 200,
    anchor: 'top middle',
    self: 'bottom middle'
  });
</script>

<style scoped>
  .info-tooltip-icon {
    transition: color 0.2s ease, transform 0.2s ease;
  }

  .info-tooltip-icon:hover {
    transform: scale(1.08);
  }
</style>
