var logger = global.logger =  require( './util/sLog.js'),
    CONFIG = global.CONFIG =  require( './config.js' );

logger.info('Node 服务启动...');


if( CONFIG.useLESS ) {
    var LessWorker = require( './less/init.js').worker;
    new LessWorker().init();
};
