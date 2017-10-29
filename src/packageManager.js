import inquirer from 'inquirer'

const { exec } = require('child_process')

function getPackageManagerVersion(packageManager) {
  return new Promise((resolve) => {
    exec(`${packageManager} --version`, (err, stdout, stderr) => {
      if (!err && !stderr && stdout) {
        return resolve({ version: stdout.trim() })
      } else {
        return resolve(undefined)
      }
    });
  })
}

async function getInstalledPackageManagers() {
  const npmVersion = await getPackageManagerVersion('npm')
  const yarnVersion = await getPackageManagerVersion('yarn')

  const installedPackageManagers = []
  if (npmVersion) {
    installedPackageManagers.push('npm')
  }
  if (yarnVersion) {
    installedPackageManagers.push('yarn')
  }
  return installedPackageManagers
}

export const getPackageManager = async () => {
  const installedPackageManagers = await getInstalledPackageManagers()
  if (installedPackageManagers.length > 1) {

    const question = [
      {
        type: 'list',
        name: 'packageManager',
        message: 'What package manager do you want to use?',
        choices: installedPackageManagers
      }
    ];

    const { packageManager } = await inquirer.prompt(question)

    console.log(`You selected: ${packageManager}`)
    return packageManager
  } else if (installedPackageManagers.length === 1) {
    const packageManager = installedPackageManagers[0]
    console.log(`Found: ${packageManager}`)
    return packageManager
  } else {
    console.log('Cannot find any package manager. Defaulting to npm.')
    return 'npm'
  }
}
