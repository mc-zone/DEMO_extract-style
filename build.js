const path = require("path");
const webpack = require("webpack");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const mode = process.argv[2] || "production";

webpack({
  output:{
    pathinfo:true,
  },
  module:{
    rules:[
      {
        test:/\.js$/,
        include:[path.resolve(__dirname, "./src")],
        enforce:"pre",
        use:[
          {
            loader:path.resolve(__dirname, "./generate-loader.js"),
          },
          {
            loader:"babel-loader",
            options:{
              presets:[
                [
                  "@babel/preset-env", {
                    modules:false,
                  }
                ],
                "@babel/preset-react"
              ]
            }
          }
        ]
      },
    ]
  },
  mode:mode,
  devtool:"inline-cheap-source-map",
  optimization:{
    minimize:false,
    splitChunks:{
      chunks:"all"
    }
  },
  plugins:[
    new HTMLWebpackPlugin(),
    new ExtractTextPlugin({
      filename: "styles.css",
      allChunks: true,
      disable: mode === "development"
    }),
  ]
}, function(err, stats){
  if(err){
    console.error(err);
    return ;
  }

  console.log(stats.toString({
    colors:true,
    modules:false,
    children: false,
  }));

})
