
function pointTranslation(point) {
    let x = point[0],
        y = point[1];

    let increment = ShapeStyleConfig['increment'],
        scale_grid = ShapeStyleConfig['scale_grid'];

    let canvasHeight = window.innerHeight - 105,
        canvasWidth = window.innerWidth - 295;
    
    var newCoordX = (((x - Math.round(canvasWidth / 2)) / increment).toFixed(1) * scale_grid),
        newCoordY = (((Math.round(canvasHeight / 2) - y) / increment).toFixed(1) * scale_grid);

    return [newCoordX, newCoordY];
}