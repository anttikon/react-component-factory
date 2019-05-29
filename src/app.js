#!/usr/bin/env node
const fs = require('fs').promises
const {spawn} = require('child_process')

const componentName = process.argv[2]
const examplePackageJson = require(`${__dirname}/../skeleton/example-package.json`)
const devDeps = ['@babel/preset-react', '@babel/preset-env', '@babel/core', '@babel/cli']

function runLocalCommand(command, args) {
  return new Promise((resolve, reject) => {
    const err = []
    const output = []
    const dir = spawn(command, args)
    dir.stdout.on('data', (data) => {
      output.push(data.toString().trim())
    })
    dir.stderr.on('data', (data) => {
      err.push(data)
    })
    dir.on('close', (code) => code === 0 ? resolve(output) : reject(err.join('\n')))
  })
}

async function addPeerDependencies(json) {
  const [latestReactVersion] = await runLocalCommand('npm', ['show', 'react', 'version'])
  const peerDependencies = {
    react: latestReactVersion,
  }
  return {...json, peerDependencies}
}

async function main({packageJson, name, dir}) {
  console.log('Preparing...')
  const withPeerDependencies = await addPeerDependencies(packageJson)
  const withName = {...withPeerDependencies, name: name}

  console.log('Creating', dir)
  await fs.mkdir(`${dir}`)
  await fs.mkdir(`${dir}/src`)

  console.log('Creating package.json')
  await fs.writeFile(`${dir}/package.json`, JSON.stringify(withName, null, 2))
  console.log('Creating .babelrc')
  await fs.copyFile(`${__dirname}/../skeleton/example-babelrc.json`, `${dir}/.babelrc`)
  console.log('Creating component')
  await fs.copyFile(`${__dirname}/../skeleton/example-component.js`, `${dir}/src/index.js`)

  process.chdir(dir)

  console.log('Installing devDependencies')
  await runLocalCommand('npm', ['install', '--save-dev', ...devDeps])
  await runLocalCommand('npm', ['run', 'build'])

  console.log('')
  console.log('# Build component:')
  console.log(`cd ${dir} && npm run build`)
  console.log('')
  console.log('# Install this component to another project as a local dependency:')
  console.log('npm install ', dir)
  console.log('')
  console.log('# Publish new component to npm:')
  console.log('npm publish')
  console.log('')
}

if (componentName) {
  const compomnentDir = `${process.cwd()}/${componentName}`
  main({packageJson: examplePackageJson, name: componentName, dir: compomnentDir})
    .then(() => console.log('All done!'))
    .catch(e => console.error(e))
} else {
  console.log('\nUsage: react-component-factory <componentName>\n')
}
