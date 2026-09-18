"use client";

import { useMemo, useState } from "react";
import { Alert } from "@/components/common/Alert";
import { Announcements } from "@/components/home/Announcements";
import { filterAnnouncements, getAnnouncementCategories } from "@/services/announcementService";
import { cn } from "@/lib/cn";

export function AnnouncementBoard() {
  const categories = getAnnouncementCategories();
  const [category, setCategory] = useState("All");
  const items = useMemo(() => filterAnnouncements(category), [category]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Announcement category">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm font-medium",
              category === item
                ? "border-navy-800 bg-navy-800 text-white"
                : "border-line bg-white text-navy-800 hover:bg-navy-50",
            )}
            aria-pressed={category === item}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>
      {items.length === 0 ? (
        <Alert tone="warning">No announcements in this category.</Alert>
      ) : (
        <Announcements heading={false} contained={false} showAllLink={false} items={items} />
      )}
    </div>
  );
}
