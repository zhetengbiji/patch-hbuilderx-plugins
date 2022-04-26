const path = require('path')
const fs = require('fs')
const minimist = require('minimist')
const argv = minimist(process.argv.slice(2))
const degit = require('degit')
const spawn = require('cross-spawn')

const CACHE_PATH = path.join(__dirname, '../.cache')

let hbuilderxPach = argv._[0]
if (hbuilderxPach.endsWith('.app')) {
  hbuilderxPach = path.join(hbuilderxPach, 'Contents', 'HBuilderX')
}

const pluginsPach = path.join(hbuilderxPach, 'plugins')

const releasePath = path.join(hbuilderxPach, 'ReleaseNote.md')

const release = fs.readFileSync(releasePath, { encoding: 'utf8' })

const version = release.match(/\d+.\d+.\d+.\d+/)

console.log(`HBuilderX Version: ${version}`)

const emitter = degit(`zhetengbiji/hbuilderx-plugins-patches#v${version}`, {
  cache: false,
  force: true
})

emitter.clone(CACHE_PATH).then(() => {
  console.log('Patches download success')
  const plugins = fs.readdirSync(CACHE_PATH)
  plugins.forEach(plugin => {
    const pluginPatchsPath = path.join(CACHE_PATH, plugin)
    const isDir = fs.statSync(pluginPatchsPath).isDirectory()
    if (!isDir) {
      return
    }
    const cwd = path.join(pluginsPach, plugin)
    const pathDir = path.relative(cwd, pluginPatchsPath)
    const child = spawn('patch-package', ['--patch-dir', pathDir], {
      stdio: 'inherit',
      cwd
    })

    child.on('error', error => console.error(error))
    child.on('exit', () => console.log('Patch Done'))
  })
})
