"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { tags as tagsApi } from "@/lib/api";

interface TripTag {
  id: string;
  slug: string;
  emoji: string;
  labelEn: string;
  labelKa?: string | null;
}

// Cache for tags to avoid repeated fetches
let tagsCache: TripTag[] | null = null;
let tagsCachePromise: Promise<TripTag[]> | null = null;

async function fetchTagsWithCache(): Promise<TripTag[]> {
  if (tagsCache) {
    return tagsCache;
  }

  if (tagsCachePromise) {
    return tagsCachePromise;
  }

  tagsCachePromise = tagsApi.getAll()
    .then((data) => {
      tagsCache = data as TripTag[];
      return tagsCache;
    })
    .catch((err) => {
      console.error("Error fetching tags:", err);
      tagsCachePromise = null;
      return [];
    });

  return tagsCachePromise;
}

interface TagBadgeProps {
  slug: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  showBilingual?: boolean;
  className?: string;
}

export function TagBadge({
  slug,
  size = "md",
  showLabel = true,
  showBilingual = false,
  className,
}: TagBadgeProps) {
  const [tag, setTag] = React.useState<TripTag | null>(null);

  React.useEffect(() => {
    fetchTagsWithCache().then((tags) => {
      const found = tags.find((t) => t.slug === slug);
      setTag(found || null);
    });
  }, [slug]);

  if (!tag) {
    // Fallback display while loading or if not found
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full bg-muted text-muted-foreground",
          size === "sm" && "px-2 py-0.5 text-xs",
          size === "md" && "px-2.5 py-1 text-sm",
          size === "lg" && "px-3 py-1.5 text-base",
          className
        )}
      >
        {slug}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary border border-primary/20",
        size === "sm" && "px-2 py-0.5 text-xs",
        size === "md" && "px-2.5 py-1 text-sm",
        size === "lg" && "px-3 py-1.5 text-base",
        className
      )}
    >
      <span>{tag.emoji}</span>
      {showLabel && (
        <>
          <span className="font-medium">{tag.labelEn}</span>
          {showBilingual && tag.labelKa && (
            <>
              <span className="text-primary/60">/</span>
              <span className="text-primary/80">{tag.labelKa}</span>
            </>
          )}
        </>
      )}
    </span>
  );
}

// Component to display a list of tags
interface TagListProps {
  tags: string[];
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  showBilingual?: boolean;
  maxVisible?: number;
  className?: string;
}

export function TagList({
  tags,
  size = "md",
  showLabel = true,
  showBilingual = false,
  maxVisible,
  className,
}: TagListProps) {
  const visibleTags = maxVisible ? tags.slice(0, maxVisible) : tags;
  const hiddenCount = maxVisible ? Math.max(0, tags.length - maxVisible) : 0;

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {visibleTags.map((slug) => (
        <TagBadge
          key={slug}
          slug={slug}
          size={size}
          showLabel={showLabel}
          showBilingual={showBilingual}
        />
      ))}
      {hiddenCount > 0 && (
        <span
          className={cn(
            "inline-flex items-center rounded-full bg-muted text-muted-foreground",
            size === "sm" && "px-2 py-0.5 text-xs",
            size === "md" && "px-2.5 py-1 text-sm",
            size === "lg" && "px-3 py-1.5 text-base"
          )}
        >
          +{hiddenCount} more
        </span>
      )}
    </div>
  );
}
