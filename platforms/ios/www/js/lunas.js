/************************ ANIMACION DE LUNAS ************************/

var anchoCanvas = $("#espiral-lunas").width();
var altoCanvas = $("#espiral-lunas").height();
var valorArb = anchoCanvas*0.025;
var imagenes = [];
var imagenesRosa = [];

function Luna(posicionAlpha, orden, numImagen){
	
	this.posicionAlpha = posicionAlpha || 0;
	this.wReal = '';
	this.hReal = '';
	this.w = '';
	this.h = '';
	this.x = '';
	this.y = '';
	this.ultima = (posicionAlpha == 1170) ? true : false;
	this.primera = (posicionAlpha == 0) ? true : false;
	this.opacity = '';
	this.habilitada = true;
	this.orden = orden || 0;
	this.movimiento = true;
	this.imagen = '';
	this.numImagen = numImagen || 0;
	this.calcularTamanioReal();
	this.calcularTamanio();
	this.calcularPosicion();
	this.calcularOpacidad();
	this.calcularImagen();

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
	this.opacity = this.posicionAlpha/1170;	
}

Luna.prototype.calcularTamanio = function(){
	this.h = ((.12*anchoCanvas - .016*anchoCanvas)/1170)*this.posicionAlpha + 0.016*anchoCanvas;
	this.w = this.h*this.wReal/this.hReal;
}

Luna.prototype.calcularTamanioReal = function(){
	this.hReal = imagenes[this.numImagen].height;
	this.wReal = imagenes[this.numImagen].width;
}

Luna.prototype.calcularPosicion = function(){
	
	this.x = (anchoCanvas/2 +(valorArb*Math.exp(0.8687*this.posicionAlpha/360))*Math.cos(this.posicionAlpha*Math.PI/180) - this.w/2);
	this.y = (altoCanvas/2 - (valorArb*Math.exp(0.8687*this.posicionAlpha/360))*Math.sin(this.posicionAlpha*Math.PI/180) - this.h/2);
}

Luna.prototype.calcularImagen = function(){
	if(this.posicionAlpha == 1170){
		this.imagen = imagenesRosa[this.numImagen];
	}else{
		this.imagen = imagenes[this.numImagen];
	}
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
	var vueltas = 0;

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
								luna.posicionAlpha = estado.arrPosiciones[luna.orden];
								vueltas++;
							}
							if(prox < 0 && luna.posicionAlpha < 0){
								luna.orden = estado.lunas.length  + Math.abs(magnitud) + prox ;
								luna.posicionAlpha = 1260;
								vueltas++;
							}
							if(luna.posicionAlpha !== 1170){
								luna.calcularImagen();
							}

							luna.calcularTamanio();
							luna.calcularPosicion();
							luna.calcularOpacidad();
						}
					});					
					tick++;
					var termina = true;
					$.each(estado.lunas, function(key, luna){
						if(luna.movimiento){termina= false;}
					});
					if(termina){
						$.each(estado.lunas, function(key, luna){
							luna.calcularImagen();
							luna.movimiento = true;
						});
						estado.movimiento = false;
						clearInterval(inter);
					}
					estado.draw();
				},5);	
		
	
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
	    			s.addLuna(new Luna(val, key, obj.numImg - 1));
	    		}else{
	    			s.addLuna(new Luna(val, key, obj.numImg - 1));
	    		}
	    	}
	    	
	    });
	    s.draw();
    });
    return s;
}

function cargarImagenes(cargado){
	var paths = [];
	for(var ii = 1; ii<= NUM_LUNAS; ii++){
		paths.push('img/luna-' + ii + '.png');
	}
	var contadorLunas = 0;
	for(var ii = 0; ii< paths.length; ii++){
		imagenes[ii] = new Image();
		imagenes[ii].onload = function(){
			contadorLunas++;
			if(contadorLunas + 1 == NUM_LUNAS){cargarImagenesRosa(function(){cargado();});}
		};
		imagenes[ii].src = paths[ii];
	}
}

function cargarImagenesRosa(cargado){
	var paths = [];
	for(var ii = 1; ii<= NUM_LUNAS; ii++){
		paths.push('img/luna-rosa' + ii + '.png');
	}
	var contadorLunas = 0;
	for(var ii = 0; ii< paths.length; ii++){
		imagenesRosa[ii] = new Image();
		imagenesRosa[ii].onload = function(){
			contadorLunas++;
			if(contadorLunas + 1 == NUM_LUNAS){cargado();}
		};
		imagenesRosa[ii].src = paths[ii];
	}
}
