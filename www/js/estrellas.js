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
		tx.executeSql('SELECT * FROM sentimientos WHERE fecha = "' + fechaFormato + '" AND atributo = "' + attr + '"', [], 
					function(tx, results){
						var magnitudActual = 0;
						if(results.rows.length == 0){
							magnitudActual = 1;
						}else{
							magnitudActual = results.rows[0].magnitud;
						}
						activarEstrella(magnitudActual);
					}, errorCargarSiento);
	}, errorCargarSiento);
}

function guardarSientoBase(fecha, attr, magnitud){
	fechaFormato = fechaJSaDB(fecha);
	db.transaction(function(tx){
			tx.executeSql("DROP TABLE sentimientos");
			tx.executeSql("CREATE TABLE IF NOT EXISTS sentimientos ( "+
					"fecha DATE NOT NULL, " +
					"atributo VARCHAR(50), " +
					"magnitud INTEGER);");
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
		console.log("INSERT");
		tx.executeSql("INSERT INTO sentimientos (fecha, atributo, magnitud) VALUES('" + fecha + "', '" + attr + "', '" + magnitud + "')");
	}else{
		console.log("UPDATE");
		tx.executeSql("UPDATE sentimientos SET atributo= '" + attr + "', magnitud='" + magnitud + "' WHERE fecha='" + fecha + "' AND atributo = '" + attr + "'");
	}
}

function errorCargarSiento(err){
	alert("ERROR-" + err.code + ": " + err.message);
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
		sql = 'SELECT * FROM sentimientos WHERE fecha >= "' + anio + '-' + mesForm + '-1" AND fecha <= "' + anio + '-' + mesForm + '-31" AND atributo = "' + attr + '" ORDER BY fecha ASC';
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
		$.each(results.rows, function(key, res){
			if(fechaTemp.toString() == fechaDBaJS(res.fecha).toString()){
				mag = res.magnitud;
			}
		});
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
	fechaFormato += parseInt(fecha.getMonth()) + 1;
	fechaFormato += '-';
	fechaFormato += parseInt(fecha.getDate());
	return fechaFormato;
}