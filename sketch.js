const server_url = 'https://surrey.ac:9876';

let model;
let ai_data;

let difficulty_factor = 1.0;
let status = $('#status');
let counting = $('#counting');
let saveTime = 1;

let winner = null;

let clickX = [];
let clickY = [];
let clickDrag = [];

let colorIndex = [];
let colorValue = [];

let lineIndex = [];
let lineValue = [];

let full_length = 0;
let full_length_human = 0;
let canvasXOffset = 0;
let tipShow = false;
let canDraw = false;

let paint;
let prepare = false;
let canClick = true;
let colorfulDiv;

let canvas = document.getElementById("pad_human");
let canvas_ai = document.getElementById("pad_ai");
let score = document.getElementById('score');
let tip = document.getElementById('tip');

let context = canvas.getContext("2d");
let context_ai = canvas_ai.getContext("2d");

document.getElementById('palette').onchange = function(){
    colorIndex.push(clickDrag.length);
    colorValue.push(this.value);
};

let run_classifier_times = 0;
let run_classifier_length = 50;

let class_names_full = ['The Eiffel Tower', 'The Great Wall of China', 'The Mona Lisa',
    'aircraft carrier', 'airplane', 'alarm clock', 'ambulance', 'angel',
    'animal migration', 'ant', 'anvil', 'apple', 'arm', 'asparagus',
    'axe', 'backpack', 'banana', 'bandage', 'barn', 'baseball',
    'baseball bat', 'basket', 'basketball', 'bat', 'bathtub', 'beach',
    'bear', 'beard', 'bed', 'bee', 'belt', 'bench', 'bicycle',
    'binoculars', 'bird', 'birthday_cake', 'blackberry', 'blueberry',
    'book', 'boomerang', 'bottlecap', 'bowtie', 'bracelet', 'brain',
    'bread', 'bridge', 'broccoli', 'broom', 'bucket', 'bulldozer',
    'bus', 'bush', 'butterfly', 'cactus', 'cake', 'calculator',
    'calendar', 'camel', 'camera', 'camouflage', 'campfire', 'candle',
    'cannon', 'canoe', 'car', 'carrot', 'castle', 'cat', 'ceiling fan',
    'cell phone', 'cello', 'chair', 'chandelier', 'church', 'circle',
    'clarinet', 'clock', 'cloud', 'coffee cup', 'compass', 'computer',
    'cookie', 'cooler', 'couch', 'cow', 'crab', 'crayon', 'crocodile',
    'crown', 'cruise_ship', 'cup', 'diamond', 'dishwasher',
    'diving board', 'dog', 'dolphin', 'donut', 'door', 'dragon',
    'dresser', 'drill', 'drums', 'duck', 'dumbbell', 'ear', 'elbow',
    'elephant', 'envelope', 'eraser', 'eye', 'eyeglasses', 'face',
    'fan', 'feather', 'fence', 'finger', 'fire hydrant', 'fireplace',
    'firetruck', 'fish', 'flamingo', 'flashlight', 'flip flops',
    'floor lamp', 'flower', 'flying saucer', 'foot', 'fork', 'frog',
    'frying pan', 'garden', 'garden hose', 'giraffe', 'goatee',
    'golf club', 'grapes', 'grass', 'guitar', 'hamburger', 'hammer',
    'hand', 'harp', 'hat', 'headphones', 'hedgehog', 'helicopter',
    'helmet', 'hexagon', 'hockey puck', 'hockey stick', 'horse',
    'hospital', 'hot air balloon', 'hot dog', 'hot tub', 'hourglass',
    'house', 'house plant', 'hurricane', 'ice cream', 'jacket', 'jail',
    'kangaroo', 'key', 'keyboard', 'knee', 'knife', 'ladder', 'lantern',
    'laptop', 'leaf', 'leg', 'light bulb', 'lighter', 'lighthouse',
    'lightning', 'line', 'lion', 'lipstick', 'lobster', 'lollipop',
    'mailbox', 'map', 'marker', 'matches', 'megaphone', 'mermaid',
    'microphone', 'microwave', 'monkey', 'moon', 'mosquito',
    'motorbike', 'mountain', 'mouse', 'moustache', 'mouth', 'mug',
    'mushroom', 'nail', 'necklace', 'nose', 'ocean', 'octagon',
    'octopus', 'onion', 'oven', 'owl', 'paint can', 'paintbrush',
    'palm tree', 'panda', 'pants', 'paper clip', 'parachute', 'parrot',
    'passport', 'peanut', 'pear', 'peas', 'pencil', 'penguin', 'piano',
    'pickup truck', 'picture frame', 'pig', 'pillow', 'pineapple',
    'pizza', 'pliers', 'police car', 'pond', 'pool', 'popsicle',
    'postcard', 'potato', 'power outlet', 'purse', 'rabbit', 'raccoon',
    'radio', 'rain', 'rainbow', 'rake', 'remote control', 'rhinoceros',
    'rifle', 'river', 'roller coaster', 'rollerskates', 'sailboat',
    'sandwich', 'saw', 'saxophone', 'school bus', 'scissors',
    'scorpion', 'screwdriver', 'sea turtle', 'see saw', 'shark',
    'sheep', 'shoe', 'shorts', 'shovel', 'sink', 'skateboard', 'skull',
    'skyscraper', 'sleeping bag', 'smiley face', 'snail', 'snake',
    'snorkel', 'snowflake', 'snowman', 'soccer ball', 'sock',
    'speedboat', 'spider', 'spoon', 'spreadsheet', 'square', 'squiggle',
    'squirrel', 'stairs', 'star', 'steak', 'stereo', 'stethoscope',
    'stitches', 'stop sign', 'stove', 'strawberry', 'streetlight',
    'string bean', 'submarine', 'suitcase', 'sun', 'swan', 'sweater',
    'swing set', 'sword', 'syringe', 't-shirt', 'table', 'teapot',
    'teddy-bear', 'telephone', 'television', 'tennis racquet', 'tent',
    'tiger', 'toaster', 'toe', 'toilet', 'tooth', 'toothbrush',
    'toothpaste', 'tornado', 'tractor', 'traffic light', 'train',
    'tree', 'triangle', 'trombone', 'truck', 'trumpet', 'umbrella',
    'underwear', 'van', 'vase', 'violin', 'washing machine',
    'watermelon', 'waterslide', 'whale', 'wheel', 'windmill',
    'wine bottle', 'wine glass', 'wristwatch', 'yoga', 'zebra', 'zigzag'];

