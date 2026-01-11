import React, { useEffect, useState } from "react";
import {
  Plus, Edit2, Trash2, Search, X, Check,
  Globe, Lock, Server, BarChart,
  DollarSign, FileText, Activity,
  Briefcase, Settings, RefreshCw,
  Cpu, Zap, Target, User as UserIcon,BarChart3, Clock
} from "lucide-react";

import {
  ClientData,
  Invoice,
  ActivityLog,
  WebsitePayment,
  MaintenanceTask,
  KeywordRanking
} from "../types";
const API_BASE = import.meta.env.VITE_API_BASE as string;
const AdminPanel: React.FC = () => {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
useEffect(() => {
  if (!user || user.role !== "CLIENT") return;

  const client = user.clientData;

  setForm(prev => ({
    ...prev,

    // 🔹 PROJECT → Milestones
    websitePayments: client.websitePayments || [],

    // 🔹 MAINTENANCE → Tasks
    maintenanceTasks: (client.maintenanceTasks || []).map(t => ({
      ...t,
      date: t.date
        ? new Date(t.date).toISOString().split("T")[0]
        : ""
    })),

    // 🔹 Maintenance Metrics
    maintenancePlanName: client.maintenancePlanName || "",
    maintenanceNextCharge: client.maintenanceNextCharge || "",
    maintenanceSecurityScore: client.maintenanceSecurityScore || 0,
    maintenanceBackupStatus: client.maintenanceBackupStatus || "",
    maintenancePerformanceResponse: client.maintenancePerformanceResponse || ""
  }));
}, [user]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] =
    useState<"IDENTITY" | "SEO" | "INFRA" | "BILLING"| "WORKTIME"|"PROJECT" | "MAINTENANCE">("IDENTITY");

  /* ================= FETCH CLIENTS ================= */
  const fetchClients = async () => {
  try {
    const res = await fetch(
      `${API_BASE}/admin/clients.php`,
      {
        headers: {
          "Accept": "application/json"
        }
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch clients");
    }

    const data = await res.json();

    // PHP returns { clients: [...] }
    setClients(data.clients || []);
  } catch (err) {
    console.error("Failed to fetch clients", err);
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    fetchClients();
  }, []);

  /* ================= FORM STATE ================= */
  const initialForm: ClientData = {
    id: "",
    name: "",
    username: "",
    password: "",
    email: "",
    domain: "",

    seoScore: 0,
    seoImpressions: 0,
    seoCTR: 0,
    seoTotalKeywords: 0,
    seoRankings: [],

    trafficData: [],
    organicPercent: 0,
    directPercent: 0,
    referralPercent: 0,

    speedIndex: "",
    mobileUX: "",

    domainExpiry: "",
    serverExpiry: "",
    registrar: "",
    serverIP: "",
    serverLocation: "",

    phpVersion: "",
    osVersion: "",
    dbVersion: "",

    maintenanceStatus: "Pending",
    maintenancePlanName: "",
    maintenanceNextCharge: "",
    maintenanceSecurityScore: 0,
    maintenanceBackupStatus: "",
    maintenancePerformanceResponse: "",
    maintenanceTasks: [],

    activityLog: [],
    monthlyPrice: 0,
    maintenancePrice: 0,
    invoices: [],
    websitePayments: [],
   workTime: {
    total: 0,
  used: 0,
  design: 0,
  development: 0,
  seo: 0,
  activity: []
}

  };
 
  const [form, setForm] = useState<ClientData>(initialForm);

  /* ================= OPEN MODAL ================= */
  const openAdd = () => {
    setForm(initialForm);
    setEditingId(null);
    setActiveSubTab("IDENTITY");
    setIsModalOpen(true);
  };
const openEdit = async (client: ClientData) => {
  // 1️⃣ Reset form safely (NO NULLS)
  setForm({
    ...initialForm,

    // 🔐 identity
    id: client.id,
    name: client.name || "",
    email: client.email || "",
    domain: client.domain || "",

    // 🔐 auth (never preload password)
    username: client.username || "",
    password: "",

    // 🔐 SEO
    seoScore: client.seoScore ?? 0,
    seoImpressions: client.seoImpressions ?? 0,
    seoCTR: client.seoCTR ?? 0,
    seoTotalKeywords: client.seoTotalKeywords ?? 0,
    seoRankings: [],
    // 🔐 traffic
    trafficData: Array.isArray(client.trafficData)
      ? client.trafficData
      : [],

    organicPercent: client.organicPercent ?? 0,
    directPercent: client.directPercent ?? 0,
    referralPercent: client.referralPercent ?? 0,

    // 🔐 infra
    speedIndex: client.speedIndex || "",
    mobileUX: client.mobileUX || "",

    domainExpiry: client.domainExpiry || "",
    serverExpiry: client.serverExpiry || "",
    registrar: client.registrar || "",
    serverIP: client.serverIP || "",
    serverLocation: client.serverLocation || "",

    phpVersion: client.phpVersion || "",
    osVersion: client.osVersion || "",
    dbVersion: client.dbVersion || "",

    // 🔐 maintenance
    maintenanceStatus: client.maintenanceStatus || "Pending",
    maintenancePlanName: client.maintenancePlanName || "",
    maintenanceNextCharge: client.maintenanceNextCharge || "",
    maintenanceSecurityScore: client.maintenanceSecurityScore ?? 0,
    maintenanceBackupStatus: client.maintenanceBackupStatus || "",
    maintenancePerformanceResponse: client.maintenancePerformanceResponse || "",
   
    monthlyPrice: Number(client.monthlyPrice) || 0,
    maintenancePrice: Number(client.maintenancePrice) || 0,
     workTime: client.workTime ?? {
      total: 0,
      used: 0,
      design: 0,
      development: 0,
      seo: 0,
      activity: []
    },
    // 🔐 child tables (loaded separately)
    invoices: [],
    websitePayments: [],
    maintenanceTasks: [],
    activityLog: []
  });
 
  // 2️⃣ Edit mode
  setEditingId(client.id);
  setActiveSubTab("IDENTITY");
  setIsModalOpen(true);

  // 3️⃣ Load child data
  try {
    await Promise.all([
      loadSEO(client.id),
      loadInvoices(client.id),
      loadMilestones(client.id),
      loadMaintenance(client.id),
      loadActivity(client.id),
      loadWorkTime(client.id)
    ]);
  } catch (err) {
    console.error("Failed to load edit data:", err);
  }
};
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // 🔒 Validation (ONLY when creating)
  if (!editingId && (!form.username || !form.password)) {
    alert("Username & Password are required");
    return;
  }

  const payload = {
    name: form.name,
    email: form.email,
    domain: form.domain,

    trafficData: Array.isArray(form.trafficData)
      ? form.trafficData
      : [],

    seoScore: form.seoScore,
    seoImpressions: form.seoImpressions,
    seoCTR: form.seoCTR,
    seoTotalKeywords: form.seoTotalKeywords,

    organicPercent: form.organicPercent,
    directPercent: form.directPercent,
    referralPercent: form.referralPercent,

    speedIndex: form.speedIndex,
    mobileUX: form.mobileUX,

    domainExpiry: form.domainExpiry,
    serverExpiry: form.serverExpiry,
    registrar: form.registrar,
    serverIP: form.serverIP,
    serverLocation: form.serverLocation,

    phpVersion: form.phpVersion,
    osVersion: form.osVersion,
    dbVersion: form.dbVersion,

    maintenanceStatus: form.maintenanceStatus,
    maintenancePlanName: form.maintenancePlanName,
    maintenanceNextCharge: form.maintenanceNextCharge,
    maintenanceSecurityScore: form.maintenanceSecurityScore,
    maintenanceBackupStatus: form.maintenanceBackupStatus,
    maintenancePerformanceResponse: form.maintenancePerformanceResponse,

    monthlyPrice: form.monthlyPrice,
    maintenancePrice: form.maintenancePrice,
    workTime: form.workTime
  };

  try {
    const res = await fetch(
      `${API_BASE}/admin/clients.php${editingId ? `?id=${editingId}` : ""}`,
      {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(
          editingId
            ? payload
            : {
                ...payload,
                username: form.username,
                password: form.password,
              }
        ),
      }
    );

  const text = await res.text();
console.log("RAW RESPONSE:", text);

let data;
try {
  data = JSON.parse(text);
} catch (e) {
  console.error("INVALID JSON FROM SERVER");
  alert("Server returned invalid JSON");
  return;
}

console.log("PARSED DATA:", data);

if (!res.ok || data.success === false) {
  alert("SAVE FAILED — CHECK CONSOLE");
  return;
}

    const clientId = editingId || data.clientId;

    // ✅ Ensure edit mode
    setEditingId(clientId);
    if (!editingId) {
  setActiveSubTab("SEO"); // only on first create
}
    // 🔄 Reload all child data from DB
    await Promise.all([
      loadSEO(clientId),
      loadInvoices(clientId),
      loadMilestones(clientId),
      loadMaintenance(clientId),
      loadActivity(clientId),
    ]);

    // 🔁 Refresh client list
    await fetchClients();
  } catch (err) {
  console.error(err);
  alert("Client saved, but some data failed to reload");
}
};
  /* ================= DELETE CLIENT ================= */
 const removeClient = async (id: string) => {
  if (!confirm("Permanently delete this account?")) return;

  await fetch(
    `${API_BASE}/admin/clients.php?id=${id}`,
    {
      method: "DELETE",
      headers: {
        "Accept": "application/json"
      }
    }
  );

  fetchClients();
};
const saveSEO = async () => {
  if (!editingId) {
    alert("Save client first");
    return;
  }

  const seoRankings = form.seoRankings
    .filter(r => r.term && r.term.trim() !== "")
    .map(r => ({
      term: r.term.trim(),
      rank: Number(r.rank) || 0,
      changeText: r.changeText || ""
    }));

  if (seoRankings.length === 0) {
    alert("Add at least one keyword");
    return;
  }

  const res = await fetch(`${API_BASE}/admin/seo.php`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: editingId,
      seoRankings
    })
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    alert("SEO save failed");
    return;
  }

  loadSEO(editingId);
  alert("SEO rankings saved");
};
const loadSEO = async (clientId: string) => {
  const res = await fetch(
    `${API_BASE}/admin/seo.php?client_id=${clientId}`,
    {
      headers: { Accept: "application/json" }
    }
  );

  if (!res.ok) throw new Error("Failed to load SEO");

  const data = await res.json();

  if (data.success) {
    setForm(prev => ({
      ...prev,
      seoRankings: data.seoRankings || []
    }));
  }
};
const deleteSEO = async (id: number) => {
  const res = await fetch(
    `${API_BASE}/admin/seo.php?id=${id}`,
    { method: "DELETE" }
  );

  const data = await res.json();
  if (!data.success) throw new Error("Delete failed");

  // remove from UI AFTER backend success
  setForm(prev => ({
    ...prev,
    seoRankings: prev.seoRankings.filter(r => r.id !== id)
  }));
};
  /* ================= CHILD DATA ================= */
