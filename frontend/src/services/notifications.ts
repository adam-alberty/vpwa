export function createNotification(title: string, options?: NotificationOptions) {
  if (window.Notification && Notification.permission === 'granted') {
    return new Notification(title, options);
  }
}
