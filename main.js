'use strict';

var obsidian = require('obsidian');

/* *****************************************************************************
Code from https://github.com/obsidian-canzi/Enhanced-editing
***************************************************************************** */

var en = {
    loadThisPlugin: 'loading Enhanced Editing plugin',
    thisPluginName: 'ZH Enhanced Editing V',
    helloWorld: '<b>Welcome to the Enhanced Editing!</b>',
    close: 'Click here to close the window !',
};

var zhCN = {
    loadThisPlugin: '加载增强编辑插件',
    thisPluginName: 'ZH增强编辑 V',
    helloWorld: '<b>欢迎使用增强编辑插件！</b>',
    close: '点击此处 可关闭提示窗口......',
};

const 全局命令图标 = '<svg t="1650192738325" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="70946" width="110" height="110"><path d="M129.9 755.5625c-34.025 0-64.5 28.625-64.5 62.6875 0 34.0625 30.4625 64.5 64.5 64.5 34 0 62.6875-30.4375 62.6875-64.5C192.5875 784.1875 163.9 755.5625 129.9 755.5625zM129.9 447.4c-34.025 0-64.5 28.65-64.5 62.6875s30.4625 62.8125 64.5 62.8125c34 0 62.6875-28.775 62.6875-62.8125S163.9 447.4 129.9 447.4zM359.1875 259.3375 901.875 259.3375c32.25 0 59.125-25.0875 59.125-57.3125 0-32.25-26.875-59.125-59.125-59.125L359.1875 142.9c-32.275 0-59.125 26.875-59.125 59.125C300.0625 234.25 326.9 259.3375 359.1875 259.3375zM129.9 137.525c-34.025 0-64.5 30.4625-64.5 64.5 0 34 30.4625 62.6875 64.5 62.6875 34 0 62.6875-28.6875 62.6875-62.6875C192.5875 168 163.9 137.525 129.9 137.525zM901.875 451 359.1875 451c-32.275 0-59.125 26.8375-59.125 59.0875s26.8375 59.15 59.125 59.15L901.875 569.2375c32.25 0 59.125-26.9 59.125-59.15S934.125 451 901.875 451zM901.875 759.125 359.1875 759.125c-32.275 0-59.125 26.875-59.125 59.125 0 32.25 26.8375 59.125 59.125 59.125L901.875 877.375c32.25 0 59.125-26.875 59.125-59.125C961 786 934.125 759.125 901.875 759.125z" fill="#1290f8" p-id="70947"></path></svg>';


const localeMap = {
    en,
    'zh-cn': zhCN,
};
const locale = localeMap[obsidian.moment.locale()];
function t(_str) {
    return (locale && locale[_str]) || en[_str];
};

//t('字段名称')
//以上为 多语言字段名-调用语法

const DEFAULT_SETTINGS = {
    isTab: false,
    isBT: false,
    isShowNum: false,

    maxScroll: 50,
    version: "0.4.5",
    hColor: "",
    bColor: "",
    hColor1: "#F36208",
    hColor2: "#81B300",
    hColor3: "#2485E3",
    hColor4: "#C32E94",
    hColor5: "#13C6C3",

    bColor1: "#FFB78B",
    bColor2: "#CDF469",
    bColor3: "#A0CCF6",
    bColor4: "#F0A7D8",
    bColor5: "#ADEFEF"
};

var 当前版本 = '0.5.5';
var 功能更新 = t('FunctionUpdate');
var newNotice = new obsidian.Notice("欢迎使用 Obsidian！", 1);
var 编辑模式;
var 聚焦编辑 = true;
var 所选文本 = "";
var 笔记全文;
var 当前行文本 = "";
var 当前光标;
var 当前行号;
var 选至行首 = "";
var 选至行尾 = "";


class MyPlugin extends obsidian.Plugin {
    constructor() {
        super(...arguments);
    };

