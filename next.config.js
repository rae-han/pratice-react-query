/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compileOption: {
    paths: {
      "@/typing/*": "typing/*"
    }
  }
}

module.exports = nextConfig
