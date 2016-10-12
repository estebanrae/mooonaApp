/************************* CALENDARIO ****************************/


/*******************************************************************************
* Función: cargarCalendario
* Creado por: Esteban Ramírez
* Empresa: Cantera Estudio
* Descripción: Esta función carga todas las fechas del mes actual en la sección
*		de calendario.
*
* Recibe:
* 	date: la fecha del mes que se desea cargar
*
* Regresa: Nada
*
* Referencias:
*	checarEventos
* 	calculoFechasMooona
*********************************************************************************/

function cargarCalendario(date){
	//var meses_abr = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
	var fechaMes = date.getMonth();
	var fechaAnio = date.getFullYear();
	var fechaDiaUno = new Date(fechaAnio, fechaMes, 1);
	$(".calendario-footer span").width(($(".calendario-footer").height())/2);
	$(".calendario-footer span").height(($(".calendario-footer").height())/2);
	var semanaUno = fechaDiaUno.getDay();
	var mesesC = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
	$("#calendario-dias .semana-1 .celda-dia[data-diasem='" + semanaUno + "']").find(".titulo-celda h1").html('1');
	var cnt = $("#calendario-dias .semana-1 .celda-dia[data-diasem='" + semanaUno + "']").attr('data-celda');
	var fechaCal = new Date(fechaDiaUno.getFullYear(), fechaDiaUno.getMonth(),1 - (cnt - 1));
	var hoy = new Date();
	$("#pagina-calendario .barra-mes .mes, #pagina-evento .barra-fecha .mess").html(mesesC[date.getMonth()]);
	$("#pagina-calendario .barra-mes .anio, #pagina-evento .barra-fecha .anio").html(date.getFullYear());
	$("#calendario-dias .celda-dia .titulo-celda .marcador-evento").each(function(){
		$(this).remove();
	});
	$(".fecha-opaco").each(function(){
		$(this).removeClass("fecha-opaco");
	});
	$("#calendario-dias .celda-dia.fecha-actual").each(function(){
		$(this).removeClass("fecha-actual");
	});
	$("#calendario-dias .celda-dia .pico-fecha-actual").each(function(){
		$(this).remove();
	});
	$(".titulo-celda h1").each(function(){
		$(this).html('');
	});
	$("#calendario-dias .celda-dia").each(function(){
		$(this).off("tap");
	});

	$("#calendario-dias .celda-dia .contenedor-inferior").each(function(){
		$(this).removeClass("fecha-fertilidad");
		$(this).html('');
	});
	$("#mes-calendario-general").val(date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate());
	for(var ii = 1; ii < 43; ii++){
			if(fechaCal.getDate() == hoy.getDate() && fechaCal.getMonth() == hoy.getMonth() && fechaCal.getFullYear() == hoy.getFullYear()){
				$("#calendario-dias .celda-dia[data-celda='" + ii + "']").addClass("fecha-actual");
				$("#calendario-dias .celda-dia[data-celda='" + ii + "'] .titulo-celda").append('<img src="img/fecha-actual.png" class="pico-fecha-actual">');
			}	
			$("#calendario-dias .celda-dia[data-celda='" + ii + "']").find(".titulo-celda h1").html(fechaCal.getDate());		
			checarEventos(fechaCal, ii);

			$("#calendario-dias .celda-dia[data-celda='" + ii + "']").on("tap", fechaCal, cargarEvento);
			if(fechaCal.getMonth() !== date.getMonth()){
				$("#calendario-dias .celda-dia[data-celda='" + ii + "']").addClass('fecha-opaco');
			}	
			var moonas = calculoFechasMooona(fechaCal);
			if(moonas.inicioEtapa){
				$("#calendario-dias .celda-dia[data-celda='" + ii + "'] .contenedor-inferior").html('<img src="img/diosa-' + moonas.etapa + '.png" class="imagen-moona-inicial">');
			}
			if(moonas.etapa == 'madre'){
				$("#calendario-dias .celda-dia[data-celda='" + ii + "'] .contenedor-inferior").addClass("fecha-fertilidad");
			}
			var fechaCal = new Date(fechaCal.getFullYear(), fechaCal.getMonth(), fechaCal.getDate() + 1);
	}	
}

/*******************************************************************************
* Función: checarEventos
* Creado por: Esteban Ramírez
* Empresa: Cantera Estudio
* Descripción: Esta función agrega un marcador en caso de que la fecha que se le
*		manda tenga algún evento
*
* Recibe:
* 	fecha: la fecha que se desea checar
*	cnt: el numero de celda que corresponde a dicha fecha
*
* Regresa: Nada
*********************************************************************************/

