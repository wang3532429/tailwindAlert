/**
 * Alert 组件 - 简洁现代的提示组件
 * 使用方法：
 * 1. 引入此JS文件: <script src="alert.js"></script>
 * 2. 调用showAlert函数: showAlert('success', '操作成功！', { position: 'top-right' })
 * 3. position参数可选值：'top-right'、'top-left'、'bottom-right'、'bottom-left'、'top-center'、'bottom-center'、'center'、'top'
 * 4. 使用msg提示：msg.success('操作成功')、msg.error('操作失败')、msg.warning('警告')、msg.info('提示')
 */

// 在文档加载完成后初始化Alert容器
document.addEventListener('DOMContentLoaded', function() {
    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
        .alert-enter {
            opacity: 0;
            transform: translateY(-10px);
        }
        .alert-enter-active {
            opacity: 1;
            transform: translateY(0);
            transition: opacity 200ms ease-out, transform 200ms ease-out;
        }
        .alert-exit {
            opacity: 1;
        }
        .alert-exit-active {
            opacity: 0;
            transform: translateY(-10px);
            transition: opacity 200ms ease-out, transform 200ms ease-out;
        }
        
        /* Modal样式 */
        .modal-overlay {
            opacity: 0;
            transition: opacity 200ms ease-out;
        }
        .modal-overlay-active {
            opacity: 1;
        }
        .modal-container {
            opacity: 0;
            transform: translateY(-20px);
            transition: opacity 200ms ease-out, transform 200ms ease-out;
        }
        .modal-container-active {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
    
    // 创建Alert容器
    const alertContainer = document.createElement('div');
    alertContainer.id = 'alertContainer';
    alertContainer.className = 'fixed z-50 space-y-3 w-80';
    document.body.appendChild(alertContainer);
    
    // 创建Modal容器
    const modalContainer = document.createElement('div');
    modalContainer.id = 'modalContainer';
    document.body.appendChild(modalContainer);
    
    // 检查是否已加载Tailwind CSS
    if (!document.querySelector('script[src*="tailwindcss"]')) {
        console.warn('Alert组件依赖Tailwind CSS，建议添加: <script src="https://cdn.tailwindcss.com"></script>');
    }
});

// 定义不同类型的Alert样式和图标
const alertTypes = {
    success: {
        icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`,
        bgColor: 'bg-[#fdfcf8]',
        textColor: 'text-green-600',
        borderColor: 'border-l border-green-500',
        iconColor: 'text-green-500'
    },
    warning: {
        icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`,
        bgColor: 'bg-[#fdfcf8]',
        textColor: 'text-orange-600',
        borderColor: 'border-l border-orange-500',
        iconColor: 'text-orange-500'
    },
    error: {
        icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`,
        bgColor: 'bg-[#fdfcf8]',
        textColor: 'text-red-600',
        borderColor: 'border-l border-red-500',
        iconColor: 'text-red-500'
    },
    info: {
        icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`,
        bgColor: 'bg-[#fdfcf8]',
        textColor: 'text-blue-600',
        borderColor: 'border-l border-blue-500',
        iconColor: 'text-blue-500'
    }
};

/**
 * 显示Alert提示
 * @param {string} type - 提示类型：'success' | 'warning' | 'error' | 'info'
 * @param {string} message - 提示信息
 * @param {object} options - 配置选项
 * @param {string} options.position - 弹出位置：'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center' | 'center' | 'top'
 * @param {number} options.duration - 显示时长（毫秒），默认3000
 */
function showAlert(type, message, options = {}) {
    const { position = 'top-right', duration = 3000 } = options;
    const container = document.getElementById('alertContainer');
    
    // 设置容器位置
    const positionClasses = {
        'top-right': 'top-4 right-4',
        'top-left': 'top-4 left-4',
        'bottom-right': 'bottom-4 right-4',
        'bottom-left': 'bottom-4 left-4',
        'top-center': 'top-4 left-1/2 -translate-x-1/2',
        'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
        'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
        'top': 'top-4 left-1/2 -translate-x-1/2'
    };
    container.className = `fixed z-50 space-y-3 w-80 ${positionClasses[position] || positionClasses['top-right']}`;
    
    const alertType = alertTypes[type] || alertTypes.info;
    
    // 限制最多显示3个提示
    const alerts = container.children;
    if (alerts.length >= 3) {
        closeAlert(alerts[0]);
    }
    
    // 创建Alert元素
    const alertElement = document.createElement('div');
    alertElement.className = `alert-enter flex items-center p-3 rounded-md shadow-sm ${alertType.bgColor} ${alertType.textColor} ${alertType.borderColor}`;
    
    // 设置Alert内容
    alertElement.innerHTML = `
        <div class="flex-shrink-0 ${alertType.iconColor}">
            ${alertType.icon}
        </div>
        <div class="ml-2 text-sm font-medium">${message}</div>
        <button class="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1 hover:bg-gray-200 transition-colors duration-150">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
        </button>
    `;

    // 添加关闭按钮事件
    const closeButton = alertElement.querySelector('button');
    closeButton.addEventListener('click', function() {
        closeAlert(alertElement);
    });

    // 添加到容器
    container.appendChild(alertElement);
    
    // 触发进入动画
    requestAnimationFrame(() => {
        alertElement.classList.remove('alert-enter');
        alertElement.classList.add('alert-enter-active');
    });

    // 设置自动关闭
    if (duration > 0) {
        setTimeout(() => closeAlert(alertElement), duration);
    }
    
    // 返回Alert元素，方便外部控制
    return alertElement;
}

/**
 * 关闭Alert提示
 * @param {HTMLElement} element - 要关闭的Alert元素
 */
function closeAlert(element) {
    // 如果元素不存在或已经在关闭中，则返回
    if (!element || element.classList.contains('alert-exit')) return;
    
    // 添加退出动画类
    element.classList.add('alert-exit', 'alert-exit-active');
    
    // 动画结束后移除元素
    setTimeout(() => {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }, 200);
}

/**
 * 显示模态框
 * @param {Object} options - 模态框配置选项
 * @param {string} options.title - 模态框标题
 * @param {string} options.content - 模态框内容
 * @param {Array} options.buttons - 按钮配置数组，每个按钮包含text(文本)、type(类型)和callback(回调函数)
 * @param {string} options.type - 模态框类型: 'success', 'warning', 'error', 'info'，默认为'info'
 * @returns {Object} - 返回模态框对象，包含close方法
 */
function showModal(options) {
    // 默认配置
    const defaults = {
        title: '提示',
        content: '',
        buttons: [
            { text: '确定', type: 'primary', callback: null }
        ],
        type: 'info'
    };
    
    // 合并配置
    const config = { ...defaults, ...options };
    const alertType = alertTypes[config.type] || alertTypes.info;
    
    // 创建模态框容器
    const modalContainer = document.getElementById('modalContainer');
    if (!modalContainer) return null;
    
    // 清空之前的模态框
    modalContainer.innerHTML = '';
    
    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
    
    // 创建模态框
    const modal = document.createElement('div');
    modal.className = `modal-container bg-[#fdfcf8] rounded-md shadow-sm max-w-md mx-auto overflow-hidden`;
    
    // 创建模态框头部
    const header = document.createElement('div');
    header.className = 'flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50';
    header.innerHTML = `
        <div class="flex items-center">
            <div class="flex-shrink-0 text-gray-500">
                ${alertType.icon}
            </div>
            <h3 class="ml-2 text-base font-medium text-gray-900">${config.title}</h3>
        </div>
        <button class="rounded-lg p-1 hover:bg-gray-200 transition-colors duration-150">
            <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
        </button>
    `;
    
    // 创建模态框内容
    const content = document.createElement('div');
    content.className = 'p-4 text-gray-700';
    content.innerHTML = config.content;
    
    // 创建模态框底部
    const footer = document.createElement('div');
    footer.className = 'flex justify-end p-3 space-x-2';
    
    // 添加按钮
    config.buttons.forEach(button => {
        const btnElement = document.createElement('button');
        let btnClass = 'px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 ';
        
        // 简化按钮类型样式，只区分成功和错误
        switch (button.type) {
            case 'success':
            case 'primary':
                btnClass += `bg-blue-600 text-white hover:bg-blue-700`;
                break;
            case 'danger':
            case 'warning':
                btnClass += `bg-red-500 text-white hover:bg-red-600`;
                break;
            default:
                btnClass += `bg-gray-400 text-white hover:bg-gray-500`;
                break;
        }
        
        btnElement.className = btnClass;
        btnElement.textContent = button.text;
        btnElement.addEventListener('click', () => {
            if (typeof button.callback === 'function') {
                button.callback();
            }
            closeModal();
        });
        
        footer.appendChild(btnElement);
    });
    
    // 组装模态框
    modal.appendChild(header);
    modal.appendChild(content);
    modal.appendChild(footer);
    overlay.appendChild(modal);
    modalContainer.appendChild(overlay);
    
    // 关闭按钮事件
    const closeButton = header.querySelector('button');
    closeButton.addEventListener('click', closeModal);
    
    // 点击遮罩层关闭模态框
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal();
        }
    });
    
    // 显示模态框动画
    requestAnimationFrame(() => {
        overlay.classList.add('modal-overlay-active');
        modal.classList.add('modal-container-active');
    });
    
    // 关闭模态框函数
    function closeModal() {
        overlay.classList.remove('modal-overlay-active');
        modal.classList.remove('modal-container-active');
        
        // 动画结束后移除元素
        setTimeout(() => {
            if (modalContainer.contains(overlay)) {
                modalContainer.removeChild(overlay);
            }
        }, 200);
    }
    
    // 返回模态框对象
    return {
        close: closeModal
    };
}

