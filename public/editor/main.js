
window.onload = initApplication;

function initApplication() {
    let shape_type = 'circle';
    let object_id = 0;
    let currentShape = null;
    let shapeConstructors = {
        'circle': Circle,
        'triangle': Triangle,
        'square': Square,
        'rhombus': Rhombus,
        'rectangle': Rectangle,
        'parallelogram': Parallelogram,
        'trapeze': Trapeze,
        'pentagon': Pentagon,
        'hexagon': Hexagon,
        'octagon': Octagon
    };

    let shapeActivated = false;

    let outputMessage = document.getElementById('output-message');
    let activateButton = document.getElementById('activateButton');
    let eraserButton = document.getElementById('eraserButton');
    let dropdownShapes = document.getElementById('dropdown-shapes');

    // Shapes in the canvas
    let shapes = [];
    let activeShapeIndex = -1;
    let cursorInsideCanvas = false;

	let canvas = $('#paper')[0],
        context = canvas.getContext('2d'),
        width = canvas.width = window.innerWidth - 295,
        height = canvas.height = window.innerHeight - 105;

    canvas.addEventListener('mouseenter', (event) => {
        cursorInsideCanvas = true;
    });

    canvas.addEventListener('mouseleave', (event) => {
        cursorInsideCanvas = false;
    });

    eraserButton.addEventListener('click', (event) => {
        if (currentShape) {
            shapes.splice(activeShapeIndex, 1);
            activeShapeIndex = -1;
            currentShape = null;
            return;
        }

        if (shapes.length >= 1)
            shapes.pop(activeShapeIndex);
    });

    let links = document.querySelectorAll('a[data-shape]');
    links.forEach(link => link.addEventListener('click', event => {
        shape_type = event.target.getAttribute('data-shape');
        outputMessage.innerHTML = event.target.innerHTML;
    }));

    function handleKeyDown(event) {
        if (activeShapeIndex !== -1) {
            let increment = ShapeStyleConfig['increment'];

            switch (event.keyCode) {
                case 38: // SUS
                    shapes[activeShapeIndex].moveBy(0, -increment);
                    break;
                case 40: // JOS
                    shapes[activeShapeIndex].moveBy(0, increment);
                    break;
                case 37: // STANGA
                    shapes[activeShapeIndex].moveBy(-increment, 0);
                    break;
                case 39: // DREAPTA
                    shapes[activeShapeIndex].moveBy(increment, 0);
                    break;
                default:
                    console.log(event.keyCode);
            }
        }
    }

    function handleKeyUp(event) {
        console.log(event.keyCode);
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    canvas.addEventListener('click', (event) => {
        let coordX = event.offsetX,
            coordY = event.offsetY;

        if (shapeActivated) {
            let foundShape = false;

            deactivateAllShapes();
            for (let i = shapes.length-1; i >= 0; i--) {
                if (shapes[i].checkCollissionPoint(coordX, coordY)) {
                    activeShapeIndex = i;
                    currentShape = shapes[activeShapeIndex];
                    foundShape = true;
                    break;
                }
            }
    
            if (foundShape) {
                let infoObject = currentShape.info();

                let htmlMeniuInfo = buildInfoMenu(infoObject);
    
                document.getElementById('infoMenu').innerHTML = htmlMeniuInfo;
                setupInfoMenu(infoObject);
            } else {
                if (currentShape)
                    document.getElementById('infoMenu').innerHTML = '';
            }

            return;
        }

        if (currentShape == null || currentShape.completed) {
            // disable the activation button
            activateButton.setAttribute('disabled', '');

            let Constr = shapeConstructors[shape_type];
            object_id++;

            let shape = new Constr(context, coordX, coordY, `${shape_type} ${object_id}`);
            shapes.push(shape);
            currentShape = shape;
        } else {
            if (currentShape.fail) {
                let currentIndex = shapes.findIndex(elem => elem == currentShape);
                shapes.splice(currentIndex, 1);
                currentShape = null;
            } else {
                currentShape.changeState(coordX, coordY);
            }          
        }
    });
    
	let mouseX = width / 2,
        mouseY = height / 2;

    update();    

    function update() {
        draw();
        requestAnimationFrame(update);
    }

    function draw() {
        if (currentShape && currentShape.completed) {
            activateButton.removeAttribute('disabled');
            dropdownShapes.classList.remove('disabled');
        }

        if (currentShape && !currentShape.completed) {
            dropdownShapes.classList.add('disabled');
        }

        if (shapes.length != 0) {
            document.getElementById("div_scale").style.visibility = "hidden";
        } else {
            document.getElementById("div_scale").style.visibility = "visible";
        }

        context.clearRect(0, 0, width, height);
        
        drawGrid();

        for(let i = 0; i < shapes.length; i++) {
            shapes[i].update();
            shapes[i].drawShape();
        }
    }

    function drawGrid() {
        drawSquares(context, width, height);
        drawAxes(context, width, height);
        drawMousePosition(context, cursorInsideCanvas, mouseX, mouseY, width, height);
        
        if (cursorInsideCanvas) {
            drawCircleAtMouse(context, mouseX, mouseY);
        }
    }
	
	// Update mouse position
    canvas.addEventListener("mousemove", function(event) {
        mouseX = event.offsetX;
        mouseY = event.offsetY;
    });

    activateButton.addEventListener('click', function(event) {
        if (!shapeActivated) {
            shapeActivated = true;
    
            dropdownShapes.classList.add('disabled');

            eraserButton.classList.remove('disabled');

            activateButton.innerHTML = 'Dezactivează';
        } else {
            activateButton.innerHTML = 'Activează';
            dropdownShapes.classList.remove('disabled');

            eraserButton.classList.add('disabled');
            shapeActivated = false;

            currentShape = null;
            activeShapeIndex = -1;

            document.getElementById('infoMenu').innerHTML = '';

            deactivateAllShapes();
        }
    });

    function deactivateAllShapes() {
        for (let i = 0; i < shapes.length; i++) {
            if (shapes[i]._collided) {
                shapes[i]._collided = false;
                shapes[i]._collidedPointIndex = -1;
            }
        }
    }
}


function buildInfoMenu(infoObject) {
    let options = '';
    let keys = Object.keys(infoObject);

    for (let i = 0; i < keys.length; i++) {
        let currentOption = `<option value="${keys[i]}">${infoObject[keys[i]].text}</option>`;
        options += currentOption;
    }

    let html = `
        <select id="object-info-menu" class="custom-select custom-select-sm">
            <option selected>Informatii</option>
            ${options}
        </select>
        <hr>

        <p><strong id="property-text"></strong><br><span id="property-value"></span></p>
    `;
    
    return html;
}

function setupInfoMenu(infoObject) {
    let infoMenu = document.getElementById('object-info-menu');

    infoMenu.addEventListener('change', function() {
        if (this[this.selectedIndex].text !== 'Informatii') {
            let key = this[this.selectedIndex].value;
            let text = infoObject[key].text,
                value = infoObject[key].value;

            document.getElementById('property-text').innerHTML = text;
            document.getElementById('property-value').innerHTML = value;
        } else {
            document.getElementById('property-text').innerHTML = '';
            document.getElementById('property-value').innerHTML = '';
        }
    });
}
