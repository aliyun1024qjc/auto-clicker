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

#### 方法一：直接复制代码

1. 点击浏览器中的Tampermonkey图标
2. 选择"添加新脚本"
3. 删除编辑器中的所有默认代码
4. 复制下面的脚本代码（选择一个版本）并粘贴到编辑器中

**多次点击版代码 (bonk_auto_clicker.js):**

```javascript
// ==UserScript==
// @name         BONK Button Auto Clicker
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  自动点击BONK PREVIEW!按钮
// @author       You
// @match        https://bonkbutton.com/*
// @grant        GM_log
// @grant        unsafeWindow
// @grant        GM_addElement
// @inject-into  page
// @run-at       document-start
// @sandbox      JavaScript
// ==/UserScript==

// 这行会在脚本加载时立即执行
unsafeWindow.console.log('===== BONK自动点击脚本正在初始化 =====');

(function() {
    'use strict';
    
    // 使用unsafeWindow确保日志输出在页面的console中
    const log = (msg) => { 
        unsafeWindow.console.log(msg); 
        if(typeof GM_log !== 'undefined') {
            GM_log(msg);
        }
    };
    
    // 立即输出日志以验证脚本是否正在执行
    log('BONK脚本：开始检查网站');
    
    // 检查是否为目标网站
    if (!window.location.href.includes('bonkbutton.com')) {
        log('BONK脚本：不是目标网站，脚本不执行');
        return;
    }
    
    log('BONK脚本：确认网站符合要求，已加载');
    
    // 配置项
    const config = {
        clickInterval: 1000, // 点击间隔，单位毫秒
        logClicks: true,
        maxAttempts: 10,
        currentAttempt: 0
    };

    // 安全地创建鼠标事件
    function createSafeMouseEvent(eventType) {
        try {
            // 尝试创建带完整参数的事件
            return new MouseEvent(eventType, {
                bubbles: true,
                cancelable: true,
                view: unsafeWindow || window
            });
        } catch (e) {
            try {
                // 如果失败，尝试创建基本事件
                return new MouseEvent(eventType, {
                    bubbles: true,
                    cancelable: true
                });
            } catch (e2) {
                // 如果还是失败，使用创建事件的传统方法
                const event = document.createEvent('MouseEvents');
                event.initEvent(eventType, true, true);
                return event;
            }
        }
    }

    // 尝试多种选择器查找按钮
    function findBonkButton() {
        log('BONK脚本：开始查找按钮');
        
        try {
            // 直接查找span标签中包含BONK PREVIEW!文字的元素的父按钮
            const allSpans = document.querySelectorAll('span');
            for (const span of allSpans) {
                if (span.textContent && span.textContent.includes('BONK PREVIEW')) {
                    // 向上查找按钮或可点击元素
                    let parent = span.parentElement;
                    while (parent) {
                        if (
                            parent.tagName === 'BUTTON' || 
                            parent.getAttribute('role') === 'button' ||
                            parent.classList.contains('button') ||
                            parent.classList.contains('btn') ||
                            parent.className.includes('button') ||
                            parent.onclick
                        ) {
                            log('BONK脚本：找到BONK按钮通过span父元素');
                            return parent;
                        }
                        parent = parent.parentElement;
                    }
                    // 如果没找到合适的父元素，至少返回span本身
                    log('BONK脚本：没找到按钮父元素，返回span本身');
                    return span;
                }
            }
            
            // 查找含有特定SVG图标和BONK文本的按钮
            const buttons = document.querySelectorAll('button');
            for (const btn of buttons) {
                if (btn.innerHTML.includes('svg') && btn.textContent.includes('BONK')) {
                    log('BONK脚本：找到包含SVG和BONK文本的按钮');
                    return btn;
                }
            }
            
            // 查找animate-pulse类的元素，这是按钮的特征之一
            const pulseElements = document.querySelectorAll('.animate-pulse');
            if (pulseElements.length > 0) {
                log('BONK脚本：找到animate-pulse类的元素');
                return pulseElements[0];
            }
            
            // 最后，尝试更多通用选择器
            const selectors = [
                '.bonk-button',
                'button:contains("BONK")',
                'button.bonk-button',
                'button[class*="bonk"]',
                'button:has(svg)',
                'button.group',
                '[role="button"]',
                '.btn',
                '[class*="button"]',
                'button'
            ];
            
            for (const selector of selectors) {
                try {
                    const elements = document.querySelectorAll(selector);
                    if (elements && elements.length > 0) {
                        log(`BONK脚本：找到可能的按钮，使用选择器: ${selector}，数量: ${elements.length}`);
                        // 遍历找到的元素，寻找包含BONK文本的
                        for (const el of elements) {
                            if (el.textContent && el.textContent.includes('BONK')) {
                                log('BONK脚本：找到匹配文本的按钮');
                                return el;
                            }
                        }
                        // 如果没有包含BONK文本的，返回第一个
                        return elements[0];
                    }
                } catch (e) {
                    console.error(`BONK脚本：选择器 ${selector} 出错:`, e);
                }
            }
        } catch (e) {
            console.error('BONK脚本：查找按钮时发生错误：', e);
        }
        
        return null;
    }

    // 点击按钮的函数
    function clickBonkButton() {
        log('BONK脚本：尝试点击按钮');
        const bonkButton = findBonkButton();
        
        if (bonkButton) {
            try {
                log('BONK脚本：找到按钮，尝试点击');
                
                // 尝试多种点击方法
                // 方法1: 直接点击
                bonkButton.click();
                
                // 方法2: 创建点击事件 - 使用安全创建方法
                const clickEvent = createSafeMouseEvent('click');
                bonkButton.dispatchEvent(clickEvent);
                
                // 方法3: 触发更多事件序列 - 使用安全创建方法
                const events = ['mouseenter', 'mousedown', 'focus', 'mouseup', 'click'];
                for (const eventType of events) {
                    const event = createSafeMouseEvent(eventType);
                    bonkButton.dispatchEvent(event);
                }
                
                if (config.logClicks) {
                    log('BONK脚本：按钮被点击!', new Date().toLocaleTimeString());
                }
            } catch (e) {
                console.error('BONK脚本：点击按钮时出错:', e);
            }
        } else {
            console.warn(`BONK脚本：未找到按钮 (尝试 ${config.currentAttempt+1}/${config.maxAttempts})`);
            
            // 增加尝试次数
            config.currentAttempt++;
            
            // 如果达到最大尝试次数，打印页面结构以帮助调试
            if (config.currentAttempt >= config.maxAttempts) {
                log('BONK脚本：已达到最大尝试次数，打印按钮信息:');
                try {
                    // 打印所有按钮
                    const allButtons = document.querySelectorAll('button');
                    log(`BONK脚本：页面上有 ${allButtons.length} 个按钮元素`);
                    for (let i = 0; i < Math.min(allButtons.length, 5); i++) {
                        log(`按钮 ${i+1} 文本:`, allButtons[i].textContent);
                    }
                } catch (e) {
                    console.error('打印页面结构时出错:', e);
                }
            }
        }
    }

    // 主函数
    function startAutoClicker() {
        log('BONK脚本：开始自动点击器');
        
        // 立即执行一次
        clickBonkButton();
        
        // 定期点击按钮
        const intervalId = setInterval(clickBonkButton, config.clickInterval);
        log(`BONK脚本：设置了间隔 ${config.clickInterval}ms 的自动点击`);
    }

    // 确保页面加载完成后执行
    function waitForPageLoad() {
        // 尝试注入样式，使元素更容易被选择
        try {
            const style = document.createElement('style');
            style.textContent = `
                button:has(span:contains('BONK')) {
                    border: 2px solid red !important;
                }
            `;
            document.head.appendChild(style);
        } catch (e) {
            log('添加样式失败: ' + e);
        }
        
        // 延迟3秒后开始点击
        setTimeout(startAutoClicker, 3000);
    }

    // 使用多种方法确保脚本执行
    if (document.readyState === 'loading') {
        log('BONK脚本：页面正在加载，等待DOMContentLoaded事件');
        document.addEventListener('DOMContentLoaded', waitForPageLoad);
    } else {
        log('BONK脚本：页面已加载');
        waitForPageLoad();
    }
    
    // 额外保障：如果页面有后续加载的元素，在window加载完成后再次检查
    window.addEventListener('load', () => {
        log('BONK脚本：window.load事件触发');
        // 延迟5秒后再次尝试点击，以防按钮是动态加载的
        setTimeout(clickBonkButton, 5000);
    });
    
    log('BONK脚本：初始化完成');
})();
```