/**
 * msg提示组件 - 简单轻量的消息提示
 * @param {string} message - 提示信息
 * @param {object} options - 配置选项
 * @param {boolean} options.showIcon - 是否显示图标，默认为 false
 * @param {number} options.duration - 显示时长（毫秒），默认2000
 */
function showMsg(message, options = {}) {
    const { showIcon = false, duration = 2000 } = options;
    const container = document.getElementById('alertContainer');
    container.className = 'fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
    
    // 创建提示元素
    const alert = document.createElement('div');
    alert.className = `flex items-center justify-center space-x-2 px-4 py-2 rounded bg-black/75 text-white min-w-[120px] alert-enter`;
    
    // 添加图标（如果启用）
    if (showIcon) {
        const iconWrapper = document.createElement('div');
        iconWrapper.className = 'text-white';
        iconWrapper.innerHTML = alertTypes.info.icon;
        alert.appendChild(iconWrapper);
    }
    
    // 添加文本
    const text = document.createElement('div');
    text.className = 'text-sm text-center';
    text.textContent = message;
    alert.appendChild(text);
    
    // 添加到容器
    container.appendChild(alert);
    
    // 显示动画
    requestAnimationFrame(() => {
        alert.classList.add('alert-enter-active');
    });
    
    // 自动关闭
    setTimeout(() => {
        alert.classList.remove('alert-enter-active');
        alert.classList.add('alert-exit', 'alert-exit-active');
        
        setTimeout(() => {
            if (container.contains(alert)) {
                container.removeChild(alert);
            }
        }, 200);
    }, duration);
}

