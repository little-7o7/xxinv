import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Invitation from '../invitation';
import { invitationRedirect, parseInvitation } from '../../lib/invitations';

type Props = { params: Promise<{ invitation: string[] }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const parsed = parseInvitation((await params).invitation);
  if (!parsed) return { title: 'Приглашение не найдено' };
  const { language, celebrant, guest } = parsed;
  return {
    title: language === 'ru' ? `${guest ? `${guest}, ` : ''}приглашение от ${celebrant.name} · 60 лет` : `${guest ? `${guest}, ` : ''}${celebrant.name}dan taklifnoma · 60 yosh`,
    description: language === 'ru' ? '4 ноября · Ресторан «Самарканд», Самарканд.' : '4 noyabr · «Samarkand» restorani, Samarqand.',
    robots: { index: false, follow: false },
  };
}
export default async function GuestPage({ params }: Props) {
  const { invitation } = await params;
  const destination = invitationRedirect(invitation);
  if (destination) redirect(destination);
  const parsed = parseInvitation(invitation);
  if (!parsed) notFound();
  return <Invitation key={`${parsed.language}/${parsed.celebrant.id}/${parsed.guest}`} {...parsed} />;
}
