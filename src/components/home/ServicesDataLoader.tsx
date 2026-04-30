import { getServicesItems } from '@/lib/site-content';
import { Services } from './Services';

export const dynamic = 'force-dynamic';

export async function ServicesDataLoader() {
  return <Services />;
}
