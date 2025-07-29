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
        this.selectedJob = 'store-clerk';
        this.trainingModules = {};
        
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
    //made CopingController instead to learn, handled by backend API
    loadCopingStrategies() {

    }

    showCopingStrategies(emotion) {
        const container = document.getElementById('coping-suggestions');
        container.innerHTML = '<p style="text-align: center; color:#6c757d; font-style: italic;">Loading coping strategies...</p>';
        fetch(`/api/coping?emotion=${encodeURIComponent(emotion)}`)
            .then(response => response.json())
            .then(strategies => {
                if (strategies.length === 0) {
                    container.innerHTML = '<p style="text-align: center; color: #6c757d; font-style: italic;">No strategies available for this emotion.</p>';
                    return;
                }

                container.innerHTML = strategies.map(strategy => `
                    <div class="coping-strategy">
                        <p>${strategy}</p>
                    </div>
                `).join('');
            })
            .catch(error => {
                console.error('Error fetching coping strategies:', error);
                container.innerHTML =  '<p style="text-align: center; color: #dc3545; font-style: italic;">Error loading coping strategies. Please try again.</p>';
            });
    }

    updateCopingSuggestions() {
        const recentEmotions = this.emotions.slice(-3);
        if (recentEmotions.length > 0) {
            const lastEmotion = recentEmotions[recentEmotions.length - 1].emotion;
            this.showCopingStrategies(lastEmotion);
        }
    }

    //career progression
    selectJob(jobType) {
        this.loadTrainingModules(jobType);
    }

    loadTrainingModules(jobType = 'store-clerk') {
        const modules = {
            'store-clerk': [
                {
                    title: 'Customer Service Basics',
                    status: 'not-started',
                    progress: 0,
                    skills: [
                        'Professional communication',
                        'Active listening techniques',
                        'Problem-solving approaches',
                        'Connecting with the customer', 
                        'Conflict resolution',
                        'Customer empathy'
                    ],
                    practiceMethods: [
                        'Role-play customer scenarios with a friend or family member, if thinking about it like a script helps use that to your advantage. General Acknowledgment: "Thank you for reaching out." "I appreciate your patience." "I understand how important this is to you." Apologizing: "I apologize for any inconvenience this may have caused." "I\'m sorry to hear that you\'re experiencing this issue." "We regret that this has happened and appreciate your understanding." Providing Information: "Let me provide you with the information you need." "Here\'s what I can do for you." "I\'d be happy to assist you with that." Clarification: "Could you please provide more details about the issue?" "Can you clarify what you mean by...?" "I want to make sure I understand your concern correctly." Offering Solutions: "Here are a few options to resolve your issue." "I recommend trying this solution..." "Let\'s work together to find a resolution." Closing the Conversation: "Is there anything else I can assist you with?" "Thank you for your understanding." "I\'m glad I could help. Have a great day!" Follow-Up: "I will follow up with you regarding this matter." "Please feel free to reach out if you need further assistance." "I\'ll keep you updated on the progress."',
                    
                        'Provide fast responses to your clients to demonstrate that you value their demands. Practice maintaining eye contact, nodding, and repeating back what customers say. Use phrases like "I understand you\'re saying..." and "Let me make sure I heard you correctly..." Ask follow-up questions to show you\'re engaged and truly listening to their concerns.',
                    
                        'To solve customer problems, try using these techniques. Don\'t argue, simply start with an apology: "Thank you for reaching out! I totally feel for you. Here is what I\'m going to do to turn things around." "Wow, I am so sorry to hear that. No wonder you feel this way. Let\'s get things right ASAP." "I appreciate you letting me know about the issue! I definitely will make sure that it gets sorted." "Ohh, it sounds like a serious issue. I am so sorry you have to go through this. But you\'ve come to the right place to get this resolved." Practice with scenarios like "My order is wrong" or "I can\'t find what I\'m looking for."',
                    
                        'One way to establish connection with clients is to ask them by name and use them in discussions. Build connections by using customers\' names, remembering their preferences, and showing genuine interest. Practice greeting regular customers warmly and asking about their day. Create a friendly, welcoming atmosphere that makes customers feel valued and appreciated.',
                    
                        'Say "thank you!" Remember to express gratitude to those you serve. For conflicts, stay calm and use these techniques: Listen without interrupting, acknowledge their feelings, apologize sincerely, offer solutions, and follow up. Practice de-escalating situations with phrases like "I understand this is frustrating" and "Let\'s work together to resolve this."',
                    
                        'Help others! Be helpful even if you are unable to assist. It demonstrates your concern. Additionally, adding a smile alongside it. Show empathy by putting yourself in the customer\'s shoes. Use phrases like "I can imagine how frustrating this must be" and "I would feel the same way in your situation." Practice responding to emotional customers with compassion and understanding.'

                        this.updateTrainingModulesUI
                    ]
                }
            ]
        };
        
        this.updateTrainingModulesUI();
    }

    updateTrainingModulesUI() {
        const container = document.getElementById('modules-container');
        container.innerHTML = '';

        const modules = this.trainingModules[this.selectedJob] || [];

        modules.forEach((module, index) => {
            const moduleElement = document.createElement('div');
            moduleElement.className = 'module-card';
            moduleElement.innerHTML = `
                <div class="module-header">
                    <h4>${module.title}</h4>
                    <span class="module-status ${module.status}">${module.status}</span>
                </div>
                <div class="module-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${module.progress}%"></div>
                    </div>
                    <span>${module.progress}% Complete</span>
                </div>
                <div class="module-skills">
                    <h5>Skills:</h5>
                    <ul>
                        ${module.skills.map(skill => `<li>${skill}</li>`).join('')}
                    </ul>
                </div>
                <div class="module-practice">
                    <h5>Practice Methods:</h5>
                    <div class="practice-methods-container">
                        ${module.practiceMethods.map((method, methodIndex) => `
                            <div class="practice-method-item">
                                <div class="practice-method-header" onclick="lifeAssistant.togglePracticeMethod(${index}, ${methodIndex})">
                                    <span class="practice-method-title">${module.skills[methodIndex] || `Practice ${methodIndex + 1}`}</span>
                                    <i class="fas fa-chevron-down expand-icon"></i>
                                </div>
                                <div class="practice-method-content collapsed">
                                    <p>${method}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <button class="btn btn-primary" onclick="lifeAssistant.startModule('${this.selectedJob}', ${index})">
                    Start Module
                </button>
            `;
            container.appendChild(moduleElement);
        });
    }
    
    togglePracticeMethod(moduleIndex, methodIndex) {
        const header = event.currentTarget;
        const content = header.nextElementSibling;
        const icon = header.querySelector('.expand-icon');

        if (content.classList.contains('collapsed')) {
            content.classList.remove('collapsed');
            content.classList.add('expanded');
            header.classList.add('expanded');
        } else {
            content.classList.remove('expanded');
            content.classList.add('collapsed');
            header.classList.remove('expanded');
        }
    }


    showModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
    }

    hideModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }

    showNotification(message, type = 'info') {
        console.log(`${type}: ${message}`);
    }

    formatTime(timestamp) {
        return new Date(timestamp).toLocaleString();
    }

    updateUI() {
        this.updateTasksUI();
        this.updateEnergyUI();
        this.updateEmotionUI();
    }

    startModule(jobType, moduleIndex) {
        console.log(`Starting module ${moduleIndex} for ${jobType}`);
    }
}