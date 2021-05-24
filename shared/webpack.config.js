const path = require("path");

module.exports = {
  mode: "production",
  target: "web",
  entry: path.resolve(__dirname, "./src/index.ts"),

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        // loader: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },

  resolve: {
    extensions: [".ts", ".js"],
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    library: "Shared",
    libraryTarget: "umd",
    umdNamedDefine: true,
    globalObject: "this",
  },
};
