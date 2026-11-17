module.exports = (path, options) => options.defaultResolver(path.replace(/\?raw$/, ''), options);
