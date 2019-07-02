const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
    mode: 'development',
    entry: {
        index: './src/index.js',
        search: './src/search.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    watch: true, //webpack感知文件变化，原理是循环遍历文件修改时间是否变化
    watchOptions: {
        ignored: /node_modules/,
        aggregateTimeout: 300,
        poll: 1000 //每秒循环1000次
    },
    module: {
        rules: [{
                test: /\.js$/,
                use: 'babel-loader'
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader', //node执行顺序是从右到左，因此先执行cssloader 然后再将解析好的css执行style将样式通过style标签放到header里
                    'css-loader',
                    'sass-loader'
                ]
            },
            // {
            //     test: /\.(png|jpg|jpeg|gif)$/,
            //     use: 'file-loader'
            // },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        options: {
                            limit: 10240 //10k以下图片会处理成base64
                        }
                    }
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
                use: 'file-loader'
            }
            // { test: /\.txt$/, use: 'raw-loader' }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin()

        // new HtmlWebpackPlugin({ template: './src/index.html' })
    ],
    devServer: {
        contentBase: './dist',
        hot: true
    }
}