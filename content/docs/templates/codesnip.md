---
title: Codesnip Template
---

{{< rawhtml >}}
<img class="template-thumb" src="/templates/codesnip.png">

<button class="create-drive">Create Drive From This Template</button>

<script>
  const TEMPLATE_ROOT = '/templates/codesnip'
  const TEMPLATE_TITLE = 'Codesnip'
  window.TEMPLATE_FILES = [
    '/ui/ui.html',
    '/ui/ui.js',
    '/ui/ui.css',
    '/ui/ace/ace.js',
    '/ui/ace/mode-css.js',
    '/ui/ace/mode-html.js',
    '/ui/ace/mode-javascript.js'
  ]
</script>
<script src="/templates/index.js"></script>
{{< /rawhtml >}}

A codesnippet which you can use to demonstrate APIs, patterns, bugs, or other techniques.
(Note that the code is run in an iframe and will have reduced permissions, including only readonly access to the Hyperdrive API.)

## Source

{{< tabsraw >}}
{{< tab "/.ui/ui.html" >}}
{{< readcode "/static/templates/codesnip/ui/ui.html" "html" >}}
{{< /tab >}}
{{< tab "/.ui/ui.js" >}}
{{< readcode "/static/templates/codesnip/ui/ui.js" "js" >}}
{{< /tab >}}
{{< tab "/.ui/ui.css" >}}
{{< readcode "/static/templates/codesnip/ui/ui.css" "css" >}}
{{< /tab >}}
{{< tab "LICENSE" >}}
{{< readcode "/static/templates/LICENSE" "txt" >}}
{{< /tab >}}
{{< /tabsraw >}}