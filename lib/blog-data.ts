import { Author, BlogPost, Comment } from "@/types";

export const authors: Author[] = [
  {
    slug: "sarah-chen", name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    bio: "Senior technology writer covering AI, machine learning, and the future of computing. Former engineer at Google Brain. I write about the intersection of technology and human experience.",
    role: "Senior Tech Writer", twitter: "sarahchen", website: "https://sarahchen.dev",
    postCount: 24, tags: ["AI", "Machine Learning", "Engineering", "Future of Work"],
  },
  {
    slug: "marcus-johnson", name: "Marcus Johnson",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    bio: "Sports journalist and cultural commentator. 15 years covering the NBA, NFL, and the business of sports. Believer in the power of sport to shape society.",
    role: "Sports & Culture Editor", twitter: "marcusjwrites",
    postCount: 18, tags: ["NBA", "Sports Business", "Culture", "Athletes"],
  },
  {
    slug: "dr-lisa-park", name: "Dr. Lisa Park",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    bio: "Physician and health journalist. MD from Johns Hopkins, MPH from Harvard. I translate complex medical research into actionable insights for everyday readers.",
    role: "Health & Science Editor", twitter: "drlisapark", website: "https://drlisapark.com",
    postCount: 31, tags: ["Medicine", "Public Health", "Nutrition", "Mental Health"],
  },
  {
    slug: "alex-kim", name: "Alex Kim",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    bio: "Product designer and writer. I explore the craft of building products people love — from design systems to user psychology. Previously at Apple and Figma.",
    role: "Design & Product Writer", twitter: "alexkimdesign", website: "https://alexkim.design",
    postCount: 15, tags: ["Design", "Product", "UX", "Design Systems"],
  },
  {
    slug: "rachel-green", name: "Rachel Green",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&q=80",
    bio: "Financial journalist and former Wall Street analyst. I cover markets, startups, and the economics of the tech industry. Author of 'The Startup Economy'.",
    role: "Finance & Business Editor", twitter: "rachelgreenwrites",
    postCount: 22, tags: ["Finance", "Startups", "Markets", "Economics"],
  },
];

export const authorMap = Object.fromEntries(authors.map((a) => [a.slug, a]));

