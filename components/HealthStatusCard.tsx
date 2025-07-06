
import React from 'react';
import { ComponentHealth } from '../types';

interface HealthStatusCardProps {
    health: ComponentHealth;
}

const HealthBar: React.FC<{ label: string; value: number }> = ({ label, value }) => {
    const colorClass = value > 80 ? 'bg-green-500' : value > 50 ? 'bg-yellow-500' : 'bg-red-500';
    return (
        <div>
            <div className="flex justify-between mb-1">
                <span className="text-base font-medium text-slate-300">{label}</span>
                <span className={`text-sm font-medium ${value > 80 ? 'text-green-400' : value > 50 ? 'text-yellow-400' : 'text-red-400'}`}>{value.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2.5">
                <div className={`${colorClass} h-2.5 rounded-full transition-all duration-300`} style={{ width: `${value}%` }}></div>
            </div>
        </div>
    );
};

const HealthStatusCard: React.FC<HealthStatusCardProps> = ({ health }) => {
    return (
        <div className="bg-slate-800 p-4 rounded-lg shadow-lg h-full">
            <h3 className="text-lg font-semibold text-slate-300 mb-4">Component Health Status</h3>
            <div className="space-y-3">
                <HealthBar label="Overall System" value={health.overall} />
                <HealthBar label="Boost Pump" value={health.boostPump} />
                <HealthBar label="HP Fuel Pump" value={health.highPressurePump} />
                <HealthBar label="Fuel Filter" value={health.fuelFilter} />
                <HealthBar label="Injectors" value={health.injectors} />
            </div>
        </div>
    );
};

export default React.memo(HealthStatusCard);
