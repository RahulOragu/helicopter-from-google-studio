
import React, { useReducer, useEffect, useCallback } from 'react';
import { SimulationState, FaultType, SensorFaults } from './types';
import { updateSimulationState } from './services/simulationService';
import { INITIAL_STATE, TICK_RATE_MS } from './constants';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ControlPanel from './components/ControlPanel';

type Action =
  | { type: 'TOGGLE_SIMULATION' }
  | { type: 'RESET_SIMULATION' }
  | { type: 'TICK' }
  | { type: 'SET_THROTTLE'; payload: number }
  | { type: 'SET_FAULT'; payload: { sensor: keyof SensorFaults; type: FaultType; value: number } };

const reducer = (state: SimulationState, action: Action): SimulationState => {
  switch (action.type) {
    case 'TOGGLE_SIMULATION':
      return { ...state, isRunning: !state.isRunning };
    case 'RESET_SIMULATION':
      return { ...INITIAL_STATE, isRunning: state.isRunning };
    case 'TICK':
      return updateSimulationState(state);
    case 'SET_THROTTLE':
      return { ...state, throttle: action.payload };
    case 'SET_FAULT':
      const newFaults = { ...state.faults, [action.payload.sensor]: {type: action.payload.type, value: action.payload.value} };
      return { ...state, faults: newFaults };
    default:
      return state;
  }
};

const App: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  useEffect(() => {
    if (!state.isRunning) {
      return;
    }
    const timer = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, TICK_RATE_MS);
    return () => clearInterval(timer);
  }, [state.isRunning]);

  const handleToggleSimulation = useCallback(() => {
    dispatch({ type: 'TOGGLE_SIMULATION' });
  }, []);
  
  const handleResetSimulation = useCallback(() => {
    dispatch({ type: 'RESET_SIMULATION' });
  }, []);

  const handleThrottleChange = useCallback((value: number) => {
    dispatch({ type: 'SET_THROTTLE', payload: value });
  }, []);

  const handleFaultChange = useCallback((sensor: keyof SensorFaults, type: FaultType, value: number) => {
      dispatch({ type: 'SET_FAULT', payload: { sensor, type, value } });
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans p-4 flex flex-col">
      <Header 
        isRunning={state.isRunning} 
        onToggle={handleToggleSimulation} 
        onReset={handleResetSimulation}
      />
      <main className="flex-grow grid grid-cols-12 gap-4 mt-4">
        <div className="col-span-12 lg:col-span-3">
          <ControlPanel 
            throttle={state.throttle}
            onThrottleChange={handleThrottleChange}
            faults={state.faults}
            onFaultChange={handleFaultChange}
          />
        </div>
        <div className="col-span-12 lg:col-span-9">
          <Dashboard state={state} />
        </div>
      </main>
    </div>
  );
};

export default App;
