"use client";

import { useEffect, useState, useCallback } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

interface OverviewData {
  visits: number;
  clicks: number;
  ctr: string;
  topLinks: { linkId: number; title: string | null; clicks: number }[];
  devices: { deviceType: string | null; count: number }[];
  referrers: { referrer: string | null; count: number }[];
}

interface TimeData {
  date: string;
  count: number;
}

interface CampaignData {
  campaignTag: string | null;
  clicks: number;
}

const PERIODS = [
  { key: "7d", label: "7 days" },
  { key: "30d", label: "30 days" },
  { key: "90d", label: "90 days" },
  { key: "all", label: "All time" },
];

const DEVICE_COLORS = ["#fbbf24", "#fb923c", "#f87171", "#a78bfa"];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("30d");
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [clicksData, setClicksData] = useState<TimeData[]>([]);
  const [visitsData, setVisitsData] = useState<TimeData[]>([]);
  const [campaignData, setCampaignData] = useState<CampaignData[]>([]);

  const fetchData = useCallback(async () => {
    const [ovRes, clRes, viRes, cpRes] = await Promise.all([
      fetch(`/api/analytics/overview?period=${period}`),
      fetch(`/api/analytics/clicks?period=${period}`),
      fetch(`/api/analytics/visits?period=${period}`),
      fetch(`/api/analytics/campaigns?period=${period}`),
    ]);
    setOverview(await ovRes.json());
    setClicksData(await clRes.json());
    setVisitsData(await viRes.json());
    setCampaignData(await cpRes.json());
  }, [period]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair), serif' }}>Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your bio page performance.
          </p>
        </div>

        {/* Period selector */}
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                period === p.key
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {overview && (
        <>
          {/* Stat Cards */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <StatCard label="Page Visits" value={overview.visits.toString()} />
            <StatCard label="Link Clicks" value={overview.clicks.toString()} />
            <StatCard label="CTR" value={`${overview.ctr}%`} />
          </div>

          {/* Visits Chart */}
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-medium text-gray-700">
              Visits Over Time
            </h3>
            <div className="mt-3 h-52">
              {visitsData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={visitsData}>
                    <defs>
                      <linearGradient id="visitGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={formatDate} />
                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip labelFormatter={(label) => formatDate(String(label))} />
                    <Area type="monotone" dataKey="count" stroke="#fbbf24" fill="url(#visitGrad)" name="Visits" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart />
              )}
            </div>
          </div>

          {/* Clicks Chart */}
          <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-medium text-gray-700">
              Clicks Over Time
            </h3>
            <div className="mt-3 h-52">
              {clicksData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={clicksData}>
                    <defs>
                      <linearGradient id="clickGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#fb923c" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#fb923c" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={formatDate} />
                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip labelFormatter={(label) => formatDate(String(label))} />
                    <Area type="monotone" dataKey="count" stroke="#fb923c" fill="url(#clickGrad)" name="Clicks" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart />
              )}
            </div>
          </div>

          {/* Bottom Row: Device Breakdown + Top Links */}
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Device Breakdown */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="text-sm font-medium text-gray-700">
                Device Breakdown
              </h3>
              {overview.devices.length > 0 ? (
                <div className="mt-3 flex items-center gap-4">
                  <div className="h-40 w-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={overview.devices}
                          dataKey="count"
                          nameKey="deviceType"
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                        >
                          {overview.devices.map((_, i) => (
                            <Cell key={i} fill={DEVICE_COLORS[i % DEVICE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-col gap-2">
                    {overview.devices.map((d, i) => (
                      <div key={d.deviceType} className="flex items-center gap-2 text-sm">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: DEVICE_COLORS[i % DEVICE_COLORS.length] }}
                        />
                        <span className="text-gray-600 capitalize">
                          {d.deviceType || "unknown"}
                        </span>
                        <span className="font-medium text-gray-900">{d.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-sm text-gray-400">No data yet.</p>
              )}
            </div>

            {/* Top Links */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="text-sm font-medium text-gray-700">Top Links</h3>
              {overview.topLinks.length > 0 ? (
                <div className="mt-3 flex flex-col gap-2">
                  {overview.topLinks.map((link) => (
                    <div
                      key={link.linkId}
                      className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
                    >
                      <span className="truncate text-sm text-gray-700">
                        {link.title || `Link #${link.linkId}`}
                      </span>
                      <span className="shrink-0 text-sm font-medium text-gray-900">
                        {link.clicks} clicks
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-gray-400">No clicks yet.</p>
              )}
            </div>
          </div>

          {/* Campaign Performance */}
          {campaignData.length > 0 && (
            <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="text-sm font-medium text-gray-700">
                Campaign Performance
              </h3>
              <div className="mt-3 h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={campaignData}>
                    <XAxis dataKey="campaignTag" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="clicks" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Referrers */}
          {overview.referrers.length > 0 && (
            <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="text-sm font-medium text-gray-700">
                Traffic Sources
              </h3>
              <div className="mt-3 flex flex-col gap-2">
                {overview.referrers.map((r) => (
                  <div
                    key={r.referrer}
                    className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
                  >
                    <span className="truncate text-sm text-gray-700">
                      {r.referrer || "Direct"}
                    </span>
                    <span className="shrink-0 text-sm font-medium text-gray-900">
                      {r.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="flex h-full items-center justify-center">
      <p className="text-sm text-gray-400">No data for this period.</p>
    </div>
  );
}

function formatDate(date: string) {
  const d = new Date(date + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