function checarEventos(fecha, cnt){
	var mesFormato = parseInt(fecha.getMonth()) + 1;
	var diaFormato = fecha.getDate();
	if(mesFormato < 10){
		mesFormato = '0' + mesFormato;
	}
	if(diaFormato < 10){
		diaFormato = '0' + diaFormato;
	}
	var formatoFechaInicio = fecha.getFullYear() + '-' + mesFormato + '-' + diaFormato + ' 00:00:00';
	var formatoFechaFin = fecha.getFullYear() + '-' + mesFormato + '-' + diaFormato + ' 23:59:59';
	db.transaction(function(tx){
		console.log(formatoFechaInicio);
		console.log(formatoFechaFin);
		tx.executeSql("SELECT * FROM fechas_calendario WHERE (fechaInicio >= '" + formatoFechaInicio + "' AND fechaInicio <= '" + formatoFechaFin + "') OR (fechaFin >= '" + formatoFechaInicio + "' AND fechaFin <= '" + formatoFechaFin + "') OR (fechaInicio < '" + formatoFechaInicio + "' AND fechaFin > '" + formatoFechaFin + "');", [], function(tx,results){
			console.log(results);
			if(results.rows.length > 0 ){
				$("#calendario-dias .celda-dia[data-celda='" + cnt + "'] .titulo-celda").append('<img src="img/marcador-evento.png" class="marcador-evento">');
			}				
		}, function(err){
			console.log("error select: " + err);
		});
		/*tx.executeSql("SELECT * FROM eventos_calendario WHERE fecha = '" + formatoFecha + "'", [], function(tx,results){			
			if(results.rows.length >0 ){
				$("#calendario-dias .celda-dia[data-celda='" + cnt + "'] .titulo-celda").append('<img src="img/marcador-evento.png" class="marcador-evento">');
			}				
		}, errorBDCalendario);*/
	}, function(err){
		console.log("error general: ");
		console.log(err);
	});

}

/*******************************************************************************
* Función: cargarEvento
* Creado por: Esteban Ramírez
* Empresa: Cantera Estudio
* Descripción: Esta función carga los eventos que existen para cierta fecha 
* 		checando la BD.
*
* Recibe:
* 	e: un objeto cuyo atributo ["data"] contiene la fecha que se desea checar
*
* Regresa: Nada
*
* Referencias:
*	generarEventos
*	errorBDCalendario
*	completadoCalendario
*********************************************************************************/

function cargarEvento(e){
	var fecha = e.data;
	var mesFormato = parseInt(fecha.getMonth()) + 1;
	var diaFormato = fecha.getDate();
	if(mesFormato < 10){
		mesFormato = '0' + mesFormato;
	}
	if(diaFormato < 10){
		diaFormato = '0' + diaFormato;
	}
	var formatoFechaInicio = fecha.getFullYear() + '-' + mesFormato + '-' + diaFormato + ' 00:00:00';
	var formatoFechaFin = fecha.getFullYear() + '-' + mesFormato + '-' + diaFormato + ' 23:59:59';
	$("#input-dia-escondido").val(fecha.getDate());
	$("#input-mes-escondido").val(fecha.getMonth());
	$("#input-anio-escondido").val(fecha.getFullYear());
	db.transaction(function(tx){
		var sql = "SELECT * FROM eventos_calendario LEFT JOIN fechas_calendario USING(idEvento) WHERE (fechaInicio >= '" + formatoFechaInicio + "' AND fechaInicio <= '" + formatoFechaFin + "') OR (fechaFin >= '" + formatoFechaInicio + "' AND fechaFin <= '" + formatoFechaFin + "') OR (fechaInicio < '" + formatoFechaInicio + "' AND fechaFin > '" + formatoFechaFin + "') ORDER BY fechaInicio;"; 
		console.log('cargando...');
		console.log(sql);
		tx.executeSql(sql, [], function(tx, results){
			generarEventos(tx, results, fecha)}, errorBDCalendario);
	}, errorBDCalendario, completadoCalendario);
}

/*******************************************************************************
* Función: generarEventos
* Creado por: Esteban Ramírez
* Empresa: Cantera Estudio
* Descripción: Esta función carga los datos leídos de la BD creando las cajas
* 		y la barra de fechas.
*
* Recibe:
* 	tx: la transacción de la BD.
*	results: los resultados de la lectura de la BD
*	fecha: la fecha en la cual se leerán los eventos
*
* Regresa: Nada
*
* Referencias:
*	calculoFechasMooona	
*********************************************************************************/

