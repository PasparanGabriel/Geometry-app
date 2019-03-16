
class Rhombus extends Shape {
    constructor(ctx, x, y, name) {
        super(ctx, x, y, name);

        this._loadGraphicsConfiguration();
    }

    _loadGraphicsConfiguration() {
        let config = ShapeStyleConfig['rhombus'];

        this.pointRadius = config.points.radius;
        this.pointColor  = config.points.color;
        this.strokeColor = config.stroke.color;
        this.strokeWidth = config.stroke.width;
        this.clickTreshold = 10;
    }

    draw() {
        if (this._completed) {
            let reflected = this._points[this._points.length - 1];

            drawLine(this._context, this._points[0], this._points[2], this.strokeColor, this.strokeWidth);
            drawLine(this._context, this._points[2], this._points[1], this.strokeColor, this.strokeWidth);
            drawLine(this._context, this._points[1], reflected, this.strokeColor, this.strokeWidth);
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
                    drawCircle(this._context, this._points[0], this.pointRadius, this.pointColor);
                    drawCircle(this._context, this._points[1], this.pointRadius, this.pointColor);

                    let middle = pMul(0.5, pAdd(this._points[0], this._points[1]));

                    let g = 3000;
                    
                    if (this._points[0][1] === this._points[1][1]) {
                        let p1 = [middle[0], g],
                            p2 = [middle[0],-g];
                        
                        drawDottedLine(this._context, p1, p2);   

                    } else {
                        if (this._points[0][0] === this._points[1][0]) {

                            let p1 = pAdd(middle, [g, 0]),
                                p2 = pAdd(middle, [-g, 0]);
    
                            drawDottedLine(this._context, p1, p2); 
    
                        } else {
                            let dx = this._points[0][0] - this._points[1][0],
                            dy = this._points[0][1] - this._points[1][1],
                            slope = dy / dx,
                            perpSlope = -1 * 1/slope;

                            let xA = middle[0] + Math.sqrt(g * g /(1 + perpSlope * perpSlope)),
                                yA = middle[1] + perpSlope * Math.sqrt(g * g /(1 + perpSlope * perpSlope)),
                                xB = middle[0] - Math.sqrt(g * g /(1 + perpSlope * perpSlope)),
                                yB = middle[1] - perpSlope * Math.sqrt(g * g /(1 + perpSlope * perpSlope));

                            drawDottedLine(this._context, [xA, yA], [xB, yB]);
                        }
                    }
                    break;
    
                case 2:
                    let middlePoint = pMul(0.5, pAdd(this._points[0], this._points[1]));

                    let pPos = circleMethodPositive(this._points[0], this._points[1], middlePoint, 1),
                        pNeg = circleMethodNegative(this._points[0], this._points[1], middlePoint, 1);
                
                    if (this._isPointCloseToLine(this._points[2], pPos, pNeg, this.clickTreshold)) {
                        let proj = this._projectPointOnLine(this._points[2], pPos, pNeg);

                        this._points.pop();

                        this._points.push(proj);

                        this._completed = true;

                        let middle = pAdd(this._points[0], this._points[1]);

                        let reflectedX = middle[0] - this._points[2][0],
                            reflectedY = middle[1] - this._points[2][1],
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
            p4 = pointTranslation(this._points[3]), 

            p = pointDistance(p1, p2),
            q = pointDistance(p3, p4),
            d = pointDistance(p1,p3),

            area = p * q / 2,
            perimeter = 4 * d;

        parentInfo.area = { text: 'Arie romb', value: area};
        parentInfo.perimeter = { text: 'Perimetru romb', value: perimeter};
        parentInfo.point = { text: 'Coordonate', value: 'A = (' + p1[0] + " , " + p1[1] + ')' + "<br>" 
                                                      + 'B = (' + p3[0] + " , " + p3[1] + ')' + "<br>" 
                                                      + 'C = (' + p2[0] + " , " + p2[1] + ')' + "<br>"
                                                      + 'D = (' + p4[0] + " , " + p4[1] + ')'};
        return parentInfo;
    }
}