$(document).ready(function(){
	document.addEventListener('deviceready', onDeviceReady, false);
	var deviceType = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";

});

var physicalScreenWidth;
var physicalScreenHeight; 
var allowTransitionChange;
var objetoLunas;

function onDeviceReady(){
	console.log("Device is ready...");
	physicalScreenWidth = window.screen.width;
	physicalScreenHeight = window.screen.height;
	//navigator.notification.alert("alto: " + physicalScreenHeight + "ancho: " + physicalScreenWidth, null, "Medidas", "Cerrar");
	allowTransitionChange = true;
	setSelects();
	inicializarContenido();
	localStorage.setItem('previa', '');
	if(localStorage.getItem('nombre_usr') == null || !localStorage.getItem('nombre_usr').length){
		
		cerrarTodo('pagina-registro', desplegarPaginaShadow);
	}else{
		setPaginaActiva('pagina-principal');
		llenarCamposRegistro();
	}

	$('#boton-registrar').click(function(e){
		e.preventDefault();
		validarRegistro();

	});

	$('#header-menu').click(function(e){
		toggleMenu();
	});

	$('#header-back').click(function(){
		botonBack();
	});

	$("#icono-notas-siento").click(function(){
		$("#campo-texto-siento").focus();
	});

	$("#barra-footer-principal").on("swipeup", function(e){
		abrirMooonaGeneral();
		//$(this).css({top: '60px'});
	});

	$("#slider-dias-lunas").on("swipeleft", function(e){
		if(!objetoLunas.movimiento){
			var anchoIndiv = physicalScreenWidth/7;
			var orden = $("#slider-dias-lunas .contenedor-fecha-activa").attr("data-orden");
			$("#slider-dias-lunas").transition({x: '-=' + anchoIndiv});		
			var nuevoOrden = parseInt(orden) + 1;
			cambiarFechaSlider(orden, nuevoOrden);
		}
	});

	$("#slider-dias-lunas").on("swiperight", function(e){
		if(!objetoLunas.movimiento){
			var anchoIndiv = physicalScreenWidth/7;
			var orden = $("#slider-dias-lunas .contenedor-fecha-activa").attr("data-orden");
			$("#slider-dias-lunas").transition({x: '+=' + anchoIndiv});
			var nuevoOrden = parseInt(orden) - 1;
			cambiarFechaSlider(orden, nuevoOrden);
		}
	});

	$("#slider-dias-lunas div").click(function(e){
		if(!objetoLunas.movimiento){
			var anchoIndiv = physicalScreenWidth/7;
			var orden = $("#slider-dias-lunas .contenedor-fecha-activa").attr("data-orden");
			var nuevoOrden = $(this).attr("data-orden");
			$("#slider-dias-lunas").transition({x: '+=' + anchoIndiv*(orden-nuevoOrden)});
			cambiarFechaSlider(orden, nuevoOrden);
		}
	});

	$("#sub-menu-footer .icono-selector-detalles").click(function(){
		
		var orden_prox = $(this).attr("data-orden");
		var orden_act = $(".sub-activa").attr("data-orden"); 
		if(orden_act == orden_prox){return;}
		if(allowTransitionChange){
			allowTransitionChange = false;
			cambiarSubPaginaModal(orden_prox, orden_act, "contenedor-detalles-principal", function(){
				allowTransitionChange = true;
			});
			cambiarIconoFooter(orden_prox, orden_act, "contenedor-detalles-principal");
		}
		
		
	});

	$("#barra-footer-principal").on("swipedown", function(e){
		cerrarMooonaGeneral();
		$(this).removeAttr("style");
	});

	$(document).on('click', '.cerrar-menu', function(e){
		cerrarMenu();
	});

	$(document).on("swiperight", '.cerrar-menu, .menu', function(e){
		cerrarMenu();
	});

	$("#barra-footer-principal").click(function(){
		toggleMooonaGeneral();
	});

	$("#boton-detalles-mooona").click(function(){
		abrirPaginaDetalles();
	});

	$("#header-siento .imagen-icono").click(function(){
		var orden_prox = $(this).attr("data-orden");
		var orden_act = $(".sub-activa").attr("data-orden");
		cambiarSubPaginaModal(orden_prox, orden_act, "pagina-siento");
	});

	$('.contenedor-boton-siento').click(function(e){
		var id = $(this).attr('id');
		cargarSiento(id, desplegarPaginaModal);
	});

	$(".opcion").click(function(e){
		if($(this).hasClass('opcion-seleccionada')){
			return;
		}else{
			if(localStorage.getItem('nombre_usr') == null || localStorage.getItem('nombre_usr') == '' ){
				navigator.notification.alert("Debes Registrarte para poder hacer uso de la aplicación", null, "Invalido", "Cerrar");
				cerrarMenu();
				return;
			}else{
				$('.opcion-seleccionada').each(function(){
					$(this).removeClass('opcion-seleccionada');
				});
				$(this).addClass('opcion-seleccionada');
				var id = $(this).attr('id');

				selectorPaginas(id);
			}
				

		}
	});


}