function generarEventos(tx, results, fecha){
	console.log('CARGADO');
	var arrS = ["D","L","M","M","J","V","S"];
	var arrSC = ["DOMINGO","LUNES","MARTES","MIÉRCOLES","JUEVES","VIERNES","SABADO"];
	var arrSCN = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sabado"];
	var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
	var mesesC = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
	console.log(results);

	$("#eventos-actuales").html("");
	$(".mensaje-eventos").hide();
	$("#abreviacion-semana h2").html(arrS[fecha.getDay()]);
	$("#barra-dia h2").html(fecha.getDate());
	$("#barra-meses-evento .dia").html(fecha.getDate());
	$("#barra-meses-evento .mes").html(mesesC[fecha.getMonth()]);
	$("#barra-meses-evento .semana").html(arrSC[fecha.getDay()]);
	$("#barra-meses-evento .anio").html(fecha.getFullYear());
	$("#input-dia-escondido").val(fecha.getDate());
	$("#input-mes-escondido").val(fecha.getMonth());
	$("#input-anio-escondido").val(fecha.getFullYear());
	if(results.rows.length == 0){
		$(".mensaje-eventos").show();
	}else{
		var html = '';
		$.each(results.rows, function(key, result){
			html += '<div class="evento evento-cerrado" data-id="' + result.idEvento + '" id="evento-' + result.idEvento + '"><img src="img/diosa-' + calculoFechasMooona(fecha).etapa + '.png" class="icono-evento"/><h1>' + result.titulo + '</h1>';
			if(result.descripcion !== ''){
				html += '<h2>' + result.descripcion + '</h2>';
			} 
			//var arrFecha = result.fecha.split('-');
			//var mesEvento = parseInt(arrFecha[1]) - 1;
			//var fechaEvento = new Date(arrFecha[0], mesEvento, arrFecha[2]);
			var fechaInicio = new Date(result.fechaInicio);
			var fechaFinal = new Date(result.fechaFin);
			var arrC = result.fechaInicio.split(" ");
			var arrFechaC = arrC[0].split("-");
			var fechaInicioJS = new Date(arrFechaC[0], arrFechaC[1] - 1, arrFechaC[2]);
			console.log(fechaInicioJS);
			var arrT = result.fechaFin.split(" ");
			var arrFechaT = arrT[0].split("-");
			var fechaFinJS = new Date(arrFechaT[0], arrFechaT[1] - 1, arrFechaT[2]);
			var arrCHora = arrC[1].split(":");
			var arrTHora = arrT[1].split(":");
			if(fechaInicio.getFullYear() == fechaFinal.getFullYear() && fechaInicio.getMonth() == fechaFinal.getMonth() && fechaInicio.getDate() == fechaFinal.getDate() && fechaInicio.getHours() == '00' && fechaInicio.getMinutes() == '00' && fechaInicio.getSeconds() == '00' && fechaFinal.getHours() == '23' && fechaFinal.getMinutes() == '59' && fechaFinal.getSeconds() == '59'){

				html += '<p>Todo el día</p>';

			}else{

				html += '<p>Empieza: ' + arrSCN[fechaInicioJS.getDay()] + ', ' + fechaInicioJS.getDate() + ' de ' + meses[fechaInicioJS.getMonth()] + ' del ' + fechaInicioJS.getFullYear() + ' a las ' + arrCHora[0] + ':' + arrCHora[1] + '<br/>Termina: ' + arrSCN[fechaFinJS.getDay()] + ', ' + fechaFinJS.getDate() + ' de ' + meses[fechaFinJS.getMonth()] + ' del ' + fechaFinJS.getFullYear() + ' a las ' + arrTHora[0] + ':' + arrTHora[1] + '</p>';
			}
				//'De ' + arrCHora[0] + ':' + arrCHora[1] + ' a ' + arrTHora[0] + ':' + arrTHora[1] + ' Hrs</p>';
			html += '<h3 class="boton-editar">Editar</h3>'	+ '<img src="img/basurero.png" class="boton-eliminar"/><input type="hidden" class="info-fecha-inicio" value="' + result.fechaInicio + '"><input type="hidden" class="info-fecha-final" value="' + result.fechaFin + '"><input type="hidden" class="repeticion-evento" value="' + result.repeticion + '" /></div><!--/evento-->';

		});

		$("#eventos-actuales").html(html);

		$(".evento .boton-editar").on("tap", editarEvento);
		$(".evento .boton-eliminar").on("tap", eliminarEvento);
		
	}

}

/*******************************************************************************
* Función: errorBDCalendario
* Creado por: Esteban Ramírez
* Empresa: Cantera Estudio
* Descripción: Esta función despliega el error al ejecutar una transacción de BD
*
* Recibe:
* 	tx: la transacción de la BD.
*	err: un objeto que contiene el error 
*
* Regresa: Nada
*********************************************************************************/

function errorBDCalendario(tx, err){
	alert("ERROR DE BD: ", err.code);
}

/*******************************************************************************
* Función: completadoCalendario
* Creado por: Esteban Ramírez
* Empresa: Cantera Estudio
* Descripción: Esta función se ejecuta cuando se termina la transacción de la BD
*
* Recibe:
*	nada
*
* Regresa: Nada
*
* Referencia: 
* 	activarBotonBack
*********************************************************************************/

function completadoCalendario(){
	activarBotonBack("pagina-evento", true);
	$("#pagina-evento").show();
	//alert("SUCCESS"); 
}

/*******************************************************************************
* Función: cargarDatosEventoNuevo
* Creado por: Esteban Ramírez
* Empresa: Cantera Estudio
* Descripción: Esta función carga los datos iniciales para los campos de 
*		la página de agregar evento nuevo o de editar evento
*
* Recibe:
*	fechaInicial: fecha con hora en la que inicia el evento
*	fechaFinal: fecha con hora en la que termina el evento
*
* Regresa: Nada
*
* Referencia: 
* 	cargarDiasMes
*********************************************************************************/

