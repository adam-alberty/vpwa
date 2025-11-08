import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Channel from '#models/channel'
import Message from '#models/message'
import { faker } from '@faker-js/faker'

export default class MessageSeeder extends BaseSeeder {
  async run() {
    const count = await Message.query().count('* as total').first()
    if (Number(count?.$extras.total) > 0) {
      console.log('Messages already exist, skipping MessageSeeder')
      return
    }

    const channels = await Channel.query().preload('members')
    if (channels.length === 0) {
      console.warn('No channels found, skipping messages!')
      return
    }

    for (const channel of channels) {
      if (channel.members.length === 0) continue
      await Promise.all(
        Array.from({ length: 10 }).map(() =>
          Message.create({
            channelId: channel.id,
            senderId: faker.helpers.arrayElement(channel.members).id,
            content: faker.lorem.sentence(),
          })
        )
      )
    }

    console.log('Seeded messages for channels')
  }
}
