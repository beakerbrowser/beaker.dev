const THIS_AUTHOR = {url: 'https://beaker.dev', title:'beaker.dev'}
const BUILTIN_LINKS = [
  // templates
  {
    title: 'Simple CMS',
    description: 'An example content management system for building a site',
    href: '/docs/templates/simple-cms/',
    type: 'templates',
    author: THIS_AUTHOR
  },
  {
    title: 'Multi-user Wiki',
    description: 'A minimal collaborative website',
    href: '/docs/templates/multiuser-wiki/',
    type: 'templates',
    author: THIS_AUTHOR
  },
  {
    title: 'Microblog Feed',
    description: 'A minimal microblogging app',
    href: '/docs/templates/microblog-feed/',
    type: 'templates',
    author: THIS_AUTHOR
  },
  {
    title: 'Photo Album',
    description: 'A simple photo album site with management tools',
    href: '/docs/templates/photo-album/',
    type: 'templates',
    author: THIS_AUTHOR
  },
  {
    title: 'Chat Room',
    description: 'An example chat room using peersockets',
    href: '/docs/templates/chat-room/',
    type: 'templates',
    author: THIS_AUTHOR
  },
  {
    title: 'Video Chat',
    description: 'An example video chat using peersockets and WebRTC',
    href: '/docs/templates/video-chat/',
    type: 'templates',
    author: THIS_AUTHOR
  },

  // documentation
  {title: 'Building a Self-Modifying Site', href: '/docs/tutorials/self-modifying-site/', type: 'docs', author: THIS_AUTHOR},
  {title: 'Building a CMS "Frontend"', href: '/docs/tutorials/cms-frontend/', type: 'docs', author: THIS_AUTHOR},
]

const CATEGORIES = [
  {id: 'templates', title: 'Templates'},
  {id: 'docs', title: 'Documentation'},
  {id: 'apps', title: 'Apps'},
  {id: 'modules', title: 'Modules'},
  {id: 'services', title: 'Services'},
  {id: 'sites', title: 'Sites'}
]

var currentCategory = location.hash.slice(1)
if (!currentCategory || !CATEGORIES.find(c => c.id === currentCategory)) {
  currentCategory = CATEGORIES[0].id
}
var currentFilter = ''
var profile = undefined

var containerEl = $('.links-directory')
var navEl = $('.links-directory-nav', containerEl)
var resultsEl = $('.links-directory-results', containerEl)
var searchInput = $('.links-directory-ctrls input', containerEl)
var addBtn = $('.links-directory-ctrls button', containerEl)
var addLinkDialog = $('#add-link-dialog')

// setup
// =

try { profile = JSON.parse(localStorage.profile) }
catch (e) { console.debug(e) }
if (profile) {
  addBtn.classList.remove('hidden')
}

for (let cat of CATEGORIES) {
  navEl.append(h('a', {href: '#', 'data-category': cat.id, click: onClickCategory}, cat.title))
  $('select', addLinkDialog).append(h('option', {value: cat.id}, cat.title))
}
searchInput.addEventListener('keyup', onKeyupSearch)
addBtn.addEventListener('click', onClickAddLinkBtn)
$('form', addLinkDialog).addEventListener('submit', onSubmitAddLink)

if (!profile && typeof beaker !== 'undefined') {
  $('.links-directory-ctrls', containerEl).insertAdjacentElement(
    'afterend',
    h('div', {class: 'signin-prompt'},
      h('a', {href: '#', click: onClickSignin},
        h('span', {class: 'fas fa-fw fa-user'}),
        ' Sign into your profile'
      ),
      ' to share links and see links from your network'
    )
  )
}

render()

// rendering
// =

async function render () {
  try { $('.active', navEl).classList.remove('active') } catch (e) {}
  $(`a[data-category="${currentCategory}"]`, navEl).classList.add('active')

  resultsEl.innerHTML = ''
  var links = await loadLinks()
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
  history.replaceState({}, undefined, '/#' + currentCategory)
  render()
}

function onKeyupSearch (e) {
  currentFilter = e.currentTarget.value.trim()
  applyFilter()
}

async function onClickSignin (e) {
  e.preventDefault()
  localStorage.profile = JSON.stringify(await beaker.contacts.requestProfile())
  window.location.reload()
}

function onClickAddLinkBtn (e) {
  e.preventDefault()
  addLinkDialog.showModal()
}

async function onSubmitAddLink (e) {
  if (e.submitter.getAttribute('type') !== 'submit') {
    return
  }
  var {title, description, href, category} = {
    title: e.target.title.value,
    description: e.target.description.value,
    href: e.target.href.value,
    category: e.target.category.value
  }
  await beaker.hyperdrive.drive(profile.url).writeFile(
    `/links/${category}/${Date.now()}.goto`,
    '',
    {metadata: {title, description, href}}
  )
  location.reload()
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

async function loadLinks () {
  var links = []
  if (profile) {
    var contacts = [profile]
    try {
      contacts = contacts.concat(await beaker.contacts.list())
    } catch (e) {}

    let linkFiles = await beaker.hyperdrive.query({
      drive: contacts.map(c => c.url),
      path: [`/links/${currentCategory}/*.goto`]
    })
    linkFiles = linkFiles.filter(file => file.stat.metadata.title && file.stat.metadata.href)
    links = linkFiles.map(file => ({
      title: file.stat.metadata.title,
      description: file.stat.metadata.description,
      href: file.stat.metadata.href,
      type: currentCategory,
      author: contacts.find(c => c.url === file.drive)
    }))
  }

  links = links.concat(BUILTIN_LINKS.filter(l => l.type === currentCategory))
  links.sort((a, b) => a.title.localeCompare(b.title))
  return links
}