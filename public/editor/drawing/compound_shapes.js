
function drawPolygon(ctx, points, pointColor, pointRadius, strokeColor, strokeWidth) {
    for (let i = 0; i < points.length; i++) {
        drawLine(ctx, points[i % points.length], points[(i + 1) % points.length], strokeColor, strokeWidth);            
    }

    for (let i = 0; i < points.length; i++) {
        drawCircle(ctx, points[i], pointRadius, pointColor);                
    }
}
