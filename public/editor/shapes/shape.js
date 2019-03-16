
class Shape {
    constructor(ctx, x, y, name) {
        this._x = x;
        this._y = y;
        this._name = name || '';
        this._context = ctx;
        this._completed = false;
        this._fail = false;
        this._state = 0;
        this._innerHitRadius = 10;

        this._points = [];
        this._points.push([x, y]);

        this._collided = false;
        this._collidedPointIndex = -1;
    }

    drawBefore() { }
    drawAfter() {
        if (this._collided) {
            drawCircle(this._context, this._points[this._collidedPointIndex], this._innerHitRadius, 'red');
        }
    }

    draw() {
    }

    drawShape () {
        this.drawBefore();
        this.draw();
        this.drawAfter();
    }

    update() {
    }

    checkCollissionPoint(x, y) {
        for (let i = 0; i < this._points.length; i++) {
            if (pointDistance(this._points[i], [x, y]) < this._innerHitRadius) {
                this._collided = true;
                this._collidedPointIndex = i;
                return true;
            }
        }
        this._collided = false;
        this._collidedPointIndex = -1;
        return false;
    }

    _isPointCloseToLine(P, A, B, limit) {
        let projPoint = this._projectPointOnLine(P, A, B);

        let d = pointDistance(P, projPoint);

        return d <= limit;
    }

    _projectPointOnLine(P, A, B) {
        if (A[0] !== B[0]) {

            if (A[1] - B[1] === 0) {
                return [P[0], A[1]];
            } else {
                let positivePoint = circleMethodPositive(A, B, P, 1);

                let intersectionPoint = computeItersectionPoint(A, B, P, positivePoint);

                return intersectionPoint;
            }

        } else {
            return [A[0], P[1]];
        }
    }

    info() {
        return { };
    }

    move(x, y) {
        this._x = x;
        this._y = y;
    }

    moveBy(x, y) {
        for (let i = 0; i < this._points.length; i++) {
            this._points[i][0] += x;
            this._points[i][1] += y;   
        }
    }

    changeState(x, y) {
        if (!this._completed) {
            this._points.push([x, y]);
            this._state++;
        }
    }

    //
    // SETTERS AND GETTERS
    //

    get x() { return this._x; }

    set x(value) { this._x = value; }

    get y() { return this._y; }

    set y(value) { this._y = value; }

    get name() { return this._name; }

    set name(value) { this._name = value; }

    get completed() { return this._completed; }

    get fail() { return this._fail; }

    // drawAngleVectors(options, v1, v2, location, color, textSize) {
    //     // compute angle
    //     let p1 = pointTranslation(v1, options.width, options.height),
    //         p2 = pointTranslation(v2, options.width, options.height),
    //         loc = pointTranslation(location, options.width, options.height);

    //     let angle = angleBetweenVectorsDeg(pSub(p1, loc), pSub(p2, loc)).toFixed(2);

    //     angle = angle + '°';

    //     // draw angles
    //     this._context.save();
    //         this._context.fillStyle = color || "green";
    //         if (textSize)
    //             this._context.font = textSize + "px Arial";
    //         else
    //             this._context.font = "20px Arial";
    //         this._context.fillText(angle, location[0], location[1]);
    //     this._context.restore();
    // }

    // drawAngle(options, point1, point2, location, color, textSize) {
    //     // compute angle
    //     let p1 = pointTranslation(point1, options.width, options.height),
    //         p2 = pointTranslation(point2, options.width, options.height);

    //     location = location || point2;

    //     let angle = angleBetweenPointsDeg(p1,p2).toFixed(2);

    //     angle = angle + '°';

    //     // draw angles
    //     this._context.save();
    //         this._context.fillStyle = color || "green";
    //         if (textSize)
    //             this._context.font = textSize + "px Arial";
    //         else
    //             this._context.font = "20px Arial";
    //         this._context.fillText(angle,location[0], location[1]);
    //     this._context.restore();
    // }
}
