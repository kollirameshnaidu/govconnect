import { ANNOUNCEMENTS } from "@/mock/homepage";
import type { Announcement } from "@/types";

export function getAnnouncementById(id: string): Announcement | undefined {
  return ANNOUNCEMENTS.find((item) => item.id === id);
}

export function getAnnouncementCategories(): string[] {
  return ["All", ...Array.from(new Set(ANNOUNCEMENTS.map((item) => item.category)))];
}

export function filterAnnouncements(category: string): Announcement[] {
  if (!category || category === "All") return ANNOUNCEMENTS;
  return ANNOUNCEMENTS.filter((item) => item.category === category);
}
