'use strict';

import bcrypt from 'bcryptjs';

export async function up(queryInterface, Sequelize) {
  const hashedPassword = await bcrypt.hash('12345678980', 10);

  await queryInterface.bulkInsert('users', [
    {
      id: 1,
      first_name: 'Willian',
      last_name_1: 'Lupin',
      last_name_2: 'Perez',
      email: 'wlp@gmail.com',
      password_hash: hashedPassword,
      role: 1, // Administrador
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('users', null, {});
}
