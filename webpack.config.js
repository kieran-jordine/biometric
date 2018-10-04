const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    //default build uses index.js (src) and create main.js (dist)
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: "development",
    plugins: [new VueLoaderPlugin()],
    module: {
        rules: [
            {test: /\.css$/, use: ['style-loader', 'css-loader']},
            {test: /\.(png|svg|jpe?g|gif)$/, use: ['file-loader']},
            //{test: /\.(csv|tsv)$/, use: ['csv-loader']},
            //{test: /\.xml$/, use: ['xml-loader']},
            {test: /\.vue$/, use: ['vue-loader']}
        ]
    },
    resolve: {//vue.esm.js
        alias: {'vue$': 'vue/dist/vue.js'}
    },
    //allows auto-refresh; serve files on localhost:8080
    devServer: { contentBase: './dist' }
};