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

// Auth
router.post('/auth/login', [SessionController, 'store'])
router.post('/auth/logout', [SessionController, 'destroy']).use(middleware.auth())

// Users
router.post('/users/register', [UsersController, 'store'])

// Protected routes
router
  .group(() => {
    // Channels
    router.post('/channels/create', [ChannelsController, 'create'])
    router.post('/channels/leave', [ChannelsController, 'leave'])
  })
  .use(middleware.auth())
