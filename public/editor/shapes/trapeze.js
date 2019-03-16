
class Trapeze extends Shape {
    constructor(ctx, x, y, name) {
        super(ctx, x, y, name);

        this._loadGraphicsConfiguration();
    }

    _loadGraphicsConfiguration() {
        let config = ShapeStyleConfig['trapeze'];

        this.pointRadius = config.points.radius;
        this.pointColor  = config.points.color;
        this.strokeColor = config.stroke.color;
        this.strokeWidth = config.stroke.width;
        this.clickTreshold = 10;
    }

    draw() {
        if (this._completed) {
            drawLine(this._context, this._points[0], this._points[1], this.strokeColor, this.strokeWidth);
            drawLine(this._context, this._points[1], this._points[2], this.strokeColor, this.strokeWidth);
            drawLine(this._context, this._points[2], this._points[3], this.strokeColor, this.strokeWidth);
            drawLine(this._context, this._points[3], this._points[0], this.strokeColor, this.strokeWidth);

            drawCircle(this._context, this._points[0], this.pointRadius, this.pointColor);
            drawCircle(this._context, this._points[1], this.pointRadius, this.pointColor);
            drawCircle(this._context, this._points[2], this.pointRadius, this.pointColor);
            drawCircle(this._context, this._points[3], this.pointRadius, this.pointColor);

        } else {
            switch(this._state) {
                case 0:
                    drawCircle(this._context, this._points[0], this.pointRadius, this.pointColor);
                    break;

                case 1:
                    drawLine(this._context, this._points[0], this._points[1], this.strokeColor, this.strokeWidth);
                    drawCircle(this._context, this._points[0], this.pointRadius, this.pointColor);
                    drawCircle(this._context, this._points[1], this.pointRadius, this.pointColor);
                    break;

                case 2:
                    let closeToLine = this._isPointCloseToLine(this._points[2], this._points[0], this._points[1], this.clickTreshold);
        
                    if (closeToLine) {
                        document.getElementById('alert_afis').innerHTML = "Trebuie sa dai click in afara dreaptei";
                        document.getElementById("alert_afis").style.visibility = "visible";
                        this._points.pop();
                        this._state--;
                    } else {
                        drawLine(this._context, this._points[0], this._points[1], this.strokeColor, this.strokeWidth);
                        drawLine(this._context, this._points[1], this._points[2], this.strokeColor, this.strokeWidth);

                        drawCircle(this._context, this._points[0], this.pointRadius, this.pointColor);
                        drawCircle(this._context, this._points[1], this.pointRadius, this.pointColor);
                        drawCircle(this._context, this._points[2], this.pointRadius, this.pointColor);

                        let g = 3000;

                        if (this._points[0][1] === this._points[1][1]) {
                            let p_1 = [g, this._points[2][1]],
                                p_2 = [-g, this._points[2][1]];
    
                            if (this._points[0][0] > this._points[1][0]) {
                                // left
                                drawDottedLine(this._context, this._points[2], p_1);
                            } else {
                                // right
                                drawDottedLine(this._context, this._points[2], p_2);
                            }

                        } else {
                            if (this._points[0][0] === this._points[1][0]) {
    
                                let p_1 = [this._points[2][0], g],
                                    p_2 = [this._points[2][0], -g];
    
                                if (this._points[0][1] > this._points[1][1]) {
                                    // up
                                    drawDottedLine(this._context, this._points[2], p_1);
                                } else {
                                    // down
                                    drawDottedLine(this._context, this._points[2], p_2);
                                }
        
                            } else {
                                let dx = this._points[0][0] - this._points[1][0],
                                    dy = this._points[0][1] - this._points[1][1],
                                    slope = dy / dx,
                                    perpSlope = slope;
    
                                let xA = this._points[2][0] + Math.sqrt(g * g /(1 + perpSlope * perpSlope)),
                                    yA = this._points[2][1] + perpSlope * Math.sqrt(g * g /(1 + perpSlope * perpSlope)),
                                    xB = this._points[2][0] - Math.sqrt(g * g /(1 + perpSlope * perpSlope)),
                                    yB = this._points[2][1] - perpSlope * Math.sqrt(g * g /(1 + perpSlope * perpSlope));
        

                                let signNum1 = evalLineEquation(this._points[1], this._points[2], this._points[0]),
                                    signNum2 = evalLineEquation(this._points[1], this._points[2], [xA, yA]);

                                if (signNum1 * signNum2 >= 0) { 
                                    drawDottedLine(this._context, [xA, yA], this._points[2]);
                                    this._pointAChosen = true;
                                } else {
                                    drawDottedLine(this._context, this._points[2], [xB, yB]);
                                }
    
                            }
                        }
                    }
                    break;
                
                case 3:
                    let dx = this._points[0][0] - this._points[1][0],
                        dy = this._points[0][1] - this._points[1][1],
                        slope = dy / dx,
                        perpSlope = slope;

                    let g = 3000;

                    let xA = this._points[2][0] + Math.sqrt(g * g /(1 + perpSlope * perpSlope)),
                        yA = this._points[2][1] + perpSlope * Math.sqrt(g * g /(1 + perpSlope * perpSlope)),
                        xB = this._points[2][0] - Math.sqrt(g * g /(1 + perpSlope * perpSlope)),
                        yB = this._points[2][1] - perpSlope * Math.sqrt(g * g /(1 + perpSlope * perpSlope)),
                        A = [xA, yA],
                        B = [xB, yB];

                    let isCloseToLine = this._isPointCloseToLine(this._points[3], A, B, this.clickTreshold);

                    if (isCloseToLine) {
                        let ok = false;

                        // project point
                        let pointOnLine = this._projectPointOnLine(this._points[3], A, B);

                        if (pointOnLine[0] === this._points[2][0]) { // same X, test Y
                            if (this._points[0][1] > this._points[1][1]) { // point 1 up
                                if (isPointOnSegment(this._points[2], [this._points[2][0], this._points[2][1] + g], pointOnLine)) {
                                    ok = true;
                                }
                            } else { // point 2 up
                                if (isPointOnSegment(this._points[2], [this._points[2][0], this._points[2][1] - g], pointOnLine)) {
                                    ok = true;
                                }
                            }
                        }

                        if (pointOnLine[1] === this._points[2][1]) { // same Y, test X
                            if (this._points[0][0] > this._points[1][0]) { // point 1 right
                                if (isPointOnSegment(this._points[2], [this._points[2][0] + g, this._points[2][1]], pointOnLine)) {
                                    ok = true;
                                }
                            } else { // point 2 right
                                if (isPointOnSegment(this._points[2], [this._points[2][0] - g, this._points[2][1]], pointOnLine)) {
                                    ok = true;
                                }
                            }
                        }

                        // check to see if it's on the segment [2, g]
                        if (this._pointAChosen) {
                            if (isPointOnSegment(A, this._points[2], pointOnLine)) {
                                ok = true;
                            }
                        } else {
                            // was point B
                            if (isPointOnSegment(B, this._points[2], pointOnLine)) {
                                ok = true;
                            }
                        }

                        // test for parallelisim;
                        let d1 = pointDistance(this._points[0], this._points[1]),
                            d2 = pointDistance(this._points[2], pointOnLine);

                        if (d1 === d2) {
                            document.getElementById('alert_afis').innerHTML = "Laturile sunt paralele. Alege alt punct.";
                            document.getElementById("alert_afis").style.visibility = "visible";
                            ok = false;
                        }

                        // remove current click point
                        this._points.pop();

                        if (ok) {
                            this._points.push(pointOnLine);
                            this._completed = true;
                        } else {
                            this._state--;
                        }
                        document.getElementById('alert_afis').innerHTML = "";
                        document.getElementById("alert_afis").style.visibility = "hidden";
                    } else {
                        document.getElementById('alert_afis').innerHTML = "Dai click mai aproape!";
                        document.getElementById("alert_afis").style.visibility = "visible";

                        // reset state
                        this._points.pop();
                        this._state--;
                    }
                    break;
            }
        }
    }

    info() {
        let parentInfo = super.info();

        let p1 = pointTranslation(this._points[0]),
            p2 = pointTranslation(this._points[1]),
            p3 = pointTranslation(this._points[2]),
            p4 = pointTranslation(this._points[3]);
            
        let projection = this._projectPointOnLine(p1, p3, p4),
            h = pointDistance(p1, projection);

        let a = pointDistance(p1, p2),
            b = pointDistance(p2, p3),
            c = pointDistance(p3, p4),
            d = pointDistance(p4, p1),
            area = (a + c) * h / 2,
            perimeter = a + b + c + d;

        parentInfo.area = { text: 'Arie trapez', value: area};
        parentInfo.perimeter = { text: 'Perimetru trapez', value: perimeter};
        parentInfo.point = { text: 'Coordonate', value: 'A = (' + p1[0] + " , " + p1[1] + ')' + "<br>" 
                                                      + 'B = (' + p2[0] + " , " + p2[1] + ')' + "<br>" 
                                                      + 'C = (' + p3[0] + " , " + p3[1] + ')' + "<br>"
                                                      + 'D = (' + p4[0] + " , " + p4[1] + ')'};
        return parentInfo;
    }
}