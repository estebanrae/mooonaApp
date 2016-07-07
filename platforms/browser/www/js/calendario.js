/************************* CALENDARIO ****************************/


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
	//$("#calendario-dias .semana-1 .celda-dia[data-diasem='" + semanaUno + "']").on("click", fechaDiaUno, cargarEvento);
	$("#pagina-calendario .barra-mes .mes").html(mesesC[date.getMonth()]);
	$("#pagina-calendario .barra-mes .anio").html(date.getFullYear());
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
		$(this).off("click");
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

			$("#calendario-dias .celda-dia[data-celda='" + ii + "']").on("click", fechaCal, cargarEvento);
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

function checarEventos(fecha, cnt){
	var mesFormato = parseInt(fecha.getMonth()) + 1;
	var formatoFecha = fecha.getFullYear() + '-' + mesFormato + '-' + fecha.getDate();
	db.transaction(function(tx){
		tx.executeSql("SELECT * FROM eventos_calendario WHERE fecha = '" + formatoFecha + "'", [], function(tx,results){			
			if(results.rows.length >0 ){
				$("#calendario-dias .celda-dia[data-celda='" + cnt + "'] .titulo-celda").append('<img src="img/marcador-evento.png" class="marcador-evento">');
			}				
		}, errorBDCalendario);
	}, errorBDCalendario, function(){});

}

function inicializarBD(){
	db = window.openDatabase("MooonaBD", "1.0", "Base Mooona", 200000);
}

function cargarEvento(e){
	var fecha = e.data;
	var mesFormato = parseInt(fecha.getMonth()) + 1;
	var formatoFecha = fecha.getFullYear() + '-' + mesFormato + '-' + fecha.getDate(); 
	$("#input-dia-escondido").val(fecha.getDate());
	$("#input-mes-escondido").val(fecha.getMonth());
	$("#input-anio-escondido").val(fecha.getFullYear());
	db.transaction(function(tx){
		cargarBDEventos(tx, formatoFecha, fecha);
	}, errorBDCalendario, completadoCalendario);
}

function cargarBDEventos(tx, formatoFecha, fecha){
	var sql = "select * " + 
				"from eventos_calendario  " +
				"where fecha ='" + formatoFecha + "'";
	console.log('cargando...');
	tx.executeSql(sql, [], function(tx, results){
		generarEventos(tx, results, fecha)}, errorBDCalendario);
}

function generarEventos(tx, results, fecha){
	console.log('CARGADO');
	var arrS = ["D","L","M","M","J","V","S"];
	var arrSC = ["DOMINGO","LUNES","MARTES","MIÉRCOLES","JUEVES","VIERNES","SABADO"];
	var arrSCN = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sabado"];
	var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
	var mesesC = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];

	$("#eventos-actuales").html("");
	$(".mensaje-eventos").hide();
	$("#abreviacion-semana h2").html(arrS[fecha.getDay()]);
	$("#barra-dia h2").html(fecha.getDate());
	$("#barra-meses-evento .dia").html(fecha.getDate());
	$("#barra-meses-evento .mes").html(mesesC[fecha.getMonth()]);
	$("#barra-meses-evento .semana").html(arrSC[fecha.getDay()]);
	$("#input-dia-escondido").val(fecha.getDate());
	$("#input-mes-escondido").val(fecha.getMonth());
	$("#input-anio-escondido").val(fecha.getFullYear());
	if(results.rows.length == 0){
		$(".mensaje-eventos").show();
	}else{
		var html = '';
		$.each(results.rows, function(key, result){
			html += '<div class="evento evento-cerrado" data-id="' + result.id + '" id="evento-' + result.id + '"><h1>' + result.titulo + '</h1>';
			if(result.descripcion !== ''){
				html += '<h2>' + result.descripcion + '</h2>';
			} 
			var arrFecha = result.fecha.split('-');
			var mesEvento = parseInt(arrFecha[1]) - 1;
			var fechaEvento = new Date(arrFecha[0], mesEvento, arrFecha[2]);
			var arrC = result.empieza.split(" ");
			var arrCHora = arrC[1].split(":");
			var arrT = result.termina.split(" ");
			var arrTHora = arrT[1].split(":");
			html += '<p>' + arrSCN[fechaEvento.getDay()] + ', ' + fechaEvento.getDate() + ' de ' + meses[mesEvento] + ' de ' + fechaEvento.getFullYear() + '<br/>' + 
				'De ' + arrCHora[0] + ':' + arrCHora[1] + ' a ' + arrTHora[0] + ':' + arrTHora[1] + ' Hrs</p>';
			html += '<h3 class="boton-editar">Editar</h3>'	+ '<img src="img/basurero.png" class="boton-eliminar"/><input type="hidden" class="info-fecha-inicio" value="' + result.empieza + '"><input type="hidden" class="info-fecha-final" value="' + result.termina + '"></div><!--/evento-->';

		});

		$("#eventos-actuales").html(html);

		$(".evento .boton-editar").on("click", editarEvento);
		$(".evento .boton-eliminar").on("click", eliminarEvento);
		
	}

}

function errorBDCalendario(tx, err){
	if(err.code == 5){
		var sql = "CREATE TABLE IF NOT EXISTS eventos_calendario ( "+
					"id INTEGER PRIMARY KEY AUTOINCREMENT, " +
					"fecha DATE, " +
					"titulo VARCHAR(200), " +
					"descripcion VARCHAR(500), " +
					"empieza DATETIME, " +
					"termina DATETIME, " + 
					"repite VARCHAR(100))";
		tx.executeSql(sql, [], errorBDCalendario, completadoCalendario);
	}else{
	}
}

