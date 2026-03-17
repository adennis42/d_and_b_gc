import { getServicesItems } from '@/lib/site-content';
import { Services } from './Services';

export const dynamic = 'force-dynamic';

export async function ServicesDataLoader() {
  const services = await getServicesItems();
  return <Services services={services} />;
}
