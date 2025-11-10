'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert('roles', [
    {
      id: 1,
      description: 'Administrador',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 2,
      description: 'Cliente',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 3,
      description: 'Cotizador',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('roles', null, {});
}
