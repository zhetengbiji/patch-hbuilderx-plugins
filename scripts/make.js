const path = require('path')
const dotenv = require('dotenv')
dotenv.config()
const minimist = require('minimist')
const argv = minimist(process.argv.slice(2))
const spawn = require('cross-spawn')

const HBUILDERX_PLUGINS_DIR = process.env.HBUILDERX_PLUGINS_DIR
const HBUILDERX_PLUGINS_PATCHES_DIR = process.env.HBUILDERX_PLUGINS_PATCHES_DIR
const pluginName = argv.plugin
const packageNames = argv._

console.log(`pluginName: ${pluginName}`)
console.log(`packageNames: ${packageNames}`)

const cwd = path.join(HBUILDERX_PLUGINS_DIR, pluginName)
const pathDir = path.relative(cwd, path.join(HBUILDERX_PLUGINS_PATCHES_DIR, pluginName))

const child = spawn('patch-package', packageNames.concat(['--exclude', '.DS_Store', '--patch-dir', pathDir]), {
  stdio: 'inherit',
  cwd
})

child.on('error', error => console.error(error))
child.on('exit', () => console.log('Patch Done'))
