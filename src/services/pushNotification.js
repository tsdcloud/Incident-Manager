import webPush from 'web-push';
import { ADDRESS, prisma, VAPID_PRIVATE_KEY, VAPID_PUBLIC_KEY } from '../config.js';


const vapidKeys = {
    publicKey: VAPID_PUBLIC_KEY,
    privateKey: VAPID_PRIVATE_KEY,
};

webPush.setVapidDetails(
    `https://berp.bfcgroupsa.com`,
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );
  

  export const sendPushNotification = async (subscription, payload) => {
    try {
      await webPush.sendNotification(subscription, JSON.stringify(payload));
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  };


  export const getSubscriptiobListService = async ()=>{
    try {
      let subscriptions = await prisma.pushSubscription.findMany();
      return subscriptions;
    } catch (error) {
      console.error(`Failed to get subscribers: ${error}`);
    }
  }

  export { webPush };