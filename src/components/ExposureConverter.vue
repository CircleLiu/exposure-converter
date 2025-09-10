<template>
  <div class="exposure-converter">
    <div class="converter-header">
      <h2>Equivalent Exposure Combinations</h2>
      <div class="converter-info">
        <span class="converter-desc">Set target values for parameters you want to fix</span>
      </div>
    </div>
    
    <!-- Target Parameter Settings -->
    <div class="converter-controls">
      <h3>Target Parameter Settings</h3>
      <div class="target-inputs">
        <div class="target-group">
          <label for="target-shutter">Target Shutter Speed</label>
          <div class="target-input-wrapper">
            <select 
              id="target-shutter"
              v-model="targetShutter" 
              class="target-select"
            >
              <option value="">Any (not fixed)</option>
              <option v-for="option in shutterSpeedOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
            <input 
              type="text" 
              v-model="targetShutterInput"
              @blur="handleTargetShutterInput"
              @keyup.enter="handleTargetShutterInput"
              class="target-input"
              placeholder="e.g., 1/250"
            />
          </div>
        </div>
        
        <div class="target-group">
          <label for="target-aperture">Target Aperture</label>
          <div class="target-input-wrapper">
            <select 
              id="target-aperture"
              v-model="targetAperture" 
              class="target-select"
            >
              <option value="">Any (not fixed)</option>
              <option v-for="option in apertureOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
            <input 
              type="text" 
              v-model="targetApertureInput"
              @blur="handleTargetApertureInput"
              @keyup.enter="handleTargetApertureInput"
              class="target-input"
              placeholder="e.g., 8"
            />
          </div>
        </div>
        
        <div class="target-group">
          <label for="target-iso">Target ISO</label>
          <div class="target-input-wrapper">
            <select 
              id="target-iso"
              v-model="targetIso" 
              class="target-select"
            >
              <option value="">Any (not fixed)</option>
              <option v-for="option in isoOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
            <input 
              type="number" 
              v-model.number="targetIsoInput"
              @blur="handleTargetIsoInput"
              @keyup.enter="handleTargetIsoInput"
              class="target-input"
              placeholder="e.g., 400"
            />
          </div>
        </div>
      </div>
      
      <div class="converter-actions">
        <button @click="clearAllTargets" class="clear-btn">
          Clear All Targets
        </button>
        <div class="fixed-params-info">
          <span v-if="fixedParamsCount === 0">No parameters fixed</span>
          <span v-else-if="fixedParamsCount === 1">1 parameter fixed</span>
          <span v-else-if="fixedParamsCount === 2">2 parameters fixed</span>
          <span v-else>All parameters are fixed</span>
        </div>
      </div>
    </div>
    
    <div v-if="equivalentExposures.length === 0" class="no-results">
      <p>No equivalent exposures found with current settings.</p>
      <p class="hint">Try adjusting your target parameters or step size.</p>
    </div>
    
    <div v-else class="results-container">
      <div class="results-header">
        <span class="results-count">{{ equivalentExposures.length }} equivalent combinations</span>
        <div class="view-controls">
          <button 
            @click="viewMode = 'table'" 
            :class="['view-btn', { active: viewMode === 'table' }]"
          >
            Table
          </button>
          <button 
            @click="viewMode = 'cards'" 
            :class="['view-btn', { active: viewMode === 'cards' }]"
          >
            Cards
          </button>
        </div>
      </div>
      
      <!-- Table View -->
      <div v-if="viewMode === 'table'" class="table-view">
        <table class="exposure-table">
          <thead>
            <tr>
              <th>Shutter Speed</th>
              <th>Aperture</th>
              <th>ISO</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(exposure, index) in equivalentExposures" 
              :key="index"
              :class="{ 'current-exposure': isCurrentExposure(exposure) }"
            >
              <td class="shutter-cell">
                {{ formatShutterSpeed(exposure.shutterSpeed) }}
                <span v-if="targetShutter !== ''" class="fixed-indicator">📌</span>
              </td>
              <td class="aperture-cell">
                f/{{ exposure.aperture }}
                <span v-if="targetAperture !== ''" class="fixed-indicator">📌</span>
              </td>
              <td class="iso-cell">
                {{ exposure.iso }}
                <span v-if="targetIso !== ''" class="fixed-indicator">📌</span>
              </td>
              <td class="action-cell">
                <button 
                  @click="applyExposure(exposure)"
                  class="apply-btn"
                  :disabled="isCurrentExposure(exposure)"
                >
                  {{ isCurrentExposure(exposure) ? 'Current' : 'Apply' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Cards View -->
      <div v-if="viewMode === 'cards'" class="cards-view">
        <div 
          v-for="(exposure, index) in equivalentExposures" 
          :key="index"
          :class="['exposure-card', { 'current-exposure': isCurrentExposure(exposure) }]"
        >
          <div class="card-content">
            <div class="param-value">
              <span class="param-label">Shutter</span>
              <span class="param-data">
                {{ formatShutterSpeed(exposure.shutterSpeed) }}
                <span v-if="targetShutter !== ''" class="fixed-indicator">📌</span>
              </span>
            </div>
            <div class="param-value">
              <span class="param-label">Aperture</span>
              <span class="param-data">
                f/{{ exposure.aperture }}
                <span v-if="targetAperture !== ''" class="fixed-indicator">📌</span>
              </span>
            </div>
            <div class="param-value">
              <span class="param-label">ISO</span>
              <span class="param-data">
                {{ exposure.iso }}
                <span v-if="targetIso !== ''" class="fixed-indicator">📌</span>
              </span>
            </div>
          </div>
          <button 
            @click="applyExposure(exposure)"
            class="apply-btn"
            :disabled="isCurrentExposure(exposure)"
          >
            {{ isCurrentExposure(exposure) ? 'Current' : 'Apply' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { formatShutterSpeed, parseShutterSpeed, parseAperture, type ExposureSettings } from '@/utils/exposure';

interface Props {
  equivalentExposures: ExposureSettings[];
  currentExposure: ExposureSettings;
  currentEV: number;
  shutterSpeedOptions: { value: number; label: string }[];
  apertureOptions: { value: number; label: string }[];
  isoOptions: { value: number; label: string }[];
}

interface Emits {
  (e: 'applyExposure', exposure: ExposureSettings): void;
  (e: 'updateTargets', targets: { shutter?: number; aperture?: number; iso?: number }): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const viewMode = ref<'table' | 'cards'>('table');

// Target parameter values
const targetShutter = ref<number | ''>('');
const targetAperture = ref<number | ''>('');
const targetIso = ref<number | ''>('');

// Input fields for manual entry
const targetShutterInput = ref('');
const targetApertureInput = ref('');
const targetIsoInput = ref<number | ''>('');

const fixedParamsCount = computed(() => {
  let count = 0;
  if (targetShutter.value !== '') count++;
  if (targetAperture.value !== '') count++;
  if (targetIso.value !== '') count++;
  return count;
});

// Watch target changes and emit to parent
watch([targetShutter, targetAperture, targetIso], () => {
  const targets: { shutter?: number; aperture?: number; iso?: number } = {};
  if (targetShutter.value !== '') targets.shutter = targetShutter.value;
  if (targetAperture.value !== '') targets.aperture = targetAperture.value;
  if (targetIso.value !== '') targets.iso = targetIso.value;
  emit('updateTargets', targets);
}, { deep: true });

function handleTargetShutterInput() {
  if (targetShutterInput.value.trim() === '') {
    targetShutter.value = '';
    return;
  }
  
  try {
    const speed = parseShutterSpeed(targetShutterInput.value);
    if (!isNaN(speed) && speed > 0) {
      targetShutter.value = speed;
    }
  } catch (error) {
    targetShutterInput.value = '';
  }
}

function handleTargetApertureInput() {
  if (targetApertureInput.value.trim() === '') {
    targetAperture.value = '';
    return;
  }
  
  try {
    const aperture = parseAperture(targetApertureInput.value);
    if (!isNaN(aperture) && aperture > 0) {
      targetAperture.value = aperture;
    }
  } catch (error) {
    targetApertureInput.value = '';
  }
}

function handleTargetIsoInput() {
  if (targetIsoInput.value === '' || targetIsoInput.value === null) {
    targetIso.value = '';
    return;
  }
  
  const iso = Number(targetIsoInput.value);
  if (!isNaN(iso) && iso > 0) {
    targetIso.value = iso;
  } else {
    targetIsoInput.value = '';
  }
}

function clearAllTargets() {
  targetShutter.value = '';
  targetAperture.value = '';
  targetIso.value = '';
  targetShutterInput.value = '';
  targetApertureInput.value = '';
  targetIsoInput.value = '';
}

function isCurrentExposure(exposure: ExposureSettings): boolean {
  return (
    Math.abs(exposure.shutterSpeed - props.currentExposure.shutterSpeed) < 0.0001 &&
    Math.abs(exposure.aperture - props.currentExposure.aperture) < 0.1 &&
    exposure.iso === props.currentExposure.iso
  );
}

function applyExposure(exposure: ExposureSettings) {
  emit('applyExposure', exposure);
}

// Sync input fields with select values
watch(targetShutter, (newVal) => {
  if (newVal !== '' && typeof newVal === 'number') {
    targetShutterInput.value = formatShutterSpeed(newVal);
  } else if (newVal === '') {
    targetShutterInput.value = '';
  }
});

watch(targetAperture, (newVal) => {
  if (newVal !== '' && typeof newVal === 'number') {
    targetApertureInput.value = newVal.toString();
  } else if (newVal === '') {
    targetApertureInput.value = '';
  }
});

watch(targetIso, (newVal) => {
  if (newVal !== '' && typeof newVal === 'number') {
    targetIsoInput.value = newVal;
  } else if (newVal === '') {
    targetIsoInput.value = '';
  }
});
</script>

<style scoped>
.exposure-converter {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.converter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.converter-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.converter-desc {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.converter-controls {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
}

.converter-controls h3 {
  margin: 0 0 16px 0;
  color: #495057;
  font-size: 1.1rem;
}

.target-inputs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.target-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.target-group label {
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
}

.target-input-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.target-select,
.target-input {
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: border-color 0.2s ease;
}

.target-select:focus,
.target-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.converter-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.clear-btn {
  padding: 10px 20px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
}

.clear-btn:hover {
  background: #5a6268;
}

.fixed-params-info {
  color: #495057;
  font-size: 0.9rem;
  font-weight: 500;
}

.no-results {
  text-align: center;
  padding: 40px 20px;
  color: #7f8c8d;
}

.no-results .hint {
  font-size: 0.9rem;
  margin-top: 8px;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.results-count {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.view-controls {
  display: flex;
  gap: 4px;
}

.view-btn {
  padding: 8px 16px;
  border: 2px solid #e9ecef;
  background: white;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.view-btn:first-child {
  border-radius: 6px 0 0 6px;
}

.view-btn:last-child {
  border-radius: 0 6px 6px 0;
}

.view-btn.active {
  background: #3498db;
  border-color: #3498db;
  color: white;
}

/* Table View Styles */
.exposure-table {
  width: 100%;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.exposure-table th {
  background: #f8f9fa;
  padding: 16px 12px;
  text-align: left;
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
}

.exposure-table td {
  padding: 16px 12px;
  border-bottom: 1px solid #e9ecef;
  vertical-align: middle;
}

.exposure-table tr:hover {
  background: #f8f9fa;
}

.exposure-table tr.current-exposure {
  background: #e3f2fd;
}

.exposure-table tr.current-exposure:hover {
  background: #e3f2fd;
}

.fixed-indicator {
  margin-left: 8px;
  opacity: 0.7;
  font-size: 0.8rem;
}

.apply-btn {
  padding: 8px 16px;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
}

.apply-btn:hover:not(:disabled) {
  background: #229954;
}

.apply-btn:disabled {
  background: #95a5a6;
  cursor: not-allowed;
}

/* Cards View Styles */
.cards-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.exposure-card {
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  background: white;
  transition: all 0.2s ease;
}

.exposure-card:hover {
  border-color: #3498db;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.exposure-card.current-exposure {
  border-color: #2196f3;
  background: #e3f2fd;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.param-value {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.param-label {
  font-weight: 600;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.param-data {
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
}

@media (max-width: 768px) {
  .converter-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .target-inputs {
    grid-template-columns: 1fr;
  }
  
  .target-input-wrapper {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .converter-actions {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .results-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .view-controls {
    justify-content: center;
  }
  
  .cards-view {
    grid-template-columns: 1fr;
  }
  
  .exposure-table {
    font-size: 0.9rem;
  }
  
  .exposure-table th,
  .exposure-table td {
    padding: 12px 8px;
  }
}
</style>