export interface ExposureSettings {
  shutterSpeed: number; // in seconds
  aperture: number; // f-number
  iso: number;
}

export function calculateEV(settings: ExposureSettings): number {
  const { shutterSpeed, aperture, iso } = settings;
  
  // EV = log₂(A²/T) - log₂(S/100)
  // Where A = aperture, T = shutter time (seconds), S = ISO
  const ev = Math.log2((aperture * aperture) / shutterSpeed) - Math.log2(iso / 100);
  
  return Math.round(ev * 100) / 100; // Round to 2 decimal places
}

export function parseShutterSpeed(input: string): number {
  // Handle formats like "1/250", "0.004", "30"
  input = input.trim();
  
  if (input.includes('/')) {
    const [numerator, denominator] = input.split('/').map(Number);
    return numerator / denominator;
  }
  
  return parseFloat(input);
}

export function formatShutterSpeed(seconds: number): string {
  // Rule: >= 0.4s -> show decimals; < 0.4s -> show fractions
  if (seconds >= 0.4) {
    if (seconds >= 1) {
      return Number.isInteger(seconds) ? `${seconds}s` : `${seconds.toFixed(1)}s`;
    }
    // Between 0.4s and 1s: 1 decimal place
    return `${seconds.toFixed(1)}s`;
  }

  // Below 0.4s: show as fraction 1/N using nearest integer denominator
  const denom = Math.round(1 / seconds);
  return `1/${denom}`;
}

export function parseAperture(input: string): number {
  // Handle formats like "f/1.8", "1.8", "8"
  input = input.trim().toLowerCase();
  
  if (input.startsWith('f/')) {
    return parseFloat(input.substring(2));
  }
  
  return parseFloat(input);
}

export function formatAperture(fNumber: number): string {
  return `f/${fNumber}`;
}

export function findEquivalentExposures(baseEV: number, options: {
  fixedShutter?: number;
  fixedAperture?: number;
  fixedIso?: number;
  shutterRange?: number[];
  apertureRange?: number[];
  isoRange?: number[];
}): ExposureSettings[] {
  const equivalents: ExposureSettings[] = [];
  
  const shutterSpeeds = options.shutterRange || [];
  const apertures = options.apertureRange || [];
  const isoValues = options.isoRange || [];
  
  // If two parameters are fixed, calculate the third
  if (options.fixedShutter && options.fixedAperture) {
    const requiredIso = calculateRequiredIso(baseEV, options.fixedShutter, options.fixedAperture);
    if (requiredIso > 0) {
      equivalents.push({
        shutterSpeed: options.fixedShutter,
        aperture: options.fixedAperture,
        iso: requiredIso
      });
    }
  } else if (options.fixedShutter && options.fixedIso) {
    const requiredAperture = calculateRequiredAperture(baseEV, options.fixedShutter, options.fixedIso);
    if (requiredAperture > 0) {
      equivalents.push({
        shutterSpeed: options.fixedShutter,
        aperture: requiredAperture,
        iso: options.fixedIso
      });
    }
  } else if (options.fixedAperture && options.fixedIso) {
    const requiredShutter = calculateRequiredShutter(baseEV, options.fixedAperture, options.fixedIso);
    if (requiredShutter > 0) {
      equivalents.push({
        shutterSpeed: requiredShutter,
        aperture: options.fixedAperture,
        iso: options.fixedIso
      });
    }
  } else if (options.fixedShutter) {
    // Fixed shutter, vary aperture and ISO
    for (const aperture of apertures) {
      for (const iso of isoValues) {
        const settings = { shutterSpeed: options.fixedShutter, aperture, iso };
        const ev = calculateEV(settings);
        
        // Allow larger tolerance for floating point precision and step increments
        if (Math.abs(ev - baseEV) < 0.1) {
          equivalents.push(settings);
        }
      }
    }
  } else if (options.fixedAperture) {
    // Fixed aperture, vary shutter and ISO
    for (const shutter of shutterSpeeds) {
      for (const iso of isoValues) {
        const settings = { shutterSpeed: shutter, aperture: options.fixedAperture, iso };
        const ev = calculateEV(settings);
        
        // Allow larger tolerance for floating point precision and step increments
        if (Math.abs(ev - baseEV) < 0.1) {
          equivalents.push(settings);
        }
      }
    }
  } else if (options.fixedIso) {
    // Fixed ISO, vary shutter and aperture
    for (const shutter of shutterSpeeds) {
      for (const aperture of apertures) {
        const settings = { shutterSpeed: shutter, aperture, iso: options.fixedIso };
        const ev = calculateEV(settings);
        
        // Allow larger tolerance for floating point precision and step increments
        if (Math.abs(ev - baseEV) < 0.1) {
          equivalents.push(settings);
        }
      }
    }
  } else {
    // No parameters fixed, generate all combinations
    for (const shutter of shutterSpeeds) {
      for (const aperture of apertures) {
        for (const iso of isoValues) {
          const settings = { shutterSpeed: shutter, aperture, iso };
          const ev = calculateEV(settings);
          
          // Allow small tolerance for floating point precision
          if (Math.abs(ev - baseEV) < 0.01) {
            equivalents.push(settings);
          }
        }
      }
    }
  }
  
  return equivalents;
}

function calculateRequiredIso(targetEV: number, shutter: number, aperture: number): number {
  // EV = log₂(A²/T) - log₂(S/100)
  // log₂(S/100) = log₂(A²/T) - EV
  // S/100 = 2^(log₂(A²/T) - EV)
  // S = 100 * 2^(log₂(A²/T) - EV)
  
  const apertureComponent = Math.log2((aperture * aperture) / shutter);
  const iso = 100 * Math.pow(2, apertureComponent - targetEV);
  
  return Math.round(iso);
}

function calculateRequiredAperture(targetEV: number, shutter: number, iso: number): number {
  // EV = log₂(A²/T) - log₂(S/100)
  // log₂(A²/T) = EV + log₂(S/100)
  // A²/T = 2^(EV + log₂(S/100))
  // A² = T * 2^(EV + log₂(S/100))
  // A = sqrt(T * 2^(EV + log₂(S/100)))
  
  const isoComponent = Math.log2(iso / 100);
  const apertureSq = shutter * Math.pow(2, targetEV + isoComponent);
  const aperture = Math.sqrt(apertureSq);
  
  return Math.round(aperture * 10) / 10; // Round to 1 decimal place
}

function calculateRequiredShutter(targetEV: number, aperture: number, iso: number): number {
  // EV = log₂(A²/T) - log₂(S/100)
  // log₂(A²/T) = EV + log₂(S/100)
  // A²/T = 2^(EV + log₂(S/100))
  // T = A² / 2^(EV + log₂(S/100))
  
  const isoComponent = Math.log2(iso / 100);
  const shutter = (aperture * aperture) / Math.pow(2, targetEV + isoComponent);
  
  return Math.round(shutter * 10000) / 10000; // Round to 4 decimal places
}

export function findClosestStandardValue(target: number, standardValues: number[]): number {
  return standardValues.reduce((prev, curr) => 
    Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev
  );
}

export function roundToStandardValues(
  exposure: ExposureSettings, 
  standardShutterSpeeds: number[], 
  standardApertures: number[], 
  standardIsoValues: number[]
): ExposureSettings {
  return {
    shutterSpeed: findClosestStandardValue(exposure.shutterSpeed, standardShutterSpeeds),
    aperture: findClosestStandardValue(exposure.aperture, standardApertures),
    iso: findClosestStandardValue(exposure.iso, standardIsoValues)
  };
}
