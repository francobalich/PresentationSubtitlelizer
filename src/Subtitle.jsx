import React, { useState } from 'react'
import { getTokenOrRefresh } from './token_util'
import { ResultReason, CancellationReason } from 'microsoft-cognitiveservices-speech-sdk'
import './App.css'
const speechsdk = require('microsoft-cognitiveservices-speech-sdk')

export default function App () {
  const [state, setState] = useState({ displayText: 'Inicializado: Esperando a que hable...' })
  const [speech, setSpeech] = useState(false)

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
  async function sttFromMic (state) {
    const tokenObj = await getTokenOrRefresh()
    const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(tokenObj.authToken, tokenObj.region)
    speechConfig.speechRecognitionLanguage = 'es-ES'
    speechConfig.enableDictation()
    const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput()
    const recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig)
    let displayText
    const generarMensaje = (msg) => { /*
      const maxPalabras = 15
      const mensaje = msg.split(' ')
      if (mensaje.length >= maxPalabras) {
        mensaje = mensaje[0]
        msg = ''
        mensaje.forEach(texto => {
          msg = msg + ' ' + texto
        })
      } */
      return msg
    }
    setState({
      displayText: 'Hable por el microfono...'
    })
    recognizer.recognizing = (s, e) => {
      displayText = generarMensaje(e.result.text)
      setState({
        displayText
      })
    }
    recognizer.recognized = (s, e) => {
      if (e.result.reason === ResultReason.RecognizedSpeech) {
        displayText = generarMensaje(e.result.text)
      } else if (e.result.reason === ResultReason.NoMatch) {
        displayText = 'No se pudo reconocer nada.'
      }
      setState({
        displayText
      })
    }
    recognizer.canceled = (s, e) => {
      console.log(`CANCELED: Reason=${e.reason}`)
      if (e.reason === CancellationReason.Error) {
        displayText = `"Código del error=${e.errorCode}`
        displayText = `"Detalles del error=${e.errorDetails}`
        displayText = '¿Seteaste los valores de las keys?'
      }
      recognizer.stopContinuousRecognitionAsync()
      setSpeech(false)
      setState({
        displayText
      })
    }
    recognizer.sessionStopped = (s, e) => {
      displayText = '\n    Se paro la sesión'
      recognizer.stopContinuousRecognitionAsync()
      setSpeech(false)
      setState({
        displayText
      })
    }
    recognizer.startContinuousRecognitionAsync()
    setSpeech(true)
  }
  return (
    <div className=''>
      <div className=''>
        <button className={'button startButton ' + ((speech) ? 'green' : 'red')} onClick={() => sttFromMic(true)}>Iniciar</button>
        <div className='subtitleSpace'>
          <div className='subtitleContainer '>
            <p className='subtitleText'>{state.displayText}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
