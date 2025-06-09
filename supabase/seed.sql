INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    invited_at,
    confirmation_token,
    confirmation_sent_at,
    recovery_token,
    recovery_sent_at,
    email_change_token_new,
    email_change,
    email_change_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    phone,
    phone_confirmed_at,
    phone_change,
    phone_change_token,
    phone_change_sent_at,
    email_change_token_current,
    email_change_confirm_status,
    banned_until,
    reauthentication_token,
    reauthentication_sent_at,
    is_sso_user,
    deleted_at,
    is_anonymous
  )
VALUES (
    '00000000-0000-0000-0000-000000000000',
    '0f5d546a-dd80-5406-a005-a4f3061b9fb4',
    'authenticated',
    'authenticated',
    'darek@subpopular.dev',
    '$2b$10$2rufQim8MH2opGHzFU3NK.16tJwCV3kurR3Oz6mc9aV8scI0UC6sO',
    '2020-02-10T13:34:50.000Z',
    '2020-03-07T03:00:57.000Z',
    '',
    NULL,
    'Graecistius ab esse verum libervi, periis sit vire vitamicar voluptatem atione fortibus eo.',
    '2020-01-09T00:49:11.000Z',
    'Concere ego nihil intellegan intera.',
    'nicole.smith@workplace.com',
    '2020-10-02T09:19:38.000Z',
    '2025-06-09T14:57:10.957Z',
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Darek Rossman"}',
    't',
    '2025-06-09T14:57:10.957Z',
    '2025-06-09T14:57:10.957Z',
    DEFAULT,
    '2020-03-11T02:53:19.000Z',
    DEFAULT,
    DEFAULT,
    '2020-12-24T11:30:02.000Z',
    DEFAULT,
    DEFAULT,
    NULL,
    DEFAULT,
    '2020-06-26T17:49:35.000Z',
    DEFAULT,
    '2020-03-23T14:25:27.000Z',
    DEFAULT
  );
INSERT INTO public.profiles (
    id,
    updated_at,
    username,
    full_name,
    avatar_url,
    website
  )
