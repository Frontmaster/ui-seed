const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsImportPlugin = require('ts-import-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const config = {
    entry: './src/index.tsx',
    output: {
        path: path.resolve('../dist'),
        filename: '[name].bundle.js',
    },
    resolve: {
        extensions: ['*', '.js', '.ts', '.tsx']
    },
    module: {
        rules: [
            {
                test: /\.(tsx?)$/,
                exclude: path.resolve('../node_modules'),
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
        ]
    },
    plugins: [
        // new MiniCssExtractPlugin({
        //     filename: '[contenthash].css'
        // }),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html'
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                antd: {
                    test: /[\\/](@?antd\S*)/,
                    name: 'antd',
                    chunks: 'all',
                    priority: 1,
                    enforce: true
                },
                react: {
                    test: /[\\/]\S*react\S*/,
                    name: 'react',
                    chunks: 'all',
                    priority: 1,
                    enforce: true
                },
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all',
                    priority: -1,
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
    },
    devServer: {
        contentBase: './dist',
        port: 9000,
        host: 'localhost',
        hot: true,
        open: true
    }
};

module.exports = config;
