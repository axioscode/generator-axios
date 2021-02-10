// D3 to select things
let d3 = Object.assign({}, require('d3-selection'))

class Tooltip {

	constructor(opts) {

		this.parent = opts.parent
		this.formats = opts.formats
		this._initialize()

	}

	_initialize() {
		// Select the parent and tooltip
		this.tooltip = d3.select(this.parent)
			.classed('has-tooltip', true)
			.select('.tooltip')

		// Select the fields which will update
		this.fields = this.tooltip.selectAll('.tt-update')

	}

	// Concatenates quadrant name for tooltip class
	_getQuad(coords,size) {

		let l = []

		if (coords[1] > size[1]/2) {
			l.push('s')
		} else {
			l.push('n')
		}

		if (coords[0] > (size[0]*.65) ) {
			l.push('e')
		}

		if (coords[0] < (size[0]*.35)) {
			l.push('w')
		}

		return l.join('')

	}

	updateFields(data) {

		this.fields.each((d,i,nodes) => {
			let f = d3.select(nodes[i])
			let o = nodes[i].dataset
			if (data[o.field]) {
				if (o.format && this.formats) {
					f.text(this.formats[o.format](data[o.field]))
				} else {
					f.text(data[o.field])
				}
			}
		})

	}

	position(data,coords,widthHeight) {

		let region = this._getQuad(coords,widthHeight)

		this.updateFields(data)

		this.tooltip
			.classed('tooltip-active',true)
			.classed('tooltip-' + region, true)
			.style('left', coords[0] + 'px')
			.style('top', coords[1] + 'px')

	}

	deposition() {

		this.tooltip.attr('class','tooltip')
		this.fields.each((d,i,nodes) => {
			let f = d3.select(nodes[i])
			f.text("")
		})
	}
}


export default Tooltip