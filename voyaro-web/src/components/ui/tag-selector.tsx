"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { tags as tagsApi } from "@/lib/api";
import { TravelIcon, travelIcons } from "./travel-icons";
import { Loader2, Check } from "lucide-react";

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

export function TagSelector({
  selectedTags,
  onChange,
  maxSelections = 5,
  disabled = false,
  className,
  showCounter = true,
  columns = 3,
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

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center py-12", className)}>
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("text-center py-6 text-destructive", className)}>
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

  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  };

  return (
    <div className={className}>
      {showCounter && (
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Select your travel interests
          </p>
          <div className="flex items-center gap-1.5 text-sm">
            <span className={cn(
              "font-semibold",
              selectedTags.length > 0 ? "text-primary" : "text-muted-foreground"
            )}>
              {selectedTags.length}
            </span>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground">{maxSelections}</span>
          </div>
        </div>
      )}

      <div className={cn("grid gap-2", gridCols[columns])}>
        {tags.map((tag) => {
          const selected = isSelected(tag.slug);
          const isDisabled = disabled || (!selected && isMaxReached);
          const hasIcon = tag.slug in travelIcons;

          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleTag(tag.slug)}
              disabled={isDisabled}
              aria-label={`${tag.labelEn}${selected ? ' (selected)' : ''}`}
              aria-pressed={selected}
              className={cn(
                "relative flex items-center gap-3 px-4 py-3 rounded-xl",
                "text-left transition-all duration-200 ease-out",
                "border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                selected
                  ? "bg-primary/5 border-primary text-primary shadow-sm"
                  : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50",
                isDisabled && !selected && "opacity-40 cursor-not-allowed",
                disabled && "cursor-not-allowed"
              )}
            >
              {/* Icon */}
              <div className={cn(
                "flex items-center justify-center w-10 h-10 rounded-lg transition-colors",
                selected ? "bg-primary/10" : "bg-gray-100"
              )}>
                {hasIcon ? (
                  <TravelIcon
                    slug={tag.slug}
                    size={22}
                    className={cn(
                      "transition-colors",
                      selected ? "text-primary" : "text-gray-500"
                    )}
                  />
                ) : (
                  <span className="text-lg">{tag.emoji}</span>
                )}
              </div>

              {/* Label */}
              <div className="flex-1 min-w-0">
                <span className={cn(
                  "block font-medium text-sm truncate",
                  selected ? "text-primary" : "text-gray-900"
                )}>
                  {tag.labelEn}
                </span>
                {tag.labelKa && (
                  <span className={cn(
                    "block text-xs truncate",
                    selected ? "text-primary/70" : "text-gray-500"
                  )}>
                    {tag.labelKa}
                  </span>
                )}
              </div>

              {/* Selected indicator */}
              {selected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {isMaxReached && !disabled && (
        <p className="mt-3 text-sm text-amber-600 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
          Maximum {maxSelections} interests selected
        </p>
      )}
    </div>
  );
}
