import MarkdownIt from '/markdown-it.js'

const md = new MarkdownIt({html: false, breaks: true})
const PATH = '/microblog/'
var profile = undefined
try { profile = JSON.parse(localStorage.profile) }
catch (e) { console.debug(e) }

customElements.define('bb-composer', class extends HTMLElement {
  async connectedCallback () {
    if (!profile) {
      this.append(h('button', {click: this.onClickChangeProfile.bind(this)}, 'Select a profile to post with'))
    } else {
      this.append(h('form', {submit: this.onSubmit},
        h('p', h('textarea', {name: 'content', required: true, placeholder: 'Enter your post here'})),
        h('p',
          h('input', {name: 'filename', placeholder: 'Post filename (optional)'}),
          h('button', {type: 'submit'}, `Post to ${profile.title}'s microblog`),
          ' ',
          h('small', h('a', {href: '#', click: this.onClickChangeProfile.bind(this)}, 'Change profile'))
        )
      ))
    }
  }

  async onSubmit (e) {
    e.preventDefault()
    var filename = e.target.filename.value
    var content = e.target.content.value
    filename = filename || `${Date.now()}.md`
    if (filename.indexOf('.') === -1) filename += '.md'
    await beaker.hyperdrive.drive(profile.url).mkdir(PATH).catch(e => undefined)
    await beaker.hyperdrive.drive(profile.url).writeFile(PATH + filename, content)
    location.reload()
  }

  async onClickChangeProfile (e) {
    e.preventDefault()
    profile = await beaker.contacts.requestProfile()
    localStorage.profile = JSON.stringify(profile)
    location.reload()
  }
})


customElements.define('bb-feed', class extends HTMLElement {
  async connectedCallback () {
    this.textContent = 'loading...'
    try {
      var sources = []
      if (profile) {
        sources = await beaker.contacts.list()
      }
      let drive = sources.map(s => s.url)
      if (profile && !drive.includes(profile.url)) {
        drive.push(profile.url)
      }
      var files = await beaker.hyperdrive.query({
        path: PATH + '*',
        drive,
        sort: 'ctime',
        reverse: true,
        limit: this.hasAttribute('limit') ? Number(this.getAttribute('limit')) : 100
      })
    } catch (e) {
      this.textContent = e.toString()
      console.debug(`Unable to query ${PATH}`, e)
      return
    }
    this.textContent = ''

    for (let file of files) {
      let postDiv = h('div', {class: 'post'})
      postDiv.append(
        h('a', {class: 'thumb', href: file.drive},
          h('img', {src: `${file.drive}thumb`})
        )
      )

      let filename = file.path.split('/').pop()
      let day = niceDate(file.stat.ctime)
      postDiv.append(h('div', {class: 'meta'}, 
        h('a', {href: file.url, title: filename}, filename),
        ' ',
        day
      ))

      try {
        if (/\.(png|jpe?g|gif|svg)$/i.test(file.path)) {
          postDiv.append(h('div', {class: 'content'}, h('img', {src: file.url})))
        } else if (/\.(mp4|webm|mov)/i.test(file.path)) {
          postDiv.append(h('div', {class: 'content'}, h('video', {controls: true}, h('source', {src: file.url}))))
        } else if (/\.(mp3|ogg)/i.test(file.path)) {
          postDiv.append(h('div', {class: 'content'}, h('audio', {controls: true}, h('source', {src: file.url}))))
        } else {
          let txt = await beaker.hyperdrive.readFile(file.url)
          // render content
          if (/\.md$/i.test(file.path)) {
            let content = h('div', {class: 'content'})
            content.innerHTML = md.render(txt)
            postDiv.append(content)
          } else {
            postDiv.append(h('div', {class: 'content'}, h('pre', txt)))
          }
        }
      } catch (e) {
        console.error('Failed to read', file.path)
        console.error(e)
        continue
      }

      this.append(postDiv)
    }
  }
})

function h (tag, attrs, ...children) {
  var el = document.createElement(tag)
  if (isPlainObject(attrs)) {
    for (let k in attrs) {
      if (typeof attrs[k] === 'function') el.addEventListener(k, attrs[k])
      else el.setAttribute(k, attrs[k])
    }
  } else if (attrs) {
    children = [attrs].concat(children)
  }
  for (let child of children) el.append(child)
  return el
}

function isPlainObject (v) {
  return v && typeof v === 'object' && Object.prototype === v.__proto__
}

var today = (new Date()).toLocaleDateString()
var yesterday = (new Date(Date.now() - 8.64e7)).toLocaleDateString()
function niceDate (ts) {
  var date = (new Date(ts)).toLocaleDateString()
  if (date === today) return 'Today'
  if (date === yesterday) return 'Yesterday'
  return date
}