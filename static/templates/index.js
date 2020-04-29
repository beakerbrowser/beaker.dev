var createDriveButton = document.querySelector('.create-drive')
if (typeof beaker !== 'undefined' && typeof beaker.hyperdrive !== 'undefined') {
  createDriveButton.textContent = 'Create Drive from this Template'
  createDriveButton.addEventListener('click', async (e) => {
    var drive = await beaker.hyperdrive.createDrive({
      title: TEMPLATE_TITLE
    })
    for (let path of TEMPLATE_FILES) {
      let v = await fetch(TEMPLATE_ROOT + path).then(res => res.text())
      if (path.startsWith('/ui/')) {
        // HACK
        // hugo doesnt serve the . folders so we have to fudge it for /.ui/ folders
        // -prf
        path = '/.ui/' + path.slice('/ui/'.length)
      }
      await drive.writeFile(path, v)
    }
    window.open(drive.url)
  })
} else {
  createDriveButton.textContent = 'Get Beaker v0.9+ to Create This Site'
  createDriveButton.addEventListener('click', e => {
    window.open('https://beakerbrowser.com/')
  })
}