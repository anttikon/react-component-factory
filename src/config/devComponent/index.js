import inquirer from 'inquirer'
import Config from '../config'
import packageJson from './content/package.json'
import { bold, gray } from 'chalk'

export default class DevComponent extends Config {
  constructor() {
    super('devComponent')
  }

  async action() {
    const question = {
      type: 'confirm',
      name: 'includeDevComponent',
      message: `Do you want to create a development React template for your component?`,
      default: true
    }
    const { includeDevComponent } = await inquirer.prompt(question)
    if (!includeDevComponent) {
      return false
    }
    this.copyFiles()
    this.mergePackageJson(packageJson)
    return true
  }

}
