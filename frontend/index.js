// https://medium.com/@a7ul/beginners-guide-to-web-push-notifications-using-service-workers-cb3474a17679

const check = () => {
    console.log('checking sw and pushmanager support');
    if (!('serviceWorker' in navigator)) {
        throw new Error('No Service Worker support!')
    }
    if (!('PushManager' in window)) {
        throw new Error('No Push API Support!')
    }
}

const registerServiceWorker = async () => {
    console.log('registering sw');
    const swRegistration = await navigator.serviceWorker.register('sw.js'); 
    return swRegistration;
}

const requestNotificationPermission = async () => {
    console.log('requesting notification permission');
    const permission = await window.Notification.requestPermission();
    // value of permission can be 'granted', 'default', 'denied'
        // granted: user has accepted the request
        // default: user has dismissed the notification permission popup by clicking on x
        // denied: user has denied the request.
    if(permission !== 'granted'){
        throw new Error('Permission not granted for Notification');
    }
}

const showLocalNotification = (title, body, swRegistration) => {
    console.log('showing local notification');
    const options = {
        body
    };
    swRegistration.showNotification(title, options);
}

const main = async () => { //notice I changed main to async function so that I can use await for registerServiceWorker
    check();
    registerServiceWorker().then(async swRegistration => {
        console.log('the registration',swRegistration );
        const permission = await requestNotificationPermission();
        showLocalNotification('This is title', 'this is the message', swRegistration);
    })
}

const testPush = async () => {
    console.log('testing push via api');
    const SERVER_URL = 'http://localhost:4000/send-notification'
    const response = await fetch(SERVER_URL, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.json()
}



/* *********************************
* INFO
************************************ 
*
* MAIN JS THREAD (index.js)
* runs when we are browing web page with javascript
* should only be used for ui stuff (DOM/asking permission)
*
* WORKER THREAD (sw.js)
* independent js thread, runs in the background, even when page has been closed
* should be used for listening for events and showing the notifications
*/

