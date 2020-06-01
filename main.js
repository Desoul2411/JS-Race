const score = document.querySelector('.score'),
    start = document.querySelector('.start'),
    gameArea = document.querySelector('.gameArea'),
    car = document.createElement('div');
    /*music = document.createElement('audio');*//*создали тэг аудио */
    music = document.createElement('embed');   /*Добавляем спец тэг embed для музыки, flash и видео */
    music.setAttribute('src', './audio.mp3');
    music.setAttribute('type', 'audio/mp3');  /*указываем тип и формат */
    music.classList.add('music'); /*Чтобы в стилях убрать управление плеером за границу экрана */
    
    /*Или ещё способ через ф-цию-конструктор */
    /*const audio = new Audio ('./audio.mp3')      здесь './audio.mp3' записывается в парамтр src */
    
    /*let allow = false;                     /*Проверка успел ли загрузиться файл аудио */
    /*audio.addEventListener('loadeddata', () =>{
            console.log('аудио загружено');
            allow = true;
    })*/

    car.classList.add('car');




start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);


const keys = {    /* кнопки управления. Получаем к ним доступ через keys[event.key] */
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false
};

const setting = {   /*Исходные значения. Будут меняться при запуске игры */
    start: false,
    score: 0,
    speed: 3,
    traffic: 3,   /*расстояние между машинами. 3 - значит  сама машина + расстояние равное 2-м машинам */
    a: 0  /*перемннная для роста скорости при наборе очков - реал-но в playGame */
};


function getQuantityElements(heightElement) {  /*ф-ция будет возвращать кол-во эл-в, необходимых для запонения страницы по высоте (для созлдания необходимого кол-ва линий) */
    return document.documentElement.clientHeight/heightElement + 1;   /*ocument.documentElement.clientHeight - высота страницы */
}

/*То же, но стрелочной функцией 
const getQuantityElements = (heightElement) => {return document.documentElement.clientHeight/heightElement + 1;};
*/

/*console.log(getQuantityElements(50));*/


function startGame(event) {
    console.log(event.target);   /*реализуем уровни скорости */
    if (event.target.classList.contains('start')) {  /*если у кнопке по которой кликнули(event.target) будет класс start (при клике по умолчанию вернёт false) - запускать игру */
        return;   /*обязательно прописать return чтобы дальше ф-ция выполнялвсь!!! */
    }

    if (event.target.classList.contains('easy')) {  
        setting.speed = 3;
        setting.traffic = 3;
    }

    if (event.target.classList.contains('normal')) {  
        setting.speed = 5;
        setting.traffic = 3;
    }

    if (event.target.classList.contains('hard')) { 
        setting.speed = 7;
        setting.traffic = 2;
    }

    start.classList.add('hide');
    gameArea.innerHTML = ''; /*Очищаем поле (джорогу после ДТП, чтобы могли начать сначала) */
   

    for (let i = 0; i < getQuantityElements(100); i++) {   /*создаём и добавляем линии */  /*В getQuantityElements(100) полцили необходимое кол-во линий*/
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = (i * 100) + 'px';
        line.y = i * 100;    /*добавили в объект line св-во y */
        gameArea.appendChild(line);

    }

    for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
        const enemy = document.createElement('div');
        let enemyImg = Math.floor(Math.random() * 2) + 1;  /*генерируем случайное число для выбора картинки случайной картинки врага */
        enemy.classList.add('enemy');
        enemy.y = -100 * setting.traffic * (i + 1);  /* 100 - высота авто. -100 заносит другие авто выше дороги. setting.traffiс = число влияющее на плотность */
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';  /*реализум случайное расположение врагов по оси x и отнимаем 50 от ширины дороги, чтобы машины не вылезали за края*/
        enemy.style.top = enemy.y + 'px';   
        enemy.style.background = `transparent url(./image/enemy${enemyImg}.png) center / cover no-repeat`;  /*использовали оьратные кавычки с буквы ё  и мы можем использавать внутри перменные. Шаблонная строка - из ES6 */
        gameArea.appendChild(enemy);
        /*Кол-во машин врага зависит от св-ва Heigh gameArea */
    }
    
    /*if (allow) {    проверяем, что файл успел загрузиться*/
     /*audio.play()      play - ф-ция из прототипа объекта audio. Так вкл музыку если делали тэг аудио через ф-цию конструктор*/
    /*}*/
    
    
     setting.score = 0;   /* очки*/
    /*setting['age'] = 32;*/   /*второй вариант добавления св-в в объект */
    setting.start = true;  /*при старте меняем св-во start на true */
    gameArea.appendChild(car);
    gameArea.appendChild(music);  /*добавляем тэг музыки embed на страницу */


    /*music.setAttribute('autoplay', true); */ /*Подключаем музыку*/
   /* music.setAttribute('src','./audio.mp3');*/

     /*car.style.left = '125px'; */  /*150-25 - половина дороги - половина авто*/
    car.style.left = gameArea.offsetWidth/2 - car.offsetWidth/2;
    car.style.top =  'auto';
    car.style.bottom =  '10px';
    setting.x = car.offsetLeft;  /*добавили св-во x в объект setting. И с помощью offsetLeft получаем его положение car по гориз-ли */
    setting.y = car.offsetTop;
    requestAnimationFrame(playGame); /*в скобках указываем ф-цию,которая должна быть анимирована - playGame */
    
}

