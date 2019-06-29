import { Options as requestOptions } from 'request'
import Plugin, { tools } from '../../plugin'

class Chaorendama extends Plugin {
  constructor() {
    super()
  }
  public name = '超人打码'
  public description = '使用超人打码识别验证码'
  public version = '0.0.1'
  public author = 'lzghzr'
  /**
   * 获取设置
   *
   * @private
   * @type {options}
   * @memberof Chaorendama
   */
  private _!: options
  public async load({ defaultOptions, whiteList }: {
    defaultOptions: options,
    whiteList: Set<string>
  }): Promise<void> {
    defaultOptions.config['chaorendama'] = []
    defaultOptions.info['chaorendama'] = {
      description: '超人打码',
      tip: '超人打码账号密码, 格式: username,password',
      type: 'stringArray'
    }
    whiteList.add('chaorendama')
    this.loaded = true
  }
  public async options({ options }: { options: options }): Promise<void> {
    this._ = options
    tools.Captcha = captchaJPEG => this._captcha(captchaJPEG)
  }
  private async _captcha(captchaJPEG: string) {
    const [username, password] = <string[]>this._.config['chaorendama']
    if (username === undefined || password === undefined) return ''
    const image = captchaJPEG.split(',')[1]
    const imgdata = Buffer.from(image, 'base64').toString('hex')
    const send: requestOptions = {
      method: 'POST',
      uri: 'http://api2.sz789.net:88/RecvByte.ashx',
      form: {
        username,
        password,
        softId: '67985',
        imgdata
      },
      json: true,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }
    const ruokuaiResponse = await tools.XHR<chaorendamaResponse>(send)
    if (ruokuaiResponse !== undefined && ruokuaiResponse.response.statusCode === 200) {
      const body = ruokuaiResponse.body
      if (body.info === 1) {
        tools.Log('超人打码', 'imgId', body.imgId)
        return body.result
      }
      else {
        tools.Log('超人打码', body.info)
        return ''
      }
    }
    else {
      tools.Log('超人打码', '网络错误')
      return ''
    }
  }
}

/**
 * 超人打码返回
 *
 * @interface chaorendamaResponse
 */
interface chaorendamaResponse {
  info: number
  result: string
  imgId: string
}

export default new Chaorendama()