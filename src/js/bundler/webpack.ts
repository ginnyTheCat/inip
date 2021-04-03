import { formatJs } from "../../utils/format";

type Loader =
  | string
  | {
      loader: string;
      options: any;
    };

export interface WebpackRule {
  test: string;
  use: Loader | Loader[];
}

export interface WebpackConfig {
  entry: string;

  output: {
    filename: string;
    path: string;
  };

  resolve: {
    extensions: string[];
  };

  rules: WebpackRule[];
}

export function generateWebpackConfig(config: WebpackConfig) {
  return formatJs(`const path = require("path");
  
  module.exports = {
    entry: "${config.entry}",
    output: {
      filename: "${config.output.filename}",
      path: path.resolve(__dirname, "${config.output.path}")
    },
    devServer: {
      contentBase: [
        path.join(__dirname, "dist"),
        path.join(__dirname, "public")
      ]
    },
    resolve: {
      extensions: ${JSON.stringify(config.resolve.extensions)}
    },
    module: {
      rules: [
        ${config.rules
          .map((r) => `{ test: ${r.test}, use: ${JSON.stringify(r.use)} }`)
          .join(",")}
      ]
    }
  }`);
}
