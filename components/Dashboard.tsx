
import React from 'react';
import { 
  TrendingUp, 
  ShieldCheck, 
  CreditCard, 
  Globe, 
  Download, 
  BarChart3, 
  Clock, 
  ArrowUpRight, 
  Search, 
  Activity, 
  Target, 
  Server, 
  Zap, 
  CheckCircle2, 
  MessageSquare, 
  Calendar,
  MousePointer2,
  Cpu,
  Smartphone
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AppTab, ClientData } from '../types';
import ClientWorkTime from "./ClientWorkTime";

const MONTHS = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

// Map string icon names to Lucide components
const IconMap: Record<string, any> = {
  ShieldCheck,
  Download,
  Zap,
  CheckCircle2
};

interface DashboardProps {
  setActiveTab: (tab: AppTab) => void;
  clientData?: ClientData;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveTab, clientData }) => {
  if (!clientData) return (
    <div className="flex flex-col items-center justify-center p-20">
      <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing SkyPeak Cloud Data...</p>
    </div>
  );

  // Generate chart data from the dynamic trafficData array
  const dynamicChartData = clientData.trafficData.map((val, i) => ({
    month: MONTHS[i % MONTHS.length],
    value: val
  }));

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. WELCOME HERO SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Welcome, {clientData.name} 👋</h1>
          <div className="flex items-center gap-3 mt-2">
            <div className="px-3 py-1 bg-orange-100 text-orange-600 rounded-lg text-[10px] font-black uppercase tracking-widest">Global Asset</div>
            <span className="text-slate-500 font-medium">Managing:</span>
            <span className="text-slate-900 font-black cursor-pointer hover:text-orange-500 transition-colors" onClick={() => setActiveTab(AppTab.DOMAIN)}>{clientData.domain}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-orange-500 transition-all shadow-sm">
            <Download className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setActiveTab(AppTab.HELP)}
            className="px-6 py-3 bg-[#0f172a] text-white rounded-xl font-black text-sm flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
          >
            <MessageSquare className="w-4 h-4" /> Open Support Ticket
          </button>
        </div>
      </div>

      {/* 2. PRIMARY PERFORMANCE KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Search Authority', value: `${clientData.seoScore}%`, icon: TrendingUp, color: 'emerald', sub: 'Ranking Visibility' },
          { label: 'System Health', value: 'Optimized', icon: ShieldCheck, color: 'blue', sub: 'DDoS Protection Active' },
          { label: 'Cloud Retainer', value: `$${(clientData.monthlyPrice + clientData.maintenancePrice).toFixed(0)}`, icon: CreditCard, color: 'orange', sub: 'Current Monthly' },
          { label: 'Next Audit', value: 'Oct 25', icon: Clock, color: 'purple', sub: 'Maintenance Cycle' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40 group hover:border-orange-200 transition-all">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{stat.label}</p>
                <h3 className="text-xl font-black text-slate-900">{stat.value}</h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{stat.sub}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 3. SEARCH VISIBILITY CHART SECTION (DYNAMIC) */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Traffic Acquisition Trend</h3>
              <p className="text-sm text-slate-400 font-medium">Organic vs Paid visit projections</p>
            </div>
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase"><div className="w-2 h-2 rounded-full bg-orange-500"></div> Organic</span>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dynamicChartData}>
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontWeight: 'bold' }} />
                <Area type="monotone" dataKey="value" stroke="#f97316" strokeWidth={4} fill="url(#chartGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* 4. INFRASTRUCTURE STATUS SECTION */}
        <div className="bg-[#0f172a] p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
          <Server className="absolute -right-8 -bottom-8 w-48 h-48 opacity-5 group-hover:scale-110 transition-transform duration-1000" />
          <div className="relative z-10 space-y-8">
            <div>
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-3">Cloud Node Active</p>
              <h3 className="text-3xl font-black tracking-tighter">{clientData.serverIP}</h3>
              <div className="flex items-center gap-2 mt-4 text-emerald-400">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-widest">Server Operational</span>
              </div>
            </div>
            
            <div className="space-y-4 bg-white/5 p-6 rounded-3xl border border-white/5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Renews</span>
                <span className="text-sm font-black">{clientData.serverExpiry}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Uptime</span>
                <span className="text-sm font-black">99.99%</span>
              </div>
            </div>

            <button onClick={() => setActiveTab(AppTab.HOSTING)} className="w-full py-4 bg-white text-slate-900 font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all">
              Full Hosting Specs
            </button>
          </div>
        </div>
      </div>
  {/* ================= WORK TIME (LIVE FROM API) ================= */}
