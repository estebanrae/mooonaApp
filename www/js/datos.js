function infoSiento(id, callback){
	var obj = {};
	switch(id){
		case "boton-siento-sex":
			obj["imagen"] = "img/boton-sex.png";
			obj["titulo"] = "SEXUALIDAD";
			obj["descripcion"] = "Lorem ipsum dolor sit amet, consecte- tuer adipiscing elit.";
			break;
		case "boton-siento-soc":
			obj["imagen"] = "img/boton-soc.png";
			obj["titulo"] = "SOCIABILIDAD";
			obj["descripcion"] = "Lorem ipsum dolor sit amet, consecte- tuer adipiscing elit.";
			break;
		case "boton-siento-ape":
			obj["imagen"] = "img/boton-ape.png";
			obj["titulo"] = "APETITO";
			obj["descripcion"] = "Lorem ipsum dolor sit amet, consecte- tuer adipiscing elit.";
			break;
		case "boton-siento-act":
			obj["imagen"] = "img/boton-act.png";
			obj["titulo"] = "ACTIVIDAD FÍSICA";
			obj["descripcion"] = "Lorem ipsum dolor sit amet, consecte- tuer adipiscing elit.";
			break;
		case "boton-siento-hum":
			obj["imagen"] = "img/boton-hum.png";
			obj["titulo"] = "HUMOR";
			obj["descripcion"] = "Lorem ipsum dolor sit amet, consecte- tuer adipiscing elit.";
			break;
		case "boton-siento-con":
			obj["imagen"] = "img/boton-con.png";
			obj["titulo"] = "CONCENTRACIÓN";
			obj["descripcion"] = "Lorem ipsum dolor sit amet, consecte- tuer adipiscing elit.";
			break;
		case "boton-siento-cre":
			obj["imagen"] = "img/boton-cre.png";
			obj["titulo"] = "CREATIVIDAD";
			obj["descripcion"] = "Lorem ipsum dolor sit amet, consecte- tuer adipiscing elit.";
			break;
		case "boton-siento-dol":
			obj["imagen"] = "img/boton-dol.png";
			obj["titulo"] = "DOLOR";
			obj["descripcion"] = "Lorem ipsum dolor sit amet, consecte- tuer adipiscing elit.";
			break;
		case "boton-siento-ene":
			obj["imagen"] = "img/boton-ene.png";
			obj["titulo"] = "ENERGÍA";
			obj["descripcion"] = "Lorem ipsum dolor sit amet, consecte- tuer adipiscing elit.";
			break;
		default:
			obj = "ERROR";
			break;
	}
	callback(obj);
}

