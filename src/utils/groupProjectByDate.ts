import { Project } from "@customTypes/project";
import { isToday, isYesterday, format } from "date-fns";

export function groupProjectsByDate(projects: Project[]) {
  const groups: Record<string, Project[]> = {};
  const groupOrder: string[] = [];

  for (const project of projects) {
    const date = new Date(project.updated_at);
    const label = isToday(date)
      ? "Today"
      : isYesterday(date)
      ? "Yesterday"
      : format(date, "MMMM d, yyyy");

    if (!groups[label]) {
      groups[label] = [];
      groupOrder.push(label);
    }

    groups[label].push(project);
  }

  return { groups, groupOrder };
}
