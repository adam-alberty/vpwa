import { UserStatus } from '#models/user'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').notNullable().primary().defaultTo(this.raw('gen_random_uuid()'))
      table.string('username', 16).notNullable().unique()
      table.string('email', 254).notNullable().unique()
      table.string('password', 256).notNullable()
      table.string('first_name', 16).notNullable()
      table.string('last_name', 16).notNullable()
      table.enum('status', Object.values(UserStatus)).nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
