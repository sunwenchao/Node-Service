var logger = global.logger =  require( './util/sLog.js' ),
    CONFIG = global.CONFIG =  require( './config.js' );

logger.info( 'Node 服务启动...' );


if( CONFIG.useLESS ) {
    var LessWorker = require( './less/init.js' ).worker;
    var lessWorker = new LessWorker();
    lessWorker.init();
};

process.on( 'exit', function () {
    logger.info( 'Node 服务结束' );
});

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
});

// 处理命令行输入
process.stdin.resume();
process.stdin.setEncoding( 'utf8' );

process.stdin.on( 'data', function ( chunk ) {
    var stdinV = chunk.substring( 0, chunk.length - 1 );
    stdinWorker( stdinV );
});

// 命令行输入处理列表
function stdinWorker( stdinV ){

    switch( stdinV )
    {
        // 输入 less 执行 less 初始化
        case 'lessinit':
            if ( lessWorker ) lessWorker.init();
            break

        // 回车
        case '':
            break

        // 输入不匹配则输出提示
        default: logger.warning( '无效的命令...' );
    }
}