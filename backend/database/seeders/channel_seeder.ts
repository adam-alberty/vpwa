import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User, { UserStatus } from '#models/user'
import { faker } from '@faker-js/faker'

export default class extends BaseSeeder {
  async run() {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    const users = await Promise.all(
      Array.from({ length: 15 }).map(async (v, i) => {
        return User.create({
          username: faker.internet.username({ firstName, lastName }),
          email: `tst${i}@tst.co`,
          firstName,
          lastName,
          status: faker.helpers.arrayElement([
            UserStatus.OFFLINE
          ]),
          password: '12345678',
        })
      })
    )

    console.log(`Seeded ${users.length} users`)
  }
}
