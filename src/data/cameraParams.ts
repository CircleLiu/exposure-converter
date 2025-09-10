export type StepSize = '1/3' | '1/2' | '1';

export interface CameraParams {
  shutterSpeeds: number[];
  apertures: number[];
  isoValues: number[];
}

// Full stop values (1 stop)
const shutterSpeedsFullStop = [
  30, 15, 8, 4, 2, 1, 1/2, 1/4, 1/8, 1/15, 1/30, 1/60, 1/125, 1/250, 1/500, 1/1000, 1/2000, 1/4000
];

const aperturesFullStop = [
  1.0, 1.4, 2.0, 2.8, 4.0, 5.6, 8.0, 11, 16, 22, 32
];

const isoValuesFullStop = [
  50, 100, 200, 400, 800, 1600, 3200, 6400, 12800, 25600, 51200
];

// Half stop values (1/2 stop)
const shutterSpeedsHalfStop = [
  30, 20, 15, 10, 8, 6, 4, 3, 2, 1.5, 1, 0.7, 1/2, 1/3, 1/4, 1/6, 1/8, 1/10, 1/15, 1/20, 1/30, 1/45, 1/60, 1/90, 1/125, 1/180, 1/250, 1/350, 1/500, 1/750, 1/1000, 1/1500, 1/2000, 1/3000, 1/4000
];

const aperturesHalfStop = [
  1.0, 1.2, 1.4, 1.7, 2.0, 2.4, 2.8, 3.3, 4.0, 4.8, 5.6, 6.7, 8.0, 9.5, 11, 13, 16, 19, 22, 27, 32
];

const isoValuesHalfStop = [
  50, 70, 100, 140, 200, 280, 400, 560, 800, 1100, 1600, 2200, 3200, 4500, 6400, 9000, 12800, 18000, 25600, 36000, 51200
];

// Third stop values (1/3 stop)
const shutterSpeedsThirdStop = [
  30, 25, 20, 15, 13, 10, 8, 6, 5, 4, 3.2, 2.5, 2, 1.6, 1.3, 1, 0.8, 0.6, 1/2, 1/2.5, 1/3, 1/4, 1/5, 1/6, 1/8, 1/10, 1/13, 1/15, 1/20, 1/25, 1/30, 1/40, 1/50, 1/60, 1/80, 1/100, 1/125, 1/160, 1/200, 1/250, 1/320, 1/400, 1/500, 1/640, 1/800, 1/1000, 1/1250, 1/1600, 1/2000, 1/2500, 1/3200, 1/4000
];

const aperturesThirdStop = [
  1.0, 1.1, 1.2, 1.4, 1.6, 1.8, 2.0, 2.2, 2.5, 2.8, 3.2, 3.5, 4.0, 4.5, 5.0, 5.6, 6.3, 7.1, 8.0, 9.0, 10, 11, 13, 14, 16, 18, 20, 22, 25, 29, 32
];

const isoValuesThirdStop = [
  50, 64, 80, 100, 125, 160, 200, 250, 320, 400, 500, 640, 800, 1000, 1250, 1600, 2000, 2500, 3200, 4000, 5000, 6400, 8000, 10000, 12800, 16000, 20000, 25600, 32000, 40000, 51200
];

export function getCameraParams(stepSize: StepSize): CameraParams {
  switch (stepSize) {
    case '1':
      return {
        shutterSpeeds: shutterSpeedsFullStop,
        apertures: aperturesFullStop,
        isoValues: isoValuesFullStop
      };
    case '1/2':
      return {
        shutterSpeeds: shutterSpeedsHalfStop,
        apertures: aperturesHalfStop,
        isoValues: isoValuesHalfStop
      };
    case '1/3':
      return {
        shutterSpeeds: shutterSpeedsThirdStop,
        apertures: aperturesThirdStop,
        isoValues: isoValuesThirdStop
      };
    default:
      return getCameraParams('1/3');
  }
}

export function getShutterSpeedOptions(stepSize: StepSize): { value: number; label: string }[] {
  const params = getCameraParams(stepSize);
  return params.shutterSpeeds.map(speed => ({
    value: speed,
    label: speed >= 1 ? `${speed}s` : `1/${Math.round(1/speed)}`
  }));
}

export function getApertureOptions(stepSize: StepSize): { value: number; label: string }[] {
  const params = getCameraParams(stepSize);
  return params.apertures.map(aperture => ({
    value: aperture,
    label: `f/${aperture}`
  }));
}

export function getIsoOptions(stepSize: StepSize): { value: number; label: string }[] {
  const params = getCameraParams(stepSize);
  return params.isoValues.map(iso => ({
    value: iso,
    label: iso.toString()
  }));
}