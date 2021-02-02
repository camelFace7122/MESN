const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserWebpackPlugin = require("terser-webpack-plugin")
const autoprefixer = require('autoprefixer')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev
const target = isDev ? 'web' : 'browserslist'

const cssLoaders = (loader) => {
    let loaders = [
        MiniCssExtractPlugin.loader,
        'css-loader',
        {
            loader: 'postcss-loader',
            options: {
                postcssOptions: {
                    plugins: [
                        autoprefixer()
                    ],
                }
            }
        },
    ]

    if (loader) loaders.push(loader)
    return loaders
}

module.exports = {
    target: target,
    mode: isDev ? 'development' : 'production',
    entry: {
        main: path.resolve(__dirname, 'src/index.js')
    },
    output: {
        filename: `[name].js`,
        path: path.resolve(__dirname, 'public'),
        publicPath: '/'
    },
    resolve: {
        alias: {
            '@styles': path.resolve(__dirname, 'src/styles/')
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),
    ],
    optimization: {
        splitChunks: {
            chunks: 'all'
        },
        minimize: isProd,
        minimizer: [
            new TerserWebpackPlugin()
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        port: 4000,
        open: isDev,
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env']
                        ],
                        plugins: ['@babel/plugin-proposal-class-properties']
                    }
                }
            },
            {
                test: /\.css?$/,
                use: cssLoaders()
            },
            {
                test: /\.s(c|a)ss?$/,
                use: cssLoaders('sass-loader')
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                loader: 'file-loader',
                options: {
                    name() {
                        return '[name].[ext]'
                    },
                },
            },
        ]
    },
    devtool: isDev ? "source-map" : false
}