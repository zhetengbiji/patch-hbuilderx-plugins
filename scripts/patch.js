const path = require('path')
const fs = require('fs')
const minimist = require('minimist')
const argv = minimist(process.argv.slice(2))
const inquirer = require('inquirer')
const degit = require('degit')
const spawn = require('cross-spawn')
const del = require('del')

let hbuilderxPach = argv._[0]

async function patch () {
  if (!hbuilderxPach) {
    const answers = await inquirer.prompt([{
      type: 'input',
      name: 'path',
      message: 'HBuilderX Path',
      default: process.cwd
    }])
    hbuilderxPach = answers.path
  }

  if (hbuilderxPach.endsWith('.app')) {
    hbuilderxPach = path.join(hbuilderxPach, 'Contents', 'HBuilderX')
  }

  const pluginsPach = path.join(hbuilderxPach, 'plugins')
  const cachePath = path.join(pluginsPach, '.patch-hbuilderx-plugins')

  const releasePath = path.join(hbuilderxPach, 'ReleaseNote.md')

  const release = fs.readFileSync(releasePath, { encoding: 'utf8' })

  const resut = release.match(/\d+.\d+.\d+.\d+(-alpha)?/)
  const version = resut && resut[0]

  console.log(`HBuilderX Version: ${version}`)

  const emitter = degit(`zhetengbiji/hbuilderx-plugins-patches#v${version}`, {
    cache: false,
    force: true
  })
  await emitter.clone(cachePath)
  console.log('Patches download success')
  const plugins = fs.readdirSync(cachePath)
  for (let i = 0; i < plugins.length; i++) {
    const plugin = plugins[i]
    const pluginPatchsPath = path.join(cachePath, plugin)
    const isDir = fs.statSync(pluginPatchsPath).isDirectory()
    if (!isDir) {
      continue
    }
    const cwd = path.join(pluginsPach, plugin)
    const pathDir = path.relative(cwd, pluginPatchsPath)
    await new Promise((resolve) => {
      const child = spawn('node', [require.resolve('patch-package'), '--patch-dir', pathDir], {
        stdio: 'inherit',
        cwd
      })

      child.on('error', error => console.error(error))
      child.on('exit', () => {
        resolve()
      })
    })
  }
  await del(cachePath, {
    force: true
  })
  console.log('Patch Done')
}

patch()
