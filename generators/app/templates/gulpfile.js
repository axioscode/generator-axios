"use strict";
const colors = require("ansi-colors");
const gulp = require("gulp");
const log = require("fancy-log");
const minimist = require("minimist");
const shell = require("gulp-shell");

const projectConfig = require("./project.config.json");
const prodUrl = `https://${projectConfig.s3.bucket}/${
  projectConfig.s3.folder
}/index.html`;
const date = new Date();
const timestamp = {
  year: date.getFullYear(),
  month: (date.getMonth() < 10 ? "0" : "") + (date.getMonth() + 1),
  date: (date.getDate() < 10 ? "0" : "") + date.getDate(),
  hour: (date.getHours() < 10 ? "0" : "") + date.getHours(),
  min: (date.getMinutes() < 10 ? "0" : "") + date.getMinutes(),
  sec: (date.getSeconds() < 10 ? "0" : "") + date.getSeconds(),
};

const defaultOptions = {
  string: "port",
  default: {
    port: 3000,
  },
  alias: {
    p: "port",
  },
};
const argv = minimist(process.argv.slice(2), defaultOptions);

// Setup tasks
gulp.task(
  "setup:analyzer",
  shell.task("npm install --global webpack webpack-cli webpack-bundle-analyzer")
);
gulp.task("setup:analyzer").description =
  "Installs dependencies to analyze the JS bundle";
gulp.task("setup:aws", shell.task(["pip install awscli", "aws init"]));
gulp.task("setup:aws").description =
  "Installs & initilizes awscli for deploying visuals";
gulp.task("setup:lint", shell.task("npm install --global eslint stylelint"));
gulp.task("setup:lint").description =
  "Installs linters to catch style & semantic errors";
gulp.task("setup:imgmin", shell.task("brew install libpng"));
gulp.task("setup:imgmin").description =
  "Installs an image optimizing dependency";
gulp.task("setup:yarn", shell.task("brew install yarn"));
gulp.task("setup:yarn").description =
  "Installs package manager for the generator";
gulp.task(
  "setup",
  gulp.parallel(
    "setup:analyzer",
    "setup:aws",
    "setup:imgmin",
    "setup:lint",
    "setup:yarn"
  )
);
gulp.task("setup").description =
  "Installs all external dependencies for using the generator";

// Development tasks
gulp.task(
  "analyze",
  shell.task(
    "webpack -p --json > webpack-stats.json && webpack-bundle-analyzer --default-sizes gzip webpack-stats.json dist"
  )
);
gulp.task("analyze").description =
  "Generates a treemap of the JS. Useful for optimizing bundle size.";
gulp.task("lint", shell.task("eslint src/js && stylelint src/sass"));
gulp.task("lint").description =
  "Runs a linter to check your code for errors and style";
gulp.task(
  "serve",
  shell.task(
    `./node_modules/.bin/webpack-dev-server --hot --host 0.0.0.0 --port ${
      argv.port
    } --mode development`
  )
);
gulp.task("serve").description =
  "Runs a local development server. Accepts --port, -p integer";
gulp.task("watch", shell.task("./node_modules/.bin/webpack -p --watch"));
gulp.task("watch").description =
  "Rebuilds the dist/ subdirectory whenever you make changes";
gulp.task(
  "localip",
  shell.task([
    `echo "http://\`ipconfig getifaddr en0\`:${argv.port}" | pbcopy`,
    'echo "\ncopied url to your clipboard:"',
    `echo "http://\`ipconfig getifaddr en0\`:${argv.port}\n"`,
  ])
);
gulp.task("localip").description =
  "Copy the local ip to your clipboard for device testing. Accepts --port, -p integer";

// Publishing tasks
gulp.task(
  "push",
  shell.task(
    [
      "git add -A .",
      `git commit -am "latest as of ${timestamp.year}-${timestamp.month}-${
        timestamp.date
      } ${timestamp.hour}:${timestamp.min}:${timestamp.sec}"`,
      "git push",
    ],
    {
      ignoreErrors: true,
    }
  )
);
gulp.task("push").description = "Push any unstaged commits to Github";
gulp.task("build", shell.task("./node_modules/.bin/webpack -p"));
gulp.task("build").description =
  "Compile all your code, styles, and assets to the dist/ subdirectory";
gulp.task(
  "deploy",
  shell.task(
    `aws s3 cp dist s3://${projectConfig.s3.bucket}/${
      projectConfig.s3.folder
    } --recursive --metadata-directive REPLACE --cache-control max-age=30,public --acl public-read`
  )
);
gulp.task("deploy").description =
  "Upload the dist/ subdirecotry to visuals.axios.com on AWS S3";
gulp.task("log:publish", done => {
  log("");
  log(
    "🎉 ",
    colors.green.bold(
      "Your project can be accessed and embedded using the following url:"
    )
  );
  log(`\t${prodUrl}`);
  log("");
  log("👉 ", colors.blue.bold("Login to the Axios CMS:"));
  log("\thttps://eden.axios.com/dashboard");
  log("");
  done();
});
gulp.task("log:publish").description = "Output the URL to your terminal";
gulp.task(
  "preview",
  shell.task([
    `echo ${prodUrl} | pbcopy`,
    'echo "\ncopied to your clipboard:"',
    `echo "${prodUrl}\n"`,
    `open ${prodUrl}`,
  ])
);
gulp.task("preview").description =
  "Open a browser tab to the visual and copy the URL to your clipboard";
gulp.task(
  "publish",
  gulp.series("push", "build", "deploy", "log:publish", "preview")
);
gulp.task("publish").description =
  "A series of commands which publishes a visual to AWS S3";

gulp.task("clean", shell.task("rm -rf dist"));
gulp.task("clean").description = "Removes the dist/ subdirectory";

gulp.task("default", gulp.series("serve"));
gulp.task("default").description = "Runs a local development server";
