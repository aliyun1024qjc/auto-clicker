# BONK 按钮自动点击器

这个项目提供了两个Tampermonkey脚本，用于自动点击 [bonkbutton.com](https://bonkbutton.com/) 网站上的"BONK PREVIEW!"按钮。这些脚本可以帮助用户自动完成点击任务，无需手动操作。

## 功能特点

### 1. 多次点击版本 (bonk_auto_clicker.js)

- 每次循环尝试使用3种不同方法点击按钮
- 更强力的点击方式，确保按钮被成功点击
- 适合网站反应不灵敏的情况

### 2. 单次点击版本 (bonk_single_clicker.js)

- 每次循环只点击按钮一次
- 更精确的点击方式，不会过多点击
- 适合网站反应灵敏的情况

## 安装步骤

### 前提条件

1. 您需要在浏览器中启用开发者模式
   - Chrome: 打开扩展管理页面 `chrome://extensions/`，右上角开启"开发者模式"
   - Edge: 打开扩展管理页面 `edge://extensions/`，左下角开启"开发者模式"
   - Firefox: 打开 `about:addons`，点击"扩展"，不需要特别开启开发者模式

2. 您需要安装支持用户脚本的浏览器扩展，推荐使用 [Tampermonkey](https://www.tampermonkey.net/)
   - [Chrome版Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox版Tampermonkey](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - [Edge版Tampermonkey](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

### 安装脚本

#### 方法一：直接安装

1. 确保您已安装Tampermonkey浏览器扩展
2. 点击下面的安装链接（需要先将脚本上传到可访问的位置）:
   - [安装 BONK 多次点击版](https://github.com/YOUR_USERNAME/bonk-auto-clicker/raw/main/bonk_auto_clicker.js)
   - [安装 BONK 单次点击版](https://github.com/YOUR_USERNAME/bonk-auto-clicker/raw/main/bonk_single_clicker.js)
3. Tampermonkey会自动识别脚本并打开安装界面
4. 点击"安装"按钮完成安装

#### 方法二：手动安装

1. 点击浏览器中的Tampermonkey图标
2. 选择"添加新脚本"
3. 删除编辑器中的所有默认代码
4. 将以下任一脚本的完整代码复制粘贴到编辑器中:
   - [多次点击版代码](https://github.com/YOUR_USERNAME/bonk-auto-clicker/blob/main/bonk_auto_clicker.js)
   - [单次点击版代码](https://github.com/YOUR_USERNAME/bonk-auto-clicker/blob/main/bonk_single_clicker.js)
5. 按下 `Ctrl+S` 或点击"文件"→"保存"来保存脚本

## 使用方法

1. 安装完成后，访问 [bonkbutton.com](https://bonkbutton.com/)
2. 脚本会自动开始运行，每秒点击一次BONK按钮
3. 可以通过控制台日志查看脚本运行状态（按F12打开开发者工具，切换到Console标签）

## 自定义设置

如果需要调整点击频率或其他设置，可以编辑脚本中的以下配置项：

```javascript
const config = {
    clickInterval: 1000, // 点击间隔，单位毫秒（1000=1秒）
    logClicks: true,     // 是否在控制台记录点击
    maxAttempts: 10,     // 尝试查找按钮的最大次数
    currentAttempt: 0    // 当前尝试次数
};
```

## 故障排除

如果脚本不能正常工作，请尝试以下步骤：

1. **确认脚本已启用**：在Tampermonkey菜单中确认脚本已启用
2. **检查控制台错误**：按F12打开开发者工具，查看Console中是否有错误信息
3. **尝试不同的脚本注入模式**：在Tampermonkey设置中，尝试不同的"脚本注入模式"
4. **尝试不同的沙箱模式**：编辑脚本，修改 `@sandbox` 参数的值
5. **切换脚本版本**：如果一个版本不工作，试试另一个版本

## 注意事项

- 同时只应启用一个脚本版本，避免重复点击
- 这些脚本仅适用于 bonkbutton.com 网站
- 使用脚本时请遵守网站的使用条款
- 过于频繁的点击可能会导致IP被限制

## 技术细节

这些脚本使用多种方法查找和点击按钮：

1. 查找包含"BONK PREVIEW"文本的span元素，然后找到它的父按钮
2. 查找包含SVG图标和BONK文本的按钮
3. 查找带有animate-pulse类的元素
4. 尝试多种CSS选择器定位按钮

## 贡献

欢迎提交问题报告或改进建议。如果您想贡献代码，请提交Pull Request。

## 许可证

[MIT License](LICENSE) 