/**
 * msg提示组件 - 简单轻量的消息提示
 */
// Msg 提示组件
const msg = {
    /**
     * 显示消息提示
     * @param {string} type - 提示类型：'success' | 'warning' | 'error' | 'text'
     * @param {string} message - 提示信息
     * @param {object} options - 配置选项
     * @param {number} options.duration - 显示时长（毫秒），默认2000
     */
    show(type, message, options = {}) {
        const { duration = 2000 } = options;
        
        // 移除已存在的消息提示
        const existingMsg = document.querySelector('.msg-container');
        if (existingMsg) {
            existingMsg.remove();
        }
        
        // 创建消息提示元素
        const msgElement = document.createElement('div');
        msgElement.className = 'fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center px-4 py-2 rounded-lg shadow-lg bg-gray-800 text-white msg-container opacity-0 transform scale-95 transition-all duration-300';
        
        // 设置图标
        const icons = {
            success: `<svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`,
            warning: `<svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`,
            error: `<svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`
        };
        
        let iconHtml = '';
        if (type !== 'text' && icons[type]) {
            iconHtml = `<div class="flex-shrink-0">${icons[type]}</div>`;
        }
        
        msgElement.innerHTML = `
            ${iconHtml}
            <div class="${iconHtml ? 'ml-3' : ''} text-sm font-medium">${message}</div>
        `;
        
        // 添加到页面
        document.body.appendChild(msgElement);
        
        // 触发显示动画
        requestAnimationFrame(() => {
            msgElement.classList.remove('opacity-0', 'scale-95');
        });
        
        // 设置自动关闭
        setTimeout(() => {
            msgElement.classList.add('opacity-0', 'scale-95');
            setTimeout(() => msgElement.remove(), 300);
        }, duration);
    },
    
    // 成功提示
    success(message, options = {}) {
        this.show('success', message, options);
    },
    
    // 警告提示
    warning(message, options = {}) {
        this.show('warning', message, options);
    },
    
    // 错误提示
    error(message, options = {}) {
        this.show('error', message, options);
    },

    // 纯文本提示
    text(message, options = {}) {
        this.show('text', message, options);
    }
};