function cargarDatosEventoNuevo(fechaInicio, fechaFinal){
	var htmlMesComenzar = '';
	var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
	cargarDiasMes(fechaInicio, 'select-dia-evento-c');
	cargarDiasMes(fechaFinal, 'select-dia-evento-t');
	cargarDiasMes(fechaInicio, 'select-dia-evento-total');
	$.each(meses, function(key,val){
		if(key == fechaInicio.getMonth()){
			htmlMesComenzar += '<option selected value="' + key + '">' + val + '</option>';
		}else{
			htmlMesComenzar += '<option value="' + key + '">' + val + '</option>';
		}		
	});
	$("#pagina-evento-nuevo h1").html("NUEVO EVENTO");
	$("#data-evento-existe").val("0");
	$("#select-mes-evento-c").html(htmlMesComenzar);
	$("#select-mes-evento-t").html(htmlMesComenzar);
	$("#select-mes-evento-total").html(htmlMesComenzar);

	$("#titulo-evento-nuevo, #descripcion-evento-nuevo").val('');
	$("#dias-repetir").hide();
	$("#repetir-evento img").show();


	$("#select-mes-evento-c").on('change', function(){
		var mes = $(this).find('option:selected').val();
		cargarDiasMes(mes,'select-dia-evento-c');
	});
	$("#select-mes-evento-t").on('change', function(){
		var mes = $(this).find('option:selected').val();
		cargarDiasMes(mes,'select-dia-evento-t');
	});
	$("#select-mes-evento-total").on('change', function(){
		var mes = $(this).find('option:selected').val();
		cargarDiasMes(mes,'select-dia-evento-total');
	});

	var htmlHoraC = '';
	var htmlHoraT = '';
	for(var ii = 0; ii<24; ii ++){	
		if(ii < 10){
			if(ii == fechaInicio.getHours()){
				htmlHoraC += '<option selected value="' + ii + '">0' + ii + '</option>';
			}else{
				htmlHoraC += '<option value="' + ii + '">0' + ii + '</option>';
			}
		}
		else{
			if(ii == fechaInicio.getHours()){
				htmlHoraC += '<option selected value="' + ii + '">' + ii + '</option>';
			}else{
				htmlHoraC += '<option value="' + ii + '">' + ii + '</option>';
			}

		}
	}	
	for(var ii = 0; ii<24; ii ++){
		if(ii < 10){
			if(ii == fechaFinal.getHours()){
				htmlHoraT += '<option selected value="' + ii + '">0' + ii + '</option>';
			}else{
				htmlHoraT += '<option value="' + ii + '">0' + ii + '</option>';
			}
		}else{
			if(ii == fechaFinal.getHours()){
				htmlHoraT += '<option selected value="' + ii + '">' + ii + '</option>';
			}else{
				htmlHoraT += '<option value="' + ii + '">' + ii + '</option>';
			}
		}
	}

	$("#select-hr-evento-c").html(htmlHoraC);
	$("#select-hr-evento-t").html(htmlHoraT);

	var htmlMin = '';
	for(var ii = 0; ii<60; ii++){
		if(ii < 10){
			if(ii < fechaFinal.getMinutes()){
				htmlHoraT += '<option selected value="' + ii + '">0' + ii + '</option>';
			}else{
				htmlMin += '<option value="' + ii + '">0' + ii + '</option>';	
			}
		}else{
			if(ii < fechaFinal.getMinutes()){
				htmlHoraT += '<option selected value="' + ii + '">0' + ii + '</option>';
			}else{
				htmlMin += '<option value="' + ii + '">' + ii + '</option>';
			}
		}
	}

	$("#select-min-evento-c").html(htmlMin);
	$("#select-min-evento-t").html(htmlMin);

}

function cargarDiasMes(fecha, idSelect){
	var htmlDia = '';
	var semana = ["D","L","M","M","J","V","S"];
	var fechaTemp = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
	while(fechaTemp.getMonth() == fecha.getMonth()){
		if(fecha.getMonth() == fechaTemp.getMonth() && fecha.getDate() == fechaTemp.getDate()){
			htmlDia += '<option selected value="' + fechaTemp.getDate() + '">'  + semana[fechaTemp.getDay()] + ' ' + fechaTemp.getDate() + '</option>';
		}else{
			htmlDia += '<option value="' + fechaTemp.getDate() + '">'  + semana[fechaTemp.getDay()] + ' ' + fechaTemp.getDate() + '</option>';
		}	
		fechaTemp = new Date(fechaTemp.getFullYear(), fechaTemp.getMonth(), fechaTemp.getDate() + 1);
	}
	$('#' + idSelect).html(htmlDia);
}

function cambiarTodoElDia(act){
	if(act){
		$(".horarios-evento").hide();
		$(".horarios-evento select").each(function(){
			$(this).attr("data-active", 'false');
		});
		$(".dia-evento").show();
		$(".dia-evento select").each(function(){
			$(this).attr("data-active", 'true');
		});	
	}else{
		$(".horarios-evento").show();
		$(".horarios-evento select").each(function(){
			$(this).attr("data-active", 'true');
		});
		$(".dia-evento").hide();
		$(".dia-evento select").each(function(){
			$(this).attr("data-active", 'false');
		});
	}
	
}

