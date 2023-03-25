/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  basePath: process.env.GITHUB_REPOSITORY ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}` : '',
  trailingSlash: true,
  eslint: { ignoreDuringBuilds: true },
    // 追加: Webpack設定をカスタマイズ
    webpack: (config, { isServer }) => {
      if (!isServer) {
        // ブラウザ向けのバンドルにfsモジュールを空のモジュールとして解決させる
        config.resolve.fallback = { ...config.resolve.fallback, fs: false };
      }
  
      return config;
    },
}