---
title: Building a Self-Modifying Site
---

In this tutorial, we're going to step through a basic "Self-modifying Website." It will use JavaScript to display a GUI for editing the content of the page.

{{< niceimg img="/tutorials/self-modifying-site.gif" >}}

## Create the index.html

The entry-point to the site, index.html, is a simple scaffold that imports our styles and scripts.

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="/index.css">
  </head>
  <body>
    <h1>Hello World!</h1>
    <script type="module" src="/index.js"></script>
  </body>
</html>
```

## Create the index.css

In our app, we have a single UI element: the "editor" screen. It is a "fixed" layer above the rest of the page which includes 2 buttons \(save, cancel\) and a textarea. The HTML for this editor looks like this:

```html
<div id="editor">
  <nav>
    <button id="save">Save</button>
    <button id="cancel">Cancel</button>
  </nav>
  <textarea></textarea>
</div>
```

The editor layer is a div that covers the entire page:

```css
#editor {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vh;
  height: 100vh;
  z-index: 1;
  background: #fff;
}
```

The 2 buttons live in a `<nav>` which spaces the buttons evenly:

```css
#editor nav {
  display: flex;
  justify-content: space-between;
  width: 100vw;
  height: 40px;
  padding: 10px 20px;
  box-sizing: border-box;
}
```

Finally, the textarea is positioned to take up the rest of the screen:

```css
#editor textarea {
  margin: 0 20px;
  height: calc(100vh - 60px);
  width: calc(100vw - 40px);
}
```

## Reading and writing the page

Our editor needs to read the HTML of the current page and then write the textarea's value back to that file. To do that, we'll use the [beaker.hyperdrive API](https://beaker-browser.gitbook.io/docs/apis/beaker-hyperdrive).

First, we need the path for the current file. We can get this from the window.location variable's `pathname` attribute. If we are looking at a folder, we should append "index.html".

```javascript
var pathname = location.pathname
if (pathname.endsWith('/')) pathname += 'index.html'
```

To read the current page's HTML, we use the [readFile](https://beaker-browser.gitbook.io/docs/apis/beaker-hyperdrive#readfile-path-opts) method.

```javascript
async function readPage () {
  return beaker.hyperdrive.readFile(pathname).catch(e => '')
}
```

To write the current page, we use the [writeFile](https://beaker-browser.gitbook.io/docs/apis/beaker-hyperdrive#writefile-path-data-opts) method.

```javascript
async function savePage (value) {
  await beaker.hyperdrive.writeFile(pathname, value)
}
```

## Adding the editor controls

Upon page-load, we want to add a button for initializing the editor. We can do this using the DOM API.

```javascript
var editBtn = document.createElement('button')
editBtn.textContent = 'Edit Page'
editBtn.addEventListener('click', e => showEditor())
document.body.append(editBtn)
```

Our `showEditor()` function will also use the DOM API to add the editor elements.

```javascript
async function showEditor () {
  var editor = document.createElement('div')
  const $ = sel => editor.querySelector(sel)
  editor.id = 'editor'
  editor.innerHTML = `
    <nav>
      <button id="save">Save</button>
      <button id="cancel">Cancel</button>
    </nav>
    <textarea></textarea>
  `
  document.body.appendChild(editor)
}
```

We want the editor to display the current page's HTML immediately, so we call our `readPage()` function to grab it.

```javascript
$('textarea').value = await readPage()
```

When the user saves, we want to write the textarea's value to the HTML file, then reload the page to view the results.

```javascript
$('#save').addEventListener('click', async (e) => {
  await savePage($('textarea').value)
  location.reload()
})
```

And that's it! Our page will now provide a UI for editing the HTML.

## The Final Code

{{< tabs "final-code" >}}
{{< tab "index.js" >}}
```javascript
var pathname = location.pathname
if (pathname.endsWith('/')) pathname += 'index.html'

async function readPage () {
  return beaker.hyperdrive.readFile(pathname).catch(e => '')
}

async function savePage (value) {
  await beaker.hyperdrive.writeFile(pathname, value)
}

async function showEditor () {
  var editor = document.createElement('div')
  const $ = sel => editor.querySelector(sel)
  editor.id = 'editor'
  editor.innerHTML = `
    <nav>
      <button id="save">Save</button>
      <button id="cancel">Cancel</button>
    </nav>
    <textarea></textarea>
  `
  $('textarea').value = await readPage()
  $('#save').addEventListener('click', async (e) => {
    await savePage($('textarea').value)
    location.reload()
  })
  $('#cancel').addEventListener('click', e => hideEditor())
  document.body.appendChild(editor)
}

async function hideEditor () {
  document.getElementById('editor').remove()
}

var editBtn = document.createElement('button')
editBtn.textContent = 'Edit Page'
editBtn.addEventListener('click', e => showEditor())
document.body.append(editBtn)
```
{{< /tab >}}
{{< tab "index.html" >}}
```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="/index.css">
  </head>
  <body>
    <h1>Hello World!</h1>
    <script type="module" src="/index.js"></script>
  </body>
</html>
```
{{< /tab >}}
{{< tab "index.css" >}}
```css
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

#editor {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vh;
  height: 100vh;
  z-index: 1;
  background: #fff;
}

#editor nav {
  display: flex;
  justify-content: space-between;
  width: 100vw;
  height: 40px;
  padding: 10px 20px;
  box-sizing: border-box;
}

#editor textarea {
  margin: 0 20px;
  height: calc(100vh - 60px);
  width: calc(100vw - 40px);
}
```
{{< /tab >}}
{{< /tabs >}}
