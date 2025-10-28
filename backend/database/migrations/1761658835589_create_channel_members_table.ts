import { MemberRole } from '#models/channel_member'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'channel_members'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()

      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table
        .uuid('channel_id')
        .notNullable()
        .references('id')
        .inTable('channels')
        .onDelete('CASCADE')

      table
        .enum('role', Object.values(MemberRole) as [string, ...string[]])
        .notNullable()
        .defaultTo(MemberRole.MEMBER)

      table.timestamp('joined_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
