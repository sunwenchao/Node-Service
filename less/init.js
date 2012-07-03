/**
 * LESS 服务
 * @author : SunWenchao
 * @description : 扫描 webRoot 下所有 less 文件编译为 css, 并进行变化监测
 */
var fs = require( 'fs' ),
    path = require( 'path' ),
    _ = require( 'underscore' ),
    less = require( 'less' ),

    logger = global.logger,
    CONFIG = global.CONFIG,

    LESSREG = /\.less$/,
    LESSDIRREG = /less$/;

// LessWorker 类
function LessWorker() {

    this.watchLESS = CONFIG.watch; // 是否启动监测

    var tipsWord = this.watchLESS ? '( 本次服务启动监测 )' : '';

    logger.info( 'LESS 服务启动 ...' + tipsWord );

    this.rootDir = CONFIG.webRoot;
}

// 原型方法扩展
_.extend( LessWorker.prototype, {

    // 初始化扫描并编译的方法
    init : function(){

        logger.info( 'LESS 服务马上扫描 ' + this.rootDir + ' 目录，编译全部less文件 ...'  );

        this.lessFileList = []; // less 文件列表

        this._initParser();

        try{
            var fileList = fs.readdirSync( this.rootDir );
        }catch( err ){
            return logger.error( '根目录读取错误:' + this.rootDir );
        }

        this._scanLess( fileList, this.rootDir );
    },

    // 初始化 LESS解析器
    _initParser : function(){

        this.parser = new( less.Parser )({
            // Specify search paths for @import directives
            // less 文件中 @import 路径的跟
            paths: [ this.rootDir ]
        });
    },

    // 扫描 less 文件
    _scanLess : function( fileList, fileDir ){
        var self = this;

        // 遍历 fileList 查找 less 文件
        _.each( fileList, function( nFile ){

            nFile = path.join( fileDir, nFile );

            var nState = fs.statSync( nFile );

            if( nState.isDirectory() ){
                // 如果为文件夹则递归扫描
                var nFileList = fs.readdirSync( nFile );

                self._scanLess( nFileList, nFile );

            }else{
                // 检测是否为 less 文件
                if( nFile.match( LESSREG ) ){

                    self.lessFileList.push( nFile ); // 增加到 less 队列中

                    self._compile( nFile ); // 编译文件

                    if( self.watchLESS ) self._watch( nFile );
                }
            }
        });
    },

    // 编译 less 文件
    // problem : @import 有事导致文件不被解析 待排查
    _compile : function( lessFile, fromWatch ){

        var lessContents = fs.readFileSync( lessFile ).toString(), // 读取 less 文件
            lessParser = this.parser,
            self = this;

        lessParser.parse( lessContents, function( err, tree ){

            if( err ) return logger.debug( '编译 ' + lessFile + ' 发生错误: ' + err );

            // todo  lessParser.imports.files

            var cssFileName = self._getCssFileName( lessFile );

            fs.writeFileSync( cssFileName, tree.toCSS() ); // 写入 css 文件

            var logWord = fromWatch ? ' 监测到发生变动进行' : ' 初始化';
            logger.info( path.basename( lessFile ) + '--------->'
                + path.basename( cssFileName ) + logWord + '编译成功!' );
        });
    },

    // 根据配置 返回生成css文件的位置
    _getCssFileName : function( lessFile ){

        if( CONFIG.LESSconfig.cssDir ){
            var cssFileDir = path.dirname( lessFile ).replace( LESSDIRREG, 'css' );

            if( !fs.existsSync( cssFileDir ) ) fs.mkdirSync( cssFileDir );

            return cssFileDir + '/' + path.basename( lessFile ).replace( LESSREG, '.css' );

        }else{
            return lessFile.replace( LESSREG, '.css' );
        }
    },

    // 实时监测 less 文件变化并编译的方法
    _watch : function( nFile ){
        var self = this;

        fs.watchFile( nFile, function ( curr, prev ) {
            // console.log( curr.mtime + prev.mtime );
            self._compile( nFile, true );
        });
    }

});

// 外部接口
exports.worker = LessWorker;
exports.version = '0.0.2';