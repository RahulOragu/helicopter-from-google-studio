import { SimulationState, FaultType, FaultConfig, TrueState, SensedState, ComponentHealth, LogEntry, TimeSeriesData } from '../types';
import { N1_MAX_RPM, N2_MAX_RPM, LOW_PRESSURE_NORMAL_KPA, HIGH_PRESSURE_NORMAL_MPA, T45_NORMAL_LIMIT_K, FUEL_TANK_CAPACITY_L, FILTER_CLOG_WARNING_KPA, TICK_RATE_MS, MAX_HISTORY_POINTS } from '../constants';

// --- Sensor Fault Application ---
const applyFault = (trueValue: number, fault: FaultConfig, time: number): number => {
  switch (fault.type) {
    case FaultType.BIAS:
      return trueValue + fault.value;
    case FaultType.DRIFT:
      // drift adds 'value' units per minute
      return trueValue + fault.value * (time / 60);
    case FaultType.STUCK:
      return fault.value;
    case FaultType.NOISE:
      return trueValue + (Math.random() - 0.5) * fault.value;
    case FaultType.NONE:
    case FaultType.CLOG: // Clog is handled in physics, not as a sensor fault
    default:
      return trueValue;
  }
};

// --- Physics & System Logic ---
const updateTrueState = (prevState: SimulationState): { nextTrueState: TrueState, fuelConsumed: number } => {
  const { throttle, trueState, faults } = prevState;
  const next = { ...trueState };
  
  const throttleFactor = throttle / 100;
  
  // N1 and N2 RPM
  const targetN1 = N1_MAX_RPM * 0.2 + (N1_MAX_RPM * 0.8 * throttleFactor);
  next.n1_rpm = lerp(next.n1_rpm, targetN1, 0.1);
  next.n2_rpm = lerp(next.n2_rpm, next.n1_rpm * (N2_MAX_RPM / N1_MAX_RPM), 0.2);

  const n1Factor = next.n1_rpm / N1_MAX_RPM;

  // Pressures
  next.lowPressure_kpa = lerp(next.lowPressure_kpa, next.n1_rpm > 1000 ? LOW_PRESSURE_NORMAL_KPA : 0, 0.3);
  next.highPressure_mpa = lerp(next.highPressure_mpa, n1Factor * HIGH_PRESSURE_NORMAL_MPA * 1.2, 0.2);
  
  // Fuel Flow
  next.fuelFlow_lph = Math.max(0, next.highPressure_mpa / HIGH_PRESSURE_NORMAL_MPA * 200 * throttleFactor);
  const fuelConsumed = next.fuelFlow_lph * (TICK_RATE_MS / (1000 * 3600));
  next.fuelQuantity_l = Math.max(0, next.fuelQuantity_l - fuelConsumed);

  // Temperature
  const baseTemp = 293;
  const tempRise = (T45_NORMAL_LIMIT_K - baseTemp) * n1Factor * 1.1;
  next.t45_temp_k = lerp(next.t45_temp_k, baseTemp + tempRise, 0.15);

  // Filter Differential Pressure (Simulates clogging over time)
  if (faults.filterDiffPressure.type === FaultType.CLOG) {
      const clogRate = faults.filterDiffPressure.value / 1000; // Value as severity
      next.filterDiffPressure_kpa += clogRate;
  } else {
     // Normal operation, pressure drop proportional to flow
     next.filterDiffPressure_kpa = 5 + (next.fuelFlow_lph / 279) * 15;
  }

  // Clamp values to realistic minimums
  Object.keys(next).forEach((key) => {
    const k = key as keyof TrueState;
    if (next[k] < 0) next[k] = 0;
  });

  return { nextTrueState: next, fuelConsumed };
};

