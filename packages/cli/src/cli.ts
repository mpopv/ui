import path from 'path';
import fs from 'fs';

interface ComponentConfig {
  aliases: Record<string, string>;
  resolvedPaths?: Record<string, string>;
}

function resolveAliasPaths(configPath: string, config: ComponentConfig) {
  const configDir = path.dirname(configPath);

  if (!config.resolvedPaths) {
    config.resolvedPaths = {};
  }

  for (const [alias, aliasPath] of Object.entries(config.aliases)) {
    if (aliasPath.startsWith('.')) {
      // Resolve relative paths
      config.resolvedPaths[alias] = path.resolve(configDir, aliasPath);
    } else {
      // Use absolute paths or other special cases as-is
      config.resolvedPaths[alias] = aliasPath;
    }
  }
}

function loadComponentConfig(configPath: string): ComponentConfig {
  if (!fs.existsSync(configPath)) {
    throw new Error(`Config file not found: ${configPath}`);
  }

  const config: ComponentConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

  resolveAliasPaths(configPath, config);

  return config;
}

function main() {
  try {
    const configPath = path.resolve(process.cwd(), 'component.json');
    const config = loadComponentConfig(configPath);

    // Your CLI logic here, utilizing resolvedPaths from the config
    console.log('Resolved Paths:', config.resolvedPaths);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
