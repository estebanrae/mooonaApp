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
var productosCargados;
var NUM_LUNAS = 30;
var linkTienda = "http://canteraestudio.com/mooona/talleres-y-planes/";
var MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

function onDeviceReady(){
	console.log("Device is ready...");
	alert("Device is ready..."); //Test1
	physicalScreenWidth = window.screen.width;
	physicalScreenHeight = window.screen.height;
	//navigator.notification.alert("alto: " + physicalScreenHeight + "ancho: " + physicalScreenWidth, null, "Medidas", "Cerrar");
	allowTransitionChange = true;
	productosCargados = false;
	handleExternalURLs();
	setSelects();
	localStorage.setItem('previa', '');
	if(localStorage.getItem('login') == null || !localStorage.getItem('login').length || localStorage.getItem('login') == 'false'){
		$('#iniciar-sesion').show();
		cerrarTodo('pagina-registro', desplegarPaginaShadow);
	}else if(localStorage.getItem('nombre_usr') == null || !localStorage.getItem('nombre_usr').length){
		$('#contenedor-formulario').show();
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
		validarDatosUsuario();		

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

	$("#enviar-registro-s").on('tap', function(){
		validarRegistro();
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
		resetFooter();
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

	$(document).on('tap', '.cerrar-menu', function(e){
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
		var orden_act = $("#pagina-siento .sub-activa").attr("data-orden");
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
		var attr = $("#" + id).attr("data-attr");
		cargarSiento(attr, new Date(), desplegarPaginaModal);
	});

	$("#barra-fechas-siento").on("swipeleft", function(){
		cambiarFechaSiento(1);
	});

	$("#barra-fechas-siento").on("swiperight", function(){
		cambiarFechaSiento(-1);
	});

	$("#barra-siento-next").on("tap", function(){
		cambiarFechaSiento(1);
	});

	$("#barra-siento-back").on("tap", function(){
		cambiarFechaSiento(-1);
	});

	$("#barra-fechas-graph").on("swipeleft", function(){
		cambiarFechaGraph(1);
	});

	$("#barra-fechas-graph").on("swiperight", function(){
		cambiarFechaGraph(-1);
	});

	$("#barra-siento-next-graph").on("tap", function(){
		cambiarFechaGraph(1);
	});

	$("#barra-siento-back-graph").on("tap", function(){
		cambiarFechaGraph(-1);
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

	$(document).on("click", ".producto", function(){
		var id = $(this).attr("data-id");
		abrirProducto(id);
	});

	$(".estrella").click(function(){
		var magnitud = $(this).attr('data-magnitud');
		activarEstrella(magnitud);
	});


	$(".div-diosa").on("tap", function(){

		desplegarSubFooter("div-diosa", this);
	});

	$(".div-fertilidad").on("tap", function(){
		desplegarSubFooter("div-fertilidad", this);
	});

	$(document).on("tap", ".contenedor-tip .titulo", function(){
		var padre = $(this).closest(".contenedor-tip");
		$("#contenedor-tip-shadow .titulo").html(padre.find(".titulo").html());
		$("#contenedor-tip-shadow .contenido").html(padre.find(".contenido-completo").val());
		$("#contenedor-tip-shadow").show();
	});
}

function cambiarFechaSiento(direc){
	var attr = $("#attr-siento-actual").val();
	var fechaVieja = new Date($("#fecha-siento-actual").val());
	var fechaNueva = new Date(fechaVieja.getFullYear(), fechaVieja.getMonth(), parseInt(fechaVieja.getDate()) + direc);
	cargarSiento(attr, fechaNueva, function(){});
}

function cambiarFechaGraph(direc){
	var attr = $("#attr-siento-actual").val();
		var fechaVieja = new Date($("#anio-grafica-actual").val(), $("#mes-grafica-actual").val(), 1);
		var fechaNueva = new Date(fechaVieja.getFullYear(), parseInt(fechaVieja.getMonth()) + direc, fechaVieja.getDate());

		leerDatosGrafica(fechaNueva.getMonth(), fechaNueva.getFullYear(), attr);
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

	for(var anio = fecha.getFullYear(); anio > 1929; anio--){
		$('#sel-anio-nacimiento').append("<option value=" + anio + ">" + anio + "</option>");
	}
	for(var dia = 1; dia < 32; dia++){
		$('#sel-dia-nacimiento, #sel-dia-regla').append("<option value=" + dia + ">" + dia + "</option>");
	}
	for(var mes=0; mes < MESES.length; mes++){
		$('#sel-mes-nacimiento, #sel-mes-regla').append("<option value=" + mes + ">" + MESES[mes] + "</option>");
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
	if(	$("#" + activa).hasClass("modal") || $("#" + activa).hasClass("eventos") || $("#" + activa).hasClass("evento-nuevo") || $("#" + activa).hasClass("producto-abierto")){permite = false}	

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

function inicializarBD(){
	db = window.openDatabase("MooonaBD", "1.0", "Base Mooona", 200000);
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
	if($('#'+id).hasClass('pagina-productos')){
		var tipoProducto = $("#pagina-productos .barra-titulo h1 span").html();
		desplegarPaginaProductos(id, tipoProducto.toLowerCase());
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
		case 'opcion-periodo':
			cerrarTodo('pagina-productos', function(){
				desplegarPaginaProductos('pagina-productos', 'periodo');
			});
			break;
		case 'opcion-ejercicio':
			cerrarTodo('pagina-productos', function(){
				desplegarPaginaProductos('pagina-productos', 'ejercicio');
			});
			break;
		case 'opcion-nutricion':
			cerrarTodo('pagina-productos', function(){
				desplegarPaginaProductos('pagina-productos', 'nutricion');
			});
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

function cargarSiento(attr, fechaForm, callback){
	var fecha = obtenerFecha(fechaForm);
	$("#barra-fechas-siento .dia-semana").html(fecha.dia_semana.toUpperCase());
	$("#barra-fechas-siento .dia-mes").html(fecha.dia);
	$("#barra-fechas-siento .mes").html(fecha.mes.toUpperCase());
	$("#barra-fechas-siento .anio").html(fecha.anio);
	infoSiento(attr,function(obj){
		
		$("#contenedor-datos-siento img").attr("src", obj.imagen);
		$("#contenedor-datos-siento h1").html(obj.titulo);
		$("#contenedor-datos-siento p").html(obj.descripcion);
		$("#pagina-siento .sub-activa").each(function(){
			$(this).removeClass("sub-activa");
		});
		$("#modal-siento-estrella").addClass("sub-activa").transition({x:0});
		cargarSientoActual(fechaForm, attr);
		callback("pagina-siento");
	});
	
}

function obtenerFecha(fecha){
	var meses_abr = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
	var dia_semana = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
	var fechaObj = {};
	fechaObj["dia"] = fecha.getDate();
	fechaObj["dia_semana"] = dia_semana[fecha.getDay()];
	fechaObj["mes"] = MESES[fecha.getMonth()];
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

	llenarCamposRegistro();
	inicializarBD();
	syncProductos();
	syncDetalles();
	inicializarFooter();

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
	var fecha = obtenerFecha(new Date());
	$("#contenedor-superior-principal .mes").html(fecha.mes_abr);
	cargarSlider(fecha.dia, fecha.mes_num, fecha.anio);

	/*var datos = cargarTipoMooona(fecha.dia, fecha.mes_num, fecha.anio);
	
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
	*/

}

function cargarSlider(dia, mes, anio){
	var dias = localStorage.getItem('regularidad_usr');
	for (var i = 1; i <= 150; i++){
		var fecha = new Date(anio, mes, dia);		
		fecha.setDate(dia - 151 + i);
		var fase = SunCalc.getMoonIllumination(fecha).phase;
		var faseConv = fase.toFixed(2);
		if(faseConv == 1){
			faseConv = 0;
		}
		var claveUrlLuna = Math.round(faseConv*(NUM_LUNAS - 1) + 1);
		$("#slider-dias-lunas").append("<div data-orden='" + i + "' ><h2 data-sss='" + fase +"' data-fecha='" + fecha + "'>" + fecha.getDate() + "</h2><img src='img/luna-" + claveUrlLuna + ".png'/><h3>" + fecha.getMonth() + "</h3></div>");
		
	}
	var fechaHoy = new Date(anio, mes, dia);
	var fase = SunCalc.getMoonIllumination(fecha).phase;
	var faseConv = fase.toFixed(2);
	if(faseConv == 1){
		faseConv = 0;
	}
	var claveUrlLuna = Math.round(faseConv*(NUM_LUNAS - 1) + 1);
	$("#slider-dias-lunas").append("<div data-orden='151' class='contenedor-fecha-activa'><h2 data-sss='" + fase +"' data-fecha='" + fecha + "'>" + dia + "</h2><img src='img/luna-" + claveUrlLuna + ".png'/><h3>" + mes + "</h3></div>");
	for (var i = 152; i <= 300; i++){
		var fecha = new Date(anio, mes, dia);		
		fecha.setDate(dia - 151 + i);
		var fase = SunCalc.getMoonIllumination(fecha).phase;
		var faseConv = fase.toFixed(2);
		if(faseConv == 1){
			faseConv = 0;
		}
		var claveUrlLuna = Math.round(faseConv*(NUM_LUNAS - 1) + 1);
		$("#slider-dias-lunas").append("<div data-orden='" + i + "'><h2 data-sss='" + fase +"' data-fecha='" + fecha + "'>" + fecha.getDate() + "</h2><img src='img/luna-" + claveUrlLuna + ".png'/><h3>" + fecha.getMonth() + "</h3></div>");
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
	var tamanio = parseInt($("#footer-principal").height())*0.91; 
	$("#footer-principal").stop().transition({y: tamanio, duration: 300, queue: false},function(){
		$("#footer-principal .pagina-tipo-2").removeAttr("style");
		//$("#footer-principal").removeAttr("style");
	});
	//$(".contenedor-fecha-principal .dia").stop().transition({y: -20, duration: 200, queue: false});
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
			fechaTemp = new Date(fechaTemp.getFullYear(), fechaTemp.getMonth(), diasF);
			if(fechaTemp > fecha){
				break;
			}else{
				ultimaRegla = fechaTemp;
			}
		}
	}
	

	//Fecha de inicio de la ultima regla será ultimaRegla.Date(). Ultimo día será ultimaRegla.Date() + duracion
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
				var numeroImg = Math.round((((3*NUM_LUNAS/4) - (NUM_LUNAS/2))/etapaBruja)*ii + (NUM_LUNAS/2));
				objRes['numImg'] = numeroImg;
			}else if(ii >= etapaBruja && ii < (etapaBruja + etapas)){
				if(ii == etapaBruja){
					objRes['inicioEtapa'] = true;
				}else{
					objRes['inicioEtapa'] = false;
				}
				objRes['etapa'] = 'virgen';
				var numeroImg = Math.round(((NUM_LUNAS - (3*NUM_LUNAS/4))/etapas)*(ii - etapaBruja) + (3*NUM_LUNAS/4));
				objRes['numImg'] = numeroImg;
			}else if(ii >= (etapaBruja + etapas) && ii < (etapaBruja + 2*etapas)){
				if(ii == (etapaBruja + etapas)){
					objRes['inicioEtapa'] = true;
				}else{
					objRes['inicioEtapa'] = false;
				}
				objRes['etapa'] = 'madre';
				var numeroImg = Math.round((((NUM_LUNAS/4) - 1)/etapas)*(ii - (etapaBruja + etapas)) + 1);
				objRes['numImg'] = numeroImg;
			}else if(ii >= (etapaBruja + 2*etapas) && ii < (etapaBruja + 3*etapas)){
				if(ii == (etapaBruja + 2*etapas)){
					objRes['inicioEtapa'] = true;
				}else{
					objRes['inicioEtapa'] = false;
				}
				objRes['etapa'] = 'hechicera';
				var numeroImg = Math.round((((NUM_LUNAS/2) - (NUM_LUNAS/4))/etapas)*(ii - (etapaBruja + 2*etapas)) + (NUM_LUNAS/4));
				objRes['numImg'] = numeroImg;
			}
			break;
		}
	}

	return objRes;
}

function cambioSesion(previo, actual){
	$('#' + previo).hide();
	$('#' + actual).show();
}

function validarDatosUsuario(){
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
	}
}

function validarInicioSesion(){
	var usr = $('#usuario-inicio-s').val();
	var psw = $('#contrasena-inicio-s').val();
	/*var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if(!re.test(usr)){
		alert('El correo electrónico que ingresó es invalido');
		return;
	}*/

	// ACTIVAR PARA MOVIL
	//if(navigator.network.connection.type == 'none' || !coneccion){
	if(!coneccion){
		alert("No está conectado a internet");
		return;
	}else{
		$.ajax({
			url: 'http://canteraestudio.com/mooona/checar-usuario',
			method: 'POST',
			data: {usr: usr, psw: psw, set: 'true'},
			success: function(results){
				var res = results.split('|');
				if(res[0] == 'true'){
					localStorage.setItem('login', 'true');
					localStorage.setItem('email_usr', res[1]);
					cambioSesion('iniciar-sesion', 'contenedor-formulario')
				}else{
					localStorage.setItem('login', 'false');
					alert("Usuario o contraseña incorrectos");
					$("#usuario-inicio-s").val('');
					$("#contrasena-inicio-s").val('');
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
			  console.log(textStatus, errorThrown);
			  alert(errorThrown)//Test1
			}
		});	
	}
}

function validarRegistro(){
	var mail = $('#mail-registro-s').val();
	var usr = $('#usuario-registro-s').val();
	var psw = $('#contrasena-registro-s').val();
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if(!re.test(mail)){
		alert('El correo electrónico que ingresó es invalido');
		return;
	}

	// ACTIVAR PARA MOVIL
	//if(navigator.network.connection.type == 'none' || !coneccion){
	if(!coneccion){
		alert("No está conectado a internet");
		return;
	}else{
		$.ajax({
			url: 'http://canteraestudio.com/mooona/registrar-usuario',
			method: 'POST',
			data: {usr: usr, psw: psw, mail: mail},
			success: function(results){
				if(results == 'true'){
					localStorage.setItem('login', 'true');
					localStorage.setItem('email_usr', mail);
					cambioSesion('registro-sesion', 'contenedor-formulario');
				}else{
					localStorage.setItem('login', 'false');
					var error = results.split('|');
					var error = error[1];
					alert(error);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
			  console.log(textStatus, errorThrown);
			  alert(errorThrown);
			}
		});	
	}
}

function handleExternalURLs() {
    // Handle click events for all external URLs
    if (device.platform.toUpperCase() === 'ANDROID') {
        $(document).on('tap', '#link-a-pagina', function (e) {
            var url = linkTienda;
            navigator.app.loadUrl(url, { openExternal: true });
        });
    }
    else if (device.platform.toUpperCase() === 'IOS') {
        $(document).on('tap', '#link-a-pagina', function (e) {
            var url = linkTienda;
            window.open(url, '_system');
        });
    }else{
    	$(document).on('tap', '#link-a-pagina', function (e) {
            var url = linkTienda;
            window.open(url, '_system');
        });
    }
}

function syncDetalles(){
	console.log("FETCHING...");
	alert("FETCHING...");//Test1
	$.ajax({
		url: 'http://canteraestudio.com/mooona/leer-detalles',
		async: true,
		success: function(res){
			//console.log(res);
			res = JSON.parse(res);
			console.log("FINISHED");
			alert("FINISHED");//Test1
			var posts = res[0];
			var categories = res[1];
			guardarPosts(posts);
			guardarCategorias(categories);
		},
		error: function(jqXHR, textStatus, errorThrown){
			alert(errorThrown);
		}
	});
}


function guardarPosts(posts){
	db.transaction(function(tx){		
		tx.executeSql("CREATE TABLE IF NOT EXISTS posts ( "+
					"id_post INTEGER UNIQUE NOT NULL PRIMARY KEY, " +
					"titulo VARCHAR(200), " +
					"contenido VARCHAR(5000)," + 
					"descripcion VARCHAR(200)," + 
					"imgPath VARCHAR(100)," + 
					"resumen VARCHAR(500)," + 
					"imgPathExtra VARCHAR(100)," +
					"id_categoria INTEGER);");

		/*tx.executeSql("CREATE TABLE IF NOT EXISTS posts_categorias ( "+
					"id_post INTEGER, " +
					"id_categoria INTEGER);");*/
		$.each(posts, function(key, post){
			tx.executeSql("SELECT * FROM posts WHERE id_post = '" + post.ID + "'", [], 
				function(tx, results){
						continuarGuardarPosts(tx, results, post);
					}, errorCargarProductos);
		});
	},errorCargarProductos);
}

function continuarGuardarPosts(tx, results, post){
	if(results.rows.length == 0){
		tx.executeSql("INSERT INTO posts VALUES ('" + post.ID + "', '" + post.titulo + "', '" + post.contenido + "', '" + post.descripcion + "', '" + post.imagenURL + "', '" + post.resumen + "', '" + post.imagenExtraURL + "', '" + post.categoria + "') ");
	}else{
		tx.executeSql("UPDATE posts SET titulo = '" + post.titulo + "', contenido = '" + post.contenido + "', descripcion = '" + post.descripcion + "', resumen ='" + post.imagenURL + "', imgPath = '" + post.imagenURL + "', id_categoria= '" + post.categoria + "' WHERE id_post = '" + post.ID + "'");
	}
	if(post.imagenURL){
		//guardarImgPost(post.imagenURL, post.imagen, post);
		guardarImgPost(post, '1');
	}
	if(post.imagenExtraURL){
		guardarImgPost(post, '2');	
	}
	/*x.executeSql("DELETE FROM posts_categorias WHERE id_post = '" + post.ID + "'");
	$.each(post.categorias, function(key, categoria){
		tx.executeSql("SELECT * FROM posts_categorias WHERE id_post = '" + post.ID + "' AND id_categoria = '" + categoria + "'", [], 
			function (tx, results){
				guardarPostsCategorias(tx, results, post.ID, categoria);
			}, errorCargarProductos);
	});*/
}

/*function guardarPostsCategorias(tx, results, post, categoria){
	if(results.rows.length == 0){
		tx.executeSql("INSERT INTO posts_categorias (id_post, id_categoria) VALUES ('" + post+ "', '" + categoria + "') ");
	}
}
*/
function guardarCategorias(categorias){
	db.transaction(function(tx){
		tx.executeSql("CREATE TABLE IF NOT EXISTS categorias ( "+
					"id_categoria INTEGER UNIQUE NOT NULL PRIMARY KEY, " +
					"nombre VARCHAR(200), " +
					"padre VARCHAR(200));");
		$.each(categorias, function(key, categoria){
			tx.executeSql("SELECT * FROM categorias WHERE id_categoria = '" + categoria.ID + "'", [], function(tx, results){
				continuarGuardarCategorias(tx, results, categoria);
			}, errorCargarProductos);
		});
	},errorCargarProductos);			
}

function continuarGuardarCategorias(tx, results, categoria){
	if(results.rows.length == 0){
		tx.executeSql("INSERT INTO categorias (id_categoria, nombre, padre) VALUES ('" + categoria.ID + "', '" + categoria.nombre + "', '" + categoria.padre + "') ");
	}else{
		tx.executeSql("UPDATE categorias SET nombre = '" + categoria.nombre + "', padre = '" + categoria.padre + "' WHERE id_categoria = '" + categoria.ID + "'");
	}
}

function guardarImgPost(post, imagen){
	window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
 	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
 		successImgPost(fileSystem, post, imagen);
 	}, fail); /**/ //ACTIVAR PARA MOVIL
}

function successImgPost(fileSystem, post, imagen){
	target_directory = fileSystem.root.nativeURL;
	if(imagen == 1){
		downloadImage(encodeURI(post.imagenURL), post.imagen, target_directory, function(urlNuevo){guardarImgPostBase(urlNuevo, post.ID, imagen)});
	}else{
		downloadImage(encodeURI(post.imagenExtraURL), post.imagenExtra, target_directory, function(urlNuevo){guardarImgPostBase(urlNuevo, post.ID, imagen)});
	}
	
}

function guardarImgPostBase(url, id, imagen){
	db.transaction(function(tx){
		if(imagen == 1){
			tx.executeSql("UPDATE posts SET imgPath='" + url + "' WHERE id_post='" + id + "'");
			tx.executeSql('SELECT * FROM posts' , [], function(tx, results){
			console.log(results.rows[1]);
		},funcionErrorBase2);
		}else{
			tx.executeSql("UPDATE posts SET imgPathExtra='" + url + "' WHERE id_post='" + id + "'");
		}
		
	},errorCargarProductos);
}


function inicializarFooter(){
	var moona = calculoFechasMooona(new Date());
	var luna = lunaHoy();
	var fechas = calculoFechasFooter(moona.etapa);
	/*recuperarPost(moona.etapa, function(res){
		$("#contenedor-mooona-principal img").attr("src", res.imgPath);
		$("#contenedor-mooona-principal h4").html(res.contenido);
	});
	recuperarSubPostsFooter(moona.etapa);*/
	recuperarPost("virgen", function(res){							//CAMBIAR POR LINEAS DE ARRIBA CUANDO SE PUBLIQUEN 
		$("#contenedor-mooona-principal img").attr("src", res[0].imgPath);	//TODOS LOS POSTS
		$("#contenedor-mooona-principal h4").html(res[0].contenido);		//
	});																	//
	recuperarSubPostsFooter("virgen"); 									// 

	$("#rango-fechas-mooona .dia-inicial").html(fechas.init.getDate());
	$("#rango-fechas-mooona .dia-final").html(fechas.fin.getDate());
	$("#rango-fechas-mooona .mes").html(MESES[fechas.init.getMonth()]);
	$(".titulo-mooona").html("Moona " + moona.etapa + " en " + luna);
}

function calculoFechasFooter(etapa){
	var hoy = new Date();
	var fechaTemp = hoy;
	while(calculoFechasMooona(fechaTemp).etapa == etapa){
		fechaTemp = new Date(fechaTemp.getFullYear(), fechaTemp.getMonth(), parseInt(fechaTemp.getDate()) - 1);
	}
	var fechaInit = new Date(fechaTemp.getFullYear(), fechaTemp.getMonth(), parseInt(fechaTemp.getDate()) + 1);
	var fechaTemp = hoy;
	while(calculoFechasMooona(fechaTemp).etapa == etapa){
		fechaTemp = new Date(fechaTemp.getFullYear(), fechaTemp.getMonth(), parseInt(fechaTemp.getDate()) + 1);
	}
	var fechaFin = new Date(fechaTemp.getFullYear(), fechaTemp.getMonth(), parseInt(fechaTemp.getDate()) - 1);
	return {init : fechaInit, fin: fechaFin}
}

function lunaHoy(){
	var texto = '';
	var fase = SunCalc.getMoonIllumination(new Date()).phase;
	if(fase >= 0.88 || fase < 0.13){
		texto = 'Luna Nueva';
	}
	if(fase >= 0.13 && fase < 0.38){
		texto = 'Luna Creciente';
	}
	if(fase >= 0.38 && fase < 0.63){
		texto = 'Luna Llena';
	}
	if(fase >= 0.63 && fase < 0.88){
		texto = 'Luna Menguante';
	}
	return texto;
}

function recuperarPost(categoria, regresar){
	db.transaction(function(tx){
		tx.executeSql('SELECT * FROM posts AS p LEFT JOIN categorias AS c ON p.id_categoria=c.id_categoria WHERE c.nombre = "' +  categoria + '"', [], function(tx, results){
			if(results.rows.length > 0){
				regresar(results.rows);
			}else{
				errorRecuperarPost({code: 1, message: "no hay nada con esa categoria"});
			}

		},funcionErrorBase2);
	}, errorRecuperarPost);
}

function recuperarSubPostsFooter(etapa){
	recuperarSubPostsFoco(etapa);
	recuperarSubPostsManzana(etapa);
	recuperarSubPostsArpa(etapa);
	recuperarSubPostsPesa(etapa);
	recuperarSubPostsFlor(etapa);
}

function recuperarSubPostsFoco(etapa){
	recuperarPost("foco-" + etapa, function(res){
		$("#pagina-foco-principal h2").html(res[0].descripcion);
		$("#pagina-foco-principal p").html(res[0].contenido);
		$("#selector-detalles-foco img").attr("src", res[0].imgPath);
	});
}

function recuperarSubPostsManzana(etapa){
	$("#fechas-manzana, #contenedor-tips, #contenedor-alimentos").html("");
	recuperarPost("manzana-" + etapa, function(res){
		$("#selector-detalles-manzana img").attr("src", res[0].imgPath);
		recuperarDivLunas(etapa);
		switch(etapa){
			case "madre": 
				var descEtapa = "Ovulación";
				break;
			case "hechicera":
				var descEtapa = "Pre-menstrual";
				break;
			 case "bruja":
			 	var descEtapa = "Menstruación";
				break;
			case "virgen":
				var descEtapa = "Pre-ovulación";
				break;
		}

		recuperarTipsManzana(res[0].id_categoria);

		$("#pagina-manzana-principal h2").html(descEtapa);
		$("#pagina-manzana-principal .contenedor-info-manzana p").html(res[0].contenido);
		$("#pagina-manzana-principal h1 span").html(etapa);
	});
}

function recuperarTipsManzana(ID){
	db.transaction(function(tx){
		tx.executeSql('SELECT * FROM categorias WHERE padre = "' +  ID + '"', [], function(tx, results){
			$.each(results.rows, function(key, val){
				recuperarPost(val.nombre, function(res){
					$.each(res, function(key2, val2){
						var html = "<div id='" + val2.nombre + "' class='contenedor-tip'>";
						html += "<div class='titulo'>";
						html += "<img class='logo' src='" + val2.imgPath + "'/>";
						html += "<h2>" + val2.titulo + "</h2>";
						html += "<span>+</span>";
						html += "</div>";
						html += "<p>" + val2.resumen + "</p>";
						html += "<input type='hidden' class='contenido-completo' value='" + val2.contenido + "'/>";
						html += "</div>";
						if(val2.nombre.indexOf('alimentos') !== -1){
							$("#contenedor-alimentos").append(html);
						}else{
							$("#contenedor-tips").append(html);
						}
					});

				});
			});
		},funcionErrorBase2);
	}, errorRecuperarPost);
}

function recuperarDivLunas(etapa){
	var fechasFase = recuperarFechasFaseAct(etapa);
	var hoy = new Date();
	var cnt = 0;
	$.each(fechasFase.fechas, function(key, val){
		var div = document.createElement('div');
		div.className = "fecha-manzana";
		var img = new Image();
		if(hoy.getDate() == fechasFase.fechas[key]){
			div.className = "fecha-manzana fecha-actual";
			img.src = "img/luna-rosa" + fechasFase.lunas[key] + ".png";
		}else{
			img.src = "img/luna-" + fechasFase.lunas[key] + ".png";
		}
		div.innerHTML = "<h1>" + fechasFase.fechas[key] + "</h1>";
		div.appendChild(img);
		cnt++;
		$("#fechas-manzana").append(div);
	});
	$(".fecha-manzana").css("width", $("#fechas-manzana").width()/ cnt);
}

function recuperarSubPostsArpa(etapa){
	recuperarPost("arpa-" + etapa, function(res){
		$("#pagina-arpa-principal h2").html(res[0].descripcion);
		$("#pagina-arpa-principal .contenido-arpa p").html(res[0].contenido);
		$("#selector-detalles-arpa img").attr("src", res[0].imgPath);
	});
	recuperarPost("diosa-" + etapa, function(res){
		var cnt = 1;
		$.each(res, function(key, diosa){
			$(".contenedor-diosas  #diosa-" + cnt + " h5").html(diosa.titulo);
			$(".contenedor-diosas  #diosa-" + cnt + " h6").html(diosa.descripcion);
			$(".contenedor-diosas  #diosa-" + cnt + " .contenido").val(diosa.contenido);
			$("#pagina-arpa-principal #diosa-" + cnt + " img").attr("src", diosa.imgPath);
			//$("#pagina-arpa-principal #diosa-" + cnt + " h5").attr("src", diosa.imgPath);
			cnt++;
		});
	});

}
function recuperarSubPostsPesa(etapa){
	recuperarPost("pesa-" + etapa, function(res){
		$("#pagina-pesa-principal h2").html(res[0].descripcion);
		$("#pagina-pesa-principal img").attr("src", res[0].imgPathExtra);
		$("#pagina-pesa-principal p").html(res[0].contenido);
		$("#selector-detalles-pesa img").attr("src", res[0].imgPath);
	});
}
function recuperarSubPostsFlor(etapa){
	recuperarPost("flor-" + etapa, function(res){
		$("#selector-detalles-flor img").attr("src", res[0].imgPath);
		$("#pagina-flor-principal .contenido-flor p").html(res[0].contenido);
	});

	recuperarPost("fertilidad biologica", function(res){
		$("#boton-fertilidad-biologica img").attr("src", res[0].imgPath);
		$("#boton-fertilidad-biologica h5").html(res[0].titulo);
		$("#boton-fertilidad-biologica .contenido").val(recuperarFertilidadBiologica());

	});
	recuperarPost("fertilidad lunar", function(res){
		$("#boton-fertilidad-lunar img").attr("src", res[0].imgPath);
		$("#boton-fertilidad-lunar h5").html(res[0].titulo);
		$("#boton-fertilidad-lunar .contenido").val(recuperarFertilidadLunar());
	});
}

function recuperarFertilidadBiologica(){
	var etapa = calculoFechasMooona(new Date()).etapa;
	if(etapa == "madre"){
		return "Hoy <span>si</span> estás fértil";
	}else{
		return "Hoy <span>no</span> estás fértil";
	}
}

function recuperarFertilidadLunar(){
	return "Próximamente";
}

function continuacionRecuperarPostPrincipal(tx, contador){
	console.log(contador);
}
function funcionErrorBase2(tx, err){
	alert("1: ERROR-" + err.code + ": " + err.message);
}

function errorRecuperarPost(err){
	alert("2: ERROR-" + err.code + ": " + err.message);
}

function resetFooter(){
	resetSubFooter("div-diosa");
	resetSubFooter("div-fertilidad");
}

function resetSubFooter(clase){
	$("." + clase).each(function(){
		$(this).attr("data-seleccionada", "false");
		$(this).find("h6").hide();
	});
	$(".contenedor-sub-iconos").removeClass("azul");
	$(".contenido-extra-sub").hide();
	$(".contenido-extra-sub p").html("");
}

function desplegarSubFooter(clase, esto){
	var contenido = $(esto).find(".contenido").val();
	$("." + clase).each(function(){
		$(this).attr("data-seleccionada", "false");
		$(this).find("h6").hide();
	});
	$(esto).find("h6").show();
	$(esto).attr("data-seleccionada", "true");
	$(".contenido-extra-sub p").html(contenido);
	$(".contenido-extra-sub").show();
	$(".contenedor-sub-iconos").addClass("azul");
}

function recuperarFechasFaseAct(etapa){
	var hoy = new Date();
	var fecha = hoy;
	var calculo = calculoFechasMooona(hoy);
	var etapa = calculo.etapa;
	var etapaTemp = etapa;
	var cnt = 1;
	var fechas = [];
	var lunas = [];
	fechas.push(hoy.getDate());
	//lunas.push(calculo.numImg); // En el caso de que se use la luna MOONA *** Caso 1
	var fase = SunCalc.getMoonIllumination(hoy).phase;
	var faseCalc = fase.toFixed(2);
	if(faseCalc == 1){
		faseCalc = 0;
	}
	lunas.push(Math.round(faseCalc*(NUM_LUNAS - 1) + 1));
	//En el caso de que se use la luna de hoy *** Caso 2
	while (true ){
		fecha = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + cnt);
		var calc = calculoFechasMooona(fecha);
		etapaTemp = calc.etapa;
		if(etapaTemp === etapa){
			fechas.push(fecha.getDate());
			//lunas.push(calc.numImg); // Caso 1
			var fase = SunCalc.getMoonIllumination(fecha).phase;
			var faseCalc = fase.toFixed(2);
			if(faseCalc == 1){
				faseCalc = 0;
			}
			lunas.push(Math.round(faseCalc*(NUM_LUNAS - 1) + 1));
			//Caso 2
			cnt++;		
		}else{
			break;
		}
	}
	var cnt = 1;
	while (true ){
		fecha = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - cnt);
		var calc = calculoFechasMooona(fecha);
		etapaTemp = calc.etapa;
		if(etapaTemp === etapa){
			fechas.unshift(fecha.getDate());
			//lunas.unshift(calc.numImg); // Caso 1
			var fase = SunCalc.getMoonIllumination(fecha).phase;
			var faseCalc = fase.toFixed(2);
			if(faseCalc == 1){
				faseCalc = 0;
			}
			lunas.unshift(Math.round(faseCalc*(NUM_LUNAS - 1) + 1));
			//Caso 2	
			cnt++;		
		}else{
			break;
		}
	}
	return {fechas: fechas, lunas: lunas};
}


//NOTIFICACIONES: http://devgirl.org/2013/07/17/tutorial-implement-push-notifications-in-your-phonegap-application/



