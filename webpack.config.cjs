const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");

let htmlPageNames = ["screenshotcomponent", "videocomponent", "offscreen"];
let multipleHtmlPlugins = htmlPageNames.map((name) => {
  return new HtmlWebpackPlugin({
    template: `./src/${name}/${name}.html`, // relative path to the HTML files
    filename: `${name}.html`, // output HTML files
    chunks: [`${name}`], // respective JS files
  });
});

module.exports = {
  mode: "production",
  target: "web",
  entry: {
    contentScript: "./src/content/index.ts",
    background: "./src/background/index.ts",
    react: "./src/react/index.tsx",
    screenshotcomponent: "./src/screenshotcomponent/screenshotcomponent.tsx",
    videocomponent: "./src/videocomponent/videocomponent.tsx",
    offscreen: "./src/offscreen/offscreen.tsx",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      chunks: ["contentScript", "background", "react"],
    }),

    new CopyPlugin({
      patterns: [
        { from: path.resolve("manifest.json"), to: path.resolve("dist") },
        { from: path.resolve("src", "index.css"), to: path.resolve("dist") },

        // {
        //   from: path.resolve(
        //     "src",
        //     "screenshotcomponent",
        //     "screenshotcomponent.css"
        //   ),
        //   to: path.resolve("dist"),
        // },
        // {
        //   from: path.resolve("src", "videocomponent", "videocomponent.css"),
        //   to: path.resolve("dist"),
        // },
        {
          from: path.resolve("src", "content-tailwind.css"),
          to: path.resolve("dist"),
        },
      ],
    }),
  ].concat(multipleHtmlPlugins),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              ["@babel/preset-react", { runtime: "automatic" }],
              "@babel/preset-typescript",
            ],
          },
        },
      },
      {
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                indent: "postcss",
                plugins: [tailwindcss, autoprefixer],
              },
            },
          },
        ],
        test: /\.css$/i,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
};
