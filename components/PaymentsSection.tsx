
import React from 'react';
import { CreditCard, Download, ExternalLink, Plus, Trash2 } from 'lucide-react';
import { User, ClientData } from '../types';
const PUBLIC_BASE = "https://localhost/dashboard-backend/";
// OR localhost during dev:
// const PUBLIC_BASE = "http://localhost/dashboard-backend";

interface PaymentsSectionProps {
  user: User;
  clientData?: ClientData;
}

const PaymentsSection: React.FC<PaymentsSectionProps> = ({ user, clientData }) => {
  const invoices = clientData?.invoices || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div><h2 className="text-2xl font-black text-slate-900 tracking-tight">Financial Overview</h2><p className="text-slate-500 font-medium">Billing history for {clientData?.name || 'your organization'}.</p></div>
        {user.role === 'ADMIN' && <p className="text-xs font-bold text-orange-500 italic bg-orange-50 px-3 py-1 rounded-lg">Admin View: Manage invoices in Client Settings</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#0f172a] rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-slate-900/20">
            <CreditCard className="absolute -right-6 -bottom-6 w-32 h-32 opacity-10" />
            <h3 className="text-[10px] font-black mb-4 opacity-50 uppercase tracking-widest">Subscription Retainer</h3>
            <p className="text-5xl font-black mb-1">${((clientData?.monthlyPrice || 0) + (clientData?.maintenancePrice || 0)).toFixed(0)}</p>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-tighter">Due on the 1st of every month</p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest mb-6">Active Services</h4>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-bold"><span>SEO Management</span><span className="text-slate-900">${clientData?.monthlyPrice.toFixed(0)}</span></div>
              <div className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-bold"><span>Maintenance</span><span className="text-slate-900">${clientData?.maintenancePrice.toFixed(0)}</span></div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-bold text-slate-900 uppercase tracking-widest text-xs">Invoice Archive</h3>
          </div>
          <div className="overflow-x-auto"><table className="w-full text-left">
            <thead><tr className="border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Document</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
              <th className="px-6 py-4"></th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-400 italic text-sm">No transaction history available.</td></tr>
              ) : invoices.map((inv, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4"><span className="font-bold text-slate-900 text-sm">{inv.id}</span></td>
                  <td className="px-6 py-4"><span className="text-xs text-slate-500 font-bold">{inv.date}</span></td>
                  <td className="px-6 py-4"><span className="font-black text-slate-900 text-sm">${inv.amount.toFixed(0)}</span></td>
                  <td className="px-6 py-4"><span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>{inv.status}</span></td>
                  <td className="px-6 py-4 text-right"><div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
{inv.pdf_path && (
  <a
    href={`${PUBLIC_BASE}/${inv.pdf_path}`}
    target="_blank"
    rel="noreferrer"
    className="p-2 text-slate-400 hover:text-orange-500 transition-colors"
    title="View Invoice PDF"
  >
    <Download className="w-4 h-4" />
  </a>
)}
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsSection;
