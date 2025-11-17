import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Channel, { ChannelType, ChannelMemberRole } from '#models/channel'
import User from '#models/user'
import { faker } from '@faker-js/faker'

export default class ChannelSeeder extends BaseSeeder {
  async run() {
    const count = await Channel.query().count('* as total').first()
    if (Number(count?.$extras.total) > 0) {
      console.log('Channels already exist, skipping ChannelSeeder')
      return
    }

    const users = await User.all()
    if (users.length == 0) {
      console.warn('No users found, creating channels without members!')
    }

    await Channel.create({
      name: 'general',
      type: faker.helpers.arrayElement([ChannelType.PUBLIC]),
    })

    const channels = await Promise.all(
      Array.from({ length: 4 }).map((_, i) =>
        Channel.create({
          name: (faker.commerce.department() + ` ${i + 1}`).replace(/\s+/g, '-'),
          type: faker.helpers.arrayElement([ChannelType.PUBLIC, ChannelType.PRIVATE]),
        })
      )
    )

    // Attach random members (if users exist)
    if (users.length == 0) {
      console.log('No users found, skipping members seeding!')
      return
    }

    for (const channel of channels) {
      const members = faker.helpers.arrayElements(users, faker.number.int({ min: 3, max: 7 })) // Rand memebers
      const admin = members.filter((u) => u.email.includes('own.co'))[0] ?? faker.helpers.arrayElement(members)

      for (const user of members) {
        const role = user.id == admin.id ? ChannelMemberRole.ADMIN : ChannelMemberRole.MEMBER
        await channel.related('members').attach({
          [user.id]: {
            role,
          },
        })
      }
    }

    console.log(`Channels seeded (and added members if possible)`)
  }
}
