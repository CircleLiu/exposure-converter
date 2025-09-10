<template>
  <div class="ev-calculator">
    <div class="calculator-header">
      <h2>EV Calculator</h2>
      <div class="current-ev">
        <span class="ev-label">EV:</span>
        <span class="ev-value">{{ currentEV.toFixed(2) }}</span>
      </div>
    </div>
    
    <div class="exposure-inputs">
      <div class="input-group">
        <label for="shutter-speed">Shutter Speed</label>
        <div class="input-wrapper">
          <select 
            id="shutter-speed"
            :value="shutterSpeed" 
            @change="handleShutterChange"
            class="param-select"
          >
            <option v-for="option in shutterSpeedOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          <input 
            type="text" 
            :value="formatShutterDisplay(shutterSpeed)"
            @blur="handleShutterInput"
            @keyup.enter="handleShutterInput"
            class="param-input"
            placeholder="e.g., 1/250"
          />
        </div>
      </div>
      
      <div class="input-group">
        <label for="aperture">Aperture</label>
        <div class="input-wrapper">
          <select 
            id="aperture"
            :value="aperture" 
            @change="handleApertureChange"
            class="param-select"
          >
            <option v-for="option in apertureOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          <input 
            type="text" 
            :value="aperture.toString()"
            @blur="handleApertureInput"
            @keyup.enter="handleApertureInput"
            class="param-input"
            placeholder="e.g., 2.8"
          />
        </div>
      </div>
      
      <div class="input-group">
        <label for="iso">ISO</label>
        <div class="input-wrapper">
          <select 
            id="iso"
            :value="iso" 
            @change="handleIsoChange"
            class="param-select"
          >
            <option v-for="option in isoOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          <input 
            type="number" 
            :value="iso"
            @blur="handleIsoInput"
            @keyup.enter="handleIsoInput"
            class="param-input"
            placeholder="e.g., 400"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatShutterSpeed } from '@/utils/exposure';

interface Props {
  shutterSpeed: number;
  aperture: number;
  iso: number;
  currentEV: number;
  shutterSpeedOptions: { value: number; label: string }[];
  apertureOptions: { value: number; label: string }[];
  isoOptions: { value: number; label: string }[];
}

interface Emits {
  (e: 'update:shutterSpeed', value: number): void;
  (e: 'update:aperture', value: number): void;
  (e: 'update:iso', value: number): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

function formatShutterDisplay(speed: number): string {
  return formatShutterSpeed(speed);
}

function handleShutterChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  emit('update:shutterSpeed', parseFloat(target.value));
}

function handleShutterInput(event: Event) {
  const target = event.target as HTMLInputElement;
  try {
    // Parse various shutter speed formats
    let speed: number;
    const value = target.value.trim();
    
    if (value.includes('/')) {
      const [num, den] = value.split('/').map(Number);
      speed = num / den;
    } else {
      speed = parseFloat(value.replace('s', ''));
    }
    
    if (!isNaN(speed) && speed > 0) {
      emit('update:shutterSpeed', speed);
    }
  } catch (error) {
    // Reset to current value if parsing fails
    target.value = formatShutterDisplay(props.shutterSpeed);
  }
}

function handleApertureChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  emit('update:aperture', parseFloat(target.value));
}

function handleApertureInput(event: Event) {
  const target = event.target as HTMLInputElement;
  const value = parseFloat(target.value.replace('f/', ''));
  if (!isNaN(value) && value > 0) {
    emit('update:aperture', value);
  } else {
    target.value = props.aperture.toString();
  }
}

function handleIsoChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  emit('update:iso', parseInt(target.value));
}

function handleIsoInput(event: Event) {
  const target = event.target as HTMLInputElement;
  const value = parseInt(target.value);
  if (!isNaN(value) && value > 0) {
    emit('update:iso', value);
  } else {
    target.value = props.iso.toString();
  }
}

</script>

<style scoped>
.ev-calculator {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.calculator-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.calculator-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.current-ev {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.25rem;
  font-weight: 600;
}

.ev-label {
  color: #7f8c8d;
}

.ev-value {
  color: #e74c3c;
  background: #ffeaea;
  padding: 8px 16px;
  border-radius: 8px;
  min-width: 60px;
  text-align: center;
}

.exposure-inputs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  font-weight: 600;
  color: #34495e;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.input-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  align-items: stretch;
}

.param-select,
.param-input {
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.param-select:focus,
.param-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.param-select:disabled,
.param-input:disabled {
  background-color: #f8f9fa;
  color: #6c757d;
  cursor: not-allowed;
}


@media (max-width: 768px) {
  .exposure-inputs {
    grid-template-columns: 1fr;
  }
  
  .calculator-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .input-wrapper {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}
</style>