    onload() {
        console.log(t('loadThisPlugin'));
        this.loadSettings();
        this.footnoteStatusBar = this.addStatusBarItem();
        this.footnoteStatusBar.setText("");

        this.addCommand({
            id: 'biaoti0-text',
            name: '取消标题',
            callback: () => this.标题语法(""),
            hotkeys: [{ modifiers: ["Mod"], key: "`" }]
        });
        this.addCommand({
            id: 'biaoti1-text',
            name: 'H1标题',
            callback: () => this.标题语法("#"),
            hotkeys: [{ modifiers: ["Mod"], key: "1" }]
        });
        this.addCommand({
            id: 'biaoti2-text',
            name: 'H2标题',
            callback: () => this.标题语法("##"),
            hotkeys: [{ modifiers: ["Mod"], key: "2" }]
        });
        this.addCommand({
            id: 'biaoti3-text',
            name: 'H3标题',
            callback: () => this.标题语法("###"),
            hotkeys: [{ modifiers: ["Mod"], key: "3" }]
        });
        this.addCommand({
            id: 'biaoti4-text',
            name: 'H4标题',
            callback: () => this.标题语法("####"),
            hotkeys: [{ modifiers: ["Mod"], key: "4" }]
        });
        this.addCommand({
            id: 'biaoti5-text',
            name: 'H5标题',
            callback: () => this.标题语法("#####"),
            hotkeys: [{ modifiers: ["Mod"], key: "5" }]
        });
        this.addCommand({
            id: 'biaoti6-text',
            name: 'H6标题',
            callback: () => this.标题语法("######"),
            hotkeys: [{ modifiers: ["Mod"], key: "6" }]
        });
        this.addCommand({
            id: 'zeng-btexts',
            name: '提升标题级别',
            callback: () => this.调节标题级别(true),
            hotkeys: [{ modifiers: ["Mod"], key: "=" }]
        });
        this.addCommand({
            id: 'jian-btexts',
            name: '降低标题级别',
            callback: () => this.调节标题级别(false),
            hotkeys: [{ modifiers: ["Mod"], key: "-" }]

        });
        /**/


        this.addSettingTab(new editSettingsTab(this.app, this));
        this.app.workspace.onLayoutReady(() => {
            setTimeout(() => {
                this.实用命令菜单();
            });
        });


        document.addEventListener('mouseup', (e) => {
            this.获取编辑器信息();
            if (聚焦编辑) {
                历史行文本 = 当前行文本;
                if (所选文本 == null) {
                    return
                }
            }
        });


        document.addEventListener('keydown', (e) => {
            this.获取编辑器信息();
            if (聚焦编辑) {
                if (e.key == "Control") {
                    isCtrl = true;
                }
            };
        });

        document.addEventListener('keyup', (e) => {
            this.获取编辑器信息();
            if (聚焦编辑) {
                if (e.key == "Control") {
                    isCtrl = false;
                }
            };
        });
    }

    实用命令菜单() {
        this.statusBarIcon = this.addStatusBarItem();
        this.statusBarIcon.addClass("Enhanced-statusbar-button");
        obsidian.addIcon("md语法图标", 全局命令图标);
        obsidian.setIcon(this.statusBarIcon, "md语法图标");
        this.registerDomEvent(this.statusBarIcon, "click", (e) => {
            const activePane = this.app.workspace.activeLeaf;
            let 当前模式 = activePane.getViewState();
            if (当前模式.type === "empty") {
                return;
            }
            if (当前模式.state.mode == "preview") {
                this.app.commands.executeCommandById("markdown:toggle-preview");
            };

            const statusBarRect2 = this.statusBarIcon.parentElement.getBoundingClientRect();
            const statusBarIconRect2 = this.statusBarIcon.getBoundingClientRect();
            const menu = new obsidian.Menu(this.app);

            menu.addItem((item) => {
                item.setTitle("设置插件");
                item.setIcon("gear");
                item.onClick(() => {
                    this.app.setting.open();
                    this.app.setting.openTabById("Enhanced-editing");
                });
            });
            menu.addItem((item) => {
                item.setTitle("打开插件文件夹");
                item.setIcon("gear");
                item.onClick(() => {
                    this.app.openWithDefaultApp(this.app.vault.configDir + "/plugins");
                    console.log(this.app.vault.configDir + "/plugins");
                });
            });
            menu.addItem((item) => {
                item.setTitle("设置快捷键");
                item.setIcon("gear");
                item.onClick(() => {
                    this.app.setting.open();
                    var e = this.app.setting.openTabById("hotkeys");
                    e.setQuery("增强编辑");
                });
            });

            menu.showAtPosition({
                x: statusBarIconRect2.right + 5,
                y: statusBarRect2.top - 10,
            });
        });
    }


