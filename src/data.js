export const asset = (path) => import.meta.env.BASE_URL + path

export const NAV = [
  { label: 'Home', id: 'top' },
  { label: 'About', id: 'about' },
  { label: 'Team', id: 'team' },
  { label: 'Projects', id: 'projects' },
  { label: 'Blog', id: 'blog' },
  { label: 'Contact', id: 'donate' },
]

export const MARQUEE = ['Education', 'Care', 'Companionship', 'Health', 'Nutrition', 'Smiles']

export const STATS = [
  { text: '2019', label: 'Registered under the Societies Registration Act, 1860' },
  { text: '80G', label: 'All donations are tax-exempt to the donor' },
  { count: 22, suffix: '+', label: 'TB patients on nutrition support this year' },
  { count: 6, label: 'Children sponsored through school by founding members' },
]

export const VISION = [
  { label: 'To Provide', text: "A secure, happy, healthy childhood to the country's underprivileged children." },
  { label: 'And', text: 'An interesting and cheerful existence to lonely seniors.' },
  { label: 'Also', text: 'Extending a hand for any need or during any calamity in the nation without restriction.' },
]

export const PROJECTS = [
  {
    id: 'nikshay',
    icon: 'tb',
    cats: ['Health'],
    tag: 'Health · Ni-kshay Mitra',
    title: 'Nikshay Poshan Project',
    short: 'SAHAS adopted 10 TB patients in March 2024 and now supports about 22 with WHO-approved nutrition packets.',
    body: [
      'SAHAS registered as a Ni-Kshay Mitra partner in 2023. With funds raised from Trustees, we adopted 10 poor and needy TB patients for a year in March 2024, distributing WHO-approved dry nutritious food packets to them on World TB Day.',
      "This year, with the help of friends and well-wishers, we've reached about 22 patients. An appeal: sponsoring one patient for a year costs around just Rs. 1,000/- a month.",
    ],
    ask: { value: 'Rs. 1,000 / month', note: 'sponsors one TB patient' },
    cta: 'Sponsor a patient',
  },
  {
    id: 'cycle',
    icon: 'bike',
    cats: ['Education'],
    tag: 'Education · Mobility',
    title: 'Cycle Project: Hope for education',
    short: 'More than 60% of rural children drop out after 5th grade. SAHAS collects, refurbishes and funds bicycles so the journey to school is safer.',
    body: [
      'In rural India, more than 60% of children drop out of school after 5th grade. High schools are far away, and 32.5% of girls drop out at the secondary level for want of a safe, affordable way to get there.',
      'SAHAS collects and refurbishes discarded bicycles, or funds new ones, so the journey to school becomes safer, faster, and life becomes a little easier. A bicycle costs roughly Rs. 4-5K new, around Rs. 2K second-hand. Even Rs. 500/- from you moves us toward that goal.',
    ],
    ask: { value: 'From Rs. 500', note: 'toward a bicycle' },
    cta: 'Donate a bicycle',
  },
  {
    id: 'sponsorship',
    icon: 'heart',
    cats: ['Education', 'Health'],
    tag: 'Community pool',
    title: 'Child Sponsorship',
    short: 'Pooled giving across five pillars: education, water, nutrition, healthcare and income training.',
    body: [
      'Child sponsorship enables you to support children, their families and entire communities, giving them the chance to grow up healthy, educated and safe.',
      'Funds are pooled across five pillars: education, clean water & sanitation, food & nutrition, healthcare, and income training & empowerment. You can sponsor an infrastructure need such as a bicycle, or school essentials like uniforms, books and bags.',
    ],
    ask: { value: 'Pooled giving', note: 'five pillars' },
    cta: 'Become a sponsor',
  },
  {
    id: '3e',
    icon: 'book',
    cats: ['Education'],
    tag: 'Education · Tuition',
    title: '3E: Educate, Encourage, Elevate',
    short: 'Tuition assistance for academically inclined, financially weak students through Standard 10.',
    body: [
      'We are in touch with schools to run a tuition assistance program for academically inclined, financially weak students, with yearly assistance based on academic performance through Standard 10th.',
      "To start, the founder members of SAHAS have each decided to sponsor one child, so that at least half a dozen are taken care of this academic year. A small amount of Rs. 8,000/- a year is enough to put a child through school. You select the child, and a report with photo is sent once the school year's need is funded.",
    ],
    ask: { value: 'Rs. 8,000 / year', note: 'puts a child through school' },
    cta: "Sponsor a child's year",
  },
  {
    id: 'health',
    icon: 'health',
    cats: ['Health'],
    tag: 'Public health',
    title: 'Health',
    short: 'Nutrition for TB patients and their families, plus tribal healthcare and checkups.',
    body: [
      'Tuberculosis remains a serious health threat, and poor nutrition among the marginalised makes them especially vulnerable. More than 40 thousand are affected in Mumbai alone. Medical treatment is free, but nutrition, for the patient and their whole family, is not.',
      "As a self-financed organisation, SAHAS became a Ni-kshay Mitra and now supplies the WHO-recommended food basket to patients under the government's Nikshay Poshan Yojana, alongside our own funds. SAHAS also works on tribal healthcare and checkups, including the Health & Hygiene Camp for tribal women held in Panvel on July 2, 2026.",
    ],
    ask: { value: 'Health drives', note: 'TB nutrition and tribal checkups' },
    cta: 'Support a health drive',
  },
]

