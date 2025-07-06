/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  reactStrictMode: true,
  // output: 'export', // ***ลบบรรทัดนี้ออก หรือ comment ไว้***
  // ...config อื่นๆ ของคุณ...
};

module.exports = withPWA(nextConfig);