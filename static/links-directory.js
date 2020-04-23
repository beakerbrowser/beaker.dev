const THIS_AUTHOR = {url: 'https://beaker.dev', title:'beaker.dev'}
const BUILTIN_LINKS = [
  // templates
  {
    title: 'Simple CMS',
    description: 'An example content-management system for building a site',
    href: '/docs/templates/simple-cms/',
    type: 'template',
    author: THIS_AUTHOR
  },
  {
    title: 'Multi-user Wiki',
    description: 'A minimal collaborative website',
    href: '/docs/templates/multiuser-wiki/',
    type: 'template',
    author: THIS_AUTHOR
  },
  {
    title: 'Microblog Feed',
    description: 'A minimal microblogging app which works like the feed in Beaker\'s start page',
    href: '/docs/templates/microblog-feed/',
    type: 'template',
    author: THIS_AUTHOR
  },
  {
    title: 'Photo Album',
    description: 'A simple photo-album site with management tools',
    href: '/docs/templates/photo-album/',
    type: 'template',
    author: THIS_AUTHOR
  },
  {
    title: 'Chat Room',
    description: 'An example chat-room for all the visitors of the site',
    href: '/docs/templates/chat-room/',
    type: 'template',
    author: THIS_AUTHOR
  },
  {
    title: 'Video Chat',
    description: 'An example video-chat between the visitors of the site',
    href: '/docs/templates/video-chat/',
    type: 'template',
    author: THIS_AUTHOR
  },

  // documentation
  {title: 'Building a Self-Modifying Site', href: '/docs/tutorials/self-modifying-site/', type: 'documentation', author: THIS_AUTHOR},
  {title: 'Building a CMS "Frontend"', href: '/docs/tutorials/cms-frontend/', type: 'documentation', author: THIS_AUTHOR},
]

const CATEGORIES = [
  {id: 'template', title: 'Templates'},
  {id: 'documentation', title: 'Documentation'},
  {id: 'app', title: 'Apps'},
  {id: 'module', title: 'Modules'},
  {id: 'service', title: 'Services'},
  {id: 'site', title: 'Sites'}
]

var currentCategory = CATEGORIES[0].id
var currentFilter = ''
var containerEl = $('.links-directory')
var navEl = $('.links-directory-nav', containerEl)
var resultsEl = $('.links-directory-results', containerEl)
var searchInput = $('.links-directory-ctrls input', containerEl)
var addBtn = $('.links-directory-ctrls button', containerEl)

// setup
// =

for (let cat of CATEGORIES) {
  navEl.append(h('a', {href: '#', 'data-category': cat.id, click: onClickCategory}, cat.title))
}
searchInput.addEventListener('keyup', onKeyupSearch)

render()

// rendering
// =

async function render () {
  try { $('.active', navEl).classList.remove('active') } catch (e) {}
  $(`a[data-category="${currentCategory}"]`, navEl).classList.add('active')

  resultsEl.innerHTML = ''
  var links = BUILTIN_LINKS.filter(l => l.type === currentCategory)
  for (let link of links) {
    resultsEl.append(h('div', {class: 'link'},
      h('a', {class: 'title', href: link.href}, link.title),
      link.description ? h('div', {class: 'description'}, link.description) : '',
      h('div', {class: 'author'}, 'Shared by ',
        h('a', {href: link.author.url}, link.author.title)
      )
    ))
  }
  resultsEl.append(h('div', {class: 'empty hidden'}, 'No links found in this category'))
  applyFilter()
}

function applyFilter () {
  var hasResults = false
  var linkEls = Array.from(resultsEl.querySelectorAll('.link'))
  var filter = currentFilter.toLowerCase()
  for (let link of linkEls) {
    if (link.textContent.toLowerCase().includes(filter)) {
      hasResults = true
      link.classList.remove('hidden')
    } else {
      link.classList.add('hidden')
    }
  }

  var emptyEl = $('.empty', resultsEl)
  if (hasResults) {
    emptyEl.classList.add('hidden')
  } else {
    emptyEl.classList.remove('hidden')
  }
  if (currentFilter) {
    emptyEl.textContent = `No matches for "${currentFilter}"`
  } else {
    emptyEl.textContent = 'No links found in this category'
  }
}

// events
//

function onClickCategory (e) {
  e.preventDefault()
  currentCategory = e.currentTarget.dataset.category
  render()
}

function onKeyupSearch (e) {
  currentFilter = e.currentTarget.value.trim()
  applyFilter()
}

// helpers
// =


function $ (sel, parent = document) {
  return parent.querySelector(sel)
}

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