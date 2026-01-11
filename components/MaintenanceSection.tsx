
import React from 'react';
import { 
  Settings, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  RefreshCw, 
  ShieldCheck, 
  Zap, 
  Database,
  ArrowRight,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import { ClientData } from '../types';

// Map task icon strings to Lucide components
const TaskIconMap: Record<string, any> = {
  Zap,
  ShieldCheck,
  Database,
  RefreshCw,
  Settings
};

interface MaintenanceSectionProps {
  clientData?: ClientData;
}

const MaintenanceSection: React.FC<MaintenanceSectionProps> = ({ clientData }) => {
  if (!clientData) return <div className="p-10 text-center text-slate-400">Loading maintenance oversight...</div>;

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Monthly Maintenance</h2>
          <p className="text-slate-500">Technical oversight, security, and performance optimizations.</p>
        </div>
        <div className="bg-orange-50 px-4 py-2 rounded-xl border border-orange-100">
          <p className="text-xs font-bold text-orange-600 uppercase tracking-widest">Plan: {clientData.maintenancePlanName}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Status Dashboard */}
        <div className="lg:col-span-3 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-lg">System Health</h4>
              <p className="text-slate-500 text-sm mt-1">All core systems are up to date and secured.</p>
              <div className="mt-4 flex items-center gap-2 text-emerald-600 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" /> {clientData.maintenanceSecurityScore}% Security Score
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                <Database className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-lg">Backup Status</h4>
              <p className="text-slate-500 text-sm mt-1">Automatic backups running every 24 hours.</p>
              <div className="mt-4 flex items-center gap-2 text-blue-600 font-bold text-xs">
                <Clock className="w-4 h-4" /> Last: {clientData.maintenanceBackupStatus}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-lg">Performance</h4>
              <p className="text-slate-500 text-sm mt-1">Optimal load times and caching configured.</p>
              <div className="mt-4 flex items-center gap-2 text-orange-600 font-bold text-xs">
                <TrendingUp className="w-4 h-4" /> {clientData.maintenancePerformanceResponse} Avg Response
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Task Log (Oct 2025)</h3>
              <Calendar className="w-5 h-5 text-slate-300" />
            </div>
            <div className="divide-y divide-slate-100">
              {clientData.maintenanceTasks.length === 0 ? (
                <div className="p-10 text-center text-slate-400 italic">No tasks logged for this cycle.</div>
              ) : clientData.maintenanceTasks.map((task, i) => {
                const TaskIcon = TaskIconMap[task.icon] || Settings;
                return (
                  <div key={i} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-slate-100 text-slate-500 rounded-xl">
                        <TaskIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-900">{task.name}</h5>
                        <p className="text-xs text-slate-500">Status: {task.status}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">{task.date}</p>
                      {task.status === 'Completed' ? (
                        <span className="text-[10px] uppercase tracking-wider text-emerald-600 font-black">Verified</span>
                      ) : task.status === 'Active' ? (
                        <span className="text-[10px] uppercase tracking-wider text-blue-600 font-black">In Progress</span>
                      ) : (
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-black">Queued</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Payment & Action Area */}
        <div className="space-y-6">
          <div className="bg-[#1e293b] rounded-3xl p-8 text-white">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-orange-500" /> Maintenance Fee
            </h4>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-3xl font-black">${clientData.maintenancePrice.toFixed(0)}</span>
              <span className="text-slate-400">/ month</span>
            </div>
            <p className="text-sm text-slate-400 mb-8">Next automatic charge on {clientData.maintenanceNextCharge}.</p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 24/7 Monitoring
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Priority Support
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Daily Backups
              </div>
            </div>
            <button className="w-full mt-8 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all flex items-center justify-center gap-2">
              Upgrade Plan <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <h4 className="font-bold text-slate-900 mb-4">Request Fix</h4>
            <p className="text-xs text-slate-500 mb-6">Need a small adjustment or found a bug? Let us know.</p>
            <textarea 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 h-24 mb-4 resize-none"
              placeholder="Describe the issue..."
            ></textarea>
            <button className="w-full py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800">
              Submit Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceSection;
