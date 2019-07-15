module.exports = {
    "parser": "babel-eslint", //指定解析器
    // "extends": "airbnb", // 继承规则
    "env": {
        "browser": true,
        "node": true
    },
    "rules": {
        "indent": ["error", 4] //重写继承的规则
    }
}