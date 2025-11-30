import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'messages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').notNullable().primary().defaultTo(this.raw('gen_random_uuid()'))
      table.string('content', 65_536).notNullable()
      table
        .uuid('channel_id')
        .notNullable()
        .references('id')
        .inTable('channels')
        .onDelete('CASCADE')
      table.uuid('sender_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
