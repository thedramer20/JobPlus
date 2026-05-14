const fs = require("fs");
const path = require("path");

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, "utf-8");
  
  // Fix 1: followUp -> "follow-up" in pipelineGroups
  content = content.replace(
    /followUp: recruitersData\.filter\(r => r\.pipeline === "follow-up"\)/g,
    '"follow-up": recruitersData.filter((r: Recruiter) => r.pipeline === "follow-up")'
  );
  
  // Fix 2: Add explicit types to .map() callbacks for recruiters
  content = content.replace(
    /pipelineGroups\[activePipeline\]\.map\(\(recruiter\) =>/g,
    'pipelineGroups[activePipeline].map((recruiter: Recruiter) =>'
  );
  
  // Fix 3: Add explicit type to .map(n => n[0]) 
  content = content.replace(
    /\.map\(n => n\[0\]\)/g,
    '.map((n: string) => n[0])'
  );
  
  // Fix 4: Also fix other .map(r => r.pipeline) patterns
  content = content.replace(
    /recruitersData\.filter\(r => r\./g,
    'recruitersData.filter((r: Recruiter) => r.'
  );
  
  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`Fixed: ${filePath}`);
}

const root = path.resolve(__dirname, "..");

fixFile(path.join(root, "src/pages/network-page-v2.tsx"));
fixFile(path.join(root, "src/pages/network-page-v3.tsx"));

console.log("Done.");
