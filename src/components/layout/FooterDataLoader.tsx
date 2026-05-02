import { getBusinessInfo } from '@/lib/site-content';
import { Footer } from './Footer';

export const dynamic = 'force-dynamic';

export async function FooterDataLoader() {
  const business = await getBusinessInfo();
  return <Footer business={business} />;
}
