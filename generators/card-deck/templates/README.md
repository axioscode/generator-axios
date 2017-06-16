<%= meta.name %>
---
<%= meta.description %>

This project was created with `generator-axios`, Axios' yeoman generator for making interactive card decks that can be embedded in our news stream. This documentation will help you work with the graphics rig to make awesome internet things.

**Note** — You may also want to look at the documentation for the generator for some additional understanding of what each of the files in this project does and how they all work together.

## Developing the Card deck
Card decks central logic hinge on creating easy-to-read, evenly porportioned card decks. The following notes are to help you edit the template to create a new card deck.

### Templates
The actual card format can be edited in the template in `src/templates`. The current template assumes you will use a header, body, and footer

**Additional elements must be placed within the following tag either in the header, body, or footer. This tag is used by the JS to calculate the heights for the cards.**

`<div class="card-module-row"></div>`

### Styles
Styles can be edited in `src/sass`. The stylesheet roughly follows [BEM conventions](http://getbem.com/naming/). **NOTE: style organization is a WIP.**

To edit spacing between sections in the card, edit **padding** first so the JS can properly calculate the section's dimensions.

## Configuration
Most of this configuration should be accomplished already if you set up this project with `yo axios:card-deck`. If you want to understand more of what's happening, here's some information.

The primary place to configure your project is `project.config.js` in the root directory. This is where you define where on S3 your project will live (this is important for how the rig handles static URLs when building for production). There is also some configuration stuff that happens in `/gulp/config.js` so if you're changing the names of folders or putting things where the rig doesn't expect them to be, that might be where you can fix that problem.

### Working with Google Drive

Spreadsheet for `copy.json` ([link](https://docs.google.com/spreadsheets/d/1k91vZX2Gg8sLPNPX1Q6rzaomIQM_s3Ol8zUVsAEpQFI/edit#gid=0))

#### Setting your Credentials
* Log in to <https://console.developers.google.com/>, you should see a project called "Visuals Rig Copyflow" (If not, ask the devs to set you up with access)
* Make sure you are in the "API Manager" section. Click **Credentials**. Under **OAuth 2.0 client IDs**, download **Axios Visuals Rig Copyflow Keys**.
* `mv [DOWNLOADED FILE] ~/.axios_kit_google_client_secrets.json`
* The first time you run `gulp fetch-data` or `gulp gdrive:fetch`, you will be prompted to visit a URL and copy/paste an access token.

#### Adding files
Adding a new Google Drive file is easy with `gulp gdrive:add`. Just run the command and it will walk you through a series of prompts and will save your responses in the right place in `project.config.json`. You can pick between a document parsed with ArchieML and a spreadsheet parsed either as a table or as a key-value store.

#### Updating Data
Running `gulp fetch-data` or `gulp gdrive:fetch` will pull Google Drive sheets stored in your project config.

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

## Gulp

### Main Gulp Tasks

#### `gulp` and `gulp build`
Creates your project. You can run `gulp` to generate the version of your project to put on S3.

#### `gulp serve`
Sets up a local server run out of `.tmp`. Watches your Sass, Handlebars and Javascript files and updates live in the browser.

#### `gulp watch`
Like `gulp serve`, but without setting up a server for you to look at you project.

#### `gulp publish`
If you've set up your AWS credentials correctly and have the proper s3 configuration in `project.config.js` then this command will automatically run the production build script and deploy the s3 folder you specified.

### Under the Hood
There are seven main Gulp tasks that handle various aspects of processing static assets. Each behaves slightly differently when the NODE_ENV is set to 'production'. The rig expects certain files to be in certain places — look in `gulp/config.js` to see which paths Gulp uses to find your static files.

#### `gulp clean`
Cleans `.tmp` and `dist` in preparation for future scripts.

#### `gulp styles`
Processes each Sass file in `src/sass/*.scss`.

#### `gulp templates`
Processes each Handlebars file in `src/templates/*.hbs`.

#### `gulp scripts` and `gulp scripts:watch`
Processes `src/scripts/app.js` with Browserify.

**Note:** When run in development mode, Browserify is configured to run with inline sourcemaps, greatly increasing the size of the generated bundle. In production, the sourcemap is external and will not be downloaded by default.

#### `gulp images`
Copies files from `src/img`.

#### `gulp cachebust`
Rewrite URLs in `dist/**/*.html` to add timestamps for cachebusting.

## Analytics

### setupVisualsAnalytics

`setupVisualsAnalytics()`

Accepts no parameters, returns `undefined`. Necessary to call before attempting to record user interactions.

### trackEvent

`trackEvent(action, label (optional), value (optional))`

Accepts three parameters and returns `undefined`. To be placed inside an event listener.

* *action*: a string describing the event, e.g. scroll, tap, or graphic-visible
* *label*: an optional string describing the event, e.g. clicked-dropdown
* *value*: an option integer describing the event. useful for tracking time, e.g. 200

