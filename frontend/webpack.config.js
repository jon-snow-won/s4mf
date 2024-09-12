const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')
const CopyPlugin = require('copy-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const packageJson = require('./package.json')
const deps = packageJson.dependencies

const BASE_URL = process.env.BASE_URL || '/'
const injectEnvJs = () => {
    if (process.env.DEPLOY_STAGE === 'k8s') {
        return `<script src="${BASE_URL}env.js"></script>`
    } else {
        return null
    }
}

const proxyDmp = require('./conf/webpack/proxy-dev-dmp')
const proxyDtp = require('./conf/webpack/proxy-dev-dtp')

const webpack = require('webpack')

const paths = {
    entry: path.resolve(__dirname, 'src', 'index.tsx'),
    build: path.resolve(__dirname, 'build'),
    src: path.resolve(__dirname, 'src'),
    assets: path.resolve(__dirname, 'src/assets'),
    config: path.resolve(__dirname, 'src/config'),
    components: path.resolve(__dirname, 'src/components'),
    hooks: path.resolve(__dirname, 'src/hooks'),
    layouts: path.resolve(__dirname, 'src/layouts'),
    pages: path.resolve(__dirname, 'src/pages'),
    providers: path.resolve(__dirname, 'src/providers'),
    services: path.resolve(__dirname, 'src/services'),
    utils: path.resolve(__dirname, 'src/utils'),
}

module.exports = (env) => {
    const environment = env.environment
    const isDmp = environment === 'dmp'
    const isDtp = environment === 'dtp'

    const getDotEnvFilePath = () => {
        if (isDmp) {
            return path.resolve(__dirname, '.env-dmp')
        }

        if (isDtp) {
            return path.resolve(__dirname, '.env-dtp')
        }

        return undefined
    }

    return {
        entry: './src/index.ts',
        output: {
            publicPath: 'auto',
            clean: true,
            filename: '[name].[chunkhash].js',
            chunkFilename: '[name].[chunkhash].js',
            path: path.resolve(__dirname, 'build'),
        },
        devServer: {
            proxy: isDmp ? proxyDmp : proxyDtp,
            port: 3009,
            historyApiFallback: true,
            headers: {
                //'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
                'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
            },
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.css$/i,
                    use: ['style-loader', 'css-loader'],
                },
                {
                    test: /\.(eot|ttf|woff(2)?)(\?[a-z0-9]+)?$/,
                    type: 'asset/resource',
                    generator: {
                        filename: 'fonts/[hash][ext][query]',
                    },
                },
                {
                    // Assets loader
                    test: /\.(gif|jpe?g|tiff|png|webp|bmp|svg)$/i,
                    type: 'asset',
                    generator: {
                        filename: 'assets/[hash][ext][query]',
                    },
                },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
            preferAbsolute: true,
            mainFiles: ['index'],
            modules: [paths.src, 'node_modules'],
            alias: {
                '@src': paths.src,
                '@assets': paths.assets,
                '@config': paths.config,
                '@components': paths.components,
                '@hooks': paths.hooks,
                '@layouts': paths.layouts,
                '@pages': paths.pages,
                '@providers': paths.providers,
                '@services': paths.services,
                '@utils': paths.utils,
            },
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.reactAppVersion': JSON.stringify(packageJson['version'] || ''),
                'process.env.reactAppName': JSON.stringify(packageJson['name'] || ''),
                'process.env.environment': environment ? JSON.stringify(environment) : undefined,
            }),
            new ModuleFederationPlugin({
                name: 'federalAppRemotes',
                filename: 'federal-app-remotes.js',
                exposes: {
                    './index': './src/remotes/index',
                },
                shared: [
                    {
                        ...deps,
                        react: {
                            singleton: true,
                            requiredVersion: deps.react,
                            eager: true,
                        },
                        'react-dom': {
                            singleton: true,
                            requiredVersion: deps['react-dom'],
                            eager: true,
                        },
                        'react-router-dom': {
                            singleton: true,
                        },
                    },
                    './src/remotes/index',
                ],
            }),
            new HtmlWebPackPlugin({
                template: './src/index.html',
                publicPath: BASE_URL,
                filename: 'index.html',
                inject: 'body',
                excludeChunks: ['federalAppRemotes'],
                custom: injectEnvJs(),
                favicon: './public/favicon.svg',
            }),
            new CopyPlugin({
                patterns: [
                    {
                        from: 'public',
                        to: 'public',
                    },
                ],
            }),
            new Dotenv({
                path: getDotEnvFilePath(),
                systemvars: true,
            }),
        ],
        optimization: {
            runtimeChunk: false,
        },
        devtool: 'source-map',
    }
}
