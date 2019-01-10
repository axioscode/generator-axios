# generator-axios
Yeoman generator to make developing graphics at Axios simpler and faster.

## Generator

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
