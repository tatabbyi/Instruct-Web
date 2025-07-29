class LifeAssistant {
    constructor() {
        this.currentEnergy = 75;
        this.tasks = [];
        this.emotions = [];
        this.symptoms = [];
        this.careerProgress = {
            'store-clerk': 0,
            'cleaner': 0,
            'data-entry': 0
        };
        this.certifications = [];
        
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.updateUI();
        this.loadTrainingModules();
        this.loadCopingStrategies();
    }

    //Managment of data
    saveData() {
        const data = {
            currentEnergy: this.currentEnergy,
            tasks: this.tasks,
            emotions: this.emotions,
            symptoms: this.symptoms,
            careerProgress: this.careerProgress,
            certifications: this.certifications
        };
        localStorage.setItem('lifeAssistantData', JSON.stringify(data));
    }

    loadData() {
        const saved = localStorage.getItem('lifeAssistantData');
        if (saved) {
            const data = JSON.parse(saved);
            this.currentEnergy = data.currentEnergy || 75;
            this.tasks = data.tasks || [];
            this.emotions = data.emotions || [];
            this.symptoms = data.symptoms || [];
            this.careerProgress = data.careerProgress || {
                'store-clerk': 0,
                'cleaner': 0,
                'data-entry': 0
            };
            this.certifications = data.certifications || [];
        }
    }

    //navigation
    setupEventListeners() {
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.closest('.nav-tab').dataset.tab);
            });
        });

        //Task management
        document.getElementById('add-task-btn').addEventListener('click', () => {
            this.showModal('task-modal');
        });

        document.getElementById('task-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });

        document.querySelectorAll('.template-card').forEach(card => {
            card.addEventListener('click', () => {
                this.addTaskFromTemplate(card.dataset.template);
            });
        });

        //energy management
        document.getElementById('energy-level').addEventListener('input', (e) => {
            document.getElementById('energy-display').textContent = e.target.value;
        });

        document.getElementById('update-energy').addEventListener('click', () => {
            this.updateEnergy();
        });

        document.querySelectorAll('.activity-card').forEach(card => {
            card.addEventListener('click', () => {
                this.addEnergy(card.dataset.energy);
            });
        });

        //emotional regulation
        document.getElementById('log-emotion-btn').addEventListener('click', () => {
            this.showModal('emotional-modal');
        });

        document.getElementById('emotion-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.logEmotion();
        });

        document.querySelectorAll('.emotion-card').forEach(card => {
            card.addEventListener('click', () => {
                this.selectEmotion(card);
            });
        });

        //tracking symptoms
        document.getElementById('symptom-intensity').addEventListener('input', (e) => {
            document.getElementById('intensity-display').textContent = e.target.value;
        });

        document.getElementById('log-symptom').addEventListener('click', () => {
            this.logSymptom();
        });

        //career progression
        document.querySelectorAll('.job-card').forEach(card => {
            card.addEventListener('click', () => {
                this.selectJob(card.dataset.job);
            });
        });

        //modal management
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                this.hideModals();
            });
        });

        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideModals();
            }
        });

        //range inputs
        document.getElementById('emotion-intensity').addEventListener('input', (e) => {
            document.getElementById('emotion-intensity-display').textContent = e.target.value;
        });


    }

    //navigation updated
    switchTab(tabName) {
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');
    }

    //new tasks
    addTask() {
        const title = document.getElementById('task-title').value;
        const description = document.getElementById('task-description').value;
        const priority = document.getElementById('task-priority').value;

        const task = {
            id : Date.now(),
            title,
            description,
            priority,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.push(task);
        this.saveData();
        this.updateTasksUI();
        this.hideModals();
        this.clearTaskForm();
    }

    addTaskFromTemplate(template) {
        const templates = {
            hygiene: {
                title: 'Personal Hygiene',
                description: 'shower, brush teeth, get dressed',
                priority: 'high'
            },
            medication: {
                title: 'Take Medication',
                description: 'Take prescribed medications',
                priority: 'high'
            },
            exercise: {
                title: 'Light Exercise',
                description: '10-minute walk or stretch',
                priority: 'medium'
            },
            social: {
                title: 'Social Connection',
                description: 'Call a friend or family member',
                priority: 'medium'
            },
            hobby: {
                title: 'Creative Activity',
                description: 'Drawing, writing, or crafts',
                priority: 'low'
            },
            learning: {
                title: 'Learning Time',
                description: 'Read or watch educational content',
                priority: 'low'
            }
        };

        const templateData = templates[template];
        if (templateData) {
            const task = {
                id: Date.now(),
                ...templateData,
                completed: false,
                createdAt: new Date().toISOString()
            };

            this.tasks.push(task);
            this.saveData();
            this.updateTasksUI();
        } else {
            console.warn('Template not found:', template);
        }
    }
    
    //Tasks state
    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveData();
            this.updateTasksUI();
        }
    }

    deleteTask(taskId) {
        this.tasks =this.tasks.filter(t => t.id !== taskId);
        this.saveData();
        this.updateTasksUI();
    }

    updateTasksUI() {
        const container = document.getElementById('tasks-container');
        container.innerHTML='';

        if(this.tasks.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #6c757d; font-style: italic;">No tasks yet. Add some to get started!</p>';
            return;
        }

        this.tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = 'task-item';
            taskElement.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}
                        onchange="lifeAssistant.toggleTask(${task.id})">
                <div class="task-content">
                    <div class="task-title ${task.completed ? 'completed' : ''}">${task.title}</div>
                    <div class="task-description">${task.description}</div>
                </div>
                <span class="task-priority priority-${task.priority}">${task.priority}</span>
                <div class="task-actions">
                    <button class="btn btn-danger" onclick="lifeAssistant.deleteTask(${task.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            container.appendChild(taskElement);
        });
    }

    //resetting tasks
    clearTaskForm() {
        document.getElementById('task-title').value = '';
        document.getElementById('task-description').value = '';
        document.getElementById('task-priority').value = 'low';
    }

    //energy slider updating
    updateEnergy() {
        const energyLevel = parseInt(document.getElementById('energy-level').value);
        this.currentEnergy = energyLevel * 10;
        this.saveData();
        this.updateEnergyUI();
    }
    
    addEnergy(energyValue) {
        const energy = parseInt(energyValue.replace('+', ''));
        this.currentEnergy = Math.min(100, this.currentEnergy + energy);
        this.saveData();
        this.updateEnergyUI();

        this.showNotification(`+${energy}) Energy added!`, 'success');
    }

    updateEnergyUI() {
        const energyFill = document.getElementById('energy-fill');
        const energyValue = document.getElementById('energy-value');

        energyFill.style.width = `${this.currentEnergy}%`;
        energyValue.textContent = `${this.currentEnergy}%`;

        if(this.currentEnergy < 30) {
            energyFill.style.background = '#ff6b6b';
        } else if (this.currentEnergy < 60) {
            energyFill.style.background = '#feca57';
        } else {
            energyFill.style.background = 'linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb, #0abde3)';
        }
    }

    //emotional support
    selectEmotion(card) {
        document.querySelectorAll('.emotion-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        
        const emotion = card.dataset.emotion;
        document.getElementById('emotion-type').value = emotion;

        this.showCopingStrategies(emotion);
    }

    logEmotion() {
        const emotion = document.getElementById('emotion-type').value;
        const intensity = parseInt(document.getElementById('emotion-intensity').value);
        const notes = document.getElementById('emotion-notes').value;

        const emotionEntry = {
            id: Date.now(),
            emotion,
            intensity,
            notes,
            timestamp: new Date().toISOString()
        };

        this.emotions.push(emotionEntry);
        this.saveData();
        this.updateEmotionUI();
        this.hideModals();
        this.clearEmotionForm();

        this.showNotification('Emotion logged successfully', 'success');
    }

    logSymptom() {
        const symptom = document.getElementById('symptom-select').value;
        const intensity = parseInt(document.getElementById('symptom-intensity').value);

        if (!symptom) {
            this.showNotification('Please select a symptom', 'error');
            return;
        }

        const symptomEntry = {
            id: Date.now(),
            symptom,
            intensity,
            timestamp: new Date().toISOString()
        };

        this.symptoms.push(symptomEntry);
        this.saveData();
        this.updateEmotionUI();

        this.showNotification('Symptom logged successfully', 'success');
    }

    updateEmotionUI() {
        this.updateEmotionHistory();
        this.updateCopingSuggestions();
    }

        updateEmotionHistory() {
            const container = document.getElementById('emotion-log');
            const allEntries = [...this.emotions, ...this.symptoms].sort((a, b) =>
                new Date(b.timestamp) - new Date(a.timestamp)
            ).slice(0, 10);

            container.innerHTML = '';
        
            if (allEntries.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: #6c757d; font-style: italic;">No emotions or symptoms logged yet.</p>';
                return;
            }

            allEntries.forEach(entry => {
                        const entryElement = document.createElement('div');
                        entryElement.className = 'emotion-entry';

                        if (entry.emotion) {
                            entryElement.innerHTML = `
                    <div class="emotion-entry-header">
                        <span class="emotion-type">${entry.emotion.charAt(0).toUpperCase() + entry.emotion.slice(1)}</span>
                        <span class="emotion-time">${this.formatTime(entry.timestamp)}</span>
                    </div>
                    <div class="emotion-intensity">Intensity: ${entry.intensity}/10</div>
                    ${entry.notes ? `<div class="emotion-notes">${entry.notes}</div>` : ''}
                `;
            } else {
                entryElement.innerHTML = `
                    <div class="emotion-entry-header">
                        <span class="emotion-type">${entry.symptom.charAt(0).toUpperCase() + entry.symptom.slice(1)}</span>
                        <span class="emotion-time">${this.formatTime(entry.timestamp)}</span>
                    </div>
                    <div class="emotion-intensity">Intensity: ${entry.intensity}/10</div>
                `;
            }

            container.appendChild(entryElement);
        });
    }

    clearEmotionForm() {
        document.getElementById('emotion-type').value = '';
        document.getElementById('emotion-intensity').value = '5';
        document.getElementById('emotion-intensity-display').textContent = '5';
        document.getElementById('emotion-notes').value = '';
        document.querySelectorAll('.emotion-card').forEach(c => c.classList.remove('selected'));
    }
}
const lifeAssistant = new LifeAssistant();


