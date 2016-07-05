/************************ ANIMACION DE LUNAS ************************/

var anchoCanvas = $("#espiral-lunas").width();
var altoCanvas = $("#espiral-lunas").height();
var valorArb = anchoCanvas*0.025;

function Luna(posicionAlpha, imgPath){
	
	this.posicionAlpha = posicionAlpha || 0;
	this.w = this.calcularTamanio().ancho;
	this.h = this.calcularTamanio().alto;
	this.x = this.calcularPosicion().posX;
	this.y = this.calcularPosicion().posY;
	this.ultima = (posicionAlpha == 1170) ? true : false;
	this.primera = (posicionAlpha == 0) ? true : false;
	this.opacity = this.calcularOpacidad();
	this.habilitada = true;
	
	this.imgPath = imgPath || '';
}

Luna.prototype.setImagen = function(imgPath){
	this.imgPath = imgPath;
}

Luna.prototype.draw = function(ctx) {
	var img = new Image();
	img.src = this.imgPath;
	ctx.globalAlpha = this.opacity;
	ctx.drawImage(img, this.x, this.y, this.w, this.h);
	ctx.restore();
};

Luna.prototype.inhabilitar = function(){
	this.opacity = 0;
	this.habilitada = false;
}

Luna.prototype.calcularOpacidad = function(){
	return this.posicionAlpha/1170;	
}

Luna.prototype.calcularTamanio = function(){
	var ancho = ((.12*anchoCanvas - .016*anchoCanvas)/1170)*this.posicionAlpha + 0.016*anchoCanvas;
	var alto = ancho;
	return {ancho: ancho, alto: alto};
}

Luna.prototype.calcularPosicion = function(){
	
	posX = (anchoCanvas/2 +(valorArb*Math.exp(0.8687*this.posicionAlpha/360))*Math.cos(this.posicionAlpha*Math.PI/180) - this.w/2);
	posY = (altoCanvas/2 - (valorArb*Math.exp(0.8687*this.posicionAlpha/360))*Math.sin(this.posicionAlpha*Math.PI/180) - this.h/2);
	
	return {posX: posX, posY: posY};
}

function EstadoCanvas(canvas){
	this.canvas = canvas;
	this.width = canvas.width;
	this.height = canvas.height;
	this.ctx = canvas.getContext('2d');
	this.intervaloAlpha = 0;
	this.lunas = [];
	this.movimiento = false;


	this.intervalo = 30;
	var myState	= this;
}

EstadoCanvas.prototype.addLuna = function(luna) {
	this.lunas.push(luna);
};

EstadoCanvas.prototype.clear = function() {
  this.ctx.clearRect(0, 0, this.width, this.height);
}

EstadoCanvas.prototype.draw = function() {
	var ctx = this.ctx;
    var lunas = this.lunas;


    this.clear();

    this.dibujarEspiral(this.canvas, this.ctx);

    var l = lunas.length;
    for (var i = 0; i < l; i++) {
      var luna = lunas[i];
      lunas[i].draw(ctx);
    }

}

EstadoCanvas.prototype.dibujarEspiral = function(canvas, ctx){
    var alpha = 0;
    var moveX = 1;
    var moveY = 1;
    var longitud = 0;
    var topMax = 0;
    ctx.beginPath();
    ctx.moveTo(this.width/2 + valorArb, this.height/2 );
    while(moveX > 0){
    	var moveX = this.width/2 + (valorArb*Math.exp(0.8687*alpha/360))*Math.cos(alpha*Math.PI/180);
    	var moveY = this.height/2 - (valorArb*Math.exp(0.8687*alpha/360))*Math.sin(alpha*Math.PI/180);
    	ctx.lineTo(moveX, moveY);
    	alpha++;
    	longitud += Math.hypot(moveX, moveY);
    	if(alpha == 1170){
    		topMax = longitud;
    	}
    }
    ctx.lineWidth = .5;
    ctx.strokeStyle="rgba(179,193,200,1)";
    ctx.globalAlpha = 1;
    ctx.stroke();   
    return {longitud: longitud, topMax: topMax};
}

EstadoCanvas.prototype.moverLunas = function(magnitud){
		var tick = 1;
		var estado = this;
		estado.movimiento = true;
		var direccion = (magnitud > 0) ? 1 : -1;
		var inter =	setInterval(function(){
						$.each(estado.lunas, function(key, luna){								
							luna.posicionAlpha += direccion;	
							if(luna.posicionAlpha > 1170){luna.posicionAlpha += direccion;}	
							if(luna.posicionAlpha < 0){luna.posicionAlpha = 1170 + 2*estado.intervaloAlpha - 2}												
							luna.x = luna.calcularPosicion().posX;
							luna.y = luna.calcularPosicion().posY;
							luna.w = luna.calcularTamanio().ancho;
							luna.h = luna.calcularTamanio().alto;	
							if(luna.habilitada){
								luna.opacity = luna.calcularOpacidad();
							}
							
							if(luna.posicionAlpha > 1170 - estado.intervaloAlpha/2 && luna.posicionAlpha < 1170 + estado.intervaloAlpha/2){
								luna.setImagen("img/luna-prueba-rosa.png");
							}else{
								luna.setImagen("img/luna-prueba.png");
							}
							if(luna.posicionAlpha == 1170 + 2*estado.intervaloAlpha){
								luna.posicionAlpha = 0;
								luna.x = luna.calcularPosicion().posX;
								luna.y = luna.calcularPosicion().posY;
								luna.w = luna.calcularTamanio().ancho;
								luna.h = luna.calcularTamanio().alto;
								luna.opacity = luna.calcularOpacidad();
								console.log("CAMBIO");
							}
							/*if(luna.posicionAlpha >= 1170 + 2*estado.intervaloAlpha){
								luna.inhabilitar();	
							}	*/					
								
						});					
						estado.draw();
						tick++;	
						//console.log(estado);					
						if(tick > Math.abs(estado.intervaloAlpha*magnitud)){
							estado.movimiento = false;
							console.log(estado);
							clearInterval(inter);
						}
					},10);	
		
	
}

function inicializarDibujo(){
	var canvas = document.getElementById("canvas-espiral-lunas");
    canvas.width = anchoCanvas;
	canvas.height = altoCanvas;
	var s = new EstadoCanvas(canvas);
    var longitud = s.dibujarEspiral(s.canvas, s.ctx); 
    var dias = localStorage.getItem('regularidad_usr');
    s.intervaloAlpha = Math.trunc(1170/dias);

    //for(var i = 0; i<dias; i++){
    for(var i = 0; i <=1170; i += s.intervaloAlpha){
    	if(i == 1170){
    		s.addLuna(new Luna(i, "img/luna-prueba-rosa.png"));
    	}else{
    		s.addLuna(new Luna(i, "img/luna-prueba.png"));
    	}
    }

	return s;
}

