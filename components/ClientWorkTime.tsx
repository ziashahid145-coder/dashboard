import React, { useEffect, useState } from "react";
import { Clock, CheckCircle2 } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE as string;

interface Activity {
  id: number;
  activity_title: string;
  activity_status: string;
  activity_hours: number;
}

interface WorkTimeData {
  total: number;
  used: number;
  design: number;
  development: number;
  seo: number;
  activity: Activity[];
}

const ClientWorkTime: React.FC<{ clientId: string }> = ({ clientId }) => {
  const [data, setData] = useState<WorkTimeData>({
    total: 0,
    used: 0,
    design: 0,
    development: 0,
    seo: 0,
    activity: []
  });

  useEffect(() => {
    load();
  }, [clientId]);
const load = async () => {
  try {
    // LEFT: summary
    const summaryRes = await fetch(
      `${API_BASE}/admin/workTimeSummary.php?client_id=${clientId}`,
      { headers: { Accept: "application/json" } }
    );

    // RIGHT: activity
    const activityRes = await fetch(
      `${API_BASE}/admin/workTimeActivity.php?client_id=${clientId}`,
      { headers: { Accept: "application/json" } }
    );

    if (!summaryRes.ok || !activityRes.ok) return;

    const summaryJson = await summaryRes.json();
    const activityJson = await activityRes.json();

    if (!summaryJson.success || !activityJson.success) return;

    setData({
      total: Number(summaryJson.summary.total) || 0,
      used: Number(summaryJson.summary.used) || 0,
      design: Number(summaryJson.summary.design) || 0,
      development: Number(summaryJson.summary.development) || 0,
      seo: Number(summaryJson.summary.seo) || 0,
      activity: activityJson.activity ?? [] 
    });
  } catch (err) {
    console.error("WorkTime load failed", err);
  }
};
  const percent =
    data.total > 0 ? Math.min((data.used / data.total) * 100, 100) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

      {/* ================= LEFT ================= */}
      <div className="lg:col-span-2 bg-white rounded-2xl p-8 border">

        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-black">Retainer Usage</h3>
            <p className="text-sm text-slate-500">
              Monthly breakdown of development & design hours.
            </p>
          </div>
          <span className="text-sm font-bold text-slate-400">
            Total: {data.total} hrs
          </span>
        </div>

        <div className="flex justify-between text-sm font-bold mb-2">
          <span>Used: {data.used} hrs</span>
        </div>

        {/* Progress */}
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-8">
          <div
            className="h-full bg-slate-900"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Breakdown */}
        <div className="grid grid-cols-3 gap-8 text-sm">
          <Stat label="Design" value={data.design} color="bg-yellow-400" />
          <Stat label="Development" value={data.development} color="bg-blue-400" />
          <Stat label="SEO / Maint" value={data.seo} color="bg-slate-400" />
        </div>
      </div>

      {/* ================= RIGHT ================= */}
      <div className="bg-white rounded-2xl p-8 border space-y-6">
        <h4 className="font-black text-sm flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Recent Activity
        </h4>

        <div className="space-y-4">
          {data.activity.map(a => (
            <div key={a.id} className="flex gap-3">
              <CheckCircle2
                className={`w-5 h-5 ${
                  a.activity_status === "Completed"
                    ? "text-emerald-500"
                    : a.activity_status === "In Progress"
                    ? "text-orange-500"
                    : "text-slate-300"
                }`}
              />

              <div className="flex-1">
                <p className="font-bold text-sm">
                  {a.activity_title}
                </p>
                <p className="text-xs text-slate-500">
                  {a.activity_status} • {a.activity_hours} hrs
                </p>
              </div>
            </div>
          ))}

          {data.activity.length === 0 && (
            <p className="text-sm text-slate-400">No activity yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

/* ===== Helper ===== */
const Stat = ({
  label,
  value,
  color
}: {
  label: string;
  value: number;
  color: string;
}) => (
  <div>
    <p className="text-slate-500 mb-1">{label}</p>
    <p className="font-black text-lg">{value} hrs</p>
    <div className={`h-1 w-10 rounded ${color} mt-2`} />
  </div>
);

export default ClientWorkTime;
