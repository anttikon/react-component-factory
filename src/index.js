#!/usr/bin/env node
import DefaultAction from './config/default'
import DevComponent from './config/devComponent'
import { getPackageManager } from './packageManager'
import JestAction from './config/jest'
import childProcess from 'child_process'
import Config from './config/config'
import { green, bold, gray } from 'chalk'

function npmInstall(packageManager) {
  if (packageManager === 'npm') {
    childProcess.execSync(`cd ${Config.getTargetDir()} && npm install`, { stdio: [0, 1, 2] });
  } else if (packageManager === 'yarn') {
    childProcess.execSync(`cd ${Config.getTargetDir()} && yarn`, { stdio: [0, 1, 2] });
  }
}

async function start() {
  if (process.argv.length !== 3) {
    console.log('Error! Expecting for argument!')
    console.log(bold('react-component-factory MyBestComponent'))
    return {}
  }

  const packageManager = await getPackageManager()
  const appName = Config.getDefaultAppName()

  await new DefaultAction().action({ appName, packageManager })
  const addDevComponent = await new DevComponent().action()
  const addJest = await new JestAction().action()

  npmInstall(packageManager)
  return { appName, packageManager, addDevComponent, addJest }
}

function printSuccess({ appName, packageManager, addDevComponent, addJest }) {
  if (!appName) {
    return
  }

  console.log('')
  console.log(green('Success!'))
  console.log('')
  console.log('Go to your components directory:', bold(`cd ${appName}`))
  console.log('')

  if (addDevComponent) {
    const command = packageManager === 'npm' ? 'npm run start' : 'yarn start'
    console.log('Start a React app with your component:', bold(command))
    console.log(gray('This will help you a lot when you are developing your component!'))
    console.log('')
  }

  if (addJest) {
    const command = packageManager === 'npm' ? 'npm run test' : 'yarn test'
    console.log('Run tests:', bold(command))
    console.log(gray('I have created a really simple snapshot test for you!'))
    console.log('')
  }

  if (packageManager === 'npm') {
    console.log('Build your component:', bold('npm run build'))
  } else {
    console.log('Build your component:', bold('yarn build'))
  }
  console.log('')

  console.log('Try it in your project as local dependency:')
  if (packageManager === 'npm') {
    console.log(bold(`npm install ${Config.getTargetDir()}`))
  } else {
    console.log(bold(`yarn add file:/${Config.getTargetDir()}`))
  }
  console.log(gray('Just remember to build your component before this!'))
  console.log('')
  console.log(bold('Have fun!'))
}

start().then(opts => printSuccess(opts))
