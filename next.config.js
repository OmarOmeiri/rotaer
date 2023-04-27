/* eslint-disable */
const webpack = require('webpack');
const path = require('path');
const dotenv = require('dotenv');

const { parsed: myEnv } = dotenv.config({ path: '.env' });

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'css')],
  },
  compiler: {
    styledComponents: true,
  },
  env: myEnv,
  experimental: {
    appDir: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      type: 'asset',
      resourceQuery: /url/,
    });

    config.module.rules.push({
      test: /\.svg$/,
      resourceQuery: { not: [/url/] },
      use: ['@svgr/webpack'],
    });

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };

    return config;
  },
  // async headers() {
  //   return [
  //     {
  //       source: "/api/:path*",
  //       headers: [
  //         { key: "Access-Control-Allow-Credentials", value: "true" },
  //         { key: "Access-Control-Allow-Origin", value: "https://www.rotaer.com" },
  //         { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
  //         { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
  //       ]
  //     }
  //   ]
  // }
}

module.exports = nextConfig
