<script setup lang="ts">
import { useExposureCalculator } from '@/composables/useExposureCalculator';
import StepSizeSelector from '@/components/StepSizeSelector.vue';
import EVCalculator from '@/components/EVCalculator.vue';
import ExposureConverter from '@/components/ExposureConverter.vue';

const {
  // State
  stepSize,
  shutterSpeed,
  aperture,
  iso,
  shutterLocked,
  apertureLocked,
  isoLocked,
  
  // Computed
  shutterSpeedOptions,
  apertureOptions,
  isoOptions,
  currentSettings,
  currentEV,
  equivalentExposures,
  
  // Methods
  setStepSize,
  setShutterSpeed,
  setAperture,
  setIso,
  updateTargets,
  toggleShutterLock,
  toggleApertureLock,
  toggleIsoLock,
  resetLocks,
  applyExposureSettings
} = useExposureCalculator();
</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1 class="app-title">Camera Exposure Calculator</h1>
      <p class="app-subtitle">Calculate exposure values and find equivalent exposure combinations</p>
    </header>
    
    <main class="main-content">
      <StepSizeSelector 
        v-model="stepSize"
        @update:modelValue="setStepSize"
      />
      
      <EVCalculator
        :shutterSpeed="shutterSpeed"
        :aperture="aperture" 
        :iso="iso"
        :currentEV="currentEV"
        :shutterSpeedOptions="shutterSpeedOptions"
        :apertureOptions="apertureOptions"
        :isoOptions="isoOptions"
        @update:shutterSpeed="setShutterSpeed"
        @update:aperture="setAperture"
        @update:iso="setIso"
      />
      
      <ExposureConverter
        :equivalentExposures="equivalentExposures"
        :currentExposure="currentSettings"
        :currentEV="currentEV"
        :shutterSpeedOptions="shutterSpeedOptions"
        :apertureOptions="apertureOptions"
        :isoOptions="isoOptions"
        @applyExposure="applyExposureSettings"
        @updateTargets="updateTargets"
      />
    </main>
    
    <footer class="app-footer">
      <p>Camera Exposure Calculator • Built with Vue 3 and TypeScript</p>
    </footer>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

#app {
  min-height: 100vh;
}
</style>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 32px 24px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.app-title {
  margin: 0 0 8px 0;
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.app-subtitle {
  margin: 0;
  font-size: 1.1rem;
  color: #7f8c8d;
  font-weight: 400;
}

.main-content {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
  width: 100%;
}

.app-footer {
  background: rgba(0, 0, 0, 0.1);
  padding: 20px 24px;
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.app-footer p {
  margin: 0;
}

@media (max-width: 768px) {
  .app-title {
    font-size: 2rem;
  }
  
  .app-subtitle {
    font-size: 1rem;
  }
  
  .main-content {
    padding: 20px 16px;
  }
  
  .app-header {
    padding: 24px 16px;
  }
}

@media (max-width: 480px) {
  .app-title {
    font-size: 1.75rem;
  }
  
  .app-subtitle {
    font-size: 0.95rem;
  }
}
</style>
