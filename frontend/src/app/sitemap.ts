import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://goldtradermt.app';
  return [
    { url: base,               lastModified: new Date(), changeFrequency: 'weekly',  priority: 1 },
    { url: `${base}/auth/login`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/auth/register`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/guide`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/privacy`,       lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${base}/terms`,         lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  ];
}
