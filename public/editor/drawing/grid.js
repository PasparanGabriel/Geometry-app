
// Draw Squares
function drawSquares(context, width, height) {
    let x_current = width / 2,
        y_current = height / 2;
    
    let line_spacing_x = 25,        
        line_spacing_y = 25;
    
    while(x_current <= width) {
        context.beginPath();
        context.moveTo(x_current, 0);
        context.lineTo(x_current, height);
        context.stroke();

        x_current += line_spacing_x;
    }

    x_current = width / 2;
    
    while(0 <= x_current) {
        context.beginPath();
        context.moveTo(x_current, 0);
        context.lineTo(x_current, height);
        context.stroke();

        x_current -= line_spacing_x;
    }
    
    while(y_current <= height) {
        context.beginPath();
        context.moveTo(0, y_current);
        context.lineTo(width, y_current);
        context.stroke();

        y_current += line_spacing_y;
    }

    y_current = height / 2;

    while(0 <= y_current) {
        context.beginPath();
        context.moveTo(0, y_current);
        context.lineTo(width, y_current);
        context.stroke();

        y_current -= line_spacing_y;
    }
}

// Draw Axes
function drawAxes(context, width, height) {
    context.save();
        context.lineWidth = 2;
        context.strokeStyle = 'red';
        context.beginPath();

        // axa Ox
        context.moveTo(0, height / 2);
        context.lineTo(width, height / 2);

        // axa /
        context.moveTo(width - 15, height / 2 - 10);
        context.lineTo(width, height / 2);

        // axa \
        context.moveTo(width - 15, height / 2 + 10);
        context.lineTo(width, height / 2);


        // axa Oy
        context.moveTo(width / 2, 0);
        context.lineTo(width / 2, height - 5);

        // axa /
        context.moveTo(width / 2 - 10, 15);
        context.lineTo(width / 2, 0);

        // axa \
        context.moveTo(width / 2 + 10, 15);
        context.lineTo(width / 2, 0);

        context.stroke(); 
    context.restore();
}

//Draw Mouse Position
function drawMousePosition(context, cursorInsideCanvas, mouseX, mouseY, width, height) {
    if (cursorInsideCanvas) {
        [newCoordX, newCoordY] = pointTranslation([mouseX, mouseY]);
        
        let mousePositionStr = '(' + newCoordX + ',' + newCoordY + ')';

        context.save();
            context.fillStyle = 'white';
            context.fillRect(width - 120, height - 40, 100, 27);
        context.restore();

        context.font = "16px Arial";
        context.fillText(mousePositionStr, width - 120, height - 20);  
    }
}

// Draw Circle Mouse
function drawCircleAtMouse(context, mouseX, mouseY) {
    context.beginPath();
    [newCoordX, newCoordY] = [mouseX, mouseY];
    
    context.arc(newCoordX, newCoordY, 5, Math.PI * 2, false);
    context.arc(newCoordX, newCoordY, 9, Math.PI * 2, false);

        context.moveTo(newCoordX, newCoordY - 5);
        context.lineTo(newCoordX, newCoordY - 10);

        context.moveTo(newCoordX, newCoordY + 5);
        context.lineTo(newCoordX, newCoordY + 10);

        context.moveTo(newCoordX - 5, newCoordY);
        context.lineTo(newCoordX - 10, newCoordY);

        context.moveTo(newCoordX + 5, newCoordY);
        context.lineTo(newCoordX + 10, newCoordY);
    context.stroke();
}
