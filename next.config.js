const path = require('path');

module.exports = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    config.resolve.alias['@'] = path.join(__dirname, 'src');

    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        os: false,
      };
    }

    config.module.rules.push(
      {
        test: /\.tsx?$/,
        include: [
          path.join(__dirname, 'src/actions/server/form/store/crypt.ts'),
          path.join(__dirname, 'src/actions/server/form/store/reusableStore.ts'),
          path.join(__dirname, 'src/actions/server/form/getFormData.ts'),
          path.join(__dirname, 'src/atoms/helperfooter.ts'),
          path.join(__dirname, 'src/components/Button/index.tsx'),
          path.join(__dirname, 'src/components/Grid/index.tsx'),
          path.join(__dirname, 'src/components/Grid/defaultconfig.tsx'),
          path.join(__dirname, 'src/components/StyledComponent/index.tsx'),
          path.join(__dirname, 'src/components/Typography/index.tsx'),
          path.join(__dirname, 'src/types/button.ts'),
          path.join(__dirname, 'src/types/content/alignment.ts'),
          path.join(__dirname, 'src/types/content/animation.ts'),
          path.join(__dirname, 'src/types/formstore.ts'),
          path.join(__dirname, 'src/types/grid/customgrid.ts'),
          path.join(__dirname, 'src/types/styledcomponent.ts'),
          path.join(__dirname, 'src/types/typography.ts'),
          path.join(__dirname, 'src/styles/palette.ts'),
          path.join(__dirname, 'src/styles/typography.ts'),
        ],
        use: [
          {
            loader: 'next-flight-client-module-loader',
          },
          {
            loader: 'next-swc-loader',
          },
        ],
      },
      {
        test: /\.tsx?$/,
        exclude: [
          path.join(__dirname, 'src/actions/server/form/store/crypt.ts'),
          path.join(__dirname, 'src/actions/server/form/store/reusableStore.ts'),
          path.join(__dirname, 'src/actions/server/form/getFormData.ts'),
          path.join(__dirname, 'src/atoms/helperfooter.ts'),
          path.join(__dirname, 'src/components/Button/index.tsx'),
          path.join(__dirname, 'src/components/Grid/index.tsx'),
          path.join(__dirname, 'src/components/Grid/defaultconfig.tsx'),
          path.join(__dirname, 'src/components/StyledComponent/index.tsx'),
          path.join(__dirname, 'src/components/Typography/index.tsx'),
          path.join(__dirname, 'src/types/button.ts'),
          path.join(__dirname, 'src/types/content/alignment.ts'),
          path.join(__dirname, 'src/types/content/animation.ts'),
          path.join(__dirname, 'src/types/formstore.ts'),
          path.join(__dirname, 'src/types/grid/customgrid.ts'),
          path.join(__dirname, 'src/types/styledcomponent.ts'),
          path.join(__dirname, 'src/types/typography.ts'),
          path.join(__dirname, 'src/styles/palette.ts'),
          path.join(__dirname, 'src/styles/typography.ts'),
        ],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-react', '@babel/preset-typescript'],
            },
          },
        ],
      }
    );

    return config;
  },
};