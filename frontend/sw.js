'use strict';
const urlB64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
    const rawData = atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}

const saveSubscription = async subscription => {
    console.log('saving the subscription');
    const SERVER_URL = 'http://localhost:4000/save-subscription'
    const response = await fetch(SERVER_URL, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    })
    return response.json()
  }

self.addEventListener('activate', async () => {
    console.log('sw activated');
    try {
        console.log('subscribing with public key');
        const applicationServerKey = urlB64ToUint8Array('BDFhBVNEfR6hKdJJwCrVfpNVAYKjMx98348oDJWV0dwzWPG2EQ96KvzqNZznODtQy52FIf5mwpM6BbInl3hRTb0');
        const opt = { applicationServerKey, userVisibleOnly: true };
        const sub = await self.registration.pushManager.subscribe(opt);
        console.log(JSON.stringify(sub));
        const response = await saveSubscription(sub);
        console.log(response);
    } catch (err) {
        console.error('ERROR in sw activate', err);
    }
});


self.addEventListener('push',
(event) => {
    if (event.data){
        console.log('push received', event.data.text);
        showLocalNotification("Yolo", event.data.text(),  self.registration);
    }
    else {
        console.log('push received but no data');
    }
},
(err) => console.error('push NOT received'));


const showLocalNotification = (title, body, swRegistration) => {
    const options = {
      body: 'this is the body'
      // here you can add more properties like icon, image, vibrate, etc.
    };
    swRegistration.showNotification(title, options);
  };

/* PUSH SERVICE
* --------------------------------------------
*
* receives network request, validates it and delivers push message to appropriate browser (if browser offline, message queued until back online)
*/



// THE KEYS
// -------------------------------------------
// Public Key:
// BDFhBVNEfR6hKdJJwCrVfpNVAYKjMx98348oDJWV0dwzWPG2EQ96KvzqNZznODtQy52FIf5mwpM6BbInl3hRTb0

// Private Key:
// flJTVtWLMiYzfG4cLO133opRE_1JQ527K7TaVDyHEK4