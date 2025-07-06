
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TimeSeriesData } from '../types';

interface ChartCardProps {
    data: TimeSeriesData[];
    title: string;
    lines: { dataKey: string; color: string }[];
}

const ChartCard: React.FC<ChartCardProps> = ({ data, title, lines }) => {
    return (
        <div className="bg-slate-800 p-4 rounded-lg shadow-lg h-64">
            <h3 className="text-lg font-semibold text-slate-300 mb-4">{title}</h3>
            <ResponsiveContainer width="100%" height="85%">
                <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="time" stroke="#94a3b8" unit="s" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                        labelStyle={{ color: '#cbd5e1' }}
                    />
                    <Legend />
                    {lines.map(line => (
                       <Line key={line.dataKey} type="monotone" dataKey={line.dataKey} stroke={line.color} strokeWidth={2} dot={false} />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default React.memo(ChartCard);
