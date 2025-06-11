// @ts-nocheck

import { createSeedClient } from '@snaplet/seed'
import bcrypt from 'bcryptjs'
import { connect } from 'http2'

const main = async () => {
  const seed = await createSeedClient({ dryRun: true })

  await seed.$resetDatabase()

  const user = await seed.users([
    {
      instance_id: '00000000-0000-0000-0000-000000000000',
      aud: 'authenticated',
      role: 'authenticated',
      email: 'darek@subpopular.dev',
      encrypted_password: await bcrypt.hash('test123', 10),
      raw_user_meta_data: {
        full_name: 'Darek Rossman',
      },
      raw_app_meta_data: { provider: 'email', providers: ['email'] },
      banned_until: null,
      last_sign_in_at: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
      confirmation_token: '',
      confirmation_sent_at: null,

      projects: [
        {
          brands: [
            {
              name: 'The Singular Vault',
              tagline: 'Uncommon Finds for Uncommon Tastes',
              mission:
                'To curate and deliver the world’s most extraordinary oddities and treasures, offering an unparalleled experience for those who seek the truly unique.',
              vision:
                'To be the global destination for the rare, the remarkable, and the unattainable—where individuality is celebrated and every acquisition is a story.',
              values: ['Creativity', 'Wonder', 'Authenticity'],
              target_age_range: '28-55',
              target_income: 'Ultra-high net worth',
              target_education: 'Highly educated, often with advanced degrees',
              target_location: 'International, urban and cosmopolitan centers',
              target_lifestyle:
                'Cultured, well-traveled, and socially connected; values exclusivity and self-expression.',
              target_interests: [
                'Art collecting',
                'Interior design',
                'Philanthropy',
                'Travel',
                'Fine dining',
              ],
              target_values: ['Individuality', 'Discovery', 'Sophistication'],
              target_personality_traits: ['Curious', 'Discerning', 'Adventurous'],
              target_pain_points: [
                'Difficulty finding truly unique, conversation-worthy pieces',
                'Desire for exclusivity and items not available to the public',
                'Need for privacy and discretion in high-value transactions',
              ],
              target_needs: [
                'Access to rare and bespoke treasures',
                'Personalized sourcing and curation',
                'Seamless, discreet global service',
              ],
              brand_voice: 'Artful, poetic, and enigmatic',
              brand_tone: 'Dreamlike and immersive',
              personality_traits: ['Visionary', 'Imaginative', 'Alluring'],
              communication_style:
                'Expressive, sensory-rich language that sparks fascination',
              brand_archetype: 'The Creator',
              category: 'Luxury oddities and statement treasures',
              differentiation:
                'Custom sourcing, limited-edition collaborations, and a focus on the truly unfindable',
              competitive_advantages: [
                'Ability to procure or create the truly unfindable',
                'Custom sourcing for clients',
                'Limited-edition collaborations',
                'Discreet global shipping',
              ],
              price_point: 'luxury',
              market_position:
                'The definitive source for statement pieces and bespoke oddities',
              logo_description:
                'A minimalist, geometric monogram or wordmark in monochrome, accented with iridescent or holographic details to evoke rarity and intrigue.',
              color_scheme: ['Black', 'White', 'Silver', 'Iridescent/Holographic accent'],
              design_principles: [
                'Minimalism with intrigue',
                'Unexpected juxtapositions',
                'Focus on negative space',
              ],
              typography_primary:
                'Minimalist sans-serif with custom geometric letterforms',
              typography_secondary: 'Clean, modern sans-serif for body text',
              typography_accent: null,
              imagery_style:
                'Surreal, ethereal photography with negative space and unexpected juxtapositions',
              imagery_mood: 'Futuristic, rarefied, and dreamlike',
              imagery_guidelines: [
                'Use monochrome backgrounds with iridescent highlights',
                'Incorporate surreal, otherworldly elements',
                'Maintain a sense of intrigue and exclusivity',
              ],

              catalog: {
                name: 'The Singular Vault Collection',
                description:
                  'A curated catalog of the world’s most extraordinary oddities and statement treasures, designed for the discerning collector who seeks the rare, the remarkable, and the truly unfindable. Each category is a portal to discovery, offering bespoke experiences and unparalleled exclusivity.',
                catalog_id: 'the-singular-vault-collection',
                slug: 'the-singular-vault-collection',
                total_products: 0,
                settings: {},
                status: 'active',

                categories: [
                  {
                    catalog_id: 'the-singular-vault-collection',
                    name: 'Curated Rarities',
                    description:
                      'A selection of one-of-a-kind artifacts and objects, each with a story as unique as its owner. For those who crave the truly unrepeatable.',
                    category_id: 'curated-rarities',
                    slug: 'curated-rarities',
                    parent_category_id: null,
                    sort_order: 0,
                    metadata: {},
                    is_active: true,
                  },
                  {
                    catalog_id: 'the-singular-vault-collection',
                    name: 'Historical Oddities',
                    description:
                      'Rare artifacts and relics with storied pasts, curated for the connoisseur of history and legend.',
                    category_id: 'historical-oddities',
                    slug: 'historical-oddities',
                    parent_category_id: 'curated-rarities',
                    sort_order: 0,
                    is_active: true,
                  },
                  {
                    catalog_id: 'the-singular-vault-collection',
                    name: 'Natural Wonders',
                    description:
                      'Extraordinary minerals, fossils, and organic marvels sourced from the farthest corners of the earth.',
                    category_id: 'natural-wonders',
                    slug: 'natural-wonders',
                    parent_category_id: 'curated-rarities',
                    sort_order: 1,
                    is_active: true,
                  },
                  {
                    catalog_id: 'the-singular-vault-collection',
                    name: 'Cultural Curiosities',
                    description:
                      'Uncommon objects from global traditions, each embodying the spirit of its origin.',
                    category_id: 'cultural-curiosities',
                    slug: 'cultural-curiosities',
                    parent_category_id: 'curated-rarities',
                    sort_order: 2,
                    is_active: true,
                  },
                  {
                    catalog_id: 'the-singular-vault-collection',
                    name: 'Bespoke Commissions',
                    description:
                      'Personalized creations and collaborations, crafted exclusively for the visionary collector who desires the unattainable.',
                    category_id: 'bespoke-commissions',
                    slug: 'bespoke-commissions',
                    parent_category_id: null,
                    sort_order: 1,
                    metadata: {},
                    is_active: true,
                  },
                  {
                    catalog_id: 'the-singular-vault-collection',
                    name: 'Artist Collaborations',
                    description:
                      'Limited-edition works born from partnerships with renowned artists and designers.',
                    category_id: 'artist-collaborations',
                    slug: 'artist-collaborations',
                    parent_category_id: 'bespoke-commissions',
                    sort_order: 0,
                    is_active: true,
                  },
                  {
                    catalog_id: 'the-singular-vault-collection',
                    name: 'Custom Sourcing',
                    description:
                      'A discreet service to locate or create the rarest treasures tailored to your vision.',
                    category_id: 'custom-sourcing',
                    slug: 'custom-sourcing',
                    parent_category_id: 'bespoke-commissions',
                    sort_order: 1,
                    is_active: true,
                  },
                  {
                    catalog_id: 'the-singular-vault-collection',
                    name: 'Personalized Artifacts',
                    description:
                      'Unique pieces crafted to your specifications, ensuring absolute individuality.',
                    category_id: 'personalized-artifacts',
                    slug: 'personalized-artifacts',
                    parent_category_id: 'bespoke-commissions',
                    sort_order: 2,
                    is_active: true,
                  },
                  {
                    catalog_id: 'the-singular-vault-collection',
                    name: 'Statement Décor',
                    description:
                      'Transformative pieces that redefine interiors, blending art, design, and intrigue for the ultimate expression of taste.',
                    category_id: 'statement-decor',
                    slug: 'statement-decor',
                    parent_category_id: null,
                    sort_order: 2,
                    metadata: {},
                    is_active: true,
                  },
                  {
                    catalog_id: 'the-singular-vault-collection',
                    name: 'Sculptural Furnishings',
                    description:
                      'Functional art objects that serve as the centerpiece of any space.',
                    category_id: 'sculptural-furnishings',
                    slug: 'sculptural-furnishings',
                    parent_category_id: 'statement-decor',
                    sort_order: 0,
                    is_active: true,
                  },
                  {
                    catalog_id: 'the-singular-vault-collection',
                    name: 'Illuminated Art',
                    description:
                      'Lighting installations and luminous objects that evoke wonder and conversation.',
                    category_id: 'illuminated-art',
                    slug: 'illuminated-art',
                    parent_category_id: 'statement-decor',
                    sort_order: 1,
                    is_active: true,
                  },
                  {
                    catalog_id: 'the-singular-vault-collection',
                    name: 'Wall Masterpieces',
                    description:
                      'Rare and striking wall art, from surreal photography to avant-garde installations.',
                    category_id: 'wall-masterpieces',
                    slug: 'wall-masterpieces',
                    parent_category_id: 'statement-decor',
                    sort_order: 2,
                    is_active: true,
                  },
                  {
                    catalog_id: 'the-singular-vault-collection',
                    name: 'Wearable Wonders',
                    description:
                      'Adornments and accessories that transcend fashion, each piece a conversation-starter and a testament to individuality.',
                    category_id: 'wearable-wonders',
                    slug: 'wearable-wonders',
                    parent_category_id: null,
                    sort_order: 3,
                    metadata: {},
                    is_active: true,
                  },
                  {
                    catalog_id: 'the-singular-vault-collection',
                    name: 'Artisan Jewelry',
                    description:
                      'Handcrafted, limited-edition jewelry pieces with extraordinary provenance.',
                    category_id: 'artisan-jewelry',
                    slug: 'artisan-jewelry',
                    parent_category_id: 'wearable-wonders',
                    sort_order: 0,
                    is_active: true,
                  },
                  {
                    catalog_id: 'the-singular-vault-collection',
                    name: 'Avant-Garde Accessories',
                    description:
                      'Unexpected, imaginative accessories for those who dare to stand apart.',
                    category_id: 'avant-garde-accessories',
                    slug: 'avant-garde-accessories',
                    parent_category_id: 'wearable-wonders',
                    sort_order: 1,
                    is_active: true,
                  },
                  {
                    catalog_id: 'the-singular-vault-collection',
                    name: 'Collector’s Timepieces',
                    description:
                      'Rare watches and horological marvels for the discerning aficionado.',
                    category_id: 'collectors-timepieces',
                    slug: 'collectors-timepieces',
                    parent_category_id: 'wearable-wonders',
                    sort_order: 2,
                    is_active: true,
                  },
                  {
                    catalog_id: 'the-singular-vault-collection',
                    name: 'Private Vault Services',
                    description:
                      'Exclusive services for the elite collector, ensuring privacy, security, and a seamless experience from acquisition to legacy.',
                    category_id: 'private-vault-services',
                    slug: 'private-vault-services',
                    parent_category_id: null,
                    sort_order: 4,
                    metadata: {},
                    is_active: true,
                  },
                  {
                    catalog_id: 'the-singular-vault-collection',
                    name: 'Discreet Global Shipping',
                    description:
                      'White-glove logistics for secure, confidential delivery anywhere in the world.',
                    category_id: 'discreet-global-shipping',
                    slug: 'discreet-global-shipping',
                    parent_category_id: 'private-vault-services',
                    sort_order: 0,
                    is_active: true,
                  },
                  {
                    catalog_id: 'the-singular-vault-collection',
                    name: 'Collection Management',
                    description:
                      'Expert curation, documentation, and preservation of your singular acquisitions.',
                    category_id: 'collection-management',
                    slug: 'collection-management',
                    parent_category_id: 'private-vault-services',
                    sort_order: 1,
                    is_active: true,
                  },
                  {
                    catalog_id: 'the-singular-vault-collection',
                    name: 'Legacy Consultation',
                    description:
                      'Personalized guidance for building, maintaining, and passing on your collection.',
                    category_id: 'legacy-consultation',
                    slug: 'legacy-consultation',
                    parent_category_id: 'private-vault-services',
                    sort_order: 2,
                    is_active: true,
                  },
                ],
              },
            },
          ],
        },
      ],
    },
  ])

  process.exit()
}

main()
