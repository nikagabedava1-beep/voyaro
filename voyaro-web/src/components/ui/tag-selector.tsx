"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { tags as tagsApi } from "@/lib/api";
import { Loader2, Check, X, ChevronDown, ChevronUp } from "lucide-react";

interface TripTag {
  id: string;
  slug: string;
  emoji: string;
  labelEn: string;
  labelKa?: string | null;
}

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  maxSelections?: number;
  disabled?: boolean;
  className?: string;
  showCounter?: boolean;
  columns?: 2 | 3 | 4;
}

// Popular tags shown by default (slugs)
const POPULAR_TAG_SLUGS = [
  "beach",
  "hiking",
  "nightlife",
  "culture",
  "skiing",
  "food",
  "adventure",
  "wellness",
];

export function TagSelector({
  selectedTags,
  onChange,
  maxSelections = 5,
  disabled = false,
  className,
  showCounter = true,
}: TagSelectorProps) {
  const [tags, setTags] = React.useState<TripTag[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [showAllTags, setShowAllTags] = React.useState(false);

  React.useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setIsLoading(true);
      const data = await tagsApi.getAll();
      setTags(data as TripTag[]);
      setError(null);
    } catch (err) {
      console.error("Error fetching tags:", err);
      setError("Failed to load interests");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTag = (slug: string) => {
    if (disabled) return;

    if (selectedTags.includes(slug)) {
      onChange(selectedTags.filter((t) => t !== slug));
    } else if (selectedTags.length < maxSelections) {
      onChange([...selectedTags, slug]);
    }
  };

  const isSelected = (slug: string) => selectedTags.includes(slug);
  const isMaxReached = selectedTags.length >= maxSelections;

  // Split tags into popular and other
  const popularTags = tags.filter(tag => POPULAR_TAG_SLUGS.includes(tag.slug));
  const otherTags = tags.filter(tag => !POPULAR_TAG_SLUGS.includes(tag.slug));

  // Get selected tags data
  const selectedTagsData = tags.filter(tag => selectedTags.includes(tag.slug));

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center py-8", className)}>
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("text-center py-4 text-destructive text-sm", className)}>
        {error}
        <button
          onClick={fetchTags}
          className="ml-2 text-primary hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Selected Tags as Badges */}
      {selectedTagsData.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {selectedTagsData.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-full text-sm font-medium"
              >
                <span>{tag.emoji}</span>
                <span>{tag.labelEn}</span>
                <button
                  type="button"
                  onClick={() => toggleTag(tag.slug)}
                  className="ml-0.5 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                  aria-label={`Remove ${tag.labelEn}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Counter */}
      {showCounter && (
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Popular interests
          </p>
          <span className={cn(
            "text-xs font-medium px-2 py-0.5 rounded-full",
            selectedTags.length > 0
              ? "bg-primary/10 text-primary"
              : "bg-gray-100 text-gray-500"
          )}>
            {selectedTags.length}/{maxSelections}
          </span>
        </div>
      )}

      {/* Popular Tags as Compact Chips */}
      <div className="flex flex-wrap gap-2 mb-3">
        {popularTags.map((tag) => {
          const selected = isSelected(tag.slug);
          const isDisabled = disabled || (!selected && isMaxReached);

          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleTag(tag.slug)}
              disabled={isDisabled}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium",
                "border-2 transition-all duration-150",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
                selected
                  ? "bg-primary text-white border-primary"
                  : "bg-white border-gray-200 text-gray-700 hover:border-primary/50 hover:bg-primary/5",
                isDisabled && !selected && "opacity-40 cursor-not-allowed"
              )}
            >
              <span className="text-base">{tag.emoji}</span>
              <span>{tag.labelEn}</span>
              {selected && <Check className="w-3.5 h-3.5 ml-0.5" />}
            </button>
          );
        })}
      </div>

      {/* Expand/Collapse Button */}
      <button
        type="button"
        onClick={() => setShowAllTags(!showAllTags)}
        className={cn(
          "inline-flex items-center gap-1.5 text-sm font-medium transition-colors",
          "text-primary hover:text-primary/80"
        )}
      >
        {showAllTags ? (
          <>
            <ChevronUp className="w-4 h-4" />
            Show less
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4" />
            Show all interests ({otherTags.length} more)
          </>
        )}
      </button>

      {/* All Other Tags (Expandable) */}
      {showAllTags && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-muted-foreground mb-3">More interests</p>
          <div className="flex flex-wrap gap-2">
            {otherTags.map((tag) => {
              const selected = isSelected(tag.slug);
              const isDisabled = disabled || (!selected && isMaxReached);

              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.slug)}
                  disabled={isDisabled}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium",
                    "border-2 transition-all duration-150",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
                    selected
                      ? "bg-primary text-white border-primary"
                      : "bg-white border-gray-200 text-gray-700 hover:border-primary/50 hover:bg-primary/5",
                    isDisabled && !selected && "opacity-40 cursor-not-allowed"
                  )}
                >
                  <span className="text-base">{tag.emoji}</span>
                  <span>{tag.labelEn}</span>
                  {selected && <Check className="w-3.5 h-3.5 ml-0.5" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Max reached message */}
      {isMaxReached && !disabled && (
        <p className="mt-3 text-xs text-amber-600 flex items-center gap-1.5">
          <span className="w-1 h-1 bg-amber-500 rounded-full" />
          Maximum {maxSelections} interests selected
        </p>
      )}
    </div>
  );
}
