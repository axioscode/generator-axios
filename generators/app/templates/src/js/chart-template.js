let d3 = require("d3");

class makeChart {

    constructor(opts) {
        Object.assign(this,opts)
        this.aspectHeight = opts.aspectHeight ? opts.aspectHeight : .68;

        this.update();
    }


    update() {
        this._setDimensions();
        this._setScales();
        this.draw();
    }

    _setDimensions() {
        // define width, height and margin

        this.margin = {
            top: 30,
            right: 30,
            bottom: 30,
            left: 30
        };

        this.width = this.element.offsetWidth - this.margin.left - this.margin.right;
        this.height = (this.element.offsetWidth * this.aspectHeight) - this.margin.top - this.margin.bottom; //Determine desired height here

    }


    _setScales() {

        this.xScale = d3.scaleLinear()
            .rangeRound([0, this.width])
            .domain([0, 100]);

        this.yScale = d3.scaleLinear()
            .rangeRound([this.height, 0])
            .domain([0, 100]);

    }

    draw() {

        // set up parent element and SVG
        this.element.innerHTML = "";

        this.svg = d3.select(this.element).append('svg');

        //Set svg dimensions
        this.svg.attr('width', this.width + this.margin.left + this.margin.right);
        this.svg.attr('height', this.height + this.margin.top + this.margin.bottom);

        // create the chart group.
        this.plot = this.svg.append('g')
            .attr('transform', `translate(${this.margin.left},${this.margin.top})`)
            .attr("class", "chart-g");

        this.xAxis = d3.axisBottom(this.xScale)
            .tickSize(-this.height-20);

        this.yAxis = d3.axisLeft(this.yScale)
            .tickSize(-this.width-20);

        this.plot.append("g")
            .classed("axis x-axis", true)
            .attr("transform", "translate(0," + (this.height+20) + ")")
            .call(this.xAxis);

        this.plot.append("g")
            .classed("axis y-axis", true)
            .attr("transform", "translate(" + (-20) + ",0)")
            .call(this.yAxis);


    }


}



export default makeChart;