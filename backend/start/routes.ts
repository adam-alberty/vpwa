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
import UsersController from '#controllers/users_controller'
import MessagesController from '#controllers/messages_controller'
import ChannelMembersController from '#controllers/channel_members_controller'
import BanVotesController from '#controllers/ban_votes_controller'
import ChannelInvitesController from '#controllers/channel_invites_controller'

// Global matcher for "id" to be uuid
router.where('id', router.matchers.uuid())

router.post('/users', [UsersController, 'register'])
router.post('/session', [UsersController, 'login'])

// Protected routes
router
  .group(() => {
    // Channels
    router.post('/channels', [ChannelsController, 'create'])
    router.get('/channels', [ChannelsController, 'list'])
    router.get('/channels/:id', [ChannelsController, 'get'])

    // Messages
    router.get('/channels/:id/messages', [MessagesController, 'list'])

    // Channel members
    router.post('/channels/join', [ChannelMembersController, 'join'])
    router.delete('/channels/:id', [ChannelMembersController, 'leave'])
    router.get('/channels/:id/members', [ChannelMembersController, 'list'])

    router.delete('/channels/:id/kick/:userId', [BanVotesController, 'kickMember'])

    // Invites
    router.get('/invites', [ChannelInvitesController, 'list'])
    router.post('/channels/:id/invite', [ChannelInvitesController, 'invite'])
    router.delete('/channels/:id/invite/accept', [ChannelInvitesController, 'acceptInvite'])
    router.delete('/channels/:id/invite/reject', [ChannelInvitesController, 'rejectInvite'])

    // User management
    // router.put('/users', [UsersController, 'update'])
    router.delete('/users', [UsersController, 'delete'])

    router.delete('/session', [UsersController, 'logout'])
    router.get('/session', [UsersController, 'me'])
  })
  .use(middleware.auth())
