
export enum FaultType {
  NONE = 'None',
  BIAS = 'Bias/Offset',
  DRIFT = 'Drift',
  STUCK = 'Stuck-at-Value',
  NOISE = 'Noise',
  CLOG = 'Progressive Clog',
}

export interface FaultConfig {
  type: FaultType;
  value: number;
}

export interface SensorFaults {
  n1: FaultConfig;
  n2: FaultConfig;
  t45: FaultConfig;
  fuelFlow: FaultConfig;
  lowPressure: FaultConfig;
  highPressure: FaultConfig;
  fuelQuantity: FaultConfig;
  filterDiffPressure: FaultConfig;
}

export interface TrueState {
  n1_rpm: number;
  n2_rpm: number;
  t45_temp_k: number;
  fuelFlow_lph: number;
  lowPressure_kpa: number;
  highPressure_mpa: number;
  fuelQuantity_l: number;
  filterDiffPressure_kpa: number;
}

export interface SensedState extends TrueState {}

export interface ComponentHealth {
  boostPump: number;
  highPressurePump: number;
  fuelFilter: number;
  injectors: number;
  fadec: number;
  overall: number;
}

export interface LogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'warning' | 'alert';
}

export interface TimeSeriesData {
  time: number;
  [key: string]: number;
}

export interface SimulationState {
  isRunning: boolean;
  time: number;
  throttle: number; // 0-100
  trueState: TrueState;
  sensedState: SensedState;
  faults: SensorFaults;
  health: ComponentHealth;
  logs: LogEntry[];
  history: TimeSeriesData[];
}
