const WIKI_KEY = location.hostname
const ROOT_PATH = (user) => `/users/${user}/beaker-wiki/${WIKI_KEY}/`
const QUERY_ROOT_PATH = `/users/*/beaker-wiki/${WIKI_KEY}/`

export function joinPath (...args) {
  var str = args[0]
  for (let v of args.slice(1)) {
    v = v && typeof v === 'string' ? v : ''
    let left = str.endsWith('/')
    let right = v.startsWith('/')
    if (left !== right) str += v
    else if (left) str += v.slice(1)
    else str += '/' + v
  }
  return str
}

const reservedChars = /[ <>:"/\\|?*\x00-\x1F]/g
const endingDashes = /([-]+$)/g
export function slugify (str = '') {
  return str.replace(reservedChars, '-').replace(endingDashes, '')
}

export async function getSiteMeta () {
  var [info, authors] = await Promise.all([
    beaker.hyperdrive.getInfo(),
    beaker.hyperdrive.readdir('/users', {includeStats: true}).catch(e => ([]))
  ])
  var userIsAuthor = false
  for (let author of authors) {
    if (!author.stat.mount?.key) continue
    let info = await beaker.hyperdrive.getInfo(author.stat.mount.key).catch(e => undefined)
    if (info?.writable) {
      author.writable = true
      userIsAuthor = true
    }
  }
  return {
    authors: authors.map(a => ({name: a.name, key: a.stat.mount?.key, writable: !!a.writable})),
    userIsAdmin: info.writable,
    userIsAuthor
  }
}

export async function queryForPage (path) {
  if (path.endsWith('/')) {
    path = joinPath(path, 'index.md')
  }
  console.debug('Querying', joinPath(QUERY_ROOT_PATH, path))
  var files = await beaker.hyperdrive.query({
    path: joinPath(QUERY_ROOT_PATH, path),
    sort: 'mtime',
    reverse: true
  })
  return files[0]
}

export async function writeFile (author, path, content) {
  if (path.endsWith('/')) {
    path = joinPath(path, 'index.md')
  }
  console.log('writing to', joinPath(ROOT_PATH(author.name), path))
  var filePath = joinPath('beaker-wiki', WIKI_KEY, path)
  await beaker.hyperdrive.drive(author.key).writeFile(filePath, content, {ensureParent: true})
}