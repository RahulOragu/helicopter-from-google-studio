
import React, { useRef, useEffect } from 'react';
import { LogEntry } from '../types';

interface LogCardProps {
    logs: LogEntry[];
}

const LogCard: React.FC<LogCardProps> = ({ logs }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    const getLogColor = (type: LogEntry['type']) => {
        switch (type) {
            case 'alert': return 'text-red-400';
            case 'warning': return 'text-yellow-400';
            case 'info':
            default: return 'text-slate-400';
        }
    };
    
    return (
        <div className="bg-slate-800 p-4 rounded-lg shadow-lg h-full flex flex-col">
            <h3 className="text-lg font-semibold text-slate-300 mb-4">Event Log</h3>
            <div ref={scrollRef} className="flex-grow overflow-y-auto pr-2 space-y-2 text-sm">
                {logs.slice().reverse().map((log, index) => (
                    <div key={index} className="flex">
                       <span className="text-slate-500 mr-2">{log.timestamp}</span>
                       <p className={`${getLogColor(log.type)}`}>{log.message}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default React.memo(LogCard);
