import type { Course, SiteContent, SiteSettings } from './types'

/**
 * Default copy — source: client spreadsheet "Website" (tabs 1–8).
 *
 * Editorial conventions applied to the sheet copy:
 *  - typos fixed ("coarses", "professionalswho", double spaces, comma splice);
 *  - US spelling everywhere, matching Roxanne's own revisions (program, customize…);
 *  - reviewer placeholders ("[Roxanne to add …]") are never published.
 *
 * Lines marked `// DRAFT` are NOT in the sheet (tabs 5 and 7 are empty, tab 6
 * holds Litigation English copy, the Freelance page has no tab). They are
 * written to match the sheet's voice and are listed in the dashboard checklist
 * so Roxanne can review them.
 */

const CONSULTATION = 'Book a Free Consultation'

export const defaultCourses: Course[] = [
  {
    slug: 'business-english',
    name: 'Business English',
    tagline: 'Master corporate communication, global meetings, and professional negotiations.',
    formats: 'Private 1-on-1 Package, Professional Intensive Workshop, and Group Courses available.',
    cardDescription:
      'Structured 1-to-1 lessons, unless booking as a group, for professionals who need to communicate effectively in corporate and commercial contexts. All lessons will be customized to the professional needs discussed in consultation.',
    description:
      'Accelerate your global career with language training designed for high-stakes corporate environments. We provide elite coaching, teaching, training, and instruction tailored specifically for international corporate teams, managers, and executives. Whether you choose personalized 1-on-1 instruction or collaborative custom group instruction, you will build the skills needed to present, negotiate, and communicate with absolute confidence.',
    focusTitle: 'Core Focus Areas',
    focusAreas: [
      { title: 'High-Impact Presentations', description: 'Command the room and pitch ideas effectively to global stakeholders.' },
      { title: 'Strategic Negotiations', description: 'Navigate complex business deals with clarity, tact, and persuasion.' },
      { title: 'Dynamic Meetings', description: 'Lead and participate in cross-border discussions without hesitation.' },
      { title: 'Executive Writing', description: 'Draft polished emails, compelling reports, and professional correspondence.' },
    ],
    ctaLabel: 'Elevate Your Business English',
    packages: [
      { name: 'Private 1-on-1 Package', description: 'Lessons built entirely around your role, your industry, and your schedule.' }, // DRAFT description
      { name: 'Professional Intensive Workshop', description: 'A focused, high-impact format to prepare for a specific presentation, negotiation, or deadline.' }, // DRAFT description
      { name: 'Group Courses', description: 'Custom group instruction for teams and colleagues who learn together.' }, // DRAFT description
    ],
    photo: 'business',
    page: {
      meta: {
        title: 'Business English Lessons Online | Roxanne Maison — Law Business English',
        description:
          'Improve your business English with tailored 1-to-1 online lessons. Professional business English courses for managers, executives, and corporate teams. Book a free consultation.',
      },
      hero: {
        eyebrow: 'Business English',
        title: 'Learn Business English — tailored to your career',
        subtitle: 'Structured 1-to-1 business English lessons for professionals who need results',
        ctaLabel: CONSULTATION,
      },
      intro:
        "Whether you're preparing for a high-stakes presentation, leading international meetings, or writing to clients and stakeholders — your English needs to be clear, professional, and confident. My business English online course is designed for working professionals who don't have time to waste on generic language classes. Every lesson is built around your role, your industry, and the communication challenges you actually face.",
      whoFor: {
        title: 'Who this is for',
        items: [
          'Managers and executives communicating across borders',
          'Professionals preparing for English-language presentations or negotiations',
          'Corporate teams who need consistent, professional English in day-to-day operations',
          'Expats and international professionals building a career in English-speaking environments',
        ],
      },
      learn: {
        title: "What you'll work on",
        items: [
          'Professional email and report writing',
          'Meeting language — leading, contributing, and summarizing',
          'Presentation skills and confident public speaking in English',
          'Negotiation and persuasion techniques',
          'Industry-specific vocabulary for your sector',
        ],
      },
      sections: [
        {
          title: 'Corporate English training',
          body: "I also work with companies who want to invest in their team's English communication skills. Corporate English training programs are tailored to your organization's needs — from onboarding international hires to preparing leadership teams for global roles. Get in touch to discuss a program for your team.",
        },
        {
          title: 'My approach',
          body: 'No textbooks. No generic exercises. Every business English lesson is built around real scenarios from your working life — the emails you need to send, the presentations you need to deliver, the conversations you need to lead. Lessons are practical, focused, and designed to improve your business English communication skills from the very first session.',
        },
      ],
      bottomCta: {
        title: 'Ready to improve your business English?',
        body: "Book a free consultation. We'll discuss your goals and I'll recommend the right program for you.",
        buttonLabel: CONSULTATION,
      },
    },
  },
  {
    slug: 'legal-english',
    name: 'Legal English',
    tagline: 'Navigate contracts, terminology, and legal discourse with absolute precision.',
    formats: 'Private custom 1-on-1 Package, Intensive Workshops for Trial, and Group Courses available.',
    cardDescription:
      'Specialist English courses for lawyers, paralegals, and legal professionals working in international law, US law, or Legal English.',
    description:
      'Navigate global legal frameworks with precision. I deliver advanced coaching, teaching, training, and instruction crafted exclusively for ambitious lawyers, paralegals, and legal professionals. Available through intensive 1-on-1 instruction or tailored custom group instruction, this program equips you with the exact vocabulary and rhetorical tools your high-stakes career demands.',
    focusTitle: 'Core Focus Areas',
    focusAreas: [
      { title: 'Rigorous Contract Drafting', description: 'Master the syntax, terminology, and nuances of international legal documents.' },
      { title: 'Courtroom & Advocacy Communication', description: 'Present persuasive arguments and articulate complex positions with confidence.' },
      { title: 'Client & Counterparty Negotiations', description: 'Manage cross-border consultations and legal disputes with tactical clarity.' },
      { title: 'Legal Case Analysis', description: 'Review opinions, briefs, and statutes efficiently using precise legal English terminology.' },
    ],
    ctaLabel: 'Advance Your Career with Legal English',
    packages: [
      { name: 'Private custom 1-on-1 Package', description: 'A fully personalized program built around your practice area, your documents, and your goals.' }, // DRAFT description
      { name: 'Intensive Workshops for Trial', description: 'Focused preparation for hearings, trials, and arbitration — in the language of the courtroom.' }, // DRAFT description
      { name: 'Group Courses', description: 'Custom group instruction for legal teams, firms, and departments.' }, // DRAFT description
    ],
    photo: 'legal',
    page: {
      meta: {
        title: 'Legal English Course Online for Lawyers | Roxanne Maison', // DRAFT (tab 5 empty)
        description:
          'Legal English for lawyers, paralegals and legal professionals: contract drafting, advocacy, negotiations and litigation English. Book a free consultation.', // DRAFT
      },
      hero: {
        eyebrow: 'Legal English',
        title: 'Navigate global legal frameworks with precision',
        subtitle:
          'Specialist English courses for lawyers, paralegals, and legal professionals working in international law, US law, or Legal English.',
        ctaLabel: CONSULTATION,
      },
      intro:
        'I deliver advanced coaching, teaching, training, and instruction crafted exclusively for ambitious lawyers, paralegals, and legal professionals. Available through intensive 1-on-1 instruction or tailored custom group instruction, this program equips you with the exact vocabulary and rhetorical tools your high-stakes career demands.',
      whoFor: {
        title: 'Who this is for',
        items: [
          'Lawyers working in international law or US law', // DRAFT (derived from the course card)
          'Paralegals and legal assistants supporting international matters', // DRAFT
          'Legal professionals who draft, negotiate, or advise in English', // DRAFT
          'Law firms and legal departments training their teams together', // DRAFT
        ],
      },
      learn: { title: "What you'll work on", items: [] },
      sections: [],
      specialism: {
        eyebrow: 'Specialist track',
        title: 'Litigation English — speak clearly when it counts',
        subtitle: 'Advanced English for lawyers in international courts and proceedings',
        intro:
          "Litigation demands a different level of English. You need to be persuasive, precise, and understood — by judges, opposing counsel, and witnesses who may not share your first language. This program is for lawyers who work in English-language courts or arbitration and need to communicate with absolute clarity under pressure. Whether you're preparing oral submissions, cross-examining witnesses, or drafting pleadings, every session is tailored to the realities of international litigation.",
        whoFor: {
          title: 'Who this is for',
          items: [
            'Lawyers involved in cross-border litigation or international arbitration',
            'Advocates preparing oral arguments in English',
            'Legal professionals working with English-language courts and tribunals',
            'Judges and court staff working in English for the judiciary',
          ],
        },
        learn: {
          title: "What you'll work on",
          items: [
            'Oral advocacy — structuring and delivering arguments in English',
            'Plain English for lawyers — making complex legal arguments accessible',
            'Cross-examination and witness preparation in English',
            'Drafting pleadings, submissions, and skeleton arguments',
            'Courtroom register — formal and procedural English for legal proceedings',
          ],
        },
        approach: {
          title: 'My approach',
          body: 'Litigation English training is intensely practical. We work with mock hearings, real case materials, and the specific procedural language of the courts you appear before. Sessions focus on building fluency under pressure — the kind of English that holds up in a courtroom, not just a classroom.',
        },
      },
      bottomCta: {
        title: 'Preparing for international proceedings?',
        body: "Book a free consultation. Let's discuss how to prepare your English for the courtroom.",
        buttonLabel: CONSULTATION,
      },
    },
  },
  {
    slug: 'beginner-english',
    name: 'Beginner English for Adults',
    tagline: 'Build a strong, practical foundation in a supportive, adult-focused space.',
    formats: 'Private 1-on-1 Lesson Package, Intensive Workshop, and Group Courses available.',
    cardDescription:
      'Starting from scratch? A patient, structured approach to building your English that is designed specifically for adult learners. The first steps are the hardest steps — I can get you through them safely and comfortably.',
    description:
      'Build a fearless foundation in English, starting today. We provide supportive coaching, teaching, training, and instruction designed exclusively for adults stepping into the language for the first time. Whether you prefer the privacy of 1-on-1 instruction or the collaborative energy of custom group instruction, you will learn in a zero-judgment, highly encouraging environment.',
    focusTitle: 'Core Focus Areas',
    focusAreas: [
      { title: 'Real-World Conversation', description: 'Speak clearly and confidently in everyday social and professional situations.' },
      { title: 'Essential Workplace Language', description: 'Master the vocabulary needed for daily job tasks, introducing yourself, and office interactions.' },
      { title: 'Practical Grammar & Sentence Structure', description: 'Move past rote memorization to build natural, correct sentences on the spot.' },
      { title: 'Listening & Pronunciation Clarity', description: 'Train your ear to understand native speakers and be understood easily by others.' },
    ],
    ctaLabel: 'Start your English journey now',
    packages: [
      { name: 'Private 1-on-1 Lesson Package', description: 'Patient, personal lessons at your own pace, in a zero-judgment space.' }, // DRAFT description
      { name: 'Intensive Workshop', description: 'A focused boost to build confidence quickly for a specific goal.' }, // DRAFT description
      { name: 'Group Courses', description: 'Learn alongside other adults in a small, encouraging group.' }, // DRAFT description
    ],
    photo: 'beginner',
    page: {
      meta: {
        title: 'Beginner English Lessons for Adults | Roxanne Maison', // DRAFT (tab 6 holds other copy)
        description:
          'Beginner English for adults: a patient, zero-judgment approach to conversation, workplace language, grammar and pronunciation. Book a free consultation.', // DRAFT
      },
      hero: {
        eyebrow: 'Beginner English for Adults',
        title: 'Build a fearless foundation in English, starting today',
        subtitle: 'Starting from scratch? A patient, structured approach designed specifically for adult learners.',
        ctaLabel: CONSULTATION,
      },
      intro:
        'We provide supportive coaching, teaching, training, and instruction designed exclusively for adults stepping into the language for the first time. Whether you prefer the privacy of 1-on-1 instruction or the collaborative energy of custom group instruction, you will learn in a zero-judgment, highly encouraging environment. The first steps are the hardest steps — I can get you through them safely and comfortably.',
      whoFor: {
        title: 'Who this is for',
        items: [
          'Adults starting English from scratch', // DRAFT
          'Professionals who need English for their job', // DRAFT
          'Learners who want a patient, zero-judgment environment', // DRAFT
          'Anyone ready for a fresh, structured start with English', // DRAFT
        ],
      },
      learn: { title: "What you'll work on", items: [] },
      sections: [],
      bottomCta: {
        title: 'Start your English journey now',
        body: "Book a free consultation. We'll talk about your goals and find the right starting point for you.", // DRAFT
        buttonLabel: CONSULTATION,
      },
    },
  },
  {
    slug: 'speech-presentation-coaching',
    name: 'Speech & Presentation Coaching',
    tagline: 'Transform your public speaking and command any room with total confidence.',
    formats: 'Private 1-on-1 Coaching, Intensive Workshop, and Group Courses available.', // DRAFT (mirrors the other programs)
    cardDescription:
      "Whether it's a pitch, a closing argument, or a quarterly review — learn to deliver your message with impact and command any room.", // DRAFT (from Home benefit #3)
    description:
      'Command any room and speak with unstoppable authority. We deliver elite coaching, teaching, training, and instruction designed to transform how you present yourself and your ideas. Through high-focus 1-on-1 instruction or collaborative custom group instruction, you will master the psychological and physical tools needed to deliver unforgettable presentations.',
    focusTitle: 'Core Focus Areas',
    focusAreas: [
      { title: 'Dynamic Public Speaking', description: 'Overcome stage anxiety and project absolute confidence in front of any audience.' },
      { title: 'Compelling Storytelling', description: 'Structure your ideas to captivate stakeholders, win pitches, and drive action.' },
      { title: 'Vocal Delivery & Body Language', description: 'Master tone, pacing, posture, and gestures to maximize your impact.' },
      { title: 'Executive Presence', description: 'Develop a powerful, authentic speaking style that commands respect and handles Q&A with ease.' },
    ],
    ctaLabel: 'Command The Room & Own Your Stage',
    packages: [
      { name: 'Private 1-on-1 Coaching', description: 'High-focus coaching on your real talks, pitches, and presentations.' }, // DRAFT
      { name: 'Intensive Workshop', description: 'Rehearse and refine ahead of a keynote, pitch, or closing argument.' }, // DRAFT
      { name: 'Group Courses', description: 'Build presence and confidence together as a team.' }, // DRAFT
    ],
    photo: 'speech',
    page: {
      meta: {
        title: 'Speech & Presentation Coaching in English | Roxanne Maison', // DRAFT (tab 7 empty)
        description:
          'Presentation and public speaking coaching in English: storytelling, vocal delivery, body language and executive presence. Book a free consultation.', // DRAFT
      },
      hero: {
        eyebrow: 'Speech & Presentation Coaching',
        title: 'Command any room and speak with unstoppable authority',
        subtitle: "Whether it's a pitch, a closing argument, or a quarterly review — deliver your message with impact.",
        ctaLabel: CONSULTATION,
      },
      intro:
        'We deliver elite coaching, teaching, training, and instruction designed to transform how you present yourself and your ideas. Through high-focus 1-on-1 instruction or collaborative custom group instruction, you will master the psychological and physical tools needed to deliver unforgettable presentations.',
      whoFor: {
        title: 'Who this is for',
        items: [
          'Executives and managers presenting to boards, clients, and teams', // DRAFT
          'Lawyers preparing closing arguments and oral submissions', // DRAFT
          'Professionals pitching ideas to international stakeholders', // DRAFT
          'Anyone who wants to overcome stage anxiety in English', // DRAFT
        ],
      },
      learn: { title: "What you'll work on", items: [] },
      sections: [],
      bottomCta: {
        title: 'Command the room & own your stage',
        body: "Book a free consultation. We'll discuss your next presentation and build a plan to deliver it with confidence.", // DRAFT
        buttonLabel: CONSULTATION,
      },
    },
  },
]

