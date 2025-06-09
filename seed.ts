// @ts-ignore

import { createSeedClient } from '@snaplet/seed'
import bcrypt from 'bcryptjs'

const main = async () => {
  const seed = await createSeedClient({ dryRun: true })

  // Truncate all tables in the database
  await seed.$resetDatabase()

  await seed.users([
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

      profiles: [
        {
          projects: [
            {
              brands: [
                {
                  product_catalogs: [
                    {
                      categories: (x) =>
                        x(4, {
                          products: (x) => x(10),
                        }),
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ])

  console.log('Database seeded successfully!')

  process.exit()
}

main()
