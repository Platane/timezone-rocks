import * as path from "path";
import { execSync } from "child_process";
import HtmlPlugin from "html-webpack-plugin";
import HtmlWebpackInjectPreload from "@principalstudio/html-webpack-inject-preload";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import HTMLInlineCSSWebpackPlugin from "html-inline-css-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import TerserPlugin from "terser-webpack-plugin";
import { GenerateSW } from "workbox-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import type { Configuration as WebpackConfiguration } from "webpack";
import type { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";

const mode =
  process.env.NODE_ENV === "production" ? "production" : "development";

const webpackConfiguration: WebpackConfiguration = {
  mode,
  devtool: false,
  entry: path.join(__dirname, "src/index"),
  output: { filename: "[contenthash].js" },
  resolve: { extensions: [".tsx", ".ts", ".js"] },
  optimization: {
    minimize: mode === "production",
    minimizer: [new TerserPlugin({}) as any],
  },
  module: {
    rules: [
      {
        test: [
          /\.(bmp|gif|png|jpeg|jpg|svg)$/,
          /\.(otf|ttf|woff|woff2)$/,
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

    new HtmlPlugin({
      title: "🌐",
      templateContent: () => {
        const code = `console.log(require('react-dom/server').renderToStaticMarkup(require('react').createElement(require('./src/Html.tsx').Html)))`;
        return (
          `<!DOCTYPE html>` +
          execSync(
            [
              "./node_modules/.bin/babel-node",
              `--extensions="${[".js", ".jsx", ".ts", ".tsx"].join(",")}"`,
              `--presets="${[
                "@babel/preset-react",
                "@babel/preset-typescript",
                "@linaria/babel-preset",
              ].join(",")}"`,
              `--eval "${code}"`,
            ].join(" ")
          ).toString()
        );
      },
    }),

    new HTMLInlineCSSWebpackPlugin(),

    new HtmlWebpackInjectPreload({
      files: [
        {
          match: /\.(csv)$/,
          attributes: {
            rel: "prefetch",
            as: "fetch",
            crossorigin: "anonymous",
          },
        },
        {
          match: /\.worker\.js$/,
          attributes: {
            rel: "prefetch",
            as: "script",
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
    }) as any,

    new CopyPlugin({
      patterns: [
        {
          from: path.join(__dirname, "src/assets/manifest.json"),
          to: "manifest.json",
        },
        {
          from: path.join(__dirname, "src/assets/icons"),
          to: "",
        },
      ],
    }),
  ],
};

const webpackDevServerConfiguration: WebpackDevServerConfiguration = {
  port: 8080,
  open: true,
  https: true,
};

export default {
  ...webpackConfiguration,
  devServer: webpackDevServerConfiguration,
};
