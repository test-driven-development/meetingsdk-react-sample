import React from 'react'

import './App.css'
import ZoomMtgEmbedded from '@zoomus/websdk/embedded'

export default function App() {
  const client = ZoomMtgEmbedded.createClient()

  // setup your signature endpoint here: https://github.com/zoom/meetingsdk-sample-signature-node.js
  const signatureEndpoint = process.env.REACT_APP_SIGNATURE_ENDPOINT
  // This Sample App has been updated to use SDK App type credentials https://marketplace.zoom.us/docs/guides/build/sdk-app
  const sdkKey = process.env.REACT_APP_ZOOM_SDK_KEY
  const meetingNumber = process.env.REACT_APP_MEETING_NUMBER
  const role = 0
  const userName = 'React'
  const userEmail = process.env.REACT_APP_USER_EMAIL
  const password = process.env.REACT_APP_MEETING_PASSWORD
  // pass in the registrant's token if your meeting or webinar requires registration. More info here:
  // Meetings: https://marketplace.zoom.us/docs/sdk/native-sdks/web/component-view/meetings#join-registered
  // Webinars: https://marketplace.zoom.us/docs/sdk/native-sdks/web/component-view/webinars#join-registered
  const registrantToken = ''

  let signature = ''
  function getSignature(e) {
    e.preventDefault()

    fetch(signatureEndpoint, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        meetingNumber: meetingNumber,
        role: role,
      }),
    })
      .then(res => res.json())
      .then(_ => {
        startMeeting(signature)
      })
      .catch(error => {
        console.error(error)
      })
  }

  function startMeeting(signature) {
    let meetingSDKElement = document.getElementById('meetingSDKElement')

    client
      .init({
        debug: true,
        zoomAppRoot: meetingSDKElement,
        language: 'en-US',
        customize: {
          meetingInfo: [
            'topic',
            'host',
            'mn',
            'pwd',
            'telPwd',
            'invite',
            'participant',
            'dc',
            'enctype',
          ],
          toolbar: {
            buttons: [
              {
                text: 'Custom Button',
                className: 'CustomButton',
                onClick: () => {
                  console.log('custom button')
                },
              },
            ],
          },
        },
      })
      .then(() => {
        console.log('init success')
      })
      .catch(error => {
        console.log('init error', error)
      })

    client
      .join({
        sdkKey: sdkKey,
        signature: signature,
        meetingNumber: meetingNumber,
        password: password,
        userName: userName,
        userEmail: userEmail,
        tk: registrantToken,
      })
      .then(res => {
        console.log(JSON.stringify(res))
        console.log('join meeting success')
      })
      .catch(error => {
        console.log('join meeting error', error)
      })
  }

  return (
    <div className="App">
      <main>
        <h1>Zoom Meeting SDK Sample React</h1>

        {/* For Component View */}
        <div id="meetingSDKElement">
          {/* Zoom Meeting SDK Component View Rendered Here */}
        </div>

        <button
          onClick={e => {
            if (signature) startMeeting(signature)
            else getSignature(e)
          }}
        >
          Join Meeting
        </button>
      </main>
    </div>
  )
}
