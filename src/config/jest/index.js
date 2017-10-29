import { merge } from 'lodash'
import inquirer from 'inquirer'
import packageJson from './content/package.json'
import Config from '../config'

export default class Jest extends Config {
  constructor() {
    super('jest')
  }

  async action() {
    const question = {
      type: 'confirm',
      name: 'includeJestTests',
      message: 'Do you want to create a simple default test for your component?',
      default: true
    }
    const { includeJestTests } = await inquirer.prompt(question)
    if (!includeJestTests) {
      return false
    }

    this.copyFiles()
    this.mergePackageJson(packageJson)
    return true
  }
}
