# Alert 组件库使用说明

一个基于 Tailwind CSS 的轻量级弹出层组件库，包含 Alert、Modal、Msg 和 Tips 四种组件。
https://wang3532429.github.io/tailwindAlert/

## 安装和引入

1. 首先确保已引入 Tailwind CSS：
```html
<script src="https://cdn.tailwindcss.com"></script>
```

2. 引入组件库文件（二选一）：
```html
<!-- 完整版 -->
<script src="alert.js"></script>

<!-- 压缩版 -->
<script src="alert.min.js"></script>
```

## Alert 提示组件

用于显示重要的提示信息，支持多种类型和位置。

### 基本用法
```javascript
showAlert('success', '操作成功！');
showAlert('error', '操作失败！', { position: 'top-right' });
```

### 参数说明
```javascript
showAlert(type, message, options)
```

- `type`：提示类型
  - `'success'`：成功提示
  - `'warning'`：警告提示
  - `'error'`：错误提示
  - `'info'`：信息提示

- `message`：提示内容

- `options`：配置选项
  - `position`：提示位置
    - `'top-right'`：右上角（默认）
    - `'top-left'`：左上角
    - `'bottom-right'`：右下角
    - `'bottom-left'`：左下角
    - `'top-center'`：顶部居中
    - `'bottom-center'`：底部居中
    - `'center'`：正中间
    - `'top'`：顶部
  - `duration`：显示时长（毫秒），默认 3000

## Modal 模态框组件

用于显示重要的交互信息，支持自定义按钮和回调函数。

### 基本用法
```javascript
showModal({
  title: '提示',
  content: '确定要删除吗？',
  buttons: [
    { text: '取消', type: 'default' },
    { text: '确定', type: 'primary', callback: () => console.log('确定') }
  ]
});
```

### 参数说明
```javascript
showModal(options)
```

- `options`：配置选项
  - `title`：模态框标题，默认为 '提示'
  - `content`：模态框内容
  - `type`：模态框类型，可选值同 Alert 组件
  - `buttons`：按钮配置数组
    - `text`：按钮文本
    - `type`：按钮类型
      - `'primary'`：主要按钮
      - `'success'`：成功按钮
      - `'warning'`：警告按钮
      - `'danger'`：危险按钮
      - `'default'`：默认按钮
    - `callback`：点击回调函数

## Msg 提示组件

用于显示简短的全局提示信息，位于屏幕正中间。

### 基本用法
```javascript
msg.success('操作成功');
msg.warning('请注意');
msg.error('操作失败');
msg.text('纯文本提示');
```

### 参数说明
```javascript
msg.show(type, message, options)
```

- `type`：提示类型
  - `'success'`：成功提示（绿色对勾）
  - `'warning'`：警告提示（黄色感叹号）
  - `'error'`：错误提示（红色叉号）
  - `'text'`：纯文本提示（无图标）

- `message`：提示内容

- `options`：配置选项
  - `duration`：显示时长（毫秒），默认 2000

## Tips 提示组件

用于显示简洁的气泡提示，支持多个位置和触发方式。

### 基本用法
```html
<!-- hover 触发 -->
<button data-tips="提示内容">Hover 提示</button>

<!-- click 触发 -->
<button data-tips="提示内容" data-tips-trigger="click">Click 提示</button>

<!-- 深色主题 -->
<button data-tips="深色提示" data-tips-dark="true">深色提示</button>

<!-- 自定义位置和箭头 -->
<button 
  data-tips="自定义提示"
  data-tips-placement="right"
  data-tips-arrow="start"
>右侧提示</button>
```

### 参数说明

通过 HTML 属性配置：

- `data-tips`：提示内容

- `data-tips-trigger`：触发方式
  - `'hover'`：鼠标悬停（默认）
  - `'click'`：点击触发

- `data-tips-placement`：提示位置
  - `'top'`：顶部（默认）
  - `'bottom'`：底部
  - `'left'`：左侧
  - `'right'`：右侧

- `data-tips-arrow`：箭头位置
  - `'center'`：居中（默认）
  - `'start'`：开始位置
  - `'end'`：结束位置

- `data-tips-dark`：深色主题
  - `'true'`：启用深色主题
  - `'false'`：浅色主题（默认）

## 注意事项

1. 组件库依赖 Tailwind CSS，使用前请确保已正确引入。
2. Alert 组件最多同时显示 3 个提示。
3. Msg 组件同时只会显示一个提示。
4. Tips 组件会自动初始化，无需手动调用。
5. 所有组件都支持自动关闭，也可以通过点击关闭按钮手动关闭。
