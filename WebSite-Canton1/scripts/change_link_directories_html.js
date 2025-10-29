import fs from 'fs/promises';
import path from 'path';

// Configuración
const config = {
  sourceDir: './src/views',          // Directorio a procesar
  fileExtensions: ['.html', '.ejs'], // Extensiones de archivo a procesar
  verbose: true,                     // Mostrar logs detallados
  pathsToRemove: ['src/views/', 'public/'] // Prefijos de ruta a eliminar
};

async function processDirectory(directoryPath) {
  try {
    const files = await fs.readdir(directoryPath, { withFileTypes: true });
    
    for (const file of files) {
      const fullPath = path.join(directoryPath, file.name);
      
      if (file.isDirectory()) {
        await processDirectory(fullPath);
      } else if (file.isFile() && 
                config.fileExtensions.includes(path.extname(file.name).toLowerCase())) {
        await processFile(fullPath);
      }
    }
  } catch (error) {
    console.error(`❌ Error procesando directorio ${directoryPath}:`, error);
  }
}

async function processFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    let modified = false;
    let newContent = content;
    
    // Procesar enlaces en HTML y EJS
    newContent = newContent.replace(
      /(<a\b[^>]*\bhref=["'])([^"']*?)(["'][^>]*>)/gi,
      (match, start, pathValue, end) => {
        // Ignorar casos especiales
        if (pathValue === '' || pathValue.startsWith('#') || 
            pathValue.startsWith('http') || pathValue.startsWith('//') ||
            pathValue.startsWith('<%')) {
          return match;
        }
        
        let cleanPath = pathValue;
        
        // Eliminar prefijos no deseados
        config.pathsToRemove.forEach(prefix => {
          if (cleanPath.startsWith(prefix)) {
            cleanPath = cleanPath.substring(prefix.length);
            modified = true;
          }
        });
        
        // Eliminar .html
        if (cleanPath.endsWith('.html')) {
          cleanPath = cleanPath.replace(/\.html$/i, '');
          modified = true;
        }
        
        // Eliminar /index al final
        if (cleanPath.endsWith('/index')) {
          cleanPath = cleanPath.replace(/\/index$/i, '');
          modified = true;
        }
        
        // Eliminar ./ o / al inicio
        if (cleanPath.startsWith('./') || cleanPath.startsWith('/')) {
          cleanPath = cleanPath.replace(/^\.?\//, '');
          modified = true;
        }
        
        if (modified) {
          return `${start}${cleanPath}${end}`;
        }
        return match;
      }
    );

    // Procesar includes de EJS
    if (path.extname(filePath) === '.ejs') {
      newContent = newContent.replace(
        /(<%-?\s*include\s*\(?['"])([^'"]*?)(['"]\)?[^%>]*%>)/gi,
        (match, start, pathValue, end) => {
          let cleanPath = pathValue;
          let changed = false;
          
          config.pathsToRemove.forEach(prefix => {
            if (cleanPath.startsWith(prefix)) {
              cleanPath = cleanPath.substring(prefix.length);
              changed = true;
            }
          });
          
          if (cleanPath.endsWith('.html')) {
            cleanPath = cleanPath.replace(/\.html$/i, '');
            changed = true;
          }
          
          if (changed) {
            modified = true;
            return `${start}${cleanPath}${end}`;
          }
          return match;
        }
      );
    }

    if (modified) {
      await fs.writeFile(filePath, newContent);
      if (config.verbose) {
        console.log(`✓ Actualizado: ${filePath}`);
        console.log(`   Ejemplo de cambio: src/views/inicio.html → inicio`);
      }
    } else if (config.verbose) {
      console.log(`⏭️ Sin cambios: ${filePath}`);
    }
  } catch (error) {
    console.error(`⚠️ Error procesando archivo ${filePath}:`, error);
  }
}

// Ejecución principal
(async () => {
  console.log('🔄 Iniciando procesamiento de archivos...');
  console.log(`Buscando prefijos a eliminar: ${config.pathsToRemove.join(', ')}`);
  await processDirectory(config.sourceDir);
  console.log('✅ Proceso completado');
})();