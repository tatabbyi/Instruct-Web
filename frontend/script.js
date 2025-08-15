class LifeAssistant {
    constructor() {
        this.currentEnergy = 75;
        this.tasks = [];
        this.emotions = [];
        this.symptoms = [];
        this.careerProgress = {
            'store-clerk': 0,
            'cleaner': 0,
            'care-taker': 0,
            'data-entry': 0
        };
        this.certifications = [];
        this.selectedJob = 'store-clerk';
        this.trainingModules = {};
        this.helperMemory = {
            conversationHistory: [],
            userPerformance: {
                'store-clerk': { difficulty: 'medium', successRate: 0.5 },
                'cleaner': { difficulty: 'medium', successRate: 0.5 },
                'care-taker': { difficulty: 'medium', successRate: 0.5 },
                'data-entry': { difficulty: 'medium', successRate: 0.5 },
            },
            userPreferences: {},
            sessionStats: {
                messagesSent: 0,
                correctResponses: 0,
                escalationCount: 0
            }
        };

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
                const btn = e.currentTarget;
                this.switchTab(btn.dataset.tab);
            });
        });
        const navTabs = document.querySelector('.nav-tabs');
        if (navTabs) {
            navTabs.addEventListener('click', (e) => {
                const btn = e.target.closest('.nav-tab');
                if (!btn) return;
                this.switchTab(btn.dataset.tab);
            });
        }

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
            id: Date.now(),
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
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.saveData();
        this.updateTasksUI();
    }

    updateTasksUI() {
        const container = document.getElementById('tasks-container');
        container.innerHTML = '';

        if (this.tasks.length === 0) {
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

        this.showNotification(`+${energy} Energy added!`, 'success');
    }

    updateEnergyUI() {
        const energyFill = document.getElementById('energy-fill');
        const energyValue = document.getElementById('energy-value');

        energyFill.style.width = `${this.currentEnergy}%`;
        energyValue.textContent = `${this.currentEnergy}%`;

        if (this.currentEnergy < 30) {
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
        this.selectedJob = jobType;
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
                    practiceMethods: [ //example of how other practiceMethods will look at end
                        'Role-play customer scenarios with a friend or family member, if thinking about it like a script helps use that to your advantage. General Acknowledgment: "Thank you for reaching out." "I appreciate your patience." "I understand how important this is to you." Apologizing: "I apologize for any inconvenience this may have caused." "I\'m sorry to hear that you\'re experiencing this issue." "We regret that this has happened and appreciate your understanding." Providing Information: "Let me provide you with the information you need." "Here\'s what I can do for you." "I\'d be happy to assist you with that." Clarification: "Could you please provide more details about the issue?" "Can you clarify what you mean by...?" "I want to make sure I understand your concern correctly." Offering Solutions: "Here are a few options to resolve your issue." "I recommend trying this solution..." "Let\'s work together to find a resolution." Closing the Conversation: "Is there anything else I can assist you with?" "Thank you for your understanding." "I\'m glad I could help. Have a great day!" Follow-Up: "I will follow up with you regarding this matter." "Please feel free to reach out if you need further assistance." "I\'ll keep you updated on the progress."',
                    
                        'Provide fast responses to your clients to demonstrate that you value their demands. Practice maintaining eye contact, nodding, and repeating back what customers say. Use phrases like "I understand you\'re saying..." and "Let me make sure I heard you correctly..." Ask follow-up questions to show you\'re engaged and truly listening to their concerns.',
                    
                        'To solve customer problems, try using these techniques. Don\'t argue, simply start with an apology: "Thank you for reaching out! I totally feel for you. Here is what I\'m going to do to turn things around." "Wow, I am so sorry to hear that. No wonder you feel this way. Let\'s get things right ASAP." "I appreciate you letting me know about the issue! I definitely will make sure that it gets sorted." "Ohh, it sounds like a serious issue. I am so sorry you have to go through this. But you\'ve come to the right place to get this resolved." Practice with scenarios like "My order is wrong" or "I can\'t find what I\'m looking for."',
                    
                        'One way to establish connection with clients is to ask them by name and use them in discussions. Build connections by using customers\' names, remembering their preferences, and showing genuine interest. Practice greeting regular customers warmly and asking about their day. Create a friendly, welcoming atmosphere that makes customers feel valued and appreciated.',
                    
                        'Say "thank you!" Remember to express gratitude to those you serve. For conflicts, stay calm and use these techniques: Listen without interrupting, acknowledge their feelings, apologize sincerely, offer solutions, and follow up. Practice de-escalating situations with phrases like "I understand this is frustrating" and "Let\'s work together to resolve this."',
                    
                        'Help others! Be helpful even if you are unable to assist. It demonstrates your concern. Additionally, adding a smile alongside it. Show empathy by putting yourself in the customer\'s shoes. Use phrases like "I can imagine how frustrating this must be" and "I would feel the same way in your situation." Practice responding to emotional customers with compassion and understanding.'
                    ],
                    resources: [ //Later resources will be added specifically made for this module.
                        '<a href="https://cursa.app/free-courses-customer-service-online" target="_blank" rel="noopener noreferrer" title="Free Customer Service Courses">Free Customer Service Courses on Cursa</a>',
                        '<a href="https://www.youtube.com/watch?v=SsNfAOTZNZY&ab_channel=CareerVidz" target="_blank" rel="noopener noreferrer" title="Training Video">Youtube Customer Service Masterclass</a>'
                    ]
                },
                {
                    title: 'Cash Handling & POS Systems',
                    status: 'not-started',
                    progress: 0,
                    skills: [
                        'Math skills and money counting',
                        'POS system operation',
                        'Cash register procedures',
                        'Handling Transactions',
                        'Receipt handling',
                    ],
                    practiceMethods: [ //automated response for now will be edited later
                        'Practice counting cash quickly and accurately using play money or real coins. Set a timer to improve speed and accuracy. Use a calculator to check your work.',
                        'Familiarize yourself with the POS system by practicing common transactions like sales, returns, and exchanges. Use a demo version of the software if available.',
                        'Role-play scenarios where you handle different types of transactions, such as cash, credit cards, and gift cards. Practice giving change and processing refunds.',
                        'Practice handling receipts by organizing them in a logical order. Use color-coded folders or envelopes to keep track of different types of transactions.',
                        'Simulate busy periods by processing multiple transactions in a row. Focus on maintaining accuracy while working quickly.'
                    ],
                    resources: [ //fix later
                        '<a href="https://www.youtube.com/watch?v=4b1k2g3f4g5&ab_channel=RetailTraining" target="_blank" rel="noopener noreferrer" title="POS System Training Video">POS System Training Video</a>',
                        '<a href="https://www.shopify.com/blog/pos-system-guide" target="_blank" rel="noopener noreferrer" title="POS System Guide">POS System Guide</a>'
                    ]
                },
                {
                    title: 'Inventory Management',
                    status: 'not-started',
                    progress: 0,
                    skills: [
                        'Stock management',
                        'Inventory tracking',
                        'Product organization',
                        'Loss prevention techniques',
                        'Supply chain basics'
                    ],
                    practiceMethods: [ //fix
                        'Practice organizing products on shelves by category and size. Use labels or tags to identify different sections. Create a system for restocking items when they run low.',
                        'Use a spreadsheet or inventory management software to track stock levels. Practice updating the inventory regularly and generating reports.',
                        'Role-play scenarios where you handle inventory discrepancies, such as missing items or overstock situations. Practice investigating and resolving these issues.',
                        'Learn about loss prevention techniques, such as monitoring for theft and implementing security measures. Practice identifying potential risks in a retail environment.',
                        'Familiarize yourself with the supply chain process by learning about suppliers, shipping, and receiving products. Practice communicating with suppliers to place orders.'
                    ],
                    resources: [ //fix
                        '<a href="https://www.youtube.com/watch?v=4b1k2g3f4g5&ab_channel=RetailTraining" target="_blank" rel="noopener noreferrer" title="Inventory Management Training Video">Inventory Management Training Video</a>',
                        '<a href="https://www.shopify.com/blog/inventory-management-guide" target="_blank" rel="noopener noreferrer" title="Inventory Management Guide">Inventory Management Guide</a>'
                    ]
                },
                {
                    title: 'Stress Management & Resilience',
                    status: 'not-started',
                    progress: 0,
                    skills: [
                        'Stress reduction techniques',
                        'Time management',
                        'Work-life balance strategies',
                        'Building resilience',
                        'Self-care practices'
                    ],
                    practiceMethods: [ //fix
                        'Practice deep breathing exercises to reduce stress. Inhale deeply through your nose, hold for a few seconds, and exhale slowly through your mouth. Repeat several times.',
                        'Use a planner or digital calendar to organize your tasks and schedule breaks. Practice prioritizing tasks based on urgency and importance.',
                        'Set boundaries between work and personal life by establishing specific work hours. Practice saying no to additional tasks that interfere with your personal time.',
                        'Learn about resilience-building techniques, such as positive thinking and problem-solving. Practice reframing negative thoughts into positive ones.',
                        'Incorporate self-care practices into your daily routine, such as exercise, healthy eating, and relaxation techniques. Practice taking short breaks throughout the day.'
                    ],
                    resources: [ //fix
                        '<a href="https://www.youtube.com/watch?v=4b1k2g3f4g5&ab_channel=RetailTraining" target="_blank" rel="noopener noreferrer" title="Stress Management Training Video">Stress Management Training Video</a>',
                        '<a href="https://www.mindtools.com/pages/article/newTCS_00.htm" target="_blank" rel="noopener noreferrer" title="Stress Management Guide">Stress Management Guide</a>'
                    ]
                }
            ],
            'care-taker': [
                {
                    title: 'Cleaning Safety Procedures',
                    status: 'not-started',
                    progress: 0,
                    skills: [
                        'Understanding cleaning chemicals',
                        'Proper use of PPE',
                        'Safe lifting techniques',
                        'Hazardous material handling',
                        'Emergency procedures'
                    ],
                    practiceMethods: [ //fix
                        'Familiarize yourself with the Material Safety Data Sheets (MSDS) for all cleaning chemicals used. Practice reading and understanding the safety information provided.',
                        'Practice putting on and removing personal protective equipment (PPE) such as gloves, masks, and goggles. Ensure proper fit and comfort.',
                        'Learn and practice safe lifting techniques to prevent injury. Use your legs to lift, keep your back straight, and avoid twisting while lifting.',
                        'Understand how to handle hazardous materials safely. Practice identifying hazardous materials in the workplace and following proper disposal procedures.',
                        'Review emergency procedures for spills, accidents, or injuries. Practice responding to hypothetical emergency scenarios.'
                    ],
                    resources: [ //fix
                        '<a href="https://www.youtube.com/watch?v=4b1k2g3f4g5&ab_channel=CleaningSafetyTraining" target="_blank" rel="noopener noreferrer" title="Cleaning Safety Training Video">Cleaning Safety Training Video</a>',
                        '<a href="https://www.osha.gov/Publications/osha3151.pdf" target="_blank" rel="noopener noreferrer" title="OSHA Cleaning Safety Guide">OSHA Cleaning Safety Guide</a>'
                    ]
                },
                {
                    title: 'Chemical Handling & Usage',
                    status: 'not-started',
                    progress: 0,
                    skills: [
                        'Chemical mixing and dilution',
                        'Understanding pH levels',
                        'Proper storage of chemicals',
                        'Labeling and documentation',
                        'Disposal procedures'
                    ],
                    practiceMethods: [ //fix
                        'Practice mixing and diluting cleaning chemicals according to manufacturer instructions. Use measuring tools for accuracy.',
                        'Learn about pH levels of different cleaning products. Practice testing pH levels using pH strips or meters.',
                        'Understand proper storage procedures for cleaning chemicals, including temperature and ventilation requirements. Practice organizing chemicals in a designated storage area.',
                        'Practice labeling cleaning products with the correct information, including product name, concentration, and safety warnings. Ensure labels are clear and legible.',
                        'Review disposal procedures for hazardous waste. Practice following local regulations for disposing of cleaning chemicals.'
                    ],
                    resources: [ //fix
                        '<a href="https://www.youtube.com/watch?v=4b1k2g3f4g5&ab_channel=ChemicalHandlingTraining" target="_blank" rel="noopener noreferrer" title="Chemical Handling Training Video">Chemical Handling Training Video</a>',
                        '<a href="https://www.epa.gov/hw/learn-about-hazardous-waste" target="_blank" rel="noopener noreferrer" title="EPA Hazardous Waste Guide">EPA Hazardous Waste Guide</a>'
                    ]
                },
                {
                    title: 'Equipment Operation',
                    status:'not-started',
                    progress: 0,
                    skills: [
                        'Vacum cleaner operation',
                        'Floor cleaning equipment',
                        'Equipment maintenance',
                        'Safety procedures & checks',
                        'Troubleshooting basics',
                    ],
                    practiceMethods: [ //fix
                        'Practice operating different types of vacuum cleaners, including upright, canister, and robotic models. Familiarize yourself with their features and settings.',
                        'Learn how to operate floor cleaning equipment such as scrubbers and polishers. Practice using them on different floor surfaces.',
                        'Understand basic maintenance procedures for cleaning equipment, such as changing filters, emptying bags, and cleaning brushes. Practice performing these tasks regularly.',
                        'Review safety procedures for operating cleaning equipment, including checking for hazards and ensuring proper use of safety features.',
                        'Practice troubleshooting common issues with cleaning equipment, such as clogs or malfunctions. Learn how to identify and resolve these problems.'
                    ],
                    resources: [ //fix
                        '<a href="https://www.youtube.com/watch?v=4b1k2g3f4g5&ab_channel=EquipmentOperationTraining" target="_blank" rel="noopener noreferrer" title="Equipment Operation Training Video">Equipment Operation Training Video</a>',
                        '<a href="https://www.cleanlink.com/cleanlinkminute/article/How-To-Operate-Cleaning-Equipment-Safely--20224" target="_blank" rel="noopener noreferrer" title="Cleaning Equipment Safety Guide">Cleaning Equipment Safety Guide</a>'
                    ]
                },
                {
                    title: 'Time Management',
                    status: 'not-started',
                    progress: 0,
                    skills: [
                        'Prioritizing tasks',
                        'Creating cleaning schedules',
                        'Efficient work practices',
                        'Goal setting',
                        'Time tracking'
                    ],
                    practiceMethods: [ //fix
                        'Practice prioritizing cleaning tasks based on urgency and importance. Create a daily or weekly cleaning schedule that outlines tasks and deadlines.',
                        'Learn how to create effective cleaning schedules that maximize efficiency. Practice organizing tasks by area or type of cleaning.',
                        'Identify and implement efficient work practices, such as using the right tools and techniques for each task. Practice streamlining your cleaning process.',
                        'Set specific, measurable goals for your cleaning tasks. Practice breaking down larger tasks into smaller, manageable steps.',
                        'Use time tracking tools or apps to monitor your cleaning progress. Practice reviewing and adjusting your schedule based on time spent on tasks.'
                    ],
                    resources: [ //fix
                        '<a href="https://www.youtube.com/watch?v=4b1k2g3f4g5&ab_channel=TimeManagementTraining" target="_blank" rel="noopener noreferrer" title="Time Management Training Video">Time Management Training Video</a>',
                        '<a href="https://www.mindtools.com/pages/article/newTMC_08.htm" target="_blank" rel="noopener noreferrer" title="Time Management Guide">Time Management Guide</a>'
                    ]
                },
                {
                    title: 'Quality Standards',
                    status: 'not-started',
                    progress: 0,
                    skills: [
                        'Quality inspection procedures',
                        'Standard operating procedures',
                        'Attention to detail',
                        'Quality control checklists',
                        'Feedback acceptance'
                    ],
                    practiceMethods: [ //fix
                        'Practice conducting quality inspections of cleaned areas. Use a checklist to ensure all tasks are completed to standard.',
                        'Familiarize yourself with standard operating procedures (SOPs) for cleaning tasks. Practice following these procedures consistently.',
                        'Develop attention to detail by reviewing your work for missed spots or areas that need improvement. Practice identifying and correcting mistakes.',
                        'Create quality control checklists for different cleaning tasks. Practice using these checklists to ensure all steps are completed.',
                        'Learn how to accept and implement feedback on your cleaning performance. Practice seeking feedback from supervisors or colleagues.'
                    ],
                    resources: [ //fix
                        '<a href="https://www.youtube.com/watch?v=4b1k2g3f4g5&ab_channel=QualityStandardsTraining" target="_blank" rel="noopener noreferrer" title="Quality Standards Training Video">Quality Standards Training Video</a>',
                        '<a href="https://www.iso.org/iso-9001-quality-management.html" target="_blank" rel="noopener noreferrer" title="ISO 9001 Quality Management Guide">ISO 9001 Quality Management Guide</a>'
                    ]
                }
            ],
            'data-entry': [
                {
                    title: 'Typing Skills & Speed',
                    status: 'not-started',
                    progress: 0,
                    skills: [
                        'Touch typing techniques',
                        'Typing speed improvement',
                        'Accuracy in typing',
                        'Keyboard shortcuts',
                        'Error correction'
                    ],
                    practiceMethods: [ //fix
                        'Practice touch typing using online typing tutors or software. Focus on proper finger placement and posture.',
                        'Set a goal to improve your typing speed by a certain number of words per minute (WPM) each week. Use typing tests to track your progress.',
                        'Work on accuracy by practicing typing exercises that focus on common words and phrases. Use spell check tools to identify and correct errors.',
                        'Learn and practice keyboard shortcuts for common tasks, such as copy, paste, and undo. Use these shortcuts to improve efficiency.',
                        'Practice error correction techniques, such as backspacing and retyping. Focus on correcting mistakes quickly without losing your place.'
                    ],
                    resources: [ //fix
                        '<a href="https://www.youtube.com/watch?v=4b1k2g3f4g5&ab_channel=TypingSkillsTraining" target="_blank" rel="noopener noreferrer" title="Typing Skills Training Video">Typing Skills Training Video</a>',
                        '<a href="https://www.typing.com/" target="_blank" rel="noopener noreferrer" title="Typing Practice Website">Typing Practice Website</a>'
                    ]
                },
                {
                    title: 'Data Entry Software Proficiency',
                    status: 'not-started',
                    progress: 0,
                    skills: [
                        'Familiarity with data entry software',
                        'Data validation techniques',
                        'Database management basics',
                        'Spreadsheet skills',
                        'Data import/export procedures'
                    ],
                    practiceMethods: [ //fix
                        'Familiarize yourself with common data entry software such as Microsoft Excel, Google Sheets, or specialized data entry applications. Practice using their features and functions.',
                        'Learn and practice data validation techniques to ensure accuracy and consistency in data entry. Use tools like drop-down lists and data validation rules.',
                        'Understand basic database management concepts, such as tables, records, and fields. Practice creating and managing simple databases.',
                        'Practice using spreadsheets for data entry tasks, including formulas, functions, and formatting. Focus on organizing and analyzing data effectively.',
                        'Learn how to import and export data between different software applications. Practice transferring data between spreadsheets and databases.'
                    ],
                    resources: [ //fix
                        '<a href="https://www.youtube.com/watch?v=4b1k2g3f4g5&ab_channel=DataEntrySoftwareTraining" target="_blank" rel="noopener noreferrer" title="Data Entry Software Training Video">Data Entry Software Training Video</a>',
                        '<a href="https://www.gcflearnfree.org/topics/excel/" target="_blank" rel="noopener noreferrer" title="Excel Training Website">Excel Training Website</a>'
                    ]
                },
                {
                    title: 'Data Accuracy & Validation',
                    status: 'not-started',
                    progress: 0,
                    skills: [
                        'Data verification techniques',
                        'Error checking procedures',
                        'Quality control methods',
                        'Attention to detail',
                        'Validation rules'
                    ],
                    practiceMethods: [ //fix
                        'Practice data verification techniques, such as cross-referencing data with source documents. Use tools like VLOOKUP or INDEX-MATCH in spreadsheets.',
                        'Learn and implement error checking procedures to identify and correct mistakes in data entry. Practice using spell check and grammar check tools.',
                        'Understand quality control methods for data entry, such as double-checking entries and using automated validation tools. Practice applying these methods consistently.',
                        'Develop attention to detail by reviewing your work for accuracy and completeness. Practice identifying and correcting errors in sample data sets.',
                        'Learn how to create and apply validation rules in spreadsheets or databases to ensure data integrity. Practice setting up rules for common data entry tasks.'
                    ],
                    resources: [ //fix
                        '<a href="https://www.youtube.com/watch?v=4b1k2g3f4g5&ab_channel=DataAccuracyTraining" target="_blank" rel="noopener noreferrer" title="Data Accuracy Training Video">Data Accuracy Training Video</a>',
                        '<a href="https://www.smartsheet.com/content/data-validation-excel" target="_blank" rel="noopener noreferrer" title="Data Validation Guide">Data Validation Guide</a>'
                    ]
                },
                {
                    title: 'Software Proficiency',
                    status: 'not-started',
                    progress: 0,
                    skills: [
                        'Microsoft Excel basics',
                        'Google Sheets operation',
                        'Database software',
                        'File Management',
                        'Software navigation'
                    ],
                    practiceMethods: [ //fix
                        'Learn the basics of Microsoft Excel, including creating spreadsheets, entering data, and using basic formulas. Practice formatting cells and organizing data effectively.',
                        'Familiarize yourself with Google Sheets and its features, such as collaboration tools and cloud storage. Practice sharing and editing spreadsheets with others.',
                        'Understand how to use database software for data entry tasks. Practice creating tables, entering records, and running queries.',
                        'Practice file management techniques, such as organizing files into folders, naming conventions, and version control. Focus on keeping your files organized and accessible.',
                        'Learn how to navigate different software applications efficiently. Practice using keyboard shortcuts and menus to improve your workflow.'
                    ],
                    resources: [ //fix
                        '<a href="https://www.youtube.com/watch?v=4b1k2g3f4g5&ab_channel=SoftwareProficiencyTraining" target="_blank" rel="noopener noreferrer" title="Software Proficiency Training Video">Software Proficiency Training Video</a>',
                        '<a href="https://www.gcflearnfree.org/topics/excel/" target="_blank" rel="noopener noreferrer" title="Excel Training Website">Excel Training Website</a>'
                    ]
                },
                {
                    title: 'Attention to Detail',
                    status: 'not-started',
                    progress: 0,
                    skills: [
                        'Identifying errors',
                        'Data consistency checks',
                        'Reviewing data entries',
                        'Spotting discrepancies',
                        'Quality assurance'
                    ],
                    practiceMethods: [ //fix
                        'Practice identifying errors in sample data sets. Focus on spotting typos, formatting issues, and inconsistencies.',
                        'Learn how to perform data consistency checks to ensure uniformity in data entry. Practice using tools like conditional formatting to highlight discrepancies.',
                        'Review your data entries regularly to catch mistakes early. Practice setting aside time for thorough reviews of your work.',
                        'Develop skills for spotting discrepancies in data, such as mismatched values or incorrect formats. Practice comparing data against source documents.',
                        'Implement quality assurance practices to maintain high standards in your data entry work. Practice following checklists and procedures consistently.'
                    ],
                    resources: [ //fix
                        '<a href="https://www.youtube.com/watch?v=4b1k2g3f4g5&ab_channel=AttentionToDetailTraining" target="_blank" rel="noopener noreferrer" title="Attention to Detail Training Video">Attention to Detail Training Video</a>',
                        '<a href="https://www.smartsheet.com/content/data-validation-excel" target="_blank" rel="noopener noreferrer" title="Data Validation Guide">Data Validation Guide</a>'
                    ]
                },
                {
                    title: 'Workplace Organization',
                    status: 'not-started',
                    progress: 0,
                    skills: [
                        'Organizing workspaces',
                        'Time management',
                        'Task prioritization',
                        'Workflow optimization',
                        'Documentation practices'
                    ],
                    practiceMethods: [ //fix
                        'Practice organizing your workspace to improve efficiency. Keep frequently used items within reach and declutter regularly.',
                        'Learn time management techniques to prioritize tasks effectively. Practice using tools like to-do lists or task management apps.',
                        'Develop skills for task prioritization by identifying urgent and important tasks. Practice using the Eisenhower Matrix or similar methods.',
                        'Optimize your workflow by identifying bottlenecks and streamlining processes. Practice analyzing your work habits and making adjustments as needed.',
                        'Implement good documentation practices, such as keeping records of completed tasks and maintaining clear communication with colleagues.'
                    ],
                    resources: [ //fix
                        '<a href="https://www.youtube.com/watch?v=4b1k2g3f4g5&ab_channel=WorkplaceOrganizationTraining" target="_blank" rel="noopener noreferrer" title="Workplace Organization Training Video">Workplace Organization Training Video</a>',
                        '<a href="https://www.mindtools.com/pages/article/newTMC_08.htm" target="_blank" rel="noopener noreferrer" title="Time Management Guide">Time Management Guide</a>'
                    ]
                }
            ]
        };

        this.trainingModules = modules;
        this.updateTrainingModulesUI();
    };

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

    startPracticeSession(jobType, moduleIndex) {
        const practiceScenarios = {
            'store-clerk': {
                0: {
                    scenarios: [
                        {
                            type: 'role-play',
                            title: 'Difficult Customer Scenario',
                            description: 'A customer is upset about a product that was out of stock.',
                            helperRole: 'Angry customer who is frustrated about a missing item',
                            userRole: 'Store clerk trying to help',
                            helperScript: [
                                "I can\'t believe you don\'t have this item in stock! I came all the way here for it.",
                                "This is unacceptable! I need it today, what are you going to do about it?",
                                "I demand a discount or some compensation for this inconvenience!"
                            ],
                            correctResponses: [
                                "I apologize for the inconvenience. Let me check if we can order it for you.",
                                "I understand your frustration. We can offer you a similar product or a discount on your next purchase.",
                                "Thank you for your patience. I will do my best to resolve this issue for you."
                            ]
                        },
                        {
                            type: 'quiz',
                            title: 'Customer Service Quiz',
                            questions: [
                                {
                                    question: 'What is the best way to handle an angry customer?',
                                    options: [
                                        'Ignore them and hope they go away',
                                        'Listen to their concerns and apologize sincerely',
                                        'Argue with them until they calm down',
                                        'Offer them a discount immediately'
                                    ],
                                    correct: 2
                                },
                                {
                                    question: 'How should you respond to a customer asking for a refund?',
                                    options: [
                                        'Tell them it\'s not possible',
                                        'Ask for their receipt and follow the store policy',
                                        'Ignore their request',
                                        'Offer them store credit instead'
                                    ],
                                    correct: 2
                                },
                                {
                                    question: 'What is the most important skill for a store clerk?',
                                    options: [
                                        'Knowledge of products',
                                        'Ability to handle cash',
                                        'Excellent communication and customer service skills',
                                        'Speed in processing transactions'
                                    ],
                                    correct: 3
                                }
                            ]
                        }
                    ]
                },
                1: {
                    scenarios: [
                        {
                            type: 'role-play',
                            title: 'Cash Transaction Practice',
                            description: 'Practice handling cash transactions with different amounts.',
                            helperRole: 'Customer making purchases',
                            userRole: 'Cashier handling transactions',
                            helperScript: [
                                "I would like to buy these items, here is $20.",
                                "Can I pay with a $50 bill for these items?",
                                "I have a coupon, can you apply it to my purchase?"
                            ],
                            correctResponses: [
                                "Thank you for your payment. Here is your change.",
                                "I can accept that amount, let me process your payment.",
                                "Sure, I will apply the coupon to your purchase."
                            ]
                        },
                        {
                            type: 'quiz',
                            title: 'Cash Handling Quiz',
                            questions: [
                                {
                                    question: 'What is the first step in handling a cash transaction?',
                                    options: [
                                        'Count the cash in the register',
                                        'Ask the customer for their payment method',
                                        'Process the transaction immediately',
                                        'Give change to the customer'
                                    ],
                                    correct: 2
                                },
                                {
                                    question: 'How should you handle a situation where a customer gives you a counterfeit bill?',
                                    options: [
                                        'Ignore it and continue with the transaction',
                                        'Politely inform the customer and refuse the bill',
                                        'Take the bill and report it later',
                                        'Give them change for it'
                                    ],
                                    correct: 2
                                },
                                {
                                    question: 'What is the best practice for counting change back to a customer?',
                                    options: [
                                        'Count it silently to yourself',
                                        'Count it out loud, starting with the largest denomination',
                                        'Hand them the change without counting',
                                        'Ask them to count it themselves'
                                    ],
                                    correct: 2
                                },
                                {
                                    question: "A customer gives you $50 for a $23.45 purchase. How much change do you give back?",
                                    options: [
                                        "$26.55", "$27.55", "$26.45", "$27.45"
                                    ],
                                    correct: 0
                                }
                            ]
                        }
                    ]
                }
            },
            'care-taker':{
                0: {
                    scenarios: [
                        {
                            type: 'role-play',
                            title: 'Safety Protocol Practice',
                            description: 'Practice following safety protocols in a cleaning enviorment.',
                            helperRole: 'Safety supervisor',
                            userRole: 'New cleaner',
                            helperScript: [
                                "What safety equipment should you wear when using cleaning chemicals?",
                                "What should you do if you spill a hazardous chemical?",
                                "How do you properly dispose of used cleaning materials?",
                                "How should you lift heavy objects safely?"
                            ],
                            correctResponses: [
                                "I should wear gloves, goggles, and a mask when handling chemicals.",
                                "I should immediately contain the spill, follow the safety procedures, and report it to my supervisor.",
                                "I should follow the disposal guidelines for hazardous materials and ensure they are disposed of safely.",
                                "I should bend my knees, keep my back straight, and lift with my legs to avoid injury."
                            ]
                        },
                        {
                            type: 'quiz',
                            title: 'Safety Quiz',
                            questions: [
                                {
                                    question: "What is the first step in handling a chemical spill?",
                                    options: [
                                        "Ignore it and continue working",
                                        "Contain the spill and follow safety procedures",
                                        "Report it to a supervisor immediately",
                                        "Clean it up with a cloth"
                                    ],
                                    correct: 2
                                },
                                {
                                    question: "What personal protective equipment (PPE) should you wear when handling chemicals?",
                                    options: [
                                        "Gloves and goggles",
                                        "Mask and apron",
                                        "Gloves, goggles, and mask",
                                        "No PPE is needed"
                                    ],
                                    correct: 3
                                },
                                {
                                    question: "How should you lift heavy objects safely?",
                                    options: [
                                        "Bend at the waist and lift with your back",
                                        "Keep your back straight and lift with your legs",
                                        "Use your arms to lift without bending your knees",
                                        "Ask someone else to lift it for you"
                                    ],
                                    correct: 2
                                },
                                {
                                    question: "What should you do if you see a wet floor?",
                                    options: [
                                        "Ignore it", "Place a wet floor sign", "Clean it immediately", "Walk around it"
                                    ],
                                    correct: 2
                                }
                            ]
                        }
                    ]
                }
            },
            'data-entry': {
                0: {
                    scenarios: [
                        {
                            type: 'typing-test',
                            title: 'Speed Typing Test',
                            description: 'Practice your typing speed and accuracy.',
                            text: "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet. Practice typing this sentence to improve you speed and accuracy.",
                            timeLimit: 60
                        },
                        {
                            type: 'quiz',
                            title: 'Data Entry Quiz',
                            questions: [
                                {
                                    questions: "Whats the most important aspect of data entry?",
                                    options: [
                                        "Speed",
                                        "Accuracy",
                                        "Attention to detail",
                                        "All of the above"
                                    ],
                                    correct: 3
                                },
                                {
                                    question: "What is the best way to ensure data accuracy?",
                                    options: [
                                        "Double-checking entries",
                                        "Using spell check",
                                        "Relying on memory",
                                        "Ignoring errors"
                                    ],
                                    correct: 1
                                },
                                {
                                    question: "How should you handle a data entry error?",
                                    options: [
                                        "Ignore it",
                                        "Correct it immediately",
                                        "Report it to a supervisor",
                                        "Leave it for someone else to fix"
                                    ],
                                    correct: 2
                                },
                                {
                                    question: "What is the purpose of data validation?",
                                    options: [
                                        "To ensure data is entered correctly",
                                        "To speed up data entry",
                                        "To make data look good",
                                        "To reduce the amount of data"
                                    ],
                                    correct: 1
                                }
                            ]
                        }
                    ]
                }
            }
        };

        const moduleScenarios = practiceScenarios[jobType]?.[moduleIndex];
        if(!moduleScenarios) {
            this.showNotification('Practice scenarios coming soon for this module', 'info');
            return;
        }

        this.showPracticeModal(moduleScenarios, jobType, moduleIndex);
    }

    showPracticeModal(scenarios, jobType, moduleIndex) {
        const modalContent = `
            <div class="practice-session-modal">
                <div class="practice-header">
                    <h2><i class="fas fa-robot"></i> Helper Practice Sessions</h2>
                    <p> Practice your skills with a Helper!</p>
                </div>

                <div class="scenario-list">
                   ${scenarios.scenarios.map((scenario, index) => `
                        <div class="scenario-card" onclick="lifeAssistant.startScenario(${index}, '${jobType}', ${moduleIndex})">
                            <div class="scenario-icon">
                                <i class="fas ${scenario.type === 'role-play' ? 'fa-comments' : scenario.type === 'quiz' ? 'fa-question-circle' : 'fa-keyboard'}"></i>
                            </div>
                            <div class="scenario-content">
                                <h3>${scenario.title}</h3>
                                <p>${scenario.description}</p>
                                <span class="scenario-type">${scenario.type.toUpperCase()}</span>
                            </div>
                            <i class="fas fa-chevron-right"></i>
                        </div>
                    `).join('')}
                </div>

                <div class="practice-footer">
                    <button class="btn btn-secondary" onclick="lifeAssistant.hidePracticeModal()">
                        <i class="fas fa-arrow-left"></i> Back to Module
                    </button>
                </div>
            </div>
        `;

        let modal = document.getElementById('practice-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'practice-modal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content practice-modal-content">
                    <span class="close" onclick="lifeAssistant.hidePracticeModal()">&times;</span>
                    <div id="practice-modal-body"></div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        modal.dataset.scenarios = JSON.stringify(scenarios);
        modal.dataset.jobType = jobType;
        modal.dataset.moduleIndex = moduleIndex;

        document.getElementById('practice-modal-body').innerHTML = modalContent;
        modal.style.display = 'block';
    }

    hidePracticeModal() {
        const modal = document.getElementById('practice-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    startScenario(scenarioIndex, jobType, moduleIndex) {
        const modal = document.getElementById('practice-modal');
        const scenarios =JSON.parse(modal.dataset.scenarios);
        const scenario = scenarios.scenarios[scenarioIndex];

        if (scenario.type === 'role-play') {
            this.startRoleplayScenario(scenario, scenarioIndex);
        } else if (scenario.type === 'quiz') {
            this.startQuizScenario(scenario, scenarioIndex);
        } else if (scenario.type === 'typing-test') {
            this.startTypingTest(scenario, scenarioIndex);
        }
    }

    startRoleplayScenario(scenario, scenarioIndex) {
        const modalContent = `
            <div class="roleplay-session">
                <div class="roleplay-header">
                    <h3>${scenario.title}</h3>
                    <p>${scenario.description}</p>
                </div>

                <div class="roleplay-info">
                    <div class="role-info">
                        <h4><i class="fas fa-robot"></i> Helper Role</h4>
                        <p>${scenario.helperRole}</p>
                    </div>
                    <div class="role-info">
                        <h4><i class="fas fa-user"></i> Your Role:</h4>
                        <p>${scenario.userRole}</p>
                    </div>
                </div>

                <div class="chat-container">
                    <div id="chat-messages" class="chat-messages">
                        <div class="message helper-message">
                            <div class="message-content">
                                <i class="fas fa-robot"></i>
                                <p>${this.getInitialHelperMessage(scenario)}</p>
                            </div>
                        </div>
                    </div>

                    <div class="chat-input">
                        <input type="text" id="user-input" placeholder="Type your response..." />
                        <button class="btn btn-primary" onclick="lifeAssistant.sendMessage(${scenarioIndex})">
                            <i class="fas fa-paper-plane"></i> send
                        </button>
                    </div>
                </div>

                <div class="roleplay-controls">
                    <button class="btn btn-secondary" onclick="lifeAssistant.resetRoleplay(${scenarioIndex})">
                        <i class="fas fa-redo"></i> Restart
                    </button>
                    <button class="btn btn-success" onclick="lifeAssistant.completeRoleplay(${scenarioIndex})">
                        <i class="fas fa-check"></i> Complete
                    </button>
                </div>
            </div>
        `;

        document.getElementById('practice-modal-body').innerHTML = modalContent;

        const modal = document.getElementById('practice-modal');
        modal.dataset.currentScenario = JSON.stringify(scenario);
        modal.dataset.scenarioIndex = scenarioIndex;
        modal.dataset.messageIndex = 0;

        setTimeout(() => {
            const input = document.getElementById('user-input');
            input.focus();

            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage(scenarioIndex);
                }
            });
        }, 100);
    }

    sendMessage(scenarioIndex) {
        const input = document.getElementById('user-input');
        const message = input.value.trim();
        if (!message) return;

        const modal = document.getElementById('practice-modal');
        const scenario = JSON.parse(modal.dataset.currentScenario);
        const messageIndex = parseInt(modal.dataset.messageIndex);

        const chatMessages = document.getElementById('chat-messages');
        chatMessages.innerHTML += `
            <div class="message user-message">
                <div class="message-content">
                    <p>${message}</p>
                    <i class="fas fa-user"></i>
                </div>
            </div>
        `;

        setTimeout(() => {
            const helperResponse = this.generateHelperResponse(message, scenario, messageIndex);
            chatMessages.innerHTML += `
                <div class="message helper-message">
                    <div class="message-content">
                        <i class="fas fa-robot"></i>
                        <p>${helperResponse}</p>
                    </div>
                </div>
            `;
            modal.dataset.messageIndex = messageIndex + 1;
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);

        input.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    generateHelperResponse(userMessage, scenario, messageIndex) {
        this.trackConversation(userMessage, scenario);
        const analysis = this.analyzeUserMessage(userMessage, scenario);
        return this.createContextualResponse(analysis, scenario, messageIndex);
    }

    trackConversation(userMessage, scenario) {
        this.helperMemory.conversationHistory.push({
            message: userMessage,
            timestamp: new Date().toISOString(),
            scenario: scenario.title,
            jobType: this.selectedJob
        });

        if(this.helperMemory.conversationHistory.length > 20) {
            this.helperMemory.conversationHistory.shift();
        }

        this.helperMemory.sessionStats.messagesSent++;

        if(userMessage.toLowerCase().includes('manager') || userMessage.toLowerCase().includes('supervisor')) {
            this.helperMemory.sessionStats.escalationCount++;
        } 
    }

    analyzeUserMessage(message, scenario) {
        const lowerMessage = message.toLowerCase();

        const positiveWords = ['sorry', 'apologize', 'understand', 'help', 'please', 'thank', 'appreciate', 'good', 'great', 'excellent'];
        const negativeWords = ['angry', 'frustrated', 'upset', 'mad', 'terrible', 'awful', 'bad', 'wrong', 'hate', 'disappointed'];
        const aggressiveWords = ['demand', 'insist', 'immediately', 'now', 'urgent', 'emergency', 'complain', 'sue', 'report'];


        let sentiment = 'neutral';
        let positiveScore = 0;
        let negativeScore = 0;
        let aggressiveScore = 0;

        positiveWords.forEach(word => {
            if (lowerMessage.includes(word)) positiveScore++;
        });

        negativeWords.forEach(word => {
            if (lowerMessage.includes(word)) negativeScore++;
        });

        aggressiveWords.forEach(word => {
            if (lowerMessage.includes(word)) aggressiveScore++;
        });

        if (positiveScore > negativeScore && positiveScore > aggressiveScore) {
            sentiment = 'positive' ;
        } else if (negativeScore > positiveScore) {
            sentiment = 'negative';
        }else if (aggressiveScore > 0) {
            sentiment = 'aggressive';
        }

        let contentType = 'general';
        if(lowerMessage.includes('manager') || lowerMessage.includes('supervisor')) {
            contentType = 'escalation';
        } else if (lowerMessage.includes('refund') || lowerMessage.includes('return') || lowerMessage.includes('money back')) {
          contentType = 'refund_request';  
        } else if (lowerMessage.includes('discount') || lowerMessage.includes('compensation') || lowerMessage.includes('free')) {
            contentType ='compensation_request';
        } else if (lowerMessage.includes('order') || lowerMessage.includes('ship') || lowerMessage.includes('delivery')) {
            contentType = 'order_request';
        } else if (lowerMessage.includes('apology') || lowerMessage.includes('sorry')) {
            contentType ='apology';
        }else if (lowerMessage.includes('help') || lowerMessage.includes('assist')) {
            contentType = 'help_request';
        }else if (lowerMessage.includes('safety') || lowerMessage.includes('equipment') || lowerMessage.includes('protective')) {
            contentType ='safety_request';
        }else if (lowerMessage.includes('chemical')||  lowerMessage.includes('clean') || lowerMessage.includes('spill')) {
            contentType = 'chemical_handling';
        }else if (lowerMessage.includes('data') || lowerMessage.includes('accuracy') || lowerMessage.includes('verify') || lowerMessage.includes('check')) {
            contentType = 'data_accuracy';
        }else if (lowerMessage.includes('type') || lowerMessage.includes('keyboard') || lowerMessage.includes ('speed') || lowerMessage.includes('wpm')) {
            contentType = 'typing_help';
        }

        return {
            sentiment,
            contentType,
            originalMessage: message,
            positiveScore,
            negativeScore,
            aggressiveScore,
        };
    }

    createContextualResponse(analysis, scenario, messageIndex) {
        const { sentiment, contentType, originalMessage } = analysis;

        const responseTemplates = {
            'store-clerk': {
                escalation: {
                    positive: [ //fix later
                        "I understand you'd like to speak with a manager. Let me get them for you right away.",
                        "I appreciate your patience. I'll have a manager assist you immediately.",
                        "Thank you for being understanding. Let me connect you with my supervisor."
                    ],
                    negative: [ //fix later
                        "I apologize for the inconvenience. Let me see how I can assist you further.",
                        "I understand your frustration. Please allow me to resolve this issue for you.",
                        "I’m sorry to hear that. Let me do my best to make it right."
                    ],
                    aggressive: [
                        "I understand you're upset. Let me get a manager to assist you.",
                        "I apologize for the inconvenience. A manager will be with you shortly.",
                        "I appreciate your feedback. Let me connect you with my supervisor."
                    ]
                },
                refund_request: {
                    positive: [
                        "I can help you with that. Please provide your receipt and I'll process the refund.",
                        "Thank you for bringing this to my attention. Let me assist you with the refund.",
                        "I appreciate your patience. Let's get that refund processed for you."
                    ],
                    negative: [
                        "I apologize for the inconvenience. Let me see how I can assist you with the refund.",
                        "I understand your frustration. Please allow me to resolve this issue for you.",
                        "I'm sorry to hear that. Let me do my best to make it right."
                    ],
                    aggressive: [
                        "I understand you're upset about the refund. Let me get a manager to assist you.",
                        "I apologize for the inconvenience. A manager will be with you shortly to handle the refund.",
                        "I appreciate your feedback. Let me connect you with my supervisor for the refund."
                    ]
                },
                compensation_request: {
                    positive: [
                        "I appreciate your understanding. Let me see how we can compensate you for this inconvenience.",
                        "Thank you for your patience. I will do my best to offer you a suitable compensation.",
                        "I understand your concern. Let's find a way to make this right for you."
                    ],
                    negative: [
                        "I apologize for the inconvenience. Let me see how I can assist you with compensation.",
                        "I understand your frustration. Please allow me to resolve this issue for you.",
                        "I'm sorry to hear that. Let me do my best to make it right."
                    ],
                    aggressive: [
                        "I understand you're upset about the compensation. Let me get a manager to assist you.",
                        "I apologize for the inconvenience. A manager will be with you shortly to handle the compensation.",
                        "I appreciate your feedback. Let me connect you with my supervisor for the compensation."
                    ]
                },
                order_request: {
                    positive: [
                        "I can help you with that. Please provide your order details and I'll check the status for you.",
                        "Thank you for bringing this to my attention. Let me assist you with your order request.",
                        "I appreciate your patience. Let's get that order issue resolved for you."
                    ],
                    negative: [
                        "I apologize for the inconvenience. Let me see how I can assist you with your order.",
                        "I understand your frustration. Please allow me to resolve this issue for you.",
                        "I'm sorry to hear that. Let me do my best to make it right."
                    ],
                    aggressive: [
                        "I understand you're upset about the order. Let me get a manager to assist you.",
                        "I apologize for the inconvenience. A manager will be with you shortly to handle the order request.",
                        "I appreciate your feedback. Let me connect you with my supervisor for the order issue."
                    ]
                },
                apology: {
                    positive: [
                        "I appreciate your understanding. I apologize for any inconvenience caused.",
                        "Thank you for your patience. I'm sorry for the trouble this has caused you.",
                        "I understand your concern. Please accept my sincere apologies for the issue."
                    ],
                    negative: [
                        "I apologize for the inconvenience. Let me see how I can assist you further.",
                        "I understand your frustration. Please allow me to resolve this issue for you.",
                        "I'm sorry to hear that. Let me do my best to make it right."
                    ],
                    aggressive: [
                        "I understand you're upset. Let me get a manager to assist you.",
                        "I apologize for the inconvenience. A manager will be with you shortly.",
                        "I appreciate your feedback. Let me connect you with my supervisor."
                    ]
                },
                help_request: {
                    positive: [
                        "I'm here to help you. Please let me know what you need assistance with.",
                        "Thank you for reaching out. How can I assist you today?",
                        "I appreciate your patience. I'm ready to help with any questions you have."
                    ],
                    negative: [
                        "I apologize for the inconvenience. Let me see how I can assist you further.",
                        "I understand your frustration. Please allow me to resolve this issue for you.",
                        "I'm sorry to hear that. Let me do my best to make it right."
                    ],
                    aggressive: [
                        "I understand you're upset. Let me get a manager to assist you.",
                        "I apologize for the inconvenience. A manager will be with you shortly.",
                        "I appreciate your feedback. Let me connect you with my supervisor."
                    ]
                }
            },
            'cleaner': {
                escalation: {
                    positive: [
                        "I understand you'd like to speak with a supervisor. Let me get them for you right away.",
                        "I appreciate your patience. I'll have a supervisor assist you immediately.",
                        "Thank you for being understanding. Let me connect you with my supervisor."
                    ],
                    negative: [
                        "I apologize for the inconvenience. Let me see how I can assist you further.",
                        "I understand your frustration. Please allow me to resolve this issue for you.",
                        "I’m sorry to hear that. Let me do my best to make it right."
                    ],
                    aggressive: [
                        "I understand you're upset. Let me get a supervisor to assist you.",
                        "I apologize for the inconvenience. A supervisor will be with you shortly.",
                        "I appreciate your feedback. Let me connect you with my supervisor."
                    ]
                },
                safety_concern: {
                    positive: [
                        "I appreciate your concern for safety. Please let me know what specific issue you're facing.",
                        "Thank you for bringing this to my attention. Safety is our top priority.",
                        "I understand your concern. Let's address this safety issue together."
                    ],
                    negative: [
                        "I apologize for the inconvenience. Let me see how I can assist you with the safety concern.",
                        "I understand your frustration. Please allow me to resolve this issue for you.",
                        "I'm sorry to hear that. Let me do my best to make it right."
                    ],
                    aggressive: [ //fix all responses later
                        "I understand you're upset about the safety issue. Let me get a supervisor to assist you.",
                        "I apologize for the inconvenience. A supervisor will be with you shortly to handle the safety concern.",
                        "I appreciate your feedback. Let me connect you with my supervisor for the safety issue."
                    ]
                },
                chemical_handling: {
                    positive: [ //fix later
                        "I appreciate your concern for safety. Please let me know what specific issue you're facing with the chemicals.",
                        "Thank you for bringing this to my attention. Safety is our top priority when handling chemicals.",
                        "I understand your concern. Let's address this chemical handling issue together."
                    ],
                    negative: [
                        "I apologize for the inconvenience. Let me see how I can assist you with the chemical handling concern.",
                        "I understand your frustration. Please allow me to resolve this issue for you.",
                        "I'm sorry to hear that. Let me do my best to make it right."
                    ],
                    aggressive: [
                        "I understand you're upset about the chemical handling issue. Let me get a supervisor to assist you.",
                        "I apologize for the inconvenience. A supervisor will be with you shortly to handle the chemical concern.",
                        "I appreciate your feedback. Let me connect you with my supervisor for the chemical handling issue."
                    ]
                }
            },
            'data-entry': {
                escalation: {
                    positive: [
                        "I understand you'd like to speak with a supervisor. Let me get them for you right away.",
                        "I appreciate your patience. I'll have a supervisor assist you immediately.",
                        "Thank you for being understanding. Let me connect you with my supervisor."
                    ],
                    negative: [
                        "I apologize for the inconvenience. Let me see how I can assist you further.",
                        "I understand your frustration. Please allow me to resolve this issue for you.",
                        "I’m sorry to hear that. Let me do my best to make it right."
                    ],
                    aggressive: [ //fix all later
                        "I understand you're upset. Let me get a supervisor to assist you.",
                        "I apologize for the inconvenience. A supervisor will be with you shortly.",
                        "I appreciate your feedback. Let me connect you with my supervisor."
                    ]
                },
                data_accuracy: {
                    positive: [
                        "I appreciate your attention to detail. Please let me know what specific data entry issue you're facing.",
                        "Thank you for bringing this to my attention. Accuracy is our top priority in data entry.",
                        "I understand your concern. Let's address this data accuracy issue together."
                    ],
                    negative: [
                        "I apologize for the inconvenience. Let me see how I can assist you with the data accuracy concern.",
                        "I understand your frustration. Please allow me to resolve this issue for you.",
                        "I'm sorry to hear that. Let me do my best to make it right."
                    ],
                    aggressive: [
                        "I understand you're upset about the data accuracy issue. Let me get a supervisor to assist you.",
                        "I apologize for the inconvenience. A supervisor will be with you shortly to handle the data accuracy concern.",
                        "I appreciate your feedback. Let me connect you with my supervisor for the data accuracy issue."
                    ]
                },
                typing_help: {
                    positive: [
                        "I appreciate your interest in improving your typing skills. Please let me know what specific help you need.",
                        "Thank you for reaching out. I'm here to assist you with any typing-related questions.",
                        "I understand your concern. Let's work together to enhance your typing speed and accuracy."
                    ],
                    negative: [
                        "I apologize for the inconvenience. Let me see how I can assist you with your typing concerns.",
                        "I understand your frustration. Please allow me to resolve this issue for you.",
                        "I'm sorry to hear that. Let me do my best to make it right."
                    ],
                    aggressive: [
                        "I understand you're upset about your typing skills. Let me get a supervisor to assist you.",
                        "I apologize for the inconvenience. A supervisor will be with you shortly to handle your typing concerns.",
                        "I appreciate your feedback. Let me connect you with my supervisor for typing assistance."
                    ]
                }
            }
        };

        const jobType = this.selectedJob || 'store-clerk';
        const templates = responseTemplates[jobType] || responseTemplates['store-clerk'];
        
        const category = templates[contentType] || templates.help_request;
        const sentimentResponses = category[sentiment] || category.positive;

        const randomIndex = Math.floor(Math.random() * sentimentResponses.length);
        let response = sentimentResponses[randomIndex];

        const tip = this.generatePersonalizedTip(analysis, scenario);
        if (tip) {
            response += ` ${tip}`;
        }

        return response;
    }

    getInitialHelperMessage(scenario) {
        const initialMessages = {
            'store-clerk': {
                'Difficult Customer Scenario': [
                    "I can't believe you don't have this item in stock! I drove all the way here for nothing!",
                    "This is ridiculous! I need this item today. What are you going to do about it?",
                    "I've been a loyal customer for years and this is how you treat me?"
                ],
                'Cash Transaction Practice': [
                    "Hi, I'd like to buy these items. The total is $23.45.",
                    "I'm paying with a $50 bill.",
                    "Actually, I have exact change. Here's $23.45."
                ]
            },
            'cleaner': {
                'Safety Protocol Practice': [
                    "What safety equipment should you wear when using cleaning chemicals?",
                    "What should you do if you spill a cleaning chemical?",
                    "How do you properly dispose of used cleaning materials?"
                ],
                'Chemical Handling Practice': [ //fix later
                    "I need to clean the bathroom. What chemicals should I use?",
                    "How do I mix the cleaning solution properly?",
                    "What should I do if I accidentally mix the wrong chemicals?"
                ]
            },
            'data-entry': {
                'Typing Speed Test': [
                    "Please type the following text as quickly and accurately as possible.",
                    "Ready to test your typing skills? Let's begin.",
                    "Focus on accuracy first, then speed."
                ],
                'Data Accuracy Practice': [
                    "I need you to enter this customer information into the system.",
                    "Please double-check all the data before submitting.",
                    "Accuracy is crucial in data entry work."
                ]
            }
        };

        const jobType = this.selectedJob || 'store-clerk';
        const jobMessages = initialMessages[jobType] || initialMessages['store-clerk'];
        const scenarioMessages = jobMessages[scenario.title] || jobMessages[Object.keys(jobMessages)[0]];

        const randomIndex = Math.floor(Math.random() * scenarioMessages.length);
        return scenarioMessages[randomIndex];
    }

    generatePersonalizedTip(analysis, scenario) {
        const { sentiment, contentType } = analysis;
        const jobType = this.selectedJob;
        const performance = this.helperMemory.userPerformance[jobType];
        const history = this.helperMemory.conversationHistory;

        if (Math.random() >0.3) return null;

        const tips = {
            'store-clerk': {
                escalation: [
                    "Tip: Try resolve issues yourself before escalating to a manager.",
                    "Tip: Show empathy and understanding before suggesting a manager.",
                    "Tip: Use positive language to de-escalate the situation."
                ],
                aggressive: [
                    "Tip: Stay calm and professional even when the customer is upset.",
                    "Tip: Use phrases like 'I understand' or 'I apologize' to show empathy.",
                    "Tip: Avoid arguing with the customer; focus on finding a solution."
                ],
                negative: [
                    "Tip: Acknowledge the customer's frustration and offer solutions.",
                    "Tip: Use positive language even in difficult situations.",
                    "Tip: Show that you care about their experience."
                ]
            },
            'cleaner': {
                safety_concern: [
                    "Tip: Always prioritise safety over speed.",
                    "Tip: When in doubt about safety, ask a supervisor.",
                    "Tip: Proper PPE is essential for your protection and others."
                ],
                chemical_handling: [
                    "Tip: Read all chemical labels carefully before use.",
                    "Tip: Never mix chemicals unless specifically instructed.",
                    "Tip: Always work in well-ventilated areas."
                ]
            },
            'data-entry': {
                'data_accuracy': [
                    "Tip: Double-check work before submitting.",
                    "Tip: Take your time - accuracy is more important than speed.",
                    "Tip: Use spell-check and validation tools when available."
                ],
                typing_help: [
                    "Tip: Practice typing regularly to improve speed and accuracy.",
                    "Tip: Take regular breaks to prevent fatigue.",
                    "Tip: Focus on accuracy first, speed will come with practice."
                ]
            }
        };

        const jobTips = tips[jobType] || tips['store-clerk'];
        const categoryTips = jobTips[contentType] || jobTips[sentiment] || [];

        if (categoryTips.length > 0) {
            const randomIndex = Math.floor(Math.random() * categoryTips.length);
            return categoryTips[randomIndex];
        }

        return null;
    }

    startQuizScenario(scenario, scenarioIndex) {
        const modalContent = `
            <div class="quiz-session">
                <div class="quiz-header">
                    <h3>${scenario.title}</h3>
                    <p>${scenario.description}</p>
                </div>

                <div id="quiz-container" class="quiz-container">
                    <div class="quiz-progress">
                        <span id="quiz-progress-text">Question 1 of ${scenario.questions.length}</span>
                        <div class="progress-bar">
                            <div class="progress-fill">
                                <div id="quiz-progress-fill" class="progress-fill" style="width: ${100/scenario.questions.length}%"></div>
                            </div>
                        </div>
                        
                        <div id="quiz-question" class="quiz-question">
                            <h4 id="question-text">${scenario.questions[0].question}</h4>
                            <div class="quiz-options">
                                ${scenario.questions[0].options.map((option, index) => `
                                    <button class="quiz-option" onclick="lifeAssistant.selectAnswer(${index}, ${scenarioIndex})">
                                    ${option}
                                </button>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <div class="quiz-controls">
                        <button class="btn btn-secondary" onclick="lifeAssistant.resetQuiz(${scenarioIndex})">
                            <i class="fas fa-redo"></i> Restart Quiz
                        </button>
                    </div>
                </div>
            `;

            document.getElementById('practice-modal-body').innerHTML = modalContent;
            
            const modal = document.getElementById('practice-modal');
            modal.dataset.currentQuiz = JSON.stringify(scenario);
            modal.dataset.quizIndex = scenarioIndex;
            modal.dataset.currentQuestion = 0;
            modal.dataset.correctAnswers = 0;
    }

    selectAnswer(selectedIndex, scenarioIndex) {
        const modal = document.getElementById('practice-modal');
        const quiz = JSON.parse(modal.dataset.currentQuiz);
        const currentQuestion = parseInt(modal.dataset.currentQuestion);
        const correctAnswers = parseInt(modal.dataset.correctAnswers);

        const question = quiz.questions[currentQuestion];
        const isCorrect = selectedIndex === question.correct;

        if (isCorrect) {
            modal.dataset.correctAnswers = correctAnswers + 1;
        }

        const options = document.querySelectorAll('.quiz-option');
        options.forEach((option, index) => {
            if (index === question.correct) {
                option.classList.add('correct');
            } else if (index === selectedIndex && !isCorrect) {
                option.classList.add('incorrect');
            }
            option.disabled = true;
        });

        setTimeout(() => {
            if (currentQuestion < quiz.questions.length - 1) {
                this.showNextQuestion(scenarioIndex);
            } else {
                this.showQuizResults(scenarioIndex);
            }
        }, 2000);
    }

    showNextQuestion(scenarioIndex) {
        const modal = document.getElementById('practice-modal');
        const quiz = JSON.parse(modal.dataset.currentQuiz);
        const currentQuestion = parseInt(modal.dataset.currentQuestion) + 1;

        modal.dataset.currentQuestion = currentQuestion;

        const question = quiz.questions[currentQuestion];
        const progressPercent = ((currentQuestion + 1) / quiz.questions.length) * 100;

        document.getElementById('quiz-progress-text').textContent = `Question ${currentQuestion + 1} of ${quiz.questions.length}`;
        document.getElementById('quiz-progress-fill').style.width = `${progressPercent}%`;
        document.getElementById('question-text').textContent = question.question;
        
        const optionsContainer = document.querySelector('.quiz-options');
        optionsContainer.innerHTML = question.options.map((option, index) => `
            <button class="quiz-option" onclick="lifeAssistant.selectAnswer(${index}, ${scenarioIndex})">
                ${option}
            </button>
        `).join('');
    }

    showQuizResults(scenarioIndex) {
        const modal = document.getElementById('practice-modal');
        const quiz = JSON.parse(modal.dataset.currentQuiz);
        const correctAnswers = parseInt(modal.dataset.correctAnswers);
        const totalQuestions = quiz.questions.length;
        const percentage = Math.round((correctAnswers / totalQuestions) * 100);

        const resultContent = `
            <div class="quiz-results">
                <div class="results-header">
                    <h3><i class="fas fa-trophy"></i> Quiz Complete!</h3>
                    <div class="score-display">
                        <div class="score-circle">
                            <span class="score-number">${percentage}%</span>
                            <span class="score-text">${correctAnswers}/${totalQuestions} Correct</span>
                        </div>
                    </div>
                </div> 

                <div class="results-feedback" id="quiz-feedback"></div>

                <div class="results-actions">
                    <button class="btn btn-secondary" onclick="lifeAssistant.resetQuiz(${scenarioIndex})">
                        <i class="fas fa-redo"></i> Try Again
                    </button>
                    <button class="btn btn-primary" onclick="lifeAssistant.completePractice()">
                        <i class="fas fa-check"></i> Complete Practice
                    </button>
                </div>
            </div>
        `;

        document.getElementById('quiz-container').innerHTML = resultContent;
        const feedback = percentage >= 80
            ? '<p class="excellent">Excellent work! You have a strong understanding of this topic.</p>'
            : (percentage >= 60
                ? '<p class="good">Good Job! You have a solid foundation, but there\'s room for improvement.</p>'
                : '<p class ="needs-improvement">Keep practicing! Review the material and try again.</p>');
        document.getElementById('quiz-feedback').innerHTML = feedback;
    }

    startTypingTest(scenario, scenarioIndex) {
        const modalContent = `
            <div class="typing-test-session">
                <div class="typing-header">
                    <h3>${scenario.title}</h3>
                    <p>${scenario.description}</p>
                </div>

                <div class="typing-stats">
                    <div class="stat">
                        <span class="stat-label">Time:</span>
                        <span id="typing-time" class="stat-value">${scenario.timeLimit}s</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">WPM:</span>
                        <span id="typing-wpm" class="stat-value">0</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Accuracy:</span>
                        <span id="typing-accuracy" class="stat-value">0%</span>
                    </div>
                </div>

                <div class="typing-area">
                    <div class="typing-text" id="typing-text">${scenario.text}</div>
                    <textarea id="typing-input" placeholder="Start typing here..." disabled></textarea>
                </div>

                <div class="typing-controls">
                    <button class="btn btn-primary" id="start-typing-btn" onclick="lifeAssistant.startTyping(${scenarioIndex})">
                        <i class="fas fa-play"></i> Start Test
                    </button>
                    <button class="btn btn-secondary" onclick="lifeAssistant.resetTyping(${scenarioIndex})">
                        <i class="fas fa-redo"></i> Reset
                    </button>
                </div>
            </div>
        `;

        document.getElementById('practice-modal-body').innerHTML = modalContent;

        const modal = document.getElementById('practice-modal');
        modal.dataset.currentTypingTest =JSON.stringify(scenario);
        modal.dataset.typingIndex = scenarioIndex;
    }

    startTyping(scenarioIndex) {
        const startBtn = document.getElementById('start-typing-btn');
        const input = document.getElementById('typing-input');

        startBtn.disabled = true;
        input.disabled = false;
        input.focus();

        const modal = document.getElementById('practice-modal');
        const test = JSON.parse(modal.dataset.currentTypingTest);
        let timeLeft = test.timeLimit;
        let startTime = Date.now();

        const timer = setInterval(() => {
            timeLeft--;
            document.getElementById('typing-time').textContent = `${timeLeft}s`;
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                this.finishTypingTest(startTime, test);
            }
        }, 1000)

        modal.dataset.typingTimer = timer;
        modal.dataset.typingStartTime = startTime;
    }

    finishTypingTest(startTime, test) {
        const input = document.getElementById('typing-input');
        const typedText = input.value;
        const originalText = test.text;

        const timeElapsed = (Date.now() - startTime) / 1000;
        const wordsTyped = typedText.trim().split(/\s+/).length;
        const wpm = Math.round((wordsTyped / timeElapsed) * 60);

        let correctChars = 0;
        const minLength = Math.min(typedText.length, originalText.length);
        for (let i = 0; i < minLength; i++) {
            if (typedText[i] === originalText[i]) {
                correctChars++;
            }
        }
        const accuracy = Math.round((correctChars / originalText.length) * 100);

        document.getElementById('typing-wpm').textContent = wpm;
        document.getElementById('typing-accuracy').textContent = `${accuracy}%`;

        input.disabled = true;

        setTimeout(() => {
            this.showTypingResults(wpm, accuracy);
        }, 1000);
    }

    showTypingResults(wpm, accuracy) {
        const resultsContent = `
            <div class="typing-results">
                <h3><i class="fas fa-keyboard"></i> Typing Test Complete!</h3>
                <div class="typing-score">
                    <div class="score-item">
                        <span class="score-label">Speed:</span>
                        <span class="score-value">${wpm} WPM</span>
                    </div>
                    <div class="score-item">
                        <span class="score-label">Accuracy:</span>
                        <span class="score-value">${accuracy}%</span>
                    </div>
                </div>
            
                <div class="typing-feedback">
                    ${wpm >= 40 && accuracy >= 95 ?
                        '<p class="excellent">Excellent typing skills! You\'re ready for data entry work.</p>' :
                        wpm >= 30 && accuracy >= 90 ?
                        '<p class="good">Good typing skills! Keep practicing to improve speed and accuracy.</p>' :
                        '<p class="needs-improvement">Keep practicing! Focus on accuracy first, then speed.</p>'
                    }
                </div>
            
                <button class="btn btn-primary" onclick="lifeAssistant.completePractice()">
                    <i class="fas fa-check"></i> Complete Practice
                </button>
            </div>
        `;
    
        document.querySelector('.typing-area').innerHTML = resultsContent;
    }

    completePractice() {
        this.showNotification('Practice session Completed! Great Job!', 'success');
        this.hidePracticeModal();

        const modal = document.getElementById('practice-modal');
        const jobType = modal.dataset.jobType;
        const moduleIndex = parseInt(modal.dataset.moduleIndex);

        setTimeout(() => {
            const modules = document.querySelectorAll('.module-card');
            const module = modules[moduleIndex];

            if (module) {
                const progressElement = module.querySelector('.progress-fill');
                const currentProgress = parseInt(progressElement.style.width) || 0;
                const newProgress = Math.min(100, currentProgress + 25);
                progressElement.style.width = `${newProgress}%`;

                if (newProgress >= 100) {
                    const statusElement = module.querySelector('.module-status');
                    statusElement.textContent = 'completed';
                    statusElement.className = 'module-status status-completed';

                    this.careerProgress[jobType] += 20;
                    this.updateCareerProgress();
                    this.checkCertification(jobType);    
                }
            }
        }, 1000);
    }

    resetRoleplay(sceanrioIndex) {
        this.startRoleplayScenario(JSON.parse(document.getElementById('practice-modal').dataset.currentScenario), scenarioIndex);
    }

    resetQuiz(scenarioIndex) {
        this.startQuizSceanrio(JSON.parse(document.getElementById('practice-modal').dataset.currentQuiz), scenrioindex);
    }

    resetTyping(scenarioIndex) {
        this.startTypingTests(JSON.parse(document.getElementById('practice-modal').dataset.currentTypingTest), scenairoIndex);
    }

    completeRoleplay(scenarioIndex) {
        this.analyseSessionPerformance();

        this.showNotification('Roleplay Session Completed! Well Done!', 'success');
        this.completePractice();
    }

    analyseSessionPerformance() {
        const stats = this.helperMemory.sessionStats;
        const jobType = this.selectedJob;
        const performance = this.helperMemory.userPerformance[jobType];

        const escalationRate = stats.messagesSent > 0 ? stats.escalationCount / stats.messagesSent : 0;
        const successRate = Math.max(0, 1 - escalationRate);

        performance.successRate = (performance.successRate + successRate) / 2;

        if (successRate > 0.8 && performance.difficulty === 'medium') {
            performance.difficulty = 'hard';
            this.showNotification('Helper: I\'m increasing the difficulty - you\'re doing great!', 'info');
        }else if (successRate < 0.3 && performance.difficulty === 'medium') {
            performance.difficulty = 'easy';
            this.showNotification('Helper: I\'m making this easier -  let\'s practice the basics!', 'info');
        }

        this.helperMemory.sessionStats = {
            messagesSent: 0,
            correctResponses: 0,
            escalationCount: 0,
        };

        console.log(`Session Analysis - job: ${jobType}, Success Rate ${(successRate * 100).toFixed(1)}%, Difficulty: ${performance.difficulty}`);
        
    }

    startModule(jobType, moduleIndex) {
        this.hideModuleModal();

        const modules = document.querySelectorAll('.module-card');
        const module = modules[moduleIndex];

        if (module) {
            const statusElement = module.querySelector('.module-status');
            const progressElement = module.querySelector('.progress-fill');

            statusElement.textContent = 'in progress';
            statusElement.className = 'module-status status-in-progress';
            progressElement.style.width = '50%';

            setTimeout(() => {
                statusElement.textContent = 'completed';
                statusElement.className = 'module-status status-completed';
                progressElement.style.width = '100%';

                this.careerProgress[jobType] += 20;
                this.updateCareerProgress();
                this.checkCertification(jobType);
            }, 3000);
        }
    }

    updateCareerProgress() {
        const totalProgress = Object.values(this.careerProgress).reduce((sum,progress) => sum + progress, 0);
        const averageProgress = totalProgress / Object.keys(this.careerProgress).length;

        document.getElementById('career-progress').style.width = `${averageProgress}%`;
        document.getElementById('progress-percentage').textContent = `${Math.round(averageProgress)}%`;

        Object.keys(this.careerProgress).forEach(job => {
            const jobCard = document.querySelector(`[data-job="${job}"]`);
            if (jobCard) {
                const progressFill = jobCard.querySelector('.progress-fill');
                const progressText = jobCard.querySelector('.job-progress span');

                progressFill.style.width = `${this.careerProgress[job]}%`;
                progressText.textContent = `${this.careerProgress[job]}% Complete`;
            }
        });

        this.saveData();
    }

    checkCertification(jobType) {
        if (this.careerProgress[jobType] >= 100 && !this.certifications.includes(jobType)) {
            this.certifications.push(jobType);
            this.updateCertificationsUI();
            this.showNotification(`Congratulations! You've earned your ${jobType.replace('-', ' ')} certification!`, 'success');
        }
    }

    updateCertificationsUI() {
        const container = document.getElementById('certifications-container');

        if(this.certifications.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #8f73aaff; font-style: italic;">Complete traning modules to earn certifications!</p>';
            return;
        }

        container.innerHTML = this.certifications.map(cert => `
            <div class="certification-card">
                <i class="fas fa-certificate certification-icon"></i>
                <div class="certification-content">
                    <h4>${cert.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}Certification</h4>
                    <p>Successfully completed all training modules</p>
                </div>
            </div>
        `).join('');
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
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#96c5a2ff' : type === 'error' ? '#e97782ff' : '#9fadecff'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);


        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return date.toLocaleDateString();
    }

    updateUI() {
        this.updateTasksUI();
        this.updateEnergyUI();
        this.updateEmotionUI();
        this.updateCareerProgress();
        this.updateCertificationsUI();
    } 
}

const lifeAssistant = new LifeAssistant();
const style = document.createElement('style');
style.textContent = `
    .task-title.completed {
        text-decoration: line-through;
        color: #6f54adff;
    }
        
    .notification {
        font-family: 'Inter', sans-serif;
        font-weight: 500;
    }
`;
document.head.appendChild(style);