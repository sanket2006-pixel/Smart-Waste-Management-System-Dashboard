// AI Waste Management System JavaScript

class WasteManagementSystem {
    constructor() {
        this.isRunning = false;
        this.currentSpeed = 1.0;
        this.startTime = null;
        this.itemsProcessed = 0;
        this.itemsPerMinute = 0;
        this.accuracy = 96.8;
        this.camera = null;
        this.cameraStream = null;
        
        // Waste categories data
        this.wasteCategories = [
            { name: 'Plastic', color: '#2196F3', icon: '♻️', count: 0, targetDaily: 150 },
            { name: 'Metal', color: '#9E9E9E', icon: '🔧', count: 0, targetDaily: 80 },
            { name: 'Paper', color: '#FF9800', icon: '📄', count: 0, targetDaily: 120 },
            { name: 'Organic', color: '#4CAF50', icon: '🌱', count: 0, targetDaily: 200 },
            { name: 'Hazardous', color: '#F44336', icon: '⚠️', count: 0, targetDaily: 20 }
        ];
        
        // Chart data
        this.throughputHistory = [];
        this.hourlyStats = [12, 18, 25, 31, 28, 35, 42, 38, 44, 39, 33, 29];
        
        // Environmental impact
        this.environmentalData = {
            co2Saved: 0,
            energyUsed: 0,
            recyclingRate: 0,
            wasteProcessed: 0
        };
        
        // Detection config
        this.detectionConfig = {
            confidenceThreshold: 0.8,
            processingSpeed: 1.0,
            cameraEnabled: false,
            autoCalibration: true,
            alertThreshold: 90
        };
        
        // Performance tracking
        this.performanceMetrics = {
            uptime: 0,
            totalProcessed: 0,
            avgAccuracy: 96.8,
            errorRate: 3.2,
            maintenanceHours: 0
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.createWasteBins();
        this.initializeCharts();
        this.startClock();
        this.setupMobileNavigation();
        this.hideLoadingOverlay();
        this.startDataSimulation();
    }
    
    hideLoadingOverlay() {
        setTimeout(() => {
            const overlay = document.getElementById('loadingOverlay');
            overlay.classList.add('hidden');
        }, 2000);
    }
    
    setupEventListeners() {
        // Start/Stop System
        document.getElementById('startStopBtn').addEventListener('click', () => {
            this.toggleSystem();
        });
        
        // Emergency Stop
        document.getElementById('emergencyBtn').addEventListener('click', () => {
            this.emergencyStop();
        });
        
        // Speed Control
        document.getElementById('speedSlider').addEventListener('input', (e) => {
            this.updateSpeed(parseFloat(e.target.value));
        });
        
        // Settings Modal
        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.openSettings();
        });
        
        document.getElementById('closeSettings').addEventListener('click', () => {
            this.closeSettings();
        });
        
        // Camera Controls
        document.getElementById('enableCamera').addEventListener('click', () => {
            this.toggleCamera();
        });
        
        document.getElementById('switchCamera').addEventListener('click', () => {
            this.switchCamera();
        });
        
        // Tab Navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });
        
