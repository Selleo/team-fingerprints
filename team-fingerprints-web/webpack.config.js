const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
module.exports = {
  //other rules
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    plugins: [new TsconfigPathsPlugin()],
  }
}
