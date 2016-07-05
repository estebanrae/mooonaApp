$(document).ready(function(){
	document.addEventListener('deviceready', onDeviceReady, false);
	var deviceType = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";

});


var physicalScreenWidth;
var physicalScreenHeight; 
var allowTransitionChange;
var objetoLunas;
var db;
var coneccion;

function onDeviceReady(){
	console.log("Device is ready...");
	physicalScreenWidth = window.screen.width;
	physicalScreenHeight = window.screen.height;
	//navigator.notification.alert("alto: " + physicalScreenHeight + "ancho: " + physicalScreenWidth, null, "Medidas", "Cerrar");
	localStorage.setItem('nombre_usr', '');
	allowTransitionChange = true;
	setSelects();
	localStorage.setItem('previa', '');
	if(localStorage.getItem('nombre_usr') == null || !localStorage.getItem('nombre_usr').length){
		$('#iniciar-sesion').show();
		cerrarTodo('pagina-registro', desplegarPaginaShadow);
	}else{
		inicializarContenido();
		setPaginaActiva('pagina-principal');
	}	
	coneccion = true;

	document.addEventListener('online', function(){coneccion = true}, false);
	document.addEventListener('offline', function(){coneccion = false}, false);
	//eliminarTablaCalendario();

	$('#boton-registrar').on('tap', function(e){
		e.preventDefault();
		validarRegistro();		

	});

	$(".abrir-registrar").on('tap',function(e){
		e.preventDefault();
		cambioSesion('iniciar-sesion', 'registro-sesion');
	});

	$(".abrir-iniciar-s").on('tap',function(e){
		e.preventDefault();
		cambioSesion('registro-sesion', 'iniciar-sesion');
	});

	$('#header-menu').on('tap',function(e){
		toggleMenu();
	});

	$('#header-back').on('tap',function(){
		botonBack();
	});

	$("#icono-notas-siento").on('tap',function(){
		$("#campo-texto-siento").focus();
	});

	$("#barra-footer-principal").on("swipeup", function(e){
		abrirMooonaGeneral();
		//$(this).css({top: '60px'});
	});

	$("#radio-todo-dia").on('change', function(){
		if($(this).is(":checked")){
			cambiarTodoElDia(true);
		}else{
			cambiarTodoElDia(false);
		}
	});

	$("#boton-guardar-evento").on('tap',function(){
		validarEventoNuevo();
	});
	
	$("#cerrar-evento-nuevo").on('tap',function(){
		activarBotonBack('pagina-evento', true);
		esconderPaginaShadow('pagina-evento-nuevo');
	});

	$("#repetir-evento img").on('tap',function(){	
		var hoy = new Date($("#input-anio-escondido").val(), $("#input-mes-escondido").val(), $("#input-dia-escondido").val());
		$("#dias-repetir").show();
		$("#dias-repetir select option").each(function(){ $(this).removeAttr("selected");})
		$("#dias-repetir select option[value='0']").attr("selected", 'true');
		$(this).hide();
	});

	$("#dias-repetir select").on('change', function(){
		if($(this).find("option:selected").val() == '-1'){
			$("#dias-repetir").hide();
			$("#repetir-evento img").show();
		}
	});

	$("#enviar-inicio-s").on('tap', function(){
		validarInicioSesion();
	});

	/*$("#repetir-evento li").on('tap',function(){
		if($(this).attr('data-active') == 'true'){
			$(this).attr('data-active', 'false');
			var activos= false;
			$("#repetir-evento li").each(function(){
				if($(this).attr('data-active') == 'true'){
					activos = true;
				}
			});
			if(!activos){
				$("#dias-repetir").hide();
				$("#repetir-evento img").show();
			}
		}else{
			$(this).attr('data-active', 'true');
		}
	});*/

	$("#boton-agregar-evento").on('tap',function(){
		var actual =  localStorage.getItem('activa');
		var fecha = '';
		
		var dia = $("#input-dia-escondido").val();
		var mes = $("#input-mes-escondido").val();
		var anio = $("#input-anio-escondido").val();
		fecha = new Date(anio, mes, dia);
		activarBotonBack('pagina-evento-nuevo', true);
		cargarDatosEventoNuevo(fecha);
		desplegarPaginaShadow('pagina-evento-nuevo');
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
	

	$("#sub-menu-footer .icono-selector-detalles").on('tap',function(){
		
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

	$("#barra-footer-principal").on('tap',function(){
		toggleMooonaGeneral();
	});

	$("#boton-detalles-mooona").on('tap',function(){
		abrirPaginaDetalles();
	});

	$("#header-siento .imagen-icono").on('tap',function(){
		var orden_prox = $(this).attr("data-orden");
		var orden_act = $(".sub-activa").attr("data-orden");
		if(orden_act == orden_prox){return;}
		if(allowTransitionChange){
			allowTransitionChange = false;
			cambiarSubPaginaModal(orden_prox, orden_act, "pagina-siento", function(){
				allowTransitionChange = true;
			});
		}
	});

	$('.contenedor-boton-siento').on('tap',function(e){
		var id = $(this).attr('id');
		cargarSiento(id, desplegarPaginaModal);
	});

	$(".opcion").on('tap',function(e){
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

	$(".calendario-fecha-prev").on('tap',function(){
		cambiarMesCalendario(-1);
	});

	$(".calendario-fecha-next").on('tap',function(){
		cambiarMesCalendario(1);
	});

	$(".calendario-eventos-next").on('tap',function(){
		console.log("AA");
		cambiarDiaCalendario(1);
	});

	$(".calendario-eventos-prev").on('tap',function(){
		cambiarDiaCalendario(-1);
	});

	$(".pagina-calendario .barra-mes").on("swipeleft", function(e){
		cambiarMesCalendario(1);
	});

	$(".pagina-calendario .barra-mes").on("swiperight", function(e){
		cambiarMesCalendario(-1);
	});
}

function cambiarMesCalendario(direc){
	var fecha = $("#mes-calendario-general").val();
	var fechaArr = fecha.split('-');
	var nuevo_mes = parseInt(fechaArr[1]) + direc;
	fechaJSPrevia = new Date(fechaArr[0], nuevo_mes, fechaArr[2]);
	cargarCalendario(fechaJSPrevia);
}

function cambiarDiaCalendario(direc){
	var diaNuevo = parseInt($("#input-dia-escondido").val()) + direc;
	var fecha = new Date($("#input-anio-escondido").val(), $("#input-mes-escondido").val(), diaNuevo);
	var obj = {data: fecha};
	cargarEvento(obj);

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
		$('#sel-mes-nacimiento, #sel-mes-regla').append("<option value=" + mes + ">" + meses[mes] + "</option>");
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
	if(	$("#" + activa).hasClass("modal") || $("#" + activa).hasClass("eventos") || $("#" + activa).hasClass("evento-nuevo")){permite = false}	

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

	if($('#'+id).hasClass('pagina-calendario')){
		desplegarPaginaCalendario(id);
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
	$("#sel-dia-nacimiento option[value='" + localStorage.getItem('nacimiento_d_usr') + "']").attr("selected", "selected");
	$("#sel-mes-nacimiento option[value='" + localStorage.getItem('nacimiento_m_usr') + "']").attr("selected", "selected");
	$("#sel-anio-nacimiento option[value='" + localStorage.getItem('nacimiento_a_usr') + "']").attr("selected", "selected");
	$("#sel-dia-regla option[value='" + localStorage.getItem('ultima_d_usr') + "']").attr("selected", "selected");
	$("#sel-mes-regla option[value='" + localStorage.getItem('ultima_m_usr') + "']").attr("selected", "selected");
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

function desplegarPaginaCalendario(id){
	$("#"+id).show().transition({x:0});
	cargarCalendario(new Date());
}

function cerrarTodo(idActual, callback){
	$(".shadow").each(function(){
		var id = $(this).attr('id');
		if(id !== idActual){
			esconderPaginaShadow(id);
		}	
	});

	$(".desplegar-izquierda").each(function(){
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
			$('.contenedor-formulario').show();
			cerrarTodo('pagina-registro', desplegarPaginaShadow);
			activarBotonBack('pagina-registro', true);
			break;
		case 'opcion-calendario':			
			cerrarTodo('pagina-calendario', desplegarPaginaCalendario);
			activarBotonBack('pagina-calendario', true);
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
		actual.on("animationend", function(){
			actual.removeClass("sub-activa");
			actual.removeClass("mover-a-izquierda");
			proximo.removeClass("mover-de-derecha");
			if(orden_prox == "1"){
				$("#" + id).find("#campo-texto-siento").focus();
			}
			callback();
			actual.off("animationend");
		});	
			
	}else if(orden_prox < orden_act){

		actual.addClass("mover-a-derecha");
		proximo.addClass("mover-de-izquierda sub-activa");
		actual.on("animationend", function(){
			actual.removeClass("sub-activa");
			actual.removeClass("mover-a-derecha");
			proximo.removeClass("mover-de-izquierda");
			if(orden_prox == "1"){
				$("#" + id).find("#campo-texto-siento").focus();
			}
			callback();
			actual.off("animationend");
		});
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
	objetoLunas = inicializarDibujo ();

	objetoLunas.draw();

	llenarCamposRegistro();
	inicializarBD();

	$("#slider-dias-lunas div").on("click", function(e){
		if(!objetoLunas.movimiento && !$(this).hasClass('contenedor-fecha-activa')){
			var anchoIndiv = physicalScreenWidth/7;
			var orden = $("#slider-dias-lunas .contenedor-fecha-activa").attr("data-orden");
			var nuevoOrden = $(this).attr("data-orden");
			$("#slider-dias-lunas").transition({x: '+=' + anchoIndiv*(orden-nuevoOrden)});
			cambiarFechaSlider(orden, nuevoOrden);
		}
	});
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

	$(".sub-pag-eventos").hide();

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
}

function calculoFechasMooona(fecha){
	var duracion = localStorage.getItem("regularidad_usr");
	var etapas = Math.trunc(duracion/4);
	var etapaBruja = etapas + duracion%4;
	var hoy = new Date();
	var ultimaRegla = new Date(hoy.getFullYear(), localStorage.getItem("ultima_m_usr"), localStorage.getItem("ultima_d_usr"));
	var fechaTemp = new Date(ultimaRegla.getFullYear(), ultimaRegla.getMonth(), ultimaRegla.getDate());
	console.log(ultimaRegla);
	if(ultimaRegla > fecha){
		while(true){
			var diasF = parseInt(fechaTemp.getDate()) - parseInt(duracion);
			fechaTemp = new Date(fechaTemp.getFullYear(), fechaTemp.getMonth(), diasF);
			if(fechaTemp <= fecha){
				ultimaRegla = fechaTemp;
				break;
			}
		}
	}else{
		while(true){
			var diasF = parseInt(fechaTemp.getDate()) + parseInt(duracion);
			console.log(fechaTemp.getDate());
			fechaTemp = new Date(fechaTemp.getFullYear(), fechaTemp.getMonth(), diasF);
			if(fechaTemp > fecha){
				break;
			}else{
				ultimaRegla = fechaTemp;
			}
		}
	}
	

	//Fecha de inicio de la ultima regla será ultimaRegla.Date(). Ultimo día será ultimaRegla.Date() + duracion
	console.log(ultimaRegla);
	var objRes = {};
	for(var ii = 0; ii < duracion; ii++){
		fechaTemp = new Date(ultimaRegla.getFullYear(), ultimaRegla.getMonth(), ultimaRegla.getDate() + ii);
		if(fechaTemp.getFullYear() == fecha.getFullYear() && fechaTemp.getMonth() == fecha.getMonth() && fechaTemp.getDate() == fecha.getDate()){
			if(ii >= 0 && ii < etapaBruja){
				if(ii == 0){
					objRes['inicioEtapa'] = true;
				}else{
					objRes['inicioEtapa'] = false;
				}
				objRes['etapa'] = 'bruja';
			}else if(ii >= etapaBruja && ii < (etapaBruja + etapas)){
				if(ii == etapaBruja){
					objRes['inicioEtapa'] = true;
				}else{
					objRes['inicioEtapa'] = false;
				}
				objRes['etapa'] = 'virgen';
			}else if(ii >= (etapaBruja + etapas) && ii < (etapaBruja + 2*etapas)){
				if(ii == (etapaBruja + etapas)){
					objRes['inicioEtapa'] = true;
				}else{
					objRes['inicioEtapa'] = false;
				}
				objRes['etapa'] = 'madre';
			}else if(ii >= (etapaBruja + 2*etapas) && ii < (etapaBruja + 3*etapas)){
				if(ii == (etapaBruja + 2*etapas)){
					objRes['inicioEtapa'] = true;
				}else{
					objRes['inicioEtapa'] = false;
				}
				objRes['etapa'] = 'hechicera';
			}
			break;
		}
	}

	return objRes;
	//console.log((fecha - ultimaRegla)/(1000*60*60*24));
}

function cambioSesion(previo, actual){
	$('#' + previo).hide();
	$('#' + actual).show();
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
		inicializarContenido();
		setPaginaActiva('pagina-principal');
		botonBack();
	}
}

function validarInicioSesion(){
	var usr = $('#usuario-inicio-s').val();
	var psw = $('#contrasena-inicio-s').val();
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if(!re.test(usr)){
		alert('El correo electrónico que ingresó es invalido');
		return;
	}

	if(navigator.network.connection.type == 'none' || !coneccion){
		alert("No está conectado a internet");
		return;
	}else{
		$.ajax({
			url: '192.168.0.148:80/mooona/checar-usuario/',
			method: 'POST',
			data: {usr: usr, psw: psw},
			success: function(results){
				alert(results);
			}

		});	
	}
}

