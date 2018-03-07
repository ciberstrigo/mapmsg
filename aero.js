
const DIRECT = "DIRECT"
const SERVICE = "SERVICE"
const INFO = "INFO"
const DIGITAL = "DIGITAL"
const INTERNATIONAL = "INTERNATIONAL"


var request = require("request");

class Aero {
    constructor (login, passwd) {
        this.login = login;
        this.passwd = passwd;

        this.sms = this.sms();
        this.sign = this.sign();
        this.group = this.group();
        this.contact = this.contact();    
        this.blacklist = this.blacklist();
        this.hlr = this.hlr();
        this.number = this.number();
        this.viber = this.viber();
        
    }
    execute (method, params, cb) {
        let url = `https://${this.login}:${this.passwd}@gate.smsaero.ru/v2/${method}?${objToStr(params)}`;
        request(url, (err, res, body) => {
            if (err) {
                console.error(err);
                return;
            }
            cb(err, res, body);
        });
    }
    sms () {
        return {
            send: (params, cb) => {
                this.execute ('sms/send', params, cb)
            },
            status: (params, cb) => {
                this.execute ('sms/status', params, cb)
            },
            list: (params, cb) => {
                this.execute ('sms/list', params, cb)
            },    
        }
    }
    balance (params, cb) {
        this.execute ('balance', params, cb)
    }
    tariffs (params, cb) {
        this.execute ('tariffs', params, cb)
    }
    sign () {
        return {
            add: (params, cb) => {
                this.execute ('sign/add', params, cb)
            },
            list: (params, cb) => {
                this.execute ('sign/list', params, cb)
            },  
        };
    }
    group () {
        return {
            add: (params, cb) => {
                this.execute ('group/add', params, cb)
            },
            delete: (params, cb) => {
                this.execute ('group/delete', params, cb)
            },
            list: (params, cb) => {
                this.execute ('group/list', params, cb)
            },  
        };
    }
    contact () {
        return {
            add: (params, cb) => {
                this.execute ('contact/add', params, cb)
            },
            delete: (params, cb) => {
                this.execute ('contact/delete', params, cb)
            },
            list: (params, cb) => {
                this.execute ('contact/list', params, cb)
            },  
        };        
    }
    blacklist () {
        return {
            add: (params, cb) => {
                this.execute ('blacklist/add', params, cb)
            },
            delete: (params, cb) => {
                this.execute ('blacklist/delete', params, cb)
            },
            list: (params, cb) => {
                this.execute ('blacklist/list', params, cb)
            },  
        };    
    }
    hlr () {
        return {
            check: () => {
                this.execute ('hlr/check', params, cb)
            },
            status: () => {
                this.execute ('hlr/status', params, cb)
            },
        };    
    }
    number () {
        return {
            operator: () => {
                this.execute ('number/operator', params, cb)
            },
        };    
    }
    viber () {
        return {
            send: () => {
                this.execute ('viber/send', params, cb)
            },
            statistic: () => {
                this.execute ('viber/statistic', params, cb)
            },
            sign: () => {
                return {
                    list: () => {
                        this.execute ('viber/sign/list', params, cb)
                    },
                }
            },
            list: () => {
                this.execute ('viber/list', params, cb)
            }
        }
    }
}

let objToStr = (params) => {
    var result = [];
    Object.keys(params).forEach(function(key) {
        result.push(key + "=" + params[key]);
    });
    return result.join("&");    
}


module.exports = Aero;



/*
aero = new Aero('ciberstrigo@gmail.com', 'GnlfJS67QaqIj5i1k4SUodDKcDhb');

aero.sms.send(
     {
         number: '79771671956',
         sign: 'NEWS',
         text: 'Тестовое сообщение.',
         channel: 'INFO'
     },
     (err, res, body) => {
         console.log(body)
     }
);
*/