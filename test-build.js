const fs = require("fs");
const { execSync } = require("child_process");
const path = require("path");

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

// Log with color
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

// Run a test step
function runStep(name, fn) {
  try {
    log(`\n${colors.cyan}===== ${name} =====`, colors.cyan);
    fn();
    log(`${colors.green}✓ ${name} completed successfully`, colors.green);
    return true;
  } catch (error) {
    log(`${colors.red}✗ ${name} failed: ${error.message}`, colors.red);
    if (error.stdout) console.log(error.stdout.toString());
    if (error.stderr) console.log(error.stderr.toString());
    return false;
  }
}

// Verify dependencies in package.json
function verifyDependencies() {
  log("Checking package.json dependencies...");

  const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf-8"));

  // Define expected versions
  const expectedDeps = {
    react: "18.2.0",
    "react-dom": "18.2.0",
    next: "^13.0.0",
    tailwindcss: "^3.0.0",
  };

  // Check each dependency
  for (const [dep, version] of Object.entries(expectedDeps)) {
    // Check in both dependencies and devDependencies
    if (!packageJson.dependencies[dep] && !packageJson.devDependencies[dep]) {
      throw new Error(`Missing dependency: ${dep}`);
    }

    const actualVersion =
      packageJson.dependencies[dep] || packageJson.devDependencies[dep];
    log(`  - ${dep}: ${actualVersion}`);
  }
}

// Verify config files exist
function verifyConfigFiles() {
  log("Checking config files...");

  const requiredFiles = [
    "tailwind.config.js",
    "postcss.config.js",
    "next.config.js",
    "styles/globals.css",
  ];

  for (const file of requiredFiles) {
    if (!fs.existsSync(file)) {
      if (file === "next.config.js") {
        log(`  Creating empty next.config.js file...`);
        fs.writeFileSync("next.config.js", "module.exports = {};\n");
      } else {
        throw new Error(`Missing required file: ${file}`);
      }
    } else {
      log(`  - ${file} exists`);
    }
  }
}

// Try building the project
function testBuild() {
  log("Attempting to build the project...");
  execSync("npm run build", { stdio: "inherit" });
}

// Run all tests
function runTests() {
  const steps = [
    { name: "Verify Dependencies", fn: verifyDependencies },
    { name: "Verify Config Files", fn: verifyConfigFiles },
    { name: "Test Build", fn: testBuild },
  ];

  let successCount = 0;

  for (const step of steps) {
    if (runStep(step.name, step.fn)) {
      successCount++;
    }
  }

  log(`\n${colors.cyan}===== Test Summary =====`, colors.cyan);
  log(
    `${successCount} of ${steps.length} tests passed.`,
    successCount === steps.length ? colors.green : colors.yellow,
  );

  return successCount === steps.length;
}

// Main execution
log(
  `${colors.magenta}Starting status site build verification...`,
  colors.magenta,
);
const success = runTests();

if (success) {
  log(
    `${colors.green}All tests passed! The project is set up correctly.`,
    colors.green,
  );
  process.exit(0);
} else {
  log(
    `${colors.yellow}Some tests failed. Please fix the issues above.`,
    colors.yellow,
  );
  process.exit(1);
}
