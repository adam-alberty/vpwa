import { ChannelMemberRole } from '#models/channel'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'channel_members'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').notNullable().primary().defaultTo(this.raw('gen_random_uuid()'))
      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table
        .uuid('channel_id')
        .notNullable()
        .references('id')
        .inTable('channels')
        .onDelete('CASCADE')

      table.unique(['channel_id', 'user_id'])

      table
        .enum('role', Object.values(ChannelMemberRole) as [string, ...string[]])
        .notNullable()
        .defaultTo(ChannelMemberRole.MEMBER)

      table.timestamp('joined_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
