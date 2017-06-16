# generator-axios-graphic
Yeoman generator to make developing graphics at Axios simpler and faster.

## Generators

### axios

`yo axios`

Generate an interactive graphic to be displayed in an iframe on Axios.com

```bash
mkdir [project-name] && cd $_
yo axios
```

OR To setup using one line in your terminal, add this shell script to your `.bash_profile`

```bash
# Create a new project using the axios generator
# Example:
# > av-viz TKTKTK
# Note:
# TKTK is the project slug & must be an empty folder
function av-viz() {
	mkdir "$@"
	cd "$@"
	yo axios
}
```

### axios:card-deck

`yo axios:card-deck`
Generate and interactive Axios card deck based on a Google Spreadsheet or Google Doc. Card decks are HTML pages, along with static assets, which are placed in an iframe and published on axios.com

```bash
mkdir [project-name] && cd $_
yo axios
yo axios:card-deck
```

OR To setup using one line in your terminal, add this shell script to your `.bash_profile`

```bash
# Create a new project using the axios generator
# Example:
# > av-card-deck TKTKTK
# Note:
# TKTK is the project slug & must be an empty folder
function av-card-deck() {
	mkdir "$@"
	cd "$@"
  yo axios
	yo axios:card-deck
}
```

### axios:lambda

`yo axios:lambda`
Generate the boilerplate AWS Lambda project to be deployed using Apex

```bash
mkdir [project-name] && cd $_
yo axios:lambda
```

OR To setup using one line in your terminal, add this shell script to your `.bash_profile`

```bash
# Create a new project using the axios generator
# Example:
# > av-lambda TKTKTK
# Note:
# TKTK is the project slug & must be an empty folder
function av-lambda() {
	mkdir "$@"
	cd "$@"
	yo axios:lambda
} 

### axios:lambda-node

`yo axios:lambda-node function_name`

Generate an AWS Lambda project with a Node.js function, named `function_name`

```bash
mkdir [project-name] && cd $_
yo axios:lambda-node [function-name]
```

#### Multiple functions

To generate multiple Lambda functions within a project, just re-use the generator

```bash
yo axios:lambda-node [function-name]
```

### axios:lambda-python

`yo axios:lambda-python function_name`

Generate an AWS Lambda project with a Python function, named `function_name`

```bash
mkdir [project-name] && cd $_
yo axios:lambda-python [function-name]
```

#### Multiple functions

To generate multiple Lambda functions within a project, just re-use the generator

```bash
yo axios:lambda-python [function-name]
```

## Setup

`npm run setup`

This will
* Install global dependencies: `yo`, `yeoman-generator`, `gulp-cli`
* Install local dependencies
* Link `generators/app/` to `yo`

## Add default Github issues

The following will ask you for your Github username & password. Once authorized, it will create number of default Github issues & labels relevant to most, but not all, projects.

You can change which tickets and labels get created by editing `etc/default_tickets.csv` and `utils/default_labels.csv`, respectively.

```bash
pip install -r etc/requirements.txt
python etc/github.py
```
