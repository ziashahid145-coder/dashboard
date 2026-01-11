
import React from 'react';
import { Briefcase, CheckCircle2, Clock, Download, ExternalLink, ShieldCheck, DollarSign, ArrowUpRight } from 'lucide-react';
import { ClientData } from '../types';

interface WebsitePaymentSectionProps {
  clientData?: ClientData;
}

const WebsitePaymentSection: React.FC<WebsitePaymentSectionProps> = ({ clientData }) => {
  if (!clientData) return <div className="p-10 text-center text-slate-400">Loading project financials...</div>;

  const totalProjectValue = clientData.websitePayments.reduce((acc, curr) => acc + curr.amount, 0);
  const paidAmount = clientData.websitePayments
    .filter(p => p.status === 'Paid')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const pendingAmount = totalProjectValue - paidAmount;
  const progressPercent = totalProjectValue > 0 ? (paidAmount / totalProjectValue) * 100 : 0;

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Website Project Billing</h2>
          <p className="text-slate-500 font-medium">Tracking milestones and one-time development payments.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm">
          <Briefcase className="w-5 h-5 text-indigo-500" />
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Project</p>
            <p className="text-xs font-black text-slate-900 uppercase">Custom Development</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Project Value</p>
          <p className="text-3xl font-black text-slate-900">${totalProjectValue.toLocaleString()}</p>
        </div>
        <div className="bg-emerald-50 p-8 rounded-[2rem] border border-emerald-100">
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Total Paid</p>
          <p className="text-3xl font-black text-emerald-900">${paidAmount.toLocaleString()}</p>
        </div>
        <div className="bg-indigo-50 p-8 rounded-[2rem] border border-indigo-100">
          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">Outstanding</p>
          <p className="text-3xl font-black text-indigo-900">${pendingAmount.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 p-10">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Milestone Schedule</h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Project Progress:</span>
                <span className="text-sm font-black text-indigo-600">{Math.round(progressPercent)}%</span>
              </div>
            </div>

            <div className="space-y-6">
              {clientData.websitePayments.length === 0 ? (
                <div className="py-20 text-center text-slate-400 italic">No milestones currently defined for this project.</div>
              ) : clientData.websitePayments.map((pay, i) => (
                <div key={pay.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-indigo-200 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${pay.status === 'Paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}`}>
                      {pay.status === 'Paid' ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900">{pay.title}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{pay.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-slate-900">${pay.amount.toLocaleString()}</p>
                    <div className="flex items-center justify-end gap-2 mt-1">
                      <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${pay.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                        {pay.status}
                      </span>
                      <button className="text-slate-300 hover:text-indigo-600 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-[#0f172a] p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
            <ShieldCheck className="absolute -right-6 -bottom-6 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform duration-700" />
            <div className="relative z-10">
              <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-6">Security & Processing</h4>
              <p className="text-sm font-medium text-slate-400 leading-relaxed mb-8">
                All project payments are secured via Stripe SSL encryption. Final deployment occurs only after milestone settlement.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs font-bold text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Milestone Verification
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Secure Invoicing
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Payment Methods</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-xs font-bold text-slate-500">Bank Transfer (ACH)</span>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Recommended</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-xs font-bold text-slate-500">Credit / Debit Card</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">3% Fee</span>
              </div>
            </div>
            <button className="w-full mt-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-900 font-black rounded-xl text-[10px] uppercase tracking-widest transition-all">
              Update Billing Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsitePaymentSection;
