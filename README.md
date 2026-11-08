# Node.js Task Manager --- DevOps CI/CD Project

A hands-on DevOps project that takes a Node.js application from source
code to a containerized deployment using **Git, GitHub, Docker, and
Jenkins**.

The goal is to build an understandable, repeatable CI/CD workflow and
document each stage of the implementation.

> **Project status note:** This README separates work that has been
> demonstrated in the project walkthrough from work that is planned or
> still needs verification. A stage should be marked complete only after
> its practical verification succeeds.

------------------------------------------------------------------------

## Table of contents

-   [1. Project overview](#1-project-overview)
-   [2. Project objectives](#2-project-objectives)
-   [3. Technology stack](#3-technology-stack)
-   [4. CI/CD workflow](#4-cicd-workflow)
-   [5. Project structure](#5-project-structure)
-   [6. Implementation stages](#6-implementation-stages)
-   [7. Run the application locally](#7-run-the-application-locally)
-   [8. Docker instructions](#8-docker-instructions)
-   [9. Jenkins setup and pipeline](#9-jenkins-setup-and-pipeline)
-   [10. Useful commands](#10-useful-commands)
-   [11. Troubleshooting notes](#11-troubleshooting-notes)
-   [12. Current project status](#12-current-project-status)
-   [13. Learning outcomes](#13-learning-outcomes)
-   [14. Future improvements](#14-future-improvements)

------------------------------------------------------------------------

## 1. Project overview

This project uses a Node.js application built with Express. The
application source code and Docker configuration are stored in GitHub.
Jenkins is used to retrieve the repository and execute build steps.

The project is being developed in stages:

1.  Develop the Node.js application.
2.  Create and verify the application APIs and frontend.
3.  Track the source code with Git.
4.  Host the repository on GitHub.
5.  Containerize the application with Docker.
6.  Push Docker configuration to GitHub.
7.  Connect Jenkins with the GitHub repository.
8.  Create a Jenkinsfile to define the pipeline as code.
9.  Build and deploy the Docker container through Jenkins.
10. Configure a GitHub Webhook to trigger Jenkins automatically after a
    push.

**Main objective:** Move from manually running application and build
commands to a repeatable CI/CD process.

## 2. Project objectives

-   Develop and run a Node.js application.
-   Understand Git repositories, commits, branches, and remote
    repositories.
-   Store and version the project on GitHub.
-   Understand Dockerfiles, images, containers, and port mapping.
-   Configure Jenkins to check out source code from GitHub.
-   Use a Jenkinsfile to define pipeline stages as code.
-   Automate dependency installation, image creation, and deployment.
-   Learn how GitHub Webhooks can trigger a Jenkins pipeline.

## 3. Technology stack

  Technology              Purpose in this project
  ----------------------- -------------------------------------------
  Node.js                 JavaScript runtime for the application
  Express.js              Node.js web application framework
  HTML, CSS, JavaScript   Frontend files
  Git                     Source-code version control
  GitHub                  Remote source-code repository
  Docker                  Application containerization
  Jenkins                 Build and deployment automation
  Windows 11              Local development and Jenkins environment
  CMD / PowerShell        Windows command-line operations

The project walkthrough uses Windows paths and Windows batch commands
because Jenkins is running on Windows. Docker Desktop is intended to
provide the Docker Engine.

## 4. CI/CD workflow

The intended end-to-end workflow is:

``` text
Developer changes application code
              |
              v
       Commit and push
              |
              v
           GitHub
              |
      Webhook notification
              |
              v
           Jenkins
              |
              v
       Checkout source code
              |
              v
      Verify Node.js and npm
              |
              v
      Install dependencies
              |
              v
       Build / validate app
              |
              v
       Build Docker image
              |
              v
      Replace old container
              |
              v
       Start new container
              |
              v
       Verify application
```

The webhook and fully automated Docker deployment are target stages.
They should not be considered operational until the webhook delivery and
Jenkins deployment have both been tested successfully.

## 5. Project structure

The repository has included the following application and Docker files:

``` text
nodejs-devops-project/
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── app.js
├── package.json
├── package-lock.json
├── .gitignore
├── .dockerignore
├── Dockerfile
└── Jenkinsfile                 # Add and verify in Stage 8
```

### Important files

  -----------------------------------------------------------------------
  File                                Responsibility
  ----------------------------------- -----------------------------------
  `app.js`                            Starts the Express application and
                                      defines application routes

  `public/`                           Contains frontend assets

  `package.json`                      Project metadata, dependencies, and
                                      npm scripts

  `package-lock.json`                 Locks dependency versions for
                                      repeatable installs

  `.gitignore`                        Excludes selected files from Git

  `.dockerignore`                     Excludes unnecessary files from the
                                      Docker build context

  `Dockerfile`                        Instructions for building the
                                      application image

  `Jenkinsfile`                       Pipeline-as-code instructions for
                                      Jenkins
  -----------------------------------------------------------------------

## 6. Implementation stages

### Stage 1 --- Create the Node.js application

**Purpose:** Create the application that will be used throughout the
DevOps workflow.

Work covered: - Set up the Node.js project. - Create the Express
application. - Prepare the application files. - Define the npm project
configuration.

Key files: `app.js`, `package.json`, `package-lock.json`.

**Verification:** The application should start locally using the
configured npm start script.

### Stage 2 --- Create Express APIs

**Purpose:** Add backend routes and application functionality.

Work covered: - Use Express to handle HTTP requests. - Define the
application's API routes. - Keep the backend entry point in `app.js`.

**Verification:** Open the application or call its API routes and
confirm that the expected responses are returned.

### Stage 3 --- Create the frontend

**Purpose:** Provide a browser-based interface for the application.

Frontend directory:

``` text
public/
├── index.html
├── style.css
└── script.js
```

Work covered: - Create the HTML page. - Add styling with CSS. - Add
browser-side functionality with JavaScript. - Connect the frontend to
the application as implemented.

### Stage 4 --- Initialize Git

**Purpose:** Track project changes using version control.

Typical commands:

``` cmd
git init
git status
git add .
git commit -m "Initial Node.js application"
```

Concepts practised: - Working directory - Staging area - Commit -
Repository history

### Stage 5 --- Create the Docker configuration

**Purpose:** Package the application so it can run in a Docker
container.

The project Dockerfile uses a Node.js base image and installs
dependencies inside the image.

Example Dockerfile:

``` dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

Example `.dockerignore`:

``` text
node_modules
.git
.gitignore
.env
.env.*
coverage
npm-debug.log
README.md
```

Important concepts:

-   **Dockerfile:** Instructions used to build an image.
-   **Image:** Packaged application and its runtime requirements.
-   **Container:** A running instance of an image.
-   **Port mapping:** Makes a container port reachable through a host
    port.

The Dockerfile documents port `3000`; the Node.js application must also
listen on the appropriate container interface and port.

### Stage 6 --- Push Docker configuration to GitHub

**Purpose:** Store the Docker configuration with the application source
code.

Commands used:

``` cmd
git status
git add Dockerfile .dockerignore
git commit -m "Add Docker configuration for containerization"
git push origin main
```

The Docker configuration was included in the GitHub checkout shown in
the Jenkins build output.

### Stage 7 --- Integrate Jenkins with GitHub

**Purpose:** Configure Jenkins to retrieve the application source code
from GitHub.

Work covered: - Open the Jenkins dashboard. - Create a Freestyle job
named `nodejs-github-integration`. - Configure Git as the source-code
management system. - Enter the GitHub repository URL. - Select the
`main` branch. - Run a build and inspect Console Output.

**Verified result:** Jenkins checked out the GitHub commit and listed
the project files in its workspace. The Windows batch build step
finished with:

``` text
Finished: SUCCESS
```

The Jenkins workspace shown in the build output was:

``` text
C:\ProgramData\Jenkins\.jenkins\workspace\nodejs-github-integration
```

**Troubleshooting learned:** The `Execute shell` build step failed
because Windows could not find the Linux `sh` executable. Replacing it
with **Execute Windows batch command** resolved that specific
command-interpreter issue.

### Stage 8 --- Create a Jenkinsfile (Pipeline as Code)

**Purpose:** Define the pipeline in a version-controlled file instead of
relying only on Freestyle job configuration.

The intended Jenkins job configuration is:

  Setting       Value
  ------------- --------------------------
  Job type      Pipeline
  Definition    Pipeline script from SCM
  SCM           Git
  Branch        `*/main`
  Script Path   `Jenkinsfile`

The pipeline is designed to use Windows `bat` steps because Jenkins is
running on Windows.

Example starter Jenkinsfile:

``` groovy
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
    }

    post {
        success {
            echo 'CI Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check Console Output.'
        }
    }
}
```

**Important project note:** The current `package.json` scripts reported
during the walkthrough are:

``` json
{
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node app.js"
  }
}
```

There is no real test script yet. Running `npm test` will fail
intentionally with the current placeholder. There is also no separate
build script; `npm run build --if-present` therefore does not perform a
build unless one is added later.

Mark Stage 8 complete only after the `Jenkinsfile` is committed to
GitHub, the Pipeline job reads it from SCM, and a Pipeline build
succeeds.

### Stage 9 --- Automate Docker build and deployment

**Purpose:** Extend the Jenkins pipeline so that it builds a Docker
image and runs the application container.

Intended pipeline stages:

1.  Checkout source code.
2.  Verify Node.js, npm, and Docker.
3.  Install dependencies.
4.  Build or validate the application.
5.  Build a Docker image.
6.  Stop and remove the previous application container.
7.  Start the new container.
8.  Verify the application's health endpoint.

Example Docker commands:

``` cmd
docker build -t nodejs-task-manager:latest .
docker images
docker ps
docker logs task-manager-container
```

Example container deployment:

``` cmd
docker run -d --restart unless-stopped -p 3000:3000 --name task-manager-container nodejs-task-manager:latest
```

The intended application URLs are:

``` text
http://localhost:3000
http://localhost:3000/health
```

**Verification required:** - Docker Engine is running. - Jenkins can
access the Docker Engine under its service account. - The image is
created successfully. - The container starts and remains running. - The
application health endpoint returns the expected successful response.

**Known prerequisite:** A previous Docker build attempt returned a
connection error for the Docker Desktop Linux Engine named pipe. This
must be resolved before claiming that Jenkins-based Docker deployment
works.

### Stage 10 --- Configure GitHub Webhook automation

**Purpose:** Trigger Jenkins when new code is pushed to GitHub, without
manually selecting Build Now.

Planned work: - Verify the Jenkins GitHub integration plugin. - Enable
**GitHub hook trigger for GITScm polling** in the Jenkins job. - Make
the local Jenkins server reachable through a secure HTTPS tunnel or
another suitable network configuration. - Add a GitHub repository
webhook. - Configure the webhook to send push events. - Push a test
commit. - Verify successful webhook delivery and an automatically
triggered Jenkins build.

For a local Jenkins installation, GitHub cannot directly reach
`localhost`. A secure tunnel or reachable server endpoint is required.

Example webhook endpoint format:

``` text
https://YOUR-REACHABLE-JENKINS-DOMAIN/github-webhook/
```

Do not publish authentication tokens, webhook secrets, or other
credentials in this repository.

**Verification required:** GitHub reports successful webhook delivery
and Jenkins starts the intended pipeline automatically after a push.

------------------------------------------------------------------------

## 7. Run the application locally

### Prerequisites

Install: - Node.js and npm - Git - A code editor such as Visual Studio
Code

### Clone the repository

Replace the placeholder with the actual repository URL:

``` cmd
git clone YOUR_GITHUB_REPOSITORY_URL
cd YOUR_PROJECT_DIRECTORY
```

### Install dependencies

``` cmd
npm ci
```

### Start the application

``` cmd
npm start
```

Open the application:

``` text
http://localhost:3000
```

If the application defines the health endpoint, test:

``` text
http://localhost:3000/health
```

Expected health response, as specified in the project walkthrough:

``` json
{
  "status": "UP",
  "message": "Application is running successfully!"
}
```

------------------------------------------------------------------------

## 8. Docker instructions

Run these commands from the directory containing the Dockerfile.

### Check Docker

``` cmd
docker --version
docker info
```

### Build an image

``` cmd
docker build -t nodejs-task-manager:v1 .
```

### List images

``` cmd
docker images
```

### Run a container

``` cmd
docker run -d -p 3000:3000 --name task-manager-container nodejs-task-manager:v1
```

### Check running containers

``` cmd
docker ps
```

### View logs

``` cmd
docker logs task-manager-container
```

### Stop and remove a container

``` cmd
docker stop task-manager-container
docker rm task-manager-container
```

If port `3000` is already in use, stop the process or container using it
before starting another deployment on that port.

------------------------------------------------------------------------

## 9. Jenkins setup and pipeline

### Jenkins job used for GitHub checkout

``` text
nodejs-github-integration
```

This Freestyle job was used to verify that Jenkins could: - Connect to
the GitHub repository. - Check out the selected branch. - Download the
project files. - Execute a Windows batch build step.

### Jenkins Pipeline job planned for Pipeline as Code

``` text
nodejs-task-manager-pipeline
```

Configure the job to retrieve the `Jenkinsfile` from the GitHub
repository:

``` text
Definition: Pipeline script from SCM
SCM: Git
Branch: */main
Script Path: Jenkinsfile
```

### Windows-specific commands

Use Windows batch steps in Jenkins:

``` groovy
bat 'node --version'
bat 'npm --version'
bat 'npm ci'
```

Do not use Linux shell commands such as `sh 'npm ci'` in a Windows job
unless a compatible shell has deliberately been installed and
configured.

### Credentials and security

-   Use Jenkins Credentials for private repository access and deployment
    credentials.
-   Never hardcode passwords, personal access tokens, or webhook secrets
    in a Jenkinsfile.
-   Do not commit `.env` files or secrets to GitHub.
-   Keep Jenkins authentication enabled when exposing it through a
    network tunnel.

------------------------------------------------------------------------

## 10. Useful commands

### Git

``` cmd
git status
git add .
git commit -m "Describe your changes"
git push origin main
git pull origin main
git log --oneline -5
git remote -v
```

### Node.js and npm

``` cmd
node --version
npm --version
npm ci
npm start
npm test
```

`npm test` currently runs a placeholder that exits with an error. Add a
genuine test suite before using it as a required CI stage.

### Docker

``` cmd
docker --version
docker info
docker ps
docker ps -a
docker images
docker build -t nodejs-task-manager:v1 .
docker logs task-manager-container
docker stop task-manager-container
docker start task-manager-container
docker restart task-manager-container
```

### Jenkins service on Windows

Depending on the Jenkins installation:

``` cmd
sc query Jenkins
```

Run service-management commands from an appropriately privileged
terminal.

------------------------------------------------------------------------

## 11. Troubleshooting notes

### Issue 1 --- Docker cannot connect to Docker Engine

Example error:

``` text
failed to connect to the docker API
The system cannot find the file specified.
```

Possible checks: 1. Open Docker Desktop. 2. Wait for the engine to
start. 3. Check `docker version`. 4. Check `docker info`. 5. Check
`docker ps`. 6. Confirm that Jenkins can access Docker using the Jenkins
service account.

Do not assume that Docker working in a personal CMD session means it
will work from Jenkins.

### Issue 2 --- Jenkins cannot find `sh`

Example error:

``` text
Cannot run program "sh"
CreateProcess error=2
```

Cause: The Jenkins job used a Linux shell step on Windows.

Resolution: Use **Execute Windows batch command** for the Windows
Freestyle job, or use `bat` steps in a Declarative Pipeline.

### Issue 3 --- npm test fails

Current script:

``` json
"test": "echo \"Error: no test specified\" && exit 1"
```

Cause: No actual test suite has been configured.

Resolution: Add application tests and update the npm test script before
adding `npm test` as a mandatory pipeline stage.

### Issue 4 --- Application does not open on port 3000

Checks: - Confirm the application or container is running. - Inspect
application logs. - Confirm the port mapping. - Confirm the application
listens on the expected port and container network interface. - Check
whether another process is already using port 3000.

------------------------------------------------------------------------

## 12. Current project status

This table distinguishes demonstrated work from stages that still need
practical verification.

  -----------------------------------------------------------------------
  Stage                   Work                    Status based on
                                                  walkthrough
  ----------------------- ----------------------- -----------------------
  1                       Node.js application     Completed in project
                                                  walkthrough

  2                       Express APIs            Reported completed

  3                       Frontend                Reported completed

  4                       Git initialization and  Completed in project
                          commits                 walkthrough

  5                       Dockerfile and          Created
                          `.dockerignore`         

  6                       Docker configuration    Confirmed in Jenkins
                          pushed to GitHub        checkout

  7                       Jenkins Freestyle       Build finished
                          GitHub integration      successfully

  8                       Jenkinsfile and         Implementation and
                          Pipeline job            successful build need
                                                  confirmation

  9                       Jenkins Docker build    Pending verification
                          and deployment          

  10                      GitHub Webhook          Pending verification
                          automation              
  -----------------------------------------------------------------------

Update this table as each stage is tested. Do not mark a stage complete
merely because its configuration has been written.

------------------------------------------------------------------------

## 13. Learning outcomes

By completing and verifying this project, you will be able to explain:

-   How a Node.js application is organized.
-   How Express handles application requests.
-   How Git tracks code changes.
-   How GitHub stores and shares source code.
-   How Docker packages an application into an image.
-   The difference between Docker images and containers.
-   How Jenkins checks out a GitHub repository.
-   The difference between a Freestyle job and a Pipeline job.
-   How a Jenkinsfile defines pipeline stages.
-   How CI/CD automates application build and deployment.
-   How GitHub Webhooks can trigger Jenkins builds.

### Interview explanation

You can use this as a starting point when explaining the project in an
interview. Adjust it to include only the stages you have personally
completed and tested:

> I developed a Node.js application using Express and managed its source
> code with Git and GitHub. I created a Dockerfile to containerize the
> application and integrated Jenkins with the GitHub repository. I used
> a Jenkins Freestyle job to verify source-code checkout and began
> moving the workflow to a Declarative Pipeline using a Jenkinsfile. My
> next implementation steps are automated Docker deployment and GitHub
> Webhook integration. This project is helping me understand how CI/CD
> works in a practical environment.

------------------------------------------------------------------------

## 14. Future improvements

After the core workflow is working, possible improvements include:

-   Add real automated tests for the Node.js application.
-   Add a code-quality or linting stage.
-   Publish versioned Docker images to Docker Hub.
-   Store Docker Hub credentials securely in Jenkins.
-   Add deployment rollback and health-check handling.
-   Add application monitoring with Prometheus and Grafana.
-   Deploy the container to a cloud virtual machine.
-   Explore Kubernetes deployment after the Docker workflow is stable.

------------------------------------------------------------------------

## Repository information

Update these values before publishing the README:

-   **GitHub repository:** `YOUR_GITHUB_REPOSITORY_URL`
-   **Application name:** Node.js Task Manager
-   **Developer:** `YOUR_NAME`
-   **Primary branch:** `main`

## Final note

This is a learning project built stage by stage. The most important
outcome is not just getting a green Jenkins build; it is understanding
what each stage does, why it is required, how to verify it, and how to
troubleshoot it when something fails.
