/**
 * Friendly labels and hints for the content editor (Dashboard → Pages).
 *
 * Keys are dotted paths without list indices. A field is described by the
 * most specific key that matches the end of its path, so `hero.ctaLabel`
 * applies to every page hero while `course.ctaLabel` targets one field.
 * Paths start with the content section (`home`, `about`…) or `course`.
 */
export interface FieldCopy {
  label?: string
  hint?: string
  /** Recommended maximum length (shows a live counter). */
  limit?: number
  /** Force a multi-line text box. */
  long?: boolean
  /** Text of the "add" button for lists. */
  add?: string
}

const FIELD_COPY: Record<string, FieldCopy> = {
  /* ── Shared ──────────────────────────────────────────────────────── */
  meta: { label: 'Google search listing', hint: 'How this page appears in Google results and when the link is shared.' },
  'meta.title': {
    label: 'Google title (≈60 characters)',
    hint: 'The clickable blue line in Google results. Put the most important words first.',
    limit: 60,
  },
  'meta.description': {
    label: 'Google description (≈155 characters)',
    hint: 'The short text under the title in Google results. Longer text gets cut off.',
    limit: 155,
    long: true,
  },
  eyebrow: { label: 'Small label above the title', hint: 'A few words shown in small capital letters.' },
  title: { label: 'Title' },
  subtitle: { label: 'Subtitle', long: true },
  body: { label: 'Text', long: true },
  description: { label: 'Description', long: true },
  intro: { label: 'Introduction', long: true },
  note: { label: 'Note', long: true },
  hero: { label: 'Top of the page', hint: 'The first thing visitors see.' },
  ctaLabel: { label: 'Button text' },
  secondaryCtaLabel: { label: 'Second button text' },
  buttonLabel: { label: 'Button text' },
  linkLabel: { label: 'Link text' },
  bottomCta: { label: 'Closing call to action', hint: 'The coloured band at the bottom of the page.' },
  items: { label: 'Items', add: 'Add an item' },
  steps: { label: 'Steps', add: 'Add a step' },
  sections: { label: 'Sections', add: 'Add a section' },
  label: { label: 'Text' },
  href: {
    label: 'Link',
    hint: 'A page of your site such as /about, or a full address starting with https://',
  },
  question: { label: 'Question' },
  answer: { label: 'Answer', long: true },
  whoFor: { label: 'Who this is for' },
  'whoFor.items': { label: 'Lines', add: 'Add a line' },
  learn: { label: 'What you’ll work on' },
  'learn.items': { label: 'Lines', add: 'Add a line' },

  /* ── Brand & global ──────────────────────────────────────────────── */
  brand: { label: 'Brand', hint: 'Shown in the logo, the footer and in Google.' },
  'brand.name': { label: 'Brand name (logo)', hint: 'Written as one word like “RoxanneAlexia”, the second part is shown in italics.' },
  'brand.descriptor': { label: 'Small text under the logo' },
  'brand.tagline': { label: 'Tagline' },
  'brand.personName': { label: 'Your full name', hint: 'Used on the site and for the greeting in this dashboard.' },
  global: { label: 'Buttons & popups', hint: 'Texts used on every page.' },
  'global.consultationCta': { label: 'Consultation button text', hint: 'Used on the main buttons across the site.' },
  'global.consultationModal': { label: 'Consultation popup', hint: 'Opens when a visitor clicks a consultation button.' },
  'consultationModal.body': { label: 'Text', long: true },
  'consultationModal.calendlyLabel': { label: 'Calendar option — title' },
  'consultationModal.calendlyHint': { label: 'Calendar option — small text' },
  'consultationModal.whatsappLabel': { label: 'WhatsApp option — title' },
  'consultationModal.whatsappHint': { label: 'WhatsApp option — small text' },
  'consultationModal.messageLabel': { label: 'Message option — title' },
  'consultationModal.messageHint': { label: 'Message option — small text' },
  'global.packagesModal': { label: 'Package options popup', hint: 'Opens from “Package options” on the course cards.' },
  'packagesModal.body': { label: 'Text', long: true },
  'packagesModal.note': { label: 'Note at the bottom', long: true },
  'packagesModal.primaryLabel': { label: 'Main button text' },
  'packagesModal.secondaryLabel': { label: 'Second button text' },
  'global.whatsappMessage': {
    label: 'Pre-filled WhatsApp message',
    hint: 'The message that appears in WhatsApp when a visitor starts a chat from your site.',
    long: true,
  },
  'global.whatsappTooltip': { label: 'WhatsApp button label' },
  nav: { label: 'Main menu' },
  'nav.items': { label: 'Menu links', add: 'Add a menu link' },
  footer: { label: 'Footer' },
  'footer.blurb': { label: 'Short description', long: true },
  'footer.links': { label: 'Footer links', add: 'Add a link' },
  'footer.legal': { label: 'Copyright line', hint: 'Shown after “© year, brand name”.' },

  /* ── Home ────────────────────────────────────────────────────────── */
  'home.intro': { label: 'Introduction' },
  'home.intro.body': { label: 'Text', long: true },
  'home.intro.quote': { label: 'Quote', hint: 'Shown in the dark box next to your portrait.' },
  'home.marquee': { label: 'Scrolling words', hint: 'The words that slide across the dark band.', add: 'Add a word' },
  'home.benefits': { label: 'Benefits' },
  'benefits.items': { label: 'Benefits', add: 'Add a benefit' },
  'home.services': { label: 'Courses overview' },
  'services.cardCtaLabel': { label: '“Package options” link text' },
  'home.freelance': { label: 'Freelance banner' },
  'home.testimonials': {
    label: 'Testimonials heading',
    hint: 'The testimonials themselves are managed in Dashboard → Testimonials.',
  },
  'home.finalCta': { label: 'Closing call to action', hint: 'The coloured band at the bottom of the page.' },

  /* ── About ───────────────────────────────────────────────────────── */
  'about.bio': { label: 'Your story' },
  'bio.paragraphs': { label: 'Paragraphs', add: 'Add a paragraph', long: true },
  'about.credentials': { label: 'Qualifications & experience' },
  'credentials.items': {
    label: 'Qualifications',
    hint: 'One line each — for example a certificate, a degree or years of experience.',
    add: 'Add a qualification',
  },
  'about.offer': { label: 'What you offer' },
  'offer.items': { label: 'Items', add: 'Add an item' },

  /* ── Courses page ────────────────────────────────────────────────── */
  'courses.intro.body': { label: 'Introduction', long: true },
  'courses.intro.programsTitle': { label: 'Heading above the programs' },
  'courses.packagesLabel': { label: '“Package options” link text' },
  'courses.howItWorks': { label: 'How it works' },
  'courses.bottomCta': { label: 'Closing call to action' },

  /* ── One course ──────────────────────────────────────────────────── */
  'course.name': { label: 'Course name' },
  'course.tagline': { label: 'One-line promise', hint: 'Shown in the menu and on the Courses page.', long: true },
  'course.formats': { label: 'Formats line', hint: 'For example “Private 1-on-1 Package, … available.”', long: true },
  'course.cardDescription': { label: 'Short description', hint: 'Shown on the course card on the home page.', long: true },
  'course.description': { label: 'Long description', hint: 'Shown on the Courses page.', long: true },
  'course.focusTitle': { label: 'Heading above the focus areas' },
  'course.focusAreas': { label: 'Focus areas', add: 'Add a focus area' },
  'course.ctaLabel': { label: 'Link text to the course page' },
  'course.packages': { label: 'Package options', hint: 'Shown in the “Package options” popup.', add: 'Add a package' },
  'packages.name': { label: 'Package name' },
  'course.page': { label: 'Course page', hint: 'The page dedicated to this course.' },
  'page.intro': { label: 'Introduction', long: true },
  'page.sections': { label: 'Extra sections', add: 'Add a section' },
  'page.specialism': { label: 'Specialist track', hint: 'A highlighted programme shown on this course page.' },
  'specialism.approach': { label: 'Approach' },

  /* ── Freelance ───────────────────────────────────────────────────── */
  'freelance.services': { label: 'Services' },
  'services.items': { label: 'Services', add: 'Add a service' },
  'freelance.idealFor': { label: 'Ideal for' },
  'idealFor.items': { label: 'Lines', add: 'Add a line' },
  'freelance.process': { label: 'How it works' },

  /* ── Contact ─────────────────────────────────────────────────────── */
  'contact.hero.body': { label: 'Introduction', long: true },
  'contact.details': { label: 'Contact details block' },
  'details.emailLabel': { label: 'Label for your email' },
  'details.whatsappLabel': { label: 'Label for WhatsApp' },
  'contact.scheduler': { label: 'Booking block', hint: 'The block that opens your Calendly calendar.' },
  'scheduler.privacyNote': { label: 'Privacy note', long: true },
  'contact.form': { label: 'Contact form' },
  'form.nameLabel': { label: 'Name field label' },
  'form.emailLabel': { label: 'Email field label' },
  'form.topicLabel': { label: 'Topic field label' },
  'form.topics': { label: 'Topic choices', hint: 'The options of the “I’m interested in” list.', add: 'Add a topic' },
  'form.messageLabel': { label: 'Message field label', long: true },
  'form.consentLabel': { label: 'Consent checkbox text', long: true },
  'form.submitLabel': { label: 'Send button text' },
  'form.successTitle': { label: 'Thank-you title' },
  'form.successBody': { label: 'Thank-you message', long: true },
  'contact.faq': { label: 'Frequently asked questions' },
  'faq.items': { label: 'Questions', add: 'Add a question' },

  /* ── Privacy ─────────────────────────────────────────────────────── */
  'privacy.title': { label: 'Page title' },
  'privacy.updated': { label: '“Last updated” date' },
}

/** "secondaryCtaLabel" → "Secondary cta label" */
export function humanize(key: string): string {
  const words = key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .toLowerCase()
    .trim()
  return words.charAt(0).toUpperCase() + words.slice(1)
}

/** Label, hint and limits for a field, from the most specific matching key. */
export function describeField(path: string[]): FieldCopy & { label: string } {
  let copy: FieldCopy = {}
  for (let start = 0; start < path.length; start++) {
    const match = FIELD_COPY[path.slice(start).join('.')]
    if (match) copy = { ...match, ...copy }
  }
  return { ...copy, label: copy.label ?? humanize(path[path.length - 1] ?? '') }
}
