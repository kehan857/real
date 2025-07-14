// 营销管理系统弹窗自动截图脚本
// 使用方法：在浏览器控制台中运行此脚本

class ModalScreenshotHelper {
    constructor() {
        this.modals = [
            { id: 'reportPreviewModal', name: '报告预览弹窗', trigger: 'showReportPreview' },
            { id: 'approvalFlowModal', name: '审批流程弹窗', trigger: 'showApprovalFlow' },
            { id: 'report-detail-modal', name: '售后报告详情弹窗', trigger: 'showReportDetail' },
            { id: 'contract-detail-modal', name: '合同详情弹窗', trigger: 'showContractDetail' },
            { id: 'sales-detail-modal', name: '销售订单详情弹窗', trigger: 'showSalesDetail' },
            { id: 'bid-detail-modal', name: '框架协议详情弹窗', trigger: 'showBidDetail' },
            { id: 'bid-form-modal', name: '新增框架协议弹窗', trigger: 'showBidForm' },
            { id: 'contract-form-modal', name: '新增合同弹窗', trigger: 'showContractForm' },
            { id: 'contract-upload-modal', name: '上传合同文件弹窗', trigger: 'showContractUpload' },
            { id: 'sales-order-detail-modal', name: '销售订单详情弹窗', trigger: 'showSalesOrderDetail' },
            { id: 'tech-contact-modal', name: '技术联系人弹窗', trigger: 'showTechContact' }
        ];
        
        this.currentIndex = 0;
        this.screenshots = [];
        this.isRunning = false;
    }

    // 显示指定弹窗
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            modal.style.zIndex = '10000';
            
            // 滚动到弹窗位置
            modal.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // 确保弹窗完全可见
            setTimeout(() => {
                const modalContent = modal.querySelector('.modal-content');
                if (modalContent) {
                    modalContent.scrollTop = 0;
                }
            }, 500);
            
