var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers');

// D:/workspace/Angular2/angular-form/
// ./src/
const testFolder = 'D:/workspace/Angular2/angular-form/';
const fs = require('fs');
var path = require('path');
var entry = {};


(function getEntries() {
    var entries = getFiles(testFolder);
    var index = undefined;
    var lastIndex = undefined;

    if (entries) {
        entries.forEach(function (filePathName) {
            index = filePathName.lastIndexOf('/') + 1;
            lastIndex = filePathName.lastIndexOf('.');
            title = filePathName.substr(index, lastIndex - index);
            entry[title] = filePathName;
        });

        console.log(entry);

    }
})();

function getFiles(dir, files_) {
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files) {
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory() && name.indexOf('node_modules')===-1) {
            getFiles(name, files_);
        } else {
            if (path.extname(name) == ".ts") {
                name = name.replace("//", "/");
                files_.push(name);
            }
        }
    }
    return files_;
}


module.exports = {
    // entry: {
    //   'polyfills': './src/polyfills.ts',
    //   'vendor': './src/vendor.ts',
    //   'app': './src/main.ts'
    // },
    entry:entry,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '../js/[name].js'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                loaders: [
                    {
                        loader: 'awesome-typescript-loader',
                        options: {configFileName: helpers.root('src', 'tsconfig.json')}
                    }, 'angular2-template-loader'
                ]
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'file-loader?name=assets/[name].[hash].[ext]'
            },
            {
                test: /\.css$/,
                exclude: helpers.root('src', 'app'),
                loader: ExtractTextPlugin.extract({fallbackLoader: 'style-loader', loader: 'css-loader?sourceMap'})
            },
            {
                test: /\.css$/,
                include: helpers.root('src', 'app'),
                loader: 'raw-loader'
            }
        ]
    },

    plugins: [
        // Workaround for angular/angular#11580
        new webpack.ContextReplacementPlugin(
            // The (\\|\/) piece accounts for path separators in *nix and Windows
            /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
            helpers.root('./src'), // location of your src
            {} // a map of your routes
        ),

        new webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'vendor', 'polyfills']
        }),

        new HtmlWebpackPlugin({
            template: 'src/index.html'
        })
    ]
};

