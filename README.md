# generator-axios

Yeoman generator to make developing graphics at Axios simpler and faster.

## Basic generator

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

## How to make a new generator

Say you have an existing project that you'd like to turn into a generator. Do the following:

1. Check out a new branch to make an update to this repo (`generator-axios`)
2. Make a copy of the `generator-template` folder and put it inside `generators`, on the same level as `app`.
3. Rename it from `generator-template` to the name of your generator. This is how it'll be called: `yo axios:generator-name`
4. Inside the `templates` folder, put the `src` folder of your existing project and the `package.json` file. So, the project structure should look like this:

```
└───generators
    └───your-new-generator
        └───templates
            └───src
            └───package.json
        └───index.js
```

5. That's it! Get your changes reviewed, merge it, and you'll be able to call your generator just like the regular one.

```
mkdir [project-name] && cd $_
yo axios:your-new-generator
```

## Setup

`npm run setup`

This will

- Install global dependencies: `yo`, `yeoman-generator`, `gulp-cli`
- Install local dependencies
- Link `generators/app/` to `yo`

[npm-image]: https://badge.fury.io/js/generator-axios-ssr.svg
[npm-url]: https://npmjs.org/package/generator-axios-ssr
[daviddm-image]: https://david-dm.org/axioscode/generator-axios-ssr.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/axioscode/generator-axios-ssr
