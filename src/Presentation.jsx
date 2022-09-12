import './App.css'

function Presentation () {
  document.addEventListener('contextmenu', (event) => {
    event.preventDefault()
  })
  return (
    <>
      <div className='main'>
        <iframe
          src='https://uaieduar-my.sharepoint.com/personal/francoadrian_balich_uai_edu_ar/_layouts/15/Doc.aspx?sourcedoc={3d75a38a-7a36-4040-8e84-77f72fe12e2d}&amp;action=embedview&amp;wdAr=1.7777777777777777'
          width='100%'
          height='100%'
          frameborder='0'
        >
          Esto es un documento de
          <a target='_blank' href='https://office.com' rel='noreferrer'>
            Microsoft Office
          </a> incrustado con tecnología de
          <a target='_blank' href='https://office.com/webapps' rel='noreferrer'>
            Office
          </a>.
        </iframe>

      </div>
    </>
  )
}

export default Presentation
