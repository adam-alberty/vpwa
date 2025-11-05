/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import ChannelsController from '#controllers/channels_controller'
import SessionController from '#controllers/session_controller'
import UsersController from '#controllers/users_controller'

// Global matcher for "id" to be uuid
router.where('id', router.matchers.uuid())

router.post('/users', [UsersController, 'register'])
router.post('/session', [SessionController, 'login'])

// Protected routes
router
  .group(() => {
    // Channels
    router.post('/channels', [ChannelsController, 'create'])
    router.delete('/channels/:id', [ChannelsController, 'leave'])
    router.get('/channels', [ChannelsController, 'list'])

    router.put('/users', [UsersController, 'update'])
    router.delete('/users', [UsersController, 'delete'])

    router.delete('/session', [SessionController, 'delete'])
    router.get('/session', [SessionController, 'me'])
  })
  .use(middleware.auth())
