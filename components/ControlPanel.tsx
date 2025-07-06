
import React, { useState } from 'react';
import { FaultType, SensorFaults } from '../types';
import { SENSOR_OPTIONS } from '../constants';

interface ControlPanelProps {
    throttle: number;
    onThrottleChange: (value: number) => void;
    faults: SensorFaults;
    onFaultChange: (sensor: keyof SensorFaults, type: FaultType, value: number) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ throttle, onThrottleChange, faults, onFaultChange }) => {
    const [selectedSensor, setSelectedSensor] = useState<keyof SensorFaults>('n1');
    const currentFault = faults[selectedSensor];

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value as FaultType;
        onFaultChange(selectedSensor, newType, currentFault.value);
    };

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(e.target.value) || 0;
        onFaultChange(selectedSensor, currentFault.type, newValue);
    };

    return (
        <div className="bg-slate-800 p-4 rounded-lg shadow-lg h-full flex flex-col space-y-6">
            <div>
                <h2 className="text-xl font-bold mb-4 text-cyan-400">Controls</h2>
                <div className="space-y-4">
                    <label htmlFor="throttle" className="block font-semibold">Throttle: {throttle}%</label>
                    <input
                        id="throttle"
                        type="range"
                        min="0"
                        max="100"
                        value={throttle}
                        onChange={(e) => onThrottleChange(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
            </div>

            <div className="flex-grow">
                <h2 className="text-xl font-bold mb-4 text-cyan-400">Fault Injection</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="sensor-select" className="block font-semibold mb-2">Target Sensor</label>
                        <select
                            id="sensor-select"
                            value={selectedSensor}
                            onChange={(e) => setSelectedSensor(e.target.value as keyof SensorFaults)}
                            className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md"
                        >
                            {SENSOR_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="fault-type" className="block font-semibold mb-2">Fault Type</label>
                        <select
                            id="fault-type"
                            value={currentFault.type}
                            onChange={handleTypeChange}
                             className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md"
                        >
                            {Object.values(FaultType).map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                    </div>
                    {currentFault.type !== FaultType.NONE && (
                        <div>
                             <label htmlFor="fault-value" className="block font-semibold mb-2">Fault Value</label>
                             <input
                                id="fault-value"
                                type="number"
                                step="any"
                                value={currentFault.value}
                                onChange={handleValueChange}
                                className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md"
                                placeholder={currentFault.type === FaultType.CLOG ? "Clog rate/tick" : "Value"}
                            />
                        </div>
                    )}
                </div>
            </div>
             <div className="text-xs text-slate-400 mt-4">
                <p><span className="font-bold">Note:</span> Inject faults to simulate sensor malfunctions or component degradation. Changes are applied in real-time during simulation.</p>
            </div>
        </div>
    );
};

export default React.memo(ControlPanel);
