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

// Create session
router.post('/session', [SessionController, 'store'])
// Delete session
router.delete('/session', [SessionController, 'destroy']).use(middleware.auth())
// Register user
router.post('/users', [UsersController, 'store'])

// Protected routes
router
  .group(() => {
    // Channels
    router.post('/channels', [ChannelsController, 'store'])
    router.delete('/channels/:id', [ChannelsController, 'destroy'])

    router.put('/users', [UsersController, 'update'])
    router.delete('/users', [UsersController, 'destroy'])
  })
  .use(middleware.auth())