function validarEventoNuevo(){
	var pagina = $("#pagina-evento-nuevo");
	var titulo = pagina.find("#titulo-evento-nuevo").val();
	var descripcion = pagina.find("#descripcion-evento-nuevo").val();
	var anio = $("#input-anio-escondido").val();
	var horarioC = '';
	var horarioT = '';
	var fecha = '';
	var fechaFormatoJSInicial;
	var fechaFormatoJSFinal;
	if(titulo == ''){
		titulo = '(Sin título)';
	}
	if($("#radio-todo-dia").is(":checked")){
		var mes = parseInt($(".dia-evento #select-mes-evento-total option:selected").val()) + 1;
		var dia = $(".dia-evento #select-dia-evento-total option:selected").val();
		var horaC = '00';
		var minC = '00';
		var secC = '00';
		var horaT = 23;
		var minT = 59;
		var secT = 59;
		fechaFormatoJSInicial = new Date(anio, $(".dia-evento #select-mes-evento-total option:selected").val(), dia, horaC, minC, secC, '00');
		fechaFormatoJSFinal = new Date(anio, $(".dia-evento #select-mes-evento-total option:selected").val(), dia, horaT, minT, secT, '59');
		horarioC += anio + '-' + mes + '-' + dia + ' ' + horaC + ':' + minC + ':' + secC;
		horarioT += anio + '-' + mes + '-' + dia + ' ' + horaT + ':' + minT + ':' + secT;
		fecha = anio + '-' + mes + '-' + dia;
	}else{
		var mesC = parseInt($(".horarios-evento #select-mes-evento-c option:selected").val()) + 1;
		var diaC = $(".horarios-evento #select-dia-evento-c option:selected").val();
		var mesT = parseInt($(".horarios-evento #select-mes-evento-t option:selected").val()) + 1;
		var diaT = $(".horarios-evento #select-dia-evento-t option:selected").val();
		var horaC =($(".horarios-evento #select-hr-evento-c option:selected").val().length == 1) ? '0' + $(".horarios-evento #select-hr-evento-c option:selected").val() : $(".horarios-evento #select-hr-evento-c option:selected").val();
		var minC = ($(".horarios-evento #select-min-evento-c option:selected").val().length == 1) ? '0' + $(".horarios-evento #select-min-evento-c option:selected").val() : $(".horarios-evento #select-min-evento-c option:selected").val();
		var secC = '00';
		var horaT =($(".horarios-evento #select-hr-evento-t option:selected").val().length == 1) ? '0' + $(".horarios-evento #select-hr-evento-t option:selected").val() : $(".horarios-evento #select-hr-evento-t option:selected").val();
		var minT = ($(".horarios-evento #select-min-evento-t option:selected").val().length == 1) ? '0' + $(".horarios-evento #select-min-evento-t option:selected").val() : $(".horarios-evento #select-min-evento-t option:selected").val();
		var secT = 59;
		fechaFormatoJSInicial = new Date(anio, $(".horarios-evento #select-mes-evento-c option:selected").val(), diaC, horaC, minC, secC, '00');
		fechaFormatoJSFinal = new Date(anio, $(".horarios-evento #select-mes-evento-t option:selected").val(), diaT, horaT, minT, secT, '59');
		horarioC += anio + '-' + mesC + '-' + diaC + ' ' + horaC + ':' + minC + ':' + secC;
		horarioT += anio + '-' + mesT + '-' + diaT + ' ' + horaT + ':' + minT + ':' + secT;
		fecha = anio + '-' + mesC + '-' + diaC;
	}

	if(fechaFormatoJSInicial > fechaFormatoJSFinal){
		navigator.notification.alert("Por favor elige una fecha final mayor a la fecha inicial del evento", null, "No se ha guardado", "Cerrar");
		alert("Por favor elige una fecha final mayor a la fecha inicial del evento", null, "No se ha guardado");
		return;
	}
	
	var repetir = $("#dias-repetir select option:selected").val();
	var existe = $("#data-evento-existe").val();
	var datos = {fecha: fecha, titulo: titulo, descripcion: descripcion, horarioC: horarioC, horarioT: horarioT, repetir: repetir};
	if(existe == 1){
		datos['ID'] = $("#id-evento-existe").val();
		console.log(datos);
		db.transaction(function(tx){
			editarBDEvento(tx, datos);
		}, errorGuardarBD, function(){terminaGuardarBD(fecha)});
	}else{
		db.transaction(function(tx){
			guardarBDEvento(tx, datos);
		}, errorGuardarBD, function(){terminaGuardarBD(fecha)});
	}	
}

function guardarBDEvento(tx, datos){
	var sql = 'INSERT INTO eventos_calendario (titulo, descripcion, repeticion) VALUES ("' + datos.titulo + '", "' + datos.descripcion + '", "' + datos.repetir + '")';
	tx.executeSql(sql, [], function(tx, res){ 
							guardarFechaEvento(tx, datos, res.insertId, queryRespaldo);
							var datosBase = [];
							datosBase.push({"titulo": datos.titulo, "descripcion": datos.descripcion, "repeticion": datos.repetir, "idEvento": res.insertId});
							queryRespaldo("insert", "eventos_calendario", datosBase);
								console.log(res);
						}, function(tx, err){ 
								console.log(err); 
								console.log(sql);
						});

}

function sumaFechasBD(fechaBD, valor, intervalo){
	var fechaHora = fechaBD.split(' ');
	var fechaArr = fechaHora[0].split('-');
	var fechaJS = new Date(fechaArr[0], parseInt(fechaArr[1]) - 1, fechaArr[2]);
	switch (intervalo){
		case "dia":
			fechaJS.setDate(fechaJS.getDate() + valor);
			break;
		case "semana":
			fechaJS.setDate(fechaJS.getDate() + valor*7);
			break;
		case "mes":
			fechaJS.setMonth(fechaJS.getMonth() + valor);
			break;
	}
	var mesFormato = fechaJS.getMonth() + 1;
	var diaFormato = fechaJS.getDate();
	if(mesFormato < 10){
		mesFormato = '0' + mesFormato;
	}

	if(diaFormato < 10){
		diaFormato = '0' + diaFormato;
	}

	var nuevaFecha = fechaJS.getFullYear() + '-' + mesFormato + '-' + diaFormato + ' ' + fechaHora[1];
	return nuevaFecha;
}

