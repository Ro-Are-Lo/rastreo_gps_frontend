// fix-errors.mjs
import fs from 'fs';

function fixFile(filePath, fixFunction) {
  try {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      content = fixFunction(content);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Corregido: ${filePath}`);
    } else {
      console.log(`⚠️ No encontrado: ${filePath}`);
    }
  } catch (error) {
    console.log(`❌ Error en ${filePath}:`, error.message);
  }
}

console.log('🔧 Iniciando correcciones...\n');

// 1. Button.tsx - Eliminar import React no usado
fixFile('src/components/Button.tsx', content => 
  content.replace('import React from "react";', ''));

// 2. ProfileModal.tsx - Agregar tipos a parámetros
fixFile('src/components/ProfileModal.tsx', content => 
  content
    .replace(/c => c\.tipo/g, '(c: any) => c.tipo')
    .replace(/d => d\.tipo/g, '(d: any) => d.tipo'));

// 3. UserTable.tsx - Fix parámetros y ID
fixFile('src/components/UserTable.tsx', content =>
  content
    .replace(/\(r\) => getRoleName\(r\)/, '(r: any) => getRoleName(r)')
    .replace(/onDelete\(user\.usuario_id\)/, 'onDelete(user.usuario_id || user.id || 0)'));

// 4. UsersPage.tsx - Fix imports
fixFile('src/pages/UsersPage.tsx', content =>
  content
    .replace(/import \{ User, \}/, 'import type { User }')
    .replace(/import TablaUsuarios/, '// import TablaUsuarios')
    .replace(/import UserModal/, '// import UserModal')
    .replace(/<UserCreateModal[^>]*\/>/, '<UserCreateModal\n        isOpen={showCreateModal}\n        onClose={() => setShowCreateModal(false)}\n        onCreate={handleCreate}\n      />'));

// 5. LoginViewModel.ts - Fix import type
fixFile('src/viewmodels/LoginViewModel.ts', content =>
  content.replace(/import \{ User \}/, 'import type { User }'));

// 6. DashboardView.tsx - Fix import React y props
fixFile('src/views/DashboardView.tsx', content =>
  content
    .replace(/import React,/, 'import')
    .replace(/canEdit=\{.*?\}/g, '')
    .replace(/canDelete=\{.*?\}/g, '')
    .replace(/<ProfileModal[^>]*\/>/, '<ProfileModal\n        usuario={user}\n        onClose={() => setShowProfileModal(false)}\n      />'));

console.log('\n🎯 Ejecuta ahora: npm run build');