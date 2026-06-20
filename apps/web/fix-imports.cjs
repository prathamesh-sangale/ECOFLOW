const fs = require('fs');
const path = require('path');
const glob = require('glob');

const files = glob.sync('src/pages/**/*.tsx', { cwd: __dirname, absolute: true });

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Replace import { Type } from '@ecoflow/shared-types' -> import type { Type } from '@ecoflow/shared-types'
  const typeRegex = /import\s+\{([^}]+)\}\s+from\s+['"]@ecoflow\/shared-types['"]/g;
  content = content.replace(typeRegex, (match, p1) => {
    changed = true;
    return `import type { ${p1.trim()} } from '@ecoflow/shared-types'`;
  });

  // Handle shared-validations
  const valRegex = /import\s+\{([^}]+)\}\s+from\s+['"]@ecoflow\/shared-validations['"]/g;
  content = content.replace(valRegex, (match, p1) => {
    const tokens = p1.split(',').map(s => s.trim());
    const schemas = tokens.filter(t => t.endsWith('Schema'));
    const types = tokens.filter(t => !t.endsWith('Schema'));

    if (types.length > 0 && schemas.length === 0) {
      changed = true;
      return `import type { ${p1.trim()} } from '@ecoflow/shared-validations'`;
    } else if (types.length > 0 && schemas.length > 0) {
      changed = true;
      return `import { ${schemas.join(', ')} } from '@ecoflow/shared-validations';\nimport type { ${types.join(', ')} } from '@ecoflow/shared-validations'`;
    }
    return match;
  });

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed', file);
  }
});