function guardarFechaEvento(tx, datos, idEvento, callback){
	console.log(datos);
	var datosBase = [];
	var jj = 0;
	switch (datos.repetir){
		case "0":
			
			for(var ii = 0; ii <= 100; ii++){
				var fechaAGuardarI = sumaFechasBD(datos.horarioC, ii, 'dia');
				var fechaAGuardarF = sumaFechasBD(datos.horarioT, ii, 'dia');
				var sql ="INSERT INTO fechas_calendario (fechaInicio, fechaFin, idEvento) VALUES('"+ fechaAGuardarI +"', '" + fechaAGuardarF + "', '" + idEvento + "');";
				tx.executeSql(sql, [], function(tx, res){
					jj++;
					if(jj == 100){
						tx.executeSql("SELECT * FROM fechas_calendario WHERE idEvento = " + idEvento, [], function(tx, res){
							$.each(res.rows, function(key, val){
								datosBase.push(val);
							});
							callback("insert", "fechas_calendario", datosBase);
						}, function(tx, err){
							console.log("Hubo un error 471");
						});
					}
				}, function(tx, err){
					alert("Hubo un error: 441");
				});
			}
			break;
		case "1":

			for(var ii = 0; ii <= 50; ii++){
				var fechaAGuardarI = sumaFechasBD(datos.horarioC, ii, 'semana');
				var fechaAGuardarF = sumaFechasBD(datos.horarioT, ii, 'semana');
				var sql ="INSERT INTO fechas_calendario (fechaInicio, fechaFin, idEvento) VALUES('"+ fechaAGuardarI +"', '" + fechaAGuardarF + "', '" + idEvento + "');";
				tx.executeSql(sql, [], function(tx, res){
					jj++;
					if(jj == 50){
						tx.executeSql("SELECT * FROM fechas_calendario WHERE idEvento = " + idEvento, [], function(tx, res){
							$.each(res.rows, function(key, val){
								datosBase.push(val);
							});
							callback("insert", "fechas_calendario", datosBase);
						}, function(tx, err){
							console.log("Hubo un error 471");
						});
					}
				}, function(tx, err){
					alert("Hubo un error: 452");
				});
			}
			break;
		case "3":
			for(var ii = 0; ii <= 20; ii++){
				var fechaAGuardarI = sumaFechasBD(datos.horarioC, ii, 'mes');
				var fechaAGuardarF = sumaFechasBD(datos.horarioT, ii, 'mes');
				var sql ="INSERT INTO fechas_calendario (fechaInicio, fechaFin, idEvento) VALUES('"+ fechaAGuardarI +"', '" + fechaAGuardarF + "', '" + idEvento + "');";
				tx.executeSql(sql, [], function(tx, res){
					
					jj++;
					if(jj == 20){
						tx.executeSql("SELECT * FROM fechas_calendario WHERE idEvento = " + idEvento, [], function(tx, res){
							$.each(res.rows, function(key, val){
								datosBase.push(val);
							});
							callback("insert", "fechas_calendario", datosBase);
						}, function(tx, err){
							console.log("Hubo un error 471");
						});
					}
				}, function(tx, err){
					alert("Hubo un error: 464");
				});
			}
			break;
		default:
			var fechaAGuardarI = sumaFechasBD(datos.horarioC, 0, '');
			var fechaAGuardarF = sumaFechasBD(datos.horarioT, 0, '');
			tx.executeSql("INSERT INTO fechas_calendario (fechaInicio, fechaFin, idEvento) VALUES('"+ fechaAGuardarI +"', '" + fechaAGuardarF + "', '" + idEvento + "');", [], function(tx, res){
				
				datosBase.push({"fechaInicio": fechaAGuardarI, "fechaFin": fechaAGuardarF, "idEvento": idEvento, "idFecha": res.insertId});
				callback("insert", "fechas_calendario", datosBase);

			}, function(tx, err){
				alert("Hubo un error: 475");
			});
			break;

	}
}

function errorGuardarBD(tx, err){
	alert("ERROR: " + err);
}

function terminaGuardarBD(fecha){
	var arrFecha = fecha.split("-");
	var fechaFormJS = new Date(arrFecha[0], parseInt(arrFecha[1]) - 1, arrFecha[2]);
	var obj = {data: fechaFormJS};
	cargarEvento(obj);
	activarBotonBack('pagina-evento', true);
	esconderPaginaShadow('pagina-evento-nuevo');
	//respaldarTablasCalendario();
	//alert("SUCCESS");
}

function editarBDEvento(tx, datos){
	var sql = 'UPDATE eventos_calendario SET titulo = "' + datos.titulo + '", descripcion = "' + datos.descripcion + '", repeticion = "' + datos.repetir + '" WHERE idEvento = "' + datos.ID + '";';
	tx.executeSql(sql, [], function(tx, res){
		var datosBase = [];
			datosBase.push({"titulo": datos.titulo, "descripcion": datos.descripcion, "repeticion": datos.repetir, "idEvento": datos.ID});
			datosBase.push({"idEvento": datos.ID });
			queryRespaldo("update", "eventos_calendario", datosBase);
	}, function(tx, err){
		console.log(err);
	});
	console.log(datos);
	tx.executeSql("DELETE FROM fechas_calendario WHERE idEvento = '" + datos.ID + "';", [], function(tx, res){
		console.log(res);
		datosBase = {"idEvento": datos.ID};
		
		guardarFechaEvento(tx, datos, datos.ID, function(accion, tabla, datosB){
			queryRespaldo("delete", "fechas_calendario", datosBase, function(){
				queryRespaldo(accion, tabla, datosB);
			});
		});
	}, function(tx, err){
		console.log(err);
	});
	
}

