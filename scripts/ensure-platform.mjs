const expected = process.argv[2];
const current = process.platform;

const labels = {
  darwin: "macOS",
  win32: "Windows",
  linux: "Linux",
};

if (current !== expected) {
  const currentLabel = labels[current] ?? current;
  const expectedLabel = labels[expected] ?? expected;

  console.error(
    `\n无法在 ${currentLabel} 上构建 ${expectedLabel} 安装包。\n` +
      `Tauri 不支持跨平台打包，请在 ${expectedLabel} 上执行此命令，\n` +
      `或使用 GitHub Actions 工作流「Build macOS」在云端构建。\n`,
  );
  process.exit(1);
}
