import path from "path";
import fs from "fs/promises";
import * as sass from "sass";
import postcss from "postcss";
import rtlcss from "postcss-rtlcss";

// Paths
const mainScssPath = path.resolve(__dirname, "../src/assets/scss/style.scss");
const rtlScssPath = path.resolve(__dirname, "../src/assets/scss/converted-style.scss");
const scssDirPath = path.resolve(__dirname, "../src/assets/scss");

async function generateRtlCss() {
  try {
    console.log("🔄 Generating RTL CSS...");

    const scssResult = await sass.compileAsync(mainScssPath);
    const ltrCss = scssResult.css;

    const rtlResult = await postcss([rtlcss()]).process(ltrCss, {
      from: mainScssPath,
    });

    // Compare with existing output to avoid unnecessary writes
    let existingCss = "";
    try {
      existingCss = await fs.readFile(rtlScssPath, "utf8");
    } catch {
      // File does not exist, will be created
    }

    if (existingCss !== rtlResult.css) {
      await fs.writeFile(rtlScssPath, rtlResult.css);
      console.log("✅ RTL CSS updated:", rtlScssPath);
    } else {
      console.log("⏩ RTL CSS unchanged.");
    }

  } catch (err) {
    console.error("❌ Error generating RTL CSS:", err);
  }
}

export default function generateRtlPlugin() {
  return {
    name: "vite-plugin-generate-rtl",

    async buildStart() {
      await generateRtlCss();
    },

    async handleHotUpdate({ file, server }) {
      const relativePath = path.relative(scssDirPath, file);

      if (
        file.endsWith(".scss") &&
        !relativePath.startsWith("..") &&
        !path.isAbsolute(relativePath)
      ) {
        console.log("📁 SCSS file changed:", file);
        await generateRtlCss();
      }
    },
  };
}