function playGame() {


    if (setting.score > 2000 && setting.a === 0) {
        ++setting.speed;
        ++setting.a;
    } else if (setting.score > 5000 && setting.a ===1) {
        ++setting.speed;
        ++setting.a;
    } else if (setting.score > 10000 && setting.a === 2) {
        ++setting.speed;
        ++setting.a;
    }



    setting.score += setting.speed; /*очки будут зависеть от скорости */
    score.innerHTML = 'SCORE<br>' +  setting.score;   /*выводим очки на страницу*/ 
    moveRoad();
    moveEnemy();


    
    if(keys.ArrowLeft && setting.x > 0) {   /*При зажатии влево уменьшаем left */
            setting.x -= setting.speed;         /*setting.x > 0 - чтобы машина не могла выходить за границы дороги */
        }
    if (keys.ArrowRight && setting.x < gameArea.offsetWidth - car.offsetWidth) {     /*При зажатии вправо увеличиваемleft */
        setting.x += setting.speed;      /* gameArea.offsetWidth - car.offsetWidth - чтобы машина не могла выходить за границы дороги */                                                       
    }

    if (keys.ArrowDown && setting.y < gameArea.offsetHeight - car.offsetHeight ) {
        setting.y += setting.speed;
    }

    if (keys.ArrowUp && setting.y > 0) {
        setting.y -= setting.speed;
    }

    car.style.left = setting.x + 'px';   /*присваиваем значение etting.x  в св-во left*/
    car.style.top = setting.y + 'px';     
    if (setting.start) {   /*пока setting.start === true */
        requestAnimationFrame(playGame); /*Это рекурсия - для перезапуска самой себя(ф-ции), чтобы игра не останавливалась. requestAnimationFrame позворляет это делать плавно, без большой нагрузки на ПК польтзователя */
    } else {
        music.remove();  /*удалить  музыку при столкновении( если settings.start обратно false) */
    }

}


function startRun(event) {
    event.preventDefault();
    if (keys.hasOwnProperty(event.key)) { /* hasOwnProperty проверяет есть ли нажатая клавиша в объекте keys и если есть, то выполняется ф-ция в фиг. скобках. Сделали для того, чтобы в объект не добавлялись все нажатые кнопки как св-ва*/
        keys[event.key] = true;
    }

    /* или то же самое, но медленнее, т.к. ищет event.key ещё и в прототипах  */
    /*  if (event.key in keys) {
        keys[event.key] = true;
    }*/

    /*console.log(keys[event.key]);  */  /*= ArrowUP , ArrowDown и т.д.  А keys[event.key] == false - т.е. значение по умолчанию*/
    /*keys[event.key] = true;*/  /*при нажатойии клавиши будет передаваться в этй ф-цию объект event со свойством key, равном имени нажатой кнопки ,например, ArrowRight. И дальше в объекте keys будет найдено это значение (это и будет event.key). И присоим ему true*/
}

function stopRun() {
    event.preventDefault();
    if (keys.hasOwnProperty(event.key)) {
        keys[event.key] = false;
    }
    keys[event.key] = false; /*отпускаем кнопку - значение меняется на false, машина останавливается*/
}


function moveRoad() {  /*для движения линий */
    let lines = document.querySelectorAll('.line');   /*получаем все линии */
    lines.forEach(function(line){   /*forEach запустит ф-цию столько раз, сколько эл-в в lines- 20*/
        line.y += setting.speed;       /*к line.y будет постоянно прибавляться значение setting.speed - 3px  */            /*как называть параметр - не важно line или item */
        line.style.top = line.y + 'px';

        if(line.y >= document.documentElement.clientHeight) {  /*document.documentElement.clientHeight  - высота окна */
            line.y = -100;           /*обнуляем (а лучше -100 - тогда элемент появится выше дороги и не будет виден переход) когда линии доходят до конца */
        }
    }) 
}

function moveEnemy() {
    let enemy = document.querySelectorAll('.enemy');
    enemy.forEach(function(item){
        let carRect = car.getBoundingClientRect(); /*getBoundingClientRect получает параметры положения объекта */
        let enemyRect = item.getBoundingClientRect();

        if(carRect.top <= enemyRect.bottom &&   /*Вычисляем когда фикировать столкновение - см. чертёж*/
        carRect.right >= enemyRect.left && 
        carRect.left + 3 <= enemyRect.right &&   /*добавили +3 чтобы покорректировать столкновение и чтобы задевалось зеркалом */
        carRect.bottom >= enemyRect.top) {
           /* console.warn('DTP');*/
            setting.start = false;  /*Остановить игру после ДТП */
            /*audio.pause();*/   /*поставить музыку на паузу при аварии */
            start.classList.remove('hide'); /*при ДТП показываем надпись начать игру опять, сделав её видимой снова*/
            start.style.top = score.offsetHeight; /*отталкиваем блок с очками на высоту блока с надписью начать игру */
        }
        item.y += setting.speed / 2;  /*скорость врагов */
        item.style.top = item.y + 'px';

        if (item.y >= document.documentElement.clientHeight) {  /*делаем бесконечные машины*/
            item.y = -100 * setting.traffic;  /*откатываем последнюю машину на 100px и умножаем на setting.traffic (100*3= на 300px вернуть мащинку) для сохранения плотности */
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px'; /*чтобы машины появлялись рандомно ао оси x. 50 - ширина авто */
        }
    });

}