    onunload() {
        console.log('卸载插件');
    }

    async loadSettings() {
        console.log('加载配置');
        console.log(this.app.customCss.themes);
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());

    }
    async saveSettings() {
        await this.saveData(this.settings);
    }

    /** 以下为基础功能函数 */

    获取所选文本() {
        var cmEditor = this.获取编辑模式();
        if (!cmEditor) return;
        if (cmEditor.getSelection() == "") {
            return cmEditor.getValue();
        } else {
            return cmEditor.getSelection();
        }
    };


    获取编辑模式() {
        let view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        if (!view) { return; };
        let cmEditor = view.editor;
        return cmEditor;
    };

    获取编辑器信息() {
        //初始信息获取，最基本函数
        编辑模式 = this.获取编辑模式();
        if (编辑模式 == null) { return; };
        聚焦编辑 = 编辑模式.hasFocus();
        笔记全文 = 编辑模式.getDoc();
        所选文本 = this.获取所选文本();
        当前光标 = 编辑模式.getCursor();
        当前行号 = 当前光标.line;
        当前行文本 = 编辑模式.getLine(当前行号);
        选至行首 = 编辑模式.getRange({ line: 当前行号, ch: 0 }, 当前光标);
        if (当前行文本 != "") {
            选至行尾 = 编辑模式.getRange(当前光标, { line: 当前行号, ch: 当前行文本.length });
        } else {
            选至行尾 = 编辑模式.getRange(当前光标, { line: 当前行号, ch: 0 });
        };

    };

    转换行内代码() {
        this.获取编辑器信息();
        if (所选文本 == null) {
            笔记全文.replaceRange("``", 当前光标, 当前光标);
            编辑模式.exec("goRight");
        } else {
            var link = /`[^`]*`/;	//是否包含代码行符号
            var link1 = /^[^`]*`[^`]*$/;	//是否只包含一侧的`

            if (link1.test(所选文本)) {
                //new obsidian.Notice("只有一侧出现`符号");
                return;
            } else if (link.test(所选文本)) {
                //new obsidian.Notice("成对出现`符号");
                所选文本 = 所选文本.replace(/`/g, "");
                this.替换所选文本(所选文本);
            } else {
                //new obsidian.Notice("需要补充`符号");
                所选文本 = 所选文本.replace(/^(.*)$/mg, "`$1`");
                this.替换所选文本(所选文本);
                编辑模式.exec("goRight");
            }
        };
    };

    转换代码块() {
        this.获取编辑器信息();
        if (所选文本 == null) {
            笔记全文.replaceRange("```\n\n```", 当前光标, 当前光标);
            编辑模式.exec("goDown");
        } else {
            var link = /```[^`]+```/;	//是否包含代码行符号
            var link1 = /^[^`]*```[^`]*$/m;	//是否只包含一侧的`
            所选文本 = 所选文本.replace(/\n/g, "↫");
            if (link1.test(所选文本)) {
                //new obsidian.Notice("只有一侧出现```符号");
                return;
            } else if (link.test(所选文本)) {
                //new obsidian.Notice("成对出现```符号");
                所选文本 = 所选文本.replace(/↫*```↫?|↫?```↫*/g, "");
                所选文本 = 所选文本.replace(/↫/g, "\n");
                this.替换所选文本(所选文本);
            } else {
                //new obsidian.Notice("需要补充```符号");
                所选文本 = 所选文本.replace(/^(.*)$/m, "↫```↫$1↫```↫");
                所选文本 = 所选文本.replace(/↫/g, "\n");
                this.替换所选文本(所选文本);
                编辑模式.exec("goLeft");
                编辑模式.exec("goUp");
            }
        };
    };


    标题语法(_str) {
        let link = eval("/^" + _str + " ([^#]+)/");	//是否包含几个#符号
        this.获取编辑器信息();
        let 新文本 = "";

        if (_str == "") {   //若为标题，转为普通文本
            新文本 = 当前行文本.replace(/^(\>*(\[[!\w]+\])?\s*)#+\s/, "$1");
        } else {  //列表、引用，先转为普通文本，再转为标题
            新文本 = 当前行文本.replace(/^\s*(#*|\>|\-|\d+\.)\s*/m, "");
            console.log(新文本);
            新文本 = _str + " " + 新文本;
        }
        //笔记全文.replaceRange(新文本, {line:当前行号,ch:0}, {line:当前行号,ch:当前行文本.length});
        编辑模式.setLine(当前行号, 新文本);
        编辑模式.setCursor({ line: 当前行号, ch: Number(新文本.length - 选至行尾.length) });
    };

    调节标题级别(增加) {
        this.获取编辑器信息();
        let 新文本 = "";
        let 位置 = 选至行首.length;
        if (增加) {
            if (/^##+\s/.test(当前行文本)) {
                新文本 = 当前行文本.replace(/(^\s*)##/, "$1#");
                位置--
            } else {
                return;
            }
        } else {
            if (/^#{1,5}\s/.test(当前行文本)) {
                新文本 = 当前行文本.replace(/(^[‌‌‌‌‌‌　]*)#/, "$1##");
                位置++
            } else {
                return;
            }
        }

        编辑模式.setLine(当前行号, 新文本);
        编辑模式.setCursor({ line: 当前行号, ch: 位置 });
    };



    折叠同级标题() {
        this.获取编辑器信息();
        if (!笔记全文) return;
        if (/^#+\s/.test(当前行文本)) {
            this.app.commands.executeCommandById('editor:unfold-all');
            let _str = 当前行文本.replace(/^(#+)\s.*$/, "$1");   //获取前面的多个#号
            //new obsidian.Notice("当前为标题行 "+_str);
            var 末行行号 = 编辑模式.lastLine();

            var arr = 编辑模式.getRange({ line: 0, ch: 0 }, { line: 末行行号, ch: 0 }).split("\n");
            //console.log(arr);
            for (var i = arr.length; i >= 0; i--) {
                if (eval("/^" + _str + "(?=[^#])/").test(arr[i])) {
                    编辑模式.setCursor({ line: i, ch: 0 });
                    this.app.commands.executeCommandById('editor:toggle-fold');
                }
            }
        }
    };

    生成时间戳() {
        var date = new Date();
        return date.getFullYear().toString() + this.pad2(date.getMonth() + 1) + this.pad2(date.getDate()); // + this.pad2(date.getHours()) + this.pad2(date.getMinutes()) + this.pad2(date.getSeconds()
    };
    pad2(n) {
        return n < 10 ? '0' + n : n
    };
}


class editSettingsTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display() {
        var plugin = this.plugin;
        var containerEl = this.containerEl;
        containerEl.empty();
        containerEl.createEl('h2', { text: "ZH 增强编辑 V" + 当前版本 });

        new obsidian.Setting(containerEl)
            .setName("📣 是否启用Blut topaz 主题高亮配色支持")
            .setDesc("启用此项后，可以使用Blut topaz主题自带的涂黑、填空等效果。")
            .addToggle(toggle => toggle.setValue(this.plugin.settings?.isBT)
                .onChange((value) => {
                    this.plugin.settings.isBT = value;
                    this.plugin.saveSettings();
                }));

        new obsidian.Setting(containerEl)
            .setName('自定义名称')
            .setDesc('自定义描述')

    };
};

module.exports = MyPlugin;
