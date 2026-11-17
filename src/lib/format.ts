export function money(value: number): string {
  return `Tzs ${value.toLocaleString("en-TZ")}/=`;
}

export function dateLabel(value: string): string {
  return new Date(value).toLocaleString("en-TZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Dar_es_Salaam",
  });
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function isExpired(value: string): boolean {
  return new Date(value).getTime() <= Date.now();
}

export function defaultValidityInput(): string {
  const date = new Date(Date.now() + 6 * 60 * 60 * 1000);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(
    date.getMinutes(),
  )}`;
}

