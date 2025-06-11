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
        protocol: 'https',
        hostname: 'stz3fsqejwncfcjx.public.blob.vercel-storage.com',
      },
    ],
  },
}
