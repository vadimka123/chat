module.exports = {
  stripPrefix: 'build/',
  staticFileGlobs: [
    'manifest.json',
  ],
  dontCacheBustUrlsMatching: /\.\w{8}\./,
  swFilePath: 'service-worker.js'
};
