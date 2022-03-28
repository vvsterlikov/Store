const path = require("path");
//const webpack = require('webpack')


module.exports = {
  mode: 'development',
  devServer: {
    static: {
      //directory: path.join(__dirname, 'public'),
      directory : path.join(__dirname, "../../src/main/resources/static/"),
    },
    compress: true,
    port: 9000,
  },
  entry: "./src/index.js",
  output: {
    path: path.join(__dirname, "../../src/main/resources/static/"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  }
};