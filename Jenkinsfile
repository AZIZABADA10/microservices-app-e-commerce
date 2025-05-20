pipeline {
    agent any

    tools {
        nodejs 'Node18'  // Nom dans Jenkins Global Tool Configuration
    }

    environment {
        SONARQUBE_SERVER = 'SonarQube'  // Nom du serveur SonarQube configuré dans Jenkins
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/AZIZABADA10/microservices-app-e-commerce.git', branch: 'main'
            }
        }

        stage('Install & Build') {
            steps {
                script {
                    def services = ['auth-service', 'order-service', 'product-service', 'frontend']
                    services.each { svc ->
                        dir(svc) {
                            echo "📦 Installation des dépendances pour ${svc}"
                            sh 'npm install'

                            if (svc == 'frontend') {
                                echo "⚙️ Build du frontend"
                                sh 'npm run build'
                                echo "🧪 Génération du rapport de couverture frontend"
                                sh 'npm run test -- --coverage' // Ajuste selon ta config
                            }
                        }
                    }
                }
            }
        }

        stage('Analyse SonarQube') {
            steps {
                echo "🔍 Analyse SonarQube globale du projet"
                withSonarQubeEnv("${SONARQUBE_SERVER}") {
                    sh 'sonar-scanner'
                }
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline réussie !'
        }
        failure {
            echo '❌ La pipeline a échoué !'
        }
    }
}
