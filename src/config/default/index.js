import Config from '../config'

export default class Default extends Config {
  constructor() {
    super('default')
  }

  async action({ appName, packageManager }) {
    this.copyFiles()
    this.copyFile('/babel/babelrc', '/.babelrc')
    const prepublish = packageManager === 'npm' ? 'npm run build' : 'yarn build'
    await this.mergePackageJson({ name: appName.toLowerCase(), scripts: { prepublish } })
  }
}
