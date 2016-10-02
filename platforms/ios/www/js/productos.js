function desplegarPaginaProductos(id, tipoProductos){
	$("#pagina-productos .barra-titulo h1 span").html(tipoProductos.toUpperCase());
	desplegarPaginaModal(id);
	syncProductos();
	leerProductosBase(tipoProductos);
}

function syncProductos(){
	var usr = localStorage.getItem('email_usr');
	console.log(usr);
	$.ajax({
		url: 'http://canteraestudio.com/mooona/productos-usuario',
		data: {usr: usr},
		method: 'POST',
		success: function(result){
			var resultados = $.parseJSON(result);
			guardarProductosBase(resultados, function(){
			});
		}
	});
}

function guardarProductosBase(dataArr){
	db.transaction(function(tx){
			tx.executeSql("CREATE TABLE IF NOT EXISTS productos ( "+
					"id INTEGER UNIQUE NOT NULL PRIMARY KEY, " +
					"titulo VARCHAR(200), " +
					"categoria VARCHAR(100)," + 
					"contenido VARCHAR(50000)," + 
					"imgPath VARCHAR(100));");
			$.each(dataArr, function(key, data){
				tx.executeSql('SELECT * FROM productos WHERE id = ' + data.id, [], 
					function(tx, results){
						guardarEnBase(tx, results, data);
					}, errorCargarProductos);
			});
		}
		,errorCargarProductos, successGuardarProductos
	);
}

function errorCargarProductos(err){
	alert("ERROR-" + err.code + ": " + err.message);
}

function successGuardarProductos(){
}

function guardarEnBase(tx, results, data){
	if(results.rows.length == 0){
		tx.executeSql("INSERT INTO productos (id, titulo, categoria, contenido) VALUES('" + data.id + "', '" + data.titulo + "', '" + data.categoria + "', '" + data.contenido + "')", [], function(tx, results){
				guardarImagen(tx, results, data);
			}, errorCargarProductos);
	}
}

function guardarImagen(tx, results, data){
	window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
 	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
 		success(fileSystem, data);
 	}, fail); 
}

function success(fileSystem, data){
	target_directory = fileSystem.root.nativeURL;
	downloadImage(encodeURI(data.imagenURL), data.imagen, target_directory, function(urlNuevo){guardarImgBase(urlNuevo, data.id)});

}
function downloadImage(url, filename, target_directory, callbackSuccess){
    try{
		var ft = new FileTransfer();
		ft.download(
			url,
			target_directory + filename, 
			function(entry) {
				//console.log(entry);
				callbackSuccess(entry.nativeURL);
				//tx.executeSql("UPDATE productos SET imgPath=" + entry.nativeURL);
			},
			function(error) {
				console.log("ERROR FILETRANSFER");
				console.log(error);
			}
		);
	}
	catch (e){
		console.log(e);
	}

}

function fail(){
	alert("FAILED TO LOAD FILE SYSTEM");
}

function guardarImgBase(url, id){
	db.transaction(function(tx){
		tx.executeSql("UPDATE productos SET imgPath='" + url + "' WHERE id='" + id + "'");
	},errorCargarProductos, successGuardarProductos);
}


function leerProductosBase(tipoProductos){
	var usr = localStorage.getItem('email_usr');
	db.transaction(function(tx){
		tx.executeSql("SELECT * FROM productos WHERE categoria = '" + tipoProductos + "'", [], desplegarHtmlProducto , errorCargarProductos);
	},errorCargarProductos, successGuardarProductos);
}

function desplegarHtmlProducto(tx, results){
	if(results.rows.length == 0){
		$(".mensaje-no-hay").show();
		$("#contenedor-productos").hide();
	}else{
		var htmlProductos  = '';

		$.each(results.rows, function(key, producto){
			htmlProductos += '<div class="producto" data-id="' + producto.id + '">';
			htmlProductos += '<img src="' + producto.imgPath + '" />';
			htmlProductos += '<h1>' + producto.titulo + '</h1>';
			htmlProductos += '</div><!--/producto-->';
		});
		$("#contenedor-productos").html(htmlProductos);
		$(".mensaje-no-hay").hide();
		$("#contenedor-productos").show();
	}
	
}

function abrirProducto(id){
	db.transaction(function(tx){
		tx.executeSql("SELECT * FROM productos WHERE id = '" + id + "'", [], desplegarHtmlProductoActual , errorCargarProductos);
	},errorCargarProductos, successGuardarProductos);
}
function desplegarHtmlProductoActual(tx, results){
	$("#producto-abierto h1").html(results.rows[0].titulo);
	$("#producto-abierto p").html(results.rows[0].contenido);
	$("#contenedor-productos").hide();
	$("#producto-abierto").show();
	activarBotonBack('producto-abierto', true);
}