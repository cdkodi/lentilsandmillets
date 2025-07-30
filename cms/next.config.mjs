/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['pg']
  },
  env: {
    CUSTOM_KEY: 'my_value',
  },
  async rewrites() {
    return [
      {
        source: '/cms/:path*',
        destination: '/admin-panel/:path*'
      }
    ]
  }
}

export default nextConfig