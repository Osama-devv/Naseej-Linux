import fs from "fs-extra";
import path from "path";
import { sync } from "glob";

export default function copyRtlHtmlPlugin() {
  const srcDir = path.resolve("src");
  const destDir = path.resolve("src/ar");
  const componentsDir = path.resolve("src/components");

  // Function to copy all root HTML files to src/ar/
  function copyHtmlFiles() {
    const htmlFiles = sync(`${srcDir}/*.html`);
    fs.ensureDirSync(destDir);
    htmlFiles.forEach((file) => {
      const fileName = path.basename(file);
      const destPath = path.join(destDir, fileName);
      fs.copySync(file, destPath);
    });
  }

  return {
    name: "vite-plugin-copy-rtl-html",
    configureServer(server) {
      // Initial copy when server starts
      copyHtmlFiles();

      // Add both src/*.html and src/components/**/*.html to watcher
      server.watcher.add([
        `${srcDir}/*.html`,
        `${componentsDir}/**/*.html`,
      ]);

      server.watcher.on("change", (changedFile) => {
        if (changedFile.endsWith(".html")) {
          console.log(`♻️  Detected change in: ${changedFile}`);

          // Copy all src/*.html files again to src/ar/
          copyHtmlFiles();

          // Trigger full page reload
          // server.ws.send({
          //   type: "full-reload",
          // });
        }
      });
    },
  };
}