export const blogPosts: BlogPost[] = [
  {
    slug: "the-quiet-revolution-in-ai-reasoning",
    title: "The Quiet Revolution in AI Reasoning",
    subtitle: "How large language models are learning to think step by step — and why it changes everything",
    coverImage: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=80",
    author: authors[0], publishedAt: "2026-04-12T09:00:00Z", readTime: 9,
    tags: ["AI", "Machine Learning", "GPT", "Reasoning"],
    category: "engineering", featured: true, likes: 847,
    content: `There's a moment in every technological revolution when the thing stops feeling like a tool and starts feeling like a collaborator. We may have just crossed that threshold with AI reasoning.

> "The difference between a calculator and a thinking machine is not speed — it's the ability to ask 'why'."

For years, the dominant critique of large language models was that they were sophisticated autocomplete engines. They could predict the next word with uncanny accuracy, but they couldn't reason. They couldn't hold a chain of logic together across multiple steps. They hallucinated with confidence.

## What Changed

The shift began quietly, with a technique called chain-of-thought prompting. Instead of asking a model to jump directly to an answer, researchers found that asking it to "think step by step" dramatically improved performance on complex tasks. The model wasn't just predicting tokens — it was building a scaffold of intermediate reasoning.

This was surprising. The models weren't trained to reason. They were trained to predict text. But somewhere in the vast corpus of human writing — textbooks, proofs, arguments, debates — they had absorbed the structure of reasoning itself.

> "We didn't teach the model to reason. We taught it to write like someone who reasons. It turns out those might be the same thing."

## The Implications Are Profound

Consider what this means for software engineering. A model that can reason about code doesn't just autocomplete functions — it can debug, refactor, and architect. It can hold the entire context of a codebase in mind and make decisions that account for edge cases three layers deep.

## What Comes Next

The next frontier isn't making models smarter in the abstract. It's making them calibrated — able to know what they know, flag what they don't, and reason about their own uncertainty. The quiet revolution is just getting started.`,
  },
  {
    slug: "designing-for-trust",
    title: "Designing for Trust",
    subtitle: "Why the most important design decision you'll ever make has nothing to do with pixels",
    coverImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80",
    author: authors[3], publishedAt: "2026-04-10T10:00:00Z", readTime: 7,
    tags: ["Design", "UX", "Product", "Trust"],
    category: "design", featured: true, likes: 612,
    content: `I've been designing products for twelve years. I've obsessed over typography, agonised over colour palettes, and spent entire weeks on the perfect micro-interaction. And I've come to believe that most of it is secondary.

The most important design decision you'll ever make is whether your product is trustworthy.

> "Users don't read your copy. They don't notice your animations. But they feel — immediately, viscerally — whether they can trust you."

## Trust Is Not a Feature

The mistake most product teams make is treating trust as something you add. A security badge here. A testimonial there. Trust isn't a feature. It's the accumulated result of every decision you make — every dark pattern you resist, every piece of data you don't collect, every time you tell users something they don't want to hear.

## What Trustworthy Design Looks Like

> "The best products I've used feel like they're on my side. Not neutral. Not indifferent. Actively working for me."

Trustworthy design is honest about tradeoffs. It tells you when something will cost you money, take your time, or share your data — before you commit, not after. It's consistent. The same action produces the same result every time.

## The Business Case

Users who trust a product use it more, pay more, and refer more. The products that earn trust win in the long term. Build for the long term.`,
  },
  {
    slug: "the-longevity-paradox",
    title: "The Longevity Paradox",
    subtitle: "We're living longer than ever. Why aren't we living better?",
    coverImage: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80",
    author: authors[2], publishedAt: "2026-04-08T08:00:00Z", readTime: 11,
    tags: ["Health", "Longevity", "Medicine", "Aging"],
    category: "opinion", featured: false, likes: 934,
    content: `In 1900, the average American lived to 47. Today, that number is 79. We've added more than three decades to the human lifespan in a single century — arguably the greatest achievement in the history of medicine.

And yet, when I talk to my patients, I hear the same thing over and over: "I don't want to live longer. I want to live better."

> "We've mastered the art of keeping people alive. We haven't mastered the art of keeping them well."

## The Compression of Morbidity

There's a concept in gerontology called the compression of morbidity — the idea that we should aim not just to extend life, but to compress the period of illness and decline into the shortest possible window at the end.

## What the Research Actually Shows

Exercise is the single most powerful intervention we have. Not just for physical health — for cognitive health, mental health, and longevity. Sleep is not optional. Chronic sleep deprivation accelerates virtually every marker of aging.

> "The most underrated health intervention in the world is free, available to everyone, and most people are doing it wrong. It's called sleep."

Social connection is medicine. Loneliness is as dangerous as smoking 15 cigarettes a day. The research on this is unambiguous and largely ignored.`,
  },
  {
    slug: "the-economics-of-attention",
    title: "The Economics of Attention",
    subtitle: "How the attention economy is reshaping media, politics, and the human mind",
    coverImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80",
    author: authors[4], publishedAt: "2026-04-06T11:00:00Z", readTime: 8,
    tags: ["Media", "Economics", "Attention", "Technology"],
    category: "opinion", featured: false, likes: 521,
    content: `Attention is the scarcest resource in the modern economy. Not oil. Not capital. Not talent. Attention.

> "We used to say time is money. In the attention economy, attention is money. And we're spending it faster than we earn it."

## How We Got Here

When digital media discovered that advertising revenue was proportional to engagement, and engagement was proportional to time-on-site, the logic was inexorable: optimise for time. Build features that keep people scrolling. Reward content that provokes strong emotions — outrage, fear, desire — because strong emotions drive engagement.

## What Comes After

I don't think the attention economy is inevitable. I think it's a design choice — one that can be unmade. Some platforms are experimenting with subscription models that align incentives with user wellbeing rather than engagement. The attention economy isn't a law of nature. It's a business model. And business models can change.`,
  },
  {
    slug: "building-a-design-system-from-scratch",
    title: "Building a Design System from Scratch",
    subtitle: "A practical guide to creating a design system your team will actually use",
    coverImage: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&q=80",
    author: authors[3], publishedAt: "2026-04-04T09:00:00Z", readTime: 12,
    tags: ["Design Systems", "Tutorial", "Figma", "Engineering"],
    category: "tutorial", featured: false, likes: 1203,
    content: `Every design system I've ever built started the same way: with a designer who was tired of copying and pasting the same button for the hundredth time.

That's not a bad origin story. The best tools are born from genuine pain.

> "A design system is not a component library. It's a shared language. And like all languages, it only works if everyone speaks it."

## Start With Tokens, Not Components

The most common mistake teams make is starting with components. They build a button, then a card, then a modal — and six months later they have a component library that nobody uses because it doesn't match the product.

Start with design tokens. Colours, typography, spacing, shadows. These are the atoms from which everything else is built. Get them right and the components almost build themselves.

## The Governance Problem

The hardest part of a design system isn't building it. It's maintaining it. Who owns it? Who can change it? How do you handle contributions from teams who need something the system doesn't provide?

These are organisational problems, not design problems. And they need organisational solutions — clear ownership, documented processes, and a culture that treats the design system as a shared resource rather than a constraint.

## Measure Adoption, Not Coverage

Most teams measure design system success by coverage — what percentage of components are in the system. This is the wrong metric.

Measure adoption. How many product teams are using the system? How often are they reaching outside it? What are the most common reasons for deviation?

Adoption tells you whether the system is actually solving problems. Coverage just tells you how much work you've done.`,
  },
  {
    slug: "the-startup-funding-winter-is-over",
    title: "The Startup Funding Winter Is Over",
    subtitle: "What the return of venture capital means for founders, employees, and the tech ecosystem",
    coverImage: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1200&q=80",
    author: authors[4], publishedAt: "2026-04-02T10:00:00Z", readTime: 6,
    tags: ["Startups", "Venture Capital", "Finance", "Tech"],
    category: "product", featured: false, likes: 389,
    content: `After two years of belt-tightening, layoffs, and down rounds, the venture capital market is showing unmistakable signs of life. Deal volume is up 40% year-over-year. Valuations are recovering. And the IPO window — closed since 2022 — is creaking open again.

> "The funding winter wasn't a correction. It was a reset. The companies that survived it are fundamentally stronger."

## What Drove the Recovery

Three factors converged to thaw the market. First, interest rates peaked and began declining, making the risk-free rate of return less attractive and pushing capital back toward growth assets. Second, AI created a genuine new category of investment opportunity — one that investors couldn't ignore regardless of macro conditions. Third, the companies that survived the downturn demonstrated that they could operate efficiently, rebuilding investor confidence in the sector.

## What's Different This Time

The easy money era is over. Investors are more disciplined. They want to see a path to profitability, not just growth. They're doing more due diligence. They're writing smaller checks at lower valuations.

This is probably healthy. The 2021 vintage of startups was characterised by companies that raised too much money too fast and never had to develop the discipline that comes from operating under constraints.

## Advice for Founders

If you're raising now, be honest about your metrics. Investors have seen enough optimistic projections to be deeply sceptical of them. Show them the real numbers — including the ones that aren't flattering — and explain what you're doing about them.

The founders who will win in this environment are the ones who treat capital as a tool, not a goal.`,
  },
];

