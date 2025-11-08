import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User, { UserStatus } from '#models/user'
import { faker } from '@faker-js/faker'

export default class UserSeeder extends BaseSeeder {
  async run() {
    const count = await User.query().count('* as total').first()
    if (Number(count?.$extras.total) > 0) {
      console.log('Users already exist, skipping UserSeeder')
      return
    }

    var firstName = faker.person.firstName()
    var lastName = faker.person.lastName()
    await User.create({
      username: faker.internet.username({ firstName, lastName }),
      email: `test@own.co`,
      firstName,
      lastName,
      status: UserStatus.OFFLINE,
      password: '12345678',
    })

    const users = await Promise.all(
      Array.from({ length: 14 }).map(async (_, i) => {
        firstName = faker.person.firstName()
        lastName = faker.person.lastName()

        // 15% chance this user is an admin
        const isAdmin = faker.number.int({ min: 1, max: 100 }) <= 15

        return User.create({
          username: faker.internet.username({ firstName, lastName }),
          email: `${firstName.toLowerCase()}${i}@${isAdmin ? 'own' : 'tst'}.co`,
          firstName,
          lastName,
          status: UserStatus.OFFLINE,
          password: '12345678',
        })
      })
    )

    console.log(`Seeded ${users.length} users`)
  }
}
