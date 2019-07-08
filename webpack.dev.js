const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const setMPA = () => {
    const entry = {}
    const htmlWebpackPlugins = []
    const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'))

    Object.keys(entryFiles)
        .map((index) => {
            const entryFile = entryFiles[index]
            const match = entryFile.match(/src\/(.*)\/index\.js/)
            const pageName = match && match[1]
            entry[pageName] = entryFile
            htmlWebpackPlugins.push(
                new HtmlWebpackPlugin({ //html压缩，可以配置多个
                    template: path.join(__dirname, `src/${pageName}/index.html`), //模板所在位置 可以使用ejs语法
                    filename: `${pageName}.html`, //指定打包出来文件名称
                    chunks: [pageName], //指定生成的html要使用哪些chunk；设置inject为true时，打包后生成的css、js会自动注入到html中
                    inject: true,
                    minify: {
                        html5: true,
                        collapseWhitespace: true,
                        preserveLineBreaks: false,
                        minifyCSS: true,
                        minifyJS: true,
                        removeComments: false
                    }

                })
            )
        })
    console.log('entryFiles', entryFiles)
    return {
        entry,
        htmlWebpackPlugins
    }
}

const { entry, htmlWebpackPlugins } = setMPA()

module.exports = {
    mode: 'development',
    entry: entry,
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
    ].concat(htmlWebpackPlugins),
    devServer: {
        contentBase: './dist',
        hot: true
    },
    devtool: 'source-map'
}