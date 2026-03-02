"use client";

import { useEffect, useState, useCallback } from "react";
import type { Link, LinkCategory } from "@/types";
import { LinkList } from "@/components/dashboard/LinkList";
import { LinkEditor } from "@/components/dashboard/LinkEditor";

const TABS: { key: LinkCategory; label: string }[] = [
  { key: "campaign", label: "Campaigns" },
  { key: "evergreen", label: "Evergreen" },
  { key: "social", label: "Social" },
];

export default function LinksPage() {
  const [links, setLinks] = useState<Link[]>([]);
  const [activeTab, setActiveTab] = useState<LinkCategory>("campaign");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);

  const fetchLinks = useCallback(async () => {
    const res = await fetch("/api/links");
    const data = await res.json();
    setLinks(data);
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const filteredLinks = links
    .filter((l) => l.category === activeTab)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const handleReorder = async (orderedIds: number[]) => {
    // Optimistic update
    const reordered = orderedIds.map((id, i) => {
      const link = links.find((l) => l.id === id)!;
      return { ...link, sortOrder: i };
    });
    setLinks((prev) =>
      prev.map((l) => reordered.find((r) => r.id === l.id) || l)
    );

    await fetch("/api/links/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds }),
    });
  };

  const handleSave = async (data: Partial<Link>) => {
    if (data.id) {
      // Update existing
      await fetch(`/api/links/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      // Create new
      await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    fetchLinks();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this link?")) return;
    await fetch(`/api/links/${id}`, { method: "DELETE" });
    setLinks((prev) => prev.filter((l) => l.id !== id));
  };

  const handleToggleVisibility = async (id: number, visible: boolean) => {
    // Optimistic update
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, isVisible: visible } : l))
    );
    await fetch(`/api/links/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isVisible: visible }),
    });
  };

  const handleEdit = (link: Link) => {
    setEditingLink(link);
    setEditorOpen(true);
  };

  const handleAdd = () => {
    setEditingLink(null);
    setEditorOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: '"The Seasons", serif' }}>Links</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your bio page links.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          + Add Link
        </button>
      </div>

      {/* Category Tabs */}
      <div className="mt-6 flex gap-1 rounded-lg bg-gray-100 p-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            <span className="ml-1.5 text-xs text-gray-400">
              {links.filter((l) => l.category === tab.key).length}
            </span>
          </button>
        ))}
      </div>

      {/* Link List */}
      <div className="mt-4">
        <LinkList
          links={filteredLinks}
          onReorder={handleReorder}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleVisibility={handleToggleVisibility}
        />
      </div>

      {/* Link Editor Modal */}
      <LinkEditor
        link={editingLink}
        category={activeTab}
        isOpen={editorOpen}
        onClose={() => {
          setEditorOpen(false);
          setEditingLink(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
}
