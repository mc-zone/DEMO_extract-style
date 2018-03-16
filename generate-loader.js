const path = require('path');
const qs = require('querystring');
const pify = require('util').promisify;
const loaderUtils = require('loader-utils');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const cssLoaders = ExtractTextPlugin.extract({
  fallback: "style-loader",
  use: "css-loader"
}).map(item => item.loader + (item.options ? `?${qs.stringify(item.options)}` : "")).join("!");

const tmpStorage = new Map(); 

module.exports = function(source, sourceMap, ast){
  const callback = this.async();
  const filename = this.resourcePath;
  const options = loaderUtils.getOptions(this);

  if(options && options.hash){
    source = tmpStorage.get(options.hash);
    callback(null, source);
  }else{
    const resolve = pify(this.resolve).bind(this);
    Promise.all([
      resolve(this.context, __filename),
      resolve(this.context, path.resolve(__dirname, "template.css"))
    ])
    .then(([loaderPath, tplPath]) => {
      const content = [
        `/* css for ${filename} */`,
        `body{color:red}` //generated from other places.
      ].join("\n") + "\n";
      const hash = loaderUtils.interpolateName(this.context, "[hash]", { content: filename + content });
      var shorterHash = hash.substr(0, 8);
      while(tmpStorage.has(shorterHash) && shorterHash !== hash){
        shorterHash = hash.substr(0, shorterHash.length);
      }

      tmpStorage.set(shorterHash, content);

      const query = {
        hash:shorterHash,
      };
      const loaders = `!!${cssLoaders}!${loaderPath}?${qs.stringify(query)}!`;
      const header = `require("${loaders}${tplPath}");\n`;
      source = header + source;

      callback(null, source);
    })
    .catch(e => callback(e));
  }
}