let aval_class = ['bicycle', 'binoculars', 'birthday_cake', 'book', 'butterfly', 'calculator', 'cat', 'chandelier', 'computer', 'cow', 'cruise_ship', 'face', 'flower', 'guitar', 'mosquito', 'piano', 'pineapple', 'sun', 'truck', 'windmill'];
let class_name;
let classifier_idx = 0;

function roll() {
    let random_class_idx = Math.floor(Math.random() * 9);
    $('#class_selector').val(aval_class[random_class_idx]);
}

async function loadModel() {
    model = await tf.loadLayersModel('./model/model.json');
    return model;
}

function load_ai() {
    let json_file = $.getJSON('./assets/class/' + class_name).done(function (data) {
        reset_all();
        ai_data = data;
        let counter = 0;
        let interval = setInterval(function () {
            counter++;
            if (counter === 1) {
                if (colorfulDiv != null) {
                    colorfulDiv.style.backgroundColor = "#FCBD4D";
                }
                showTip();
                showButtonColor();

                $('.Header').show();
                $('.Human').show();
                $('.AI').show();
                $('.Result').show();
                $('.Footer').show();
                
                clearInterval(interval);
                
                status.html('');
                counting.html('');

                canvas.addEventListener("mousedown", press, false);
                canvas.addEventListener("mousemove", drag, false);
                canvas.addEventListener("mouseup", release);
                canvas.addEventListener("mouseout", cancel, false);

                canvas.addEventListener("touchstart", press, false);
                canvas.addEventListener("touchmove", drag, false);
                canvas.addEventListener("touchend", release, false);
                canvas.addEventListener("touchcancel", cancel, false);

                prepare = false;
                tipShow = false;
                canDraw = true;
            }
        }, 1000);
    });
}

