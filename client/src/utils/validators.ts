export function validateIdea(idea: string): string | null {
  const trimmed = idea.trim();
  if (trimmed.replace(/\s/g, '').length < 10) {
    return 'Please describe your idea in at least 10 characters.';
  }
  if (idea.length > 2000) {
    return 'Idea description must be 2000 characters or fewer.';
  }
  return null;
}

export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}
