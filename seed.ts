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
            },
          ],
        },
      ],
    },
  ])

  process.exit()
}

main()
