// ahoxus.js zenith
function gatherEntropy() {
  let entropy = performance.now()
  entropy += Math.random()
  entropy += Date.now()
  entropy += window.screen.availHeight + window.screen.availWidth
  entropy += (navigator.hardwareConcurrency || 4)
  entropy += navigator.userAgent.length
  return entropy
}
function rand(max) {
  const entropy = gatherEntropy()
  return Math.floor(entropy % max)
}
// emulate a zenith answer, with just 2 options
function zenith() {
  // keep in mind zenith has 9 diff answers
  // the idea here to bring the special '0' moon fewer times
  return rand(9) > 0 ? 1 : 0
}

document.addEventListener('DOMContentLoaded', function() {

// lved.js

  // parse query params (dark, light, and/or menu)
  var initialqs = window.location.search

  var themeCheckbox = document.getElementById('toggle-theme')
  var menuCheckbox = document.getElementById('toggle-menu')

  // show all text hidden for noscript
  var sois = document.getElementsByClassName('showonlyifscript')
  for (var i = 0; i < sois.length; i++) {
    sois[i].style.display = 'block'
  }

  // use one of the 3 options set on html
  var themelabels = document.getElementsByClassName('theme')
  function setthemelabels (opt = 1) { // opt expect 1 or 2
    themeCheckbox.checked = (opt === 1) // did not check if it exists because if it doesn't we do have an error anyway
    opt = opt * zenith() // make the option either 0 or opt 
    for (var i = 0; i < themelabels.length; i++) {
      var ps = themelabels[i].getElementsByTagName('p')
      for (var j = 0; j < ps.length; j++) {
        if (j === opt) {
          ps[j].style.display = 'block'
        } else {
          ps[j].style.display = 'none'
        }
      }
    }
  }

  function applyqs (qs) {
    if (qs.includes('dark')) {
      document.documentElement.setAttribute('data-theme','dark')
      setthemelabels(1)
    } else if (qs.includes('light')) {
      document.documentElement.setAttribute('data-theme','light')
      setthemelabels(2)
    }
    if (qs.includes("menu")) {
      menuCheckbox.setAttribute("checked", true)
    }
  }

  function updateurl(hash = null, theme = null, qsmenu = null) {
    if (!hash) hash = window.location.hash
    if (!theme) theme = themeCheckbox && themeCheckbox.checked ? 'dark' : 'light'
    if (!qsmenu) qsmenu = menuCheckbox && menuCheckbox.checked ? 'menu' : ''
    var newurlbase = window.location.pathname
    if (zenith() > 0) {
      newurlbase += '?' + theme + qsmenu
    } else {
      newurlbase += '?' + qsmenu + theme
    }
    // keep hash if present
    if (hash) newurlbase += hash
    if (window.location.href !== newurlbase) {
      window.history.replaceState(null, '', newurlbase)
    }
  }

  // set theme to light if can't find browser preference for dark
    applyqs(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  // and if we have a querystring, extract params from it
  applyqs(initialqs)
  updateurl()

  // menu fallback if browser doesn't support css :checked
  if (!('CSS' in window) || !CSS.supports('selector(:checked)')) {
    var toggle = document.getElementById('toggle-menu')
    var menu   = document.getElementById('menu')
    var label  = document.querySelector('label[for="toggle-menu"]')
    if (toggle && menu && label) {
      // ensure the label is visible in fallback
      label.style.display = 'block'
      // hide menu until label is clicked
      menu.style.display = 'none'
      label.addEventListener('click', function(){
        let menuqs = (menu.style.display === 'none')
        menu.style.display = menuqs ? 'block' : 'none'
        menuCheckbox.setAttribute("checked", ! menuCheckbox.checked)
      }, false)
    }
  }

  // complement css
  if (menuCheckbox) {
    menuCheckbox.addEventListener('change', function(){
      let menuqs = menuCheckbox.checked
      applyqs(menuqs ? 'menu' : '')
      updateurl()
    }, false)
  }

  // theme change
  if (themeCheckbox) {
    themeCheckbox.addEventListener('change', function(){
      // if checked => dark theme
      if (themeCheckbox.checked) {
        document.documentElement.setAttribute('data-theme','dark')
        setthemelabels(1)
      } else {
        // remove or set to 'light'
        //document.documentElement.removeAttribute('data-theme')
        document.documentElement.setAttribute('data-theme','light')
        setthemelabels(2)
      }
      updateurl()
    }, false)
  }

/*
 * kept all this to help creating fallbacks
 *
  // theme logic
  var htmlel = document.documentelement
  var toggles = document.queryselectorall('button[title="toggle theme"]')

  function applytheme(t, btn = null) {
    htmlel.setattribute('data-theme', t)
    updateemoji(t)
    randomizebutton(btn)
    // update query if needed
    updatequery(t)
  }

  function cycletheme(btn) {
    var current = htmlel.getattribute('data-theme')
    var newt = (current === 'dark') ? 'light' : 'dark'
    applytheme(newt, btn)
    // once theme button is pressed, show all sections:
    showallsectionspermanently()
  }

  var initialtheme = getinitialtheme()
  applytheme(initialtheme)

  toggles.foreach(function(btn) {
    btn.addeventlistener('click', () => cycletheme(btn))
  })

  var sitemap = document.queryselector('section[id="sitemap"] a')
  sitemap.addeventlistener('click', () => showallsectionspermanently(sitemap))

  var sections = array.from(document.queryselectorall('section[id]'))
  
  function showsection(id) {
    id = document.queryselector('section[id="'+id+'"]')//)getelementbyid(id)
    if (id) {
      sections.foreach(el => el.style.display = 'none')
      id.style.display = 'block'
    }
    return id
  }

  window.addeventlistener('hashchange', function() {
    var hash = location.hash.slice(1) // remove '#'
    if (hash) {
      hash = showsection(hash)
    }
    if (!hash) {
      // if no hash, show default
      showsection('top')
//      sections.foreach(el => el.style.display = 'none')
    }
  })

  // on load, show the section if hash exists
  var initialhash = location.hash.slice(1)
  if (initialhash) {
    showsection(initialhash)
  } else {
    // no hash, show a default
    sections.foreach(el => el.style.display = 'none')
    showsection('')
  }

  // show/hide sections
  // on hash change, show only that section.
  // if hash is empty or '#', show only top 
  // once theme button is pressed, showallsectionspermanently() is called, and we ignore hash changes.

  var sections = array.prototype.slice.call(document.queryselectorall('section[id]'))
  var themebuttonpressed = false

  function showsectionfromhash() {
    if (themebuttonpressed) return // once pressed, do nothing
    var hash = window.location.hash.replace('#','')
    if (!hash) {
      sections.foreach(sec => sec.style.display = 'none')
      showsection('top')
      return
    }
    // show only the section with this id
    sections.foreach(sec => {
      if (sec.id === hash) sec.style.display = 'block'
      else sec.style.display = 'none'
    })
  }

  showsectionfromhash()

  window.addEventListener('hashchange', showSectionFromHash)

  function showAllSectionsPermanently() {
    // Show all sections and ignore future hash changes
    sections.forEach(sec => sec.style.display = 'block')
    themeButtonPressed = true
  }
*/

  if (window.location.protocol === 'file:') {
    console.debug(
      "[lved] note: when serving this page via file:// " +
      "PWA features (manifest, service worker) will not work. " +
      "you may see an expected CORS error for the manifest + " +
      "to enable PWA functionality, serve this page via HTTP or HTTPS."
    )
  }

  if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .catch(err => {
      if (location.protocol === 'file:') {
        console.trace("[lved] running from `file://` does not allow for full PWA functionality, but you probably don't need it anyway! read more on the full protocol error msg:", err)
      } else {
        console.error('[lved] service worker registration failed:', err)
      }
      })
  }


// for later usage
if (!navigator.onLine) {
  // we know the user stands offline
  // e.g. show fallback UI or queue automatically
} else {
  // fetch something
}

/**
 * ---------------------------------------------------
 * IndexedDB Setup (Offline Queue)
 * ---------------------------------------------------
 */
const DB_NAME = 'emailQueueDB'
const DB_STORE = 'emails'
let db = null

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = (event) => {
      const upgradeDB = event.target.result
      if (!upgradeDB.objectStoreNames.contains(DB_STORE)) {
        upgradeDB.createObjectStore(DB_STORE, { keyPath:'id', autoIncrement:true })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function getDB() {
  if (!db) {
    db = await openDB()
  }
  return db
}

// Save unsent email to the queue
async function saveToQueue(data) {
  const database = await getDB()
  return new Promise((resolve, reject) => {
    const tx = database.transaction(DB_STORE, 'readwrite')
    const store = tx.objectStore(DB_STORE)
    store.add(data)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

// Retry sending all queued emails
async function retryEmails() {
  const database = await getDB()
  const tx = database.transaction(DB_STORE, 'readwrite')
  const store = tx.objectStore(DB_STORE)
  const getAllReq = store.getAll()

  getAllReq.onsuccess = async () => {
    const emails = getAllReq.result
    for (const email of emails) {
      try {
        // Mark them as queued so we can add a subject prefix
        await sendViaAjax({ ...email, queued: true })
        store.delete(email.id); // remove from queue on success
        console.log('Successfully resent queued email:', email)
      } catch (err) {
        console.warn('retry failed for queued email', err)
      }
    }
  }
}

/**
 * ---------------------------------------------------
 * Sending Logic (ajax form)
 * ---------------------------------------------------
 */
async function sendViaAjax(data) {
  // If "data.queued" is true, prefix the subject
  const subjectPrefix = data.queued ? '[AutoQueue] ' : ''
  const subjectLine = `${subjectPrefix}Contact Form: ${data.name || 'unnamed'}`

  // Build a FormData object with the keys ajax form will expect
  const formData = new FormData()
  formData.append('name', data.name || '')
  formData.append('email', data.email || '')
  formData.append('message', data.message || '')
  formData.append('_subject', subjectLine)

  // to replace 
  const response = await fetch('https://formspree.io/f/xlddodzp', {
    method:'POST',
    headers:{
      'Accept':'application/json'
    },
    body: formData
  })

  if (response.ok) {
    return await response.json()
  } else {
    // do we need this here?
    //switchButtonStyles()
    // If not OK, parse the error if possible, otherwise use a fallback
    let msg = 'Oops! There was a problem submitting your form.'
    try {
      const jsonErr = await response.json()
      if (jsonErr.errors) {
        // form ajax often returns an "errors" array with messages
        msg = jsonErr.errors.map(error => error.message).join(', ')
      }
    } catch (parseErr) {
      // If we fail to parse JSON, we'll stick to our fallback message
    }
    throw new Error(msg)
  }
}
async function previoussendViaAjax(data) { // commented out
  // Add subject prefix if it's a queued email
  const subjectPrefix = data.queued ? '[AutoQueue] ' : ''
  const subjectLine = `${subjectPrefix}Contact Form: ${data.name}`

  const response = await fetch('https://formspree.io/f/xlddodzp', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      message: data.message,
      _subject: subjectLine
    }),
  })

  if (!response.ok) {
    switchButtonStyles()
    let errorBody = {}
    try {
      errorBody = await response.json()
    } catch (jsonErr) {
      // ignore parse error, fallback to generic below as jsonErr don't matter to us
    }
    throw new Error(errorBody.error || 'failed to send via ajax')
  }

  return response.json()
}

/**
 * ---------------------------------------------------
 * Fallback Logic
 * ---------------------------------------------------
 */
function showFallbackButton(mailtoButton) {
  if (usedFallback) return; // Only unhide once
  usedFallback = true

  if (mailtoButton) mailtoButton.style.display = 'block'
}

/**
 * ---------------------------------------------------
 * Main Initialization & Events
 * ---------------------------------------------------
 */

// Prevent repeated fallback triggers
let usedFallback = false

function displayMessage(text, type, infoElem = infoMsg) {
  infoElem.classList.remove('error','success')
  infoElem.classList.add(type)
  infoElem.textContent = text
}

// useless function by now?
function switchButtonStyles(submitButton, mailtoButton) {
  submitButton.classList.add('secondary')
  if (mailtoButton) mailtoButton.classList.remove('secondary')
  submitButton.style.display = 'block'
}

function switchButtonTypes(submitButton, mailtoButton) {
  submitButton.setAttribute('type', 'button')
  if (mailtoButton) mailtoButton.setAttribute('type', 'submit')
}

// ahoxuscontactform.js
function initForms() {
  const forms = document.querySelectorAll('form') // all forms on page
  forms.forEach(form => {
    // pick or create placeholders for "submit" button & "mailto" fallback if present
    const submitButton = form.querySelector('input[type="submit"][id="submitButton"]') 
                     || form.querySelector('button[id="submitButton"]')
                     || form.querySelector('input[type="submit"]') 
    const mailtoButton = form.querySelector('#mailtoButton')
    const infoMsg      = form.querySelector('.infoMsg') 
    // ^ or adapt the selector to how you’re labeling fallback elements in each form

    showFallbackButton(mailtoButton)

    switchButtonTypes(submitButton, mailtoButton)

    if(!submitButton) return // no standard send button? skip
    
    submitButton.addEventListener('click', e => handleSubmit(e, form, infoMsg, mailtoButton))
    if (mailtoButton) {
      mailtoButton.addEventListener('click', async () => {
        form.submit()
      })
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault()
    })
  })
}

async function handleSubmit(event, form, infoMsg, mailtoButton) {
  event.preventDefault()
  event.stopPropagation()
    // Clear old error?
    //infoMsg.textContent = ''
  // gather data
  const formData = new FormData(form)
  const data = Object.fromEntries(formData.entries())
  try {
    await sendViaAjax(data)
    if(infoMsg) {
      displayMessage(`Email sent via formspree!`, 'success', infoMsg)
    }
    if(mailtoButton) mailtoButton.style.display = 'none'
  } catch(err) {
    // do we need this here?
    //switchButtonStyles()
    console.error('[lvedx] ajax error:', err)
    if(infoMsg) {
      displayMessage(`Error: ${err.message}. You can try again or use the "Email Client" button.`, 'error', infoMsg)
    }
    // Save to IndexedDB for offline retry
    try {
      await saveToQueue(data)
    } catch (dbErr) {
      console.error('failed to save to IDB:', dbErr)
    }
  }
}

async function init() {
  try {
    await getDB()
  } catch (err) {
    console.error('indexedDB initialization error:', err)
  }

  initForms()

  // Auto-retry queued messages when we come back online
  window.addEventListener('online', retryEmails)
}

init()

}) // DOMContentLoaded
