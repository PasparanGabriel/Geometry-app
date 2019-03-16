
class Circle extends Shape {
    constructor(ctx, x, y, name) {
        super(ctx, x, y, name);

        this._loadGraphicsConfiguration();
    }

    _loadGraphicsConfiguration() {
        let config = ShapeStyleConfig['circle'];

        this.pointRadius = config.points.radius;
        this.pointColor  = config.points.color;
        this.strokeColor = config.stroke.color;
        this.strokeWidth = config.stroke.width;
        this.pointFill = 'transparent';
    }

    draw() {
        if (this._completed) { 
            let bigCircleRadius = pointDistance(this._points[0], this._points[1]);

            drawCircle(this._context, this._points[0], bigCircleRadius, this.pointFill, this.strokeColor, this.strokeWidth);

            drawLine(this._context, this._points[0], this._points[1]);
            drawCircle(this._context, this._points[0], this.pointRadius, this.pointColor);
            drawCircle(this._context, this._points[1], this.pointRadius, this.pointColor);

            if (this._collided) {
                drawCircle(this._context, this._points[this._collidedPointIndex], 10, 'red');
            }

        } else {
            switch(this._state) {
                case 0:
                    drawCircle(this._context, this._points[0], this.pointRadius, this.pointColor);
                    break;
    
                case 1:
                    this._completed = true;
                    break;
            }
        }
    }

    info() {
        let parentInfo = super.info();

        let p1 = pointTranslation(this._points[0]),
            p2 = pointTranslation(this._points[1]);

        let radius = pointDistance(p1, p2),
            area = radius * radius * Math.PI,
            perimeter = 2 * Math.PI * radius;

        parentInfo.area = { text: 'Arie cerc', value: area};
        parentInfo.perimeter = { text: 'Circumferinta cerc', value: perimeter};
        parentInfo.point = { text: 'Coordonate', value: 'A = (' + p1[0] + " , " + p1[1] + ')' + "<br>" 
                                                      + 'B = (' + p2[0] + " , " + p2[1] + ')'};
        return parentInfo;
    }
}