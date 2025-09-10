import { ref, computed, watch } from 'vue';
import type { StepSize } from '@/data/cameraParams';
import { getCameraParams, getShutterSpeedOptions, getApertureOptions, getIsoOptions } from '@/data/cameraParams';
import { calculateEV, findEquivalentExposures, parseShutterSpeed, parseAperture, type ExposureSettings } from '@/utils/exposure';

export function useExposureCalculator() {
  // Step size configuration
  const stepSize = ref<StepSize>('1/3');
  
  // Current exposure settings
  const shutterSpeed = ref<number>(1/125);
  const aperture = ref<number>(2.8);
  const iso = ref<number>(100);
  
  // Lock states for parameters
  const shutterLocked = ref(false);
  const apertureLocked = ref(false);
  const isoLocked = ref(false);
  
  // Computed options based on step size
  const shutterSpeedOptions = computed(() => getShutterSpeedOptions(stepSize.value));
  const apertureOptions = computed(() => getApertureOptions(stepSize.value));
  const isoOptions = computed(() => getIsoOptions(stepSize.value));
  
  // Current exposure settings object
  const currentSettings = computed<ExposureSettings>(() => ({
    shutterSpeed: shutterSpeed.value,
    aperture: aperture.value,
    iso: iso.value
  }));
  
  // Calculated EV
  const currentEV = computed(() => calculateEV(currentSettings.value));
  
  // Available parameter ranges for equivalent exposures
  const parameterRanges = computed(() => {
    const params = getCameraParams(stepSize.value);
    return {
      shutterRange: params.shutterSpeeds,
      apertureRange: params.apertures,
      isoRange: params.isoValues
    };
  });
  
  // Target parameters for converter
  const targetShutter = ref<number | undefined>(undefined);
  const targetAperture = ref<number | undefined>(undefined);
  const targetIso = ref<number | undefined>(undefined);

  // Equivalent exposure combinations
  const equivalentExposures = computed(() => {
    const options = {
      ...parameterRanges.value,
      fixedShutter: targetShutter.value,
      fixedAperture: targetAperture.value,
      fixedIso: targetIso.value
    };
    
    const results = findEquivalentExposures(currentEV.value, options);
    
    // Sort by ISO first, then by shutter speed for better organization
    return results.sort((a, b) => {
      if (a.iso !== b.iso) return a.iso - b.iso;
      return a.shutterSpeed - b.shutterSpeed;
    });
  });
  
  // Methods
  function setStepSize(newStepSize: StepSize) {
    stepSize.value = newStepSize;
  }
  
  function setShutterSpeed(speed: number | string) {
    if (typeof speed === 'string') {
      shutterSpeed.value = parseShutterSpeed(speed);
    } else {
      shutterSpeed.value = speed;
    }
  }
  
  function setAperture(f: number | string) {
    if (typeof f === 'string') {
      aperture.value = parseAperture(f);
    } else {
      aperture.value = f;
    }
  }
  
  function setIso(isoValue: number) {
    iso.value = isoValue;
  }
  
  function updateTargets(targets: { shutter?: number; aperture?: number; iso?: number }) {
    targetShutter.value = targets.shutter;
    targetAperture.value = targets.aperture;
    targetIso.value = targets.iso;
  }
  
  function toggleShutterLock() {
    shutterLocked.value = !shutterLocked.value;
  }
  
  function toggleApertureLock() {
    apertureLocked.value = !apertureLocked.value;
  }
  
  function toggleIsoLock() {
    isoLocked.value = !isoLocked.value;
  }
  
  function resetLocks() {
    shutterLocked.value = false;
    apertureLocked.value = false;
    isoLocked.value = false;
  }
  
  function applyExposureSettings(settings: ExposureSettings) {
    shutterSpeed.value = settings.shutterSpeed;
    aperture.value = settings.aperture;
    iso.value = settings.iso;
  }
  
  // Watch step size changes to ensure current values are valid
  watch(stepSize, () => {
    const params = getCameraParams(stepSize.value);
    
    // Find closest valid values in new step size
    if (!params.shutterSpeeds.includes(shutterSpeed.value)) {
      const closest = findClosestValue(shutterSpeed.value, params.shutterSpeeds);
      shutterSpeed.value = closest;
    }
    
    if (!params.apertures.includes(aperture.value)) {
      const closest = findClosestValue(aperture.value, params.apertures);
      aperture.value = closest;
    }
    
    if (!params.isoValues.includes(iso.value)) {
      const closest = findClosestValue(iso.value, params.isoValues);
      iso.value = closest;
    }
  });
  
  function findClosestValue(target: number, values: number[]): number {
    return values.reduce((prev, curr) => 
      Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev
    );
  }
  
  return {
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
  };
}