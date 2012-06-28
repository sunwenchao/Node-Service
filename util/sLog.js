/**
 * @fileOverview : 简易彩色日志工具
 * @description : 时间 + 类型 + 位置 + 信息
 * @author : Sun
 */
var cwd = process.cwd() + '/',

    INFO = 0,

    DEBUG = 1,

    WARNING = 2,

    ERROR = 3,

    TRACE = 4,

    type = ['INFO', 'DEBUG', 'WARNING', 'ERROR', 'TRACE', '', 'LOG_INIT'],

    colors = [38, 34, 35, 31, 32, 36, 33];

// 输出日志
function log( type, msg ) {

    var log = {
        type : type,
        msg : msg,
        time : getTime(),
        pos : getPos()
    };

    console.log( formatLog( log, true ) );
}

// 获取位置
function getPos() {

    try {

        throw new Error();

    } catch (e) {

        var pos = e.stack.split('\n')[4].split('(')[1].split(')')[0].split(':');

        return pos[0].replace(cwd, '') + ':' + pos[1];
    }
}

// 格式化数字
function pad2(num) {

    return num > 9 ? num : '0' + num;
}

// 格式化时间
function getTime() {

    var t = new Date();

    return [t.getFullYear(), '-', pad2(t.getMonth() + 1) , '-', pad2(t.getDate()), ' ',

        pad2(t.getHours()), ':', pad2(t.getMinutes()), ':', pad2(t.getSeconds())].join('');
}

// 格式化日志
function formatLog(log, color) {

    var tag = head = foot = '';

    if (color) {

        head = '\x1B[';

        foot = '\x1B[0m';

        tag = colors[5] + 'm';

        color = colors[log.type] + 'm';
    }

    return [ log.time, ' [', head, color, type[log.type], foot, '] [', head, tag, log.pos, foot, '] ', log.msg ].join('');
}

// 导出 API
module.exports =  {

    info : function ( msg ) {
        log( INFO, msg );
    },

    debug : function ( msg ) {
        log( DEBUG, msg );
    },

    warning : function ( msg ) {
        log( WARNING, msg );
    },

    error : function ( msg ) {
        log( ERROR, msg );
    },

    trace : function ( msg ) {
        log( TRACE, msg );
    }
};