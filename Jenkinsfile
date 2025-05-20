pipeline {
    agent any

    environment {
        SONARQUBE_SERVER = 'SonarQube' // Nom du serveur SonarQube dans Jenkins
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
                            // Utilise NodeJS s'il est installé sur le système Jenkins
                            sh 'npm install'
                            if (svc == 'frontend') {
                                sh 'npm run build'
                            }
                        }
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    def services = ['auth-service', 'order-service', 'product-service', 'frontend']
                    services.each { svc ->
                        dir(svc) {
                            withSonarQubeEnv("${SONARQUBE_SERVER}") {
                                sh '''
                                    if [ -f "sonar-project.properties" ]; then
                                      sonar-scanner
                                    else
                                      sonar-scanner \
                                        -Dsonar.projectKey=''' + svc + ''' \
                                        -Dsonar.projectName=''' + svc + ''' \
                                        -Dsonar.sources=. \
                                        -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info || true
                                    fi
                                '''
                            }
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            echo '✅ Analyse Sonar réussie'
        }
        failure {
            echo '❌ Échec de la pipeline'
        }
    }
}
