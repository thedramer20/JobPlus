const childProcess = require("node:child_process");
const { EventEmitter } = require("node:events");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const originalExec = childProcess.exec;

childProcess.exec = function patchedExec(command, ...args) {
  if (process.platform === "win32" && typeof command === "string" && command.trim().toLowerCase() === "net use") {
    const callback = typeof args[args.length - 1] === "function" ? args.pop() : null;
    const child = new EventEmitter();
    child.stdout = null;
    child.stderr = null;
    child.stdin = null;
    child.pid = undefined;
    child.kill = () => true;

    queueMicrotask(() => {
      if (callback) {
        callback(null, "", "");
      }
      child.emit("close", 0);
      child.emit("exit", 0);
    });

    return child;
  }

  return originalExec.call(this, command, ...args);
};

(async () => {
  const vitePackageJson = require.resolve("vite/package.json");
  const viteCliPath = path.join(path.dirname(vitePackageJson), "bin", "vite.js");
  await import(pathToFileURL(viteCliPath).href);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
