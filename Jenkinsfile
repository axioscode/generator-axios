// requires:
// https://github.com/jenkinsci/pipeline-aws-plugin
// https://github.com/jenkinsci/docker-workflow-plugin
// https://github.com/jenkinsci/http-request-plugin
// in addition to standard pipeline plugins
@Library("jenkins-utils") _

def NODE_IMAGE = "node:10.15-alpine"

pipeline {
  agent {
    node {
      label "docker"
      customWorkspace "/scratch/${env.JOB_NAME}"
    }
  }

  environment {
    NODE_ENV = "staging"
  }

  stages {
    stage ("Setup environment") {
      steps {
        script {
          env.GK_LOCK_DEFAULT_BRANCH = "gk-origin/master"
        }
      }
    }
  
    stage ("Checkout code") {
      steps {
        script {
          def scmVars = checkout([
            $class: "GitSCM",
            // In a parameterized build pipeline, the ref will be provided by the user.
            // In Git pipelines, BRANCH_NAME is set in the environment.
            branches: [[name: env.ref ?: env.BRANCH_NAME]],
            userRemoteConfigs: [[
              url: "git@github.com:axioscode/generator-axios.git",
              credentialsId: "axios-machine-user"
            ]]
          ])
          env.GIT_COMMIT = scmVars.GIT_COMMIT
          env.GIT_BRANCH = scmVars.GIT_BRANCH
          env.GIT_URL = scmVars.GIT_URL
        }
      }
    }

    stage("Prep Greenkeeper") {
      when {
        branch "greenkeeper/**"
      }
      steps {
        greenkeeper("update")
      }
    }

    stage ("Install dependencies") {
      agent {
        docker {
          image NODE_IMAGE
          args "-v /cache/yarn-cache:/yarn-cache -v /cache/yarn-mirror:/yarn-mirror"
          reuseNode true
        }
      }
      steps {
        sh "yarn config set yarn-offline-mirror /yarn-mirror"
        sh "yarn install --frozen-lockfile --prod=false --cache-folder /yarn-cache"
      }
    }

    stage ("Test") {
      agent {
        docker {
          image NODE_IMAGE
          reuseNode true
        }
      }
      steps {
        sh "yarn add lodash"
        sh "NODE_ENV=test yarn jest -w 2 -v"  // Set node_env to test so Babel will transpile ESM for us.
      }
    }

    stage ("Build") {
      agent {
        docker {
          image NODE_IMAGE
          reuseNode true
        }
      }
      steps {
        // Run Yeoman, then see if its generated files build
        sh """
          yarn global add yeoman-doctor
          yarn add yo
          yarn link
          mkdir test-project && cd test-project
          echo 'n' | yarn yo axios --force
          yarn webpack -p
        """
      }
    }

    stage("Finish Greenkeeper") {
      when {
        branch "greenkeeper/**"
      }
      steps {
        sh "git config user.email 'devs@axios.com'"
        sh "git config user.name 'axios-machine-user'"
        greenkeeper("upload")
      }
    }
  }

  post {
    always {
      dir ("test-project") { deleteDir() }
      cleanWs()
      logBuildMetrics()
    }

    changed {
      notify result: currentBuild.result, number: env.BUILD_NUMBER, name: env.JOB_NAME, url: env.RUN_DISPLAY_URL
    }
  }
}