function setSelects(){
	var fecha = new Date();
	var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
	for(var anio = fecha.getFullYear(); anio > 1929; anio--){
		$('#sel-anio-nacimiento').append("<option value=" + anio + ">" + anio + "</option>");
	}
	for(var dia = 1; dia < 32; dia++){
		$('#sel-dia-nacimiento, #sel-dia-regla').append("<option value=" + dia + ">" + dia + "</option>");
	}
	for(var mes=0; mes < meses.length; mes++){
		$('#sel-mes-nacimiento, #sel-mes-regla').append("<option value=" + meses[mes] + ">" + meses[mes] + "</option>");
	}
}

function validarRegistro(){
	if($('#in-nombre').val() == ''){
		navigator.notification.alert("Por favor ingresa tu nombre.", null, "Invalido", "Cerrar");
		return;
	}else{
		localStorage.setItem('nombre_usr', $("#in-nombre").val());
		localStorage.setItem('nacimiento_d_usr', $("#sel-dia-nacimiento option:selected").val());
		localStorage.setItem('nacimiento_m_usr', $("#sel-mes-nacimiento option:selected").val());
		localStorage.setItem('nacimiento_a_usr', $("#sel-anio-nacimiento option:selected").val());
		localStorage.setItem('ultima_d_usr', $("#sel-dia-regla option:selected").val());
		localStorage.setItem('ultima_m_usr', $("#sel-mes-regla option:selected").val());
		localStorage.setItem('duracion_usr', $("#in-duracion-regla").val());
		localStorage.setItem('regularidad_usr', $("#in-regularidad-periodo").val());
		esconderPaginaShadow('pagina-registro');
		//setPaginaActiva('pagina-principal');
		botonBack();
	}
}

function setPaginaActiva(id){
	$('#'+id).addClass('activa');
	localStorage.setItem('activa', id);
	$('.opcion-seleccionada').each(function(){
		$(this).removeClass('opcion-seleccionada');
	});
	if($('.opcion[data-ref="' + id + '"]').length){
		$('.opcion[data-ref="' + id + '"]').addClass('opcion-seleccionada');
	}
	

}

function activarBotonBack(id, mostrar){
	if(mostrar){
		$('#header-back').show();
	}
	var previa = localStorage.getItem('previa');
	var activa = localStorage.getItem('activa');
	var permite = true;
	document.addEventListener("backbutton", botonBack, false);

	if(previa = '' || previa == null || !previa){
		previa = [];
	}else{
		previa = JSON.parse(localStorage.getItem('previa'));
	}
	$.each(previa, function(key, value){
		if(value == activa){
			permite = false;
		}
		if(value == id){
			previa.splice(key, 1);
		}
	});
	if(	$("#" + activa).hasClass("modal")){permite = false}	

	if(permite){
		previa.push(activa);
	}
	
	localStorage.setItem('previa', JSON.stringify(previa));
	$('.activa').each(function(){
		$(this).removeClass('activa');
	});
	setPaginaActiva(id);
}

function botonBack(){
	var arregloPrevia = JSON.parse(localStorage.getItem('previa'));
	var previa = arregloPrevia[arregloPrevia.length - 1];
	cerrarTodo(previa, function(id){
		desplegarPagina(id, function(res){
			if(res){
				arregloPrevia.splice(arregloPrevia.length - 1, 1);
				localStorage.setItem('previa', JSON.stringify(arregloPrevia));
				setPaginaActiva(previa);
			}else{
				document.removeEventListener("backbutton", botonBack, false);
				localStorage.setItem('previa', '');
				localStorage.setItem('activa', 'pagina-principal');
			}
		});
	});
}

