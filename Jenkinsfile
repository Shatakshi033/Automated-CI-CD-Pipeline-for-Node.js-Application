
pipeline {

    agent any

    options {
        timestamps()
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
                echo 'Code downloaded from GitHub'
            }
        }

        stage('Verify Environment') {
            steps {
                bat 'node --version'
                bat 'npm --version'
                bat 'docker --version'
                bat 'docker info'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Build Application') {
            steps {
                bat 'npm run build --if-present'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t nodejs-task-manager:%BUILD_NUMBER% -t nodejs-task-manager:latest .'
            }
        }

        stage('Stop Old Container') {
            steps {
                bat '''
                powershell -NoProfile -Command "$id = docker ps -aq --filter name=task-manager-container; if ($id) { docker rm -f task-manager-container; if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE } }"
                '''
            }
        }

        stage('Deploy Container') {
            steps {
                bat 'docker run -d --restart unless-stopped -p 3000:3000 --name task-manager-container nodejs-task-manager:latest'
            }
        }

        stage('Verify Deployment') {
            steps {
                bat '''
                powershell -NoProfile -Command "Start-Sleep -Seconds 5; try { $r = Invoke-WebRequest http://localhost:3001/health -UseBasicParsing; if ($r.StatusCode -ne 200) { exit 1 }; Write-Output 'Application health check successful' } catch { Write-Output $_; exit 1 }"
                '''
            }
        }
    }

    post {
        success {
            echo 'CI/CD Pipeline completed successfully!'
        }

        failure {
            echo 'CI/CD Pipeline failed. Check Console Output.'
        }
    }
}