function showPen() {
    var penContainer = document.getElementById('line-container');
    if (penContainer.style.display == "block") {
        penContainer.style.display = "none";
    } else {
        penContainer.style.display = "block";
    }
}

function changeRange() {
    var line_value = document.getElementById("range").value;
    document.getElementById("line_value").innerHTML = line_value + "px";
    lineIndex.push(clickDrag.length);
    lineValue.push(line_value);
}

function showButtonColor() {
    $('#start_button').html('Ready!<span></span>');
    var btn = document.getElementById('start_button');
    btn.style.background = "#E26C22";
    btn.style.color = "#000000";
    canClick = false;
}

function dismissButtonColor() {
    $('#start_button').html('Play!<span></span>');
    var btn = document.getElementById('start_button');
    btn.style.background = "";
    btn.style.color = "";
    canClick = true;
}

function onCreate() {
    var mask = document.getElementById('windmill');
    var pad_container = document.getElementById('pad-container');
    var result_container = document.getElementById('Result');

    pad_container.style.top = mask.getBoundingClientRect().bottom + window.pageYOffset + 1;
    result_container.style.top = pad_container.getBoundingClientRect().bottom + window.pageYOffset + 20;

    canvasXOffset = mask.getBoundingClientRect().bottom + window.pageYOffset + 1;

    // class_name = $('#class_selector').val();
    // var odiv = document.getElementById(class_name);
    // var mask = document.getElementById('mask');

    // mask.style.left = odiv.getBoundingClientRect().left + window.pageXOffset;
    // mask.style.width = odiv.getBoundingClientRect().width;
    // mask.style.top = odiv.getBoundingClientRect().top + window.pageYOffset;
    // mask.style.height = odiv.getBoundingClientRect().height;
}

function showTip() {
    var tip = document.getElementById('tip');
    var human = document.getElementById('Human');
    tip.style.left = human.getBoundingClientRect().left + window.pageXOffset;
    tip.style.top = human.getBoundingClientRect().top + window.pageYOffset;
    tip.style.visibility = "visible";
}

function selectChange(dismiss) {
    class_name = $('#class_selector').val().toLowerCase();
    if (colorfulDiv != null) {
        colorfulDiv.style.backgroundColor = "#FFFFFF";
    }
    var odiv = document.getElementById(class_name);
    odiv.style.backgroundColor = "#CCCCCC";
    colorfulDiv = odiv;

    reset_all();
    if (dismiss) {
        dismissButtonColor();
    }
}

function difficultyChange() {
    reset_all();
    dismissButtonColor();
}

function exportPng() {
    var url = canvas.toDataURL("image/png");
    var oA = document.createElement("a");
    oA.download = 'sketch' + saveTime; // 设置下载的文件名，默认是'下载'
    oA.href = url;
    document.body.appendChild(oA);
    oA.click();
    oA.remove();
    saveTime++;
}

function sketchClick(event) {
    // var id = event.currentTarget.id;
    // document.getElementById('class_selector').value = id;
    // selectChange();

    // canvas.addEventListener("mousedown", press, false);
    // canvas.addEventListener("mousemove", drag, false);
    // canvas.addEventListener("mouseup", release);
    // canvas.addEventListener("mouseout", cancel, false);

    // canvas.addEventListener("touchstart", press, false);
    // canvas.addEventListener("touchmove", drag, false);
    // canvas.addEventListener("touchend", release, false);
    // canvas.addEventListener("touchcancel", cancel, false);
    // colorIndex.push(0);
    // colorValue.push("#000000");

    // canDraw = true;
    
}

