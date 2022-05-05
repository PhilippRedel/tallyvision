const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@btn-border-radius-base': '0.334rem',
              '@btn-text-hover-bg': 'rgba(0, 0, 0, 0.05)',
              '@card-padding-base': '1rem',
              '@card-radius': '1rem',
              '@primary-color': '#9254de',
              '@table-border-radius-base': '1rem',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
