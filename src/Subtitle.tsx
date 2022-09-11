import { ResultReason, CancellationReason } from 'microsoft-cognitiveservices-speech-sdk'
import { getTokenOrRefresh } from './token_util'
import { useState } from 'react'
const speechsdk = require('microsoft-cognitiveservices-speech-sdk')

function Subtitle () {
  const [state, setState] = useState({ displayText: 'INITIALIZED: ready to test speech...' })
  async function componentDidMount() {
    // check for valid speech key/region
    const tokenRes = await getTokenOrRefresh();
    if (tokenRes.authToken === null) {
        setState({
            displayText: 'FATAL_ERROR: ' + tokenRes.error
        });
    }
}
async function sttFromMic() {
    console.log("A")
   // const tokenObj = await getTokenOrRefresh()
    const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken("8623b7d0721f4db6a9ed6d316b9658ab","eastus");
    speechConfig.speechRecognitionLanguage = 'es-ES'

    console.log("B")
    const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput()
    const recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig)
    let displayText: string

    setState({
      displayText: 'speak into your microphone...'
    })
    recognizer.recognizing = (s: any, e: any) => {
      displayText = `RECOGNIZING: Text=${e.result.text}`
      setState({
        displayText: displayText
      })
    }
    recognizer.recognized = (s: any, e: any) => {
      if (e.result.reason == ResultReason.RecognizedSpeech) {
        displayText = `RECOGNIZED: Text=${e.result.text}`
      } else if (e.result.reason == ResultReason.NoMatch) {
        displayText = 'NOMATCH: Speech could not be recognized.'
      }
      setState({
        displayText: displayText
      })
    }
    recognizer.canceled = (s: any, e: any) => {
      console.log(`CANCELED: Reason=${e.reason}`)
      if (e.reason == CancellationReason.Error) {
        displayText = `"CANCELED: ErrorCode=${e.errorCode}`
        displayText = `"CANCELED: ErrorDetails=${e.errorDetails}`
        displayText = 'CANCELED: Did you set the speech resource key and region values?'
      }
      recognizer.stopContinuousRecognitionAsync()
      setState({
        displayText: displayText
      })
    }
    recognizer.sessionStopped = (s: any, e: any) => {
      displayText = '\n    Session stopped event.'
      recognizer.stopContinuousRecognitionAsync()
      setState({
        displayText: displayText
      })
    }
    recognizer.startContinuousRecognitionAsync()
    setTimeout(() => {
        console.log("stopping")
        recognizer.stopContinuousRecognitionAsync();
    }, 5000);
  }
  return (
    <div>
      <p>{state.displayText}</p>
      <button onClick={()=>sttFromMic()}>
        Escuchar
      </button>
      <button onClick={()=>sttFromMic()}>
        Escuchar
      </button>
    </div>
  )
}

export default Subtitle
