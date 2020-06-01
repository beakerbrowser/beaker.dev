---
title: Module Template
---

{{< rawhtml >}}
<img class="template-thumb" src="/templates/module.png">

<button class="create-drive">Create Drive From This Template</button>

<script>
  const TEMPLATE_ROOT = '/templates/module'
  const TEMPLATE_TITLE = 'My Module'
  window.TEMPLATE_FILES = [
    '/demo/index.html',
    '/scripts/build.js',
    '/tests/vendor/chai.js',
    '/tests/vendor/mocha.css',
    '/tests/vendor/mocha.js',
    '/tests/index.html',
    '/tests/index.js',
    '/ui/ui.html',
    '/ui/ui.js',
    '/ui/ui.css',
    '/ui/vendor/highlight.css',
    '/ui/vendor/highlight.pack.js',
    '/ui/img/file.svg',
    '/ui/img/folder.svg',
    '/index.js',
    '/index.md'
  ]
</script>
<script src="/templates/index.js"></script>
{{< /rawhtml >}}

A module with tools for a readme, tests suite, demo, and build tools.
Also includes webterm [page commands](https://docs.beakerbrowser.com/advanced/webterm#page-commands) for running tests, build scripts, and more.

## Source

{{< tabsraw >}}
{{< tab "/index.js" >}}
{{< readcode "/static/templates/module/index.js" "js" >}}
{{< /tab >}}
{{< tab "/index.md" >}}
{{< readcode "/static/templates/module/index.md" "md" >}}
{{< /tab >}}
{{< tab "/scripts/build.js" >}}
{{< readcode "/static/templates/module/scripts/build.js" "js" >}}
{{< /tab >}}
{{< tab "/tests/index.js" >}}
{{< readcode "/static/templates/module/tests/index.js" "js" >}}
{{< /tab >}}
{{< tab "/tests/index.html" >}}
{{< readcode "/static/templates/module/tests/index.html" "html" >}}
{{< /tab >}}
{{< tab "/demo/index.html" >}}
{{< readcode "/static/templates/module/demo/index.html" "html" >}}
{{< /tab >}}
{{< tab "/.ui/ui.html" >}}
{{< readcode "/static/templates/module/ui/ui.html" "html" >}}
{{< /tab >}}
{{< tab "/.ui/ui.js" >}}
{{< readcode "/static/templates/module/ui/ui.js" "js" >}}
{{< /tab >}}
{{< tab "/.ui/ui.css" >}}
{{< readcode "/static/templates/module/ui/ui.css" "css" >}}
{{< /tab >}}
{{< tab "LICENSE" >}}
{{< readcode "/static/templates/LICENSE" "txt" >}}
{{< /tab >}}
{{< /tabsraw >}}