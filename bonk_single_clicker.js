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