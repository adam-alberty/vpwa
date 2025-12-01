import db from '@adonisjs/lucid/services/db'

/**
 * Cleans up channels without activity last 30 days
 */
async function deleteInactiveChannels() {
  // TODO: does not clean up channels without any messages
  try {
    await db.rawQuery(
      `
      DELETE FROM channels
      WHERE id IN (
        SELECT channel_id
        FROM (
          SELECT 
            channel_id,
            MAX(GREATEST(created_at, updated_at)) AS latest_message
          FROM messages
          GROUP BY channel_id
        ) AS t
        WHERE t.latest_message < NOW() - INTERVAL '30 days'
      )`
    )
    console.log('[CRON] Deleted inactive channels')
  } catch (err) {
    console.error('[CRON] Inactive channel cleanup failed:', err)
  }
}

console.log('[CRON] Setting up cron for deleting inactive channels')
const DAY = 24 * 60 * 60 * 1000
deleteInactiveChannels()
setInterval(deleteInactiveChannels, DAY)
