# How to Setup Your Mac to Write Code at Axios
Hello! I joined the hive mind that is Axios back in January. Since then, I’ve been automating our newsroom and giving our Visuals a basic toolkit for writing publishable code.

Here’s how you can start writing your own code for your newsroom, whether it’s an interactive you iframe into a post or a bot that lives on Amazon Web Services.

The following assumes you’re working with on Mac OS Sierra, aka OS X 10.12, and you’ve never tried to write code on it before.

## Step 0. The Set up
### Permissions!
Make sure you’re an administrator for this computer before you go any further. If you’re working in a newsroom, you should talk to your IT Department or try this on your personal computer. If you follow all the steps, it won’t destroy it. I’m not liable for your typos though.

### Get Github
You have to have a [GitHub](https://github.com/) account. Sorry, but those are the rules. It’s the like the developer version of simply having an email address.

Once you’ve got an account, don’t forget to setup your SSH keys so you can copy and share code on Github securely. Here’s a [helpful guide](https://help.github.com/articles/connecting-to-github-with-ssh/) for that.

### Setting a Laptop up with “laptop”
Not that many years ago, setting up a laptop from scratch was more laborious. Now we kneel before Open Source’s mighty ability to write, edit, and share code. The following bit of wizardry, [laptop](https://github.com/18F/laptop), is courtesy of [18f](https://18F.gov), an office within the U.S. General Services Administration writing code to make government tech better.

```sh
bash <(curl -s https://raw.githubusercontent.com/18F/laptop/master/laptop)
```

This will run you through a setup process to install tools to develop like a newsroom wizard, minotaur, or unicorn. Whichever you prefer.

For more information on what’s getting installed and how to configure it, please visit their [Github repository](https://github.com/18F/laptop).

### Cloning the Axios Generator
We’re close to getting you writing code! You still with us? Now all you need is the actual generator to get you started. We use our Yeoman to scaffold out projects from card decks to AWS Lambda functions for bots and scrapers.

```sh
npm install -g yo
git clone git@github.com:axioscode/generator-axios.git
```

## Step 1. Setting up the Generator
Now that you’re all setup, we can start making awesome things.

```sh
mkdir [project-name] && cd $_
```

### Google Drive
* Log in to <https://console.developers.google.com/>, you should see a project called "Visuals Rig Copyflow" (If not, ask the devs to set you up with access)
* Make sure you are in the "API Manager" section. Click Credentials. Under OAuth 2.0 client IDs, download Axios Visuals Rig Copyflow Keys.
* `mv [DOWNLOADED FILE] ~/.axios_kit_google_client_secrets.json`
* The first time you run `gulp fetch-data` or `gulp gdrive:fetch`, you will be prompted to visit a URL and copy/paste an access token.

### AWS S3
To publish to S3 you'll need to create a `default` profile in your `~/.aws/credentials` file. You will need to have the aws command line tools installed to do this (`pip install awscli`). To set up your credentials, simply run:

```bash
$ aws configure --profile default
AWS Access Key ID [None]: [PUT YOUR ACCESS_KEY HERE]
AWS Secret Access Key [None]: [PUT YOUR SECRET_ACCESS_KEY HERE]
Default region name [None]: us-east-1
Default output format [None]: text
```

## Step 2. Building an Interactive Graphic
OK! Now you’re ready to start writing code.

```sh
yo axios
```

### Getting Started
Yeoman will walk you through a series of prompts to get you setup.

![](https://cloud.githubusercontent.com/assets/1578563/26507657/37e6d7ce-4206-11e7-9deb-94c67386f4f8.png)

Once you’re all done it will prompt you with where you can go next!

![](https://cloud.githubusercontent.com/assets/1578563/26507846/0a37553c-4207-11e7-9b6e-30b1b89f035c.png)

Or, if you want to start writing and testing code…

```sh
gulp serve
```

### Handlebar / HTML
Templates can be edited in the folder `src/templates/`. We use [Handlebars.js](http://handlebarsjs.com/) to make life easier. For more information and documentation, please visit their website.

### SASS / CSS
Styles are changed with two files. Feta, and then the main stylesheet for the interactive. While the main stylesheet inherits useful helpers and variables from Feta, main.scss does all the work. Check out the [Sass website](http://sass-lang.com/) for additional documentation and information.

* **feta.scss**
A shared set of stylesheets across Axios departments. For more information, checkout [the repository](https://github.com/axioscode/feta) or clone it.

```sh
git clone git@github.com:axioscode/feta.git
```

* **main.scss**
Located in `src/sass/`. This is left as a blank canvas for you to create your designs.

### JavaScript
Finally, we use Browserify to compile our JavaScript. Logic and be broken up into modules for easier re-use and you can use ES6 syntax if you prefer.

Within the folder there are two files:

* **app.js**
This is where you main logic lives. This file contains a few lines of starter code to initiate the responsive iframe, let’s you record analytics, and adds a listener to run your code when the page if finished loading.

* **analytics.js** (optional)
Analytics.js contains logic to do two things: setup Google Analytics on a page and track events.

**setupVisualsAnalytics**
`setupVisualsAnalytics()`

Accepts no parameters, returns `undefined`. Necessary to call before attempting to record user interactions.

**trackEvent**
`trackEvent(action, label (optional), value (optional))`

Accepts three parameters and returns `undefined`. To be placed inside an event listener.

* **action**: a string describing the event, e.g. scroll, tap, or graphic-visible
* **label**: an optional string describing the event, e.g. clicked-dropdown
* **value**: an option integer describing the event. useful for tracking time, e.g. 200

## Step 3. Publishing an Interactive Graphic
Once you’ve got it all working you can publish it to s3. Afterward, the script will tell you the URL and give you the shortcode for you to copy and paste and see it in the CMS.

![](https://cloud.githubusercontent.com/assets/1578563/26508043/f09357b0-4207-11e7-9108-2a40f7236ddc.png)

### CMS Shortcode

`[shortcode-pym-iframe id=“TKTK” url=“TKTK”]`

The following shortcode can be posted into a new Axios post.

* **id**: a string to be used as the graphic container’s unique HTML id attribute
* **url**: URL to the interactive graphic you just published on s3

## What’s next? (Not included in the public repo)
An interactive card-deck?

```sh
yo axios:card-deck # creates basic folders and UX logic
```

An AWS Lambda function for a bot or a scraper?

```sh
yo axios:lambda # setup the basic folders
yo axios:lambda-node <function-name> # if you prefer Node.js
yo axios:lambda-python <function-name> # if you prefer Python
```
