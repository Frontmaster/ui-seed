const path = require('path');
const TsImportPlugin = require('ts-import-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const plugins = [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
		title: 'Caching',
        template: './src/index.html',
        filename: 'index.html'
    }),
	new webpack.HashedModuleIdsPlugin()
];

const rules = [
    {
        test: /\.(tsx?)$/,
        exclude: path.resolve('./node_modules'),
        loader: 'ts-loader',
        options: {
            transpileOnly: true,
            getCustomTransformers: () => ({
                before: [ TsImportPlugin({style: true}) ]
            })
        }
    },
    {
        test: /\.(jpe?g|png|gif)$/,
        loader: 'url-loader',
        options: {
            // Inline files smaller than 10 kB (10240 bytes)
            limit: 10 * 1024,
        }
    },
    {
        test: /\.svg$/,
        loader: 'svg-url-loader',
        options: {
            // Inline files smaller than 10 kB (10240 bytes)
            limit: 10 * 1024,
            // Remove the quotes from the url
            // (they’re unnecessary in most cases)
            noquotes: true,
        },
    },
    {
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: 'image-webpack-loader',
        // This will apply the loader before the other ones
        enforce: 'pre',
    }
];

const config = {
    entry: {
        main: './src/index.tsx'
    },
    output: {
        path: path.resolve('./dist'),
		filename: '[name].[contenthash].js'
    },
    resolve: {
        extensions: ['*', '.js', '.ts', '.tsx']
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
            minSize: 30000,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            cacheGroups: {
                antd: {
                    name: 'antd',
                    test: /[\\/](@?antd?\S*)|(rc-\S+)/,
                    priority: 0,
                    maxSize: 300000,
                    reuseExistingChunk: true,
                    enforce: true
                },
                react: {
                    name: 'react',
                    test: /[\\/]\S*react\S*/,
                    priority: 1,
                    reuseExistingChunk: true,
                    enforce: true
                },
                moment: {
                    name: 'moment',
                    test: /[\\/]moment/,
                    priority: 0,
                    reuseExistingChunk: true,
                    enforce: true
                },
                lodash: {
                    name: 'lodash',
                    test: /[\\/]lodash\S*/,
                    priority: 0,
                    reuseExistingChunk: true,
                    enforce: true
                },
                vendor: {
                    name: 'vendor',
                    // name(module) {
                    //     const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                    //     return `npm.${packageName.replace('@', '')}`;
                    // },
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    reuseExistingChunk: true,
                    enforce: true
                }
            }
        }
    }
};

module.exports = {config, plugins, rules};
