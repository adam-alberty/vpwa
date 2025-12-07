export function createNotification(title: string, options?: NotificationOptions) {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications.');
    return;
  }
  if (Notification.permission == 'granted') {
    return new Notification(title, options);
  }
}

export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications.');
    return;
  }
  if (Notification.permission != 'granted') {
    console.log('Requesting notification permission...');
    const permission = await Notification.requestPermission();
    return permission;
  }
  return Notification.permission;
}