**单次点击版代码 (bonk_single_clicker.js):**

```javascript
// ==UserScript==
// @name         BONK Button Single Clicker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  每次只点击一次BONK PREVIEW!按钮
// @author       You
// @match        https://bonkbutton.com/*
// @grant        GM_log
// @grant        unsafeWindow
// @grant        GM_addElement
// @inject-into  page
// @run-at       document-start
// @sandbox      JavaScript
// ==/UserScript==

// 这行会在脚本加载时立即执行
unsafeWindow.console.log('===== BONK单次点击脚本正在初始化 =====');

(function() {
    'use strict';
    
    // 使用unsafeWindow确保日志输出在页面的console中
    const log = (msg) => { 
        unsafeWindow.console.log(msg); 
        if(typeof GM_log !== 'undefined') {
            GM_log(msg);
        }
    };
    
    // 立即输出日志以验证脚本是否正在执行
    log('BONK单击脚本：开始检查网站');
    
    // 检查是否为目标网站
    if (!window.location.href.includes('bonkbutton.com')) {
        log('BONK单击脚本：不是目标网站，脚本不执行');
        return;
    }
    
    log('BONK单击脚本：确认网站符合要求，已加载');
    
    // 配置项
    const config = {
        clickInterval: 1000, // 点击间隔，单位毫秒
        logClicks: true,
        maxAttempts: 10,
        currentAttempt: 0
    };

    // 安全地创建鼠标事件
    function createSafeMouseEvent(eventType) {
        try {
            // 尝试创建带完整参数的事件
            return new MouseEvent(eventType, {
                bubbles: true,
                cancelable: true,
                view: unsafeWindow || window
            });
        } catch (e) {
            try {
                // 如果失败，尝试创建基本事件
                return new MouseEvent(eventType, {
                    bubbles: true,
                    cancelable: true
                });
            } catch (e2) {
                // 如果还是失败，使用创建事件的传统方法
                const event = document.createEvent('MouseEvents');
                event.initEvent(eventType, true, true);
                return event;
            }
        }
    }

    // 尝试多种选择器查找按钮
    function findBonkButton() {
        log('BONK单击脚本：开始查找按钮');
        
        try {
            // 直接查找span标签中包含BONK PREVIEW!文字的元素的父按钮
            const allSpans = document.querySelectorAll('span');
            for (const span of allSpans) {
                if (span.textContent && span.textContent.includes('BONK PREVIEW')) {
                    // 向上查找按钮或可点击元素
                    let parent = span.parentElement;
                    while (parent) {
                        if (
                            parent.tagName === 'BUTTON' || 
                            parent.getAttribute('role') === 'button' ||
                            parent.classList.contains('button') ||
                            parent.classList.contains('btn') ||
                            parent.className.includes('button') ||
                            parent.onclick
                        ) {
                            log('BONK单击脚本：找到BONK按钮通过span父元素');
                            return parent;
                        }
                        parent = parent.parentElement;
                    }
                    // 如果没找到合适的父元素，至少返回span本身
                    log('BONK单击脚本：没找到按钮父元素，返回span本身');
                    return span;
                }
            }
            
            // 查找含有特定SVG图标和BONK文本的按钮
            const buttons = document.querySelectorAll('button');
            for (const btn of buttons) {
                if (btn.innerHTML.includes('svg') && btn.textContent.includes('BONK')) {
                    log('BONK单击脚本：找到包含SVG和BONK文本的按钮');
                    return btn;
                }
            }
            
            // 查找animate-pulse类的元素，这是按钮的特征之一
            const pulseElements = document.querySelectorAll('.animate-pulse');
            if (pulseElements.length > 0) {
                log('BONK单击脚本：找到animate-pulse类的元素');
                return pulseElements[0];
            }
            
            // 最后，尝试更多通用选择器
            const selectors = [
                '.bonk-button',
                'button:contains("BONK")',
                'button.bonk-button',
                'button[class*="bonk"]',
                'button:has(svg)',
                'button.group',
                '[role="button"]',
                '.btn',
                '[class*="button"]',
                'button'
            ];
            
            for (const selector of selectors) {
                try {
                    const elements = document.querySelectorAll(selector);
                    if (elements && elements.length > 0) {
                        log(`BONK单击脚本：找到可能的按钮，使用选择器: ${selector}，数量: ${elements.length}`);
                        // 遍历找到的元素，寻找包含BONK文本的
                        for (const el of elements) {
                            if (el.textContent && el.textContent.includes('BONK')) {
                                log('BONK单击脚本：找到匹配文本的按钮');
                                return el;
                            }
                        }
                        // 如果没有包含BONK文本的，返回第一个
                        return elements[0];
                    }
                } catch (e) {
                    console.error(`BONK单击脚本：选择器 ${selector} 出错:`, e);
                }
            }
        } catch (e) {
            console.error('BONK单击脚本：查找按钮时发生错误：', e);
        }
        
        return null;
    }

    // 点击按钮的函数 - 这里是关键区别：只使用一种点击方法
    function clickBonkButton() {
        log('BONK单击脚本：尝试点击按钮');
        const bonkButton = findBonkButton();
        
        if (bonkButton) {
            try {
                log('BONK单击脚本：找到按钮，尝试点击');
                
                // 只使用一种点击方法
                bonkButton.click();
                
                if (config.logClicks) {
                    log('BONK单击脚本：按钮被点击!', new Date().toLocaleTimeString());
                }
            } catch (e) {
                console.error('BONK单击脚本：点击按钮时出错:', e);
            }
        } else {
            console.warn(`BONK单击脚本：未找到按钮 (尝试 ${config.currentAttempt+1}/${config.maxAttempts})`);
            
            // 增加尝试次数
            config.currentAttempt++;
            
            // 如果达到最大尝试次数，打印页面结构以帮助调试
            if (config.currentAttempt >= config.maxAttempts) {
                log('BONK单击脚本：已达到最大尝试次数，打印按钮信息:');
                try {
                    // 打印所有按钮
                    const allButtons = document.querySelectorAll('button');
                    log(`BONK单击脚本：页面上有 ${allButtons.length} 个按钮元素`);
                    for (let i = 0; i < Math.min(allButtons.length, 5); i++) {
                        log(`按钮 ${i+1} 文本:`, allButtons[i].textContent);
                    }
                } catch (e) {
                    console.error('打印页面结构时出错:', e);
                }
            }
        }
    }

    // 主函数
    function startAutoClicker() {
        log('BONK单击脚本：开始自动点击器');
        
        // 立即执行一次
        clickBonkButton();
        
        // 定期点击按钮
        const intervalId = setInterval(clickBonkButton, config.clickInterval);
        log(`BONK单击脚本：设置了间隔 ${config.clickInterval}ms 的自动点击`);
    }

    // 确保页面加载完成后执行
    function waitForPageLoad() {
        // 延迟3秒后开始点击
        setTimeout(startAutoClicker, 3000);
    }

    // 使用多种方法确保脚本执行
    if (document.readyState === 'loading') {
        log('BONK单击脚本：页面正在加载，等待DOMContentLoaded事件');
        document.addEventListener('DOMContentLoaded', waitForPageLoad);
    } else {
        log('BONK单击脚本：页面已加载');
        waitForPageLoad();
    }
    
    // 额外保障：如果页面有后续加载的元素，在window加载完成后再次检查
    window.addEventListener('load', () => {
        log('BONK单击脚本：window.load事件触发');
        // 延迟5秒后再次尝试点击，以防按钮是动态加载的
        setTimeout(clickBonkButton, 5000);
    });
    
    log('BONK单击脚本：初始化完成');
})();
```

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