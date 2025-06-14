export default {
  devIndicators: false,
  experimental: {
    serverActions: {
      bodySizeLimit: '3mb',
    },
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'https',
        hostname: 'stz3fsqejwncfcjx.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'nufzsyheqwveuibxibss.supabase.co',
      },
    ],
  },
}
