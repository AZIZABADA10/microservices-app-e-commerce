pipeline {
    agent {
        docker {
            image 'node:18'   // Image officielle Node.js avec npm
            args '-v /var/jenkins_home/.npm:/root/.npm' // (optionnel, cache npm)
        }
    }

    tools {
        sonarQube 'SonarScanner' 
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/AZIZABADA10/microservices-app-e-commerce.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh 'sonar-scanner'
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 1, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
    }
}
