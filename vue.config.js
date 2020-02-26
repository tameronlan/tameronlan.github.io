const spritesGeneratorPlugin = require('./webpack-plugins/spritesGenerator').default;
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    publicPath: '/app/',
    outputDir: './app',
    configureWebpack: {
        plugins: [
            new CleanWebpackPlugin(['src/assets/generated-sprite-*.png']),
            spritesGeneratorPlugin('ico'),
            spritesGeneratorPlugin('ico-nav'),
            spritesGeneratorPlugin('ico2')
        ]
    },
    chainWebpack: config => {
        config.plugins.delete('prefetch');

        const svgRule = config.module.rule('svg');

        svgRule.uses.clear();
        svgRule
            .use('vue-svg-loader')
            .loader('vue-svg-loader')
            .options({
                svgo: {
                    plugins: [{removeDimensions: false}, {removeViewBox: false}, {prefixIds: true}]
                }
            });

        config.module
            .rule('fonts')
            .use('url-loader')
            .loader('url-loader?limit=1024&name=fonts/[name].[ext]&publicPath=../')
    }
};
