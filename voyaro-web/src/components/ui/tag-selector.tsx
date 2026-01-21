"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { tags as tagsApi } from "@/lib/api";
import { Loader2 } from "lucide-react";

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
}

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
      setError("Failed to load tags");
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

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center py-8", className)}>
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("text-center py-4 text-destructive", className)}>
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
      {showCounter && (
        <div className="mb-3 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{selectedTags.length}</span>
          <span className="text-muted-foreground">/{maxSelections}</span>
          <span className="ml-1">
            {selectedTags.length === 1 ? "tag" : "tags"} selected
          </span>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const selected = isSelected(tag.slug);
          const isDisabled = disabled || (!selected && isMaxReached);

          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleTag(tag.slug)}
              disabled={isDisabled}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-2 rounded-full",
                "text-sm font-medium transition-all duration-200",
                "border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
                selected
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-background border-border text-foreground hover:border-muted-foreground hover:bg-accent",
                isDisabled && !selected && "opacity-50 cursor-not-allowed",
                disabled && "cursor-not-allowed"
              )}
            >
              <span className="text-base">{tag.emoji}</span>
              <span>{tag.labelEn}</span>
              {tag.labelKa && (
                <>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-muted-foreground">{tag.labelKa}</span>
                </>
              )}
            </button>
          );
        })}
      </div>
      {isMaxReached && !disabled && (
        <p className="mt-2 text-sm text-amber-600">
          Maximum {maxSelections} tags selected. Remove a tag to select a different one.
        </p>
      )}
    </div>
  );
}