export const TIMELINE = [
  { when: 'The start', text: 'Seven friends begin setting aside Rs. 1,000 each, every month.' },
  { when: 'Assam floods', text: 'With about Rs. 50,000 collected, they empty the fund for flood relief.' },
  { when: 'Dharavi & Hatkalwadi', text: 'Dharavi Art asks for help for slum children; a village water crisis proves too big alone. They decide to organise, and name the group SAHAS: courage.' },
  { when: '18 Dec 2019', text: 'Registered with the Charity Commissioner of Mumbai, Reg. No. 2190/2019.' },
  { when: 'COVID years', text: 'Paperwork stalls for two years, but giving continues: medical equipment for COVID patients and food for slum children.' },
  { when: 'Late 2022', text: 'A bank account opens to keep every transaction transparent, and the 80G process begins.' },
  { when: '13 Mar 2023', text: 'Provisional 80G(5) certificate issued, making donations tax-exempt.' },
  { when: '2023', text: 'SAHAS registers as a Ni-Kshay Mitra partner.' },
  { when: 'March 2024', text: 'Ten TB patients are adopted and receive nutrition packets on World TB Day.' },
  { when: '2 Jul 2026', text: 'Health & Hygiene Camp for tribal women at Madhuban Agro Farms, Panvel.' },
]

export const STORY = [
  'SAHAS was conceived by a few of us post-retirement, free from the shackles of a scheduled work life, wanting to give back to society a little of what our country gave us, inspired by an article about a few friends from a locality who had come together to provide aid to the needy which they, as individuals, were not able to.',
  "Seven of us then, some retirees, some still working, one a housewife, one a doctor, decided we would collect a thousand rupees each, every month, so that at opportune moments we'd be able to give our small contribution where it was needed. As luck would have it, floods devastated Assam right around the time our coffers reached about fifty thousand rupees, and we emptied our collection.",
  "Then Himanshu from Dharavi Art told us the children of the Dharavi slums could do with some help, and around the same time we read about Hatkalwadi's severe water shortage. That project was too large for seven of us to handle alone, but it gave us an idea: we needed to be organised so others could join us with their own generosity. After much discussion we agreed on a name, SAHAS, courage, and applied to the Charity Commission to register as an Association.",
  "Even as the paperwork was underway, one of us had an accident and was laid up with a broken back. Then COVID happened, and everything stalled for two years; more of us retired, and our beloved Doctor Aunty passed away. By late 2022 we were back on track: a bank account for transparency, and our 80G tax exemption completed with friends' help. When COVID struck, Dr Padmini Desai and Dr Ajit Desai suggested we contribute toward medical equipment for treating patients, and Himanshu came back for the slum children's food. We could do both.",
  "Individually, most of the founders already do their bit, volunteering with orphanages, working with temple trusts, sponsoring a girl child's education or their house-help's. Together, we've decided to concentrate first on education, sponsoring six kids' education ourselves, and on adopting TB patients to look after their treatment and their family's health. Everything requires money, and donors are our backbone.",
]

export const TEAM = [
  {
    name: 'Mr. Surendra Chavhan',
    initials: 'SC',
    photo: 'images/team-surendra.jpg',
    bio: 'AMFI certificate holder, has his own investment firm and is into consultancy for 12+ years. Since last few years, involved with social work also.',
  },
  {
    name: 'Mr. Debjit Kar',
    initials: 'DK',
    bio: 'MBA with a successful marketing career for last 20+ years. Despite a killing work schedule, feels responsible and thinks we must give something in return to society.',
  },
  {
    name: 'Mrs. Shakuntala Gandhi',
    initials: 'SG',
    bio: 'Homemaker & social worker since the last 30+ years.',
  },
  {
    name: 'Mrs. Usha Sundaram',
    initials: 'US',
    bio: 'Retired bank employee, much involved with various charity projects for last 25+ years.',
  },
]

export const IMPACT = [
  { amount: 500, text: "Goes toward bicycles for children in Maharashtra's villages.", project: 'Cycle Project' },
  { amount: 1000, text: 'Nutrition packets for one TB patient, for a month.', project: 'Nikshay Poshan' },
  { amount: 8000, text: "Puts a child through school for a year.", project: '3E' },
]

export const PAN_LIMIT = 2000

export const BANK = {
  name: 'SAHAS SPREADING AID HEALTH AND SMILE FOUNDATION',
  bank: 'SVC Cooperative Bank Ltd',
  account: '109503130010450',
  ifsc: 'SVCB0000095',
  cert: 'ABVAS8438DF20231',
}

export const CONTACT = {
  phone: '+91 88509 94284',
  email: 'sahasfoundationmumbai@gmail.com',
}
