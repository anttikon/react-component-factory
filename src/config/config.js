import { execSync } from 'child_process'
import packageJson from '../../package'
import fs from 'fs-extra'
import { merge } from 'lodash'

const filter = (src) => {
  // Do not override package.json!
  return !src.endsWith('/content/package.json') || src.endsWith('default/content/package.json')
}

export default class Config {

  constructor(name) {
    this.name = name
  }

  static getDefaultAppName() {
    return process.argv[process.argv.length - 1]
  }

  static getFilesDirectory() {
    try {
      const path = execSync('npm root -g')
      if (path) {
        return `${path.toString().trim()}/${packageJson.name}`
      }
      return undefined
    } catch (e) {
      return undefined
    }
  }

  getSourceDirectory() {
    return `${Config.getFilesDirectory()}/lib/config/${this.name}/content`
  }

  static getTargetDir() {
    return `${process.cwd()}/${Config.getDefaultAppName()}`
  }

  mergePackageJson(packageContent) {
    const packageJsonPath = `${Config.getTargetDir()}/package.json`
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath))
    const packageJsonChanges = packageContent ? packageContent : JSON.parse(fs.readFileSync(`${this.getSourceDirectory()}/package.json`))
    const merged = JSON.stringify(merge(packageJson, packageJsonChanges), null, 2)
    fs.writeFileSync(packageJsonPath, merged)
  }

  copyFiles() {
    fs.copySync(this.getSourceDirectory(), Config.getTargetDir(), { filter: filter })
  }

  copyFile(path, target) {
    fs.copySync(`${Config.getFilesDirectory()}/lib/config/${this.name}${path}`, `${Config.getTargetDir()}/${target}`)
  }

}
