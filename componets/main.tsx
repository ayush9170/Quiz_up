
import { auth } from './auth';
import LandingClient from './index';

export default async function Landing() {
  const session = await auth(); 

  return (
    <div>
      <LandingClient session={session} />
    </div>
  );
}
