import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https', 
        hostname: '**',
      },
    ],
  },
}

export default withPayload(nextConfig)