// 导出 msg 对象
window.msg = msg;
/**
 * tips提示组件 - 简洁的气泡提示
 * @param {string} message - 提示信息
 * @param {object} options - 配置选项
 * @param {string} options.placement - 提示位置：'top' | 'bottom' | 'left' | 'right'，默认 'top'
 * @param {string} options.arrow - 箭头位置：'start' | 'center' | 'end'，默认 'center'
 * @param {boolean} options.dark - 是否使用深色主题，默认 false
 */
function showTips(message, options = {}) {
    const { placement = 'top', arrow = 'center', dark = false } = options;
    const container = document.getElementById('alertContainer');
    
    // 创建提示元素
    const tip = document.createElement('div');
    tip.className = `fixed z-50 px-2 py-1 rounded text-sm ${dark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow-lg alert-enter`;
    tip.textContent = message;
    
    // 添加箭头
    const arrowDiv = document.createElement('div');
    arrowDiv.className = `absolute w-2 h-2 rotate-45 ${dark ? 'bg-gray-800' : 'bg-white'}`;
    
    // 设置位置和箭头样式
    const positions = {
        top: {
            container: 'bottom-full mb-2',
            arrow: {
                base: 'bottom-[-4px]',
                start: 'left-4',
                center: 'left-1/2 -translate-x-1/2',
                end: 'right-4'
            }
        },
        bottom: {
            container: 'top-full mt-2',
            arrow: {
                base: 'top-[-4px]',
                start: 'left-4',
                center: 'left-1/2 -translate-x-1/2',
                end: 'right-4'
            }
        },
        left: {
            container: 'right-full mr-2',
            arrow: {
                base: 'right-[-4px]',
                start: 'top-4',
                center: 'top-1/2 -translate-y-1/2',
                end: 'bottom-4'
            }
        },
        right: {
            container: 'left-full ml-2',
            arrow: {
                base: 'left-[-4px]',
                start: 'top-4',
                center: 'top-1/2 -translate-y-1/2',
                end: 'bottom-4'
            }
        }
    };
    
    tip.classList.add(positions[placement].container);
    arrowDiv.classList.add(
        positions[placement].arrow.base,
        positions[placement].arrow[arrow]
    );
    
    tip.appendChild(arrowDiv);
    container.appendChild(tip);
    
    // 显示动画
    requestAnimationFrame(() => {
        tip.classList.add('alert-enter-active');
    });
    
    return tip;
}

/**
 * tips提示组件 - 简洁的气泡提示
 */
// Tips 提示组件
const tips = {
    init() {
        // 获取所有带有 data-tips 属性的元素
        const tipElements = document.querySelectorAll('[data-tips]');
        
        // 为每个元素添加事件监听
        tipElements.forEach(element => {
            const trigger = element.dataset.tipsTrigger || 'hover';
            
            if (trigger === 'hover') {
                element.addEventListener('mouseenter', (e) => {
                    showTipsHandler(e.target);
                });
            } else if (trigger === 'click') {
                element.addEventListener('click', (e) => {
                    showTipsHandler(e.target);
                    e.stopPropagation(); // 阻止事件冒泡
                });
                
                // 点击其他地方关闭提示
                document.addEventListener('click', () => {
                    const tip = document.querySelector('.tips-container');
                    if (tip) {
                        tip.remove();
                    }
                });
            }
        });
    }
};

// 显示提示的处理函数
function showTipsHandler(element) {
    const message = element.dataset.tips;
    const placement = element.dataset.tipsPlacement || 'top';
    const arrow = element.dataset.tipsArrow || 'center';
    const isDark = element.dataset.tipsDark === 'true';

    showTips(message, placement, arrow, isDark, element);
}

