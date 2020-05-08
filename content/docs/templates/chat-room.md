---
title: Chat Room Template
---

{{< rawhtml >}}
<img class="template-thumb" src="/templates/chat-room.png">

<button class="create-drive">Create Drive From This Template</button>

<script>
  const TEMPLATE_ROOT = '/templates/chat-room'
  const TEMPLATE_TITLE = 'My Chat Room'
  window.TEMPLATE_FILES = [
    '/index.html'
  ]
</script>
<script src="/templates/index.js"></script>
{{< /rawhtml >}}

This template creates a minimal chat room for all the visitors of the site. It uses the [Peersockets API](https://beaker-browser.gitbook.io/docs/apis/beaker.peersockets) to send and receive messages. Traffic is encrypted so that only users who possess the site's URL can read it.

## Source

{{< tabsraw >}}
{{< tab "/index.html" >}}
{{< readcode "/static/templates/chat-room/index.html" "html" >}}
{{< /tab >}}
{{< /tabsraw >}}