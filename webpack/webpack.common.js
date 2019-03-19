const path = require('path');
const TsImportPlugin = require('ts-import-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const plugins = [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html'
    })
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
        app: './src/index.tsx'
    },
    output: {
        path: path.resolve('./dist'),
        filename: '[name].bundle.js',
        chunkFilename: '[name].bundle.js',
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
            name: true,
            cacheGroups: {
                antd: {
                    name: 'antd',
                    test: /[\\/](@?antd?\S*)|(rc-\S+)/,
                    priority: 1,
                    enforce: true
                },
                react: {
                    name: 'react',
                    test: /[\\/]\S*react\S*/,
                    priority: 1,
                    enforce: true
                },
                vendor: {
                    name: 'vendor',
                    // name(module) {
                    //     const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                    //     return `npm.${packageName.replace('@', '')}`;
                    // },
                    test: /[\\/]node_modules[\\/]/,
                    priority: -1,
                    reuseExistingChunk: true,
                    enforce: true
                }
            }
        },
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    }
};

module.exports = {config, plugins, rules};
