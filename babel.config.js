module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      'react-native-reanimated/plugin',
      ['@babel/plugin-transform-private-methods', { loose: true }],
      ['@babel/plugin-transform-class-properties', { loose: true }],
      ['@babel/plugin-transform-private-property-in-object', { loose: true }]
    ],
  };
};

// presets: ['module:metro-react-native-babel-preset'],
// plugins: ['react-native-reanimated/plugin'],
// plugins: ['@babel/plugin-transform-private-methods'], //for android