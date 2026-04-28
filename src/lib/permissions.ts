import fs from 'fs';
import path from 'path';

export const ADMIN_MODULE_ROOT = path.join(process.cwd(), 'src/app/admin');

// Modules that are system-level and shouldn't be restricted individually
export const SYSTEM_MODULES = ['login', 'unauthorized'];

/**
 * Dynamically discovers all modules in the src/app/admin directory.
 * A module is defined as any subdirectory that isn't a system module.
 */
export async function getProjectModules(): Promise<string[]> {
  try {
    const entries = await fs.promises.readdir(ADMIN_MODULE_ROOT, { withFileTypes: true });
    
    return entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
      .filter(name => !SYSTEM_MODULES.includes(name));
  } catch (error) {
    console.error('Error discovering admin modules:', error);
    return [];
  }
}

/**
 * Returns a default permission object for a new module.
 */
export function getDefaultModulePermissions() {
  return {
    view: false,
    create: false,
    edit: false,
    delete: false
  };
}

/**
 * Generates an empty permissions object for all current project modules.
 */
export async function generateEmptyPermissions() {
  const modules = await getProjectModules();
  const permissions: any = {};
  
  modules.forEach(mod => {
    permissions[mod] = getDefaultModulePermissions();
  });
  
  return permissions;
}
