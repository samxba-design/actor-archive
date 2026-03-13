export const mockProfile = {
  id: "demo-copywriter",
  display_name: "Priya Sharma",
  first_name: "Priya",
  last_name: "Sharma",
  tagline: "Brand Strategist & Conversion Copywriter · B2B SaaS · DTC",
  bio: "I help ambitious brands find their voice and turn it into revenue. Over the past 8 years, I've written for 60+ companies — from Y Combinator startups to Fortune 500 brands — across landing pages, email sequences, ad campaigns, and brand messaging.\n\nMy work has generated over $12M in attributable revenue. I combine direct-response technique with brand-level craft, because copy that converts shouldn't sound like it was written by a robot.",
  location: "Brooklyn, NY",
  profile_photo_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
  banner_url: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1600&h=500&fit=crop",
  profile_type: "copywriter",
  available_for_hire: true,
  seeking_representation: false,
  professional_status: "Accepting Clients",
  status_badge_color: "blue",
  status_badge_animation: "glow",
  cta_label: "Get a Quote",
  cta_url: "#",
  cta_type: "custom_url",
  booking_url: null,
  show_contact_form: true,
};

export const mockSocialLinks = [
  { id: "s1", platform: "linkedin", label: "LinkedIn", url: "https://linkedin.com", display_order: 1 },
  { id: "s2", platform: "x", label: "X / Twitter", url: "https://x.com", display_order: 2 },
  { id: "s3", platform: "website", label: "Blog", url: "https://blog.example.com", display_order: 3 },
  { id: "s4", platform: "substack", label: "Newsletter", url: "https://substack.com", display_order: 4 },
];

export const mockCaseStudies = [
  {
    id: "cs1", title: "Finova Landing Page Overhaul", client: "Finova", project_type: "case_study",
    challenge: "Finova's landing page had a 1.2% conversion rate and high bounce — visitors didn't understand the product value within 5 seconds.",
    solution: "Rewrote the hero, restructured the page around customer pain points, added social proof blocks, and created urgency with a limited beta CTA.",
    results: "Conversion rate jumped from 1.2% to 4.8% in 6 weeks. CAC dropped 34%.",
    metric_callouts: [{ value: "4.8%", label: "Conv. Rate" }, { value: "-34%", label: "CAC" }, { value: "$1.2M", label: "Pipeline" }],
    tags: ["SaaS", "Landing Page", "B2B"], is_featured: true, year: 2024,
    poster_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
  },
  {
    id: "cs2", title: "Bloom & Birch Email Sequence", client: "Bloom & Birch", project_type: "case_study",
    challenge: "The DTC skincare brand's welcome sequence had a 12% open rate and almost zero revenue attribution.",
    solution: "Designed a 7-email welcome flow with storytelling, social proof, and progressive offers. A/B tested subject lines and CTA placement.",
    results: "Open rate increased to 48%. Welcome flow now generates $180K/year in attributed revenue.",
    metric_callouts: [{ value: "48%", label: "Open Rate" }, { value: "$180K", label: "Annual Rev" }, { value: "4x", label: "Click Rate" }],
    tags: ["DTC", "Email", "Ecommerce"], is_featured: true, year: 2024,
    poster_url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
  },
  {
    id: "cs3", title: "Meridian Health Brand Voice", client: "Meridian Health", project_type: "case_study",
    challenge: "Meridian's messaging felt clinical and generic — indistinguishable from competitors in the crowded telehealth space.",
    solution: "Developed a comprehensive brand voice guide, tagline system, and rewrote all patient-facing copy across web, app, and marketing materials.",
    results: "Brand recall increased 62% in post-campaign surveys. NPS improved by 18 points.",
    metric_callouts: [{ value: "+62%", label: "Brand Recall" }, { value: "+18", label: "NPS" }, { value: "40+", label: "Pages" }],
    tags: ["Healthcare", "Brand Voice", "UX Copy"], is_featured: false, year: 2023,
  },
  {
    id: "cs4", title: "Torque Fitness Meta Ad Campaign", client: "Torque Fitness", project_type: "case_study",
    challenge: "Paid social ROAS was below 2x. Ad creative was product-focused with no emotional hook.",
    solution: "Wrote 24 ad variations using pain-agitate-solve framework. Focused on transformation narratives and user testimonials.",
    results: "ROAS increased from 1.8x to 5.2x. Best-performing ad generated $420K in 90 days.",
    metric_callouts: [{ value: "5.2x", label: "ROAS" }, { value: "$420K", label: "Revenue" }, { value: "24", label: "Ad Variants" }],
    tags: ["DTC", "Paid Social", "Meta Ads"], is_featured: false, year: 2023,
  },
];