// --- Health Calculation ---
const calculateHealth = (state: TrueState, logs: LogEntry[]): { health: ComponentHealth, newLogs: LogEntry[] } => {
  const health: ComponentHealth = { boostPump: 100, highPressurePump: 100, fuelFilter: 100, injectors: 100, fadec: 100, overall: 100 };
  const newLogs: LogEntry[] = [];

  // Filter Health
  const filterHealthDrop = (state.filterDiffPressure_kpa / FILTER_CLOG_WARNING_KPA) * 50;
  health.fuelFilter = Math.max(0, 100 - filterHealthDrop);
  if (state.filterDiffPressure_kpa > FILTER_CLOG_WARNING_KPA) {
    newLogs.push({ timestamp: new Date().toLocaleTimeString(), message: `High filter pressure drop: ${state.filterDiffPressure_kpa.toFixed(1)} kPa`, type: 'warning' });
  }

  // Pump Health
  if (state.lowPressure_kpa < 200 && state.n1_rpm > 5000) health.boostPump -= 1; else health.boostPump += 0.5;
  if (state.highPressure_mpa < 5.5 && state.n1_rpm > 20000) health.highPressurePump -= 1; else health.highPressurePump += 0.5;
  
  // Injector Health (inferred from Temp/Flow mismatch)
  const expectedTemp = 293 + (T45_NORMAL_LIMIT_K - 293) * (state.n1_rpm / N1_MAX_RPM) * 1.1;
  if (Math.abs(state.t45_temp_k - expectedTemp) > 50) {
      health.injectors -= 0.5;
      newLogs.push({ timestamp: new Date().toLocaleTimeString(), message: 'Potential injector issue detected (T45 deviation).', type: 'warning' });
  } else {
      health.injectors += 0.2;
  }
  
  // Clamp health values
  Object.keys(health).forEach(k => {
    const key = k as keyof ComponentHealth;
    health[key] = Math.max(0, Math.min(100, health[key]));
  });

  health.overall = (health.boostPump + health.highPressurePump + health.fuelFilter + health.injectors) / 4;

  return { health, newLogs };
};


// --- Main Update Function ---
export const updateSimulationState = (prevState: SimulationState): SimulationState => {
  if (!prevState.isRunning) return prevState;

  const nextTime = prevState.time + (TICK_RATE_MS / 1000);

  // 1. Update Physics
  const { nextTrueState, fuelConsumed } = updateTrueState(prevState);

  // 2. Apply Sensor Faults
  const nextSensedState: SensedState = {
    n1_rpm: applyFault(nextTrueState.n1_rpm, prevState.faults.n1, nextTime),
    n2_rpm: applyFault(nextTrueState.n2_rpm, prevState.faults.n2, nextTime),
    t45_temp_k: applyFault(nextTrueState.t45_temp_k, prevState.faults.t45, nextTime),
    fuelFlow_lph: applyFault(nextTrueState.fuelFlow_lph, prevState.faults.fuelFlow, nextTime),
    lowPressure_kpa: applyFault(nextTrueState.lowPressure_kpa, prevState.faults.lowPressure, nextTime),
    highPressure_mpa: applyFault(nextTrueState.highPressure_mpa, prevState.faults.highPressure, nextTime),
    fuelQuantity_l: applyFault(nextTrueState.fuelQuantity_l, prevState.faults.fuelQuantity, nextTime),
    filterDiffPressure_kpa: applyFault(nextTrueState.filterDiffPressure_kpa, prevState.faults.filterDiffPressure, nextTime),
  };

  // 3. Calculate Health and generate logs
  const { health, newLogs } = calculateHealth(nextTrueState, prevState.logs);

  // 4. Update History
  const newHistoryPoint: TimeSeriesData = {
      time: Math.floor(nextTime),
      'N1 RPM': nextSensedState.n1_rpm,
      'Fuel Flow': nextSensedState.fuelFlow_lph,
      'HP (MPa)': nextSensedState.highPressure_mpa,
      'T45 (K)': nextSensedState.t45_temp_k,
  };
  const nextHistory = [...prevState.history, newHistoryPoint].slice(-MAX_HISTORY_POINTS);

  const allNewLogs = [...prevState.logs, ...newLogs].slice(-50);


  return {
    ...prevState,
    time: nextTime,
    trueState: nextTrueState,
    sensedState: nextSensedState,
    health: health,
    logs: allNewLogs,
    history: nextHistory,
  };
};

function lerp(start: number, end: number, amt: number): number {
  return (1 - amt) * start + amt * end;
}