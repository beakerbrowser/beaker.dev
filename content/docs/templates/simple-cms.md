---
title: Simple CMS Template
---

{{< rawhtml >}}
<img class="template-thumb" src="/templates/simple-cms.png">

<button class="create-drive">Create Drive from Template</button>

<script>
  const TEMPLATE_ROOT = '/templates/simple-cms'
  window.TEMPLATE_FILES = [
    '/index.html',
    '/ui/ui.js',
    '/ui/ui.html',
    '/ui/ui.css'
  ]
</script>
<script src="/templates/index.js"></script>
{{< /rawhtml >}}

This template is a minimal content-management system for building a site. [Read the tutorial "Building a CMS Frontend"]({{< relref "/docs/tutorials/cms-frontend" >}}) to learn how it works.

## Source

{{< tabsraw >}}
{{< tab "/index.html" >}}
{{< readcode "/static/templates/simple-cms/index.html" "html" >}}
{{< /tab >}}
{{< tab "/.ui/ui.js" >}}
{{< readcode "/static/templates/simple-cms/ui/ui.js" "js" >}}
{{< /tab >}}
{{< tab "/.ui/ui.html" >}}
{{< readcode "/static/templates/simple-cms/ui/ui.html" "html" >}}
{{< /tab >}}
{{< tab "/.ui/ui.css" >}}
{{< readcode "/static/templates/simple-cms/ui/ui.css" "css" >}}
{{< /tab >}}
{{< /tabsraw >}}