// 显示 Tips 提示
function showTips(message, placement = 'top', arrow = 'center', isDark = false, trigger) {
    // 移除已存在的提示框
    const existingTip = document.querySelector('.tips-container');
    if (existingTip) {
        existingTip.remove();
    }

    // 创建提示元素
    const tip = document.createElement('div');
    tip.className = `fixed z-50 px-3 py-2 text-sm rounded-lg transition-opacity duration-300 opacity-0 tips-container ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-700 border border-gray-200 shadow-sm'}`;
    tip.textContent = message;

    // 创建箭头元素
    const arrowElement = document.createElement('div');
    arrowElement.className = `absolute w-3 h-3 transform rotate-45 ${isDark ? 'bg-gray-800' : 'bg-white border border-gray-200'}`;

    // 将箭头添加到提示框中
    tip.appendChild(arrowElement);

    // 将提示框添加到 body
    document.body.appendChild(tip);

    // 获取触发元素的位置信息
    const triggerRect = trigger.getBoundingClientRect();
    const tipRect = tip.getBoundingClientRect();

    // 计算提示框位置
    let top, left;
    switch (placement) {
        case 'top':
            top = triggerRect.top - tipRect.height - 8;
            left = triggerRect.left + (triggerRect.width - tipRect.width) / 2;
            arrowElement.className = `absolute w-3 h-3 transform rotate-45 ${isDark ? 'bg-gray-800' : 'bg-white border border-gray-200'} -bottom-1.5 border-t-0 border-l-0`;
            switch (arrow) {
                case 'start':
                    left = triggerRect.left + 16;
                    arrowElement.style.left = '16px';
                    break;
                case 'center':
                    arrowElement.style.left = '50%';
                    arrowElement.style.transform = 'translateX(-50%) rotate(45deg)';
                    break;
                case 'end':
                    left = triggerRect.right - tipRect.width - 16;
                    arrowElement.style.right = '16px';
                    break;
            }
            break;
        case 'bottom':
            top = triggerRect.bottom + 8;
            left = triggerRect.left + (triggerRect.width - tipRect.width) / 2;
            arrowElement.className = `absolute w-3 h-3 transform rotate-45 ${isDark ? 'bg-gray-800' : 'bg-white border border-gray-200'} -top-1.5 border-b-0 border-r-0`;
            switch (arrow) {
                case 'start':
                    left = triggerRect.left + 16;
                    arrowElement.style.left = '16px';
                    break;
                case 'center':
                    arrowElement.style.left = '50%';
                    arrowElement.style.transform = 'translateX(-50%) rotate(45deg)';
                    break;
                case 'end':
                    left = triggerRect.right - tipRect.width - 16;
                    arrowElement.style.right = '16px';
                    break;
            }
            break;
        case 'left':
            top = triggerRect.top + (triggerRect.height - tipRect.height) / 2;
            left = triggerRect.left - tipRect.width - 8;
            arrowElement.className = `absolute w-3 h-3 transform rotate-45 ${isDark ? 'bg-gray-800' : 'bg-white border border-gray-200'} -right-1.5 border-l-0 border-b-0`;
            switch (arrow) {
                case 'start':
                    top = triggerRect.top + 16;
                    arrowElement.style.top = '16px';
                    break;
                case 'center':
                    arrowElement.style.top = '50%';
                    arrowElement.style.transform = 'translateY(-50%) rotate(45deg)';
                    break;
                case 'end':
                    top = triggerRect.bottom - tipRect.height - 16;
                    arrowElement.style.bottom = '16px';
                    break;
            }
            break;
        case 'right':
            top = triggerRect.top + (triggerRect.height - tipRect.height) / 2;
            left = triggerRect.right + 8;
            arrowElement.className = `absolute w-3 h-3 transform rotate-45 ${isDark ? 'bg-gray-800' : 'bg-white border border-gray-200'} -left-1.5 border-t-0 border-r-0`;
            switch (arrow) {
                case 'start':
                    top = triggerRect.top + 16;
                    arrowElement.style.top = '16px';
                    break;
                case 'center':
                    arrowElement.style.top = '50%';
                    arrowElement.style.transform = 'translateY(-50%) rotate(45deg)';
                    break;
                case 'end':
                    top = triggerRect.bottom - tipRect.height - 16;
                    arrowElement.style.bottom = '16px';
                    break;
            }
            break;
    }

    // 设置提示框位置
    tip.style.top = `${top}px`;
    tip.style.left = `${left}px`;

    // 显示提示框
    requestAnimationFrame(() => {
        tip.style.opacity = '1';
    });

    // 添加鼠标移出事件
    trigger.addEventListener('mouseleave', () => {
        tip.style.opacity = '0';
        setTimeout(() => tip.remove(), 300);
    }, { once: true });
}

// 初始化 tips
document.addEventListener('DOMContentLoaded', () => {
    tips.init();
});

// 导出 tips 对象
window.tips = tips;