export const defaultContent: SiteContent = {
  brand: {
    name: 'RoxanneAlexia',
    descriptor: 'Language Coach',
    tagline: 'Law & Business English',
    personName: 'Roxanne Maison',
  },
  global: {
    consultationCta: CONSULTATION,
    consultationModal: {
      eyebrow: 'Free consultation',
      title: "Let's talk about your goals",
      body: 'Choose how you would like to get in touch — no commitment required.',
      calendlyLabel: 'Pick a time in my calendar',
      calendlyHint: 'Book your free consultation instantly',
      whatsappLabel: 'Chat on WhatsApp',
      whatsappHint: 'Quick questions, fast answers',
      messageLabel: 'Send me a message',
      messageHint: 'Tell me about your goals',
    },
    packagesModal: {
      eyebrow: 'Package options',
      sectionTitle: 'Choose the format that fits you', // DRAFT
      body: 'All lessons are customized to the professional needs we discuss in your consultation.',
      note: "Not sure which format fits? We'll choose it together during your free consultation.",
      primaryLabel: CONSULTATION,
      secondaryLabel: 'Ask on WhatsApp',
    },
    whatsappMessage: "Hello Roxanne! I'm interested in your English courses and would like more information.",
    whatsappTooltip: 'Chat on WhatsApp',
  },
  nav: {
    items: [
      { label: 'About', href: '/about' },
      { label: 'Courses', href: '/courses' },
      { label: 'Freelance & Project Needs', href: '/freelance' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  footer: {
    blurb: 'Online English courses for adults in law, business, and finance — private 1-on-1 lessons or custom group instruction.',
    links: [
      { label: 'Services', href: '/courses' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    legal: 'All rights reserved.',
  },
  home: {
    meta: {
      title: 'RoxanneAlexia | Online English Courses for Adults — Law Business English',
      description:
        'Expert online English language courses for adults in business, law, and finance. 1-to-1 lessons with a professional English coach. Book a free consultation.',
    },
    hero: {
      eyebrow: 'Law & Business English Coach',
      title: 'Communicate with precision. Advance with confidence.',
      subtitle: 'Expert online English courses for adults in law, business, and finance — private 1-on-1 lessons or custom group instruction.',
      ctaLabel: CONSULTATION,
      secondaryCtaLabel: 'Explore courses',
    },
    intro: {
      eyebrow: 'Online English for professionals',
      title: 'Expert English courses for adults in law, business, and finance',
      body: "I help professionals across Europe communicate clearly and confidently in English — whether you're presenting to a boardroom, negotiating a contract, or drafting legal correspondence. Through tailored 1-to-1 online English courses for adults, you'll build the language skills that move your career forward.",
      linkLabel: 'Learn more about my approach',
      quote: 'I teach the English you actually need.',
    },
    marquee: [
      'Contract drafting',
      'Negotiations',
      'Presentations',
      'Executive writing',
      'Advocacy',
      'Global meetings',
      'Public speaking',
      'Legal terminology',
      'Pronunciation',
      'Client correspondence',
    ],
    benefits: {
      eyebrow: 'Why it matters',
      title: 'What holds professionals back and how we fix it',
      items: [
        {
          title: 'Speak with authority in meetings',
          description: 'Stop second-guessing your English when the stakes are high. Build fluency that earns respect in any professional setting.',
        },
        {
          title: 'Write with clarity and precision',
          description: 'From contracts to client emails, learn to write in professional English that is clear, accurate, and concise.',
        },
        {
          title: 'Present with confidence',
          description: "Whether it's a pitch, a closing argument, or a quarterly review — deliver your message with impact.",
        },
        {
          title: 'Advance your international career',
          description: "English shouldn't be the barrier between you and your next opportunity. Overcome your challenges with confidence.",
        },
      ],
    },
    services: {
      eyebrow: 'Courses',
      title: 'Tailored programs for every professional need',
      subtitle: 'Explore English classes for professionals.',
      cardCtaLabel: 'Package options',
    },
    freelance: {
      eyebrow: 'Freelance & Project Needs',
      title: 'Remote freelance legal assistant ready to support law firms and solo lawyers across Europe.',
      linkLabel: 'View all services',
    },
    testimonials: {
      eyebrow: 'Testimonials',
      title: 'What my clients say',
    },
    finalCta: {
      title: 'Ready to take the next step?',
      subtitle: "Book a free consultation and let's discuss your goals.",
      buttonLabel: CONSULTATION,
    },
  },
  about: {
    meta: {
      title: 'About | Roxanne Maison — Law Business English',
      description:
        'Meet Roxanne Maison — independent English language coach for professionals in law, business, and finance across Europe. Qualified, experienced, and focused on results.',
    },
    hero: {
      eyebrow: 'About',
      title: 'About Roxanne',
      subtitle: 'Independent English language coach for professionals in law, business, and finance across Europe.',
    },
    bio: {
      eyebrow: 'Meet your coach',
      title: 'Meet Roxanne Maison',
      paragraphs: [
        "I'm an independent English language coach specializing in business and legal communication. I work with professionals across Europe — lawyers, executives, and corporate teams — helping non-native speakers communicate with precision and confidence in English.",
        "I understand that professional English isn't about perfect grammar — it's about being clear, credible, and effective in the situations that matter most to your career.",
        'Every program I offer is built around your goals, your industry, and the real communication challenges you face at work. I teach the English you actually need.',
      ],
    },
    credentials: {
      title: 'Qualifications & experience',
      items: [],
    },
    offer: {
      eyebrow: 'My approach',
      title: 'What I offer',
      items: [
        {
          title: 'Tailored to your profession',
          description: 'Whether you work in law, finance, or corporate management — your lessons are designed around the language you use every day, not a generic curriculum.',
        },
        {
          title: 'Personal attention, always',
          // DRAFT — the sheet's "1-to-1, always / no group dynamics" contradicts the group courses on the Courses tab.
          description: 'Every session is built around you. In private 1-on-1 lessons you get my full attention and we work at your pace — and custom group courses bring the same tailored approach to your team.',
        },
        {
          title: 'Practical from day one',
          description: 'No textbooks for the sake of textbooks. We use your real emails, your real presentations, and your real professional challenges as the basis for every lesson.',
        },
      ],
      linkLabel: 'View my services',
    },
  },
  courses: {
    meta: {
      title: 'Services | Roxanne Maison — Law Business English',
      description:
        'Explore tailored English courses for professionals in law, business, and finance. 1-to-1 online classes for adults, corporate English training, and specialist legal English programs.',
    },
    hero: {
      eyebrow: 'Courses',
      title: 'Advance your career with custom English training',
    },
    intro: {
      body: 'Welcome to your premier destination for professional language mastery, offering flexible 1-on-1 instruction or custom group instruction tailored to your precise goals. I deliver premium coaching, teaching, training, and instruction designed to elevate your communication skills.',
      programsTitle: 'My core programs',
    },
    packagesLabel: 'Package options',
    howItWorks: {
      eyebrow: 'How it works',
      title: 'Launch Your Training',
      subtitle: 'How we partner with you to build your custom learning plan',
      steps: [
        {
          title: 'Schedule a Consultation',
          body: "Let's define your path to language mastery. During this brief discovery session, we will review what you need English for, evaluate your current proficiency, and customize the ideal mix of teaching and instruction for you or your team.",
        },
        {
          title: 'Receive Your Custom Program', // DRAFT title
          body: 'We design an elite program engineered around your specific profession, your demanding schedule, and your unique learning style.',
        },
        {
          title: 'Train for Real-World Results', // DRAFT title
          body: 'Experience high-impact coaching and teaching built for immediate workplace results. Dive into interactive sessions, hands-on practice, and direct professional application.',
        },
      ],
    },
    bottomCta: {
      title: "Let's Design Your Custom Learning Plan",
      linkLabel: 'Schedule a Consultation',
    },
  },
  courseList: defaultCourses,
  freelance: {
    meta: {
      title: 'Remote Freelance Legal Assistant | Roxanne Maison', // DRAFT
      description:
        'Remote freelance legal assistant for law firms and solo lawyers across Europe: legal English proofreading, drafting support and document preparation.', // DRAFT
    },
    hero: {
      eyebrow: 'Freelance & Project Needs',
      title: 'Remote support for law firms and solo lawyers', // DRAFT
      subtitle: 'Remote freelance legal assistant ready to support law firms and solo lawyers across Europe.',
      ctaLabel: 'Tell me about your project', // DRAFT
    },
    // DRAFT — whole page: no tab in the sheet.
    intro:
      "Alongside my teaching, I support legal professionals with English-language work — remotely, reliably, and with the precision legal work demands. Whether you need an extra pair of hands on a busy matter or ongoing support, let's talk about your project.",
    services: {
      eyebrow: 'How I can help',
      title: 'Support for your practice',
      items: [
        { title: 'Legal English proofreading', description: 'Contracts, correspondence, and submissions reviewed for clarity, accuracy, and consistent terminology.' },
        { title: 'Drafting support', description: 'Letters, memos, and client emails prepared in clear, professional English, ready for your review.' },
        { title: 'Document preparation', description: 'Organizing, formatting, and checking documents so they are ready to file or send.' },
        { title: 'Terminology & glossaries', description: 'Custom glossaries and style notes so your whole team uses consistent legal English.' },
        { title: 'Client communication', description: 'Support preparing English-language calls, meetings, and correspondence with international clients.' },
        { title: 'Project & admin support', description: 'Remote help with correspondence, scheduling, and case-file organization during busy periods.' },
      ],
    },
    idealFor: {
      title: 'Ideal for',
      items: ['Law firms across Europe', 'Solo lawyers and small practices', 'In-house legal teams', 'International matters conducted in English'],
    },
    process: {
      eyebrow: 'How it works',
      title: 'Simple, remote, reliable',
      steps: [
        { title: 'Share your project', body: 'Tell me what you need, your deadline, and any specific requirements.' },
        { title: 'Receive a clear proposal', body: "I'll confirm scope, timing, and next steps before we begin." },
        { title: 'Delivered with care', body: 'Your work is completed remotely, with discretion and attention to detail.' },
      ],
    },
    bottomCta: {
      title: 'Have a project in mind?',
      body: 'Send me a message or book a quick call to discuss how I can support your practice.',
      buttonLabel: CONSULTATION,
    },
  },
  contact: {
    meta: {
      title: 'Contact | Roxanne Maison — Law Business English',
      description:
        'Get in touch or book a free consultation with Roxanne Maison. Discuss your English language goals and find the right program for your profession.',
    },
    hero: {
      eyebrow: 'Contact',
      title: 'Book a free consultation',
      body: "Whether you have a question about my services or you're ready to get started, I'd love to hear from you. Book a free consultation call and we'll discuss your goals, your current level, and the right program for you — no commitment required.",
    },
    details: {
      title: 'Get in touch',
      emailLabel: 'Email',
      whatsappLabel: 'WhatsApp',
      note: "I'll get back to you as soon as possible.",
    },
    scheduler: {
      eyebrow: 'Instant booking',
      title: 'Pick a time that suits you',
      body: 'Choose a slot for your free consultation directly in my calendar.',
      buttonLabel: 'See available times',
      privacyNote: 'The calendar is provided by Calendly and only loads when you open it.',
    },
    form: {
      title: 'Send me a message',
      nameLabel: 'Name',
      emailLabel: 'Email',
      topicLabel: "I'm interested in",
      topics: [
        'Business English',
        'Legal English',
        'Beginner English for Adults',
        'Speech & Presentation Coaching',
        'Freelance & project needs',
        'Something else',
      ],
      messageLabel: "Tell me a little about your goals and what you're looking for",
      consentLabel: 'I agree that my details will be used to reply to my message.',
      submitLabel: 'Send Message',
      successTitle: 'Thank you — your message is on its way.',
      successBody: "I'll get back to you as soon as possible. In the meantime, feel free to book your free consultation.",
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Good to know',
      items: [
        {
          question: 'Are the lessons online?',
          answer: 'Yes. All courses are delivered online, so you can learn from anywhere in Europe — and beyond — around your schedule.',
        },
        {
          question: 'Can I book lessons for my team?',
          answer: 'Absolutely. Every program is available as private 1-on-1 instruction or as custom group instruction, and I also design corporate English training for organizations.',
        },
        {
          question: 'What happens in the free consultation?',
          answer: 'We review what you need English for, evaluate your current level, and design the ideal mix of coaching and instruction for you or your team — no commitment required.',
        },
        {
          question: 'Do you use textbooks?',
          answer: 'Lessons are built around your real work — your emails, presentations, contracts, and professional challenges — not generic exercises.',
        },
        {
          question: 'Which program is right for me?',
          answer: "That's exactly what the free consultation is for. I'll recommend the right program based on your goals.",
        },
      ],
    },
  },
  privacy: {
    meta: {
      title: 'Privacy Policy | RoxanneAlexia Language Coach',
      description: 'How personal data is handled on this website.',
    },
    title: 'Privacy Policy',
    updated: 'September 2026',
    // DRAFT — template text; review before launch.
    sections: [
      {
        title: 'Who is responsible',
        body: 'This website is operated by Roxanne Maison (RoxanneAlexia Language Coach). For any question about your personal data, write to the email address shown on the Contact page.',
      },
      {
        title: 'What data is collected',
        body: 'When you use the contact form, I receive your name, email address, the topic you select, and your message. This website does not use advertising or analytics cookies.',
      },
      {
        title: 'Why it is used',
        body: 'Your details are used only to reply to your enquiry and, if you wish, to arrange a consultation or lessons. The legal basis is your consent and the steps taken at your request before entering into a contract (GDPR Art. 6(1)(a) and (b)).',
      },
      {
        title: 'Third-party services',
        body: 'Booking a consultation opens Calendly, and chat links open WhatsApp. These services process your data under their own privacy policies, and only when you choose to use them.',
      },
      {
        title: 'How long it is kept',
        body: 'Messages are kept only as long as needed to handle your enquiry and any resulting lessons, and are deleted on request.',
      },
      {
        title: 'Your rights',
        body: 'You can ask to access, correct, or delete your data, or withdraw your consent, at any time by email. You also have the right to lodge a complaint with your local data protection authority.',
      },
    ],
  },
}

export const defaultSettings: SiteSettings = {
  email: 'lawbusinessenglishspeechcoach@gmail.com',
  whatsappNumber: '+1 (586) 850-5625',
  showPhone: true,
  calendlyUrl: '',
  socials: { linkedin: '', instagram: '', facebook: '', youtube: '' },
  photos: {},
  notifyByEmail: true,
}
