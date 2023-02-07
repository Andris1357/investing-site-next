/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async exportPathMap() {
    return {
      '/': { page: '/trade' },
    }
  },

  async redirects() {
    return [
      {
        source: '/',
        destination: '/trade',
        permanent: true,
      },
    ]
  }
}

module.exports = nextConfig