function eliminarTablaCalendario(){
	db.transaction(function(tx){
		tx.executeSql("DROP TABLE eventos_calendario");
	}, function(tx, err){ alert("No se elimino")}, function(){alert("Tabla Eliminada")});
}


function completadoCalendario(){
	activarBotonBack("pagina-evento", true);
	$("#pagina-evento").show();
	//alert("SUCCESS"); 
}

function cargarDatosEventoNuevo(fecha){
	var htmlMesComenzar = '';
	var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
	cargarDiasMes(fecha, 'select-dia-evento-c');
	cargarDiasMes(fecha, 'select-dia-evento-t');
	cargarDiasMes(fecha, 'select-dia-evento-total');
	$.each(meses, function(key,val){
		if(key == fecha.getMonth()){
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
	for(var ii = 0; ii<23; ii ++){	
		if(ii == 9){
			htmlHoraC += '<option selected value="' + ii + '">' + ii + '</option>';
		}else{
			htmlHoraC += '<option value="' + ii + '">' + ii + '</option>';
		}
	}	
	for(var ii = 0; ii<24; ii ++){	
		if(ii == 10){
			htmlHoraT += '<option selected value="' + ii + '">' + ii + '</option>';
		}else{
			htmlHoraT += '<option value="' + ii + '">' + ii + '</option>';
		}
	}

	$("#select-hr-evento-c").html(htmlHoraC);
	$("#select-hr-evento-t").html(htmlHoraT);

	var htmlMin = '';
	for(var ii = 0; ii<60; ii++){
		htmlMin += '<option value="' + ii + '">' + ii + '</option>';
	}

	$("#select-min-evento-c").html(htmlMin);
	$("#select-min-evento-t").html(htmlMin);

}

function cargarDiasMes(fecha, idSelect){
	var hoy = new Date();
	var htmlDia = '';
	var semana = ["D","L","M","M","J","V","S"];
	var fechaTemp = new Date(hoy.getFullYear(), fecha.getMonth(), 1);
	while(fechaTemp.getMonth() == fecha.getMonth()){
		if(hoy.getMonth() == fecha.getMonth() && fecha.getDate() == fechaTemp.getDate()){
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
	var sql = 'INSERT INTO eventos_calendario (fecha, titulo, descripcion, empieza, termina, repite) VALUES ("' + datos.fecha + '", "' + datos.titulo + '", "' + datos.descripcion + '", "' + datos.horarioC + '", "' + datos.horarioT + '", "' + datos.repetir + '")';
	tx.executeSql(sql);
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
	alert("SUCCESS");
}

function editarBDEvento(tx, datos){
	var sql = 'UPDATE eventos_calendario SET fecha = "' + datos.fecha + '", titulo = "' + datos.titulo + '", descripcion = "' + datos.descripcion + '", empieza = "' + datos.horarioC + '", termina = "' + datos.horarioT + '", repite = "' + datos.repetir + '" WHERE id = "' + datos.ID + '"';
	tx.executeSql(sql);
}

function editarEvento(){
	//alert("EDITAR");
	var evento = $(this).closest(".evento");
	$("#boton-agregar-evento").trigger("click");
	$("#titulo-evento-nuevo").val(evento.find("h1").text());
	$("#descripcion-evento-nuevo").val(evento.find("h2").text());
	var fechaC = evento.find(".info-fecha-inicio").val();
	var arr1FechaC = fechaC.split(" ");
	var arrFFechaC = arr1FechaC[0].split("-");
	var arrHFechaC = arr1FechaC[1].split(":");
	var mesC = parseInt(arrFFechaC[1]) - 1;
	var fechaT = evento.find(".info-fecha-final").val();
	var arr1FechaT = fechaT.split(" ");
	var arrFFechaT = arr1FechaT[0].split("-");
	var arrHFechaT = arr1FechaT[1].split(":");
	var mesT = parseInt(arrFFechaT[1]) - 1;
	$("#pagina-evento-nuevo h1").html("EDITAR EVENTO");
	$("#data-evento-existe").val("1");
	if(arrFFechaC == arrFFechaT && arrHFechaC == ['00', '00', '00'] && arrHFechaT == ['23', '59', '59']){
		$("#radio-todo-dia").attr('checked', 'checked');
		$(".horarios-evento").hide();
		$(".dia-evento").show();
		$("#select-dia-evento-total").find("option[value='" + arrFFechaC[2] + "']").attr('selected', 'true');
		$("#select-mes-evento-total").find("option[value='" + mesC + "']").attr('selected', 'true');
	}else{
		$("#radio-todo-dia").removeAttr('checked');
		$(".horarios-evento").show();
		$(".dia-evento").hide();
		$("#select-dia-evento-c").find("option[value='" + arrFFechaC[2] + "']").attr('selected', 'true');
		$("#select-mes-evento-c").find("option[value='" + mesC + "']").attr('selected', 'true');
		$("#select-hr-evento-c").find("option[value='" + arrHFechaC[0] + "']").attr('selected', 'true');
		$("#select-min-evento-c").find("option[value='" + arrHFechaC[1] + "']").attr('selected', 'true');

		$("#select-dia-evento-t").find("option[value='" + arrFFechaT[2] + "']").attr('selected', 'true');
		$("#select-mes-evento-t").find("option[value='" + mesT + "']").attr('selected', 'true');
		$("#select-hr-evento-t").find("option[value='" + arrHFechaT[0] + "']").attr('selected', 'true');
		$("#select-min-evento-t").find("option[value='" + arrHFechaT[1] + "']").attr('selected', 'true');
	}
	$("#id-evento-existe").val(evento.attr("data-id"));

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
	);
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
	var sql = 'DELETE FROM eventos_calendario WHERE id="' + id + '"';
	tx.executeSql(sql);
}