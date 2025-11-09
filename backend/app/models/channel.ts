import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export enum ChannelType {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export enum ChannelMemberRole {
  MEMBER = 'member',
  ADMIN = 'admin', // Maybe rename to owner to fit the usecase more closely
}

export default class Channel extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare type: ChannelType

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => User, {
    pivotTable: 'channel_members',
    localKey: 'id',
    relatedKey: 'id',
    pivotForeignKey: 'channel_id',
    pivotRelatedForeignKey: 'user_id',
    pivotColumns: ['role', 'joined_at'],
    pivotTimestamps: {
      createdAt: 'joined_at',
      updatedAt: false,
    },
  })
  declare members: ManyToMany<typeof User>
}
