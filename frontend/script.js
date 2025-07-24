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

    setupEventListeners() {
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.closest('.nav-tab').dataset.tab);
            });
        });

        document.getElementById('add-task-btn').addEventListener('click', () => {
            this.showModal('task-modal');
        });

        document.getElementById('task-form').addEventListener('sumbit', (e) => {
            e.preventDefault();
            this.addTask();
        });

        document.querySelectorAll('.template-card').forEach(card => {
            card.addEventListener('click', () => {
                this.addTaskFromTemplate(card.dataset.template);
            });
        });

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

        document.getElementById('log-emotion-btn').addEventListener('click', () => {
            this.showmodal('emotional-modal');
        });

        document.getElementById.getElementById('emotion-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.LogEmotion();
        });

        document.querySelectorAll('.emotion-card').forEach(card => {
            card.addEventListener('click', () => {
                this.selectEmotion(card);
            });
        });

        document.getElementById('symptom-intesity').addEventListener('input', (e) => {
            document.getElementById('intensity-display')..textContent = e.target.value;
        });

        document.getElementById('log-symptom').addEventListener('click', () => {
            this.logSymptom();
        });


    }

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
}

const lifeAssistant = new LifeAssistant();


