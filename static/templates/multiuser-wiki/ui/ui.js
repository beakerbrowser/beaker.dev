import MarkdownIt from './markdown-it.js'
import { getSiteMeta, queryForPage, writeFile, slugify } from './util.js'

const EDIT_MODE = location.search.includes('?edit')

customElements.define('page-controls', class extends HTMLElement {
  async connectedCallback () {
    var siteMeta = this.siteMeta = await getSiteMeta()
    console.debug('Site meta:', siteMeta)

    if (EDIT_MODE) {
      this.append(
        h('button', {click: this.onSaveChanges.bind(this)}, 'Save'),
        ' ',
        h('button', {click: this.onDiscardChanges.bind(this)}, 'Discard changes'),
      )
    } else {
      if (siteMeta.userIsAuthor) {
        this.append(
          h('button', {click: this.onEdit.bind(this)}, 'Edit page'),
          ' ',
          h('button', {click: this.onDelete.bind(this)}, 'Delete page'),
        )
      }
      this.append(
        ' Authors: ',
        h('select',
          ...siteMeta.authors.map(a => h('option', {value: a.name}, a.name))
        )
      )
      if (siteMeta.userIsAdmin) {
        this.append(
          ' ',
          h('button', {click: e => this.onRemoveAuthor(e)}, 'Remove author'),
          ' ',
          h('button', {click: e => this.onAddAuthor(e)}, 'Add author')
        )
      }
    }
  }

  async onEdit (e) {
    location.search = '?edit'
  }

  async onSaveChanges (e) {
    var author = this.siteMeta.authors.find(a => a.writable)
    if (!author) {
      return alert('You are not an author')
    }
    var value = document.querySelector('textarea.editor').value
    await writeFile(author, location.pathname, value)
    location.search = ''
  }

  onDiscardChanges (e) {
    if (!confirm('Discard changes?')) {
      return
    }
    location.search = ''
  }

  async onDelete (e) {
    if (!confirm('Delete page?')) {
      return
    }
    var author = this.siteMeta.authors.find(a => a.writable)
    if (!author) {
      return alert('You are not an author')
    }
    await writeFile(author, location.pathname, '')
    location.reload()
  }

  async onAddAuthor (e) {
    var contact = await beaker.contacts.requestContact()
    var key = contact.url.slice('hyper://'.length)
    if (this.siteMeta.authors.find(a => a.key === key)) {
      alert('That user is already an author')
      return
    }
    var name = slugify(contact.title)
    do {
      name = prompt('Select a username for this author', name)
      if (name.includes('/')) {
        alert('Please dont include slashes in the username')
        continue
      }
      if (this.siteMeta.authors.find(a => a.name === name)) {
        alert('That username is already taken')
        continue
      }
      break
    } while(true)
    await beaker.hyperdrive.mkdir('/users').catch(e => undefined)
    await beaker.hyperdrive.mount(`/users/${name}`, contact.url)
    location.reload()
  }

  async onRemoveAuthor (e) {
    var name = this.querySelector('select').value
    if (!name) return
    if (!confirm(`Remove ${name} from authors?`)) {
      return
    }
    await beaker.hyperdrive.unmount(`/users/${name}`)
    location.reload()
  }
})

customElements.define('page-content', class extends HTMLElement {
  constructor () {
    super()
    this.render()
  }

  async render () {
    var main = h('main', {class: 'loading'})
    this.append(main)

    var file = await queryForPage(location.pathname)

    if (EDIT_MODE) {
      let content = file ? await beaker.hyperdrive.readFile(file.path).catch(e => '') : ''
      main.append(h('h1', `Editing ${location.pathname}`))
      main.append(h('textarea', {class: 'editor'}, content))
      main.classList.remove('loading')
      return
    }

    console.debug('Page found:', file)
    if (!file) {
      let st = await beaker.hyperdrive.stat('/users').catch(e => undefined)
      if (!st) {
        // no authors yet
        main.classList.remove('loading')
        main.append(h('h2', 'Welcome to your Wiki'))
        main.append(h('p', 'To get started, add yourself as an author. You will then be able to edit pages.'))
        return
      }

      // 404
      main.classList.remove('loading')
      main.append(h('h2', '404 Not Found'))
      return
    }

    // embed content
    if (/\.(png|jpe?g|gif|svg)$/i.test(file.path)) {
      main.append(h('img', {src: file.path}))
    } else if (/\.(mp4|webm|mov)/i.test(file.path)) {
      main.append(h('video', {controls: true}, h('source', {src: file.path})))
    } else if (/\.(mp3|ogg)/i.test(file.path)) {
      main.append(h('audio', {controls: true}, h('source', {src: file.path})))
    } else {
      let content = await beaker.hyperdrive.readFile(file.path)
      // treat empty file as a tombstone
      if (!content) {
        main.classList.remove('loading')
        main.append(h('h2', '404 Not Found'))
        return
      }
      // render content
      if (/.md$/i.test(file.path)) {
        let md = new MarkdownIt({html: false})
        main.innerHTML = md.render(content)
      } else {
        main.append(h('pre', content))
      }
    }
    main.classList.remove('loading')

    // render metadata
    var author = file.path.split('/')[2]
    var mtime = (new Date(file.stat.mtime)).toLocaleString()
    this.append(h('footer', `Last updated by ${author} at ${mtime}`))
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