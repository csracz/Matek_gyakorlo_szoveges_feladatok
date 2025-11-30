import React from 'react';
import { UserStats } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface StatsViewProps {
  stats: UserStats;
  onBack: () => void;
}

export const StatsView: React.FC<StatsViewProps> = ({ stats, onBack }) => {
  const data = [
    { name: 'Helyes', value: stats.correctAnswers },
    { name: 'Tévedés', value: stats.wrongAnswers },
  ];

  const COLORS = ['#4ade80', '#f87171']; // Green, Red
  const isEmpty = stats.correctAnswers === 0 && stats.wrongAnswers === 0;

  return (
    <div className="flex flex-col h-full bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl max-w-lg mx-auto w-full items-center">
      <h2 className="text-3xl font-bold text-brand-blue mb-4">Eredményeim</h2>
      
      <div className="w-full h-64 relative">
        {isEmpty ? (
          <div className="flex items-center justify-center h-full text-gray-400 font-bold">
            Még nem játszottál!
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
        {!isEmpty && (
           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
             <span className="text-3xl font-bold text-gray-700">
               {stats.correctAnswers + stats.wrongAnswers}
             </span>
             <p className="text-xs text-gray-500">Összesen</p>
           </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 w-full mt-6">
        <div className="bg-green-100 p-4 rounded-2xl border-2 border-green-200 text-center">
          <p className="text-green-600 font-bold text-sm">JÓ VÁLASZOK</p>
          <p className="text-4xl font-black text-green-500">{stats.correctAnswers}</p>
        </div>
        <div className="bg-red-100 p-4 rounded-2xl border-2 border-red-200 text-center">
          <p className="text-red-600 font-bold text-sm">JAVÍTANDÓ</p>
          <p className="text-4xl font-black text-red-400">{stats.wrongAnswers}</p>
        </div>
      </div>

      <button 
        onClick={onBack}
        className="mt-8 text-gray-500 hover:text-brand-blue font-bold underline"
      >
        Vissza a menübe
      </button>
    </div>
  );
};