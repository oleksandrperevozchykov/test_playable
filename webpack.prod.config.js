const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/index.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '',
        clean: true,
    },
    externals: {
        'pixi.js': 'PIXI',
        'gsap': '{gsap}'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(png|jpg|jpeg|json|ttf)$/,
                type: "asset/inline"
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js',],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            inject: 'body',
            scriptLoading: 'module',
        }),
        new HtmlInlineScriptPlugin(),
    ],
    devServer: {
        static: './dist',
        port: 8080,
    },
};
