
import React from 'react';
import { SimulationState } from '../types';
import Gauge from './Gauge';
import DataCard from './DataCard';
import SystemSchematic from './SystemSchematic';
import ChartCard from './ChartCard';
import HealthStatusCard from './HealthStatusCard';
import LogCard from './LogCard';
import { FUEL_TANK_CAPACITY_L, N1_MAX_RPM, N2_MAX_RPM, T45_TRANSIENT_LIMIT_K } from '../constants';

interface DashboardProps {
    state: SimulationState;
}

const Dashboard: React.FC<DashboardProps> = ({ state }) => {
    const { sensedState, trueState, health, history, logs } = state;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 h-full">
            
            {/* Gauges */}
            <div className="col-span-1 md:col-span-1 xl:col-span-1">
                <Gauge label="N1 RPM" value={sensedState.n1_rpm} max={N1_MAX_RPM} unit="" />
            </div>
            <div className="col-span-1 md:col-span-1 xl:col-span-1">
                <Gauge label="N2 RPM" value={sensedState.n2_rpm} max={N2_MAX_RPM} unit="" />
            </div>
            
            {/* System Schematic */}
            <div className="col-span-2 md:col-span-2 lg:col-span-2 xl:col-span-2 row-span-2 bg-slate-800 p-4 rounded-lg shadow-lg">
                <SystemSchematic state={state} />
            </div>

            {/* Data Cards */}
            <div className="col-span-1">
                <DataCard label="Fuel Quantity" value={sensedState.fuelQuantity_l.toFixed(1)} unit="L" max={FUEL_TANK_CAPACITY_L} />
            </div>
            <div className="col-span-1">
                <DataCard label="T45 Exhaust Temp" value={sensedState.t45_temp_k.toFixed(0)} unit="K" threshold={T45_TRANSIENT_LIMIT_K} />
            </div>
            
            {/* Charts */}
            <div className="col-span-2 md:col-span-2 lg:col-span-2 xl:col-span-2">
                 <ChartCard data={history} title="Engine Performance" lines={[{dataKey: "N1 RPM", color: "#22d3ee"}, {dataKey: "T45 (K)", color: "#facc15"}]} />
            </div>
            <div className="col-span-2 md:col-span-2 lg:col-span-2 xl:col-span-2">
                 <ChartCard data={history} title="Fuel System" lines={[{dataKey: "Fuel Flow", color: "#4ade80"}, {dataKey: "HP (MPa)", color: "#f87171"}]} />
            </div>

            {/* Health and Logs */}
            <div className="col-span-2 md:col-span-2 lg:col-span-3 xl:col-span-2">
                 <HealthStatusCard health={health} />
            </div>
            <div className="col-span-2 md:col-span-2 lg:col-span-3 xl:col-span-2">
                 <LogCard logs={logs} />
            </div>
        </div>
    );
};

export default Dashboard;
