const path = require('node:path');

const html = require('html-webpack-plugin');
const css = require('mini-css-extract-plugin');
const fileManager = require('filemanager-webpack-plugin');
const partytown = require('@builder.io/partytown/utils');

const _config = require('./_config.cjs');

const PORT = _config.server.port;

module.exports = () => {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    target: 'browserslist',
    entry: {
      index: getDirectory('src/js/index.js')
    },
    output: {
      path: getDirectory('dist'),
      filename: isProduction ? '[name].[fullhash].js' : '[name].js',
      clean: true
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: '/node_modules/',
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          }
        },
        {
          test: /\.(sass|scss|css)$/i,
          use: [
            {
              loader: css.loader
            },
            'css-loader',
            'sass-loader',
            'postcss-loader'
          ]
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/i,
          loader: 'file-loader',
          options: {
            outputPath: 'assets'
          }
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name][ext][query]'
          }
        },
        {
          test: /\.(glsl|vs|fs|vert|frag)$/i,
          exclude: '/node_modules/',
          use: ['raw-loader', 'glslify-loader']
        }
      ]
    },
    plugins: [
      new html({
        title: `${_config.meta.title}`,
        ogImmage: isProduction ? '/og.jpg' : '/assets/og.jpg',
        icon192: isProduction
          ? '/favicon/favicon-192.webp'
          : '/assets/favicon/favicon-192.webp',
        icon512: isProduction
          ? '/favicon/favicon-512.webp'
          : '/assets/favicon/favicon-512.webp',
        manifest: isProduction ? '/app.webmanifest' : '/assets/app.webmanifest',
        sitemap: isProduction ? '/sitemap.xml' : '/assets/sitemap.xml',
        template: getDirectory('src/index.html'),
        meta: {
          title: _config.meta.title,
          'application-name': _config.meta.title,
          description: _config.meta.description,
          keywords: _config.meta.keywords,
          'og:title': _config.meta.title,
          'og:url': `https://${_config.meta.domain}`,
          'twitter:domain': _config.meta.domain,
          'og:description': _config.meta.description,
          'twitter:title': _config.meta.title,
          'twitter:url': `https://${_config.meta.domain}`,
          'twitter:description': _config.meta.description,
          'apple-mobile-web-app-title': _config.meta.title
        },
        minify: {
          collapseWhitespace: true,
          keepClosingSlash: false,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true
        }
      }),
      new css({
        filename: isProduction ? '[name].[fullhash].css' : '[name].css'
      }),
      new fileManager({
        events: {
          onEnd: [
            {
              copy: [
                {
                  source: getDirectory('src/assets/favicon/**'),
                  destination: 'dist/favicon'
                }
              ]
            },
            {
              copy: [
                {
                  source: getDirectory('src/assets/app.webmanifest'),
                  destination: 'dist/'
                }
              ]
            },
            {
              copy: [
                {
                  source: getDirectory('src/assets/og.jpg'),
                  destination: 'dist/'
                }
              ]
            },
            {
              copy: [
                {
                  source: getDirectory('src/assets/sitemap.xml'),
                  destination: 'dist/'
                }
              ]
            },
            {
              copy: [
                {
                  source: partytown.libDirPath(),
                  destination: 'dist/~partytown'
                }
              ]
            }
          ]
        }
      })
    ],
    optimization: {
      minimize: isProduction
    },
    devServer: {
      static: {
        directory: isProduction ? getDirectory('dist') : getDirectory('src')
      },
      hot: true,
      server: 'http',
      port: PORT,
      historyApiFallback: true
    },
    devtool: isProduction ? false : 'source-map'
  };
};

function getDirectory(directory) {
  return path.resolve(__dirname, directory);
}