function prep() {
    if (prepare) {
        return;
    }
    if (!canClick) {
        return;
    }
    prepare = true;
    class_name = $('#class_selector').val().toLowerCase();
    classifier_idx = class_names_full.indexOf(class_name);

    difficulty_factor = parseFloat($('#speed_selector').val());

    if (model == null) {
        // counting.html('Loading Classifier... ');

        model = loadModel();

        model.then(function () {
            warm_up = classify();
            // counting.html('Classifier Loaded. ');
            load_ai();
        });
    } else {
        // counting.html('Classifier Loaded. ');
        load_ai();
    }

    status.html('AI is preparing... ')
}

function reset_all() {
    clickX = [];
    clickY = [];
    clickDrag = [];
    colorIndex = [];
    colorValue = [];
    lineIndex = [];
    lineValue = [];

    colorIndex.push(0);
    colorValue.push("#000000");
    document.getElementById("palette").value = "#000000";
    lineIndex.push(0);
    lineValue.push(5);
    document.getElementById("range").value = 5;
    document.getElementById("line_value").innerHTML = "5px";

    full_length = 0;
    full_length_human = 0;
    saveTime = 1;
    winner = null;
    $('#text_area').html('');
    run_classifier_times = 0;
    context.clearRect(0, 0, 500, 500);
    context_ai.clearRect(0, 0, 500, 500);
    chart.data.datasets[0].data = [];
    chart.data.datasets[1].data = [];
    chart.data.labels = [];
    chart.update();
    // $('.Header').hide();
    // $('.Human').hide();
    // $('.AI').hide();
    status.html('');
    counting.html('');
    $('#Title').show();
    // $('#welcome').show();
    canDraw = false;
}

press = async function (e) {
    if (!canDraw) {
        return;
    }
    paint = true;
    var mouseX = (e.changedTouches ? e.changedTouches[0].pageX : e.pageX) - this.offsetLeft - 285;
    var mouseY = (e.changedTouches ? e.changedTouches[0].pageY : e.pageY) - this.offsetTop - canvasXOffset;
    addClick(mouseX, mouseY, false);
    redraw(context, clickX, clickY, clickDrag, clickX.length, true);
    for (var i = 0; i < ai_data['dist'].length; i++) {
        if (ai_data['dist'][i] > difficulty_factor * full_length) {
            break;
        }
    }
    full_length = 0;
    redraw(context_ai, ai_data['clickX'], ai_data['clickY'], ai_data['clickDrag'], i, false);
    full_length = 0;
    if (difficulty_factor * full_length_human > (run_classifier_times + 1) * run_classifier_length) {
        run_classifier_times++;
        full_length_human = 0;
        await classify();
    }
    full_length_human = 0;

};

drag = async function (e) {
    if (!canDraw) {
        return;
    }
    if (paint) {
        var mouseX = (e.changedTouches ? e.changedTouches[0].pageX : e.pageX) - this.offsetLeft - 285;
        var mouseY = (e.changedTouches ? e.changedTouches[0].pageY : e.pageY) - this.offsetTop - canvasXOffset;
        addClick(mouseX, mouseY, true);
        redraw(context, clickX, clickY, clickDrag, clickX.length, true);
        for (var i = 0; i < ai_data['dist'].length; i++) {
            if (ai_data['dist'][i] > difficulty_factor * full_length) {
                break;
            }
        }
        full_length = 0;
        redraw(context_ai, ai_data['clickX'], ai_data['clickY'], ai_data['clickDrag'], i, false);
        full_length = 0;
        if (difficulty_factor * full_length_human > (run_classifier_times + 1) * run_classifier_length) {
            run_classifier_times++;
            full_length_human = 0;
            await classify();
        }
        full_length_human = 0;
    }
    e.preventDefault();
};

release = function () {
    paint = false;
};

cancel = function () {
    paint = false;
};

function addClick(x, y, dragging) {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
}