function desplegarPagina(id, callback){	
	var res = false;
	if($('#'+id).hasClass('shadow')){
		desplegarPaginaShadow(id);
		res = true;
	}

	if($('#'+id).hasClass('modal')){
		desplegarPaginaModal(id);
		res = true; 
	}

	if($('#'+id).hasClass('pagina-principal')){
		$('.opcion-seleccionada').each(function(){
			$(this).removeClass('opcion-seleccionada');
		});
		$('#header-back').hide();
		res = false;
	}
	callback(res);

}

function llenarCamposRegistro(){
	$("#in-nombre").val(localStorage.getItem('nombre_usr'));
	$("#sel-dia-nacimiento option:selected").val(localStorage.getItem('nacimiento_d_usr'));
	$("#sel-mes-nacimiento option:selected").val(localStorage.getItem('nacimiento_m_usr'));
	$("#sel-anio-nacimiento option:selected").val(localStorage.getItem('nacimiento_a_usr'));
	$("#sel-dia-regla option:selected").val(localStorage.getItem('ultima_d_usr'));
	$("#sel-mes-regla option:selected").val(localStorage.getItem('ultima_m_usr'));
	$("#in-duracion-regla").val(localStorage.getItem('duracion_usr'));
	$("#in-regularidad-periodo").val(localStorage.getItem('regularidad_usr'));
}

function toggleMenu(){
	if($("#menu-lado").hasClass("menu-cerrado")){
		abrirMenu();
	}else{
		cerrarMenu();
	}
	
}

function abrirMenu(){
	$("#menu-lado").transition({x: 0}, function(){
		$("#menu-lado").removeClass("menu-cerrado");
		$("#menu-lado").addClass("menu-abierto");
	});
	$(".contenedor-pagina").addClass("cerrar-menu");
}

function cerrarMenu(){
	$("#menu-lado").transition({x: physicalScreenWidth/2}, function(){
		$("#menu-lado").addClass("menu-cerrado");
		$("#menu-lado").removeClass("menu-abierto");
	});
	$(".contenedor-pagina").removeClass("cerrar-menu");

}

function desplegarPaginaShadow(id){
	$("#"+id).show().transition({y:0});
}

function esconderPaginaShadow(id){
	$("#"+id).transition({y:physicalScreenHeight},function(){
		$("#"+id).hide();
	});
}

function cerrarTodo(idActual, callback){
	$(".shadow").each(function(){
		var id = $(this).attr('id');
		if(id !== idActual){
			esconderPaginaShadow(id);
		}	
	});

	$(".modal").each(function(){
		var id = $(this).attr('id');
		if(id !== idActual){
			esconderPaginaModal(id);
		}
	});
	
	
	cerrarMooonaGeneral();
	cerrarMenu();
	callback(idActual);
}

function selectorPaginas(id){
	switch (id){
		case 'opcion-siento':
			cerrarTodo('menu-hoy-siento', desplegarPaginaShadow);
			activarBotonBack('menu-hoy-siento', true);
			break;
		case 'opcion-vacia':
			cerrarTodo('pagina-registro', desplegarPaginaShadow);
			activarBotonBack('pagina-registro', true);
			break;
		default:
			navigator.notification.alert("Sección en construcción", null, "Próximamente", "Cerrar");
			break;
	}
}

function cambiarSubPaginaModal(orden_prox, orden_act, id, callback){
	var actual = $("#" + id).find(".sub-pag[data-orden='" + orden_act + "']");
	var proximo = $("#" + id).find(".sub-pag[data-orden='" + orden_prox + "']");
	if(orden_prox > orden_act){

		actual.addClass("mover-a-izquierda");
		proximo.addClass("mover-de-derecha sub-activa");
		setTimeout(function() {		
			actual.removeClass("sub-activa");
			actual.removeClass("mover-a-izquierda");
			proximo.removeClass("mover-de-derecha");
			if(orden_prox == "1"){
				$("#" + id).find("#campo-texto-siento").focus();
			}
			callback();
		}, 500);
	}else if(orden_prox < orden_act){

		actual.addClass("mover-a-derecha");
		proximo.addClass("mover-de-izquierda sub-activa");
		setTimeout(function() {
			actual.removeClass("sub-activa");
			actual.removeClass("mover-a-derecha");
			proximo.removeClass("mover-de-izquierda");
			if(orden_prox == "1"){
				$("#" + id).find("#campo-texto-siento").focus();
			}
			callback();
		}, 500);
	}
}

