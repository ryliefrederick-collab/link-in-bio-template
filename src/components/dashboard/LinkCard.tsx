"use client";

import type { Link } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface LinkCardProps {
  link: Link;
  onEdit: (link: Link) => void;
  onDelete: (id: number) => void;
  onToggleVisibility: (id: number, visible: boolean) => void;
}

export function LinkCard({ link, onEdit, onDelete, onToggleVisibility }: LinkCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3"
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="flex cursor-grab items-center justify-center rounded p-1 text-gray-400 hover:text-gray-600 active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="5" cy="3" r="1.5" />
          <circle cx="11" cy="3" r="1.5" />
          <circle cx="5" cy="8" r="1.5" />
          <circle cx="11" cy="8" r="1.5" />
          <circle cx="5" cy="13" r="1.5" />
          <circle cx="11" cy="13" r="1.5" />
        </svg>
      </button>

      {/* Link Info */}
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium text-gray-900">
          {link.title}
        </p>
        <p className="truncate text-xs text-gray-500">{link.url}</p>
      </div>

      {/* Campaign badge */}
      {link.category === "campaign" && link.scheduledStart && (
        <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
          Campaign
        </span>
      )}

      {/* Social platform badge */}
      {link.category === "social" && link.socialPlatform && (
        <span className="shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
          {link.socialPlatform}
        </span>
      )}

      {/* Visibility Toggle */}
      <button
        onClick={() => onToggleVisibility(link.id, !link.isVisible)}
        className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium transition-colors ${
          link.isVisible
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-500"
        }`}
      >
        {link.isVisible ? "Visible" : "Hidden"}
      </button>

      {/* Edit Button */}
      <button
        onClick={() => onEdit(link)}
        className="shrink-0 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        aria-label="Edit link"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M11.5 1.5l3 3L5 14H2v-3L11.5 1.5z" />
        </svg>
      </button>

      {/* Delete Button */}
      <button
        onClick={() => onDelete(link.id)}
        className="shrink-0 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
        aria-label="Delete link"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 011.334-1.334h2.666a1.333 1.333 0 011.334 1.334V4m2 0v9.333a1.333 1.333 0 01-1.334 1.334H4.667a1.333 1.333 0 01-1.334-1.334V4h9.334z" />
        </svg>
      </button>
    </div>
  );
}
