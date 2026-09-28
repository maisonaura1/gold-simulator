import { Footer } from '@/components/site/Footer'
import { Header } from '@/components/site/Header'
import { JsonLd } from '@/components/site/JsonLd'
import { SiteProvider, type SiteClientData } from '@/components/site/site-context'
import { getContent, getSettings } from '@/lib/data'
import { organizationJsonLd } from '@/lib/seo'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [content, settings] = await Promise.all([getContent(), getSettings()])

  const data: SiteClientData = {
    brandName: content.brand.name,
    personName: content.brand.personName,
    global: content.global,
    email: settings.email,
    whatsappNumber: settings.whatsappNumber,
    calendlyUrl: settings.calendlyUrl,
    courses: content.courseList.map(({ slug, name, formats, packages }) => ({ slug, name, formats, packages })),
  }

  return (
    <SiteProvider data={data}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-ivory"
      >
        Skip to content
      </a>
      <Header
        brand={{ name: content.brand.name, descriptor: content.brand.descriptor }}
        nav={content.nav.items}
        courses={content.courseList.map(({ slug, name, tagline }) => ({ slug, name, tagline }))}
      />
      <main id="main">{children}</main>
      <Footer content={content} settings={settings} />
      <JsonLd data={organizationJsonLd(content, settings)} />
      <noscript>
        <style>{'[data-reveal]{opacity:1!important;transform:none!important}'}</style>
      </noscript>
    </SiteProvider>
  )
}
