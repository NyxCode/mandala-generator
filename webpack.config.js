const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
   entry: './src/mandala-generator.js',
   output: {
       path: path.resolve(__dirname, 'dist'),
       filename: 'index.js',
   },
   plugins: [
       new CopyWebpackPlugin([
           {from: 'static'}
       ])
   ],
   mode: 'development'
};
