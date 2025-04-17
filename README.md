# enum2map

从选中的枚举类型，自动生成枚举类型与文案的映射关系

## 使用(usage)

安装完成并且启用插件之后

定义一个枚举类型，然后全选该枚举,
1. 按快捷键 mac: `option + m`, windows: `alt + m` 或右键菜单点击 enum2map-map，即可生成对应映射（Map）
2. 按快捷键 mac: `option + r`, windows: `alt + r` 或右键菜单点击 enum2map-map，即可生成对应映射（Record）
3. 按快捷键 mac: `option + o`, windows: `alt + o` 或右键菜单点击 enum2map-options，即可生成对应的options

生成的option项，默认类型是 Array<{ label: string; value: Enum }>;

通过setting.json设置
- enum2map.optionsLabel(默认：label)
- enum2map.optionsValue(默认：value)

可替换默认的类型

example:
- enum2map.optionsLabel: "key"
- enum2map.optionsValue: "children"

则自动生成的类型是 Array<{ key: string; children: Enum }>;

## tip

映射的值，如果有注释，取注释的内容，否则是枚举值自身的字符串

## demo

![feature X](https://festatic-1254389369.file.myqcloud.com/vscode/demo.gif)
