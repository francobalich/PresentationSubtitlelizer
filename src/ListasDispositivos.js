
const p = navigator.mediaDevices.getUserMedia({ audio: true, video: false })

p.then(function (mediaStream) {
  console.log(p)
})
if (!navigator.mediaDevices?.enumerateDevices) {
  console.log('enumerateDevices() not supported.')
} else {
  // List cameras and microphones.
  navigator.mediaDevices.enumerateDevices()
    .then((devices) => {
      devices.forEach((device) => {
        console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`)
      })
    })
    .catch((err) => {
      console.error(`${err.name}: ${err.message}`)
    })
}
p.catch(function (err) { console.log(err.name) })
