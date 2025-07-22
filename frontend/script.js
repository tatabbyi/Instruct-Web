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
        this.setUpEventListeners();
        this.updateUI();
        this.loadTrainingModules();
        this.loadCopingStrategies();
    }
}