import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Invitation from '../invitation';
import { invitationPath, parseInvitation } from '../../lib/invitations';

type Props = { params: Promise<{ invitation: string[] }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const parsed = parseInvitation((await params).invitation);
  if (!parsed) return { title: 'Приглашение не найдено' };
  const { language, celebrant, guest } = parsed;
  return {
    title: language === 'ru' ? `${guest}, приглашение от ${celebrant.name} · 60 лет` : `${guest}, ${celebrant.name}dan taklifnoma · 60 yosh`,
    description: language === 'ru' ? '4 ноября · Ресторан «Самарканд», Самарканд.' : '4 noyabr · «Samarkand» restorani, Samarqand.',
    robots: { index: false, follow: false },
  };
}
export default async function GuestPage({ params }: Props) {
  const { invitation } = await params;
  // Preserve the early two-part links by redirecting to Xasan's invitation.
  if (invitation.length === 2 && (invitation[0] === 'ru' || invitation[0] === 'uz')) {
    redirect(invitationPath(invitation[0], 'xasan', invitation[1]));
  }
  const parsed = parseInvitation(invitation);
  if (!parsed) notFound();
  return <Invitation key={`${parsed.language}/${parsed.celebrant.id}/${parsed.guest}`} {...parsed} />;
}