export const mockServices = [
  { id: "sv1", name: "Landing Page Copy", description: "High-converting landing page copy with headline testing, benefit blocks, social proof, and CTA strategy.", starting_price: "$3,500", deliverables: ["Full page copy", "3 headline variants", "CTA strategy doc", "One revision round"], turnaround: "5-7 business days", is_featured: true },
  { id: "sv2", name: "Email Sequence", description: "Welcome flows, nurture sequences, and launch campaigns that drive opens, clicks, and revenue.", starting_price: "$2,000", deliverables: ["5-7 email sequence", "Subject line variants", "Segmentation strategy"], turnaround: "7-10 business days", is_featured: true },
  { id: "sv3", name: "Brand Voice Development", description: "Comprehensive brand voice guide with tone spectrum, do/don't examples, and messaging hierarchy.", starting_price: "$5,000", deliverables: ["Voice guide document", "Tagline options", "Sample rewrites", "Team workshop"], turnaround: "2-3 weeks", is_featured: false },
  { id: "sv4", name: "Ad Copy Package", description: "Performance-focused ad copy for Meta, Google, and LinkedIn. Includes multiple hooks and variants.", starting_price: "$1,500", deliverables: ["12-24 ad variants", "Audience-specific angles", "Performance notes"], turnaround: "3-5 business days", is_featured: false },
];

