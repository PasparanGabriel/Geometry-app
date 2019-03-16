
function drawCircle(ctx, center, radius, fill, stroke, strokeWidth) {
    fill = fill || 'transparent';
    stroke = stroke || 'black';
    strokeWidth = strokeWidth || 0;

    ctx.save();
        ctx.lineWidth = strokeWidth;
        ctx.fillStyle = fill;
        ctx.strokeStyle = stroke;
        ctx.beginPath();
            ctx.arc(center[0], center[1], radius, 0, Math.PI * 2);
        ctx.fill();
        if (strokeWidth !== 0)
            ctx.stroke();
    ctx.restore();
}


function drawLine(ctx, p1, p2, stroke, strokeWidth) {
    stroke = stroke || 'black';
    strokeWidth = strokeWidth || 3;

    ctx.save();
        ctx.lineWidth = strokeWidth;
        ctx.strokeStyle = stroke;
        ctx.beginPath();
            ctx.moveTo(p1[0], p1[1]);
            ctx.lineTo(p2[0], p2[1]);
        ctx.stroke();
    ctx.restore();
}

function drawDottedLine(ctx, p1, p2, stroke, strokeWidth) {
    stroke = stroke || 'black';
    strokeWidth = strokeWidth || 3;

    ctx.save();
        ctx.lineWidth = strokeWidth;
        ctx.strokeStyle = stroke;
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
            ctx.moveTo(p1[0], p1[1]);
            ctx.lineTo(p2[0], p2[1]);
        ctx.stroke();
    ctx.restore();
}