function editarEvento(){
	//alert("EDITAR");
	var evento = $(this).closest(".evento");

	var fechaInicio = new Date(evento.find(".info-fecha-inicio").val());
	var fechaFinal = new Date(evento.find(".info-fecha-final").val());
	console.log($(this));
	cargarDatosEventoNuevo(fechaInicio, fechaFinal);

	$("#boton-agregar-evento").trigger("click");
	$("#titulo-evento-nuevo").val(evento.find("h1").text());
	$("#descripcion-evento-nuevo").val(evento.find("h2").text());
	/*var fechaC = evento.find(".info-fecha-inicio").val();
	var arr1FechaC = fechaC.split(" ");
	var arrFFechaC = arr1FechaC[0].split("-");
	var arrHFechaC = arr1FechaC[1].split(":");
	var mesC = parseInt(arrFFechaC[1]) - 1;
	var fechaT = evento.find(".info-fecha-final").val();
	var arr1FechaT = fechaT.split(" ");
	var arrFFechaT = arr1FechaT[0].split("-");
	var arrHFechaT = arr1FechaT[1].split(":");
	var mesT = parseInt(arrFFechaT[1]) - 1;*/
	if(evento.find(".repeticion-evento").val() !== '-1'){
		$("#dias-repetir select").val(evento.find(".repeticion-evento").val());
		$("#dias-repetir").show();
		$("#repetir-evento img").hide();
	}else{
		$("#dias-repetir select").val('-1');
		$("#dias-repetir").hide();
		$("#repetir-evento img").show();	
	}
	$("#pagina-evento-nuevo h1").html("EDITAR EVENTO");
	$("#data-evento-existe").val("1");
	if(fechaInicio.getFullYear() == fechaFinal.getFullYear() && fechaInicio.getMonth() == fechaFinal.getMonth() && fechaInicio.getDate() == fechaFinal.getDate() && fechaInicio.getHours() == '00' && fechaInicio.getMinutes() == '00' && fechaInicio.getSeconds() == '00' && fechaFinal.getHours() == '23' && fechaFinal.getMinutes() == '59' && fechaFinal.getSeconds() == '59'){

		$("#radio-todo-dia").prop('checked', true);
		$(".horarios-evento").hide();
		$(".dia-evento").show();

	}else{
		$("#radio-todo-dia").prop('checked', false);
		$(".horarios-evento").show();
		$(".dia-evento").hide();
	}
	$("#id-evento-existe").val(evento.attr("data-id"));
	desplegarPaginaShadow('pagina-evento-nuevo');

}

function eliminarEvento(){
	var id = $(this).closest(".evento").attr("data-id");
	navigator.notification.confirm(
		'¿Esta seguro que desea eliminar este evento?',
		function(btn){
			confirmaEliminarEvento(btn, id)
		}
		,
		'Eliminar Evento',
		['Si', 'No']
	);  // <----------- ACTIVAR PARA MOVIL
	//confirmaEliminarEvento(1, id);
	//alert("ELIMINAR");
	//console.log(this);
}

function confirmaEliminarEvento(boton, id){
	if(boton == 1){
		var mesF = parseInt($("#input-mes-escondido").val()) + 1;
		var fecha = $("#input-anio-escondido").val() + '-' + mesF + '-' + $("#input-dia-escondido").val();
		var fechaJS = new Date($("#input-anio-escondido").val(), $("#input-mes-escondido").val(), $("#input-dia-escondido").val());
		db.transaction(function(tx){
			eliminarBDEvento(tx, id);
		}, errorGuardarBD, function(){
			terminaGuardarBD(fecha);
			cargarCalendario(fechaJS);
		});
	}
}

function eliminarBDEvento(tx, id){
	var sql = 'DELETE FROM eventos_calendario WHERE idEvento="' + id + '"';
	tx.executeSql(sql, [], function(tx, res){
		var datosBase = [];
		datosBase = {"idEvento": id};
		queryRespaldo("delete", "eventos_calendario", datosBase);
	}, function(tx, err){
		console.log(err);
	});
	var sql = 'DELETE FROM fechas_calendario WHERE idEvento="' + id + '"';
	tx.executeSql(sql, [], function(tx, res){
		var datosBase = [];
		datosBase = {"idEvento": id};
		queryRespaldo("delete", "fechas_calendario", datosBase);
	}, function(tx, err){
		console.log(err);
	});
}

/*******************************************************************************
* Función: queryRespaldo
* Creado por: Esteban Ramírez
* Empresa: Cantera Estudio
* Descripción: Esta función respalda los datos de la BD de la aplicación en la
*		BD del servidor
*
* Recibe:
* 	accion: la accion a ejecutar en la BD ("select", "update" o "delete")
* 	tabla: tabla en la BD
* 	datos: datos a insertar. Para casos de insert, arreglo de todos los datos a
* 		insertar. Para "update", arreglo, [0] => arreglo de datos a actualizar, 
* 		[1] => condiciones a considerar. Para "delete", arreglo de condiciones.
*
* Regresa:
*	callback: al terminar el ajax exitosamente o con error.
*********************************************************************************/