export const mockTestimonials = [
  { id: "t1", quote: "Priya rewrote our landing page and conversion rate nearly quadrupled. She has an uncanny ability to find the exact words that make people click.", author_name: "Alex Chen", author_role: "CEO", author_company: "Finova", author_photo_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
  { id: "t2", quote: "Our email welcome sequence went from an afterthought to our #1 revenue channel. Priya doesn't just write — she engineers outcomes.", author_name: "Sarah Mitchell", author_role: "Head of Growth", author_company: "Bloom & Birch", author_photo_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
  { id: "t3", quote: "We've worked with a dozen copywriters. Priya is the first one who actually took time to understand our customers before writing a single word.", author_name: "James Wright", author_role: "VP Marketing", author_company: "Meridian Health", author_photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
];

export const mockClients = ["Apple", "Microsoft", "Shopify", "HubSpot", "Stripe", "Notion", "Salesforce", "Slack"];

export const mockSkills = [
  { id: "sk1", name: "Conversion Copywriting", category: "Core", proficiency: "expert" },
  { id: "sk2", name: "Brand Messaging", category: "Core", proficiency: "expert" },
  { id: "sk3", name: "Email Marketing", category: "Channels", proficiency: "expert" },
  { id: "sk4", name: "Landing Pages", category: "Channels", proficiency: "expert" },
  { id: "sk5", name: "Ad Copy (Meta/Google)", category: "Channels", proficiency: "advanced" },
  { id: "sk6", name: "UX Writing", category: "Specialty", proficiency: "advanced" },
  { id: "sk7", name: "SEO Content Strategy", category: "Specialty", proficiency: "advanced" },
  { id: "sk8", name: "A/B Testing", category: "Analytics", proficiency: "advanced" },
  { id: "sk9", name: "Customer Research", category: "Strategy", proficiency: "expert" },
  { id: "sk10", name: "Figma (for copy context)", category: "Tools", proficiency: "intermediate" },
];

export const mockAwards = [
  { id: "a1", name: "Content Marketing Award", category: "Best Email Campaign — DTC", organization: "Content Marketing Institute", year: 2024, result: "Gold" },
  { id: "a2", name: "AWAI Copywriter of the Year", category: "Direct Response", organization: "AWAI", year: 2023, result: "Finalist" },
  { id: "a3", name: "MarketingProfs B2B Award", category: "Best Landing Page Copy", organization: "MarketingProfs", year: 2023, result: "Winner" },
];

export const mockPress = [
  { id: "p1", title: "The Copy Formula Behind a $12M Portfolio", publication: "Marketing Brew", date: "January 2024", pull_quote: "Sharma's approach combines direct-response fundamentals with a storyteller's instinct.", article_url: "#", press_type: "feature", star_rating: null },
  { id: "p2", title: "10 Copywriters Redefining Brand Voice in 2024", publication: "Adweek", date: "March 2024", pull_quote: null, article_url: "#", press_type: "list", star_rating: null },
  { id: "p3", title: "Why Your SaaS Landing Page Isn't Converting (and How to Fix It)", publication: "First Round Review", date: "November 2023", pull_quote: null, article_url: "#", press_type: "guest_post", star_rating: null },
];

export const mockEducation = [
  { id: "ed1", institution: "CXL Institute", degree_or_certificate: "Conversion Copywriting Certification", education_type: "Certification", year_start: 2019, year_end: 2019, teacher_name: null, description: "Advanced course in data-driven copywriting and A/B testing.", is_ongoing: false },
  { id: "ed2", institution: "Columbia University", degree_or_certificate: "BA, English & Creative Writing", field_of_study: "English", education_type: "Undergraduate", year_start: 2012, year_end: 2016, teacher_name: null, description: null, is_ongoing: false },
  { id: "ed3", institution: "Copyhackers 10x Emails", degree_or_certificate: "Email Copywriting Masterclass", education_type: "Workshop", year_start: 2020, year_end: null, teacher_name: "Joanna Wiebe", description: "Intensive email copy program.", is_ongoing: false },
];

export const mockKnownFor = mockCaseStudies.filter(cs => cs.is_featured).map(cs => ({
  ...cs,
  poster_url: cs.poster_url,
  network_or_studio: cs.client,
  role_name: cs.tags?.[0],
}));

export const featuredProject = {
  ...mockCaseStudies[0],
  network_or_studio: mockCaseStudies[0].client,
  role_name: "Lead Copywriter",
  backdrop_url: mockCaseStudies[0].poster_url,
};

export const mockPublishedWork = [
  {
    id: "pw1",
    title: "The Psychology of the First Sentence",
    summary: "Why the first 8 words determine whether 80% of readers continue. A deep dive into opening hooks across 200 top-performing landing pages.",
    cover_image_url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=500&fit=crop",
    pdf_url: null,
    article_url: "https://example.com/first-sentence",
    category: "Long-form",
    publication: "Marketing Brew",
    date: "January 2024",
    read_time: "8 min read",
    is_featured: true,
    show_text_overlay: true,
  },
  {
    id: "pw2",
    title: "SaaS Messaging Framework: Pain → Promise → Proof",
    summary: "The 3P framework I use to structure every B2B landing page. Includes before/after rewrites from real client projects.",
    cover_image_url: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&h=500&fit=crop",
    pdf_url: null,
    article_url: "https://example.com/saas-framework",
    category: "Framework",
    publication: "First Round Review",
    date: "November 2023",
    read_time: "12 min read",
    is_featured: true,
    show_text_overlay: true,
  },
  {
    id: "pw3",
    title: "Email Subject Lines That Actually Work",
    summary: "I analysed 50,000 subject lines from top DTC brands. Here are the 7 patterns that consistently beat benchmarks.",
    cover_image_url: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=600&h=400&fit=crop",
    pdf_url: null,
    article_url: "https://example.com/subject-lines",
    category: "Email",
    publication: "Copyhackers",
    date: "September 2023",
    read_time: "6 min read",
    is_featured: false,
    show_text_overlay: true,
  },
  {
    id: "pw4",
    title: "Why Most Brand Voice Guides Fail (And How to Fix Yours)",
    summary: "Most brand voice documents end up in a Google Drive graveyard. A practical guide to building voice guides teams actually use.",
    cover_image_url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop",
    pdf_url: null,
    article_url: "https://example.com/brand-voice",
    category: "Brand",
    publication: "Substack",
    date: "July 2023",
    read_time: "10 min read",
    is_featured: false,
    show_text_overlay: true,
  },
  {
    id: "pw5",
    title: "The Conversion Copy Teardown: Notion's Homepage",
    summary: "A line-by-line breakdown of why Notion's homepage copy works — and the subtle techniques most people miss.",
    cover_image_url: null,
    pdf_thumbnail_url: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=400&fit=crop",
    pdf_url: null,
    article_url: "https://example.com/notion-teardown",
    category: "Teardown",
    publication: "Newsletter",
    date: "May 2023",
    read_time: "7 min read",
    is_featured: false,
    show_text_overlay: true,
  },
  {
    id: "pw6",
    title: "Writing for Developers: A Copywriter's Guide",
    summary: "What I learned writing copy for 15 developer tools. Technical audiences need different persuasion techniques.",
    cover_image_url: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&h=400&fit=crop",
    pdf_url: null,
    article_url: "https://example.com/dev-copy",
    category: "Long-form",
    publication: "Dev.to",
    date: "March 2023",
    read_time: "9 min read",
    is_featured: false,
    show_text_overlay: true,
  },
];
