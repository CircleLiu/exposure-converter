<template>
  <div class="step-size-selector">
    <label for="step-size" class="step-label">Step Size</label>
    <div class="step-options">
      <button
        v-for="option in stepOptions"
        :key="option.value"
        @click="selectStep(option.value)"
        :class="['step-btn', { active: modelValue === option.value }]"
        :title="option.description"
      >
        {{ option.label }}
      </button>
    </div>
    <p class="step-description">{{ currentDescription }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { StepSize } from '@/data/cameraParams';

interface Props {
  modelValue: StepSize;
}

interface Emits {
  (e: 'update:modelValue', value: StepSize): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const stepOptions = [
  {
    value: '1' as StepSize,
    label: '1 Stop',
    description: 'Full stop increments - standard major settings (e.g., f/2.8, f/4, f/5.6)'
  },
  {
    value: '1/2' as StepSize,
    label: '1/2 Stop',
    description: 'Half stop increments - intermediate settings for finer control'
  },
  {
    value: '1/3' as StepSize,
    label: '1/3 Stop',
    description: 'Third stop increments - finest control with maximum precision'
  }
];

const currentDescription = computed(() => {
  const option = stepOptions.find(opt => opt.value === props.modelValue);
  return option?.description || '';
});

function selectStep(stepSize: StepSize) {
  emit('update:modelValue', stepSize);
}
</script>

<style scoped>
.step-size-selector {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.step-label {
  display: block;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 12px;
  font-size: 1.1rem;
}

.step-options {
  display: flex;
  gap: 4px;
  margin-bottom: 12px;
}

.step-btn {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  background: white;
  color: #495057;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  font-size: 0.95rem;
}

.step-btn:first-child {
  border-radius: 8px 0 0 8px;
}

.step-btn:last-child {
  border-radius: 0 8px 8px 0;
}

.step-btn:only-child {
  border-radius: 8px;
}

.step-btn:hover {
  border-color: #3498db;
  background: #f8f9fa;
}

.step-btn.active {
  background: #3498db;
  border-color: #3498db;
  color: white;
}

.step-description {
  margin: 0;
  color: #7f8c8d;
  font-size: 0.9rem;
  line-height: 1.4;
  padding: 8px 0;
}

@media (max-width: 768px) {
  .step-options {
    flex-direction: column;
  }
  
  .step-btn {
    border-radius: 8px !important;
  }
}
</style>