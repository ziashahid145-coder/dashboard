
import React from 'react';
import { BarChart3, TrendingUp, Search, MousePointer2, Target, Info } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ClientData } from '../types';

interface SEOSectionProps {
  clientData?: ClientData;
}

const SEOSection: React.FC<SEOSectionProps> = ({ clientData }) => {
  if (!clientData) return <div className="p-10 text-center text-slate-400">Loading metrics...</div>;

  const pieData = [
    { name: 'Organic', value: clientData.organicPercent || 0, color: '#f97316' },
    { name: 'Direct', value: clientData.directPercent || 0, color: '#0f172a' },
    { name: 'Referral', value: clientData.referralPercent || 0, color: '#94a3b8' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div><h2 className="text-2xl font-bold text-slate-900">Search Strategy</h2><p className="text-slate-500">Visibility metrics for <span className="font-bold text-orange-500">{clientData.domain}</span></p></div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm">Audit PDF</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition-all hover:border-orange-200">
              <div className="flex items-center justify-between mb-4"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Impressions</p><Search className="w-4 h-4 text-slate-300" /></div>
              <p className="text-3xl font-black text-slate-900">{clientData.seoImpressions.toLocaleString()}</p>
              <p className="text-[10px] text-emerald-600 font-bold mt-2 flex items-center gap-1 uppercase tracking-widest"><TrendingUp className="w-3 h-3" /> Monthly Trend</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition-all hover:border-orange-200">
              <div className="flex items-center justify-between mb-4"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg CTR</p><MousePointer2 className="w-4 h-4 text-slate-300" /></div>
              <p className="text-3xl font-black text-slate-900">{clientData.seoCTR}%</p>
              <p className="text-[10px] text-orange-500 font-bold mt-2 flex items-center gap-1 uppercase tracking-widest"><Info className="w-3 h-3" /> Performance</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition-all hover:border-orange-200">
              <div className="flex items-center justify-between mb-4"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Keywords</p><Target className="w-4 h-4 text-slate-300" /></div>
              <p className="text-3xl font-black text-slate-900">{clientData.seoTotalKeywords}</p>
              <p className="text-[10px] text-emerald-600 font-bold mt-2 flex items-center gap-1 uppercase tracking-widest"><TrendingUp className="w-3 h-3" /> Tracked Assets</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between"><h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Priority Rankings</h3></div>
            <div className="overflow-x-auto"><table className="w-full text-left">
              <thead><tr className="bg-white border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Keyword</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rank</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trend</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">{clientData.seoRankings.map((rk, i) => (
                <tr key={rk.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 text-sm">{rk.term}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-0.5 rounded-lg text-xs font-black ${rk.rank <= 3 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>#{rk.rank}</span></td>
                  <td className="px-6 py-4"><span className="text-xs font-black text-emerald-600">{rk.change}</span></td>
                </tr>
              ))}</tbody>
            </table></div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 flex flex-col">
          <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest mb-8">Traffic Composition</h3>
          <div className="h-[200px] w-full relative">
            <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value">
              {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
            </Pie><Tooltip /></PieChart></ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"><span className="text-3xl font-black text-slate-900">{clientData.organicPercent}%</span><span className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Organic</span></div>
          </div>
          <div className="mt-8 space-y-4">
            {pieData.map((entry, i) => (
              <div key={i} className="flex items-center justify-between"><div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div><span className="text-xs font-bold text-slate-500 uppercase tracking-tight">{entry.name}</span></div><span className="text-xs font-black text-slate-900">{entry.value}%</span></div>
            ))}
          </div>
          <div className="mt-auto pt-8 border-t border-slate-100"><div className="bg-slate-50 p-4 rounded-2xl"><p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">AI Strategy Insight</p><p className="text-xs text-slate-600 leading-relaxed font-medium">Domain authority is trending upwards. Maintain current backlink strategy for <span className="text-orange-600">{clientData.domain}</span>.</p></div></div>
        </div>
      </div>
    </div>
  );
};

export default SEOSection;
