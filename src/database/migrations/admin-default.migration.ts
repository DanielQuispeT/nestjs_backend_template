import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export class InsertAdminDefault3009202414245 implements MigrationInterface {
  constructor() {}
  public async up(queryRunner: QueryRunner): Promise<void> {
    const id = uuidv4();
    const id_admin = uuidv4();
    const id_user = uuidv4();
    const email = process.env.DEFAULT_EMAIL;
    const pass = process.env.DEFAULT_PASSWORD;
    try {
      await queryRunner.query(
        `INSERT INTO roles (id, nombre, descripcion) VALUES ( '${id_admin}', '${process.env.ROLE_ADMIN}', 'Administrador del sistema'), ( '${id_user}', '${process.env.ROLE_USER}', 'Usuario normal del sistema')`,
      );
      await queryRunner.query(
        `INSERT INTO personas (id, email, nombres, apellidos, email_verificado) VALUES ('${id}', '${email}','superAdmin','superAdmin',true)`,
      );

      await queryRunner.query(
        `INSERT INTO credenciales (id, password, persona_id) VALUES (uuid(), '${await bcrypt.hash(pass, 10)}','${id}')`,
      );

      await queryRunner.query(
        `INSERT INTO personas_roles(id, persona_id, personalizado, rol_id) VALUES (uuid(),'${id}',false,'${id_admin}'), (uuid(),'${id}',false,'${id_user}')`,
      );
    } catch (e) {
      console.error(
        'Error al insertar el usuario admin. El error es: ',
        e.message,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
/* 
Comando para la creacion de la migracion:
    npx typeorm migration:create ./src/database/migrations/NOMBRE_DE_LA_MIGRACION
*/
