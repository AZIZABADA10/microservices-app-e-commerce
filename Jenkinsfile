pipeline {
    agent any

    tools {
        maven 'Maven3' // remplace par le nom exact que tu as configuré dans Jenkins
    }

    environment {
        SONAR_SCANNER_HOME = tool 'SonarScanner' // optionnel si tu veux accéder à $SONAR_SCANNER_HOME
    }

    stages {
        stage('Build') {
            steps {
                sh 'mvn clean install'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh 'mvn sonar:sonar'
                }
            }
        }
    }
}
