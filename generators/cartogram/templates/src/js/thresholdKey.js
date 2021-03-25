/* eslint-disable */
let d3 = Object.assign({}, require("d3-selection"), require("d3-scale"), require("d3-axis"), require("d3-format"));



class thresholdKey {

    constructor(opts) {
        Object.assign(this, opts);
        this.onReady = opts.onReady ? opts.onReady : null;
        this.showTicks = this.showTicks === false ? false : true;

        this.h = this.showTicks ? 36 : 18;

        // this.formatPct = d3.format(".0%");

        this.update();
    }

    update() {

        // this._setDimensions();
        this._setScales();
        // this.draw();

        if (this.onReady) {
            this.onReady();
        }

    }

    // _setDimensions() {
    //     // define width, height and margin

    //     this.margin = {
    //         top: 0,
    //         right: 15,
    //         bottom: 15,
    //         left: 30
    //     };

    //     this.width = this.element.offsetWidth - this.margin.left - this.margin.right;
    //     this.height = this.h - this.margin.top - this.margin.bottom; //Determine desired height here

    // }

    _setScales() {

        this.xScale = d3.scaleLinear()
            .domain(this.domain)
            .range([0, this.width]);

        this.threshold = d3.scaleThreshold()
            .domain(this.breakpoints)
            .range(this.colorRange);

        let tickVals = this.tickVals ? this.tickVals : this.threshold.domain();

        this.xAxisBottom = d3.axisBottom(this.xScale)
            .tickSize(13)
            .tickValues(tickVals)
            .tickFormat(d => {
                if (d == 0) {
                    return '0'
                } else {
                    return `${d.toFixed(0)}`;
                }
            });
    }


    // draw() {

    //     // set up parent element and SVG
    //     // this.element.innerHTML = "";

    //     d3.select(this.element).classed("threshold-key", true);

    //     this.svg = d3.select(this.element).append('svg');

    //     //Set svg dimensions
    //     this.svg.attr('width', this.width + this.margin.left + this.margin.right);
    //     this.svg.attr('height', this.height + this.margin.top + this.margin.bottom);

    //     // create the chart group.
    //     this.plot = this.svg.append('g')
    //         .attr('transform', `translate(${this.margin.left},${this.margin.top})`)
    //         .attr("class", "chart-g");

    //     this.key = this.plot.append("g")
    //         .attr("class", "axis x-axis");

    //     this.key.call(this.xAxisBottom);

    //     if (!this.showTicks) {
    //         this.key.selectAll(".tick text").style("display", "none");
    //         this.key.selectAll(".tick line").attr("y2", this.h);
    //     }

    //     this.key.select(".domain").remove();

    //     this.key.selectAll("rect")
    //         .data(this.threshold.range().map((color) => {
    //             var d = this.threshold.invertExtent(color);
    //             if (d[0] == null) d[0] = this.xScale.domain()[0];
    //             if (d[1] == null) d[1] = this.xScale.domain()[1];
    //             return d;
    //         }))
    //         .enter().insert("rect", ".tick")
    //         .attr("height", 8)
    //         .attr("x", d => {
    //             return this.xScale(d[0]);
    //         })
    //         .attr("width", d => {
    //             return this.xScale(d[1]) - this.xScale(d[0]);
    //         })
    //         .attr("fill", d => {
    //             return this.threshold(d[0]);
    //         });

    // }






}


function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

export default thresholdKey;
