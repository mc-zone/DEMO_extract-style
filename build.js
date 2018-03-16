const path = require("path");
const webpack = require("webpack");
const HTMLWebpackPlugin = require("html-webpack-plugin");

webpack({
  entry:"./index.js",
  output:{
    pathinfo:true,
  },
  module:{
    rules:[
      {
        test:/\.js$/,
        use:[
          {
            loader:path.resolve(__dirname, "./loader.js"),
          },
          {
            loader:"babel-loader",
            options:{
              presets:[["@babel/preset-env"], "@babel/preset-react"]
            }
          }
        ]
      }
    ]
  },
  mode:"production",
  optimization:{
    minimize:false,
    splitChunks:{
      chunks:"all"
    }
  },
  plugins:[
    new HTMLWebpackPlugin(),
  ]
}, function(err, stats){
  if(err){
    console.error(err);
    return ;
  }

  console.log(stats.toString({
    colors:true,
    chunks:false,
  }));

})
