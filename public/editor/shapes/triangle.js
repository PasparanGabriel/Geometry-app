
class Triangle extends Shape {
    constructor(ctx, x, y, name) {
        super(ctx, x, y, name);

        this._loadGraphicsConfiguration();
    }

    _loadGraphicsConfiguration() {
        let config = ShapeStyleConfig['triangle'];

        this.pointRadius = config.points.radius;
        this.pointColor  = config.points.color;
        this.strokeColor = config.stroke.color;
        this.strokeWidth = config.stroke.width;
    }

    draw() {
        if (this._completed) {
            drawLine(this._context, this._points[0], this._points[1], this.strokeColor, this.strokeWidth);
            drawLine(this._context, this._points[1], this._points[2], this.strokeColor, this.strokeWidth);
            drawLine(this._context, this._points[2], this._points[0], this.strokeColor, this.strokeWidth);

            drawCircle(this._context, this._points[0], this.pointRadius, this.pointColor);
            drawCircle(this._context, this._points[1], this.pointRadius, this.pointColor);
            drawCircle(this._context, this._points[2], this.pointRadius, this.pointColor);

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
                    this._completed = true;
                    break;
            }
        }
    }

    info() {
        let parentInfo = super.info();

        let p1 = pointTranslation(this._points[0]),
            p2 = pointTranslation(this._points[1]),
            p3 = pointTranslation(this._points[2]);   

        let a = pointDistance(p1, p2),
            b = pointDistance(p2, p3),
            c = pointDistance(p3, p1),
            p = (a + b + c) / 2,
            area = Math.sqrt(p * (p - a) * (p - b) * (p - c)),
            perimeter = a + b + c;

        parentInfo.area = { text: 'Arie triunghi', value: area};
        parentInfo.perimeter = { text: 'Perimetru triunghi', value: perimeter};
        parentInfo.point = { text: 'Coordonate', value: 'A = (' + p1[0] + " , " + p1[1] + ')' + "<br>" 
                                                      + 'B = (' + p2[0] + " , " + p2[1] + ')' + "<br>" 
                                                      + 'C = (' + p3[0] + " , " + p3[1] + ')'};
        return parentInfo;
    }
}