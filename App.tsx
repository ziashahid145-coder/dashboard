import React, { useEffect, useState } from "react";
import { AppTab, User, ClientData } from "./types";

import Dashboard from "./components/Dashboard";
import SEOSection from "./components/SEOSection";
import DomainSection from "./components/DomainSection";
import HostingSection from "./components/HostingSection";
import PaymentsSection from "./components/PaymentsSection";
import WebsitePaymentSection from "./components/WebsitePaymentSection";
import MaintenanceSection from "./components/MaintenanceSection";
import SupportSection from "./components/SupportSection";
import AdminPanel from "./components/AdminPanel";
import SourceCode from "./components/SourceCode";

import {
  User as UserIcon,
  LayoutDashboard,
  Globe,
  Server,
  CreditCard,
  BarChart3,
  Settings,
  LifeBuoy,
  Users,
  Code,
  LogOut,
  Lock,
  ShieldCheck,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Briefcase,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE as string;
const LOGO_URL =
  "https://skypeakdesigns.com/wp-content/uploads/2025/11/cropped-skypeak-designs.png";

/* ================= FOOTER ================= */
const Footer: React.FC = () => (
  <footer className="bg-[#0f172a] text-slate-400 py-12 mt-auto border-t border-slate-800">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-8">
        <div className="md:col-span-2">
          <img src={LOGO_URL} className="h-8 mb-6 brightness-9 invert opacity-80" />
          <p className="text-sm max-w-sm leading-relaxed mb-6">
            SkyPeak Designs provides secure hosting, enterprise SEO, and
            scalable infrastructure for growing businesses.
          </p>
          <div className="flex gap-4">
            <Facebook className="w-5 h-5 hover:text-orange-500 cursor-pointer" />
            <Twitter className="w-5 h-5 hover:text-orange-500 cursor-pointer" />
            <Linkedin className="w-5 h-5 hover:text-orange-500 cursor-pointer" />
            <Mail className="w-5 h-5 hover:text-orange-500 cursor-pointer" />
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">
            Support
          </h4>
          <ul className="space-y-3 text-sm">
            <li>Help Center</li>
            <li>Submit Ticket</li>
            <li>Service Status</li>
            <li>API Docs</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">
            Legal
          </h4>
          <ul className="space-y-3 text-sm">
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
            <li>Security Audit</li>
          </ul>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-800 flex justify-between items-center">
        <p className="text-[10px] uppercase font-bold">
          © 2026 SkyPeak Designs
        </p>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span className="text-[10px] font-bold uppercase">
            AES-256 Encrypted
          </span>
        </div>
      </div>
    </div>
  </footer>
);

/* ================= APP ================= */
const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [clients, setClients] = useState<ClientData[]>([]);
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });

  /* ================= LOGIN ================= */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`${API_BASE}/admin/login.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginForm),
    });

    if (!res.ok) {
      alert("Invalid credentials");
      return;
    }

    const data: User = await res.json();
    setUser(data);

    if (data.role === "ADMIN") {
      setActiveTab(AppTab.CLIENTS);
      loadClients();
    } else {
      setActiveTab(AppTab.DASHBOARD);
    }
  };

  /* ================= LOAD CLIENTS (ADMIN) ================= */
const loadClients = async () => {
  try {
    const res = await fetch(`${API_BASE}/admin/clients.php`, {
      headers: {
        "Accept": "application/json"
      }
    });

    if (!res.ok) {
      throw new Error("Failed to load clients");
    }

    const data = await res.json();

    if (!data.clients) {
      console.error("Invalid response:", data);
      return;
    }

    setClients(data.clients);
  } catch (err) {
    console.error("LOAD CLIENTS ERROR:", err);
  }
};
  const handleLogout = () => {
    setUser(null);
    setActiveTab(AppTab.DASHBOARD);
  };

  /* ================= RENDER CONTENT ================= */
  const renderContent = () => {
    const client = user?.clientData;

    switch (activeTab) {
      case AppTab.DASHBOARD:
        return <Dashboard clientData={client} setActiveTab={setActiveTab} />;
      case AppTab.SEO:
        return <SEOSection clientData={client} />;
      case AppTab.DOMAIN:
        return <DomainSection clientData={client} />;
      case AppTab.HOSTING:
        return <HostingSection clientData={client} />;
      case AppTab.PAYMENTS:
        return <PaymentsSection user={user!} clientData={client} />;
      case AppTab.WEBSITE_PAYMENT:
        return <WebsitePaymentSection clientData={client} />;
      case AppTab.MAINTENANCE:
        return <MaintenanceSection clientData={client} />;
      case AppTab.HELP:
        return <SupportSection />;
      case AppTab.CLIENTS:
        return <AdminPanel clients={clients} setClients={setClients} />;
      case AppTab.SOURCE_CODE:
        return <SourceCode />;
      default:
        return null;
    }
  };

  /* ================= NAV ================= */
  const navItems =
    user?.role === "ADMIN"
      ? [
          { id: AppTab.CLIENTS, icon: Users },

        ]
      : [
          { id: AppTab.DASHBOARD, icon: LayoutDashboard },
          { id: AppTab.DOMAIN, icon: Globe },
          { id: AppTab.HOSTING, icon: Server },
          { id: AppTab.PAYMENTS, icon: CreditCard },
          { id: AppTab.WEBSITE_PAYMENT, icon: Briefcase },
          { id: AppTab.SEO, icon: BarChart3 },
          { id: AppTab.MAINTENANCE, icon: Settings },
          { id: AppTab.HELP, icon: LifeBuoy },
        ];
const getDashboardLabel = () => {
  if (!user) return "";
  return user.role === "ADMIN" ? "Admin Dashboard" : "Client Dashboard";
};

  /* ================= LOGIN SCREEN ================= */
  if (!user) {
  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-10 w-full max-w-md shadow-2xl">
        <div className="text-center mb-10">
          <img
            src={LOGO_URL}
            alt="SkyPeak Designs"
            className="h-14 mx-auto mb-6"
          />
          <h1 className="text-2xl font-black text-slate-900">
            Secure <span className="text-orange-500">Portal</span>
          </h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            Login to manage your digital presence
          </p>
        </div>

        {/* ✅ API LOGIN FORM */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
              Username
            </label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) =>
                  setLoginForm({
                    ...loginForm,
                    username: e.target.value,
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4
                  focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                placeholder="e.g. tesla"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({
                    ...loginForm,
                    password: e.target.value,
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4
                  focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4
              rounded-xl transition-all shadow-lg shadow-orange-500/20 active:scale-95"
          >
            Enter Dashboard
          </button>
        </form>
      </div>

      <p className="mt-8 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
        © 2025 SkyPeak Designs
      </p>
    </div>
  );
}
  /* ================= MAIN ================= */
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-[#0f172a] text-white">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <img src={LOGO_URL} className="h-10" />
       <span className="text-lg font-bold uppercase tracking-wider">
  {user?.role === "ADMIN" ? (
    <>
      <span className="text-red-500">Admin</span>{" "}
      <span className="text-orange-400">Dashboard</span>
    </>
  ) : (
    <>
      <span className="text-blue-500">Client</span>{" "}
      <span className="text-orange-400">Dashboard</span>
    </>
  )}
</span>
          <button
      onClick={handleLogout}
      className="flex items-center gap-2 text-slate-300 hover:text-orange-500 font-bold text-sm"
    >
      <LogOut className="w-4 h-4" />
      Logout
    </button>
        </div>

        <div className="bg-[#1e293b] border-t border-slate-800">
          <nav className="max-w-7xl mx-auto px-6 flex gap-8 h-14 items-center overflow-x-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 font-bold text-sm ${
                  activeTab === item.id
                    ? "text-orange-500"
                    : "text-slate-400 hover:text-orange-400 "
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.id}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-8">
        {renderContent()}
      </main>

      <Footer />
    </div>
  );
};

export default App;
