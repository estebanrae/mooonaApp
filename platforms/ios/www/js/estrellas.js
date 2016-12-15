function activarEstrella(magnitud){
	$('.estrella').each(function(){
		if($(this).attr('data-magnitud') <= magnitud){
			$(this).addClass('estrella-activa');
		}else{
			$(this).removeClass('estrella-activa');
		}
	});
	var fecha = new Date($("#fecha-siento-actual").val());
	var attr = $("#attr-siento-actual").val();

	guardarSientoBase(fecha, attr, magnitud);
	leerDatosGrafica(fecha.getMonth(), fecha.getFullYear(), attr);
}

function cargarSientoActual(fecha, attr){
	$("#fecha-siento-actual").val(fecha);
	$("#attr-siento-actual").val(attr);
	consultarSientoBase(fecha, attr);
	leerDatosGrafica(fecha.getMonth(), fecha.getFullYear(), attr);
}

function consultarSientoBase(fecha, attr){
	fechaFormato = fechaJSaDB(fecha);
	db.transaction(function(tx){
		//tx.executeSql("DROP TABLE sentimientos");
		tx.executeSql('SELECT * FROM sentimientos WHERE fecha = "' + fechaFormato + '" AND atributo = "' + attr + '"', [], 
					function(tx, results){
						var magnitudActual = 0;
						var comentarioActual = '';
						if(results.rows.length == 0){
							magnitudActual = 1;
						}else{
							magnitudActual = results.rows.item(0).magnitud;
							comentarioActual = results.rows.item(0).comentarios;
						}
						activarEstrella(magnitudActual);
						cargarComentarioSiento(comentarioActual);
					}, errorCargarSiento);
	}, errorCargarSiento);

}

function guardarSientoBase(fecha, attr, magnitud){
	fechaFormato = fechaJSaDB(fecha);
	db.transaction(function(tx){
			tx.executeSql('SELECT * FROM sentimientos WHERE fecha = "' + fechaFormato + '" AND atributo = "' + attr + '"', [], 
					function(tx, results){
						guardarSiento(tx, results, fechaFormato, attr, magnitud);
					}, errorCargarSiento);
		}
		,errorCargarSiento, successGuardarSiento
	);
}

function guardarSiento(tx, results, fecha, attr, magnitud){
	if(results.rows.length == 0){
		tx.executeSql("INSERT INTO sentimientos (fecha, atributo, magnitud) VALUES('" + fecha + "', '" + attr + "', '" + magnitud + "')", [], function(tx, res){
			var datosBase = [];
			datosBase.push({"fecha": fecha, "atributo": attr, "magnitud": magnitud, "idSiento": res.insertId});
			queryRespaldo("insert", "sentimientos", datosBase);
		}, function(tx, err){});
	}else{
		tx.executeSql("UPDATE sentimientos SET magnitud='" + magnitud + "' WHERE fecha='" + fecha + "' AND atributo = '" + attr + "'", [], function(tx, res){
			var datosBase = [];
			datosBase.push({"magnitud": magnitud});
			datosBase.push({"fecha": fecha, "atributo": attr});
			queryRespaldo("update", "sentimientos", datosBase);
		}, function(tx, err){});	
	}
}

function errorCargarSiento(err){
	alert("ERRORX-" + err.code + ": " + err.message);
}

function successGuardarSiento(){
	console.log("DATABASE REQUEST COMPLETE");
}

function leerDatosGrafica(mes, anio, attr){//Mes del 0 al 11

	$("#barra-fechas-graph .mes").html(MESES[mes]);
	$("#barra-fechas-graph .anio").html(anio);
	$("#mes-grafica-actual").val(mes);
	$("#anio-grafica-actual").val(anio);
	var mesForm = parseInt(mes) + 1;
	db.transaction(function(tx){
		sql = 'SELECT * FROM sentimientos WHERE fecha >= "' + anio + '-' + mesForm + '-01" AND fecha <= "' + anio + '-' + mesForm + '-31" AND atributo = "' + attr + '" ORDER BY fecha ASC';
		tx.executeSql(sql, [],function(tx, results){
						desplegarGrafica(tx, results, mesForm, anio);
					}, errorCargarSiento);
	},errorCargarSiento);
}

