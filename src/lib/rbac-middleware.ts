import { adminDb } from "@/lib/firebase-admin";
import { UserProfile, ModulePermissions } from "@/lib/types";

/**
 * Verifies if a user has a specific permission for a module.
 * Use this inside Server Actions for data security.
 */
export async function verifyPermission(
  userId: string, 
  moduleName: string, 
  action: keyof ModulePermissions
): Promise<boolean> {
  try {
    const userDoc = await adminDb.collection("users").doc(userId).get();
    if (!userDoc.exists) return false;
    
    const user = userDoc.data() as UserProfile;
    
    // Super Admins bypass everything
    if (user.isSuperAdmin) return true;
    
    // Admins bypass everything by default
    if (user.role === 'admin') return true;
    
    // Check granular permissions for Staff
    if (user.role === 'staff' && user.permissions) {
      return user.permissions[moduleName]?.[action] === true;
    }
    
    return false;
  } catch (error) {
    console.error("RBAC Middleware Error:", error);
    return false;
  }
}

/**
 * Shorthand for checking 'view' permission.
 */
export async function canView(userId: string, moduleName: string) {
  return verifyPermission(userId, moduleName, 'view');
}

/**
 * Shorthand for checking 'create' permission.
 */
export async function canCreate(userId: string, moduleName: string) {
  return verifyPermission(userId, moduleName, 'create');
}

/**
 * Shorthand for checking 'edit' permission.
 */
export async function canEdit(userId: string, moduleName: string) {
  return verifyPermission(userId, moduleName, 'edit');
}

/**
 * Shorthand for checking 'delete' permission.
 */
export async function canDelete(userId: string, moduleName: string) {
  return verifyPermission(userId, moduleName, 'delete');
}
