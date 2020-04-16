document.querySelector('.create-drive').addEventListener('click', async (e) => {
  var drive = await beaker.hyperdrive.createDrive()
  for (let path in TEMPLATE_FILES) {
    await drive.writeFile(path, TEMPLATE_FILES[path])
  }
  window.open(drive.url)
})