function desplegarGrafica(tx, results, mes, anio){
	var hoy = new Date();
	var div = document.createElement('div');
	var contenedor = document.getElementById("contenedor-grafica");
	div.setAttribute("id", "contenedor-grafica-siento");
	div.setAttribute("class", "contenedor-grafica-siento");
	for(var ii = 1; ii< 32; ii ++){
		var mesJS = parseInt(mes) - 1;
		var fechaTemp = new Date(anio, mesJS, ii);
		var span = document.createElement('span');
		if(fechaTemp.getMonth() !== mesJS){
			break;
		}
		var mag = 1;
		for(var jj = 0; jj < results.rows.length; jj++){
			if(fechaTemp.toString() == fechaDBaJS(results.rows.item(jj).fecha).toString()){
				mag = results.rows.item(jj).magnitud;
			}
		}
		if(fechaTemp > hoy){
			span.setAttribute("data-magnitud", 0);
			span.className = 'futuro';
			span.innerHTML = '<h5 class="dia-grafica">' + ii + '</h5>';
		}else{
			span.setAttribute("data-magnitud", mag);
			span.innerHTML = '<h5 class="dia-grafica">' + ii + '</h5><img src="img/luna-rosa17.png"/>';
		}
		div.appendChild(span);
	}
	contenedor.innerHTML = '';
	contenedor.appendChild(div);
	var medida = parseInt($("#contenedor-grafica-siento").width())/ii;
	$("#contenedor-grafica-siento span").width(medida);
}

function fechaDBaJS(string){
	var arr = string.split('-');
	var anio = arr[0];
	var mes = parseInt(arr[1]) - 1;
	var dia = arr[2];
	return new Date(anio, mes, dia);
}

function fechaJSaDB(fecha){
	console.log(fecha);
	var fechaFormato = '';
	fechaFormato += fecha.getFullYear() + '-';
	if(parseInt(fecha.getMonth()) + 1 < 10){
		fechaFormato += '0' + parseInt(fecha.getMonth()) + 1;	
	}else{
		fechaFormato += parseInt(fecha.getMonth()) + 1;
	}
	fechaFormato += '-';
	if(parseInt(fecha.getDate()) < 10){
		fechaFormato += "0" + parseInt(fecha.getDate());	
	}else{
		fechaFormato += parseInt(fecha.getDate());
	}
	return fechaFormato;
}

function guardarComentarioSiento(){
	var fecha = new Date($("#fecha-siento-actual").val());
	var attr = $("#attr-siento-actual").val();
	var comentario = $("#campo-texto-siento").val();

	fechaFormato = fechaJSaDB(fecha);
	console.log(comentario);
	db.transaction(function(tx){
			tx.executeSql('SELECT * FROM sentimientos WHERE fecha = "' + fechaFormato + '" AND atributo = "' + attr + '"', [], 
					function(tx, results){
						guardarComentario(tx, results, fechaFormato, attr, comentario);
					}, errorCargarSiento);
		}
		,errorCargarSiento, successGuardarSiento
	);
}

function cargarComentarioSiento(comentario){
	$("#campo-texto-siento").val(comentario);
}

function guardarComentario(tx, results, fecha, attr, comentario){

	tx.executeSql("UPDATE sentimientos SET comentarios='" + comentario + "' WHERE fecha='" + fecha + "' AND atributo = '" + attr + "'", [], function(tx, res){
		var datosBase = [];
		datosBase.push({"comentarios": comentario});
		datosBase.push({"fecha": fecha, "atributo": attr});
		queryRespaldo("update", "sentimientos", datosBase);
	}, function(tx, err){});	
}