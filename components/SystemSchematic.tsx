
import React from 'react';
import { SimulationState } from '../types';
import { HIGH_PRESSURE_RANGE_MPA, LOW_PRESSURE_RANGE_KPA } from '../constants';

interface SystemSchematicProps {
    state: SimulationState;
}

const StatusIndicator: React.FC<{ x: number, y: number, active: boolean, label: string }> = ({ x, y, active, label }) => (
    <g transform={`translate(${x}, ${y})`}>
        <circle cx="0" cy="0" r="10" fill={active ? "#4ade80" : "#475569"} stroke="#1e293b" strokeWidth="2" />
        <text x="15" y="5" fill="#cbd5e1" fontSize="12" >{label}</text>
    </g>
);

const FuelComponent: React.FC<{ x: number, y: number, width: number, height: number, label: string, status?: 'ok' | 'warn' | 'fail' }> = ({ x, y, width, height, label, status = 'ok' }) => {
    const statusColors = {
        ok: "#3b82f6", // blue
        warn: "#facc15", // yellow
        fail: "#ef4444" // red
    };
    return (
        <g>
            <rect x={x} y={y} width={width} height={height} fill="#334155" stroke={statusColors[status]} strokeWidth="2" rx="5" />
            <text x={x + width / 2} y={y + height / 2 + 5} textAnchor="middle" fill="white" fontSize="12">{label}</text>
        </g>
    );
};


const SystemSchematic: React.FC<SystemSchematicProps> = ({ state }) => {
    const { trueState, health } = state;

    const getPressureColor = (pressure: number, range: [number, number]) => {
        if (pressure < range[0] && pressure > 1) return "#facc15"; // warn
        if (pressure > range[1]) return "#ef4444"; // fail
        if (pressure <= 1) return "#475569"; // off
        return "#22d3ee"; // ok
    };
    
    const lpColor = getPressureColor(trueState.lowPressure_kpa, LOW_PRESSURE_RANGE_KPA);
    const hpColor = getPressureColor(trueState.highPressure_mpa, HIGH_PRESSURE_RANGE_MPA);

    const getFilterStatus = (): 'ok' | 'warn' | 'fail' => {
        if (health.fuelFilter < 50) return 'fail';
        if (health.fuelFilter < 80) return 'warn';
        return 'ok';
    };

    const flowSpeed = Math.min(10, Math.max(1, 10 - state.trueState.fuelFlow_lph / 30));
    
    return (
        <div className="w-full h-full">
            <h3 className="text-lg font-semibold text-slate-300 mb-2">Fuel System Schematic</h3>
            <svg viewBox="0 0 600 300" className="w-full h-full">
                <defs>
                    <style>
                        {`
                        .flow-anim {
                            stroke-dasharray: 5;
                            animation: dash ${flowSpeed}s linear infinite;
                        }
                        @keyframes dash {
                            to {
                                stroke-dashoffset: 100;
                            }
                        }
                        `}
                    </style>
                </defs>
                {/* Paths */}
                <path d="M 50 150 Q 80 150, 100 120" stroke={lpColor} strokeWidth="4" fill="none" className={trueState.fuelFlow_lph > 1 ? "flow-anim": ""} />
                <path d="M 100 80 V 50" stroke={lpColor} strokeWidth="4" fill="none" />
                <path d="M 180 50 H 220" stroke={lpColor} strokeWidth="4" fill="none" className={trueState.fuelFlow_lph > 1 ? "flow-anim": ""} />
                <path d="M 300 50 H 340" stroke={hpColor} strokeWidth="4" fill="none" className={trueState.fuelFlow_lph > 1 ? "flow-anim": ""} />
                <path d="M 420 50 H 460" stroke={hpColor} strokeWidth="4" fill="none" className={trueState.fuelFlow_lph > 1 ? "flow-anim": ""}/>
                
                {/* Manifold and Injectors */}
                <path d="M 540 50 V 20" stroke={hpColor} strokeWidth="4" fill="none" />
                <path d="M 540 50 V 80" stroke={hpColor} strokeWidth="4" fill="none" />
                <path d="M 540 50 V 110" stroke={hpColor} strokeWidth="4" fill="none" />
                <path d="M 540 50 V 140" stroke={hpColor} strokeWidth="4" fill="none" />

                {/* Components */}
                <FuelComponent x={20} y={150} width={60} height={80} label="Fuel Tank" />
                <StatusIndicator x={100} y={50} active={health.boostPump > 80} label="Boost Pump" />
                <FuelComponent x={220} y={30} width={80} height={40} label="Fuel Filter" status={getFilterStatus()} />
                <FuelComponent x={340} y={30} width={80} height={40} label="HP Pump" status={health.highPressurePump > 80 ? 'ok' : 'warn'} />
                <FuelComponent x={460} y={30} width={80} height={40} label="FADEC/FCU" status={health.fadec > 80 ? 'ok' : 'warn'} />
               
                {/* Injectors */}
                <FuelComponent x={550} y={10} width={40} height={20} label="Inj 1" />
                <FuelComponent x={550} y={70} width={40} height={20} label="Inj 2" />
                <FuelComponent x={550} y={100} width={40} height={20} label="Inj 3" />
                <FuelComponent x={550} y={130} width={40} height={20} label="Inj 4" />

                <text x="500" y={200} fill="#cbd5e1" fontSize="12">LP: {trueState.lowPressure_kpa.toFixed(0)} kPa</text>
                <text x="500" y={220} fill="#cbd5e1" fontSize="12">HP: {trueState.highPressure_mpa.toFixed(2)} MPa</text>
                <text x="500" y={240} fill="#cbd5e1" fontSize="12">Flow: {trueState.fuelFlow_lph.toFixed(0)} L/hr</text>
            </svg>
        </div>
    );
};

export default React.memo(SystemSchematic);
