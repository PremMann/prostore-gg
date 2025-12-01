const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.blob.vercel-storage.com" },
      { protocol: "https", hostname: "blob.vercel-storage.com" },
      // In case you later switch providers, add common hosts here and prune if unneeded:
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "*.s3.amazonaws.com" },
    ],
  },
};

export default nextConfig;
