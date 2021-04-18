import * as path from "path";
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
  output: {
    path: path.join(__dirname, "build"),
    filename: "[contenthash].js",
    publicPath: "",
  },
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
      templateContent: ({ htmlWebpackPlugin }) => `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width,initial-scale=1">
            <title>${htmlWebpackPlugin.options.title}</title>
            <link rel="manifest" href="/manifest.json">
            <link rel="apple-touch-icon" sizes="180x180" href="/icon-180x180.png">
            <meta name="theme-color" content="#203b53"/>
            <link rel="icon" type="image/png" sizes="32x32" href="/icon-32x32.png">
            <link rel="icon" type="image/png" sizes="16x16" href="/icon-16x16.png">
          </head>
          <body>
            <div id="root">
              <div style="display:flex;justify-content:center;align-items:center;min-height:400px;height:100%;width:100%;color:#fff">
                loading...
              </div>
            </div>
          </body>
        </html>
    `,
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
  host: "0.0.0.0",
  useLocalIp: true,
  stats: "minimal",
  open: true,
  https: true,
};

export default {
  ...webpackConfiguration,
  devServer: webpackDevServerConfiguration,
};
