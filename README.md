# service-workers
js frontend en backend <br>
https://medium.com/@a7ul/beginners-guide-to-web-push-notifications-using-service-workers-cb3474a17679

push en web push protocol <br>
https://web.dev/push-notifications-how-push-works/ <br>
https://web.dev/push-notifications-web-push-protocol/

# steps
1. register sw to browser after checking browsersupport for serviceworker and pushmanager
2. ask browser for permission to show notifications (done once, can be reset in browser settings)
3. subscripe to push notifications (requires public key )
4. save subscription in api 
5. sw listens to push events from browser and tells api to show notificiaton to subscriptions when push is received (requires subscription + private + public key)
