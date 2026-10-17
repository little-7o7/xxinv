import Invitation from './invitation';
import { celebrants } from '../lib/invitations';
export default function Home() {
  return <Invitation language="ru" celebrant={celebrants.xasan} guest="Amir Aka" />;
}
