const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
//const CleanWebpackPlugin = require('clean-webpack-plugin');
const copy = require('./build/webpack-copy-plugin/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//handle source version
const pjson = fs.readFileSync('./package.json', 'utf8');
let version = JSON.parse(pjson).version;

for(let arg of process.argv){
    if(arg.indexOf('--version=') !== -1){
        version = arg.replace('--version=', '').trim();
    }
}

const config = {

    entry: {
        'jplist': path.resolve(__dirname, 'src/' + version + '/index.js')
    },
    output: {
        //filename: 'jplist.min.js',
        filename: '[name].min.js',
        path: path.resolve(__dirname, 'dist/' + version)
    },
    mode: 'production', //development, production
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            },
            {
                test: /\.(css|sass|scss)$/,
                use: [
                  MiniCssExtractPlugin.loader,
        
                  {loader: "css-loader", options: {importLoaders: 1}},
                  // {
                  //   loader: 'postcss-loader',
                  //   options: {
                  //     ident: 'postcss',
                  //       plugins: (loader) => [
                  //           require('postcss-import')({ root: loader.resourcePath }),
                  //           require('postcss-cssnext')({warnForDuplicates: false}),
                  //           require('postcss-nested')(),
                  //           require('postcss-simple-vars')(),
                  //           require('autoprefixer')(),
                  //           require('postcss-prettify')(),
                  //           //require('cssnano')({zindex: false})
                  //       ],
                  //     sourceMap: false,
                  //   },
                  // },
                ]
              },
        ]
    },

    //https://webpack.js.org/configuration/devtool/
    devtool: 'source-map',

    plugins: [
        //new CleanWebpackPlugin(['dist']),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production') //development, production
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),

        new copy()
    ],

    //https://webpack.js.org/configuration/stats/
    //stats: 'minimal' //'errors-only'
    stats: {
        entrypoints: false,
        modules: false
    }
};

module.exports = config;