            return true;
        }
        return false;
    }

    // 隐藏指定弹窗
    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // 隐藏所有弹窗
    hideAllModals() {
        this.modals.forEach(modal => {
            this.hideModal(modal.id);
        });
    }

    // 自动截图流程
    async startAutoScreenshot() {
        if (this.isRunning) {
            console.log('截图流程已在运行中...');
            return;
        }

        this.isRunning = true;
        this.currentIndex = 0;
        this.screenshots = [];

        console.log('🚀 开始自动截图流程...');
        console.log('📋 将按顺序显示所有弹窗，请准备截图工具');

        // 先隐藏所有弹窗
        this.hideAllModals();

        // 创建截图指南
        this.createScreenshotGuide();

        // 开始逐个显示弹窗
        await this.processNextModal();
    }

    // 处理下一个弹窗
    async processNextModal() {
        if (this.currentIndex >= this.modals.length) {
            this.completeScreenshot();
            return;
        }

        const modal = this.modals[this.currentIndex];
        console.log(`📸 [${this.currentIndex + 1}/${this.modals.length}] 正在显示: ${modal.name}`);

        // 显示弹窗
        if (this.showModal(modal.id)) {
            // 显示截图提示
            this.showScreenshotPrompt(modal);
        } else {
            console.warn(`⚠️ 无法找到弹窗: ${modal.id}`);
            this.currentIndex++;
            setTimeout(() => this.processNextModal(), 1000);
        }
    }

    // 显示截图提示
    showScreenshotPrompt(modal) {
        const promptDiv = document.createElement('div');
        promptDiv.id = 'screenshot-prompt';
        promptDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #2c3e50;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 99999;
            font-family: 'Microsoft YaHei', Arial, sans-serif;
            font-size: 14px;
            text-align: center;
            min-width: 350px;
        `;

        promptDiv.innerHTML = `
            <div style="margin-bottom: 10px;">
                <strong>📸 [${this.currentIndex + 1}/${this.modals.length}] ${modal.name}</strong>
            </div>
            <div style="margin-bottom: 15px; color: #ecf0f1;">
                请截取当前弹窗的完整内容，确保包含所有可见信息
            </div>
            <button onclick="screenshotHelper.nextModal()" style="
                background: #27ae60;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                margin: 0 5px;
                font-size: 12px;
            ">✅ 已截图，继续</button>
            <button onclick="screenshotHelper.skipModal()" style="
                background: #f39c12;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                margin: 0 5px;
                font-size: 12px;
            ">⏭️ 跳过</button>
            <button onclick="screenshotHelper.stopScreenshot()" style="
                background: #e74c3c;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                margin: 0 5px;
                font-size: 12px;
            ">🛑 停止</button>
        `;

        document.body.appendChild(promptDiv);
    }

    // 移除截图提示
    removeScreenshotPrompt() {
        const prompt = document.getElementById('screenshot-prompt');
        if (prompt) {
            prompt.remove();
        }
    }

    // 继续下一个弹窗
    nextModal() {
        const modal = this.modals[this.currentIndex];
        console.log(`✅ 已完成截图: ${modal.name}`);
        
        this.screenshots.push({
            name: modal.name,
            id: modal.id,
            timestamp: new Date().toISOString()
        });

        this.hideModal(modal.id);
        this.removeScreenshotPrompt();
        this.currentIndex++;
        
        setTimeout(() => this.processNextModal(), 1000);
    }

    // 跳过当前弹窗
    skipModal() {
        const modal = this.modals[this.currentIndex];
        console.log(`⏭️ 已跳过: ${modal.name}`);
        
        this.hideModal(modal.id);
        this.removeScreenshotPrompt();
        this.currentIndex++;
        
        setTimeout(() => this.processNextModal(), 1000);
    }

    // 停止截图流程
    stopScreenshot() {
        console.log('🛑 截图流程已停止');
        this.isRunning = false;
        this.hideAllModals();
        this.removeScreenshotPrompt();
        this.removeScreenshotGuide();
    }

    // 完成截图流程
    completeScreenshot() {
        console.log('🎉 所有弹窗截图已完成！');
        console.log('📊 截图统计:', this.screenshots);
        
        this.isRunning = false;
        this.hideAllModals();
        this.removeScreenshotPrompt();
        this.removeScreenshotGuide();
        
        // 显示完成提示
        this.showCompletionMessage();
    }

    // 创建截图指南
    createScreenshotGuide() {
        const guideDiv = document.createElement('div');
        guideDiv.id = 'screenshot-guide';
        guideDiv.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: #34495e;
            color: white;
            padding: 15px;
            border-radius: 6px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 99998;
            font-family: 'Microsoft YaHei', Arial, sans-serif;
            font-size: 12px;
            max-width: 300px;
        `;

        guideDiv.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 10px;">📖 截图指南</div>
            <div style="line-height: 1.4;">
                • 使用 Ctrl+Shift+S (Windows) 或 Cmd+Shift+4 (Mac)<br>
                • 或使用浏览器扩展截图工具<br>
                • 确保截取完整弹窗内容<br>
                • 建议保存为PNG格式<br>
                • 文件名：弹窗名称.png
            </div>
        `;

        document.body.appendChild(guideDiv);
    }

    // 移除截图指南
    removeScreenshotGuide() {
        const guide = document.getElementById('screenshot-guide');
        if (guide) {
            guide.remove();
        }
    }

    // 显示完成消息
    showCompletionMessage() {
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #27ae60;
            color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 99999;
            font-family: 'Microsoft YaHei', Arial, sans-serif;
            text-align: center;
            min-width: 400px;
        `;

        messageDiv.innerHTML = `
            <div style="font-size: 24px; margin-bottom: 15px;">🎉</div>
            <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">
                截图流程完成！
            </div>
            <div style="margin-bottom: 15px;">
                已完成 ${this.screenshots.length} 个弹窗的截图
            </div>
            <button onclick="this.parentElement.remove()" style="
                background: #2c3e50;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
            ">确定</button>
        `;

        document.body.appendChild(messageDiv);

        // 5秒后自动关闭
        setTimeout(() => {
            if (messageDiv.parentElement) {
                messageDiv.remove();
            }
        }, 5000);
    }

    // 显示单个弹窗（手动模式）
    showSingleModal(modalId) {
        this.hideAllModals();
        const modal = this.modals.find(m => m.id === modalId);
        if (modal) {
            this.showModal(modalId);
            console.log(`📸 已显示弹窗: ${modal.name}`);
        } else {
            console.error(`❌ 未找到弹窗: ${modalId}`);
        }
    }

    // 获取所有弹窗列表
    getModalList() {
        return this.modals.map((modal, index) => ({
            index: index + 1,
            id: modal.id,
            name: modal.name
        }));
    }
}

// 创建全局实例
const screenshotHelper = new ModalScreenshotHelper();

// 提供便捷方法
window.screenshotHelper = screenshotHelper;

// 控制台使用说明
console.log(`
🎯 营销管理系统弹窗截图助手已加载

📋 使用方法：
1. 自动截图所有弹窗：screenshotHelper.startAutoScreenshot()
2. 显示单个弹窗：screenshotHelper.showSingleModal('弹窗ID')
3. 隐藏所有弹窗：screenshotHelper.hideAllModals()
4. 查看弹窗列表：screenshotHelper.getModalList()

🚀 快速开始：执行 screenshotHelper.startAutoScreenshot()
`);

// 弹窗列表
console.table(screenshotHelper.getModalList()); 