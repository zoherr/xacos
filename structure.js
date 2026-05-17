// structure.js
// Run: node structure.js

const fs = require("fs");
const path = require("path");

const EXCLUDED = [
    ".turbo",
    ".next",
    "dist",
    "build",
    "node_modules",
    ".git",
    ".github",
    "agents",
    "structure.js"
];

let output = "";

function generateStructure(dir, prefix = "") {
    const items = fs
        .readdirSync(dir, { withFileTypes: true })
        .filter((item) => !EXCLUDED.includes(item.name));

    items.forEach((item, index) => {
        const isLast = index === items.length - 1;
        const connector = isLast ? "└── " : "├── ";

        output += prefix + connector + item.name + "\n";

        if (item.isDirectory()) {
            const newPrefix = prefix + (isLast ? "    " : "│   ");
            generateStructure(path.join(dir, item.name), newPrefix);
        }
    });
}

output += path.basename(process.cwd()) + "\n";
generateStructure(process.cwd());

fs.writeFileSync("structure.txt", output);

console.log("✅ structure.txt generated");