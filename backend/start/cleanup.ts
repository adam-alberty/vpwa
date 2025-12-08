import db from '@adonisjs/lucid/services/db'

/**
 * Cleans up channels without activity last 30 days
 */
async function deleteInactiveChannels() {
  try {
    const cleanupChannelsQuery = `
      DELETE FROM channels WHERE id IN (
        SELECT id
        FROM (
          SELECT
            c.id,
            MAX(GREATEST(m.created_at, m.updated_at)) AS latest_message,
            GREATEST(c.created_at, c.updated_at) AS channel_activity
          FROM channels c
          LEFT JOIN messages m ON m.channel_id = c.id
          GROUP BY c.id
        )
        WHERE (
          latest_message IS NOT NULL
          AND latest_message < NOW() - INTERVAL '30 days'
        )
        OR (
          latest_message IS NULL
          AND channel_activity < NOW() - INTERVAL '30 days'
        )
      )
    `
    await db.rawQuery(cleanupChannelsQuery)

    console.log('[CRON] Deleted inactive channels')
  } catch (err) {
    console.error('[CRON] Inactive channel cleanup failed:', err)
  }
}

const DAY = 8 * 60 * 60 * 1000
deleteInactiveChannels()
setInterval(deleteInactiveChannels, DAY)

console.log('[CRON] Cron for deleting inactive channels initialized')
