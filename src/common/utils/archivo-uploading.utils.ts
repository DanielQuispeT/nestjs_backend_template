import { extname } from 'path';
import { FuncionesAux } from './funciones-aux';
import * as uuid from 'uuid';

export const editFileName = (req, file, callback) => {
  let name = file.originalname.split('.')[0];
  name = FuncionesAux.reemplazarEspaciosPorGuionesBajos(name);
  name = FuncionesAux.reemplazarGuionesPorGuionesBajos(name);
  name = FuncionesAux.reemplazarMasPorGuionesBajos(name);
  name = FuncionesAux.reemplazarPuntosPorGuionesBajos(name);
  let date = new Date().getTime();
  let id = uuid.v4();
  const fileExtName = extname(file.originalname);
  const randomName = Array(9)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${date}+${id}${fileExtName}`);
};
