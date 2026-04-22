"use client";

import { useEffect, useState, useCallback } from "react";
import type { Earning } from "@/types";
import { EARNINGS_PLATFORMS } from "@/lib/constants";

export default function EarningsPage() {
  const [entries, setEntries] = useState<Earning[]>([]);
  const [filterPlatform, setFilterPlatform] = useState<string>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Earning | null>(null);

  // Form state
  const [platform, setPlatform] = useState("");
  const [amount, setAmount] = useState("");
  const [earnedDate, setEarnedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [note, setNote] = useState("");

  const fetchEntries = useCallback(async () => {
    const url =
      filterPlatform === "all"
        ? "/api/earnings"
        : `/api/earnings?platform=${filterPlatform}`;
    const res = await fetch(url);
    setEntries(await res.json());
  }, [filterPlatform]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  // Compute summaries
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split("T")[0];
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    .toISOString()
    .split("T")[0];

  const allTimeTotal = entries.reduce((sum, e) => sum + e.amount, 0);
  const thisMonthTotal = entries
    .filter((e) => e.earnedDate >= thisMonthStart)
    .reduce((sum, e) => sum + e.amount, 0);
  const lastMonthTotal = entries
    .filter(
      (e) => e.earnedDate >= lastMonthStart && e.earnedDate < thisMonthStart
    )
    .reduce((sum, e) => sum + e.amount, 0);
  const monthChange =
    lastMonthTotal > 0
      ? (((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100).toFixed(0)
      : thisMonthTotal > 0
        ? "+100"
        : "0";

  // Per-platform totals
  const platformTotals = EARNINGS_PLATFORMS.map((p) => ({
    platform: p,
    total: entries
      .filter((e) => e.platform === p)
      .reduce((sum, e) => sum + e.amount, 0),
  })).filter((p) => p.total > 0);

  const openForm = (entry?: Earning) => {
    if (entry) {
      setEditingEntry(entry);
      setPlatform(entry.platform);
      setAmount(entry.amount.toString());
      setEarnedDate(entry.earnedDate);
      setNote(entry.note || "");
    } else {
      setEditingEntry(null);
      setPlatform("");
      setAmount("");
      setEarnedDate(new Date().toISOString().split("T")[0]);
      setNote("");
    }
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { platform, amount: Number(amount), earnedDate, note };

    if (editingEntry) {
      await fetch(`/api/earnings/${editingEntry.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch("/api/earnings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    setFormOpen(false);
    fetchEntries();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this entry?")) return;
    await fetch(`/api/earnings/${id}`, { method: "DELETE" });
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair), serif' }}>Earnings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track affiliate and partnership earnings.
          </p>
        </div>
        <button
          onClick={() => openForm()}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          + Add Entry
        </button>
      </div>

      {/* Summary Cards */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard label="All Time" value={`$${allTimeTotal.toFixed(2)}`} />
        <SummaryCard label="This Month" value={`$${thisMonthTotal.toFixed(2)}`} />
        <SummaryCard label="Last Month" value={`$${lastMonthTotal.toFixed(2)}`} />
        <SummaryCard
          label="Month Change"
          value={`${Number(monthChange) >= 0 ? "+" : ""}${monthChange}%`}
          highlight={Number(monthChange) >= 0}
        />
      </div>

      {/* Per-Platform Breakdown */}
      {platformTotals.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {platformTotals.map((p) => (
            <div
              key={p.platform}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2"
            >
              <span className="text-xs uppercase text-gray-500">
                {p.platform}
              </span>
              <p className="text-sm font-bold text-gray-900">
                ${p.total.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Platform Filter */}
      <div className="mt-6 flex gap-1 rounded-lg bg-gray-100 p-1">
        <button
          onClick={() => setFilterPlatform("all")}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            filterPlatform === "all"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          All
        </button>
        {EARNINGS_PLATFORMS.map((p) => (
          <button
            key={p}
            onClick={() => setFilterPlatform(p)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
              filterPlatform === p
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Entries Table */}
      <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-left font-medium text-gray-500">Date</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Platform</th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">Amount</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Note</th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  No earnings entries yet. Add one above.
                </td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr key={entry.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3 text-gray-700">{entry.earnedDate}</td>
                  <td className="px-4 py-3 capitalize text-gray-700">{entry.platform}</td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">
                    ${entry.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{entry.note || "-"}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openForm(entry)}
                      className="mr-2 text-gray-400 hover:text-gray-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-gray-900">
              {editingEntry ? "Edit Entry" : "Add Entry"}
            </h2>
            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Platform
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  required
                >
                  <option value="">Select platform...</option>
                  {EARNINGS_PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  value={earnedDate}
                  onChange={(e) => setEarnedDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Note (optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  rows={2}
                  placeholder="e.g., Commission from storefront"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                  {editingEntry ? "Save Changes" : "Add Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p
        className={`mt-1 text-2xl font-bold ${
          highlight === undefined
            ? "text-gray-900"
            : highlight
              ? "text-green-600"
              : "text-red-500"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
