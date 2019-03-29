const path = require('path'),
    utils = require('loader-utils'),
    sharp = require('sharp');

module.exports = function (content) {
    const callback = this.async(),
        options = utils.getOptions(this) || {},
        params = utils.parseQuery(this.resourceQuery),
        size = + params.size || 512,
        target = utils.interpolateName(this, 'icon-' + size + '.png', {
            context: this.rootContext,
            content
        });
    this.addDependency(this.resourcePath);
    sharp({
        create: {
            width: 789,
            height: 789,
            channels: 4,
            background: '#bfff00'
        }
    }).png().composite([{ input: content }]).toBuffer().then(data =>
        // v0.22.0 存在缺陷，composite() 后 resize() 会报错
        sharp(data).resize(size).toBuffer()
    ).then(data => {
        this.emitFile(target, data);
        callback(null, 'module.exports=__webpack_public_path__+' + JSON.stringify(target));
    }).catch(err => callback(err));
};
module.exports.raw = true;