function cambiarIconoFooter(orden_prox, orden_act, id){
	var menuProximo = $("#" + id).find(".icono-sub-menu[data-orden='" + orden_prox + "']");
	var menuActual = $("#" + id).find(".icono-sub-menu[data-orden='" + orden_act + "']");
	//menuActual.addClass("hacerChico");
	//menuProximo.addClass("hacerGrande");

	menuProximo.addClass("icono-activo");
	menuActual.removeClass("icono-activo");
}

function cargarSiento(id, callback){
	var fecha = obtenerFecha();
	$("#barra-fechas-siento .dia-semana").html(fecha.dia_semana.toUpperCase());
	$("#barra-fechas-siento .dia-mes").html(fecha.dia);
	$("#barra-fechas-siento .mes").html(fecha.mes.toUpperCase());
	$("#barra-fechas-siento .anio").html(fecha.anio);
	infoSiento(id,function(obj){
		
		$("#contenedor-datos-siento img").attr("src", obj.imagen);
		$("#contenedor-datos-siento h1").html(obj.titulo);
		$("#contenedor-datos-siento p").html(obj.descripcion);
		$(".sub-activa").each(function(){
			$(this).hide().removeClass("sub-activa");
		});
		$("#modal-siento-estrella").show().addClass("sub-activa").transition({x:0});
		callback("pagina-siento");
	});
	
}

function obtenerFecha(){
	var fecha = new Date();
	var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
	var meses_abr = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
	var dia_semana = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
	var fechaObj = {};
	fechaObj["dia"] = fecha.getDate();
	fechaObj["dia_semana"] = dia_semana[fecha.getDay()];
	fechaObj["mes"] = meses[fecha.getMonth()];
	fechaObj["mes_num"] = fecha.getMonth();
	fechaObj["mes_abr"] = meses_abr[fecha.getMonth()];
	fechaObj["anio"] = fecha.getFullYear();

	return fechaObj;
}

function desplegarPaginaModal(id){
	$("#"+id).show().transition({x:0});
	activarBotonBack(id, true);
}

function esconderPaginaModal(id){
	$("#"+id).transition({x:-physicalScreenWidth},function(){
		$("#"+id).hide();
	});
}

function inicializarContenido(){
	cargarFechaPrincipal();
	objetoLunas = inicializarDibujo();

}

function cargarFechaPrincipal(){
	var fecha = obtenerFecha();
	$("#contenedor-superior-principal .mes").html(fecha.mes_abr);
	cargarSlider(fecha.dia, fecha.mes_num, fecha.anio);

	var datos = cargarTipoMooona(fecha.dia, fecha.mes_num, fecha.anio);

	$("#barra-footer-principal .titulo-mooona").html(datos.tituloMooona);
	$("#contenedor-mooona-principal .descripcion-mooona").html(datos.descripcionMooona);

	$("#contenedor-mooona-principal .dia-inicial").html(datos.rangoInicial);
	$("#contenedor-mooona-principal .dia-final").html(datos.rangoFinal);
	$("#contenedor-mooona-principal .mes").html(fecha.mes.toUpperCase());
	$("#contenedor-mooona-principal .imagen-principal").attr("src", datos.imagenMooona);
	$("#pagina-manzana-principal").html(datos.info_manzana);
	$("#pagina-pesa-principal").html(datos.info_pesa);
	$("#pagina-foco-principal").html(datos.info_foco);
	$("#pagina-arpa-principal").html(datos.info_arpa);
	$("#pagina-flor-principal").html(datos.info_flor);

}

