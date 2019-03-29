pipeline {
    agent any

    environment {
        COMMIT_MESSAGE = """${sh(
            returnStdout: true,
            script: "git --no-pager log --format='medium' -1 ${GIT_COMMIT}"
        )}"""
        COMMIT_HASH = """${sh(
            returnStdout: true,
            script: "git describe --always"
        )}"""

        DOCKER_REPO = "kadenlnelson/stripe-charge-processor"
        DOCKER_CREDENTIALS = "docker-hub-kadenlnelson"
    }

    stages {
        stage('Notify Slack') {
            steps {
                slackSend(color: '#000000', message: "Build Started - ${env.JOB_NAME} ${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)\n```${env.COMMIT_MESSAGE}```")
            }
        }

		    stage('Build & Push Docker Image') {
            agent { docker { image 'docker:stable' } }
            steps {
                script {
                    def branchName = "${GIT_BRANCH}".replace('/', '_')
                    def image = docker.build("${DOCKER_REPO}")

                    docker.withRegistry('', "${DOCKER_CREDENTIALS}") {
                        image.push(branchName)
                        image.push("${COMMIT_HASH}")
                    }
                }

                slackSend (color: '#0db7ed', message: "Docker Image Built & Pushed - https://hub.docker.com/r/${DOCKER_REPO}/tags\n```\nTry it out!\n\ndocker run --rm ${DOCKER_REPO}:${COMMIT_HASH}```")
            }
        }
    }

    post {
        failure {
            slackSend (color: '#FF0000', message: "Build Failed! - ${env.JOB_NAME} ${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)")
        }

        success {
            slackSend (color: '#00FF00', message: "Success! - ${env.JOB_NAME} ${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)")
        }
    }
}
