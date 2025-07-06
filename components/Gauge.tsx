
import React from 'react';

interface GaugeProps {
    label: string;
    value: number;
    max: number;
    unit: string;
}

const Gauge: React.FC<GaugeProps> = ({ label, value, max, unit }) => {
    const percentage = Math.min(Math.max(value / max, 0), 1);
    const angle = percentage * 270 - 135; // from -135 to 135 degrees
    const circumference = 2 * Math.PI * 40;
    const strokeDashoffset = circumference * (1 - percentage * 0.75);

    const color = percentage > 0.9 ? 'text-red-500' : percentage > 0.75 ? 'text-yellow-400' : 'text-cyan-400';
    const strokeColor = percentage > 0.9 ? '#ef4444' : percentage > 0.75 ? '#facc15' : '#22d3ee';

    return (
        <div className="bg-slate-800 p-4 rounded-lg shadow-lg text-center h-full flex flex-col justify-between">
            <h3 className="text-lg font-semibold text-slate-300">{label}</h3>
            <div className="relative flex items-center justify-center my-2">
                <svg viewBox="0 0 100 100" className="w-40 h-40 transform -rotate-90">
                    {/* Background track */}
                    <circle cx="50" cy="50" r="40" strokeWidth="10" stroke="#475569" fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference * 0.25}
                    />
                    {/* Value arc */}
                    <circle cx="50" cy="50" r="40" strokeWidth="10" stroke={strokeColor} fill="none"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-200"
                    />
                </svg>
                <div className="absolute flex flex-col items-center">
                    <span className={`text-3xl font-bold ${color}`}>
                        {Math.round(value)}
                    </span>
                    <span className="text-sm text-slate-400">{unit}</span>
                </div>
            </div>
        </div>
    );
};

export default React.memo(Gauge);