        // Analytics Controls
        document.getElementById('timeRange').addEventListener('change', (e) => {
            this.updateAnalytics(e.target.value);
        });
        
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportData();
        });
        
        // Control Panel
        document.getElementById('confidenceThreshold').addEventListener('input', (e) => {
            this.updateConfidenceThreshold(parseFloat(e.target.value));
        });
        
        document.getElementById('calibrateBtn').addEventListener('click', () => {
            this.calibrateSystem();
        });
        
        document.getElementById('maintenanceBtn').addEventListener('click', () => {
            this.enterMaintenanceMode();
        });
        
        // Theme Toggle
        document.getElementById('themeToggle').addEventListener('change', (e) => {
            this.toggleTheme(e.target.checked);
        });
        
        // Animations Toggle
        document.getElementById('animationsToggle').addEventListener('change', (e) => {
            this.toggleAnimations(e.target.checked);
        });
    }
    
    toggleSystem() {
        const btn = document.getElementById('startStopBtn');
        const btnText = document.getElementById('btnText');
        const statusIndicator = document.getElementById('systemStatus');
        const statusText = document.getElementById('statusText');
        const beltSurface = document.getElementById('beltSurface');
        
        if (!this.isRunning) {
            // Start System
            this.isRunning = true;
            this.startTime = new Date();
            
            btn.classList.remove('btn--primary');
            btn.classList.add('btn--outline');
            btnText.textContent = 'Stop System';
            
            statusIndicator.classList.add('online');
            statusText.textContent = 'Online';
            
            beltSurface.classList.add('running');
            beltSurface.classList.remove('stopped');
            
            this.startWasteGeneration();
            this.startRoboticArm();
            
            this.showNotification('System Started Successfully', 'success');
        } else {
            // Stop System
            this.isRunning = false;
            
            btn.classList.remove('btn--outline');
            btn.classList.add('btn--primary');
            btnText.textContent = 'Start System';
            
            statusIndicator.classList.remove('online');
            statusText.textContent = 'Offline';
            
            beltSurface.classList.remove('running');
            beltSurface.classList.add('stopped');
            
            this.stopWasteGeneration();
            this.stopRoboticArm();
            
            this.showNotification('System Stopped', 'info');
        }
    }
    
    emergencyStop() {
        if (this.isRunning) {
            this.isRunning = false;
            
            // Reset UI
            const btn = document.getElementById('startStopBtn');
            const btnText = document.getElementById('btnText');
            const statusIndicator = document.getElementById('systemStatus');
            const statusText = document.getElementById('statusText');
            const beltSurface = document.getElementById('beltSurface');
            
            btn.classList.remove('btn--outline');
            btn.classList.add('btn--primary');
            btnText.textContent = 'Start System';
            
            statusIndicator.classList.remove('online');
            statusText.textContent = 'Emergency Stop';
            
            beltSurface.classList.remove('running');
            beltSurface.classList.add('stopped');
            
            this.stopWasteGeneration();
            this.stopRoboticArm();
            
            // Flash emergency colors
            document.body.style.background = '#ff000020';
            setTimeout(() => {
                document.body.style.background = '';
            }, 1000);
            
            this.showNotification('🚨 EMERGENCY STOP ACTIVATED', 'error');
        }
    }
    
    updateSpeed(speed) {
        this.currentSpeed = speed;
        document.getElementById('speed').querySelector('.metric-value').textContent = `${speed.toFixed(1)}x`;
        
        // Update belt animation speed
        const beltPattern = document.querySelector('.belt-pattern');
        if (beltPattern) {
            beltPattern.style.animationDuration = `${3 / speed}s`;
        }
        
        // Update waste item generation rate
        if (this.isRunning) {
            this.adjustWasteGenerationRate(speed);
        }
    }
    
    startWasteGeneration() {
        this.wasteGenerationInterval = setInterval(() => {
            if (this.isRunning) {
                this.generateWasteItem();
            }
        }, Math.max(1000 / this.currentSpeed, 500));
    }
    
    stopWasteGeneration() {
        if (this.wasteGenerationInterval) {
            clearInterval(this.wasteGenerationInterval);
        }
    }
    
    adjustWasteGenerationRate(speed) {
        this.stopWasteGeneration();
        if (this.isRunning) {
            this.startWasteGeneration();
        }
    }
    
    generateWasteItem() {
        const wasteContainer = document.getElementById('wasteItems');
        const categoryIndex = Math.floor(Math.random() * this.wasteCategories.length);
        const category = this.wasteCategories[categoryIndex];
        
        const wasteItem = document.createElement('div');
        wasteItem.className = `waste-item ${category.name.toLowerCase()}`;
        wasteItem.textContent = category.icon;
        wasteItem.style.top = '50%';
        wasteItem.style.animationDuration = `${8 / this.currentSpeed}s`;
        
        wasteContainer.appendChild(wasteItem);
        
        // Schedule detection and sorting
        setTimeout(() => {
            this.detectAndSortItem(wasteItem, category);
        }, (4800 / this.currentSpeed)); // Detection at 60% of belt
        
        // Remove item after animation
        setTimeout(() => {
            if (wasteItem.parentNode) {
                wasteItem.parentNode.removeChild(wasteItem);
            }
        }, (8000 / this.currentSpeed));
    }
    
    detectAndSortItem(wasteItem, category) {
        // Show detection overlay
        this.showDetection(category);
        
        // Animate robotic arm
        this.animateRoboticArm();
        
        // Update bin count
        setTimeout(() => {
            category.count++;
            this.updateBinDisplay(category);
            this.updateMetrics();
            
            // Show sorting effect
            const binElement = document.querySelector(`[data-category="${category.name.toLowerCase()}"]`);
            if (binElement) {
                binElement.classList.add('sorting');
                setTimeout(() => {
                    binElement.classList.remove('sorting');
                }, 600);
            }
        }, 1000);
    }
    
    showDetection(category) {
        const detectionBox = document.getElementById('detectionBox');
        const detectionInfo = detectionBox.querySelector('.detection-info');
        
        detectionInfo.querySelector('.detection-type').textContent = category.name;
        detectionInfo.querySelector('.confidence').textContent = `${Math.floor(85 + Math.random() * 13)}%`;
        
        detectionBox.style.display = 'block';
        detectionBox.style.left = '60%';
        detectionBox.style.top = '40%';
        detectionBox.style.width = '80px';
        detectionBox.style.height = '80px';
        
        setTimeout(() => {
            detectionBox.style.display = 'none';
        }, 2000);
    }
    
    animateRoboticArm() {
        const arm = document.getElementById('roboticArm');
        const armStatus = document.getElementById('armStatus');
        const armLed = document.getElementById('armLed');
        const gripper = arm.querySelector('.arm-gripper');
        
        armLed.classList.add('active');
        armStatus.textContent = 'Picking';
        
        // Animate arm segments
        const shoulder = arm.querySelector('.arm-shoulder');
        const elbow = arm.querySelector('.arm-elbow');
        const wrist = arm.querySelector('.arm-wrist');
        
        // Pick sequence
        shoulder.style.transform = 'translateY(-50%) rotate(-30deg)';
        setTimeout(() => {
            elbow.style.transform = 'translateY(-50%) rotate(45deg)';
        }, 300);
        
        setTimeout(() => {
            wrist.style.transform = 'translateY(-50%) rotate(-15deg)';
            gripper.classList.add('closed');
            armStatus.textContent = 'Sorting';
        }, 600);
        
        // Sort sequence
        setTimeout(() => {
            shoulder.style.transform = 'translateY(-50%) rotate(30deg)';
            elbow.style.transform = 'translateY(-50%) rotate(-20deg)';
        }, 1000);
        
        setTimeout(() => {
            gripper.classList.remove('closed');
            armStatus.textContent = 'Releasing';
        }, 1400);
        
        // Return to idle
        setTimeout(() => {
            shoulder.style.transform = 'translateY(-50%) rotate(0deg)';
            elbow.style.transform = 'translateY(-50%) rotate(0deg)';
            wrist.style.transform = 'translateY(-50%) rotate(0deg)';
            armStatus.textContent = 'Idle';
            armLed.classList.remove('active');
        }, 1800);
    }
    
    startRoboticArm() {
        const armLed = document.getElementById('armLed');
        const armStatus = document.getElementById('armStatus');
        
        armLed.classList.add('active');
        armStatus.textContent = 'Ready';
    }
    
    stopRoboticArm() {
        const armLed = document.getElementById('armLed');
        const armStatus = document.getElementById('armStatus');
        
        armLed.classList.remove('active');
        armStatus.textContent = 'Idle';
    }
    
    createWasteBins() {
        const container = document.getElementById('binsContainer');
        
        this.wasteCategories.forEach(category => {
            const bin = document.createElement('div');
            bin.className = 'waste-bin';
            bin.dataset.category = category.name.toLowerCase();
            bin.addEventListener('click', () => this.showBinDetails(category));
            
            bin.innerHTML = `
                <div class="bin-icon">${category.icon}</div>
                <div class="bin-name">${category.name}</div>
                <div class="bin-count" style="color: ${category.color}">${category.count}</div>
                <div class="bin-progress">
                    <div class="bin-fill" style="background: ${category.color}; width: 0%"></div>
                </div>
                <div class="bin-percentage">0% of ${category.targetDaily}</div>
            `;
            
            container.appendChild(bin);
        });
    }
    
    updateBinDisplay(category) {
        const binElement = document.querySelector(`[data-category="${category.name.toLowerCase()}"]`);
        if (binElement) {
            const countElement = binElement.querySelector('.bin-count');
            const fillElement = binElement.querySelector('.bin-fill');
            const percentageElement = binElement.querySelector('.bin-percentage');
            
            countElement.textContent = category.count;
            
            const percentage = Math.min((category.count / category.targetDaily) * 100, 100);
            fillElement.style.width = `${percentage}%`;
            percentageElement.textContent = `${Math.floor(percentage)}% of ${category.targetDaily}`;
        }
    }
    
    updateMetrics() {
        this.itemsProcessed++;
        
        // Calculate items per minute
        if (this.startTime) {
            const minutesRunning = (new Date() - this.startTime) / (1000 * 60);
            this.itemsPerMinute = Math.round(this.itemsProcessed / Math.max(minutesRunning, 1));
        }
        
        // Update UI
        document.getElementById('itemsPerMinute').querySelector('.metric-value').textContent = this.itemsPerMinute;
        document.getElementById('itemsPerMinute').querySelector('.progress-bar').style.width = `${Math.min(this.itemsPerMinute / 60 * 100, 100)}%`;
        
        // Update accuracy (simulate slight variations)
        this.accuracy = 96.8 + (Math.random() - 0.5) * 2;
        document.getElementById('accuracy').querySelector('.metric-value').textContent = `${this.accuracy.toFixed(1)}%`;
        document.getElementById('accuracy').querySelector('.progress-bar').style.width = `${this.accuracy}%`;
        
        // Update environmental impact
        this.environmentalData.co2Saved = this.itemsProcessed * 0.15;
        this.environmentalData.wasteProcessed = this.itemsProcessed;
        this.environmentalData.recyclingRate = this.calculateRecyclingRate();
        
        this.updateEnvironmentalDisplay();
        this.updateCharts();
    }
    
    calculateRecyclingRate() {
        const totalItems = this.wasteCategories.reduce((sum, cat) => sum + cat.count, 0);
        const recyclableItems = this.wasteCategories
            .filter(cat => cat.name !== 'Hazardous')
            .reduce((sum, cat) => sum + cat.count, 0);
        
        return totalItems > 0 ? (recyclableItems / totalItems * 100) : 0;
    }
    
    updateEnvironmentalDisplay() {
        document.getElementById('co2Saved').textContent = `${this.environmentalData.co2Saved.toFixed(1)} kg`;
        document.getElementById('recyclingRate').textContent = `${this.environmentalData.recyclingRate.toFixed(1)}%`;
        document.getElementById('wasteProcessed').textContent = this.environmentalData.wasteProcessed;
    }
    
    startClock() {
        const updateClock = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString();
            document.getElementById('clock').textContent = timeString;
            
            // Update uptime
            if (this.startTime) {
                const uptime = new Date(now - this.startTime);
                const hours = String(uptime.getUTCHours()).padStart(2, '0');
                const minutes = String(uptime.getUTCMinutes()).padStart(2, '0');
                const seconds = String(uptime.getUTCSeconds()).padStart(2, '0');
                document.getElementById('uptime').querySelector('.metric-value').textContent = `${hours}:${minutes}:${seconds}`;
            } else {
                document.getElementById('uptime').querySelector('.metric-value').textContent = '00:00:00';
            }
        };
        
        updateClock();
        setInterval(updateClock, 1000);
    }
    
    initializeCharts() {
        this.initThroughputChart();
        this.initDistributionChart();
        this.initEfficiencyChart();
    }
    
    initThroughputChart() {
        const canvas = document.getElementById('throughputChart');
        const ctx = canvas.getContext('2d');
        this.throughputChart = { canvas, ctx, data: [] };
        this.drawThroughputChart();
    }
    
    initDistributionChart() {
        const canvas = document.getElementById('distributionChart');
        const ctx = canvas.getContext('2d');
        this.distributionChart = { canvas, ctx };
        this.drawDistributionChart();
    }
    
    initEfficiencyChart() {
        const canvas = document.getElementById('efficiencyChart');
        const ctx = canvas.getContext('2d');
        this.efficiencyChart = { canvas, ctx, data: this.hourlyStats };
        this.drawEfficiencyChart();
    }
    
    drawThroughputChart() {
        const { canvas, ctx, data } = this.throughputChart;
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        
        // Draw grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        
        // Vertical lines
        for (let i = 0; i <= 10; i++) {
            const x = (width / 10) * i;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        
        // Horizontal lines
        for (let i = 0; i <= 5; i++) {
            const y = (height / 5) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        // Draw line
        if (data.length > 1) {
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 3;
            ctx.beginPath();
            
            data.forEach((point, index) => {
                const x = (width / (data.length - 1)) * index;
                const y = height - (point / 60) * height;
                
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            
            ctx.stroke();
            
            // Draw points
            ctx.fillStyle = '#10b981';
            data.forEach((point, index) => {
                const x = (width / (data.length - 1)) * index;
                const y = height - (point / 60) * height;
                
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, 2 * Math.PI);
                ctx.fill();
            });
        }
    }
    
    drawDistributionChart() {
        const { canvas, ctx } = this.distributionChart;
        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 20;
        
        ctx.clearRect(0, 0, width, height);
        
        const total = this.wasteCategories.reduce((sum, cat) => sum + cat.count, 0);
        
        if (total > 0) {
            let currentAngle = -Math.PI / 2;
            
            this.wasteCategories.forEach(category => {
                const percentage = category.count / total;
                const sliceAngle = percentage * 2 * Math.PI;
                
                // Draw slice
                ctx.fillStyle = category.color;
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
                ctx.closePath();
                ctx.fill();
                
                // Draw label
                const labelAngle = currentAngle + sliceAngle / 2;
                const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
                const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
                
                ctx.fillStyle = '#ffffff';
                ctx.font = '12px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(`${(percentage * 100).toFixed(1)}%`, labelX, labelY);
                
                currentAngle += sliceAngle;
            });
        } else {
            // Draw empty circle
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.stroke();
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.font = '14px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('No Data', centerX, centerY);
        }
    }
    
    drawEfficiencyChart() {
        const { canvas, ctx, data } = this.efficiencyChart;
        const width = canvas.width;
        const height = canvas.height;
        const barWidth = width / data.length;
        const maxValue = Math.max(...data, 50);
        
        ctx.clearRect(0, 0, width, height);
        
        // Draw bars
        data.forEach((value, index) => {
            const barHeight = (value / maxValue) * height;
            const x = index * barWidth;
            const y = height - barHeight;
            
            // Gradient
            const gradient = ctx.createLinearGradient(0, y, 0, height);
            gradient.addColorStop(0, '#10b981');
            gradient.addColorStop(1, '#059669');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(x + barWidth * 0.1, y, barWidth * 0.8, barHeight);
            
            // Value label
            ctx.fillStyle = '#ffffff';
            ctx.font = '10px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(value.toString(), x + barWidth / 2, y - 5);
        });
    }
    
    updateCharts() {
        // Update throughput chart
        if (this.throughputChart) {
            this.throughputChart.data.push(this.itemsPerMinute);
            if (this.throughputChart.data.length > 20) {
                this.throughputChart.data.shift();
            }
            this.drawThroughputChart();
        }
        
        // Update distribution chart
        if (this.distributionChart) {
            this.drawDistributionChart();
        }
    }
    
    toggleCamera() {
        const enableBtn = document.getElementById('enableCamera');
        const switchBtn = document.getElementById('switchCamera');
        const video = document.getElementById('cameraVideo');
        
        if (!this.detectionConfig.cameraEnabled) {
            // Enable camera
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    this.cameraStream = stream;
                    video.srcObject = stream;
                    video.play();
                    
                    this.detectionConfig.cameraEnabled = true;
                    enableBtn.textContent = '📷 Disable Camera';
                    switchBtn.style.display = 'inline-block';
                    
                    this.showNotification('Camera enabled successfully', 'success');
                })
                .catch(err => {
                    console.error('Camera access denied:', err);
                    this.showNotification('Camera access denied', 'error');
                });
        } else {
            // Disable camera
            if (this.cameraStream) {
                this.cameraStream.getTracks().forEach(track => track.stop());
                video.srcObject = null;
            }
            
            this.detectionConfig.cameraEnabled = false;
            enableBtn.textContent = '📷 Enable Camera';
            switchBtn.style.display = 'none';
            
            this.showNotification('Camera disabled', 'info');
        }
    }
    
    switchCamera() {
        // This would implement camera switching logic
        this.showNotification('Switching camera...', 'info');
    }
    
    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}Tab`).classList.add('active');
    }
    
    openSettings() {
        document.getElementById('settingsModal').classList.add('active');
    }
    
    closeSettings() {
        document.getElementById('settingsModal').classList.remove('active');
    }
    
    updateAnalytics(timeRange) {
        // This would update analytics based on selected time range
        this.showNotification(`Analytics updated for ${timeRange} view`, 'info');
    }
    
    exportData() {
        const data = {
            timestamp: new Date().toISOString(),
            wasteCategories: this.wasteCategories,
            metrics: {
                itemsProcessed: this.itemsProcessed,
                itemsPerMinute: this.itemsPerMinute,
                accuracy: this.accuracy
            },
            environmentalData: this.environmentalData
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `waste-management-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Data exported successfully', 'success');
    }
    
    updateConfidenceThreshold(value) {
        this.detectionConfig.confidenceThreshold = value;
        document.getElementById('confidenceValue').textContent = `${Math.round(value * 100)}%`;
    }
    
    calibrateSystem() {
        this.showNotification('Starting system calibration...', 'info');
        
        // Simulate calibration process
        setTimeout(() => {
            this.showNotification('Calibration completed successfully', 'success');
        }, 3000);
    }
    
    enterMaintenanceMode() {
        if (this.isRunning) {
            this.showNotification('Stop system before entering maintenance mode', 'warning');
            return;
        }
        
        this.showNotification('Entering maintenance mode...', 'info');
    }
    
    toggleTheme(isDark) {
        // Theme toggle would be implemented here
        this.showNotification(`Switched to ${isDark ? 'dark' : 'light'} theme`, 'info');
    }
    
    toggleAnimations(enabled) {
        const body = document.body;
        if (enabled) {
            body.classList.remove('no-animations');
        } else {
            body.classList.add('no-animations');
        }
        
        this.showNotification(`Animations ${enabled ? 'enabled' : 'disabled'}`, 'info');
    }
    
    setupMobileNavigation() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                
                // Update active nav item
                document.querySelectorAll('.nav-item').forEach(navItem => {
                    navItem.classList.remove('active');
                });
                e.currentTarget.classList.add('active');
                
                // Show corresponding section
                this.showMobileSection(section);
            });
        });
    }
    
    showMobileSection(section) {
        // Hide all sections
        document.querySelectorAll('.main-content > section').forEach(sec => {
            sec.style.display = 'none';
        });
        
        // Show selected section
        switch (section) {
            case 'processing':
                document.querySelector('.processing-area').style.display = 'grid';
                break;
            case 'bins':
                document.querySelector('.bins-section').style.display = 'block';
                break;
            case 'dashboard':
                document.querySelector('.dashboard-section').style.display = 'block';
                break;
            case 'settings':
                this.openSettings();
                break;
        }
    }
    
    showBinDetails(category) {
        const percentage = Math.min((category.count / category.targetDaily) * 100, 100);
        const message = `
            ${category.name} Waste Bin\n
            Current Count: ${category.count}\n
            Target: ${category.targetDaily} items/day\n
            Progress: ${percentage.toFixed(1)}%\n
            Status: ${percentage >= 90 ? 'Nearly Full' : percentage >= 50 ? 'Half Full' : 'Available'}
        `;
        
        alert(message);
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        
        // Style notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: '#ffffff',
            fontWeight: '500',
            zIndex: '2000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });
        
        // Set background color based on type
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        notification.style.background = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    startDataSimulation() {
        // Simulate real-time data updates every 2 seconds
        setInterval(() => {
            if (this.isRunning) {
                // Add some randomness to metrics
                this.accuracy += (Math.random() - 0.5) * 0.5;
                this.accuracy = Math.max(85, Math.min(99, this.accuracy));
                
                // Update throughput history for charts
                this.updateCharts();
            }
        }, 2000);
        
        // Update performance metrics every 30 seconds
        setInterval(() => {
            this.updatePerformanceMetrics();
        }, 30000);
    }
    
    updatePerformanceMetrics() {
        if (this.isRunning && this.startTime) {
            this.performanceMetrics.uptime = (new Date() - this.startTime) / 1000;
            this.performanceMetrics.totalProcessed = this.itemsProcessed;
            this.performanceMetrics.avgAccuracy = this.accuracy;
            this.performanceMetrics.errorRate = 100 - this.accuracy;
        }
        
        // Update performance display if visible
        const performanceContainer = document.getElementById('performanceMetrics');
        if (performanceContainer) {
            performanceContainer.innerHTML = `
                <div class="performance-item">
                    <span class="performance-label">Total Processed:</span>
                    <span class="performance-value">${this.performanceMetrics.totalProcessed}</span>
                </div>
                <div class="performance-item">
                    <span class="performance-label">Avg Accuracy:</span>
                    <span class="performance-value">${this.performanceMetrics.avgAccuracy.toFixed(1)}%</span>
                </div>
                <div class="performance-item">
                    <span class="performance-label">Error Rate:</span>
                    <span class="performance-value">${this.performanceMetrics.errorRate.toFixed(1)}%</span>
                </div>
                <div class="performance-item">
                    <span class="performance-label">Uptime:</span>
                    <span class="performance-value">${this.formatUptime(this.performanceMetrics.uptime)}</span>
                </div>
            `;
        }
    }
    
    formatUptime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
}

// Initialize the system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const wasteSystem = new WasteManagementSystem();
    
    // Make system globally accessible for debugging
    window.wasteSystem = wasteSystem;
    
    // Handle window resize for responsive charts
    window.addEventListener('resize', () => {
        wasteSystem.initializeCharts();
    });
    
    // Handle visibility change for performance optimization
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Pause non-essential animations when tab is not visible
        } else {
            // Resume animations when tab becomes visible
            wasteSystem.updateCharts();
        }
    });
});

// Service Worker Registration (simulated)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {
        console.log('Service Worker registration simulated');
    });
}

// Handle offline/online events
window.addEventListener('online', () => {
    document.querySelector('.system-status').style.color = '#10b981';
});

window.addEventListener('offline', () => {
    document.querySelector('.system-status').style.color = '#ef4444';
});