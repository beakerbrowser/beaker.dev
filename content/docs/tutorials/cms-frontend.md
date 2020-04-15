# Building a CMS "Frontend"

[In the self-modifying site tutorial](../self-modifying-site), we created a simple self-modifying site. While it worked, it didn't have any way to automatically include the editing tools on every page.

In this tutorial, we're going to use a "Frontend" to create a consistent UI on every page. Before we start, [read this documentation on Frontends](https://beaker-browser.gitbook.io/docs/developers/frontends-.ui-folder) to learn the highlevel mechanics we'll be using.

![](/tutorials/cms-frontend.gif)

On load, our Frontend will automatically create a UI with the editor tools on the left. It will then attempt to read the file that corresponds to the current URL. If the file is found, it will insert it into the UI.

## Create /.ui/ui.html

Every frontend is located at `/.ui/ui.html`. If that file is present, it will be served instead of the target resource.

Our ui.html is going to include the full UI for our edit-mode and view-mode.

```html
<!doctype html5>
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
    <main><!-- page content will be inserted here --></main>
    <textarea id="editor"></textarea>
    <script type="module" src="/.ui/ui.js"></script>
  </body>
</html>

```

In our UI, there will be two modes: view mode and edit mode. We'll toggle between the two to render the page or the editor, respectively.

## Add Styles

In our frontend, we're going to put all our styles in `/.ui/ui.css`. I'm not going to review each style but you can see them here:

```css
body {
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
}
```

## Setup the UI Behaviors

First let's add the code to switch between our UI modes. We'll use a couple helpers to make things easier to read.

```javascript
const $ = (sel, parent = document) => parent.querySelector(sel)
const nav = $('nav')
const main = $('main')
const editor = $('#editor')

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
```

This code should be fairly clear. We start by registering 'click' handlers to all of our buttons, and then enter "view mode."

To switch between modes, we toggle the "active" class on many of our UI elements and then populate either the `<main>` element or the `<textarea id="editor">` element.

```javascript
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
```

## Add Read/Write Methods

Reading and writing the page's HTML is going to work like in the [self-modifying site tutorial](../self-modifying-site). We'll use the [Hyperdrive API](https://beaker-browser.gitbook.io/docs/apis/beaker-hyperdrive) to read and write the files.

First we setup some globals that we'll reuse:

```javascript
var pathname = location.pathname
if (pathname.endsWith('/')) pathname += 'index.html'
```

Our UI code already uses a `readPage()` method to fetch the current page's content. This is defined using the [readFile\(\)](https://beaker-browser.gitbook.io/docs/apis/beaker-hyperdrive#beaker-hyperdrive-readfile-url-opts) method of Hyperdrive.

```javascript
async function readPage () {
  return beaker.hyperdrive.readFile(pathname).catch(e => '')
}
```

To save the page, we get the editor's value and then write it using the [writeFile\(\)](https://beaker-browser.gitbook.io/docs/apis/beaker-hyperdrive#beaker-hyperdrive-writefile-url-data-opts) method. Afterwards we reload the page to show the changes.

```javascript
async function onSave (e) {
  await beaker.hyperdrive.writeFile(pathname, editor.value)
  location.reload()
}
```

To create a new page, we prompt the user for a filename. We make sure the name ends with '.html' because that's the only kind of content we understand. We then write a starting .html template and navigate to the new page.

```javascript
async function onNew (e) {
  var path = prompt('Enter the name of your new page')
  if (!path) return
  if (!path.endsWith('.html')) path += '.html'
  await beaker.hyperdrive.writeFile(path, `<h1>${path}</h1>`)
  location.pathname = path
}
```

To delete the current page, we confirm with the user and then use the [unlink\(\)](https://beaker-browser.gitbook.io/docs/apis/beaker-hyperdrive#beaker-hyperdrive-unlink-url-opts) method. When the page reloads, the view should display nothing because a 404 is handled by inserting an empty string \(see our readPage\(\) method above\).

```javascript
async function onDelete (e) {
  if (!confirm('Are you sure?')) return
  await beaker.hyperdrive.unlink(pathname)
  location.reload()
}
```

## The Final Code

{{< tabs "final-code" >}}
{{< tab "/.ui/ui.js" >}}
```javascript
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
```
{{< /tab >}}

{{< tab "/.ui/ui.html" >}}
```html
<!doctype html5>
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
</html>

```
{{< /tab >}}

{{< tab "/.ui/ui.css" >}}
```css
body {
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
}

```
{{< /tab >}}
{{< /tabs >}}

