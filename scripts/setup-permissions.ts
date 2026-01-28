/**
 * Setup Directus Permissions for APM Portal
 * Run with: npx ts-node scripts/setup-permissions.ts
 */

const DIRECTUS_URL = 'http://localhost:8055';
const ADMIN_EMAIL = 'admin@apm-portal.id';
const ADMIN_PASSWORD = 'Admin@APM2026!';

async function getAdminToken(): Promise<string> {
  const response = await fetch(`${DIRECTUS_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to login');
  }
  
  const data = await response.json();
  return data.data.access_token;
}

async function setupPermissions(token: string) {
  // Get public role ID (null role = public)
  // For public access, we use role: null
  
  const collections = [
    // Public read access
    { collection: 'apm_lomba', action: 'read', permissions: { is_deleted: { _eq: false } } },
    { collection: 'apm_expo', action: 'read', permissions: { is_deleted: { _eq: false } } },
    { collection: 'apm_prestasi', action: 'read', permissions: { status: { _eq: 'verified' }, is_deleted: { _eq: false } } },
    { collection: 'apm_resources', action: 'read', permissions: {} },
    { collection: 'apm_about', action: 'read', permissions: {} },
    { collection: 'apm_faq', action: 'read', permissions: {} },
    { collection: 'apm_tim', action: 'read', permissions: {} },
    { collection: 'apm_expo_registrations', action: 'read', permissions: {} },
    
    // Public create access (for submissions)
    { collection: 'apm_prestasi', action: 'create', permissions: {}, fields: ['*'] },
    { collection: 'apm_expo_registrations', action: 'create', permissions: {}, fields: ['*'] },
    
    // File access
    { collection: 'directus_files', action: 'read', permissions: {} },
    { collection: 'directus_files', action: 'create', permissions: {} },
  ];
  
  for (const perm of collections) {
    try {
      const response = await fetch(`${DIRECTUS_URL}/permissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          role: null, // public role
          collection: perm.collection,
          action: perm.action,
          permissions: perm.permissions || {},
          fields: perm.fields || ['*'],
        }),
      });
      
      if (response.ok) {
        console.log(`✅ Added ${perm.action} permission for ${perm.collection}`);
      } else {
        const error = await response.json();
        // Check if permission already exists
        if (error.errors?.[0]?.extensions?.code === 'RECORD_NOT_UNIQUE') {
          console.log(`⏭️ Permission already exists for ${perm.collection} (${perm.action})`);
        } else {
          console.log(`❌ Failed to add ${perm.action} for ${perm.collection}:`, error);
        }
      }
    } catch (err) {
      console.error(`Error setting permission for ${perm.collection}:`, err);
    }
  }
}

async function main() {
  try {
    console.log('🔐 Logging in to Directus...');
    const token = await getAdminToken();
    console.log('✅ Logged in successfully\n');
    
    console.log('🔧 Setting up permissions...');
    await setupPermissions(token);
    
    console.log('\n✅ Permissions setup complete!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();

export {};
