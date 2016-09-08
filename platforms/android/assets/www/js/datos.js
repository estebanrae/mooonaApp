function infoSiento(id, callback){
	var obj = {};
	switch(id){
		case "sexualidad":
			obj["imagen"] = "img/boton-sex.png";
			obj["titulo"] = "SEXUALIDAD";
			obj["descripcion"] = "Lorem ipsum dolor sit amet, consecte- tuer adipiscing elit.";
			break;
		case "sociabilidad":
			obj["imagen"] = "img/boton-soc.png";
			obj["titulo"] = "SOCIABILIDAD";
			obj["descripcion"] = "Lorem ipsum dolor sit amet, consecte- tuer adipiscing elit.";
			break;
		case "apetito":
			obj["imagen"] = "img/boton-ape.png";
			obj["titulo"] = "APETITO";
			obj["descripcion"] = "Lorem ipsum dolor sit amet, consecte- tuer adipiscing elit.";
			break;
		case "actividad-fisica":
			obj["imagen"] = "img/boton-act.png";
			obj["titulo"] = "ACTIVIDAD FÍSICA";
			obj["descripcion"] = "Lorem ipsum dolor sit amet, consecte- tuer adipiscing elit.";
			break;
		case "humor":
			obj["imagen"] = "img/boton-hum.png";
			obj["titulo"] = "HUMOR";
			obj["descripcion"] = "Lorem ipsum dolor sit amet, consecte- tuer adipiscing elit.";
			break;
		case "concentracion":
			obj["imagen"] = "img/boton-con.png";
			obj["titulo"] = "CONCENTRACIÓN";
			obj["descripcion"] = "Lorem ipsum dolor sit amet, consecte- tuer adipiscing elit.";
			break;
		case "creatividad":
			obj["imagen"] = "img/boton-cre.png";
			obj["titulo"] = "CREATIVIDAD";
			obj["descripcion"] = "Lorem ipsum dolor sit amet, consecte- tuer adipiscing elit.";
			break;
		case "dolor":
			obj["imagen"] = "img/boton-dol.png";
			obj["titulo"] = "DOLOR";
			obj["descripcion"] = "Lorem ipsum dolor sit amet, consecte- tuer adipiscing elit.";
			break;
		case "energia":
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