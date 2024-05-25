const path = require('path');

module.exports = {
  webpack: (config, { isServer }) => {
    config.resolve.alias['@lib'] = path.join(__dirname, 'src/lib');

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }

    return config;
  },
};