
function pointDistance(p1, p2) {
    let dx = p2[0] - p1[0],
        dy = p2[1] - p1[1];
    return Math.sqrt(dx * dx + dy * dy);
}

// Distance between two points
function dist(x0, y0, x1, y1) {
    let dx = x0 - x1,
        dy = y0 - y1;
    
    return Math.sqrt(dx * dx + dy * dy);
}

function insideCircle(center, point, radius) {
    let d = pointDistance(center, point);
    return d <= radius;
}

function pointsEqual(p1,p2) {
    return p1[0] === p2[0] && p1[1] === p2[1];
}

function pointsEqualThreshold(p1,p2, limit) {
    let d = pointDistance(p1, p2);
    return d <= limit;
}

function angleBetweenVectors(v1, v2) {
    let m1 = vLength(v1),
        m2 = vLength(v2),
        dot = vDot(v1, v2),
        angle = dot / (m1 * m2);

    return Math.acos(angle);
}

function angleBetweenVectorsDeg(v1, v2) {
    return angleBetweenVectors(v1,v2) * 180 / Math.PI;
}

function angleBetweenPoints(p1, p2) {
    let dx = p2[0] - p1[0],
        dy = p2[1] - p1[1];
    
    return Math.atan2(dy, dx);
}

function angleBetweenPointsDeg(p1, p2) {
    return angleBetweenPoints(p1,p2) * 180 / Math.PI;
}

function computeHexagonPoints(c, p) {
    return computePointsOnCircle(c, p, 6);
}

function computePentagonPoints(c, p) {
    return computePointsOnCircle(c, p, 5);
}

function computeOctagonPoints(c, p) {
    return computePointsOnCircle(c, p, 8);
}

function computePointsOnCircle(c, p, N) {
    let incrementAngle = 2 * Math.PI / N,
        angleBetween = angleBetweenPoints(c, p),
        dist = pointDistance(c, p);
        
    let points = [];
    for(let i = 0; i < N; i++) {
        let x = c[0] + dist * Math.cos(angleBetween + i * incrementAngle),
            y = c[1] + dist * Math.sin(angleBetween + i * incrementAngle);
        
        points.push([x, y]);
    }

    return points;
}



//////////////////////
// POINT OPERATIONS //
//////////////////////

// the length of a vector
function vLength(v) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
}

// dot product between two vectors
function vDot(v1, v2) {
    return v1[0] * v2[0] + v1[1] * v2[1];
}

// Addition operation defined on points
function pAdd(p1, p2) {
    return [
        p1[0] + p2[0],
        p1[1] + p2[1]
    ];
}

// Subtraction operation defined on points
function pSub(p1, p2) {
    return [
        p1[0] - p2[0],
        p1[1] - p2[1]
    ];
}

// Multiplication operation on points
function pMul(scalar, p) {
    return [scalar * p[0], scalar * p[1]];
}

function circleMethodPositive(A, B, P, radius) {
    let dx = A[0] - B[0],
        dy = A[1] - B[1],
        slope = dy / dx,
        perpSlope = -1 * 1/slope;

    let xA = P[0] + Math.sqrt(radius * radius /(1 + perpSlope * perpSlope)),
        yA = P[1] + perpSlope * Math.sqrt(radius * radius /(1 + perpSlope * perpSlope));

    return [xA, yA];
}

function circleMethodNegative(A, B, P, radius) {
    let dx = A[0] - B[0],
        dy = A[1] - B[1],
        slope = dy / dx,
        perpSlope = -1 * 1/slope;

    let xA = P[0] - Math.sqrt(radius * radius /(1 + perpSlope * perpSlope)),
        yA = P[1] - perpSlope * Math.sqrt(radius * radius /(1 + perpSlope * perpSlope));

    return [xA, yA];
}


function computeItersectionPoint(A, B, C, D) {
    let a1 = A[1] - B[1],
        b1 = B[0] - A[0],
        c1 = A[0]*B[1] - A[1]*B[0],
        a2 = C[1] - D[1],
        b2 = D[0] - C[0],
        c2 = C[0]*D[1] - C[1]*D[0];

    let x = 0,
        y = 0;

    if(a1 != 0) {
        y = (a2 * c1 - a1 * c2)/(a1 * b2 - a2 * b1);
        x = (-1*c1 - b1* y)/a1;
    } else {
        y = (a1 * c2 - a2 * c1)/(a2 * b1 - a1 * b2);
        x = (-1*c2 - b2* y)/a2;
    }
    return [x, y];
}

function evalLineEquation(A, B, P) {
    return P[0]*(B[1]-A[1]) - P[1]*(B[0]-A[0]) - A[0]*B[1] + B[0]*A[1];
}

function isPointOnSegment (A, B, P) {
    let startPoint = { x : A[0], y : A[1] },
        endPoint = { x : B[0], y : B[1] },
        checkPoint = { x: P[0], y: P[1] };

    if (startPoint.x === endPoint.x) {
        return Math.min(startPoint.y, endPoint.y) <= checkPoint.y &&
               Math.max(startPoint.y, endPoint.y) >= checkPoint.y;
    }

    if (startPoint.y === endPoint.y) {
        return Math.min(startPoint.x, endPoint.x) <= checkPoint.x &&
               Math.max(startPoint.x, endPoint.x) >= checkPoint.x;
    }

    return ((endPoint.y - startPoint.y) * (checkPoint.x - startPoint.x)).toFixed(0) === ((checkPoint.y - startPoint.y) * (endPoint.x - startPoint.x)).toFixed(0) &&
            ((startPoint.x > checkPoint.x && checkPoint.x > endPoint.x) || (startPoint.x < checkPoint.x && checkPoint.x < endPoint.x)) &&
            ((startPoint.y >= checkPoint.y && checkPoint.y >= endPoint.y) || (startPoint.y <= checkPoint.y && checkPoint.y <= endPoint.y));
}