require.config({
    paths: {
        jquery: 'libs/jquery.min',
        underscore: 'libs/underscore',
        backbone: 'libs/backbone-min',
        localstorage: "libs/backbone.localStorage-min"
    },
    shim: {
        backbone: {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        },

        underscore: {
            deps: ["jquery"],
            exports: "_"
        }
    }
});
require([
    'jquery',
    'underscore',
    'backbone',
    'localstorage'
], function ($, _, Backbone, localstorage) {
	
	// Model
    var Documento = Backbone.Model.extend({
        defaults:{
            
                codigo: "",
                nombre: "",
                plantilla: ""
            
        },
        idAttribute: "codigo"
    });
 
	// Collection
    var DocumentoCollection = Backbone.Collection.extend({
        model: Documento,
        localStorage: new Backbone.LocalStorage("documentosLocalhost"),
        url:'/docs'
    });

	// View
    var DocumentoView = Backbone.View.extend({
        el: $('body'),
        template: _.template($('#doc-list-template').html()),
        model: Documento,
        // CRUD del documento
        events: {
            'click .btnGuardar': 'guardar',
            'click .edit': 'editar',
            'click .delete': 'borrar',
        },

        initialize: function () {
            _.bindAll(this, "render", "guardar", "editar", "borrar");
            
            this.render();
        },
        render: function () {
            $("#clave").val("");
            $("#nombre").val("");
			$("#plantilla").val("");
            $(".btnGuardar").val(0);
            Docs.fetch();
            $('tbody').html(this.template({
                docs: Docs.toJSON()
            }));
        },
        guardar: function (ev) {

            var nombre = $("#nombre").val();
            var nPlantilla = $("#plantilla").val();
            var nCodigo = $("#clave").val();

            if (nPlantilla === "" || nombre === "" || nCodigo === "") {
                alert('Debe de acompletar el formulario para poder guardar el documento');
                return true;
            }

            var nDocumento = new Documento({
                    nombre: nombre,
                    plantilla: nPlantilla,
                    codigo: nCodigo
                });


            if ($(ev.currentTarget).val()=== '0') {
                //verifica si existe
                var isDupe = Docs.any(function() {
                    return Docs.get($("#clave").val()) === nDocumento.get('clave');
                });
                if (!isDupe) {
                   alert("Documento existente");
                    return false;
                }
                Docs.add(nDocumento);
                nDocumento.save();
            }else if ($(ev.currentTarget).val()=== $("#clave").val()) {
                //Guardar cambios del documento
                Docs.add(nDocumento);
                nDocumento.save();
            };

            this.render();
        },
        editar: function (ev) {
            //Saca la informacion del model y lo pone en el formulario
            Docs.fetch();
            var cDocumento = Docs.get($(ev.currentTarget).val());
            alert(cDocumento.attributes.codigo);
            $("#clave").val(cDocumento.attributes.codigo).focus();
            $("#nombre").val(cDocumento.attributes.nombre).focus();
            $("#plantilla").val(cDocumento.attributes.plantilla).focus();
            $(".btnGuardar").val($(ev.currentTarget).val());
        },
        borrar: function (ev) {
            var cDocumento = Docs.get($(ev.currentTarget).val());
            cDocumento.destroy();
            this.render();
        },
    });

    //iniciar aplicacion
    var Docs = new DocumentoCollection();
    var DocumentoApp = new DocumentoView();
});
