import { EntitySchema } from 'typeorm';

export const User = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    user_code: {
      type: 'varchar',
      length: 50,
      nullable: false,
      unique: true,
    },
    title: {
      type: 'varchar',
      length: 20,
      nullable: false,
    },
    firstname: {
      type: 'varchar',
      length: 100,
      nullable: false,
    },
    lastname: {
      type: 'varchar',
      length: 100,
      nullable: false,
    },
    email: {
      type: 'varchar',
      length: 150,
      unique: true,
      nullable: false,
    },
    password: {
      type: 'text',
      nullable: false,
    },
    department: {
      type: 'varchar',
      length: 100,
      nullable: true,
    },
    is_active: {
      type: 'boolean',
      default: true,
    },
    last_login: {
      type: 'timestamp',
      nullable: true,
    },
    created_at: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    },
    updated_at: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    },
    profile_image_url: {
      type: 'varchar',
      length: 255,
      nullable: true,
    },
  },
  relations: {
    role: {
      type: 'many-to-one',
      target: 'Role',
      joinColumn: {
        name: 'role_id',
      },
      nullable: true,
      onDelete: 'SET NULL',
    },
  },
});