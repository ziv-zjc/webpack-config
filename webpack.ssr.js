const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const glob = require('glob')
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')

const setMPA = () => {
    const entry = {}
    const htmlWebpackPlugins = []
    const entryFiles = glob.sync(path.join(__dirname, './src/*/index-server.js'))

    Object.keys(entryFiles)
        .map((index) => {
            const entryFile = entryFiles[index]
            const match = entryFile.match(/src\/(.*)\/index-server\.js/)
            const pageName = match && match[1]

            if (pageName) {  //有ssr文件 则添加入口 
                entry[pageName] = entryFile
                htmlWebpackPlugins.push(
                    new HtmlWebpackPlugin({ //html压缩，可以配置多个
                        template: path.join(__dirname, `src/${pageName}/index.html`), //模板所在位置 可以使用ejs语法
                        filename: `${pageName}.html`, //指定打包出来文件名称
                        chunks: ['vendors', 'commons', pageName], //指定生成的html要使用哪些chunk；设置inject为true时，打包后生成的css、js会自动注入到html中
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
            }


        })
    console.log('entryFiles', entryFiles)
    return {
        entry,
        htmlWebpackPlugins
    }
}

const { entry, htmlWebpackPlugins } = setMPA()

module.exports = {
    mode: 'none', //1.设置为none不开启tree-shaking； 
    entry: entry,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name]-server.js', //ssr 不需要hash
        libraryTarget: 'umd'
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: [
                'babel-loader',
                'eslint-loader'
            ]
        },
        {
            test: /\.scss$/,
            use: [

                MiniCssExtractPlugin.loader, //style-loader与此loader不能同时使用  此load可以将css分离成单独文件
                // 'style-loader', //node执行顺序是从右到左，因此先执行cssloader 然后再将解析好的css执行style将样式通过style标签放到header里
                'css-loader',
                'sass-loader',
                {
                    loader: 'postcss-loader', //css后置处理配置
                    options: {
                        plugins: () => [
                            require('autoprefixer')({ //webpack 自动补齐浏览器前缀
                                overrideBrowserslist: ['last 2 version', '>1%', 'ios 7'] //设置浏览器兼容版本 浏览器使用人数比例
                            })
                        ]
                    }
                },
                {
                    loader: 'px2rem-loader',
                    options: {
                        remUnit: 75, //rem相对px的单位 1rem=75px
                        remPrecision: 8 //转换成rem后小数点位数
                    }
                }
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
        {
            test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
            use: {
                loader: 'file-loader',
                options: {
                    name: '[name]_[hash:8].[ext]'
                }
            }
        }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({ //css文件指纹
            filename: '[name]_[contenthash:8].css'
        }),
        new OptimizeCssAssetsPlugin({ //css压缩 同时依赖 cssnano进行预处理
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano')
        }),

        new CleanWebpackPlugin(), //清理构建目录产物
        new webpack.optimize.ModuleConcatenationPlugin(), //开启scope hoisting 当mode设置成production时 默认开启
        // new HtmlWebpackPlugin({ //html压缩，可以配置多个
        //     template: path.join(__dirname, 'src/search.html'), //模板所在位置 可以使用ejs语法
        //     filename: 'search.html', //指定打包出来文件名称
        //     chunks: ['search'], //指定生成的html要使用哪些chunk；设置inject为true时，打包后生成的css、js会自动注入到html中
        //     inject: true,
        //     minify: {
        //         html5: true,
        //         collapseWhitespace: true,
        //         preserveLineBreaks: false,
        //         minifyCSS: true,
        //         minifyJS: true,
        //         removeComments: false
        //     }

        // }),
        // new HtmlWebpackExternalsPlugin({ //提取公共资源
        //     externals: [{
        //             module: 'react',
        //             entry: '', //本地路径 或者 cdn url
        //             global: 'React'
        //         },
        //         {
        //             module: 'react-dom',
        //             entry: '', //本地路径 或者 cdn url
        //             global: 'ReactDOM'
        //         }
        //     ]
        // })
        // new HtmlWebpackPlugin({ template: './src/index.html' })

    ].concat(htmlWebpackPlugins),
    // optimization: {  //提取基础包
    //     splitChunks: {
    //         cacheGroups: {
    //             commons: {
    //                 test: /(react|react-dom)/,
    //                 name: 'vendors',
    //                 chunks: 'all'
    //             }
    //         }
    //     }
    // },
    optimization: { //提取公共部分
        splitChunks: {
            minSize: 0,
            cacheGroups: {
                // basisChunks: {
                //     test: /(react|react-dom)/,
                //     name: 'vendors',
                //     chunks: 'all'
                // },
                commons: {
                    name: 'commons',
                    chunks: 'all',
                    minChunks: 2
                }
            }
        }
    },
    devtool: 'source-map'
}