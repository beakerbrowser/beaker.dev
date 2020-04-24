var pathname = location.pathname
if (pathname.endsWith('/')) pathname += 'index.html'

const $ = (sel, parent = document) => parent.querySelector(sel)
const nav = $('nav')
const main = $('main')
const editor = $('#editor')

async function readPage () {
  return beaker.hyperdrive.readFile(pathname).catch(e => '')
}

async function onNew (e) {
  var path = prompt('Enter the name of your new page')
  if (!path) return
  if (!path.endsWith('.html')) path += '.html'
  if (!path.startsWith('/')) path = `/${path}`
  await beaker.hyperdrive.writeFile(path, `<h1>${path}</h1>`)
  location.pathname = path
}

async function onSave (e) {
  await beaker.hyperdrive.writeFile(pathname, editor.value)
  location.reload()
}

async function onDelete (e) {
  if (!confirm('Are you sure?')) return
  await beaker.hyperdrive.unlink(pathname)
  location.reload()
}

async function enterEditMode () {
  $('.view-mode', nav).classList.remove('active')
  $('.edit-mode', nav).classList.add('active')
  main.classList.remove('active')
  editor.classList.add('active')
  editor.value = await readPage()
}

async function enterViewMode () {
  $('.view-mode', nav).classList.add('active')
  $('.edit-mode', nav).classList.remove('active')
  main.classList.add('active')
  editor.classList.remove('active')
  main.innerHTML = await readPage()
}

async function setup () {
  // register event listeners
  $('button.new', nav).addEventListener('click', onNew)
  $('button.edit', nav).addEventListener('click', e => enterEditMode())
  $('button.remove', nav).addEventListener('click', onDelete)
  $('button.save', nav).addEventListener('click', onSave)
  $('button.cancel', nav).addEventListener('click', e => enterViewMode())

  // start in view mode
  enterViewMode()
}
setup()