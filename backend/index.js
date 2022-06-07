const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const webpush = require('web-push')
const app = express()
app.use(cors())
app.use(bodyParser.json())
const port = 4000
app.get('/', (req, res) => res.send('Hello World!'))
const dummyDb = { subscription: null } //dummy in memory store
const saveToDatabase = async subscription => {
    console.log('api saving to db');
  // Since this is a demo app, I am going to save this in a dummy in memory store. Do not do this in your apps.
  // Here you should be writing your db logic to save it.
  dummyDb.subscription = subscription
}
// The new /save-subscription endpoint
app.post('/save-subscription', async (req, res) => {
    console.log('api POST /save-subscription');
  const subscription = req.body
  await saveToDatabase(subscription) //Method to save the subscription to Database
  res.json({ message: 'success' })
})
const vapidKeys = {
  publicKey:
  'BDFhBVNEfR6hKdJJwCrVfpNVAYKjMx98348oDJWV0dwzWPG2EQ96KvzqNZznODtQy52FIf5mwpM6BbInl3hRTb0',
  privateKey: 'flJTVtWLMiYzfG4cLO133opRE_1JQ527K7TaVDyHEK4',
}
// Public Key:
// BDFhBVNEfR6hKdJJwCrVfpNVAYKjMx98348oDJWV0dwzWPG2EQ96KvzqNZznODtQy52FIf5mwpM6BbInl3hRTb0
// Private Key:
// flJTVtWLMiYzfG4cLO133opRE_1JQ527K7TaVDyHEK4

//setting our previously generated VAPID keys
webpush.setVapidDetails(
  'mailto:myuserid@email.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
)
//function to send the notification to the subscribed device
const sendNotification = (subscription, dataToSend) => {
    console.log('API is pushing');
  webpush.sendNotification(subscription, dataToSend)
}
//route to test send notification
app.get('/send-notification', (req, res) => {
    console.log('api GET /send-notification')
  const subscription = dummyDb.subscription //get subscription from your databse here.
  const message = 'Hello World'
  sendNotification(subscription, message)
  res.json({ message: 'message sent' })
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))