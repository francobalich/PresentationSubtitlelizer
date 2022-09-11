import React, { useState } from 'react'
import { getTokenOrRefresh } from './token_util'
import { ResultReason, CancellationReason } from 'microsoft-cognitiveservices-speech-sdk'

const speechsdk = require('microsoft-cognitiveservices-speech-sdk')

export default function App () {
  const [state, setState] = useState({ displayText: 'INITIALIZED: ready to test speech...' })

  async function componentDidMount () {
    // check for valid speech key/region
    const tokenRes = await getTokenOrRefresh()
    if (tokenRes.authToken === null) {
      setState({
        displayText: 'FATAL_ERROR: ' + tokenRes.error
      })
    }
  }
  componentDidMount()
  async function sttFromMic () {
    const tokenObj = await getTokenOrRefresh()
    const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(tokenObj.authToken, tokenObj.region)
    speechConfig.speechRecognitionLanguage = 'es-ES'

    const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput()
    const recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig)

    setState({
      displayText: 'speak into your microphone...'
    })
    let displayText
    recognizer.recognizing = (s, e) => {
      displayText = `RECOGNIZING: Text=${e.result.text}`
      setState({
        displayText
      })
    }
    recognizer.recognized = (s, e) => {
      if (e.result.reason === ResultReason.RecognizedSpeech) {
        displayText = `RECOGNIZED: Text=${e.result.text}`
      } else if (e.result.reason === ResultReason.NoMatch) {
        displayText = 'NOMATCH: Speech could not be recognized.'
      }
      setState({
        displayText
      })
    }
    recognizer.canceled = (s, e) => {
      console.log(`CANCELED: Reason=${e.reason}`)
      if (e.reason === CancellationReason.Error) {
        displayText = `"CANCELED: ErrorCode=${e.errorCode}`
        displayText = `"CANCELED: ErrorDetails=${e.errorDetails}`
        displayText = 'CANCELED: Did you set the speech resource key and region values?'
      }
      recognizer.stopContinuousRecognitionAsync()
      setState({
        displayText
      })
    }
    recognizer.sessionStopped = (s, e) => {
      displayText = '\n    Session stopped event.'
      recognizer.stopContinuousRecognitionAsync()
      setState({
        displayText
      })
    }
    recognizer.startContinuousRecognitionAsync()
  }
  return (
    <div className='app-container'>
      <div className='row main-container'>
        <div className='col-6'>
          <i className='fas fa-microphone fa-lg mr-2' onClick={() => sttFromMic()} />
          Convert speech to text from your mic.
        </div>
        <div className='col-6 output-display rounded'>
          <code>{state.displayText}</code>
        </div>
      </div>
    </div>
  )
}
