const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@border-radius-base': '1rem',
              '@btn-border-radius-base': '0.334rem',
              '@card-padding-base': '1rem',
              '@primary-color': '#9254de',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
