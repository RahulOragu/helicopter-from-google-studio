
import React from 'react';

interface DataCardProps {
    label: string;
    value: string;
    unit: string;
    max?: number;
    threshold?: number;
}

const DataCard: React.FC<DataCardProps> = ({ label, value, unit, max, threshold }) => {
    const numericValue = parseFloat(value);
    const hasProgressBar = max !== undefined;
    const progress = max ? (numericValue / max) * 100 : 0;
    const isOverThreshold = threshold ? numericValue > threshold : false;

    return (
        <div className="bg-slate-800 p-4 rounded-lg shadow-lg h-full flex flex-col justify-center">
            <p className="text-slate-400 text-sm">{label}</p>
            <div className="flex items-baseline space-x-2 mt-1">
                <span className={`text-3xl font-bold ${isOverThreshold ? 'text-red-500' : 'text-white'}`}>{value}</span>
                <span className="text-slate-400">{unit}</span>
            </div>
            {hasProgressBar && (
                <div className="w-full bg-slate-700 rounded-full h-2.5 mt-3">
                    <div
                        className="bg-cyan-500 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            )}
        </div>
    );
};

export default React.memo(DataCard);