VALUES (
    '0f5d546a-dd80-5406-a005-a4f3061b9fb4',
    '2020-11-03T22:19:57.000Z',
    'Ilesse ant omnesciunt eli vestrae nulla tamendarum civium.',
    'Natalie Hill',
    'https://example.com/avatar12.jpg',
    'https://www.charityorganization.org/donate'
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.projects (
    id,
    user_id,
    name,
    description,
    status,
    settings,
    created_at,
    updated_at
  ) OVERRIDING SYSTEM VALUE
VALUES (
    1,
    '0f5d546a-dd80-5406-a005-a4f3061b9fb4',
    'AccessControlSystem',
    'Creating automated audit trails for regulatory compliance',
    'completed',
    DEFAULT,
    DEFAULT,
    DEFAULT
  );
INSERT INTO public.brands (
    id,
    project_id,
    name,
    tagline,
    mission,
    vision,
    values,
    target_market,
    brand_personality,
    positioning,
    visual_identity,
    status,
    created_at,
    updated_at
  ) OVERRIDING SYSTEM VALUE
VALUES (
    1,
    1,
    'H&M',
    'Just Do It',
    'Our brand is committed to promoting healthy living and wellness practices for all ages.',
    'Creating a more inclusive and accessible world for all',
    DEFAULT,
    DEFAULT,
    DEFAULT,
    DEFAULT,
    DEFAULT,
    'draft',
    DEFAULT,
    DEFAULT
  );
INSERT INTO public.product_catalogs (
    id,
    brand_id,
    name,
    description,
    slug,
    total_products,
    settings,
    status,
    created_at,
    updated_at
  ) OVERRIDING SYSTEM VALUE
VALUES (
    1,
    1,
    'Fitbit Versa 3',
    'Shop from our summer catalog for chic swimwear and beach accessories.',
    'Et scaevolum et obligant disserentin, opus spernatural nec voluptate il ipsa necest.',
    DEFAULT,
    DEFAULT,
    'archived',
    DEFAULT,
    DEFAULT
  );
INSERT INTO public.products (
    id,
    catalog_id,
    name,
    description,
    tags,
    status,
    sort_order,
    created_at,
    updated_at,
    category_id,
    attributes,
    min_price,
    max_price,
    total_inventory,
    meta_title,
    meta_description
  ) OVERRIDING SYSTEM VALUE
VALUES (
    1,
    1,
    'Digital Camera',
    'Elegant and durable stainless steel cookware set for all your culinary adventures.',
    DEFAULT,
    'archived',
    DEFAULT,
    DEFAULT,
    DEFAULT,
    NULL,
    DEFAULT,
    1.6311388850026811,
    8.920759328515906,
    DEFAULT,
    'Handcrafted Leather Wallet - Brown',
    'Create a cozy and inviting atmosphere with our home decor'
  ),
  (
    2,
    1,
    'Headphones',
    'Immerse yourself in stunning visuals with this 4K Ultra HD Smart TV.',
    DEFAULT,
    'draft',
    DEFAULT,
    DEFAULT,
    DEFAULT,
    NULL,
    DEFAULT,
    4.203253558427561,
    3.584230198610492,
    DEFAULT,
    'Vintage Record Player - Bluetooth Enabled',
    'Stay organized and stylish with our designer handbags'
  ),
  (
    3,
    1,
    'Smartphone Case',
    'Stay organized and stylish with this leather-bound daily planner.',
    DEFAULT,
    'archived',
    DEFAULT,
    DEFAULT,
    DEFAULT,
    NULL,
    DEFAULT,
    10.383518249881625,
    0.865531388632281,
    DEFAULT,
    'Customizable Engraved Necklace - Silver',
    'Experience ultimate comfort with our orthopedic mattress'
  ),
  (
    4,
    1,
    'Fitness Tracker',
    'Stay organized and stylish with this leather-bound daily planner.',
    DEFAULT,
    'active',
    DEFAULT,
    DEFAULT,
    DEFAULT,
    NULL,
    DEFAULT,
    15.753074085701954,
    12.254265324363189,
    DEFAULT,
    'Best Wireless Headphones for Running - Black',
    'Get cozy with our soft and luxurious bedding sets'
  ),
  (
    5,
    1,
    'Graphic T-Shirt',
    'Versatile and durable hiking boots for outdoor enthusiasts.',
    DEFAULT,
    'archived',
    DEFAULT,
    DEFAULT,
    DEFAULT,
    NULL,
    DEFAULT,
    12.418693357885068,
    14.045345970888393,
    DEFAULT,
    'Artisan Hand-Painted Ceramic Vase - Boho Style',
    'Luxurious spa essentials for a relaxing retreat at home'
  ),
  (
    6,
    1,
    'Graphic T-Shirt',
    'Experience the ultimate relaxation with this plush reclining armchair.',
    DEFAULT,
    'archived',
    DEFAULT,
    DEFAULT,
    DEFAULT,
    NULL,
    DEFAULT,
    7.521308178659726,
    14.51049442687494,
    DEFAULT,
    'Designer Sunglasses - UV Protection',
    'Discover the beauty of handmade artisan products'
  ),
  (
    7,
    1,
    'Digital Camera',
    'Transform your workspace with this sleek and ergonomic office chair.',
    DEFAULT,
    'archived',
    DEFAULT,
    DEFAULT,
    DEFAULT,
    NULL,
    DEFAULT,
    10.590907713161968,
    3.466779485787486,
    DEFAULT,
    'Japanese Matcha Tea Set - Traditional Ceremony',
    'Shop the best in outdoor gear for your next adventure'
  ),
  (
    8,
    1,
    'Graphic T-Shirt',
    'Indulge in the rich flavor of this premium dark chocolate bar.',
    DEFAULT,
    'active',
    DEFAULT,
    DEFAULT,
    DEFAULT,
    NULL,
    DEFAULT,
    7.51476636223541,
    13.608704383062772,
    DEFAULT,
    'Eco-Friendly Bamboo Cutting Board - Large',
    'Elevate your kitchen with our premium cookware sets'
  ),
  (
    9,
    1,
    'Sunglasses',
    'Powerful and efficient vacuum cleaner to keep your home spotless.',
    DEFAULT,
    'draft',
    DEFAULT,
    DEFAULT,
    DEFAULT,
    NULL,
    DEFAULT,
    2.551301316960974,
    7.481953638522243,
    DEFAULT,
    'Premium Stainless Steel Water Bottle - 32 oz',
    'Sustainable and eco-friendly home goods for a greener lifestyle'
  ),
  (
    10,
    1,
    'Fitness Tracker',
    'Enhance your cooking skills with this comprehensive cookbook featuring diverse recipes.',
    DEFAULT,
    'archived',
    DEFAULT,
    DEFAULT,
    DEFAULT,
    NULL,
    DEFAULT,
    7.673476260619256,
    2.0739731480459302,
    DEFAULT,
    'Eco-Friendly Bamboo Cutting Board - Large',
    'Stay organized and stylish with our designer handbags'
  ),
  (
    11,
    1,
    'Coffee Maker',
    'Enhance your cooking skills with this comprehensive cookbook featuring diverse recipes.',
    DEFAULT,
    'active',
    DEFAULT,
    DEFAULT,
    DEFAULT,
    NULL,
    DEFAULT,
    8.762266137869753,
    6.013394658845804,
    DEFAULT,
    'Waterproof Fitness Tracker - Heart Rate Monitor',
    'Luxurious spa essentials for a relaxing retreat at home'
  ),
  (
    12,
    1,
    'Smart Watch',
    'Enhance your cooking skills with this comprehensive cookbook featuring diverse recipes.',
    DEFAULT,
    'draft',
    DEFAULT,
    DEFAULT,
    DEFAULT,
    NULL,
    DEFAULT,
    14.97275620976266,
    2.7158061852717013,
    DEFAULT,
    'Premium Stainless Steel Water Bottle - 32 oz',
    'Create a cozy and inviting atmosphere with our home decor'
  ),
  (
    13,
    1,
    'Smart Watch',
    'Upgrade your gaming experience with this high-performance gaming laptop.',
    DEFAULT,
    'active',
    DEFAULT,
    DEFAULT,
    DEFAULT,
    NULL,
    DEFAULT,
    11.925666752414944,
    5.951139612063385,
    DEFAULT,
    'Luxurious Silk Pillowcases - Set of 2',
    'Transform your living space with our modern furniture designs'
  ),
  (
    14,
    1,
    'Water Bottle',
    'Compact and lightweight camera for capturing all your memorable moments.',
    DEFAULT,
    'archived',
    DEFAULT,
    DEFAULT,
    DEFAULT,
    NULL,
    DEFAULT,
    8.663277234918,
    6.532840496759072,
    DEFAULT,
    'Garden Tool Set with Storage Bag - 8 Piece',
    'Get cozy with our soft and luxurious bedding sets'
  ),
  (
    15,
    1,
    'Power Bank',
    'Experience the perfect blend of comfort and support with this memory foam mattress.',
    DEFAULT,
    'draft',
    DEFAULT,
    DEFAULT,
    DEFAULT,
    NULL,
    DEFAULT,
    9.217921651934578,
    10.308596904840615,
    DEFAULT,
    'Luxurious Silk Pillowcases - Set of 2',
    'Create a cozy and inviting atmosphere with our home decor'
  ),
  (
    16,
    1,
    'Headphones',
    'Immerse yourself in stunning visuals with this 4K Ultra HD Smart TV.',
    DEFAULT,
    'archived',
    DEFAULT,
    DEFAULT,
    DEFAULT,
    NULL,
    DEFAULT,
    4.984285158850846,
    4.3468522216246095,
    DEFAULT,
    'Waterproof Fitness Tracker - Heart Rate Monitor',
    'Get cozy with our soft and luxurious bedding sets'
  ),
  (
    17,
    1,
    'Camping Tent',
    'Effortlessly blend and mix ingredients with this professional-grade blender.',
    DEFAULT,
    'active',
    DEFAULT,
    DEFAULT,
    DEFAULT,
    NULL,
    DEFAULT,
    10.303373718304373,
    11.422034443377433,
    DEFAULT,
    'Artisan Hand-Painted Ceramic Vase - Boho Style',
    'Stay organized and stylish with our designer handbags'
  ),
  (
    18,
    1,
    'Hair Dryer',
    'Pamper yourself with this luxurious spa gift set.',
    DEFAULT,
    'active',
    DEFAULT,
    DEFAULT,
    DEFAULT,
    NULL,
    DEFAULT,
    11.747456567700768,
    4.583745103631249,
    DEFAULT,
    'Waterproof Fitness Tracker - Heart Rate Monitor',
    'Find the perfect statement piece in our jewelry collection'
  ),
  (
    19,
    1,
    'Graphic T-Shirt',
    'Transform your workspace with this sleek and ergonomic office chair.',
    DEFAULT,
    'active',
    DEFAULT,
    DEFAULT,
    DEFAULT,
    NULL,
    DEFAULT,
    0.5776027202790052,
    14.161280442563463,
    DEFAULT,
    'Garden Tool Set with Storage Bag - 8 Piece',
    'Upgrade your tech game with our latest gadgets'
  ),
  (
    20,
    1,
    'Smartphone Case',
    'Stay cozy and warm with this luxurious cashmere sweater.',
    DEFAULT,
    'archived',
    DEFAULT,
    DEFAULT,
    DEFAULT,
    NULL,
    DEFAULT,
    13.306789367856217,
    4.296311139590888,
    DEFAULT,
    'Customizable Engraved Necklace - Silver',
    'Upgrade your tech game with our latest gadgets'
  ),
  (
    21,
    1,
    'Smart Watch',
    'Experience the ultimate relaxation with this plush reclining armchair.',
    DEFAULT,
    'draft',
    DEFAULT,
    DEFAULT,
    DEFAULT,
    NULL,
    DEFAULT,
    4.256232251707268,
    3.5370139202238833,
    DEFAULT,
    'Garden Tool Set with Storage Bag - 8 Piece',
    'Find the perfect statement piece in our jewelry collection'
  ),
  (
    22,
    1,
    'Smart Watch',
    'Add a touch of elegance to your dining table with this fine porcelain dinnerware set.',
    DEFAULT,
    'active',
    DEFAULT,
    DEFAULT,
    DEFAULT,
    NULL,
    DEFAULT,
    14.052207248007965,
    11.280878325274074,
    DEFAULT,
    'Vintage Record Player - Bluetooth Enabled',
    'Get cozy with our soft and luxurious bedding sets'
  ),
  (
    23,
    1,
    'Digital Camera',
    'Effortlessly blend and mix ingredients with this professional-grade blender.',
    DEFAULT,
    'draft',
    DEFAULT,
    DEFAULT,
    DEFAULT,
    NULL,
    DEFAULT,
    7.8848978838310755,
    0.3622013810860381,
    DEFAULT,
    'Best Wireless Headphones for Running - Black',
    'Discover the beauty of handmade artisan products'
  ),
  (
    24,
    1,
    'Yoga Mat',
    'Powerful and efficient vacuum cleaner to keep your home spotless.',
    DEFAULT,
    'archived',
    DEFAULT,
    DEFAULT,
    DEFAULT,
    NULL,
    DEFAULT,
    14.683887253522423,
    2.30106666356976,
    DEFAULT,
    'Japanese Matcha Tea Set - Traditional Ceremony',
    'Discover the latest collection of women''s shoes for every occasion'
  ),
  (
    25,
    1,
    'Coffee Maker',
    'Immerse yourself in stunning visuals with this 4K Ultra HD Smart TV.',
    DEFAULT,
    'archived',
    DEFAULT,
    DEFAULT,
    DEFAULT,
    NULL,
    DEFAULT,
    6.185801554240411,
    11.567938440099272,
    DEFAULT,
    'Eco-Friendly Bamboo Cutting Board - Large',
    'Find the perfect statement piece in our jewelry collection'
  ),
  (
    26,
    1,
    'Graphic T-Shirt',
    'Experience the perfect blend of comfort and support with this memory foam mattress.',
    DEFAULT,
    'draft',
    DEFAULT,
    DEFAULT,
    DEFAULT,
    NULL,
    DEFAULT,
    9.736071869904691,
    2.8078165593178004,
    DEFAULT,
    'Designer Sunglasses - UV Protection',
    'Luxurious spa essentials for a relaxing retreat at home'
  ),
  (
    27,
    1,
    'Wireless Mouse',
    'Achieve salon-worthy hair at home with this professional hair straightener.',
    DEFAULT,
    'active',
    DEFAULT,
    DEFAULT,
    DEFAULT,
    NULL,
    DEFAULT,
    0.27940450615304085,
    4.013701746384544,
    DEFAULT,
    'Minimalist Desk Lamp - Adjustable Brightness',
    'Upgrade your tech game with our latest gadgets'
  ),
  (
    28,
    1,
    'Backpack',
    'Experience the ultimate relaxation with this plush reclining armchair.',
    DEFAULT,
    'active',
    DEFAULT,
    DEFAULT,
    DEFAULT,
    NULL,
    DEFAULT,
    15.335256533611616,
    15.618871482976393,
    DEFAULT,
    'Handcrafted Leather Wallet - Brown',
    'Achieve your fitness goals with our workout equipment'
  ),
  (
    29,
    1,
    'Power Bank',
    'Transform your workspace with this sleek and ergonomic office chair.',
    DEFAULT,
    'draft',
    DEFAULT,
    DEFAULT,
    DEFAULT,
    NULL,
    DEFAULT,
    15.579282914470607,
    13.505352881797707,
    DEFAULT,
    'Minimalist Desk Lamp - Adjustable Brightness',
    'Achieve your fitness goals with our workout equipment'
  ),
  (
    30,
    1,
    'Headphones',
    'Pamper yourself with this luxurious spa gift set.',
    DEFAULT,
    'active',
    DEFAULT,
    DEFAULT,
    DEFAULT,
    NULL,
    DEFAULT,
    4.858971518604098,
    6.940903956942129,
    DEFAULT,
    'Vintage Record Player - Bluetooth Enabled',
    'Find the perfect statement piece in our jewelry collection'
  ),
  (
    31,
    1,
    'Fitness Tracker',
    'Compact and lightweight camera for capturing all your memorable moments.',
    DEFAULT,
    'draft',
    DEFAULT,
    DEFAULT,
    DEFAULT,
    NULL,
    DEFAULT,
    2.0966860984808258,
    11.317272888602897,
    DEFAULT,
    'Organic Cotton T-Shirt - Unisex White',
    'Stay organized and stylish with our designer handbags'
  ),
  (
    32,
    1,
    'Fitness Tracker',
    'A comfortable yet stylish sofa that will enhance any living room decor.',
    DEFAULT,
    'active',
    DEFAULT,
    DEFAULT,
    DEFAULT,
    NULL,
    DEFAULT,
    7.6704481143589485,
    15.69158227559539,
    DEFAULT,
    'Garden Tool Set with Storage Bag - 8 Piece',
    'Find the perfect statement piece in our jewelry collection'
  ),
  (
    33,
    1,
    'Water Bottle',
    'Powerful and efficient vacuum cleaner to keep your home spotless.',
    DEFAULT,
    'active',
    DEFAULT,
    DEFAULT,
    DEFAULT,
    NULL,
    DEFAULT,
    10.283934256586685,
    7.551258457591872,
    DEFAULT,
    'Vintage Record Player - Bluetooth Enabled',
    'Discover the beauty of handmade artisan products'
  ),
  (
    34,
    1,
    'Headphones',
    'Stay organized and stylish with this leather-bound daily planner.',
    DEFAULT,
    'draft',
    DEFAULT,
    DEFAULT,
    DEFAULT,
    NULL,
    DEFAULT,
    5.526822461154501,
    12.621266266481891,
    DEFAULT,
    'Handcrafted Leather Wallet - Brown',
    'Create a cozy and inviting atmosphere with our home decor'
  ),
  (
    35,
    1,
    'Laptop Bag',
    'Powerful and efficient vacuum cleaner to keep your home spotless.',
    DEFAULT,
    'archived',
    DEFAULT,
    DEFAULT,
    DEFAULT,
    NULL,
    DEFAULT,
    1.974264731615387,
    12.85289177578865,
    DEFAULT,
    'Vintage Record Player - Bluetooth Enabled',
    'Stay active with our high-performance athletic wear'
  ),
  (
    36,
    1,
    'Digital Camera',
    'Experience the perfect blend of comfort and support with this memory foam mattress.',
    DEFAULT,
    'archived',
    DEFAULT,
    DEFAULT,
    DEFAULT,
    NULL,
    DEFAULT,
    12.073087667489999,
    7.878228576728612,
    DEFAULT,
    'Japanese Matcha Tea Set - Traditional Ceremony',
    'Trendy and affordable accessories to complete your look'
  ),
  (
    37,
    1,
    'Graphic T-Shirt',
    'Effortlessly blend and mix ingredients with this professional-grade blender.',
    DEFAULT,
    'active',
    DEFAULT,
    DEFAULT,
    DEFAULT,
    NULL,
    DEFAULT,
    3.8948921688296925,
    8.23509568203648,
    DEFAULT,
    'Gourmet Italian Pasta Sauce - Family Size',
    'Achieve your fitness goals with our workout equipment'
  ),
  (
    38,
    1,
    'Smart Watch',
    'Upgrade your gaming experience with this high-performance gaming laptop.',
    DEFAULT,
    'draft',
    DEFAULT,
    DEFAULT,
    DEFAULT,
    NULL,
    DEFAULT,
    12.342810378451267,
    8.364123466072789,
    DEFAULT,
    'Eco-Friendly Bamboo Cutting Board - Large',
    'Transform your living space with our modern furniture designs'
  ),
  (
    39,
    1,
    'Headphones',
    'This sleek and modern laptop is perfect for professionals on the go.',
    DEFAULT,
    'archived',
    DEFAULT,
    DEFAULT,
    DEFAULT,
    NULL,
    DEFAULT,
    11.072455995939347,
    15.940310523337102,
    DEFAULT,
    'Eco-Friendly Bamboo Cutting Board - Large',
    'Transform your living space with our modern furniture designs'
  ),
  (
    40,
    1,
    'Wireless Mouse',
    'Versatile and durable hiking boots for outdoor enthusiasts.',
    DEFAULT,
    'draft',
    DEFAULT,
    DEFAULT,
    DEFAULT,
    NULL,
    DEFAULT,
    9.398467511918916,
    14.383473851120243,
    DEFAULT,
    'Organic Cotton T-Shirt - Unisex White',
    'Achieve your fitness goals with our workout equipment'
  );
INSERT INTO public.categories (
    id,
    name,
    description,
    slug,
    parent_category_id,
    sort_order,
    metadata,
    is_active,
    created_at,
    updated_at,
    catalog_id
  ) OVERRIDING SYSTEM VALUE
VALUES (
    1,
    'Ex putaveret consuevere omnino consentio atum voluptates et, chrysippe non ut nobis odum.',
    'Web Responses for Customer Support',
    'Ista facil successumus ad talem num anim, mortis mihi sed romanimper fieri desida.',
    NULL,
    DEFAULT,
    DEFAULT,
    DEFAULT,
    DEFAULT,
    DEFAULT,
    1
  ),
  (
    2,
    'Parendum es cum expressas et non omnium, eturallic reliqui agatum portarum consuetudit ute ut.',
    'Public Relations and Crisis Management',
    'Exceptur hoc etur voluptates si.',
    NULL,
    DEFAULT,
    DEFAULT,
    DEFAULT,
    DEFAULT,
    DEFAULT,
    1
  ),
  (
    3,
    'O ob quibus iis copullus bonorum, nec es ent eorum quicquam tantum ut quo.',
    'Marketing Campaigns for New Brands',
    'Laudanturpis se multitum voluptates tamensionib proposoper cumbere.',
    NULL,
    DEFAULT,
    DEFAULT,
    DEFAULT,
    DEFAULT,
    DEFAULT,
    1
  ),
  (
    4,
    'Causae cupidque videratig quae tam inum nec, esse migrare ea natur erem aeque contentia.',
    'Social Media Strategies',
    'Quod ut nostram falsi praeterunum delectari.',
    NULL,
    DEFAULT,
    DEFAULT,
    DEFAULT,
    DEFAULT,
    DEFAULT,
    1
  );
UPDATE public.products
SET category_id = 1
WHERE id = 1;
UPDATE public.products
SET category_id = 1
WHERE id = 2;
UPDATE public.products
SET category_id = 1
WHERE id = 3;
UPDATE public.products
SET category_id = 1
WHERE id = 4;
UPDATE public.products
SET category_id = 1
WHERE id = 5;
UPDATE public.products
SET category_id = 1
WHERE id = 6;
UPDATE public.products
SET category_id = 1
WHERE id = 7;
UPDATE public.products
SET category_id = 1
WHERE id = 8;
UPDATE public.products
SET category_id = 1
WHERE id = 9;
UPDATE public.products
SET category_id = 1
WHERE id = 10;
UPDATE public.products
SET category_id = 2
WHERE id = 11;
UPDATE public.products
SET category_id = 2
WHERE id = 12;
UPDATE public.products
SET category_id = 2
WHERE id = 13;
UPDATE public.products
SET category_id = 2
WHERE id = 14;
UPDATE public.products
SET category_id = 2
WHERE id = 15;
UPDATE public.products
SET category_id = 2
WHERE id = 16;
UPDATE public.products
SET category_id = 2
WHERE id = 17;
UPDATE public.products
SET category_id = 2
WHERE id = 18;
UPDATE public.products
SET category_id = 2
WHERE id = 19;
UPDATE public.products
SET category_id = 2
WHERE id = 20;
UPDATE public.products
SET category_id = 3
WHERE id = 21;
UPDATE public.products
SET category_id = 3
WHERE id = 22;
UPDATE public.products
SET category_id = 3
WHERE id = 23;
UPDATE public.products
SET category_id = 3
WHERE id = 24;
UPDATE public.products
SET category_id = 3
WHERE id = 25;
UPDATE public.products
SET category_id = 3
WHERE id = 26;
UPDATE public.products
SET category_id = 3
WHERE id = 27;
UPDATE public.products
SET category_id = 3
WHERE id = 28;
UPDATE public.products
SET category_id = 3
WHERE id = 29;
UPDATE public.products
SET category_id = 3
WHERE id = 30;
UPDATE public.products
SET category_id = 4
WHERE id = 31;
UPDATE public.products
SET category_id = 4
WHERE id = 32;
UPDATE public.products
SET category_id = 4
WHERE id = 33;
UPDATE public.products
SET category_id = 4
WHERE id = 34;
UPDATE public.products
SET category_id = 4
WHERE id = 35;
UPDATE public.products
SET category_id = 4
WHERE id = 36;
UPDATE public.products
SET category_id = 4
WHERE id = 37;
UPDATE public.products
SET category_id = 4
WHERE id = 38;
UPDATE public.products
SET category_id = 4
WHERE id = 39;
UPDATE public.products
SET category_id = 4
WHERE id = 40;
SELECT setval(
    '"public"."projects_id_seq"'::regclass,
    (
      SELECT MAX("id")
      FROM "public"."projects"
    )
  );
SELECT setval(
    '"public"."brands_id_seq"'::regclass,
    (
      SELECT MAX("id")
      FROM "public"."brands"
    )
  );
SELECT setval(
    '"public"."product_catalogs_id_seq"'::regclass,
    (
      SELECT MAX("id")
      FROM "public"."product_catalogs"
    )
  );
SELECT setval(
    '"public"."products_id_seq"'::regclass,
    (
      SELECT MAX("id")
      FROM "public"."products"
    )
  );
SELECT setval(
    '"public"."categories_id_seq"'::regclass,
    (
      SELECT MAX("id")
      FROM "public"."categories"
    )
  );