function cargarTipoMooona(dia, mes){
	var resultado = {};
	resultado["tituloMooona"] = "MOOONA VIRGEN EN LUNA LLENA";
	resultado["descripcionMooona"] = "Mooona Virgen pide darle prioridad a los proyectos personales";
	resultado["rangoInicial"] = 1;
	resultado["rangoFinal"] = 30;
	resultado["imagenMooona"] = "img/virgen.png";
	var fertilidadBiologica = "SI";
	var fertilidadLunar = "SI";

	resultado["info_foco"] = "<div class='contenido-principal blanco'><h1>\"MOOONA VIRGEN ES UNA DONCELLA QUE CORRE LIBRE EN LA PRIMAVERA\"</h1><p>Su espíritu se alimenta de la superación personal. Es excelente para planear y poner en marcha los planes con libertad y creatividad. Su energía no responde a los planes de los demás sólo responde a los suyos. <br />La Luna llena le recuerda a Mooona compartir su energía con el mundo exterior. A veces lo confunde con la necesidad de atender los proyectos ajenos.</p></div>";

	resultado["info_arpa"] = "<div class='contenedor-iconos-diosas'><div class='contenedor-diosa' id='icono-diosa-atena'><img src='img/icono-atena.png' /><h2>ATENA</h2></div><div class='contenedor-diosa' id='icono-diosa-artemisa'><img src='img/icono-artemisa.png' /><h2>ARTEMISA</h2></div><div class='contenedor-diosa' id='icono-diosa-hestia'><img src='img/icono-hestia.png' /><h2>HESTIA</h2></div></div><div class='contenido-principal blanco'><h1>\"EL SER VIRGEN ES UNA ACTITUD QUE REINA A LA MUJER, NO UN ESTADO ASEXUAL\"</h1><p>Muchas de diosas expresan su sexualidad abiertamente y sin pena alguna. La sexualidad es completamente de ellas y se encuentra bajo su dominio, no de los demás. La Diosa virgen aparece en una mujer cuando lucha por sus deseos e ideas propias. Ellas manifiestan una realidad distinta a la vida de pareja, maternidad y crianza. Son Diosas sensuales que se valen</p></div><div class='contenedor-inferior-diosa' id='info-atena'><h2>DIOSA DE LA SABIDURIA</h2><p>Atena es altamente inteligente, racional, determinante, práctica y lógica. Ella prefiere guiarse por la cabeza en lugar del corazón. Sobre sale en los negocios, en lo académico, en ámbitos políticos y científicos<br/>Atena se siente en confianza al trabajar con hombres ya que es capaz de formar amistades con ellos sin ninguna atadura romántica ni sexual. Atena es muy extrovertida y apta para el corte y el empuje de la cultura corporativa moderna.</p></div><div class='contenedor-inferior-diosa' id='info-artemisa'><h2>DIOSA DE LA CACERÍA Y DE LA LUNA</h2><p>Artemisa es el ejemplo perfecto de la mujer deportista. Le encantan las actividades al aire libre es muy presente y reveladora en su cuerpo. Nos transmite intensidad y determinación y puede ser competitiva.</p></div><div class='contenedor-inferior-diosa' id='info-hestia'><h2>DIOSA DEL HOGAR</h2><p>Hestia es la encargada de mantener el fuego del hogar ardiendo. Esta tarea o ritual simboliza el nutrir y la continuación de la fuerza espiritual dentro de la casa.<br/>Hestia es una diosa virgen por la intensidad de introspección que posee. Ella está orientada espiritualmente y está más preocupada con el mundo interior que con el mundo exterior. Hestia hace lo posible por conectar con la energía del universo, con ese sentido de unidad poderosa.</p></div>";

	resultado["info_flor"] = "<div class='contenedor-iconos-fertilidad'><div class='contenedor-fertilidad' id='icono-fertilidad-biologica'><img src='img/icono-biologica.png' /><h2>FERTILIDAD BIOLÓGICA</h2></div><div class='contenedor-fertilidad' id='icono-fertilidad-lunar'><img src='img/icono-lunar.png' /><h2>FERTILIDAD LUNAR</h2></div></div><div class='contenido-principal' id='contenido-principal-fertilidad'><h1></h1><p></p></div><div class='contenedor-inferior-fertilidad' id='fertilidad-biologica'><h3>HOY<span class='condicion-fertilidad-bio'>" + fertilidadBiologica + "</span>ESTÁS FERTIL</h3></div><div class='contenedor-inferior-fertilidad' id='fertilidad-lunar'><h3>HOY<span class='condicion-fertilidad-lun'>" + fertilidadLunar + "</span>ESTÁS FERTIL</h3></div>";

	resultado["info_manzana"] = "<div class='contenido-principal'>PÁGINA EN CONSTRUCCIÓN</div>";

	resultado["info_pesa"] = "<div class='contenido-principal'><h1>\"EL EJERCICIO DE PREFERENCIA ES ANAERÓBICO, DE FUERZA Y RESISTENCIA\"</h1><img src='img/mooona/ejercicio.png' /><p>Los ejercicios de intervalo son excelente ejemplo. El ejercicio anaeróbico utiliza la energía almacenada en el músculo. El incremento de masa muscular ayuda a que una persona se mantenga más delgada y pueda manejar mejor su peso ya que</p></div>";

	return resultado;
}





/*****************   FUNCION DE SWIPEUP Y SWIPEDOWN    *******************/

(function() {
    var supportTouch = $.support.touch,
            scrollEvent = "touchmove scroll",
            touchStartEvent = supportTouch ? "touchstart" : "mousedown",
            touchStopEvent = supportTouch ? "touchend" : "mouseup",
            touchMoveEvent = supportTouch ? "touchmove" : "mousemove";
    $.event.special.swipeupdown = {
        setup: function() {
            var thisObject = this;
            var $this = $(thisObject);
            $this.bind(touchStartEvent, function(event) {
                var data = event.originalEvent.touches ?
                        event.originalEvent.touches[ 0 ] :
                        event,
                        start = {
                            time: (new Date).getTime(),
                            coords: [ data.pageX, data.pageY ],
                            origin: $(event.target)
                        },
                        stop;

                function moveHandler(event) {
                    if (!start) {
                        return;
                    }
                    var data = event.originalEvent.touches ?
                            event.originalEvent.touches[ 0 ] :
                            event;
                    stop = {
                        time: (new Date).getTime(),
                        coords: [ data.pageX, data.pageY ]
                    };

                    // prevent scrolling
                    if (Math.abs(start.coords[1] - stop.coords[1]) > 10) {
                        event.preventDefault();
                    }
                }
                $this
                        .bind(touchMoveEvent, moveHandler)
                        .one(touchStopEvent, function(event) {
                    $this.unbind(touchMoveEvent, moveHandler);
                    if (start && stop) {
                        if (stop.time - start.time < 1000 &&
                                Math.abs(start.coords[1] - stop.coords[1]) > 30 &&
                                Math.abs(start.coords[0] - stop.coords[0]) < 75) {
                            start.origin
                                    .trigger("swipeupdown")
                                    .trigger(start.coords[1] > stop.coords[1] ? "swipeup" : "swipedown");
                        }
                    }
                    start = stop = undefined;
                });
            });
        }
    };
    $.each({
        swipedown: "swipeupdown",
        swipeup: "swipeupdown"
    }, function(event, sourceEvent){
        $.event.special[event] = {
            setup: function(){
                $(this).bind(sourceEvent, $.noop);
            }
        };
    });

})();