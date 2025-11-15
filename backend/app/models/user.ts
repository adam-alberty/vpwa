import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Channel from '#models/channel'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import { Secret } from '@adonisjs/core/helpers'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export enum UserStatus {
  ONLINE = 'online',
  DND = 'dnd',
  OFFLINE = 'offline',
}

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare username: string | null

  @column()
  declare email: string

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column()
  declare status: UserStatus | null

  @column({ serializeAs: null })
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '30 days',
    prefix: 'oat_',
    table: 'auth_access_tokens',
    type: 'auth_token',
    tokenSecretLength: 40,
  })

  @manyToMany(() => Channel, {
    pivotTable: 'channel_members',
    localKey: 'id',
    relatedKey: 'id',
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'channel_id',
    pivotColumns: ['role', 'joined_at'],
    pivotTimestamps: {
      createdAt: 'joined_at',
      updatedAt: false,
    },
  })
  declare channels: ManyToMany<typeof Channel>
}
