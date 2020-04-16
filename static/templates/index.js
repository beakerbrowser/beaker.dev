document.querySelector('.create-drive').addEventListener('click', async (e) => {
  var drive = await beaker.hyperdrive.createDrive()
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