/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    serverComponentsExternalPackages: ['openai']
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_BASE_URL: process.env.OPENAI_BASE_URL,
  },
  // Netlify için gerekli
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // API route timeout
  api: {
    responseLimit: false,
    bodyParser: {
      sizeLimit: '10mb',
    },
  }
}

module.exports = nextConfig