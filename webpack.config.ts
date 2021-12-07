import * as path from "path";
import { execSync } from "child_process";
import HtmlPlugin from "html-webpack-plugin";
import HtmlWebpackInjectPreload from "@principalstudio/html-webpack-inject-preload";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import TerserPlugin from "terser-webpack-plugin";
import { GenerateSW } from "workbox-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import type { Configuration as WebpackConfiguration } from "webpack";

const mode =
  process.env.NODE_ENV === "production" ? "production" : "development";

const webpackConfiguration: WebpackConfiguration = {
  mode,
  devtool: false,
  entry: path.join(__dirname, "src/index"),
  output: {
    chunkFilename: "[contenthash:base62].js",
    filename: "[contenthash:base62].js",
    clean: true,
  },
  resolve: { extensions: [".tsx", ".ts", ".js"] },
  optimization: {
    minimize: mode === "production",
    minimizer: [new TerserPlugin({}) as any],
  },
  module: {
    rules: [
      {
        test: [/\.(bmp|gif|png|jpeg|jpg|svg|csv|glb)$/],
        loader: "file-loader",
        options: { name: "[contenthash:base62].[ext]" },
      },

      {
        test: /\.(ts|tsx)$/,
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
        const code = `
          const { renderToStaticMarkup } = require("react-dom/server");
          const { createElement } = require("react");
          require("@babel/register")({
            extensions: [".ts", ".tsx", ".js"],
            presets: [
              ["@babel/preset-react", { runtime: "automatic" }],
              "@babel/preset-typescript",
              "@linaria/babel-preset",
              ["@babel/preset-env", { modules: "auto", targets: { node: "current" } }],
            ],
          });
          const { Html } = require("./src/Html.tsx");

          console.log(renderToStaticMarkup(createElement(Html)));
        `;
        return `<!DOCTYPE html>` + execSync(`node --eval '${code}'`).toString();
      },
    }),

    new HtmlWebpackInjectPreload({
      files: [
        {
          match: /\.(csv)$/,
          attributes: {
            rel: "preload",
            as: "fetch",
            crossorigin: "anonymous",
          },
        },
        {
          match: /\.worker\.js$/,
          attributes: {
            rel: "preload",
            as: "script",
          },
        },
        {
          match: /\.(glb)$/,
          attributes: {
            rel: "prefetch",
            as: "fetch",
            crossorigin: "anonymous",
          },
        },
      ],
    }),

    ...("production" === mode
      ? [
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
        ]
      : []),
  ],

  ...({ devServer: { https: true } } as any),
};

export default webpackConfiguration;
