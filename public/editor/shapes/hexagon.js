
class Hexagon extends Shape {
    constructor(ctx, x, y, name) {
        super(ctx, x, y, name);

        this._loadGraphicsConfiguration();
        this._hexagonPoints = [];
    }

    _loadGraphicsConfiguration() {
        let config = ShapeStyleConfig['hexagon'];

        this.pointRadius = config.points.radius;
        this.pointColor  = config.points.color;
        this.strokeColor = config.stroke.color;
        this.strokeWidth = config.stroke.width;
    }

    draw() {
        if (this._completed) {
            drawPolygon(this._context, this._hexagonPoints, 
                        this.pointColor, this.pointRadius,
                        this.strokeColor, this.strokeWidth);

        for (let i = 0; i < this._hexagonPoints.length; i++)
            this._points[i]  = this._hexagonPoints[i];

        } else {
            switch(this._state) {
                case 0:
                    drawCircle(this._context, this._points[0], this.pointRadius, this.pointColor);
                    break;
    
                case 1:
                    this._hexagonPoints = computeHexagonPoints(this._points[0], this._points[1]);

                    this._completed = true;
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
            p5 = pointTranslation(this._points[4]),
            p6 = pointTranslation(this._points[5]);

        let l = pointDistance(p1, p2),
            area = (3 * Math.sqrt(3) / 2) * l * l,
            perimeter = 6 * l;

        parentInfo.area = { text: 'Arie hexagon', value: area};
        parentInfo.perimeter = { text: 'Perimetru hexagon', value: perimeter};
        parentInfo.point = { text: 'Coordonate', value: 'A = (' + p1[0] + " , " + p1[1] + ')' + "<br>" 
                                                      + 'B = (' + p2[0] + " , " + p2[1] + ')' + "<br>" 
                                                      + 'C = (' + p3[0] + " , " + p3[1] + ')' + "<br>"
                                                      + 'D = (' + p4[0] + " , " + p4[1] + ')' + "<br>"
                                                      + 'E = (' + p5[0] + " , " + p5[1] + ')' + "<br>"
                                                      + 'F = (' + p6[0] + " , " + p6[1] + ')'};
        return parentInfo;
    }
}