function cargarSlider(dia, mes, anio){
	var dias = localStorage.getItem('regularidad_usr');
	for (var i = 1; i <= 150; i++){
		var fecha = new Date(anio, mes, dia);		
		fecha.setDate(dia - 151 + i);
		var fase = SunCalc.getMoonIllumination(fecha).phase;
		var claveUrlLuna = Math.round(fase*dias);
		$("#slider-dias-lunas").append("<div data-orden='" + i + "'><h2>" + fecha.getDate() + "</h2><img src='/img/luna-" + claveUrlLuna + ".png'/><h3>" + fecha.getMonth() + "</h3></div>");
		
	}
	var fechaHoy = new Date(anio, mes, dia);
	var fase = SunCalc.getMoonIllumination(fecha).phase;
	var claveUrlLuna = Math.round(fase*dias);
	$("#slider-dias-lunas").append("<div data-orden='151' class='contenedor-fecha-activa'><h2>" + dia + "</h2><img src='/img/luna-" + claveUrlLuna + ".png'/><h3>" + mes + "</h3></div>");
	for (var i = 152; i <= 300; i++){
		var fecha = new Date(anio, mes, dia);		
		fecha.setDate(dia - 151 + i);
		var fase = SunCalc.getMoonIllumination(fecha).phase;
		var claveUrlLuna = Math.round(fase*dias);
		$("#slider-dias-lunas").append("<div data-orden='" + i + "'><h2>" + fecha.getDate() + "</h2><img src='/img/luna-" + claveUrlLuna + ".png'/><h3>" + fecha.getMonth() + "</h3></div>");
	}
	var ancho = 0;
	var anchoIndiv = physicalScreenWidth/7;
	$(".contenedor-bordes").width(anchoIndiv);
	$("#slider-dias-lunas div").width(anchoIndiv);
	$("#slider-dias-lunas div").each(function(){
		ancho += $(this).width();
	});
	$("#slider-dias-lunas").width(ancho);
	$("#slider-dias-lunas").css({x: -anchoIndiv*147});

}


function toggleMooonaGeneral(){
	if($("#footer-principal").hasClass("cerrado")){
		abrirMooonaGeneral();
	}else{
		cerrarMooonaGeneral();
	}
}

function cerrarMooonaGeneral(){
	$("#footer-principal").stop().transition({y: $(window).height() - 170, duration: 300, queue: false},function(){
		$("#footer-principal .pagina-tipo-2").removeAttr("style");
		//$("#footer-principal").removeAttr("style");
	});
	$(".contenedor-fecha-principal .dia").stop().transition({y: -20, duration: 200, queue: false});
	$("#footer-principal").removeClass("abierto");
	$("#contenedor-detalles-principal .sub-activa").each(function(){
		$(this).removeClass("sub-activa");
	});
	$("#contenedor-detalles-principal .sub-pag[data-orden='3']").addClass("sub-activa");
	$("#footer-principal").addClass("cerrado");

	$(".pagina-tipo-3").each(function(){
		if($(this).hasClass("sub-activa")){
			$(this).removeClass("sub-activa");
		}
	});
	$(".icono-selector-detalles").each(function(){
		if($(this).hasClass("icono-activo")){
			$(this).removeClass("icono-activo");
		}
	});
	$("#pagina-foco-principal").addClass("sub-activa");
	$("#selector-detalles-foco").addClass("icono-activo");
}

function abrirMooonaGeneral(){
	$("#footer-principal").stop().transition({y:0, duration: 300, queue: false});
	$(".contenedor-fecha-principal .dia").stop().transition({y: 0, duration: 300, queue: false});
	$("#footer-principal").removeClass("cerrado");
	$("#footer-principal").addClass("abierto");
	activarBotonBack("footer-principal", false);

}

function abrirPaginaDetalles(){
	$("#contenedor-mooona-principal").transition({height: 0},function(){
		$("#contenedor-mooona-principal").removeAttr("style");
	});
	$("#contenedor-detalles-principal").transition({y: 0});
}

function cambiarFechaSlider(ordenActual, ordenProximo){
	
	$("#slider-dias-lunas .contenedor-fecha-activa").removeClass("contenedor-fecha-activa");
	$("#slider-dias-lunas div[data-orden=" + ordenProximo + "]").addClass("contenedor-fecha-activa");
	var mesPasado = $("#slider-dias-lunas div[data-orden=" + ordenActual + "]").find("h3").html();
	var mesActual = $("#slider-dias-lunas div[data-orden=" + ordenProximo + "]").find("h3").html();
	var contenedorMesPasado;
	var contenedorMesActual;
	$("#contenedor-fecha-principal .mes").each(function(){
		if($(this).is(":visible")){
			contenedorMesPasado = $(this);
		}else{
			contenedorMesActual = $(this);
		}
	});
	if(mesPasado !== mesActual){
		var meses_abr = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
		contenedorMesActual.html(meses_abr[mesActual]);
		contenedorMesPasado.fadeOut(300,function(){
			contenedorMesActual.fadeIn(300);
		});
	}
	objetoLunas.moverLunas(ordenProximo - ordenActual);
	console.log(objetoLunas.movimiento);

	
	
}


