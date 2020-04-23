---
title: Multi-user Wiki Template
---

{{< rawhtml >}}
<img class="template-thumb" src="/templates/multiuser-wiki.png">

<button class="create-drive">Create Drive from Template</button>

<script>
  const TEMPLATE_ROOT = '/templates/multiuser-wiki'
  window.TEMPLATE_FILES = [
    '/ui/ui.html',
    '/ui/ui.js',
    '/ui/util.js',
    '/ui/markdown-it.js'
  ]
</script>
<script src="/templates/index.js"></script>
{{< /rawhtml >}}

This wiki is a minimal collaborative website. It maintains a list of authors (selected by the wiki owner) who set the content of the wiki.

## Technical design

This wiki uses a [frontend](https://beaker-browser.gitbook.io/docs/developers/frontends-.ui-folder) to virtually construct pages. As a result, when you visit a page, you are viewing a constructed result rather than a file that lives on this drive.

Each author maintains a folder under `/beaker-wiki/{wiki-drive-key}/`. When a page is visited at some path, the wiki's frontend runs the following query:

```
/users/*/beaker-wiki/{wiki-drive-key}/{path}
```

The matching file with the highest mtime is then chosen for rendering.

## Source

{{< tabsraw >}}
{{< tab "/.ui/ui.html" >}}
{{< readcode "/static/templates/multiuser-wiki/ui/ui.html" "html" >}}
{{< /tab >}}
{{< tab "/.ui/ui.js" >}}
{{< readcode "/static/templates/multiuser-wiki/ui/ui.js" "js" >}}
{{< /tab >}}
{{< tab "/.ui/util.js" >}}
{{< readcode "/static/templates/multiuser-wiki/ui/util.js" "js" >}}
{{< /tab >}}
{{< /tabsraw >}}