function queryRespaldo(accion, tabla, datos, callback){
	var mail = localStorage.getItem('email_usr');
	console.log(datos);
	var obj = {"correo": mail, "accion": accion, "tabla": tabla, "datos": datos};
	var objString = JSON.stringify(obj);
	$.ajax({
		method: "POST",
		url: 'http://canteraestudio.com/mooona/respaldar-eventos/',
		contentType: "application/json; charset=utf-8",
		//dataType: "JSON",
		data: objString,
		success: function(res){
			console.log(res);
			callback();
		},
		error: function(jqXHR, textStatus, errorThrown){
			alert("Request Error: " + textStatus + ": " + errorThrown);
			console.log(objString);
			var queueActual = localStorage.getItem("queueRespaldo");
			if(queueActual == '' || queueActual == null){
				localStorage.setItem("queueRespaldo", objString);
			}else{
				localStorage.setItem("queueRespaldo", queueActual + "|" + objString);
			}			
			console.log(jqXHR);
			callback();
		}
	});
}

function resolverRespaldosInicial(){
	var queueActual = localStorage.getItem("queueRespaldo");
	localStorage.setItem("queueRespaldo", '');
	if(queueActual !== null && queueActual !== ''){
	
		var arrQueue = queueActual.split("|");
		console.log(arrQueue);
		$.each(arrQueue, function(key, val){
			
			$.ajax({
				method: "POST",
				url: 'http://canteraestudio.com/mooona/respaldar-eventos/',
				contentType: "application/json; charset=utf-8",
				//dataType: "JSON",
				data: val,
				success: function(res){
					console.log(res);
				},
				error: function(jqXHR, textStatus, errorThrown){
					alert("Request Error: " + textStatus + ": " + errorThrown);
					console.log(val);
					var queueActual2 = localStorage.getItem("queueRespaldo");
					if(queueActual2 == '' || queueActual2 == null){
						localStorage.setItem("queueRespaldo", val);
					}else{
						localStorage.setItem("queueRespaldo", queueActual2 + "|" + val);
					}			
					console.log(jqXHR);
					callback();		}
			});
		});
	}
}

function inicializarBases(){
	var BDActual = localStorage.getItem("baseInicializada");
	//localStorage.setItem("baseInicializada", '');
	if( BDActual == null || BDActual == ''){
		var mail = localStorage.getItem('email_usr');

		db.transaction(function(tx){
			//tx.executeSql("DROP TABLE eventos_calendario");
			//tx.executeSql("DROP TABLE fechas_calendario");
			//tx.executeSql("DROP TABLE sentimientos");
			tx.executeSql("CREATE TABLE IF NOT EXISTS eventos_calendario ( "+
						"idEvento INTEGER PRIMARY KEY AUTOINCREMENT, " +
						"titulo VARCHAR(200), " +
						"descripcion VARCHAR(500)," + 
						"repeticion INTEGER);");
			tx.executeSql("CREATE TABLE IF NOT EXISTS fechas_calendario ( "+
						"idFecha INTEGER PRIMARY KEY AUTOINCREMENT, " +
						"fechaInicio DATETIME, " +
						"fechaFin DATETIME, " +
						"idEvento INTEGER);");
			tx.executeSql("CREATE TABLE IF NOT EXISTS sentimientos ( "+
					"idSiento INTEGER PRIMARY KEY AUTOINCREMENT, " +
					"fecha DATE NOT NULL, " +
					"atributo VARCHAR(50), " +
					"comentarios VARCHAR(2000), " +
					"magnitud INTEGER);");
		}, function(error){
			console.log("ERROR");
		}, function(){
			console.log("TERMINADO");
		});

			$.ajax({
				method: "POST",
				url: 'http://canteraestudio.com/mooona/leer-datos-base',
				data: {mail: mail},
				success: function(res){
					console.log(res);
					var obj = $.parseJSON(res);
					db.transaction(function(tx){
						$.each(obj.eventos_calendario, function(key, evento){
							var sql = "INSERT INTO eventos_calendario VALUES(" + evento.idEvento + ", '" + evento.titulo + "', '" + evento.descripcion + "', '" + evento.repeticion + "');";
							console.log(sql);
							tx.executeSql(sql, [], function(tx, res){console.log("Bien");}, function(tx, err){console.log(err.message);} );
						});
						$.each(obj.fechas_calendario, function(key, evento){
							var sql = "INSERT INTO fechas_calendario VALUES(" + evento.idFecha + ", '" + evento.fechaInicio + "', '" + evento.fechaFin + "', '" + evento.idEvento + "');";
							console.log(sql);
							tx.executeSql(sql, [], function(tx, res){console.log("Bien");}, function(tx, err){console.log(err.message);} );
						});
						$.each(obj.sentimientos, function(key, evento){
							var sql = "INSERT INTO sentimientos VALUES(" + evento.idSiento + ", '" + evento.fecha + "', '" + evento.atributo + "', '" + evento.comentarios + "', '" + evento.magnitud + "');";
							console.log(sql);
							tx.executeSql(sql, [], function(tx, res){console.log("Bien");}, function(tx, err){console.log(err.message);} );
						});
					}, function(error){
						alert ("ocurrió un error");
					}, function(){
						localStorage.setItem("baseInicializada", '1');
					});
					//console.log(obj.eventos_calendario.idCliente);
				},
				error: function(){
					localStorage.setItem("baseInicializada", '');
				}
			});
	}
}
