# generator-axios-graphic
Yeoman generator to make developing graphics at Axios simpler and faster.

## Setup

`npm run setup`

This will
* Install global dependencies: `yo`, `yeoman-generator`, `gulp-cli`
* Install local dependencies
* Link `generators/app/` to `yo`

## Generate Project

```bash
mkdir [project-name] && cd $_
yo axios
```

OR To setup using one line in your terminal, add this shell script to your `.bash_profile`

```bash
# Create a new project using the axios generator
# Example:
# > axiosviz TKTKTK
# Note:
# TKTK is the project slug & must be an empty folder
function axiosviz() {
	mkdir "$@"
	cd "$@"
	yo axios
}
```

## Add default Github issues

The following will ask you for your Github username & password. Once authorized, it will create number of default Github issues & labels relevant to most, but not all, projects.

You can change which tickets and labels get created by editing `etc/default_tickets.csv` and `utils/default_labels.csv`, respectively.

```bash
pip install -r etc/requirements.txt
python etc/github.py
```
