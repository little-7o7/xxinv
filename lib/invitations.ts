export type Language = 'ru' | 'uz';
export type CelebrantId = 'xasan' | 'xusan';
export type Theme = 'sapphire' | 'rose' | 'jade';
export type Celebrant = {
  id: CelebrantId;
  name: string;
  photo: string | null;
  theme: Theme;
};

// Set photo to a public path, e.g. '/photos/xasan.jpg', when photos are ready.
export const celebrants: Record<CelebrantId, Celebrant> = {
  xasan: { id: 'xasan', name: 'Xasan', photo: null, theme: 'sapphire' },
  xusan: { id: 'xusan', name: 'Xusan', photo: null, theme: 'sapphire' },
};

export function guestDisplayName(slug: string): string {
  return slug.replace(/[_-]+/g, ' ').trim().slice(0, 100).split(/\s+/)
    .map(word => word.charAt(0).toLocaleUpperCase() + word.slice(1)).join(' ');
}

export function invitationPath(language: Language, celebrant: CelebrantId, guest: string = ''): string {
  const slug = guest.trim().replace(/[\s_-]+/g, '_').toLocaleLowerCase();
  return `/${language}/${celebrant}${slug ? `/${encodeURIComponent(slug)}` : ''}`;
}

export function parseInvitation(segments: string[]): { language: Language; celebrant: Celebrant; guest: string } | null {
  if (segments.length !== 2 && segments.length !== 3) return null;
  const [language, id, slug] = segments;
  if (language !== 'ru' && language !== 'uz') return null;
  if (id !== 'xasan' && id !== 'xusan') return null;
  const guest = slug === undefined ? '' : guestDisplayName(slug);
  if (slug !== undefined && !guest) return null;
  return { language, celebrant: celebrants[id], guest };
}

export function invitationRedirect(segments: string[]): string | null {
  const [first, second] = segments;
  if ((first === 'xasan' || first === 'xusan') && (segments.length === 1 || segments.length === 2)) {
    return invitationPath('ru', first, second);
  }
  if (segments.length === 2 && (first === 'ru' || first === 'uz') && second !== 'xasan' && second !== 'xusan') {
    return invitationPath(first, 'xasan', second);
  }
  return null;
}
