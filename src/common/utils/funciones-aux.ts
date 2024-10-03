export class FuncionesAux {
  static nombre_completo(persona): string {
    let concat_nombre_completo = persona.nombres + ' ' + persona.apellidos;
    let nombre_completo: string = this.eliminarEspaciosInnecesarios(
      concat_nombre_completo,
    );
    return nombre_completo;
  }

  static reemplazarEspaciosPorGuionesBajos(texto: string) {
    return texto.replace(/ /g, '_');
  }

  static reemplazarGuionesPorGuionesBajos(texto: string) {
    return texto.replace(/-/g, '_');
  }

  static reemplazarMasPorGuionesBajos(texto: string) {
    return texto.replace(/\+/g, '_');
  }

  static reemplazarPuntosPorGuionesBajos(texto: string) {
    return texto.replace(/\./g, '_');
  }

  static generatePassword(passwordLength) {
    var numberChars = '0123456789';
    var upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var lowerChars = 'abcdefghijklmnopqrstuvwxyz';
    var allChars = numberChars + upperChars + lowerChars;
    var randPasswordArray = Array(passwordLength);
    randPasswordArray[0] = numberChars;
    randPasswordArray[1] = upperChars;
    randPasswordArray[2] = lowerChars;
    randPasswordArray = randPasswordArray.fill(allChars, 3);
    return this.shuffleArray(
      randPasswordArray.map(function (x) {
        return x[Math.floor(Math.random() * x.length)];
      }),
    ).join('');
  }
  static shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  static eliminarEspaciosInnecesarios(cadena: String) {
    return cadena.trim().replace('\\s+', ' ');
  }
}

export type OrderDirection = 'ASC' | 'DESC';
export type NestedOrder = { [key: string]: OrderDirection | NestedOrder };
export const OrderIgnore = ['estado_suscripcion'];
export function parseOrder(
  column: string,
  direction: OrderDirection,
): NestedOrder {
  const order: NestedOrder = {};
  const parts = column.split('&');

  parts.forEach((part) => {
    const nestedParts = part.split('.');
    let nestedOrder: NestedOrder = order;

    nestedParts.forEach((key, index) => {
      if (OrderIgnore.includes(key)) return;
      else if (key.endsWith(']')) {
        const [collectionKey, collectionIndex] = key.split('[');
        const indexValue = collectionIndex.slice(0, -1); // Quita el carácter de cierre ]

        if (index === nestedParts.length - 1) {
          nestedOrder[`${collectionKey}[${indexValue}]`] = direction;
        } else {
          if (!nestedOrder[`${collectionKey}[${indexValue}]`]) {
            nestedOrder[`${collectionKey}[${indexValue}]`] = {};
          }
          nestedOrder = nestedOrder[
            `${collectionKey}[${indexValue}]`
          ] as NestedOrder;
        }
      } else {
        if (index === nestedParts.length - 1) {
          nestedOrder[key] = direction;
        } else {
          if (!nestedOrder[key]) {
            nestedOrder[key] = {};
          }
          nestedOrder = nestedOrder[key] as NestedOrder;
        }
      }
    });
  });

  return order;
}

export function ShortLiteralMonthDateTime(
  fecha: Date,
  hora: boolean = true,
): string {
  const meses = [
    'ene.',
    'feb.',
    'mar.',
    'abr.',
    'may.',
    'jun.',
    'jul.',
    'ago.',
    'sep.',
    'oct.',
    'nov.',
    'dic.',
  ];
  const dia = fecha.getDate();
  const mes = meses[fecha.getMonth()];
  const anio = fecha.getFullYear();
  const horas = fecha.getHours().toString().padStart(2, '0');
  const minutos = fecha.getMinutes().toString().padStart(2, '0');

  if (hora) return `${dia} ${mes} ${anio} ${horas}:${minutos}`;
  else return `${dia} ${mes} ${anio}`;
}

export function getContentType(filename: string): string {
  const extension = filename.split('.').pop();
  switch (extension) {
    case 'pdf':
      return 'application/pdf';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'svg':
      return 'image/svg+xml';
    default:
      return 'application/octet-stream';
  }
}

import { createHash } from 'crypto';

export function generateCodigoCompra(fecha_compra: Date, uuid: string): string {
  const yyyy = fecha_compra.getFullYear();
  const mm = (fecha_compra.getMonth() + 1).toString().padStart(2, '0');
  const dd = fecha_compra.getDate().toString().padStart(2, '0');

  // Crear un hash a partir del UUID y el timestamp actual
  const timestamp = Date.now().toString();
  const data = uuid + timestamp;
  const hash = createHash('sha256').update(data).digest('hex');

  // Longitud deseada del substring
  const desiredLength = 8;

  // Generar un índice de inicio aleatorio
  const startIndex = Math.floor(Math.random() * hash.length);

  // Extraer el substring de manera circular
  let circularSubstring = '';
  for (let i = 0; i < desiredLength; i++) {
    circularSubstring += hash[(startIndex + i) % hash.length];
  }

  return `CMP-${yyyy}${mm}${dd}-${circularSubstring}`;
}
