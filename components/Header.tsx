
import React from 'react';

interface HeaderProps {
    isRunning: boolean;
    onToggle: () => void;
    onReset: () => void;
}

const Header: React.FC<HeaderProps> = ({ isRunning, onToggle, onReset }) => {
    return (
        <header className="flex items-center justify-between bg-slate-800 p-4 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-cyan-400">
                Helicopter Fuel System Digital Twin
            </h1>
            <div className="flex items-center space-x-4">
                <button
                    onClick={onToggle}
                    className={`px-4 py-2 rounded-md font-semibold text-white transition-all duration-200 ${
                        isRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-green-600 hover:bg-green-700'
                    }`}
                >
                    {isRunning ? 'Pause Simulation' : 'Start Simulation'}
                </button>
                <button
                    onClick={onReset}
                    className="px-4 py-2 rounded-md font-semibold bg-red-600 text-white hover:bg-red-700 transition-all duration-200"
                >
                    Reset
                </button>
            </div>
        </header>
    );
};

export default React.memo(Header);
