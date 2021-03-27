import * as path from "path";
import HtmlPlugin from "html-webpack-plugin";
import HtmlWebpackInjectPreload from "@principalstudio/html-webpack-inject-preload";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import {
  Configuration as WebpackConfiguration,
  EnvironmentPlugin,
} from "webpack";
import type { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import TerserPlugin from "terser-webpack-plugin";
import { GenerateSW } from "workbox-webpack-plugin";

const mode =
  process.env.NODE_ENV === "production" ? "production" : "development";

const webpackConfiguration: WebpackConfiguration = {
  mode,
  devtool: false,
  entry: {
    app: path.join(__dirname, "src/index"),
    worker: path.join(__dirname, "src/locations/worker.ts"),
  },
  output: {
    path: path.join(__dirname, "build"),
    filename: "[contenthash].js",
    publicPath: "",
  },
  resolve: { extensions: [".tsx", ".ts", ".js"] },
  optimization: {
    minimize: mode === "production",
    minimizer: [
      new TerserPlugin({
        exclude: [/(draco|basis)\//],
      }) as any,
    ],
  },
  module: {
    rules: [
      {
        test: [
          /\.(bmp|gif|png|jpeg|jpg|svg)$/,
          /\.(otf|ttf|woff|woff2)$/,
          /\.(hdr)$/,
          /\.(csv)$/,
          /\.(glb)$/,
        ],
        loader: "file-loader",
        options: { name: "[contenthash].[ext]" },
      },

      {
        test: /\.(ts|tsx|js)$/,
        use: [
          { loader: "babel-loader" },
          { loader: "@linaria/webpack-loader" },
        ],
      },

      {
        test: /\.css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: "css-loader" },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: "[contenthash].css" }),

    new EnvironmentPlugin({}),

    new HtmlPlugin({
      title: "🌐",
    }),

    new HtmlWebpackInjectPreload({
      files: [
        {
          match: /\.csv$/,
          attributes: {
            rel: "prefetch",
            as: "fetch",
            crossorigin: "anonymous",
          },
        },
        {
          match: /\.glb$/,
          attributes: {
            rel: "prefetch",
            as: "fetch",
            crossorigin: "anonymous",
          },
        },
      ],
    }),

    new GenerateSW({
      swDest: "service-worker.js",
      exclude: [/\.LICENSE\.txt/],
    }),

    new BundleAnalyzerPlugin({
      openAnalyzer: false,
      analyzerMode: "static",
    }),
  ],
};

const webpackDevServerConfiguration: WebpackDevServerConfiguration = {
  port: 8080,
  host: "0.0.0.0",
  useLocalIp: true,
  stats: "minimal",
  open: true,
};

export default {
  ...webpackConfiguration,
  devServer: webpackDevServerConfiguration,
};
