/** @type {import('next').NextConfig} */
const nextConfig = {
  // The site is now a single page; send the old routes to their sections
  async redirects() {
    return [
      { source: "/about", destination: "/#about", permanent: true },
      { source: "/projects", destination: "/#work", permanent: true },
      { source: "/contact", destination: "/#contact", permanent: true },
    ];
  },
};

export default nextConfig;
