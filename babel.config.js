module.exports = function (api) {
  api.cache(true);

  const plugins = [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json', '.svg'],
        alias: {
          '@': './src',
          '@assets': './assets',
        },
      },
    ],
  ];

  if (process.env.NODE_ENV !== 'test') {
    plugins.unshift([
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        allowUndefined: true,
      },
    ]);
  }

  return {
    presets: ['module:@react-native/babel-preset'],
    plugins,
  };
};
