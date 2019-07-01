const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    mode: 'production',
    entry: {
        index: './src/index.js',
        search: './src/search.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name]_[chunkhhash:8].js'
    },
    module: {
        rules: [{
                test: /\.js$/,
                use: 'babel-loader'
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader, //style-loader与此loader不能同时使用
                    // 'style-loader', //node执行顺序是从右到左，因此先执行cssloader 然后再将解析好的css执行style将样式通过style标签放到header里
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name]_[hash:8].[ext]'
                    }
                }

            },
            // {
            //     test: /\.(png|jpg|jpeg|gif)$/,
            //     use: {
            //         loader: 'url-loader',
            //         options: {
            //             limit: 10240 //10k以下图片会处理成base64
            //         }
            //     }
            // },
            {
                test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name]_[hash:8].[ext]'
                    }
                }
            }
            // { test: /\.txt$/, use: 'raw-loader' }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name]_[contenthash:8].css'
        })
        // new HtmlWebpackPlugin({ template: './src/index.html' })
    ],
}