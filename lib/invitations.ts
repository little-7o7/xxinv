export type Language = 'ru' | 'tj';
export type CelebrantId = 'shavkat' | 'shuhrat';
export type Theme = 'sapphire' | 'rose' | 'jade';
export type Celebrant = {
  id: CelebrantId;
  name: string;
  nameRu: string;
  photo: string | null;
  theme: Theme;
};

// Set photo to a public path, e.g. '/photos/shavkat.jpg', when photos are ready.
export const celebrants: Record<CelebrantId, Celebrant> = {
  shavkat: { id: 'shavkat', name: 'Shavkat', nameRu: 'Шавкат', photo: null, theme: 'sapphire' },
  shuhrat: { id: 'shuhrat', name: 'Shuhrat', nameRu: 'Шухрат', photo: null, theme: 'sapphire' },
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
  if (language !== 'ru' && language !== 'tj') return null;
  if (id !== 'shavkat' && id !== 'shuhrat') return null;
  const guest = slug === undefined ? '' : guestDisplayName(slug);
  if (slug !== undefined && !guest) return null;
  return { language, celebrant: { ...celebrants[id], name: language === 'ru' ? celebrants[id].nameRu : (id === 'shuhrat' ? 'Шуҳрат' : 'Шавкат') }, guest };
}

export function invitationRedirect(segments: string[]): string | null {
  const [first, second, guest] = segments;
  if (first === 'uz' && (segments.length === 2 || segments.length === 3)) {
    const translated = ['tj', ...segments.slice(1)];
    return invitationRedirect(translated) ?? (parseInvitation(translated) ? invitationPath('tj', second as CelebrantId, guest) : null);
  }
  const alias = (id: string): CelebrantId | null => id === 'xasan' ? 'shavkat' : id === 'xusan' ? 'shuhrat' : null;
  const shortAlias = alias(first);
  if (shortAlias && (segments.length === 1 || segments.length === 2)) return invitationPath('ru', shortAlias, second);
  if ((first === 'ru' || first === 'tj') && (segments.length === 2 || segments.length === 3)) {
    const oldId = alias(second);
    if (oldId) return invitationPath(first, oldId, guest);
  }
  if ((first === 'shavkat' || first === 'shuhrat') && (segments.length === 1 || segments.length === 2)) {
    return invitationPath('ru', first, second);
  }
  if (segments.length === 2 && (first === 'ru' || first === 'tj') && second !== 'shavkat' && second !== 'shuhrat') {
    return invitationPath(first, 'shavkat', second);
  }
  return null;
}
