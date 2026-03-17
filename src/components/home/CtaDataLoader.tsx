import { getCtaContent } from '@/lib/site-content';
import { CTA } from './CTA';

export const dynamic = 'force-dynamic';

export async function CtaDataLoader() {
  const content = await getCtaContent();
  return <CTA {...content} />;
}
