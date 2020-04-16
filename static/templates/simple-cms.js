window.TEMPLATE_FILES = {
  '/index.html': `<h1>Simple CMS</h1>
<p>A simple content-management system.</p>`,
  '/.ui/ui.js': `var pathname = location.pathname
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
  await beaker.hyperdrive.writeFile(path, \`<h1>\${path}</h1>\`)
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
setup()`,
  '/.ui/ui.html': `<!doctype html5>
<html>
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="/.ui/ui.css">
  </head>
  <body>
    <nav>
      <div class="view-mode active">
        <button class="new">New</button>
        <hr>
        <button class="edit">Edit</button>
        <button class="remove">Delete</button>
      </div>
      <div class="edit-mode">
        <button class="save">Save</button>
        <button class="cancel">Cancel</button>
      </div>
    </nav>
    <main></main>
    <textarea id="editor"></textarea>
    <script type="module" src="/.ui/ui.js"></script>
  </body>
</html>`,
  '/.ui/ui.css': `body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;

  display: grid;
  grid-template-columns: 100px 1fr;
  grid-gap: 30px;
  height: 100%;
  margin: 0;
}

body > nav {
  background: #f3f3f8;
  height: 100%;
  padding: 10px;
}

body > nav .view-mode,
body > nav .edit-mode,
main,
#editor {
  display: none;
}

body > nav .view-mode.active,
body > nav .edit-mode.active,
main.active,
#editor.active {
  display: block;
}

body > nav button {
  display: block;
  width: 100%;
  margin-bottom: 5px;
}

body > nav hr {
  border: 0;
  border-top: 1px solid #ddd;
}

#editor {
  height: 100vh;
}`
}