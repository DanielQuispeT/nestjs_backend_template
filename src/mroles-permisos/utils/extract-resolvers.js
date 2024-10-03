/* Comando para ejecutar el script: 
node src/mroles-permisos/utils/extract-resolvers.js
*/
const path = require('path');
const glob = require('glob'); // Importar glob sin llaves
const fs = require('fs-extra');

// Ruta para encontrar los archivos de resolvers
const resolverPattern = './src/**/*.resolver.ts';
const controllerPattern = './src/**/*.controller.ts';

// Buscar archivos que coincidan con el patrón
const resolverFiles = glob.sync(resolverPattern);
const controllerFiles = glob.sync(controllerPattern);

// Arrays para almacenar los métodos encontrados y sus nombres
const arrayMetodos = [];
const namesMethos = [];

// Iterar sobre los archivos encontrados
if (resolverFiles.length !== 0) {
  resolverFiles.forEach((file) => {
    const content = fs.readFileSync(file, 'utf8');

    // Capturar el nombre del resolver
    const resolverNameMatch = content.match(/export class (\w+)Resolver/);

    if (resolverNameMatch) {
      const resolverName = resolverNameMatch[1];

      // Expresión regular para capturar métodos decorados
      const methodMatches = Array.from(
        content.matchAll(
          /@(Query|Mutation|Subscription)\s*\(\s*(?:[^()]|\((?:[^()]|\([^()]*\))*\))*\)\s*async?\s+(\w+)\s*/g,
        ),
      );

      // Añadir los métodos encontrados al array
      methodMatches.forEach((match) => {
        const methodName = match[2];
        namesMethos.push(methodName);
        arrayMetodos.push(`${resolverName}Resolver.${methodName}`);
      });
    }
  });

  controllerFiles.forEach((file) => {
    const content = fs.readFileSync(file, 'utf8');
    const controllerNameMatch = content.match(/export class (\w+)Controller/);

    if (controllerNameMatch) {
      const controllerName = controllerNameMatch[1];
      const methodMatches = Array.from(
        content.matchAll(
          /@(Get|Post|Put|Delete)\(\s*(?:[^()]|\((?:[^()]|\([^()]*\))*\))*\)\s*async?\s+(\w+)\s*/g,
        ),
      );
      methodMatches.forEach((match) => {
        const methodName = match[2];
        namesMethos.push(methodName);
        arrayMetodos.push(`${controllerName}Controller.${methodName}`);
      });
    }
  });
}

// Ordenar alfabéticamente
arrayMetodos.sort();
namesMethos.sort();

// Crear el contenido para el archivo de configuración
const configContent = `export const PruebaPermissionsConfig = {\n${arrayMetodos.map((method) => `  '${method}': [],`).join('\n')}\n};\n`;

// Crear el contenido para el archivo con solo nombres de métodos
const namesContent = `export const MethodNames = [\n${namesMethos.map((method) => `  '${method}',`).join('\n')}\n];\n`;

// Combinar ambos contenidos
const combinedContent = `${configContent}\n${namesContent}`;

// Escribir o sobrescribir el archivo de configuración
const outputFilePath = path.join(
  __dirname,
  'generate-method-for-permission.enum.ts',
);
fs.outputFileSync(outputFilePath, combinedContent);
