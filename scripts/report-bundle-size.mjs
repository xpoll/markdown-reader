import fs from "node:fs";
import path from "node:path";

const bundleDir = path.resolve("src-tauri/target/release/bundle");
const prdLimitMb = 20;

function formatMb(bytes) {
  return (bytes / 1024 / 1024).toFixed(2);
}

function walkFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(fullPath, files);
    else files.push(fullPath);
  }
  return files;
}

const installers = walkFiles(bundleDir).filter((file) =>
  /\.(exe|msi|dmg|appimage|deb)$/i.test(file),
);

if (installers.length === 0) {
  console.log("未找到安装包。请先执行: npm run build:release");
  process.exit(0);
}

console.log("安装包体积报告:\n");
for (const file of installers) {
  const stat = fs.statSync(file);
  const mb = Number(formatMb(stat.size));
  const status = mb <= prdLimitMb ? "OK" : "超出 PRD 目标";
  console.log(`- ${path.relative(process.cwd(), file)}`);
  console.log(`  ${formatMb(stat.size)} MB  [${status}] (PRD < ${prdLimitMb} MB)\n`);
}
