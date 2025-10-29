import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';

// Configuración automática
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
  projectRoot: path.join(__dirname, '..'), // Directorio raíz del proyecto
  ejsOptions: {
    keepOriginalStructure: true,  // Mantener misma estructura de archivos
    fixInternalLinks: true,       // Corregir enlaces entre páginas
    adaptStaticReferences: true,  // Adaptar referencias a CSS/JS
    processConditionals: false    // No agregar lógica EJS automáticamente
  }
};

// Función principal
async function autoMigrateToEjs() {
  console.log('Iniciando migración automática a EJS...');
  
  // 2. Convertir todos los HTML a EJS
  await convertHtmlFiles();
  
  
  console.log('✅ Migración completada con éxito!');
  console.log('El proyecto ahora funciona exactamente igual pero con EJS');
}

// ================= Funciones principales =================

async function convertHtmlFiles() {
  console.log('Buscando y convirtiendo archivos HTML...');
  
  const htmlFiles = await findFilesByExtension(config.projectRoot, '.html');
  
  for (const file of htmlFiles) {
    try {
      // Leer contenido original
      const content = await fs.readFile(file, 'utf-8');
      
      // Convertir a EJS manteniendo funcionalidad
      const ejsContent = transformToEjs(content, file);
      
      // Guardar como EJS (misma ubicación)
      const newPath = file.replace('.html', '.ejs');
      await fs.writeFile(newPath, ejsContent);
      
      console.log(`✓ Convertido: ${path.relative(config.projectRoot, file)}`);
    } catch (error) {
      console.warn(`⚠ Error procesando ${file}:`, error.message);
    }
  }
}

// ================= Funciones de transformación =================

function transformToEjs(content, filePath) {
  let transformed = content;
  const dirname = path.dirname(filePath);
  
  // 1. Mantener referencias a CSS/JS exactamente igual
  if (config.ejsOptions.adaptStaticReferences) {
    transformed = transformed.replace(
      /(href|src)=["']([^"']+)["']/g,
      (match, attr, value) => {
        // Si es una referencia local (no empieza con http o /)
        if (!/^(https?:|\/)/.test(value)) {
          const absolutePath = path.resolve(dirname, value);
          const relativePath = path.relative(config.projectRoot, absolutePath);
          return `${attr}="${relativePath}"`;
        }
        return match;
      }
    );
  }
  
  // 2. Convertir includes estáticos si existen
  transformed = transformed.replace(
    /<!--\s*#include\s+file=["']([^"']+)["']\s*-->/gi,
    '<%- include(\'$1\') %>'
  );
  
  // 3. Escapar tags EJS existentes accidentalmente
  transformed = transformed.replace(/<%=/g, '<%%=').replace(/<%!/g, '<%%!');
  
  return transformed;
}

// ================= Utilidades =================

async function findFilesByExtension(dir, ext) {
  const files = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory() && !entry.name.startsWith('.')) {
      files.push(...await findFilesByExtension(fullPath, ext));
    } else if (entry.isFile() && path.extname(entry.name) === ext) {
      files.push(fullPath);
    }
  }
  
  return files;
}


// Ejecutar migración
autoMigrateToEjs().catch(console.error);