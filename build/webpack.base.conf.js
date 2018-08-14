var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
var webpack = require("webpack");


var autoprefixer = require('autoprefixer')
//var autoprefixerConf = autoprefixer({ browsers: ['last 2 versions','Android >= 4.0','iOS >= 6'] });*/
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: {
    // "vendor": [resolve('../javascripts/cocheer-common.js')],
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production' ?
      config.build.assetsPublicPath : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json', '.css', '.less' , 'jsx'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      '#': resolve('..')
    }
  },
  module: {
    rules: [{
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')],
        options: {
                  'presets': ['es2015','latest']
              }
      },
      {test: /.less$/, use: ['style-loader', 'css-loader', 'less-loader']},
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp3)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          name: utils.assetsPath('audio/[name].[hash:7].[ext]')
        }
      },
    ],
    //postcss: [autoprefixerConf]
  },
  externals: {
        'PCMBuilder': 'PCMBuilder',
        'SampleRate': 'SampleRate',
        'FrequencyRangeTag': 'FrequencyRangeTag'
  },
  plugins: [
    new webpack.ProvidePlugin({
      // $: resolve('../javascripts/jquery-2.1.4.js'),
      // jQuery: resolve('../javascripts/jquery-2.1.4.js'),
      // jquery: resolve('../javascripts/jquery-2.1.4.js'),
      // "window.jquery": resolve('../javascripts/jquery-2.1.4.js'),
      // "window.jQuery": resolve('../javascripts/jquery-2.1.4.js'),
    }),

    // new webpack.optimize.CommonsChunkPlugin({
    //     names: ["vendor"],
    //     minChunks: Infinity
    // })
  ]
}
