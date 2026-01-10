import { Metadata } from 'next';
import BioPage from '@/components/links/bio-page';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
    title: `Links | ${APP_NAME}`,
    description: 'Connect with us on social media, contact support, or shop our latest collection.',
};

export default function LinksPage() {
    return <BioPage />;
}
