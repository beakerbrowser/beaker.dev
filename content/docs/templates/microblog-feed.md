---
title: Microblog Feed Template
---

{{< rawhtml >}}
<img class="template-thumb" src="/templates/microblog-feed.png">

<button class="create-drive">Create Drive from Template</button>

<script>
  const TEMPLATE_ROOT = '/templates/microblog-feed'
  const TEMPLATE_TITLE = 'My Feed'
  window.TEMPLATE_FILES = [
    '/index.html',
    '/index.js',
    '/markdown-it.js'
  ]
</script>
<script src="/templates/index.js"></script>
{{< /rawhtml >}}

This template creates a minimal microblogging app. Users publish posts as files in the `/microblog/` folder of their profile drive. The app uses your address book to choose whose posts to fetch.

## Source

{{< tabsraw >}}
{{< tab "/index.html" >}}
{{< readcode "/static/templates/microblog-feed/index.html" "html" >}}
{{< /tab >}}
{{< tab "/index.js" >}}
{{< readcode "/static/templates/microblog-feed/index.js" "js" >}}
{{< /tab >}}
{{< /tabsraw >}}