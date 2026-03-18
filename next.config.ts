import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  // ESLint'i build sırasında devre dışı bırak
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https' as const,
        hostname: 'yasiralrawi.com',
        pathname: '/**',
      },
    ],
  },
};

export default withNextIntl(nextConfig);