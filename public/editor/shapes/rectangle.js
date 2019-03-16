
class Rectangle extends Shape {
    constructor(ctx, x, y, name) {
        super(ctx, x, y, name);

        this._loadGraphicsConfiguration();
    }

    _loadGraphicsConfiguration() {
        let config = ShapeStyleConfig['rectangle'];

        this.pointRadius = config.points.radius;
        this.pointColor  = config.points.color;
        this.strokeColor = config.stroke.color;
        this.strokeWidth = config.stroke.width;
        this.clickTreshold = 10;
    }

    draw() {
        if (this._completed) {

            let reflected = this._points[this._points.length - 1];

            drawLine(this._context, this._points[0], this._points[1], this.strokeColor, this.strokeWidth);
            drawLine(this._context, this._points[1], this._points[2], this.strokeColor, this.strokeWidth);
            drawLine(this._context, this._points[2], reflected, this.strokeColor, this.strokeWidth);
            drawLine(this._context, reflected, this._points[0], this.strokeColor, this.strokeWidth);

            drawCircle(this._context, this._points[0], this.pointRadius, this.pointColor);
            drawCircle(this._context, this._points[1], this.pointRadius, this.pointColor);
            drawCircle(this._context, this._points[2], this.pointRadius, this.pointColor);
            drawCircle(this._context, reflected, this.pointRadius, this.pointColor);

        } else {
            switch(this._state) {
                case 0:
                    drawCircle(this._context, this._points[0], this.pointRadius, this.pointColor);
                    break;

                case 1:
                    
                    let g = 3000;
                    
                    if (this._points[0][1] === this._points[1][1]) {
                        let p_1 = [this._points[1][0], g],
                            p_2 = [this._points[1][0],-g];

                        drawDottedLine(this._context, p_1, p_2);

                    } else {
                        if (this._points[0][0] === this._points[1][0]) {

                            let p_1 = [g, this._points[1][1]],
                                p_2 = [-g, this._points[1][1]];

                            drawDottedLine(this._context, p_1, p_2);   
    
                        } else {
                            let dx = this._points[0][0] - this._points[1][0],
                                dy = this._points[0][1] - this._points[1][1],
                                slope = dy / dx,
                                perpSlope = -1 * 1/slope;

                            let xA = this._points[1][0] + Math.sqrt(g * g /(1 + perpSlope * perpSlope)),
                                yA = this._points[1][1] + perpSlope * Math.sqrt(g * g /(1 + perpSlope * perpSlope)),
                                xB = this._points[1][0] - Math.sqrt(g * g /(1 + perpSlope * perpSlope)),
                                yB = this._points[1][1] - perpSlope * Math.sqrt(g * g /(1 + perpSlope * perpSlope));
    
                            drawDottedLine(this._context, [xA, yA], [xB, yB]);

                        }
                    }

                    drawCircle(this._context, this._points[0], this.pointRadius, this.pointColor);
                    drawCircle(this._context, this._points[1], this.pointRadius, this.pointColor);
                    
                    break;
    
                case 2:
                    let pPos = circleMethodPositive(this._points[0], this._points[1], this._points[1], 1),
                        pNeg = circleMethodNegative(this._points[0], this._points[1], this._points[1], 1);
                
                    if (this._isPointCloseToLine(this._points[2], pPos, pNeg, this.clickTreshold)) {
                        let proj = this._projectPointOnLine(this._points[2], pPos, pNeg);

                        this._points.pop();

                        this._points.push(proj);

                        this._completed = true;

                        let middle = pAdd(this._points[0], this._points[1]);
            
                        let reflectedX = middle[0] - this._points[2][0] - 2 * (this._points[1][0] - this._points[2][0]),
                            reflectedY = middle[1] - this._points[2][1] - 2 * (this._points[1][1] - this._points[2][1]),
                            reflected = [reflectedX, reflectedY];
                            
                        this._points.push(reflected);

                        document.getElementById('alert_afis').innerHTML = "";
                        document.getElementById("alert_afis").style.visibility = "hidden";
                    } else {
                        this._points.pop();

                        document.getElementById('alert_afis').innerHTML = "Dai click mai aproape!";
                        document.getElementById("alert_afis").style.visibility = "visible";                   

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

        let a = pointDistance(p1, p2),
            b = pointDistance(p2, p3),
            area = a * b,
            perimeter = 2 * (a + b);

        parentInfo.area = { text: 'Arie dreptunghi', value: area};
        parentInfo.perimeter = { text: 'Perimetru dreptunghi', value: perimeter};
        parentInfo.point = { text: 'Coordonate', value: 'A = (' + p1[0] + " , " + p1[1] + ')' + "<br>" 
                                                      + 'B = (' + p2[0] + " , " + p2[1] + ')' + "<br>" 
                                                      + 'C = (' + p3[0] + " , " + p3[1] + ')' + "<br>"
                                                      + 'D = (' + p4[0] + " , " + p4[1] + ')'};
        return parentInfo;
    }
}