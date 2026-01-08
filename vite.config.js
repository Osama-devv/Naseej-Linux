import { defineConfig } from "vite";
import handlebars from "vite-plugin-handlebars";
import path from "path";
import { sync } from "glob";
import copyRtlHtmlPlugin from "./plugins/vite-plugin-copy-rtl-html.js";
import generateRtlPlugin from "./plugins/vite-plugin-generate-rtl.js";
import dataEn from "./data.json" assert { type: "json" };
import dataAr from "./data-ar.json" assert { type: "json" };

const partialsDir = path.resolve(__dirname, "src/components");

// 🔥 Collect all HTML pages from src/ (not components)
const htmlEntries = sync("./src/**/*.html", {
  ignore: ["./src/components/**"], // 🚫 Ignore all HTML in components folder
}).reduce((entries, file) => {
  const name = file
    .replace(/^\.\/src\//, "") // remove base path
    .replace(/\.html$/, "") // remove extension
    .replace(/\\/g, "/"); // normalize Windows slashes
  entries[name] = path.resolve(__dirname, file);
  return entries;
}, {});
if (htmlEntries["ar/index"] && !htmlEntries["ar"]) {
  htmlEntries["ar"] = htmlEntries["ar/index"];
}

// 👇 Final config
export default defineConfig({
  root: "./src",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    assetsInlineLimit: 0,
    terserOptions: {
      mangle: {
        reserved: ['$', 'Plyr', 'Xs'] // Add any globals that shouldn't be renamed
      }
    },
    rollupOptions: {
      input: htmlEntries,
      output: {
        entryFileNames: "assets/js/[name].js",
        chunkFileNames: "assets/js/[name].js",
        assetFileNames: ({ name }) => {
          if (!name) return "assets/[name][extname]";
          if (/\.(css)$/i.test(name)) return "assets/css/[name][extname]";
          if (/\.(png|jpe?g|svg|gif|webp|ico)$/i.test(name)) return "assets/images/[name][extname]";
          if (/\.(woff2?|eot|ttf|otf)$/i.test(name)) return "assets/fonts/[name][extname]";
          if (/\.(mp4|webm|ogg|mov|avi)$/i.test(name)) return "assets/videos/[name][extname]";
          return "assets/[name][extname]";
        },
      },
    },
  },
  plugins: [
    handlebars({
      partialDirectory: partialsDir,
      context(pagePath) {
         const normalizedPath = pagePath.split(path.sep).join("/"); // normalize slashes
        const isArabic = /\/ar(\/|$)/.test(normalizedPath);
        return isArabic ? dataAr : dataEn;
      },
    }),
    // 🔄 Reload when partials (e.g. header.html) change
    {
      name: "reload-partials",
      handleHotUpdate({ file, server }) {
        if (file.startsWith(partialsDir)) {
          server.ws.send({ type: "full-reload" });
        }
      },
    },
    copyRtlHtmlPlugin(),
    generateRtlPlugin(),
    // ✅ Redirect /ar → /ar/ in dev server
    {
      name: "redirect-ar",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === "/ar") {
            res.statusCode = 301;
            res.setHeader("Location", "/ar/");
            res.end();
            return;
          }
          next();
        });
      },
    },
  ],
   server: {
    allowedHosts: [
      '065843235234.ngrok-free.app',
    ],
  },
});