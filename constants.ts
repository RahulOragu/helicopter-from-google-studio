
import { SimulationState, FaultType } from './types';

export const TICK_RATE_MS = 500;
export const MAX_HISTORY_POINTS = 100;

// Ardiden 1H1 Engine Parameters from documentation
export const N1_MAX_RPM = 41500;
export const N2_MAX_RPM = 22650;

export const T45_NORMAL_LIMIT_K = 1152;
export const T45_TAKEOFF_LIMIT_K = 1201;
export const T45_TRANSIENT_LIMIT_K = 1221;

export const LOW_PRESSURE_NORMAL_KPA = 300;
export const LOW_PRESSURE_RANGE_KPA: [number, number] = [200, 400];

export const HIGH_PRESSURE_NORMAL_MPA = 7.0;
export const HIGH_PRESSURE_RANGE_MPA: [number, number] = [5.5, 8.3];

export const FUEL_TANK_CAPACITY_L = 1400;

export const FILTER_CLOG_WARNING_KPA = 39.2;
export const FILTER_CLOG_MAX_KPA = 47.1;

export const INITIAL_STATE: SimulationState = {
  isRunning: false,
  time: 0,
  throttle: 0,
  trueState: {
    n1_rpm: 0,
    n2_rpm: 0,
    t45_temp_k: 293, // Ambient temp
    fuelFlow_lph: 0,
    lowPressure_kpa: 0,
    highPressure_mpa: 0,
    fuelQuantity_l: FUEL_TANK_CAPACITY_L,
    filterDiffPressure_kpa: 5,
  },
  sensedState: {
    n1_rpm: 0,
    n2_rpm: 0,
    t45_temp_k: 293,
    fuelFlow_lph: 0,
    lowPressure_kpa: 0,
    highPressure_mpa: 0,
    fuelQuantity_l: FUEL_TANK_CAPACITY_L,
    filterDiffPressure_kpa: 5,
  },
  faults: {
    n1: { type: FaultType.NONE, value: 0 },
    n2: { type: FaultType.NONE, value: 0 },
    t45: { type: FaultType.NONE, value: 0 },
    fuelFlow: { type: FaultType.NONE, value: 0 },
    lowPressure: { type: FaultType.NONE, value: 0 },
    highPressure: { type: FaultType.NONE, value: 0 },
    fuelQuantity: { type: FaultType.NONE, value: 0 },
    filterDiffPressure: { type: FaultType.NONE, value: 0 },
  },
  health: {
    boostPump: 100,
    highPressurePump: 100,
    fuelFilter: 100,
    injectors: 100,
    fadec: 100,
    overall: 100,
  },
  logs: [{ timestamp: new Date().toLocaleTimeString(), message: 'Simulation initialized.', type: 'info' }],
  history: [],
};

export const SENSOR_OPTIONS = [
    { value: 'n1', label: 'N1 RPM' },
    { value: 'n2', label: 'N2 RPM' },
    { value: 't45', label: 'T45 Temp (K)' },
    { value: 'fuelFlow', label: 'Fuel Flow (L/hr)' },
    { value: 'lowPressure', label: 'Low Pressure (kPa)' },
    { value: 'highPressure', label: 'High Pressure (MPa)' },
    { value: 'fuelQuantity', label: 'Fuel Quantity (L)' },
    { value: 'filterDiffPressure', label: 'Filter dP (kPa)' },
];
