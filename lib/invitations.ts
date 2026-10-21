export type Salutation = 'goy' | 'gaya' | 'giye';
export function guestGreeting(language: Language, guest: string, salutation: Salutation = 'goy'): string {
  if (language === 'tj') return `Муҳтарам ${guest || (salutation === 'giye' ? 'меҳмонон' : 'меҳмон')}!`;
  const dear = { goy: 'Дорогой', gaya: 'Дорогая', giye: 'Дорогие' }[salutation];
  const fallback = { goy: 'гость', gaya: 'гостья', giye: 'гости' }[salutation];
  return `${dear} ${guest || fallback}!`;
}
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
  shavkat: { id: 'shavkat', name: 'Shavkat', nameRu: 'Шавкат', photo: '/photos/shavkat.jpg', theme: 'sapphire' },
  shuhrat: { id: 'shuhrat', name: 'Shuhrat', nameRu: 'Шухрат', photo: '/photos/shuhrat.jpg', theme: 'sapphire' },
};

export function guestDisplayName(slug: string): string {
  return slug.replace(/[_-]+/g, ' ').trim().slice(0, 100).split(/\s+/)
    .map(word => word.charAt(0).toLocaleUpperCase() + word.slice(1)).join(' ');
}

export function invitationPath(language: Language, celebrant: CelebrantId, guest: string = '', salutation?: Salutation): string {
  const slug = guest.trim().replace(/[\s_-]+/g, '_').toLocaleLowerCase();
  return `/${language}/${celebrant}${salutation ? `/${salutation}` : ''}${slug ? `/${encodeURIComponent(slug)}` : ''}`;
}

export function parseInvitation(segments: string[]): { language: Language; celebrant: Celebrant; guest: string; salutation?: Salutation } | null {
  if (segments.length !== 2 && segments.length !== 3 && segments.length !== 4) return null;
  const [language, id, third, fourth] = segments;
  const salutation = third === 'goy' || third === 'gaya' || third === 'giye' ? third : undefined;
  if (segments.length === 4 && !salutation) return null;
  const slug = salutation ? fourth : third;
  if (language !== 'ru' && language !== 'tj') return null;
  if (id !== 'shavkat' && id !== 'shuhrat') return null;
  const guest = slug === undefined ? '' : guestDisplayName(slug);
  if (slug !== undefined && !guest) return null;
  return { language, celebrant: { ...celebrants[id], name: language === 'ru' ? celebrants[id].nameRu : (id === 'shuhrat' ? 'Шуҳрат' : 'Шавкат') }, guest, salutation };
}

export function invitationRedirect(segments: string[]): string | null {
  const [first, second, guest] = segments;
  if (first === 'shavkat' || first === 'shuhrat' || first === 'xasan' || first === 'xusan' || first === 'uz') {
    const normalized = first === 'uz' ? ['tj', ...segments.slice(1)] : ['ru', ...segments];
    normalized[1] = normalized[1] === 'xasan' ? 'shavkat' : normalized[1] === 'xusan' ? 'shuhrat' : normalized[1];
    const parsed = parseInvitation(normalized);
    if (parsed) return invitationPath(parsed.language, parsed.celebrant.id, parsed.guest, parsed.salutation);
  }
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
