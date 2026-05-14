const fs = require("fs");
const path = require("path");

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, "utf-8");
  
  // Fix pipelineGroups.followUp -> pipelineGroups["follow-up"]
  content = content.replace(/pipelineGroups\.followUp/g, 'pipelineGroups["follow-up"]');
  
  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`Fixed: ${filePath}`);
}

const root = path.resolve(__dirname, "..");

fixFile(path.join(root, "src/pages/network-page-v2.tsx"));
fixFile(path.join(root, "src/pages/network-page-v3.tsx"));

console.log("Done.");