const addInvoice = async () => {
  if (!editingId) {
    alert("Save client first");
    return;
  }

  const amount =
    Number(form.monthlyPrice) + Number(form.maintenancePrice);

  // 1️⃣ Optimistic UI
  const tempInvoice = {
    id: `temp-${Date.now()}`,
    amount,
    status: "Pending",
  };

  setForm(prev => ({
    ...prev,
    invoices: [tempInvoice, ...prev.invoices],
  }));

  // 2️⃣ API call (PHP)
  try {
    const res = await fetch(
      `${API_BASE}/admin/invoices.php`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          client_id: editingId,
          amount,
          status: "Pending"
        }),
      }
    );

    const data = await res.json();

    if (!res.ok || !data.success || !data.id) {
      throw new Error("Invoice creation failed");
    }

    // 3️⃣ Replace temp with DB ID
    setForm(prev => ({
      ...prev,
      invoices: prev.invoices.map(inv =>
        inv.id === tempInvoice.id
          ? {
              ...inv,
              id: data.id,
              invoice_no: data.invoice_no
            }
          : inv
      ),
    }));
  } catch (err) {
    console.error("Add invoice failed:", err);

    // 🔁 rollback UI
    setForm(prev => ({
      ...prev,
      invoices: prev.invoices.filter(
        inv => inv.id !== tempInvoice.id
      ),
    }));

    alert("Failed to add invoice");
  }
};
const loadInvoices = async (clientId: string) => {
  const res = await fetch(
    `${API_BASE}/admin/invoices.php?client_id=${clientId}`,
    { headers: { Accept: "application/json" } }
  );

  const data = await res.json();

  if (!data.success || !Array.isArray(data.invoices)) return;

  setForm(prev => ({
    ...prev,
    invoices: data.invoices
  }));
};
const deleteInvoice = async (id: string | number) => {
  let snapshot: any[] = [];

  setForm(prev => {
    snapshot = prev.invoices;
    return {
      ...prev,
      invoices: prev.invoices.filter(inv => inv.id !== id),
    };
  });

  // TEMP → UI only
  if (typeof id === "string" && id.startsWith("temp")) return;

  try {
    const res = await fetch(
      `${API_BASE}/admin/invoices.php/${id}`, // ✅ FIXED
      {
        method: "DELETE",
        headers: { Accept: "application/json" }
      }
    );

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error("Delete failed");
    }
  } catch (err) {
    console.error("Invoice delete failed", err);

    // rollback
    setForm(prev => ({ ...prev, invoices: snapshot }));
    alert("Invoice delete failed");
  }
};
const updateInvoiceStatus = async (id: number, status: string) => {
  let snapshot: any[] = [];

  setForm(prev => {
    snapshot = prev.invoices;
    return {
      ...prev,
      invoices: prev.invoices.map(inv =>
        inv.id === id ? { ...inv, status } : inv
      ),
    };
  });

  try {
    const res = await fetch(
      `${API_BASE}/admin/invoices.php?id=${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      }
    );

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error();
  } catch {
    setForm(prev => ({ ...prev, invoices: snapshot }));
    alert("Failed to update invoice status");
  }
};
const addWebsitePayment = async () => {
  if (!editingId) {
    alert("Save client first");
    return;
  }

  const today = new Date().toISOString().split("T")[0];

  const payload = {
    client_id: editingId,
    title: "New Milestone Phase",
    amount: 1000,
    status: "Pending",
    date: today
  };

  const res = await fetch(
    `${API_BASE}/admin/websitePayments.php`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }
  );

  const data = await res.json();
  if (!data.success || !data.id) throw new Error();

  setForm(prev => ({
    ...prev,
    websitePayments: [
      { id: data.id, ...payload },
      ...prev.websitePayments
    ]
  }));
};
const loadMilestones = async (clientId: string) => {
  const res = await fetch(
    `${API_BASE}/admin/websitePayments.php/${clientId}`,
    { headers: { Accept: "application/json" } }
  );

  if (!res.ok) throw new Error("Failed to load milestones");

  const data = await res.json();

  setForm(prev => ({
    ...prev,
    websitePayments: data.payments || []
  }));
};
const saveWebsitePayment = async (pay: any) => {
  const res = await fetch(
    `${API_BASE}/admin/websitePayments.php/${pay.id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: pay.title,
        amount: pay.amount,
        status: pay.status,
        date: pay.date
      })
    }
  );

  const data = await res.json();
  if (!data.success) {
    alert("Milestone update failed");
  }
};
const deleteWebsitePayment = async (id: number | string) => {
  // temp row → UI only
  if (String(id).startsWith("temp")) {
    setForm(prev => ({
      ...prev,
      websitePayments: prev.websitePayments.filter(p => p.id !== id)
    }));
    return;
  }

  const res = await fetch(
    `${API_BASE}/admin/websitePayments.php/${id}`,
    { method: "DELETE" }
  );

  const data = await res.json();
  if (!data.success) throw new Error("Delete failed");

  setForm(prev => ({
    ...prev,
    websitePayments: prev.websitePayments.filter(p => p.id !== id)
  }));
};
const addMaintenanceTask = async () => {
  if (!editingId) {
    alert("Save client first");
    return;
  }

  const today = new Date().toISOString().split("T")[0];

  const tempTask = {
    id: `temp-${Date.now()}`,
    name: "New Task",
    status: "Scheduled",
    date: today,
    icon: "Settings"
  };

  // Optimistic UI
  setForm(prev => ({
    ...prev,
    maintenanceTasks: [...prev.maintenanceTasks, tempTask]
  }));

  try {
    const res = await fetch(`${API_BASE}/admin/maintenance.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: editingId,
        name: tempTask.name,
        status: tempTask.status,
        date: tempTask.date,
        icon: tempTask.icon
      })
    });

    const data = await res.json();

    if (!res.ok || !data.success || !data.id) {
      throw new Error("Create failed");
    }

    // Replace temp ID
    setForm(prev => ({
      ...prev,
      maintenanceTasks: prev.maintenanceTasks.map(t =>
        t.id === tempTask.id ? { ...t, id: data.id } : t
      )
    }));
  } catch (err) {
    console.error(err);
    alert("Maintenance task creation failed");

    // rollback
    setForm(prev => ({
      ...prev,
      maintenanceTasks: prev.maintenanceTasks.filter(t => t.id !== tempTask.id)
    }));
  }
};
const loadMaintenance = async (clientId: string) => {
  const res = await fetch(`${API_BASE}/admin/maintenance.php/${clientId}`);

  if (!res.ok) throw new Error("Failed to load maintenance");

  const data = await res.json();

  if (!data.success || !Array.isArray(data.tasks)) {
    throw new Error("Invalid maintenance response");
  }

  setForm(prev => ({
    ...prev,
    maintenanceTasks: data.tasks.map(t => ({
      ...t,
      date: t.date ? t.date.split("T")[0] : ""
    }))
  }));
};
const deleteMaintenanceTask = async (id: string | number) => {
  const snapshot = form.maintenanceTasks;

  setForm(prev => ({
    ...prev,
    maintenanceTasks: prev.maintenanceTasks.filter(t => t.id !== id)
  }));

  if (String(id).startsWith("temp")) return;

  try {
    const res = await fetch(
      `${API_BASE}/admin/maintenance.php/${id}`,
      { method: "DELETE" }
    );

    const data = await res.json();
    if (!data.success) throw new Error();
  } catch {
    alert("Failed to delete maintenance task");
    setForm(prev => ({ ...prev, maintenanceTasks: snapshot }));
  }
};
const updateMaintenanceTask = async (
  id: string | number,
  updates: Partial<MaintenanceTask>
) => {
  const cleanUpdates = Object.fromEntries(
    Object.entries(updates).filter(([_, v]) => v !== undefined)
  );

  setForm(prev => ({
    ...prev,
    maintenanceTasks: prev.maintenanceTasks.map(t =>
      t.id === id ? { ...t, ...cleanUpdates } : t
    )
  }));

  if (String(id).startsWith("temp")) return;

  try {
    await fetch(
      `${API_BASE}/admin/maintenance.php/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanUpdates)
      }
    );
  } catch (err) {
    alert("Failed to update maintenance task");
  }
};
const addActivity = async () => {
  if (!editingId) return;

  const payload = {
    client_id: editingId,
    task: "New System Update",
    date: "Just now",
    icon: "CheckCircle2",
    color: "emerald"
  };

  try {
    const res = await fetch(
      `${API_BASE}/admin/activity.php`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    const data = await res.json();

    if (!res.ok || !data.success || !data.id) {
      throw new Error("API failed");
    }

    // ✅ Update UI
    setForm(prev => ({
      ...prev,
      activityLog: [
        { id: data.id, ...payload },
        ...prev.activityLog
      ]
    }));
  } catch (err) {
    console.error("Activity creation failed:", err);
    alert("Activity creation failed");
  }
};
const deleteActivity = async (id: string | number) => {
  let snapshot: any[] = [];

  // 1️⃣ Optimistic UI
  setForm(prev => {
    snapshot = prev.activityLog;
    return {
      ...prev,
      activityLog: prev.activityLog.filter(log => log.id !== id),
    };
  });

  // 2️⃣ Skip temp items
  if (String(id).startsWith("temp")) return;

  try {
   const res = await fetch(
  `${API_BASE}/admin/activity.php/${id}`,
  { method: "DELETE" }
);

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error("Delete failed");
    }
  } catch (err) {
    console.error("Delete activity failed", err);

    // 🔁 Rollback UI
    setForm(prev => ({
      ...prev,
      activityLog: snapshot,
    }));

    alert("Failed to delete activity from database");
  }
};
const loadActivity = async (clientId: string) => {
  const res = await fetch(
    `${API_BASE}/admin/activity.php/${clientId}`
  );

  const data = await res.json();

  if (data.success && Array.isArray(data.activity)) {
    setForm(prev => ({
      ...prev,
      activityLog: data.activity
    }));
  }
};
const handleTrafficChange = (val: string) => {
  const parsed = val
    .split(",")
    .map(v => Number(v.trim()))
    .filter(v => !Number.isNaN(v));

  setForm(prev => ({
    ...prev,
    trafficData: parsed
  }));
};
const [editingRankingId, setEditingRankingId] = useState<number | null>(null);
// ➕ Add new ranking row
const addRanking = () => {
  setForm(prev => ({
    ...prev,
    seoRankings: [
      ...prev.seoRankings,
      {
        id: `temp-${Date.now()}`, // temp UI id
        term: "",
        rank: 0,
        changeText: ""
      }
    ]
  }));
};
// 🗑 Delete ranking
const removeRanking = async (id: number | string) => {
  // 🟡 TEMP row → UI only
  if (String(id).startsWith("temp")) {
    setForm(prev => ({
      ...prev,
      seoRankings: prev.seoRankings.filter(r => r.id !== id)
    }));
    return;
  }

  try {
    const res = await fetch(
      `${API_BASE}/admin/seo.php?id=${id}`,
      {
        method: "DELETE",
        headers: { Accept: "application/json" }
      }
    );

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error("Delete failed");
    }

    // ✅ Remove from UI after DB success
    setForm(prev => ({
      ...prev,
      seoRankings: prev.seoRankings.filter(r => r.id !== id)
    }));
  } catch (err) {
    console.error("SEO delete failed:", err);
    alert("Failed to delete SEO ranking");
  }
};
// ✏ Update ranking field
const updateRanking = (
  id: number,
  field: "term" | "rank" | "changeText",
  value: string | number
) => {
  setForm(prev => ({
    ...prev,
    seoRankings: prev.seoRankings.map(r =>
      r.id === id ? { ...r, [field]: value } : r
    )
  }));
};
const saveRanking = async (rk: any) => {
  if (!editingId) {
    alert("Save client first");
    return;
  }

  const isTemp = String(rk.id).startsWith("temp");

  try {
    const res = await fetch(
      `${API_BASE}/admin/seo.php`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          client_id: editingId,
          term: rk.term,
          rank: rk.rank,
          changeText: rk.changeText
        })
      }
    );

    const data = await res.json();

    if (!res.ok || !data.success || !data.id) {
      throw new Error("Save failed");
    }

    // 🔁 Replace temp ID with DB ID
    setForm(prev => ({
      ...prev,
      seoRankings: prev.seoRankings.map(r =>
        r.id === rk.id ? { ...r, id: data.id } : r
      )
    }));
  } catch (err) {
    console.error("Save ranking failed:", err);
    alert("Failed to save ranking");
  }
};
const saveSingleRanking = async (rk: any) => {
  if (!editingId) {
    alert("Save client first");
    return;
  }

  const isNew = String(rk.id).startsWith("temp");

  const url = isNew
    ? `${API_BASE}/admin/clients/${editingId}/seo`
    : `${API_BASE}/admin/clients/${editingId}/seo/${rk.id}`;

  const method = isNew ? "POST" : "PUT";

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        term: rk.term,
        rank: rk.rank,
        changeText: rk.changeText
      })
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error("Save failed");
    }

    // 🔁 Replace temp ID after ADD
    if (isNew && data.id) {
      setForm(prev => ({
        ...prev,
        seoRankings: prev.seoRankings.map(r =>
          r.id === rk.id ? { ...r, id: data.id } : r
        )
      }));
    }

    setEditingRankingId(null);
  } catch (err) {
    console.error("SEO save failed:", err);
    alert("Failed to save SEO ranking");
  }
};


  const payload = {
    client_id: editingId,
    activity_title: "New Task",
    activity_status: "Pending",
    activity_hours: 1
  };

