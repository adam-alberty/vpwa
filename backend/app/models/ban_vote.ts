import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import Channel, { ChannelMemberRole } from '#models/channel'
import User from '#models/user'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'

export default class BanVote extends BaseModel {
  @column({ isPrimary: true })
  declare id: string // uuid

  @column()
  declare channelId: string

  @column()
  declare voterId: string

  @column()
  declare bannedId: string

  @belongsTo(() => Channel, { foreignKey: 'channelId' })
  declare channel: BelongsTo<typeof Channel>

  @belongsTo(() => User, { foreignKey: 'voterId' })
  declare voter: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'bannedId' })
  declare bannedUser: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  public static async isBanned(channelId: string, userId: string, tx?: TransactionClientContract) {
    const client = tx ? { client: tx } : undefined

    // Count normal ban votes
    const banCountResult = await BanVote.query(client)
      .where('channelId', channelId)
      .andWhere('bannedId', userId)
      .count('* as total')
      .first()

    const banCount = +banCountResult?.$extras.total
    if (banCount >= 3)
      return banCount

    // Admin voter
    const adminBan = await BanVote.query(client)
      .where('ban_votes.channel_id', channelId)
      .andWhere('ban_votes.banned_id', userId)
      .join('channel_members', (join) => {
        join.on('channel_members.user_id', '=', 'ban_votes.voter_id')
          .on('channel_members.channel_id', '=', 'ban_votes.channel_id')
      })
      .andWhere('channel_members.role', ChannelMemberRole.ADMIN)
      .first()

    return adminBan
  }
}
