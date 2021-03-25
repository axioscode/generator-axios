/* eslint-disable */

const d3 = Object.assign(
    {},
    require("d3-selection"),
    require("d3-axis"),
    require("d3-scale")
);

export default class makeCartogram {
    constructor(opts) {
        Object.assign(this, opts);
        this.aspectHeight = 0.75;
        this.data = require("../data/data.json");

        this.gridArr = this._createGridArray();

        // put data in lookup table
        this.lookup = {};
        this.data.forEach(d => {
            this.lookup[d.state] = {
                state: d.state,
                value: d.value,
            };
        });

        this.appendElements();
        this.update();
    }

    update() {
        this._setDimensions();
        this._setScales();
        this.render();
    }

    _setDimensions() {
        this.divisor = 11;

        this.margin = {
            top: 5,
            right: 5,
            bottom: 20,
            left: 5,
        };

        this.width =
            this.element.offsetWidth - this.margin.left - this.margin.right;
        this.height =
            this.element.offsetWidth * this.aspectHeight -
            this.margin.top -
            this.margin.bottom; //Determine desired height here
    }

    _createGridArray() {
        let gridArr = [];

        let stAbbr = [
            "AK",
            "AL",
            "AR",
            "AZ",
            "CA",
            "CO",
            "CT",
            "DC",
            "DE",
            "FL",
            "GA",
            "HI",
            "IA",
            "ID",
            "IL",
            "IN",
            "KS",
            "KY",
            "LA",
            "MA",
            "MD",
            "ME",
            "MI",
            "MN",
            "MO",
            "MS",
            "MT",
            "NC",
            "ND",
            "NE",
            "NH",
            "NJ",
            "NM",
            "NV",
            "NY",
            "OH",
            "OK",
            "OR",
            "PA",
            "PR",
            "RI",
            "SC",
            "SD",
            "TN",
            "TX",
            "UT",
            "VA",
            "VT",
            "WA",
            "WI",
            "WV",
            "WY",
        ];

        //Cartogram lives on a 11 x 8 grid (11 * 8 = 88)
        //`gridArr` holds the cell number (rows and columns)
        //Create an array of 96 objects, one for each cell.
        //If cell number has a match in the stateGridLookup, store in the `st` property.
        //Otherwise leave it null.`

        let row = -1;

        for (let i = 0; i < 88; i++) {
            let column = i % 11;
            row = column == 0 ? row + 1 : row;

            gridArr.push({
                row: row,
                column: column,
                st: stateGridLookup[`${row}-${column}`]
                    ? stateGridLookup[`${row}-${column}`]
                    : null,
            });
        }

        return gridArr;
    }

    _setScales() {
        this.statesOffset = {};
        this.wh = this.width / 11; //Width and height is equal to 1/11th of the the container width.
    }

    appendElements() {
        d3.select(this.element).classed("cartogram", true);

        this.element.innerHTML = "";

        // this.tooltip = this.tooltip = new tooltip({
        //   element: this.element,
        // });

        this.svg = d3.select(this.element).append("svg");

        // create the chart group.
        this.plot = this.svg.append("g").attr("class", "chart-g");

        this.states = this.plot
            .append("g")
            .attr("class", "states-g")
            .selectAll(".state")
            .data(
                this.gridArr.filter(d => {
                    return d.st; //Only draw cells with a `st` property.
                })
            )
            .enter()
            .append("g")
            .attr("class", d => {
                return `state ${d.st}`;
            });

        this.stateSwatch = this.states
            .append("rect")
            .attr("class", "state-bkgd")
            .style("fill", d => {
                if (this.lookup[d.st]===undefined){
                    let val = 0;
                    return this.threshold(val);
                }
                else{
                    let val = this.lookup[d.st].value;
                    return this.threshold(val);
                }
            });

        this.states
            .append("text")
            .attr("text-anchor", "middle")
            .text(d => {
                return d.st; //State label
            });
    }

    render() {
        //Set svg dimensions
        this.svg.attr("width", this.width + this.margin.left + this.margin.right);
        this.svg.attr("height", this.height + this.margin.top + this.margin.bottom);

        this.plot.attr(
            "transform",
            `translate(${this.margin.left},${this.margin.top})`
        );

        this.states.attr("transform", d => {
            let left = d.column * this.wh;
            let top = d.row * this.wh;

            this.statesOffset[d.st] = {
                top: top,
                left: left,
            };

            return `translate(${left},${top})`;
        });

        this.stateSwatch.attr("width", this.wh).attr("height", this.wh);

        this.states
            .select("text")
            .attr("x", this.wh / 2)
            .attr("y", 6 + this.wh / 2);

        let _this = this;

        this.states;
        //   .on("mouseover", function(d) {
        //     let offset = _this.statesOffset[d.st];
        //     let xPos = offset.left + _this.wh / 2 + _this.margin.left;
        //     let yPos = offset.top + _this.wh / 2 + _this.margin.top;
        //     let ttPos = [xPos, yPos];

        //     let datum = _this.lookup[d.st];

        //     _this.tooltip.updateFields(datum);
        //     _this.tooltip.position(ttPos, [
        //       _this.element.offsetWidth,
        //       _this.element.offsetHeight,
        //     ]);

        //     d3.select(this)
        //       .classed("active", true)
        //       .raise();
        //   })
        //   .on("mouseout", function() {
        //     _this.tooltip.deposition();
        //     d3.select(this).classed("active", false);
        //   });
    }
}

var stateGridLookup = {
    "0-0": "AK",
    "6-6": "AL",
    "5-4": "AR",
    "5-1": "AZ",
    "4-0": "CA",
    "4-2": "CO",
    "3-9": "CT",
    "6-10": "DC",
    "4-9": "DE",
    "7-8": "FL",
    "6-7": "GA",
    "7-0": "HI",
    "3-4": "IA",
    "2-1": "ID",
    "2-5": "IL",
    "3-5": "IN",
    "5-3": "KS",
    "4-5": "KY",
    "6-4": "LA",
    "2-9": "MA",
    "4-8": "MD",
    "0-10": "ME",
    "2-6": "MI",
    "2-4": "MN",
    "4-4": "MO",
    "6-5": "MS",
    "2-2": "MT",
    "5-6": "NC",
    "2-3": "ND",
    "4-3": "NE",
    "1-10": "NH",
    "3-8": "NJ",
    "5-2": "NM",
    "3-1": "NV",
    "2-8": "NY",
    "3-6": "OH",
    "6-3": "OK",
    "3-0": "OR",
    "3-7": "PA",
    "7-10":"PR",
    "3-10": "RI",
    "5-7": "SC",
    "3-3": "SD",
    "5-5": "TN",
    "7-3": "TX",
    "4-1": "UT",
    "4-7": "VA",
    "1-9": "VT",
    "2-0": "WA",
    "1-5": "WI",
    "4-6": "WV",
    "3-2": "WY",
};

// module.export = makeCartogram;