function redraw(context, clickX, clickY, clickDrag, num, is_human) {
    context.clearRect(0, 0, 500, 500);

    context.lineJoin = "round";

    for (var i = 0; i < num; i++) {
        if (colorIndex.length > 1 && is_human) {
            for (var j = 0; j < colorIndex.length; j++) {
                if (i >= colorIndex[j]) {
                    context.strokeStyle = colorValue[j];
                }
            }
        } else {
            context.strokeStyle = "#000000";
        }

        if (lineIndex.length > 1 && is_human) {
            for (var j = 0; j < lineIndex.length; j++) {
                if (i >= lineIndex[j]) {
                    context.lineWidth = lineValue[j];
                }
            }
        } else {
            context.lineWidth = 5;
        }
        

        context.beginPath();
        if (clickDrag[i] && i) {
            x1 = clickX[i - 1];
            y1 = clickY[i - 1];
        } else {
            x1 = clickX[i] - 1;
            y1 = clickY[i];
        }
        context.moveTo(x1, y1);
        x2 = clickX[i];
        y2 = clickY[i];
        context.lineTo(x2, y2);
        context.closePath();
        context.stroke();
        full_length = full_length + Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
        if (is_human) {
            full_length_human = full_length_human + Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
        }
    }
}

async function classify() {

    const prediction_js = tf.tidy(() => {
        img_human = tf.browser.fromPixels(canvas, 4).cast('float32').div(255).sum(axis = -1, keepDims = false);
        img_ai = tf.browser.fromPixels(canvas_ai, 4).cast('float32').div(255).sum(axis = -1, keepDims = false);

        img_human = tf.stack([img_human, img_human, img_human], axis = -1);
        img_ai = tf.stack([img_ai, img_ai, img_ai], axis = -1);

        img = tf.stack([img_human, img_ai], axis = 0);

        result = model.predict(tf.image.resizeBilinear(img, [224, 224]));
        result_js = result.arraySync();
        return result_js;
    });

    human_acc = prediction_js[0][classifier_idx];
    ai_acc = prediction_js[1][classifier_idx];

    human_rank = 1 / (1 + prediction_js[0].sort(function (a, b) {
        return a - b;
    }).reverse().indexOf(human_acc));
    ai_rank = 1 / (1 + prediction_js[1].sort(function (a, b) {
        return a - b;
    }).reverse().indexOf(ai_acc));

    if (winner == null) {
        if (human_rank > 0.5 && ai_rank <= 0.5) {
            winner = 'You';
        } else if (human_rank <= 0.5 && ai_rank > 0.5) {
            winner = 'AI';
        } else if (human_rank > 0.5 && ai_rank > 0.5) {
            if (human_acc > ai_acc) {
                winner = 'You';
            } else {
                winner = 'AI';
            }
        } else {
            if (human_acc == 1) {
                winner = 'You';
            } else if (ai_acc == 1) {
                winner = 'AI';
            }
        }
    }

    chart.data.datasets[0].data.push(human_rank);
    chart.data.datasets[1].data.push(ai_rank);

    chart.data.labels.push(run_classifier_times);
    chart.update();

    if (winner != null && !tipShow) {
        score.style.visibility = "visible";
        $('#middle').html(winner + ' won!');
        dismissButtonColor();
        tipShow = true;
    }
}

window.onload = function(){
    onCreate();
    selectChange(false);
    document.onmousedown = function(event){
        score.style.visibility = "hidden";
        tip.style.visibility = "hidden";
    }
}

var ctx = document.getElementById("acc_chart").getContext('2d');
var chart = new Chart(ctx, {
    options: {
        responsive: false,
        width: 800,
        height: 200
    },
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                backgroundColor: '#ff6384',
                borderColor: '#ff6384',
                fill: false,
                label: 'Human',
                data: [],
            },
            {
                backgroundColor: '#36a2eb',
                borderColor: '#36a2eb',
                fill: false,
                label: 'AI',
                data: [],
            }]
    },
});
