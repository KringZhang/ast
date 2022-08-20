module.exports = {
    entry: './src/index.js',
    output: {
        publicPath: 'virtual',
        filename: 'bundle.js'
    },
    devServer: {
        open: true,
        port: 8080,
        contentBase: 'public'
    }
}