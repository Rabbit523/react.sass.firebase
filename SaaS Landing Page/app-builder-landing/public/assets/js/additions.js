/**
     * POPUPS
     **/
    (function() {

        setTimeout(() => {
            //alert("set")
            $('.modal-popup').each(function () {
                //alert("init")
                var $element = $(this);
    
                // Some default to apply for all instances of Modal
                var defaults = {
                    removalDelay: 500,
                    preloader: false,
                    midClick: true,
                    callbacks: {
                        beforeOpen: function() {
                            this.st.mainClass = this.st.el.attr('data-effect');
                        }
                    }
                };
    
                // Defaults to use for specific types
                var typeDefaults = {
                    image: {
                        closeOnContentClick: true
                    },
                    gallery: {
                        delegate: 'a',
                        // when gallery is used change the type to 'image'
                        type: 'image',
                        tLoading: 'Loading image #%curr%...',
                        mainClass: 'mfp-with-zoom mfp-img-mobile',
                        gallery: {
                            enabled: true,
                            navigateByImgClick: true,
                            preload: [0,1] // Will preload 0 - before current, and 1 after the current image
                        },
                        image: {
                            tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
                        }
                    }
                };
    
                // Load configuration values from data attributes
                var type = $element.data('type') || 'inline';
                var zoomSpeed = $element.data('zoom') || false;
                var focus = $element.data('focus') || false;
    
                var attributes = {};
    
                if (zoomSpeed) {
                    attributes.zoom = {
                        enabled: true,
                        duration: zoomSpeed
                    }
                }
    
                if (focus) {
                    attributes.focus = focus;
                }
    
                // According to the type, get the JSON configuration for each
                $.each(['image', 'gallery'], function () {
                    var attr = $element.data(this) || false;
    
                    if (attr) {
                        //typeDefaults[type][this] = attr;
                    }
    
                    // remove the values from the markup
                    $element.removeAttr("data-" + this);
                });
    
                var options = $.extend({}, defaults, {
                    type: type
                }, typeDefaults[type], attributes);
    
                $element.magnificPopup(options);
                //alert("Daniel")
            });
        }, 3000);
       

        $(document).on('click', '.modal-popup-dismiss', function (e) {
            e.preventDefault();
            $.magnificPopup.close();
        });
    })();
