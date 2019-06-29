"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_1 = __importStar(require("../../plugin"));
class Chaorendama extends plugin_1.default {
    constructor() {
        super();
        this.name = '超人打码';
        this.description = '使用超人打码识别验证码';
        this.version = '0.0.1';
        this.author = 'lzghzr';
    }
    async load({ defaultOptions, whiteList }) {
        defaultOptions.config['chaorendama'] = [];
        defaultOptions.info['chaorendama'] = {
            description: '超人打码',
            tip: '超人打码账号密码, 格式: username,password',
            type: 'stringArray'
        };
        whiteList.add('chaorendama');
        this.loaded = true;
    }
    async options({ options }) {
        this._ = options;
        plugin_1.tools.Captcha = captchaJPEG => this._captcha(captchaJPEG);
    }
    async _captcha(captchaJPEG) {
        const [username, password] = this._.config['chaorendama'];
        if (username === undefined || password === undefined)
            return '';
        const image = captchaJPEG.split(',')[1];
        const imgdata = Buffer.from(image, 'base64').toString('hex');
        const send = {
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
        };
        const ruokuaiResponse = await plugin_1.tools.XHR(send);
        if (ruokuaiResponse !== undefined && ruokuaiResponse.response.statusCode === 200) {
            const body = ruokuaiResponse.body;
            if (body.info === 1) {
                plugin_1.tools.Log('超人打码', 'imgId', body.imgId);
                return body.result;
            }
            else {
                plugin_1.tools.Log('超人打码', body.info);
                return '';
            }
        }
        else {
            plugin_1.tools.Log('超人打码', '网络错误');
            return '';
        }
    }
}
exports.default = new Chaorendama();
