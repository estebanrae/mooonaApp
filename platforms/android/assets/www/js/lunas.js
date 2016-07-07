/************************ ANIMACION DE LUNAS ************************/

var anchoCanvas = $("#espiral-lunas").width();
var altoCanvas = $("#espiral-lunas").height();
var valorArb = anchoCanvas*0.025;
var imagenes = [];
var imagenesRosa = [];

function Luna(posicionAlpha, imagen, orden){
	
	this.posicionAlpha = posicionAlpha || 0;
	this.w = this.calcularTamanio().ancho;
	this.h = this.calcularTamanio().alto;
	this.x = this.calcularPosicion().posX;
	this.y = this.calcularPosicion().posY;
	this.ultima = (posicionAlpha == 1170) ? true : false;
	this.primera = (posicionAlpha == 0) ? true : false;
	this.opacity = this.calcularOpacidad();
	this.habilitada = true;
	this.orden = orden || 0;
	this.movimiento = true;
	this.imagen = imagen || '';
}

Luna.prototype.setImagen = function(imgPath){
	this.imgPath = imgPath;
}

Luna.prototype.draw = function(ctx) {
	ctx.globalAlpha = this.opacity;
	ctx.drawImage(this.imagen, this.x, this.y, this.w, this.h);
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
	this.residuo = 0;
	this.arrPosiciones = [];


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
							var prox = luna.orden + magnitud;
							alphaProx = estado.arrPosiciones[prox];
							if(luna.movimiento){

								luna.posicionAlpha += direccion;
								if(luna.posicionAlpha > 1170){luna.posicionAlpha += direccion;}
								if(luna.posicionAlpha == alphaProx){
									luna.movimiento = false;
									luna.orden += magnitud;
								}
								if(luna.posicionAlpha == 1260 && prox >= estado.lunas.length){
									luna.movimiento = false;
									luna.orden =  prox - estado.lunas.length;
									console.log(luna.orden);
									luna.posicionAlpha = estado.arrPosiciones[luna.orden];
								}
								if(prox < 0 && luna.posicionAlpha < 0){
									luna.orden = estado.lunas.length  + Math.abs(magnitud) + prox ;
									console.log(prox);
									luna.posicionAlpha = 1260;
								}
								luna.x = luna.calcularPosicion().posX;
								luna.y = luna.calcularPosicion().posY;
								luna.w = luna.calcularTamanio().ancho;
								luna.h = luna.calcularTamanio().alto;
								luna.opacity = luna.calcularOpacidad();
							}				
								
						});					
						estado.draw();
						tick++;
						var termina = true;
						$.each(estado.lunas, function(key, luna){
							if(luna.movimiento){termina= false;}
						});
						if(termina){
							$.each(estado.lunas, function(key, luna){
								luna.movimiento = true;
							});
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
    s.intervaloAlpha = Math.trunc(1170/(dias - 1));
    s.residuo = 1170%(dias - 1);
    var jj = 0;

	for(var i = 1; i<dias; i++){
    	s.arrPosiciones.push(jj);
    	jj += s.intervaloAlpha;
    	if(i >= (dias - s.residuo)){
    		jj++;
    	}    
    }
    s.arrPosiciones.push(jj);
    s.arrPosiciones.push(1260);
    var hoy = new Date();
    cargarImagenes(function(){
    	$.each(s.arrPosiciones, function(key, val){
	    	if(key !== s.arrPosiciones.length - 1){
	    		var fechaTemp = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - key - 1);
	    		var obj = calculoFechasMooona(fechaTemp);
	    		if(val == 1170){
	    			s.addLuna(new Luna(val, imagenesRosa[obj.numImg - 1] , key));
	    		}else{
	    			s.addLuna(new Luna(val, imagenes[obj.numImg - 1] , key));
	    		}
	    	}
	    	console.log(key);
	    	
	    });
	    console.log(s);
	    console.log(imagenes);
	    console.log(imagenesRosa);
	    s.draw();
    });
    return s;
}

function cargarImagenes(cargado){
	for(var ii = 1; ii<= NUM_LUNAS; ii++){
		var img = new Image();
		img.onload = function(){
			imagenes.push(img);
			if(imagenes.length == NUM_LUNAS){cargarImagenesRosa(function(){cargado();});}
		};
		img.src = 'img/luna-' + ii + '.png';
	}
}

function cargarImagenesRosa(cargado){
	for(var ii = 1; ii<= NUM_LUNAS; ii++){
		var img = new Image();
		img.onload = function(){
			imagenesRosa.push(img);
			if(imagenesRosa.length == NUM_LUNAS){cargado();}
		};
		img.src = 'img/luna-rosa-' + ii + '.png';
	}
}