const [newActivity, setNewActivity] = useState({
  title: "",
  status: "In Progress",
  hours: 1
});
const loadWorkTime = async (clientId: string) => {
  /* ---------- SUMMARY ---------- */
  const summaryRes = await fetch(
    `${API_BASE}/admin/workTimeSummary.php?client_id=${clientId}`,
    { headers: { Accept: "application/json" } }
  );

  if (!summaryRes.ok) return;
  const summaryData = await summaryRes.json();
  if (!summaryData.success) return;

  /* ---------- ACTIVITY ---------- */
  const activityRes = await fetch(
    `${API_BASE}/admin/workTimeActivity.php?client_id=${clientId}`,
    { headers: { Accept: "application/json" } }
  );

  if (!activityRes.ok) return;
  const activityData = await activityRes.json();

  setForm(prev => ({
    ...prev,
    workTime: {
      total: Number(summaryData.summary.total) || 0,
      used: Number(summaryData.summary.used) || 0,
      design: Number(summaryData.summary.design) || 0,
      development: Number(summaryData.summary.development) || 0,
      seo: Number(summaryData.summary.seo) || 0,
      activity: activityData.activity || []
    }
  }));
};
const saveWorkTime = async () => {
  if (!editingId) return;

  const res = await fetch(
    `${API_BASE}/admin/workTimeSummary.php`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: editingId,
        total_hours: form.workTime.total,
        used_hours: form.workTime.used,
        design_hours: form.workTime.design,
        development_hours: form.workTime.development,
        seo_hours: form.workTime.seo
      })
    }
  );

  const data = await res.json();
  if (!data.success) {
    alert("Summary save failed");
    return;
  }

  loadWorkTime(editingId);
};
const addActivity1 = async () => {
  if (!editingId || !newActivity.title) return;

  const res = await fetch(
    `${API_BASE}/admin/workTimeActivity.php`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: editingId,
        activity_title: newActivity.title,
        activity_status: newActivity.status,
        activity_hours: newActivity.hours
      })
    }
  );

  const data = await res.json();
  if (!data.success) {
    alert("Activity add failed");
    return;
  }

  setNewActivity({ title: "", status: "In Progress", hours: 1 });
  loadWorkTime(editingId);
};
const deleteActivity1 = async (id: number) => {
  await fetch(
    `${API_BASE}/admin/workTimeActivity.php?id=${id}`,
    { method: "DELETE" }
  );

  loadWorkTime(editingId!);
};
const [editingActivityId, setEditingActivityId] = useState<number | null>(null);
const updateActivity = async (
  id: number,
  updates: {
    activity_title?: string;
    activity_status?: string;
    activity_hours?: number;
  }
) => {
  await fetch(
    `${API_BASE}/admin/workTimeActivity.php?id=${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates)
    }
  );

  loadWorkTime(editingId!);
};

  /* ================= LOADING ================= */
  if (loading) {
    return <div className="p-20 text-center font-bold">Loading clients...</div>;
  }

  /* ================= JSX ================= */
  return (
   <div className="w-full px-6 lg:px-12 space-y-8 animate-in fade-in duration-500">
  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
    <div>
      <h2 className="text-3xl font-black text-slate-900 tracking-tight">
        Admin <span className="text-orange-500">Center</span>
      </h2>
      <p className="text-slate-500 font-medium">
        Control every metric of the client experience.
      </p>
    </div>

    <button
      onClick={openAdd}
      className="px-8 py-4 bg-orange-500 text-white rounded-2xl font-black flex items-center gap-2 hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 active:scale-95"
    >
      <Plus className="w-5 h-5" /> Initialize Client
    </button>
  </div>

  <div className="bg-white w-full rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
    {/* header */}
    <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between bg-slate-50/50 gap-4">
      <div className="relative w-full">
        <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search accounts..."
          className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div className="flex gap-4">
        <div className="text-center px-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Clients
          </p>
          <p className="text-xl font-black text-slate-900">
            {clients.length}
          </p>
        </div>

        <div className="text-center px-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Avg SEO
          </p>
          <p className="text-xl font-black text-orange-500">82%</p>
        </div>
      </div>
    </div>

    {/* table */}
    <div className="overflow-x-auto">
      <table className="w-full min-w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Profile</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Auth</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Health</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Revenue</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50/40 group transition-all">
                  <td className="px-8 py-6"><div className="font-bold text-slate-900">{client.name}</div><div className="text-xs text-slate-500">{client.domain}</div></td>
                  <td className="px-8 py-6"><div className="text-sm font-bold text-slate-700">{client.username}</div><div className="text-[10px] text-slate-400 font-mono">{client.password}</div></td>
                  <td className="px-8 py-6"><div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-emerald-500 rounded-full"></span><span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Healthy</span></div></td>
                  <td className="px-8 py-6"><div className="font-black text-slate-900">${(client.monthlyPrice + client.maintenancePrice).toFixed(0)}</div></td>
                  <td className="px-8 py-6 text-right"><div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => openEdit(client)} className="p-2 text-slate-400 hover:text-orange-500 border border-slate-100 rounded-lg"><Edit2 className="w-4 h-4" /></button><button onClick={() => removeClient(client.id)} className="p-2 text-slate-400 hover:text-red-500 border border-slate-100 rounded-lg"><Trash2 className="w-4 h-4" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
  
            </div>
            
            {isModalOpen && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60">
    <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col">
<div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white">
  <div>
    <h3 className="text-2xl font-black text-slate-900">
      {editingId ? "Edit Configuration" : "Create Global Asset"}
    </h3>
    <p className="text-sm text-slate-500">
      Configure search rankings, infrastructure and billing.
    </p>
  </div>
  <button
    onClick={() => setIsModalOpen(false)}
    className="p-3 hover:bg-slate-100 rounded-full"
  >
    <X className="w-6 h-6 text-slate-400" />
  </button>
</div>
<div
  className="
    flex
    h-30
    items-center
    border-b border-slate-100
    bg-slate-50/50
    px-8
    overflow-x-auto
    overflow-y-hidden
    whitespace-nowrap
    no-scrollbar
  "
>
  {[
    { id: "IDENTITY", label: "Identity & Access", icon: UserIcon },
    { id: "SEO", label: "Growth & SEO", icon: BarChart },
    { id: "INFRA", label: "Infrastructure", icon: Server },
    { id: "BILLING", label: "Retainers", icon: FileText },
    { id: "WORKTIME", label: "Work Time", icon: BarChart3 },
    { id: "PROJECT", label: "Project Billing", icon: Briefcase },
    { id: "MAINTENANCE", label: "Maintenance", icon: Settings }
  ].map(tab => (
    <button
      key={tab.id}
      onClick={() => setActiveSubTab(tab.id as any)}
      className={`flex items-center gap-2 py-8 px-4 font-black text-[10px] uppercase tracking-[0.2em] relative whitespace-nowrap
        ${activeSubTab === tab.id
          ? "text-orange-500"
          : "text-slate-400 hover:text-orange-500"}`}
    >
      <tab.icon className="w-4 h-4" />
      {tab.label}
      {activeSubTab === tab.id && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 rounded-t-full" />
      )}
    </button>
  ))}
</div>
            
            <form
  onSubmit={handleSubmit}
  className="p-10 flex-1 overflow-y-auto space-y-12"
>
              {activeSubTab === 'IDENTITY' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in slide-in-from-left-4 duration-300">
                  <div className="space-y-6">
                    <h4 className="text-lg font-black text-slate-900 flex items-center gap-2"><Globe className="w-5 h-5 text-orange-500" /> Basic Details</h4>
                    <div className="space-y-4">
                      <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Client Official Name</label><input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 outline-none" /></div>
                      <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Domain</label><input required type="text" value={form.domain} onChange={e => setForm({...form, domain: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" placeholder="example.com" /></div>
                      <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Email</label><input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" /></div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h4 className="text-lg font-black text-slate-900 flex items-center gap-2"><Lock className="w-5 h-5 text-blue-500" /> Portal Credentials</h4>
                    <div className="space-y-4">
                      <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Username</label><input required type="text" value={form.username} onChange={e => setForm({...form, username: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" /></div>
                      <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secure Password</label><input required type="text" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" /></div>
                    </div>
                  </div>
                </div>
              )}


{activeSubTab === 'SEO' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in slide-in-from-left-4 duration-300">
                  <div className="space-y-6">
                    <h4 className="text-lg font-black text-slate-900 flex items-center gap-2"><Target className="w-5 h-5 text-emerald-500" /> Organic Metrics</h4>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SEO Score (%)</label><input type="number" value={form.seoScore} onChange={e => setForm({...form, seoScore: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" /></div>
                      <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Impressions</label><input type="number" value={form.seoImpressions} onChange={e => setForm({...form, seoImpressions: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" /></div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Traffic Acquisition Trend (Trend Line Data, Comma separated)</label>
                      <input
  type="text"
  value={Array.isArray(form.trafficData) ? form.trafficData.join(", ") : ""}
  onChange={e => handleTrafficChange(e.target.value)}
  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none"
  placeholder="40, 30, 45, 70, 65, 90"
/>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Organic %</label><input type="number" value={form.organicPercent} onChange={e => setForm({...form, organicPercent: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" /></div>
                      <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Direct %</label><input type="number" value={form.directPercent} onChange={e => setForm({...form, directPercent: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" /></div>
                      <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Referral %</label><input type="number" value={form.referralPercent} onChange={e => setForm({...form, referralPercent: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" /></div>
                    </div>
                  </div>
                  <div className="space-y-6">
  <div className="flex justify-between items-center">
    <h4 className="text-lg font-black text-slate-900 flex items-center gap-2">
      <Target className="w-5 h-5 text-orange-500" />
      Ranking Manager
    </h4>
    <button
      type="button"
      onClick={addRanking}
      className="text-[10px] font-black text-orange-600 uppercase tracking-widest hover:underline"
    >
      + New Rank
    </button>
  </div>

  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
    {form.seoRankings.map(rk => {
      const isEditing = editingRankingId === rk.id;

      return (
        <div
          key={rk.id}
          className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 relative"
        >
          {/* ACTION BUTTONS */}
          <div className="absolute top-4 right-4 flex gap-2">
            {isEditing ? (
              <button
                type="button"
                onClick={() => saveSingleRanking(rk)}
                className="text-emerald-600 hover:text-emerald-700"
                title="Save"
              >
                <Check className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setEditingRankingId(rk.id)}
                className="text-slate-400 hover:text-blue-600"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => removeRanking(rk.id)}
              className="text-slate-300 hover:text-red-500"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* TERM */}
          <div className="space-y-1">
            <label className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Keyword Term
            </label>
            <input
              type="text"
              value={rk.term}
              disabled={!isEditing}
              onChange={e =>
                updateRanking(rk.id, "term", e.target.value)
              }
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold disabled:bg-slate-100"
            />
          </div>

          {/* RANK + CHANGE */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Rank #
              </label>
              <input
                type="number"
                value={rk.rank}
                disabled={!isEditing}
                onChange={e =>
                  updateRanking(rk.id, "rank", Number(e.target.value))
                }
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold disabled:bg-slate-100"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Change Status
              </label>
              <input
                type="text"
                value={rk.changeText || ""}
                disabled={!isEditing}
                onChange={e =>
                  updateRanking(rk.id, "changeText", e.target.value)
                }
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold disabled:bg-slate-100"
                placeholder="+2 POS"
              />
            </div>
          </div>
        </div>
      );
    })}
  </div>
  <div className="pt-6">
  <button
    type="button"
    onClick={saveSEO}
    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl transition"
  >
    Save All SEO Rankings
  </button>
</div>
</div>
 
                    </div>
                  

              )}
              {activeSubTab === 'INFRA' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in slide-in-from-left-4 duration-300">
                  <div className="space-y-6">
                    <h4 className="text-lg font-black text-slate-900 flex items-center gap-2"><Zap className="w-5 h-5 text-blue-500" /> Cloud Configuration</h4>
                    <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
    Domain Expiry Date
  </label>
  <input
  type="date"
  value={form.domainExpiry || ""}
  onChange={e =>
    setForm({ ...form, domainExpiry: e.target.value })
  }
    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none"
  />
</div>

<div className="space-y-2">
  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
    Hosting Renewal Date
  </label>
  <input
    type="date"
    value={form.serverExpiry || ""}
    onChange={e =>
      setForm({ ...form, serverExpiry: e.target.value })
    }
    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none"
  />
</div>

                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Server IP Address</label><input type="text" value={form.serverIP} onChange={e => setForm({...form, serverIP: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" /></div>
                      <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registry Provider</label><input type="text" value={form.registrar} onChange={e => setForm({...form, registrar: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" /></div>
                    </div>
                    <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Datacenter Region</label><input type="text" value={form.serverLocation} onChange={e => setForm({...form, serverLocation: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" /></div>
                  </div>
                  <div className="space-y-6">
                    <h4 className="text-lg font-black text-slate-900 flex items-center gap-2"><Cpu className="w-5 h-5 text-purple-500" /> Technical Stack</h4>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PHP Version</label><input type="text" value={form.phpVersion} onChange={e => setForm({...form, phpVersion: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" /></div>
                      <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">OS Environment</label><input type="text" value={form.osVersion} onChange={e => setForm({...form, osVersion: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" /></div>
                      <div className="space-y-2 col-span-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Database Engine</label><input type="text" value={form.dbVersion} onChange={e => setForm({...form, dbVersion: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" /></div>
                    </div>
                  </div>
                </div>
              )}
   {activeSubTab === 'BILLING' && (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in slide-in-from-left-4 duration-300">

    {/* ================= LEFT: SUBSCRIPTION & INVOICES ================= */}
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-emerald-500" />
          Subscription & Invoices
        </h4>

        <button
          type="button"
          onClick={addInvoice}
          className="text-[10px] font-black text-orange-500 uppercase tracking-widest hover:underline"
        >
          + New Invoice
        </button>
      </div>

      {/* PRICES */}
      <div className="grid grid-cols-2 gap-6">
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
      SEO Retainer ($)
    </label>
    <input
      type="number"
      value={form.monthlyPrice ?? ""}
      onChange={e =>
        setForm({
          ...form,
          monthlyPrice: Number(e.target.value) || 0
        })
      }
      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none"
    />
  </div>

  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
      Maint. Fee ($)
    </label>
    <input
      type="number"
      value={form.maintenancePrice ?? ""}
      onChange={e =>
        setForm({
          ...form,
          maintenancePrice: Number(e.target.value) || 0
        })
      }
      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none"
    />
  </div>
</div>
      {/* INVOICE LIST */}
      <div className="max-h-48 overflow-y-auto bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
        {form.invoices.map(inv => (
          <div
            key={inv.id}
            className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-100 shadow-sm"
          >
            <span className="text-[10px] font-black">
  {inv.invoice_no} • ${inv.amount}
</span>

            <button
              type="button"
              onClick={() => deleteInvoice(inv.id)}
              className="text-slate-300 hover:text-red-500"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>

    {/* ================= RIGHT: MAINTENANCE LOGS ================= */}
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-orange-500" />
          Maintenance Logs
        </h4>

        <button
          type="button"
          onClick={addActivity}
          className="text-[10px] font-black text-orange-500 uppercase tracking-widest hover:underline"
        >
          + Add Entry
        </button>
      </div>

      <div className="max-h-[300px] overflow-y-auto bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
        {form.activityLog.map(log => (
          <div
            key={log.id}
            className="p-3 bg-white rounded-xl border border-slate-100 flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-bold text-slate-900">
                {log.task}
              </p>
              <p className="text-[10px] text-slate-400 font-medium">
                {log.date}
              </p>
            </div>

            <button
              type="button"
              onClick={() => deleteActivity(log.id)}
              className="text-slate-300 hover:text-red-500"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>

  </div>
)}
         
              {activeSubTab === "PROJECT" && (
  <div className="space-y-8">
    <div className="flex justify-between items-center">
      <h4 className="text-lg font-black flex items-center gap-2">
        <Briefcase className="w-5 h-5 text-indigo-500" />
        Website Project Milestones
      </h4>

      <button
        type="button"
        onClick={addWebsitePayment}
        className="text-[10px] font-black text-indigo-600 uppercase"
      >
        + New Milestone
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {form.websitePayments.map((pay, i) => (
        <div key={pay.id} className="bg-slate-50 p-6 rounded-2xl relative">

          {/* DELETE */}
          <button
            type="button"
            onClick={() => deleteWebsitePayment(pay.id)}
            className="absolute top-4 right-7 text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* TITLE */}
          <input
            value={pay.title}
            onChange={e => {
              const list = [...form.websitePayments];
              list[i].title = e.target.value;
              setForm({ ...form, websitePayments: list });
            }}
            className="w-full mb-2 border rounded px-3 py-2"
          />

          {/* AMOUNT */}
          <input
            type="number"
            value={pay.amount}
            onChange={e => {
              const list = [...form.websitePayments];
              list[i].amount = Number(e.target.value);
              setForm({ ...form, websitePayments: list });
            }}
            className="w-full mb-2 border rounded px-3 py-2"
          />

          {/* STATUS */}
          <select
            value={pay.status}
            onChange={e => {
              const list = [...form.websitePayments];
              list[i].status = e.target.value;
              setForm({ ...form, websitePayments: list });
            }}
            className="w-full mb-2 border rounded px-3 py-2"
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
          </select>

          {/* DATE */}
          <input
            type="date"
            value={pay.date || ""}
            onChange={e => {
              const list = [...form.websitePayments];
              list[i].date = e.target.value;
              setForm({ ...form, websitePayments: list });
            }}
            className="w-full mb-3 border rounded px-3 py-2"
          />

          {/* SAVE */}
          <button
            type="button"
            onClick={() => saveWebsitePayment(pay)}
            className="w-full bg-indigo-600 text-white py-2 rounded-xl"
          >
            Save Milestone
          </button>
        </div>
      ))}
    </div>
  </div>
)}
             {activeSubTab === "MAINTENANCE" && (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in slide-in-from-left-4 duration-300">

    {/* LEFT: METRICS */}
    <div className="space-y-6">
      <h4 className="text-lg font-black text-slate-900 flex items-center gap-2">
        <Settings className="w-5 h-5 text-orange-500" />
        General Maintenance Metrics
      </h4>

      <div className="space-y-4">
        <input
          placeholder="Plan Name"
          value={form.maintenancePlanName || ""}
          onChange={e =>
            setForm({ ...form, maintenancePlanName: e.target.value })
          }
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm"
        />

        <input
          placeholder="Next Renewal Date"
          value={form.maintenanceNextCharge || ""}
          onChange={e =>
            setForm({ ...form, maintenanceNextCharge: e.target.value })
          }
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Security Score %"
            value={form.maintenanceSecurityScore ?? 0}
            onChange={e =>
              setForm({
                ...form,
                maintenanceSecurityScore: Number(e.target.value)
              })
            }
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm"
          />

          <input
            placeholder="Backup Status"
            value={form.maintenanceBackupStatus || ""}
            onChange={e =>
              setForm({ ...form, maintenanceBackupStatus: e.target.value })
            }
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm"
          />
        </div>

        <input
          placeholder="Avg Response Time"
          value={form.maintenancePerformanceResponse || ""}
          onChange={e =>
            setForm({
              ...form,
              maintenancePerformanceResponse: e.target.value
            })
          }
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm"
        />
      </div>
    </div>

    {/* RIGHT: TASKS */}
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-black flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-blue-500" />
          Maintenance Task Log
        </h4>

        <button
          type="button"
          onClick={addMaintenanceTask}
          className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
        >
          + New Task
        </button>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 no-scrollbar">
        {form.maintenanceTasks.map(task => {
          const isCompleted = task.status === "Completed";

          return (
            <div
              key={task.id}
              className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 relative"
            >
              <button
                type="button"
                onClick={() => deleteMaintenanceTask(task.id)}
                className="absolute top-4 right-4 text-slate-300 hover:text-red-500"
              >
                ✕
              </button>

              <input
                value={task.name || ""}
                disabled={isCompleted}
                onChange={e =>
                  updateMaintenanceTask(task.id, { name: e.target.value })
                }
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold disabled:bg-slate-100"
                placeholder="Task Name"
              />

              <div className="grid grid-cols-3 gap-2">
                <select
                  value={task.status || "Scheduled"}
                  onChange={e =>
                    updateMaintenanceTask(task.id, {
                      status: e.target.value
                    })
                  }
                  className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-[10px] font-bold"
                >
                  <option>Completed</option>
                  <option>Active</option>
                  <option>Scheduled</option>
                </select>

                <input
                  type="date"
                  value={task.date || ""}
                  disabled={isCompleted}
                  onChange={e =>
                    updateMaintenanceTask(task.id, { date: e.target.value })
                  }
                  className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-[10px] font-bold disabled:bg-slate-100"
                />

                <select
                  value={task.icon || "Settings"}
                  onChange={e =>
                    updateMaintenanceTask(task.id, { icon: e.target.value })
                  }
                  className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-[10px] font-bold"
                >
                  <option value="Zap">Zap</option>
                  <option value="ShieldCheck">Security</option>
                  <option value="Database">Database</option>
                  <option value="RefreshCw">Refresh</option>
                  <option value="Settings">Settings</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
)}     
{activeSubTab === "WORKTIME" && (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-left-4">

    {/* ================= LEFT : RETAINER USAGE ================= */}
    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 space-y-6">

      <div className="flex justify-between items-center">
        <h4 className="text-lg font-black">Retainer Usage</h4>
        <button
          onClick={saveWorkTime}
          className="text-sm font-black text-orange-500 hover:underline"
        >
          Push Updates →
        </button>
      </div>

      {/* USED / TOTAL */}
      <div className="flex justify-between text-sm font-bold">
        <span>Used: {form.workTime.used} hrs</span>
        <span>Total: {form.workTime.total} hrs</span>
      </div>

      {/* PROGRESS */}
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-slate-900"
          style={{
            width: `${
              form.workTime.total
                ? Math.min(
                    (form.workTime.used / form.workTime.total) * 100,
                    100
                  )
                : 0
            }%`
          }}
        />
      </div>

      {/* HOURS INPUTS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          ["total_hours", "total"],
          ["Used_Hours", "used"],
          ["Design_Hours", "design"],
          ["Development_Hours", "development"],
          ["SEO / Maint_Hours", "seo"]
        ].map(([label, key]) => (
          <div key={key}>
            <label className="text-[10px] font-black text-slate-400 uppercase">
              {label}
            </label>
            <input
              type="number"
              value={(form.workTime as any)[key]}
              onChange={e =>
                setForm({
                  ...form,
                  workTime: {
                    ...form.workTime,
                    [key]: Number(e.target.value)
                  }
                })
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold"
            />
          </div>
        ))}
      </div>

      {/* RESET */}
      <button
        onClick={() =>
          setForm({
            ...form,
            workTime: {
              total: 0,
              used: 0,
              design: 0,
              development: 0,
              seo: 0,
              activity: []
            }
          })
        }
        className="text-xs font-black text-red-500 hover:underline"
      >
        Reset Work Time
      </button>
    </div>

    {/* ================= RIGHT : ACTIVITY LOG ================= */}
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">

      <h4 className="font-black text-sm">Recent Activity</h4>

      {/* ADD ACTIVITY */}
      <div className="space-y-2">
        <input
          placeholder="Activity name"
          value={newActivity.title}
          onChange={e =>
            setNewActivity({ ...newActivity, title: e.target.value })
          }
          className="w-full bg-slate-50 border rounded-xl px-3 py-2 text-sm"
        />

        <div className="grid grid-cols-2 gap-2">
          <select
            value={newActivity.status}
            onChange={e =>
              setNewActivity({ ...newActivity, status: e.target.value })
            }
            className="bg-slate-50 border rounded-xl px-3 py-2 text-sm"
          >
            <option>Completed</option>
            <option>In Progress</option>
            <option>Pending</option>
          </select>

          <input
            type="number"
            placeholder="Hours"
            value={newActivity.hours}
            onChange={e =>
              setNewActivity({
                ...newActivity,
                hours: Number(e.target.value)
              })
            }
            className="bg-slate-50 border rounded-xl px-3 py-2 text-sm"
          />
        </div>

        <button
          onClick={addActivity1}
          className="w-full bg-slate-900 text-white font-black py-2 rounded-xl"
        >
          + Add Activity
        </button>
      </div>

      {/* ACTIVITY LIST */}
<div className="space-y-3">
  {form.workTime.activity.map((a, i) => {
    const isEditing = editingActivityId === a.id;

    return (
      <div
        key={a.id}
        className="flex justify-between items-center border rounded-xl px-4 py-3"
      >
        {/* LEFT */}
        <div className="flex-1 space-y-1">
          <input
            disabled={!isEditing}
            value={a.activity_title}
            onChange={e =>
              setForm(prev => ({
                ...prev,
                workTime: {
                  ...prev.workTime,
                  activity: prev.workTime.activity.map(act =>
                    act.id === a.id
                      ? { ...act, activity_title: e.target.value }
                      : act
                  )
                }
              }))
            }
            className={`font-bold text-sm w-full outline-none ${
              isEditing ? "bg-slate-50 border rounded px-2 py-1" : "bg-transparent"
            }`}
          />

          <select
            disabled={!isEditing}
            value={a.activity_status}
            onChange={e =>
              setForm(prev => ({
                ...prev,
                workTime: {
                  ...prev.workTime,
                  activity: prev.workTime.activity.map(act =>
                    act.id === a.id
                      ? { ...act, activity_status: e.target.value }
                      : act
                  )
                }
              }))
            }
            className={`text-xs outline-none ${
              isEditing ? "bg-slate-50 border rounded px-2 py-1" : "bg-transparent"
            }`}
          >
            <option>Completed</option>
            <option>In Progress</option>
            <option>Pending</option>
          </select>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          <input
            type="number"
            disabled={!isEditing}
            value={a.activity_hours}
            onChange={e =>
              setForm(prev => ({
                ...prev,
                workTime: {
                  ...prev.workTime,
                  activity: prev.workTime.activity.map(act =>
                    act.id === a.id
                      ? { ...act, activity_hours: Number(e.target.value) }
                      : act
                  )
                }
              }))
            }
            className={`w-16 text-sm font-black ${
              isEditing
                ? "bg-slate-50 border rounded px-2 py-1"
                : "bg-transparent"
            }`}
          />

          {/* SAVE / EDIT */}
          {isEditing ? (
            <button
              onClick={async () => {
                await updateActivity(a.id, {
                  activity_title: a.activity_title,
                  activity_status: a.activity_status,
                  activity_hours: a.activity_hours
                });
                setEditingActivityId(null);
              }}
              className="text-emerald-600 font-black"
            >
              ✓
            </button>
          ) : (
            <button
              onClick={() => setEditingActivityId(a.id)}
              className="text-slate-400 font-black"
            >
              ✎
            </button>
          )}

          {/* DELETE */}
          <button
            onClick={() => deleteActivity1(a.id)}
            className="text-red-500 font-black"
          >
            ✕
          </button>
        </div>
      </div>
    );
  })}
</div>
    </div>
  </div>
)}
              <div className="pt-10 flex flex-col md:flex-row gap-4 border-t border-slate-100">
                <button type="submit" className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-[0.98]">
                  <Check className="w-6 h-6 text-orange-500" /> {editingId ? 'Push Updates to Dashboard' : 'Finalize Asset Deployment'}
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-10 py-5 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default AdminPanel;


