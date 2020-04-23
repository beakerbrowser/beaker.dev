---
title: Photo Album Template
---

{{< rawhtml >}}
<img class="template-thumb" src="/templates/photo-album.png">

<button class="create-drive">Create Drive from Template</button>

<script>
  const TEMPLATE_ROOT = '/templates/photo-album'
  window.TEMPLATE_FILES = [
    '/index.html',
    '/index.js',
    '/index.css'
  ]
</script>
<script src="/templates/index.js"></script>
{{< /rawhtml >}}

This template creates a simple photo-album. It includes controls for the site-owner to add, edit, and remove photos.

## Source

{{< tabsraw >}}
{{< tab "/index.html" >}}
{{< readcode "/static/templates/photo-album/index.html" "html" >}}
{{< /tab >}}
{{< tab "/index.js" >}}
{{< readcode "/static/templates/photo-album/index.js" "js" >}}
{{< /tab >}}
{{< tab "/index.css" >}}
{{< readcode "/static/templates/photo-album/index.css" "css" >}}
{{< /tab >}}
{{< /tabsraw >}}