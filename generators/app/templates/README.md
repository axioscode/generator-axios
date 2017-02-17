# The Axios Graphics Kit
This project was created with `generator-axios`, Axios' yeoman generator for making static interactive graphics that can be embedded in our news stream. This documentation will help you work with the graphics rig to make awesome internet things.

**Note** — You may also want to look at the documentation for the generator for some additional understanding of what each of the files in this project does and how they all work together.


### Configuration
Most of this configuration should be accomplished already if you set up this project with `yo axios`. If you want to understand more of what's happening, here's some information.

The primary place to configure your project is `project.config.js` in the root directory. This is where you define where on S3 your project will live (this is important for how the rig handles static URLs when building for production). There is also some configuration stuff that happens in `/gulp/config.js` so if you're changing the names of folders or putting things where the rig doesn't expect them to be, that might be where you can fix that problem.

### Working with Google Drive
explanantino goes here.

#### Setting your Credentials
instructions here.

#### Adding files
explain `gulp gdrive:add` here

#### Updating Copy
instructinos here


### Working with S3

#### Setting your Credentials
To publish to S3 you'll need to create an `axios` profile in your `~/.aws/credentials` file. You will need to have the aws command line tools installed to do this (`pip install awscli`). To set up your credentials, simply run:

```bash
$ aws configure --profile axios
AWS Access Key ID [None]: [PUT YOUR ACCESS_KEY HERE]
AWS Secret Access Key [None]: [PUT YOUR SECRET_ACCESS_KEY HERE]
Default region name [None]: us-east-1
Default output format [None]: text
```

#### Publishing to S3
explanatino here.


## Gulp

### Main Gulp Tasks

#### `gulp` and `gulp build`
Creates your project. You can run `NODE_ENV=production gulp` to generate the version of your project to put on S3.

#### `gulp serve`
Sets up a local server run out of `/.tmp`. Watches your Sass, Handlebars and Javascript files and updates live in the browser.

#### `gulp watch`
Like `gulp serve`, but without setting up a server for you to look at you project.

#### `gulp publish`
If you've set up your AWS credentials correctly and have the proper s3 configuration in `project.config.js` then this command will automatically run the production build script and deploy the s3 folder you specified.

### Under the Hood
There are six main Gulp tasks that handle various aspects of processing static assets. Each behaves slightly differently when the NODE_ENV is set to 'production'. The rig expects certain files to be in certain places — look in `/gulp/config.js` to see which paths Gulp uses to find your static files.

#### `gulp clean`
 Cleans `/.tmp` and `/dist` in preparation for future scripts.

#### `gulp styles`
Processes each Sass file in `/src/sass/*.scss`.

#### `gulp templates`
Processes each Handlebars file in `/src/templates/*.hbs`.

#### `gulp scripts` and `gulp scripts:watch`
Processes `/src/scripts/app.js` with Browserify.

#### `gulp images`
Copies files from `/src/img`.