export const postMap = Object.fromEntries(blogPosts.map((p) => [p.slug, p]));

// ── Mock comments ─────────────────────────────────────────────────────────────

export const mockComments: Comment[] = [
  {
    id: "c1", postSlug: "the-quiet-revolution-in-ai-reasoning",
    author: "James Liu", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80",
    body: "This is one of the clearest explanations of chain-of-thought prompting I've read. The point about models absorbing the *structure* of reasoning from training data is fascinating — and a little unsettling.",
    publishedAt: "2026-04-12T14:30:00Z", likes: 24,
    replies: [
      {
        id: "c1r1", postSlug: "the-quiet-revolution-in-ai-reasoning",
        author: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80",
        body: "Thanks James! The unsettling part is intentional — I think we should be a little unsettled. It means we don't fully understand what's happening inside these models.",
        publishedAt: "2026-04-12T16:00:00Z", likes: 18,
      },
    ],
  },
  {
    id: "c2", postSlug: "the-quiet-revolution-in-ai-reasoning",
    author: "Priya Sharma", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80",
    body: "The calibration point at the end is crucial. I'd argue it's the defining challenge of the next decade of AI research. Models that know what they don't know would be transformative.",
    publishedAt: "2026-04-13T09:15:00Z", likes: 31,
  },
  {
    id: "c3", postSlug: "designing-for-trust",
    author: "Tom Bradley", avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=80&q=80",
    body: "The friction asymmetry point hit hard. I've been guilty of designing exactly this — making it easy to sign up and hard to leave. Going to audit our onboarding flow this week.",
    publishedAt: "2026-04-10T15:45:00Z", likes: 47,
  },
  {
    id: "c4", postSlug: "designing-for-trust",
    author: "Maria Santos", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&q=80",
    body: "I've been saying this for years. Trust is the product. Everything else is implementation detail. Sharing this with my entire team.",
    publishedAt: "2026-04-11T08:20:00Z", likes: 62,
  },
  {
    id: "c5", postSlug: "the-longevity-paradox",
    author: "David Park", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&q=80",
    body: "As someone who works in geriatric medicine, this resonates deeply. The compression of morbidity concept is exactly what we should be optimising for, but our healthcare system isn't built for it.",
    publishedAt: "2026-04-08T12:00:00Z", likes: 89,
  },
];

export function getCommentsForPost(slug: string): Comment[] {
  return mockComments.filter((c) => c.postSlug === slug);
}

export function getPostsByAuthor(authorSlug: string): BlogPost[] {
  return blogPosts.filter((p) => p.author.slug === authorSlug);
}

export function getFeaturedPosts(): BlogPost[] {
  return blogPosts.filter((p) => p.featured);
}

export function getRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  return blogPosts
    .filter((p) => p.slug !== post.slug && (
      p.category === post.category ||
      p.tags.some((t) => post.tags.includes(t))
    ))
    .slice(0, limit);
}
