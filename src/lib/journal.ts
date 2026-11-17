import { getCollection, type CollectionEntry } from 'astro:content';

export type JournalEntry = CollectionEntry<'journal'>;

export async function getJournalEntries(): Promise<JournalEntry[]> {
  const entries = await getCollection('journal');

  return entries.sort((a, b) => {
    const dateDifference = b.data.publishedAt.getTime() - a.data.publishedAt.getTime();
    return dateDifference || b.id.localeCompare(a.id);
  });
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function entryPath(entry: JournalEntry): string {
  return `/entries/${entry.id}/`;
}

export function entryDescription(entry: JournalEntry): string {
  return entry.data.summary ?? entry.data.title ?? `A journal entry published ${formatDate(entry.data.publishedAt)}.`;
}
