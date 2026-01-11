
import React from 'react';
import { Globe, Shield, Clock, ExternalLink, CheckCircle2, Search, Info } from 'lucide-react';
import { ClientData } from '../types';

interface DomainSectionProps {
  clientData?: ClientData;
}

const DomainSection: React.FC<DomainSectionProps> = ({ clientData }) => {
  if (!clientData) return <div className="p-10 text-center text-slate-400">Loading domain profile...</div>;

  const calculateDaysRemaining = (expiry: string) => {
    const today = new Date();
    const expiryDate = new Date(expiry);
    const diff = expiryDate.getTime() - today.getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  };

  const daysRemaining = calculateDaysRemaining(clientData.domainExpiry);
  const statusColor = daysRemaining < 30 ? 'text-red-500' : 'text-emerald-500';

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Domain Registry</h2>
          <p className="text-slate-500 font-medium">Management and verification of <span className="text-orange-500 font-bold">{clientData.domain}</span></p>
        </div>
        <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm">
          <Shield className="w-5 h-5 text-emerald-500" />
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SSL Status</p>
            <p className="text-xs font-black text-slate-900 uppercase">Active & Valid</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
            <div className="bg-slate-900 p-10 text-white relative">
              <Globe className="absolute -right-8 -bottom-8 w-48 h-48 opacity-5" />
              <div className="relative z-10">
                <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2">Primary Asset</p>
                <h3 className="text-5xl font-black tracking-tighter mb-4">{clientData.domain}</h3>
                <div className="flex flex-wrap gap-4">
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-300 border border-white/5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> SSL Secured
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-300 border border-white/5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> WHOIS Private
                  </span>
                </div>
              </div>
            </div>

            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Domain Lifecycle</h4>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <Clock className={`w-8 h-8 ${daysRemaining < 30 ? 'text-red-500' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Renews On</p>
                    <p className="text-xl font-black text-slate-900">{clientData.domainExpiry}</p>
                    <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${statusColor}`}>
                      {daysRemaining} Days Remaining
                    </p>
                  </div>
                </div>
                <button className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-900 font-black rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                  Request DNS Change <ExternalLink className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200/60">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Registry Details</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-bold">Registrar Provider</span>
                    <span className="text-slate-900 font-black">{clientData.registrar}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-bold">Auto-Renewal</span>
                    <span className="text-emerald-600 font-black uppercase text-[10px]">Enabled</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-bold">Registry Status</span>
                    <span className="text-slate-900 font-black uppercase text-[10px]">ClientTransferProhibited</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Nameservers</h4>
            <div className="space-y-3">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 font-mono text-xs text-slate-600">ns1.skypeak.com</div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 font-mono text-xs text-slate-600">ns2.skypeak.com</div>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-100 p-8 rounded-[2.5rem]">
            <div className="flex items-center gap-3 mb-4">
              <Info className="w-5 h-5 text-orange-500" />
              <h4 className="font-black text-orange-900 text-sm uppercase tracking-widest">Management Tip</h4>
            </div>
            <p className="text-xs text-orange-800/80 leading-relaxed font-medium">
              We manage all DNS entries for <span className="font-bold underline">{clientData.domain}</span> to ensure maximum performance and security. If you need a new CNAME or MX record added, please submit a request.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DomainSection;
