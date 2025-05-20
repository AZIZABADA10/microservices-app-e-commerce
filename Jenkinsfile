pipeline {
    agent any                             // utilise l’agent Jenkins par défaut

    /* ==== OUTILS ==== */
    tools {
        // ↳ Nom EXACT saisi dans Manage Jenkins ▸ Global Tool Configuration
        nodejs        'Node18'           // NodeJS 18.x (ou le nom que tu as choisi)
        sonarRunner   'SonarScanner'     // CLI Sonar Scanner installée dans Jenkins
    }

    /* ==== VARIABLES GLOBALES ==== */
    environment {
        // ↳ Nom EXACT du serveur SonarQube déclaré dans Manage Jenkins ▸ Configure System
        SONAR_SERVER = 'SonarQube'
    }

    /* ==== PIPELINE ==== */
    stages {

        stage('Checkout') {
            steps {
                git url: 'https://github.com/AZIZABADA10/microservices-app-e-commerce.git',
                    branch: 'main'
            }
        }

        stage('Install & Build') {
            steps {
                script {
                    /* Liste des services – ajoute/enlève au besoin */
                    def services = [
                        'auth-service',
                        'order-service',
                        'product-service',
                        'frontend'
                    ]

                    services.each { svc ->
                        dir(svc) {
                            sh 'npm ci'                // installe les dépendances
                            if (svc == 'frontend') {   // build React uniquement
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
                    def services = [
                        'auth-service',
                        'order-service',
                        'product-service',
                        'frontend'
                    ]

                    services.each { svc ->
                        dir(svc) {
                            withSonarQubeEnv("${SONAR_SERVER}") {
                                sh """
                                    ${SONAR_SCANNER_HOME}/bin/sonar-scanner \\
                                      -Dsonar.projectKey=${svc} \\
                                      -Dsonar.projectName=${svc} \\
                                      -Dsonar.sources=. \\
                                      -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info || true
                                """
                            }
                        }
                    }
                }
            }
        }
    }

    /* ==== POST BUILD ==== */
    post {
        success { echo '✅ Pipeline terminé avec succès' }
        failure { echo '❌ Le pipeline a échoué' }
    }
}
