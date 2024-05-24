import notifee, { AndroidImportance, EventType, TimestampTrigger, TriggerType } from '@notifee/react-native';

class NotificationUtils 
{
    static isTaskRegistered = false;

    static registerTask() {
        if (!this.isTaskRegistered) {
          notifee.onBackgroundEvent(async ({ type, detail }) => {
            switch (type) {
              case EventType.DISMISSED:
                console.log('Notification was dismissed', detail.notification);
                break;
              case EventType.PRESS:
                console.log('Notification was pressed', detail.notification);
                break;
              default:
                break;
            }
          });
    
          this.isTaskRegistered = true;
        }
    }

    static async createChannel() 
    {
        const channelId = await notifee.createChannel(
        {
            id: 'default',
            name: 'Default Channel',
            importance: AndroidImportance.HIGH,
            vibration: true,
        });

        return channelId;
    }

    static async displayNotification() 
    {
        const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
          });
      
        await notifee.displayNotification({
          title: 'Notification Title',
          body: 'Notification Body',
          android: {
            channelId,
          },
        });
    }

    static async scheduleNotification(timestamp: number) 
    {
        this.registerTask();
        const channelId = await notifee.createChannel(
        {
            id: 'default',
            name: 'Default Channel',
        });
  
        const trigger: TimestampTrigger = 
        {
            type: TriggerType.TIMESTAMP,
            //   timestamp: date.getTime(),
            // timestamp: (new Date()).getTime() + 5 * 1000,
            timestamp: timestamp,
        };
          
        await notifee.createTriggerNotification(
        {
            title: 'Scheduled Notification',
            body: 'This notification was scheduled 1 minute ago BBBOOOOOYYYYAAAAA!!!!!!!!!!',
            android: 
            {
              channelId,
            },
        }, trigger);
    }
}

export default NotificationUtils;