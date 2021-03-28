import * as path from "path";
import HtmlPlugin from "html-webpack-plugin";
import HtmlWebpackInjectPreload from "@principalstudio/html-webpack-inject-preload";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import HTMLInlineCSSWebpackPlugin from "html-inline-css-webpack-plugin";
// @ts-ignore
import PreloadWebpackPlugin from "@vue/preload-webpack-plugin";
// @ts-ignore
import { HtmlWebpackSkipAssetsPlugin } from "html-webpack-skip-assets-plugin";
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
    filename: "[contenthash]-[name].js",
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
      excludeAssets: [/\-worker\.js/],
      templateContent: ({ htmlWebpackPlugin }) => `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width,initial-scale=1">
            <title>${htmlWebpackPlugin.options.title}</title>
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

    new HtmlWebpackSkipAssetsPlugin(),

    new HTMLInlineCSSWebpackPlugin(),

    // new PreloadWebpackPlugin({
    //   rel: "prefetch",
    //   as: (entry: string) => {
    //     if (/\.css$/.test(entry)) return "style";
    //     if (/\.js$/.test(entry)) return "script";
    //   },
    //   fileBlacklist: [/\.(csv|glb)$/,],
    // }),

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
          match: /\-(worker\.worker)\.js$/,
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
