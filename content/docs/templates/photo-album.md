# Photo Album Template

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