<ClientWorkTime clientId={clientData.id} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 5. RECENT ACTIVITY FEED SECTION (DYNAMIC) */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-500" /> Recent Maintenance Feed
            </h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Updates</span>
          </div>
          <div className="space-y-6">
            {clientData.activityLog.length === 0 ? (
              <p className="text-center text-slate-400 py-10 font-bold uppercase tracking-widest text-xs">No Recent Activity Logs</p>
            ) : clientData.activityLog.map((log, i) => {
              const Icon = IconMap[log.icon] || CheckCircle2;
              return (
                <div key={i} className="flex items-center justify-between group cursor-default">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl bg-${log.color}-50 flex items-center justify-center text-${log.color}-500`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{log.task}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{log.date}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-200 group-hover:text-orange-500 transition-colors" />
                </div>
              );
            })}
          </div>
        </div>

        {/* 6. SEO KEYWORD SNAPSHOT SECTION */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-500" /> SEO Ranking Highlights
            </h3>
            <button onClick={() => setActiveTab(AppTab.SEO)} className="text-[10px] font-black text-orange-500 uppercase tracking-widest hover:underline">Full Report</button>
          </div>
          <div className="overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase">Term</th>
                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase">Rank</th>
                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase">Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {clientData.seoRankings.slice(0, 4).map((rk, i) => (
                  <tr key={rk.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 font-bold text-slate-900 text-sm">{rk.term}</td>
                    <td className="py-4"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-black">#{rk.rank}</span></td>
                    <td className="py-4 text-emerald-600 font-black text-[10px] tracking-widest">{rk.change_text}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 7. CORE WEB VITALS (DYNAMIC) */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40">
          <h3 className="text-lg font-black text-slate-900 tracking-tight mb-8">Performance Audit</h3>
          <div className="space-y-8">
            {[
              { label: 'Speed Index', value: clientData.speedIndex, color: 'emerald', icon: Zap },
              { label: 'SEO Authority', value: `${clientData.seoScore}/100`, color: 'blue', icon: Search },
              { label: 'Mobile UX', value: clientData.mobileUX, color: 'orange', icon: Smartphone },
            ].map((v, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-2"><v.icon className={`w-3 h-3 text-${v.color}-500`} /> {v.label}</span>
                  <span className={`text-${v.color}-600`}>{v.value}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full bg-${v.color}-500`} style={{ width: i === 0 ? '95%' : i === 1 ? '92%' : '100%' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 8. FINANCIAL SNAPSHOT SECTION */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40">
          <h3 className="text-lg font-black text-slate-900 tracking-tight mb-8">Billing Snapshot</h3>
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 mb-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Latest Invoice</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900">${(clientData.monthlyPrice + clientData.maintenancePrice).toFixed(0)}</span>
              <span className="text-xs text-slate-400 font-bold">/ MO</span>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[8px] font-black uppercase tracking-widest">Paid</span>
              <span className="text-[10px] text-slate-400 font-bold">Latest Settlement</span>
            </div>
          </div>
          <button onClick={() => setActiveTab(AppTab.PAYMENTS)} className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-900 font-black rounded-xl text-[10px] uppercase tracking-widest transition-all">View Invoices</button>
        </div>

        {/* 9. DEDICATED SUPPORT CONTACT SECTION */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight mb-8">Dedicated Support</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-500 font-black text-xl">SJ</div>
              <div>
                <p className="text-sm font-black text-slate-900">Sarah Jenkins</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Account Manager</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <Calendar className="w-3 h-3" /> Availability: Mon - Fri
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Priority Response: Active
              </div>
            </div>
          </div>
          <button onClick={() => setActiveTab(AppTab.HELP)} className="w-full mt-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-xl text-[10px] uppercase tracking-widest shadow-lg shadow-orange-500/20 transition-all active:scale-95">
            Contact Support
          </button>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
