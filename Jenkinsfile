pipeline {
    agent any

    tools {
        nodejs 'Node18' // Assure-toi d’avoir ce nom dans "Global Tool Configuration"
    }

    environment {
        SONARQUBE_SERVER = 'SonarQube' // Nom du serveur Sonar dans Jenkins
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
                            }
                        }
                    }
                }
            }
        }

        stage('Analyse SonarQube') {
            steps {
                script {
                    def services = ['auth-service', 'order-service', 'product-service', 'frontend']
                    services.each { svc ->
                        dir(svc) {
                            echo "🔍 Analyse SonarQube pour ${svc}"
                            withSonarQubeEnv("${SONARQUBE_SERVER}") {
                                sh """
                                    sonar-scanner \
                                      -Dsonar.projectKey=${svc} \
                                      -Dsonar.projectName=${svc} \
                                      -Dsonar.sources=. \
                                      -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info || true
                                """
                            }
                        }
                    }
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
