module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
          alias: {
            '@/assets': './src/assets',
            '@/components': './src/components',
            '@/constants': './src/constants',
            '@/hooks': './src/hooks',
            '@/navigation': './src/navigation',
            '@/screens': './src/screens',
            '@/services': './src/services',
            '@/store': './src/store',
          },
        },
      ],
    ],
  };
};