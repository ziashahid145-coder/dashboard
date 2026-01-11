
import React from 'react';
import { Server, Activity, Database, Zap, HardDrive, MapPin, CheckCircle2, ShieldCheck, Terminal, Cpu, Cloud, Clock } from 'lucide-react';
import { ClientData } from '../types';

interface HostingSectionProps {
  clientData?: ClientData;
}

const HostingSection: React.FC<HostingSectionProps> = ({ clientData }) => {
  if (!clientData) return <div className="p-10 text-center text-slate-400">Querying infrastructure nodes...</div>;

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Cloud Infrastructure</h2>
          <p className="text-slate-500 font-medium">Server instance specifications and real-time performance.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm">
          <Activity className="w-5 h-5 text-emerald-500" />
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Node Health</p>
            <p className="text-xs font-black text-slate-900 uppercase">99.98% Uptime</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 p-10">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <Server className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Dedicated Server Instance</h3>
                <p className="text-sm text-slate-400 font-medium">SkyPeak High-Performance Hosting Node</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: 'Cloud Provider', value: 'AWS / EC2', icon: Cloud, color: 'blue' },
                { label: 'Public IPv4', value: clientData.serverIP, icon: Zap, color: 'orange' },
                { label: 'Server Region', value: clientData.serverLocation, icon: MapPin, color: 'emerald' },
              ].map((item, i) => (
                <div key={i} className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <div className={`p-2 bg-${item.color}-100 w-fit rounded-lg mb-4`}><item.icon className={`w-4 h-4 text-${item.color}-600`} /></div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-lg font-black text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-10 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Technical Environment</h4>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-bold">OS Version</span>
                    <span className="text-slate-900 font-black">{clientData.osVersion}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-bold">PHP Runtime</span>
                    <span className="text-slate-900 font-black">{clientData.phpVersion}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-bold">Database</span>
                    <span className="text-slate-900 font-black">{clientData.dbVersion}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-slate-50">
                    <span className="text-slate-500 font-bold">Service Expiry</span>
                    <span className="text-orange-500 font-black flex items-center gap-1.5"><Clock className="w-3 h-3" /> {clientData.serverExpiry}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
                <Terminal className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5" />
                <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-4">Instance Usage</h4>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-2"><span>Disk Storage</span><span>28%</span></div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden"><div className="bg-orange-500 h-full w-[28%]"></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-2"><span>Memory Utilization</span><span>42%</span></div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden"><div className="bg-emerald-500 h-full w-[42%]"></div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Redundancy & Backups</h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Database className="w-4 h-4" /></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Snapshot Policy</p>
                  <p className="text-sm font-bold text-slate-900">Incremental Daily</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><ShieldCheck className="w-4 h-4" /></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protection</p>
                  <p className="text-sm font-bold text-slate-900">DDoS Mitigation Active</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Cpu className="w-4 h-4" /></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hardware</p>
                  <p className="text-sm font-bold text-slate-900">Intel Xeon Gold 3.5GHz</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0f172a] p-8 rounded-[2.5rem] text-white shadow-2xl">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Infrastructure Action</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium mb-6">
              Your server is fully managed by our technical ops team. Scaling requests or load balancer configurations can be handled via support.
            </p>
            <button className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-xl text-[10px] uppercase tracking-[0.2em] transition-all">
              Request Resource Upgrade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostingSection;
