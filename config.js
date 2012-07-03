/**
 * Node 服务所有相关配置信息
 * @type {Object}
 */
module.exports = {

    // webroot 目录位置
    webRoot : '/Users/sunwenchao/Git/Backbone-Patterns/public',

    // 使用 LESS 服务
    useLESS : true,

    // LESS 相关配置
    LESSconfig : {
        cssDir : true
    },

    // 使用 handlebars 服务
    useHandlebars : false,

    // 使用 seajs 服务
    useSeajs : false,



    // 只在部署时执行一次 不执行监听
    watch : true,

    version : '0.0.1'
};