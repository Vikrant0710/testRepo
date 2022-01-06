function Cart(){
	var _this = this;
    var _loader_icon;

    _this.open = function(){
        openCart();
    }

    _this.close = function(){
        closeCart();
    }

    _this.startCartLoading = function() {
        startCartLoading();
    }

    $(document).ready(function(){
        init();
    })
    
    function init(){
        $("#header-cart .cart-close").on("click", function(){
            $("body").removeClass("mobile-nav-menu-open");
            closeCart();
        })
        
        $("header .cart-btn").on("click", function(evt){
        	$('.load-icon.load-bottom-wrap').removeClass('show');
        	evt.preventDefault();
            startCartLoading();
            openCart();
            setTimeout(function(){
              	$(".recommendation-add-to-cart").prop('disabled',false)
              	},1000);
        })
        
        $(document).on("click",".recommendation-add-to-cart",function() {
        	$('.load-icon.load-bottom-wrap').addClass('show');
          var qty = 1;
          var sku = $(this).data("sku");
          var postURL = $(this).data("url");
          $.ajax({
             url: postURL,
             cache: false,
             type: 'POST',
             data:{"productCodePost": sku, qty: 1, CSRFToken: ACC.config.CSRFToken},
             success: function(data){
                 startCartLoading();
                 openCart();
                 setTimeout(function(){
                	 $('.load-icon.load-bottom-wrap').removeClass('show');
                   	},1000);
             }
            });
          $(this).prop('disabled',true)
      	setTimeout(function(){
      	$(".recommendation-add-to-cart").prop('disabled',false)
      	},3000)
        })
        
        $(document).on("click",".crs-gamer-sensei-add-to-cart",function() {
          var qty = 1;
          var sku = $(this).data("sku");
          var postURL = ACC.config.encodedContextPath+"/cart/add";
          $.ajax({
             url: postURL,
             cache: false,
             type: 'POST',
             data:{"productCodePost": sku, qty: 1, CSRFToken: ACC.config.CSRFToken},
             success: function(data){
                 startCartLoading();
                 openCart();
                 $(".crs-header-close-btn").trigger("click");
                 $("#header-cart .cart-body .load-icon").removeClass("show");
             }
            });
          $(this).prop('disabled',true)
     	 setTimeout(function(){
   	$(".crs-gamer-sensei-add-to-cart").prop('disabled',false)
   	},5000)
        })

        $("header .mobile-nav-btn#cart").on("click", function(evt){
            evt.preventDefault();

            $("body").addClass("mobile-nav-menu-open")

            startCartLoading();

            openCart();
        })

        $("#header-cart .cart-hot-area").on("click", function(evt){

            $("body").removeClass("mobile-nav-menu-open")
            closeCart();
        })

        _loader_icon = new SVGAnimation('cart-loader-icon-img', 30, true);

        initData();
    }

    function initData(){
        // Check for existing data on load
        var url = ACC.config.encodedContextPath + "/cart/rollover/MiniCart";
        $.ajax({
            url: url,
            cache: false,
            type: 'GET',
            success: function(data){
            	// json parse issue for one of the article in s3
            	var regexForTrailingComma = /\,(?!\s*?[\{\[\"\'\w])/g;
            	var regexForNewLine = /(\r\n|\n|\r)/gm;
                var sanitizedDataFromComma = data.replace(regexForTrailingComma, '');
                var sanitizedDataFromNewLine = sanitizedDataFromComma.replace(regexForNewLine, '');
                var convertedData = JSON.parse(sanitizedDataFromNewLine);
                // json parse issue for one of the article in s3
                initCartIcon(convertedData.entries);
                updateSubtotal(convertedData)
            }
        });

    }

    function openCart(){
        $('body').addClass("fixedNoScroll");
        checkForCartData();   
    }

    function closeCart(){
        $("#header-cart").removeClass("show");
        $("#header-cart .cart-body .load-icon").removeClass("show");
        $("#header-cart .cart-header h2").removeClass("show");
        $('body').removeClass("fixedNoScroll");

        $('body').css({"overflow-y":"unset"});

        cartUnpopulate();
    }

    function startCartLoading() {
        $("#header-cart").addClass("show");
        $("#header-cart").focus();
        $("#header-cart .cart-header .empty").addClass("show");

        _loader_icon.playLoop();

        $("#header-cart .cart-header h2.show").removeClass("show");
        $("#header-cart .cart-header h2.retrieving").addClass("show");
        $("#header-cart .cart-body .load-icon").addClass("show");
    }
    
  var GSwindowWidth = $(window).width();
	
	if(GSwindowWidth <= 1024) {
		$('.crs-gamer-sensei-cart-list-ul').not('.slick-initialized').slick({
			 slidesToShow: 1,
             slidesToScroll: 1,
             infinite: false,
             dots: true,
             speed:200
        });
		$('.load-icon.load-bottom-wrap').removeClass('show');
	}

	
	function checkLengthRecommendation() {
		var recommendationsLength = $('.cart-body .crs-gamer-sensei-cart-list ul li').length
		if(recommendationsLength < 2) {
			$('span.crs-gamer-sensei-header-product-count').hide()
		}
	}
	
	var slideCount = null;
	$('.crs-gamer-sensei-cart-list-ul').on('init', function(event, slick){
	  slideCount = slick.slideCount;
	  setSlideCount();
	  setCurrentSlideNumber(slick.currentSlide);
	});

	$('.crs-gamer-sensei-cart-list-ul').on('beforeChange', function(event, slick, currentSlide, nextSlide){
	  setCurrentSlideNumber(nextSlide);
	});
	 function setCurrentSlideNumber(currentSlide) {
	   var $el = $('.crs-gamer-sensei-header-product-count p:first-child');
	   $el.text(currentSlide + 1);
	 }

    function checkForCartData(){
    	$('.load-icon.load-bottom-wrap').addClass('show');
        var url = ACC.config.encodedContextPath+"/cart/rollover/MiniCart";
        $.ajax({
            url: url,
            cache: false,
            type: 'GET',
            success: function(data){
/*
            	if ($(".crs-gamer-sensei-cart-list-ul").hasClass('slick-initialized')) {
				 $(".crs-gamer-sensei-cart-list-ul").slick('unslick');
			   }
*/
                $('.load-icon.load-bottom-wrap').removeClass('show');
                // json parse issue for one of the article in s3
            	var regexForTrailingComma = /\,(?!\s*?[\{\[\"\'\w])/g;
            	var regexForNewLine = /(\r\n|\n|\r)/gm;
                var sanitizedDataFromComma = data.replace(regexForTrailingComma, '');
                var sanitizedDataFromNewLine = sanitizedDataFromComma.replace(regexForNewLine, '');
                var convertedData = JSON.parse(sanitizedDataFromNewLine);
                // json parse issue for one of the article in s3
                initCartIcon(convertedData.entries);
                cartDataLoadComplete(convertedData.entries, convertedData.shippingPromoDetails);
                addFreeshippinglabelForMiniCart(convertedData.shippingPromoDetails);
                cartPopulateRecommendations(convertedData.recommendations);
                if ($(window).width() < 1025) {
        			$("li.cart-item[id]").each(function (i) {
        				$('li.cart-item[id="' + this.id + '"]').slice(1).remove();
        			});
        			$(".crs-gamer-sensei-cart-list-ul").slick("reinit");
        			$(".crs-gamer-sensei-cart-list-ul").slick("refresh");
    				if($('.cart-body .crs-gamer-sensei-cart-list ul li.slick-slide').length < 2) {
    					$('span.crs-gamer-sensei-header-product-count').hide();
    					$(".crs-gamer-sensei-cart-list-ul").slick('unslick');
    				}else {
    					$('span.crs-gamer-sensei-header-product-count').css("display","flex")
    				}
                }

                if (!$("h2.small.discount-hide.crs-mini-cart-calculation-small-text").hasClass("hide-discount")) {
                    $("#header-cart .cart-body.crs-gamer-sensei-cart-body").addClass("withShippingDiscount")
                }
                if($(".shipping-note-text").text().length > 0) {
                	$("#header-cart .cart-body.crs-gamer-sensei-cart-body").addClass("withShippingNoteText")
                }

                openMessagePopup()
                window.onresize = openMessagePopup

                function openMessagePopup() {
                  var win = $(window).innerWidth();
                    if (win < 1025) {
                      $(".tip").click(function () {
                        let $el = $(this);
                        $("#popUpId-" +$el.data('id')).css("display", "block");
                      });
                      $(".crs-popup-message-btn").click(function () {
                        $(".popup-wrapper").css("display", "none");
                      });
                    } else {
                      $(".popup-wrapper").css("display", "none");
                      $(".tip").unbind("click");
                    }
                }

                updateSubtotal(convertedData);
                if("potential_promo" in convertedData ){
                updatePotentialPromoMsg(convertedData);
                }
                // Trigger cartBasket GTM event
                trackCartBasketGTMEvent(convertedData);            
                checkLengthRecommendation();
                if($("#header-cart .cart-footer .cart-subtotal .klarna-emi-price").length == 0) {
                	$("#header-cart .cart-body.crs-gamer-sensei-cart-body").addClass("withoutKlarnaDiv")
                }
                
                updateWarnatyQty();
                
            }
        });
        
    }
    
    function updateWarnatyQty(){
    	$('.minicart-tree-warranty').each(function (){
    		var parentQty = $(this).parent().find('.q-val-parent').text();
    		var childTotalQty = 0;
    		$(this).find('.minicart-bundle-item').each(function (){
    		var qty = $(this).find('.incrementor').find('.q-val-wChild').text();
    			childTotalQty = parseInt(childTotalQty, 10) + parseInt(qty, 10);
    		});
    		if( parentQty != undefined && parentQty == childTotalQty){
    			$(this).find('.minicart-bundle-item').each(function (){
    				$(this).find(".plus").addClass('addPlus');
    		});
    		}else{
    			$(this).find('.minicart-bundle-item').each(function (){
    				$(this).find(".plus").removeClass('addPlus');
    		});
    		}

    });
    }
    
    
  $("#header-cart .cart-body .crs-gamer-sensei-cart-list").append('<div class="load-icon load-bottom-wrap"><div class="load-bottom"><img class="rotate linear infinite lazyload" data-src="/_ui/responsive/common/images/gamer-sensei-loader.svg"></div></div>');
  function cartPopulateRecommendations(data){
         var parent = $("#header-cart .cart-body .crs-gamer-sensei-cart-list ul.crs-gamer-sensei-cart-list-ul");
         parent.html("");
         $(".crs-gamer-sensei-cart-list").addClass("hidden");
         $("#crs-cart-recommendations-promotionPopup").html("");
        for(var i = 0; i < data.length; i ++){
           var itemData = data[i];
           if(i == 0){
              $(".crs-gamer-sensei-cart-list").removeClass("hidden");
            	var title = $(".crs-gamer-sensei-title .crs-gamer-sensei-title-text");
            	title.text(itemData["recommendation_title"]);
           }
           if(itemData["changeInSource"] == true && itemData["recommendation-minimised"] == true){
            maximizeRecommendation();
           }
           if(itemData["changeInSource"] == false && itemData["recommendation-minimised"] == true){
            minimizeRecommendation();
           }
           if(itemData["changeInSource"] == true && itemData["recommendation-minimised"] == false){
              maximizeRecommendation();
           }
           if(itemData["changeInSource"] == false && itemData["recommendation-minimised"] == false){
             maximizeRecommendation();
           }
           var productCode = itemData["product_code"].replace('/', '_');
           var productName = itemData["title"];
           var productPrice = itemData["new_price"];
           var productDescription = itemData["description"];
           var currency = itemData["currency"];
           var categories = itemData["categories"];
           var variants = itemData["variants"];
           var productUrl = itemData["productURL"];
           var productPosition = itemData["productPosition"];
           var popupHtml = itemData["popupHtml"];
           var auxCategory = itemData["auxCategory"];
           var popUpOKButton = itemData["popUpOKButton"];
           var promotionMessage = itemData["promotionMessage"];
           var iPromoMsg = promotionMessage === '' ? '' : '<img src="/_ui/responsive/common/images/info_black_24dp.svg" />';
           if(itemData["productType"] != 'SERVICE_SKU'){
              productDescription = "";
           }
           if(itemData["no_pdp"] == 'true'){
        	   
        	     $("body").append(popupHtml);
               parent.append('<li id="cart-item-' + productCode + '" class="cart-item cart-bundle-item cart-item-'+productCode+' show" data-unitprice="' + itemData["new_price"] + '" data-sku="'+productCode+'"><div class="minicart-bundle-container crs-gamer-sensei-minicart-bundle-container"></div></li>');
               $("#header-cart .cart-body .crs-gamer-sensei-cart-list-ul #cart-item-" + productCode + " .minicart-bundle-container").append('<div class="minicart--thumb-border product-thumb"data-sku="'+productCode+'" data-url="'+url+'" data-currency="'+currency+'" data-productName="'+productName+'" data-productPrice="'+productPrice+'" data-cat="'+auxCategory+'" data-variants="'+variants+'" data-URL="'+productUrl+'" data-position="'+productPosition+'" onClick="trackProductRecommdationClickEvent(this)"></div>');
               var imgMarkupPopup = '<a href="javascript:;" class="crs-gamer-sensei-recommendation-img" data-sku="'+productCode+'"><img id="primaryImage-' + itemData["img_id"] + '" src="' + itemData["img_url"] + '" alt="' + itemData["title"] + '" title="' + itemData["title"] + '"></a>';
               $("#header-cart .cart-body .crs-gamer-sensei-cart-list-ul #cart-item-" + productCode + " .product-thumb").append(imgMarkupPopup);

               $("#header-cart .cart-body .crs-gamer-sensei-cart-list-ul #cart-item-" + productCode + " .minicart-bundle-container").append('<div class="product-info"></div>');
               $("#header-cart .cart-body .crs-gamer-sensei-cart-list-ul #cart-item-" + productCode + " .minicart-bundle-container .product-info").append('<div class="product-info-price"></div>');
               var infoTitleMarkup = '<a href="javascript:;" class="crs-gamer-sensei-recommendation-title" data-sku="'+productCode+'"><h2  class = "crs-mini-cart-product-recommendation-name" data-sku="'+productCode+'" data-url="'+url+'" data-currency="'+currency+'" data-productName="'+productName+'" data-productPrice="'+productPrice+'" data-cat="'+auxCategory+'" data-variants="'+variants+'" data-URL="'+productUrl+'" data-position="'+productPosition+'" onClick="trackProductRecommdationClickEvent(this)">' + itemData["title"] + '</h2><p class="crs-gamer-sensei-recommendation-description"> ' + productDescription + ' </p></a>';
               var original_price = '<div class="item-original-price crs-product-ref-original--price"><span>' + itemData["old_price"] + '</span></div> ';
               var special_price = '<div class="item-special-price crs-product-ref-special--price">' + itemData["new_price"] + '</div> ';
               var special_available = 'special';
               if( itemData["old_price"] == '' || itemData["old_price"] == null){
                   special_available = '';
               }
               var infoTotalMarkup = '<div class="item-price ' + special_available + '">' + original_price + special_price + '</div>';
               var promotionPopup = '<div class="crs-prod-ref-hover-message"><button data-id="'+i+'" class="tip">'+iPromoMsg+'<span>'+promotionMessage+'</span></button>'+infoTotalMarkup+'</div>';
               var url = ACC.config.encodedContextPath + "/cart/add";
               $("#header-cart .cart-body .crs-gamer-sensei-cart-list-ul #cart-item-" + productCode + " .product-info").append(infoTitleMarkup);
               if(itemData["stock"] != null && itemData["stock"] > 0){
                $("#header-cart .cart-body .crs-gamer-sensei-cart-list-ul #cart-item-" + productCode + " .product-info  .product-info-price").append('<button id= "productRecommendationMiniCart" class="recommendation-add-to-cart" data-sku="'+productCode+'" data-url="'+url+'" data-currency="'+currency+'" data-productName="'+productName+'" data-productPrice="'+productPrice+'" data-cat="'+auxCategory+'" data-variants="'+variants+'" onClick="trackProductRecommdationAddToCartEvent(this)"> <img src="/_ui/responsive/common/images/Plus-button.png">  ADD TO CART</button>');
               }
               $("#header-cart .cart-body .crs-gamer-sensei-cart-list-ul #cart-item-" + productCode + " .product-info .product-info-price").append(promotionPopup);
               if($('.crs-gamer-sensei-minicart-bundle-container .product-info p.crs-gamer-sensei-recommendation-description').text().trim().length == 0) {
               	$(' p.crs-gamer-sensei-recommendation-description').css("display","none")
               }
               var promotionPopupMessage = '<div id="popUpId-'+i+'" class="popup-wrapper"><div class="popup-main-dialog"><div class="popup-main"><div class="popup-body"><span class="crs-popup-message">'+promotionMessage+'</span><button class="crs-popup-message-btn">'+popUpOKButton+'</button></div></div></div></div>';
               $("#crs-cart-recommendations-promotionPopup").append(promotionPopupMessage);
           } else {
                parent.append('<li id="cart-item-' + productCode + '" class="cart-item cart-bundle-item cart-item-'+productCode+' show" data-unitprice="' + itemData["new_price"] + '" data-sku="'+productCode+'"><div class="minicart-bundle-container crs-gamer-sensei-minicart-bundle-container"></div></li>');
                $("#header-cart .cart-body .crs-gamer-sensei-cart-list-ul #cart-item-" + productCode + " .minicart-bundle-container").append('<div class="minicart--thumb-border product-thumb"data-sku="'+productCode+'" data-url="'+url+'" data-currency="'+currency+'" data-productName="'+productName+'" data-productPrice="'+productPrice+'" data-cat="'+auxCategory+'" data-variants="'+variants+'" data-URL="'+productUrl+'" data-position="'+productPosition+'" onClick="trackProductRecommdationClickEvent(this)"></div>');
                var imgMarkup = '<a href='+itemData["productURL"]+'><img id="primaryImage-' + itemData["img_id"] + '" src="' + itemData["img_url"] + '" alt="' + itemData["title"] + '" title="' + itemData["title"] + '"></a>';
                $("#header-cart .cart-body .crs-gamer-sensei-cart-list-ul #cart-item-" + productCode + " .product-thumb").append(imgMarkup);

                $("#header-cart .cart-body .crs-gamer-sensei-cart-list-ul #cart-item-" + productCode + " .minicart-bundle-container").append('<div class="product-info"></div>');
                $("#header-cart .cart-body .crs-gamer-sensei-cart-list-ul #cart-item-" + productCode + " .minicart-bundle-container .product-info").append('<div class="product-info-price"></div>');
                var infoTitleMarkup = '<a href='+itemData["productURL"]+'><h2 class = "crs-mini-cart-product-recommendation-name" data-sku="'+productCode+'" data-url="'+url+'" data-currency="'+currency+'" data-productName="'+productName+'" data-productPrice="'+productPrice+'" data-cat="'+auxCategory+'" data-variants="'+variants+'" data-URL="'+productUrl+'" data-position="'+productPosition+'" onClick="trackProductRecommdationClickEvent(this)">' + itemData["title"] + '</h2><p class="crs-gamer-sensei-recommendation-description-hardware"> ' + productDescription + ' </p></a>';
                var original_price = '<div class="item-original-price crs-product-ref-original--price"><span>' + itemData["old_price"] + '</span></div> ';
                var special_price = '<div class="item-special-price crs-product-ref-special--price">' + itemData["new_price"] + '</div> ';
                var special_available = 'special';
                if( itemData["old_price"] == '' || itemData["old_price"] == null){
                    special_available = '';
                }
                var infoTotalMarkup = '<div class="item-price ' + special_available + '">' + original_price + special_price + '</div>';
                var promotionPopup = '<div class="crs-prod-ref-hover-message"><button data-id="'+i+'" class="tip">'+iPromoMsg+'<span>'+promotionMessage+'</span></button>'+infoTotalMarkup+'</div>';
                var url = ACC.config.encodedContextPath + "/cart/add";
                $("#header-cart .cart-body .crs-gamer-sensei-cart-list-ul #cart-item-" + productCode + " .product-info").append(infoTitleMarkup);
                if(itemData["stock"] != null && itemData["stock"] > 0){
                 $("#header-cart .cart-body .crs-gamer-sensei-cart-list-ul #cart-item-" + productCode + " .product-info  .product-info-price").append('<button class="recommendation-add-to-cart" data-sku="'+productCode+'" data-url="'+url+'" data-currency="'+currency+'" data-productName="'+productName+'" data-productPrice="'+productPrice+'" data-cat="'+auxCategory+'" data-variants="'+variants+'" onClick="trackProductRecommdationAddToCartEvent(this)"> <img src="/_ui/responsive/common/images/Plus-button.png">  ADD TO CART</button>');
                }
                $("#header-cart .cart-body .crs-gamer-sensei-cart-list-ul #cart-item-" + productCode + " .product-info .product-info-price").append(promotionPopup);
                if($('.crs-gamer-sensei-minicart-bundle-container .product-info p.crs-gamer-sensei-recommendation-description-hardware').text().trim().length == 0) {
                	$(' p.crs-gamer-sensei-recommendation-description-hardware').css("display","none")
                }
                var promotionPopupMessage = '<div id="popUpId-'+i+'" class="popup-wrapper"><div class="popup-main-dialog"><div class="popup-main"><div class="popup-body"><span class="crs-popup-message">'+promotionMessage+'</span><button class="crs-popup-message-btn">'+popUpOKButton+'</button></div></div></div></div>';
                $("#crs-cart-recommendations-promotionPopup").append(promotionPopupMessage);
           }
         }     
      }
  
  $(".crs-gamer-sensei-inner-header").click(function() {
	  $(".crs-gamer-sensei-cart-list-ul, .crs-gamer-sensei-dropdown, .crs-gamer-sensei-inner-header").toggleClass("crs-close");
	  if($("ul.crs-gamer-sensei-cart-list-ul").hasClass('crs-close')) {
//		  $(".cart-body.crs-gamer-sensei-cart-body").css("overflow","hidden")
      $.ajax({
         url: ACC.config.encodedContextPath+"/cart/recommendation/"+"true",
         cache: false,
         type: 'GET',
         success: function(data){
         }
      });
	  } else {
		  $(".cart-body.crs-gamer-sensei-cart-body").css("overflow","auto")
      $.ajax({
         url: ACC.config.encodedContextPath+"/cart/recommendation/"+"false",
         cache: false,
         type: 'GET',
         success: function(data){
         }
      });
	  }
  })
    function minimizeRecommendation() {
      $(".crs-gamer-sensei-cart-list-ul, .crs-gamer-sensei-dropdown, .crs-gamer-sensei-inner-header").addClass("crs-close");
      
      $(".cart-body.crs-gamer-sensei-cart-body").css("overflow","hidden")
    }
    function maximizeRecommendation() {
        $(".crs-gamer-sensei-cart-list-ul, .crs-gamer-sensei-dropdown, .crs-gamer-sensei-inner-header").removeClass("crs-close");
        $(".cart-body.crs-gamer-sensei-cart-body").css("overflow","auto")
      }

    $(document).on("click", ".crs-gamer-sensei-recommendation-title, .crs-gamer-sensei-recommendation-img ", function() {
               	var sku = $(this).data("sku");
                $(".crs-popup-main-background").filter(`[data-sku='${sku}']`).addClass("crs-main-background-popup-open")
    }) 
    
    $(document).on("click", ".crs-header-close-btn", function() {
               	$(".crs-popup-main-background").removeClass("crs-main-background-popup-open") 
    })

    function updateSubtotal(data) {

        $("#header-cart .cart-footer .shipping-text").html(data.shippingCost);
        var shippingCostValue = "-";
        shippingCostValue =  shippingCostValue+data.shippingCost;
        var shippingDiscountValue =  data.shippingDiscount;

        if(shippingCostValue == shippingDiscountValue)
        {
        	$("#header-cart .cart-footer .discount-hide").removeClass("hide-discount");
        	$("#header-cart .cart-footer .shipping-Discount-text").html(data.shippingDiscount);
        }
        else
        {
        	$('#header-cart .cart-footer .discount-hide').addClass("hide-discount");
        }
        $("#header-cart .cart-footer .tax-text").html(data.taxNote);
        $(".shipping-note-text").removeAttr("hidden");
        $("#header-cart .cart-footer .shipping-note-text").html(data.shippingNote);
        
        //SUS-1807 & SUS-1937
        //$("#header-cart .cart-footer .cart-subtotal .subtotal-amt").html(data.subtotal);
        $("#header-cart .cart-footer .cart-subtotal .subtotal-amt").html(data.subtotalWODiscount);
        $("#header-cart .cart-footer .cart-subtotal .crs-estimated-discount-on-entry").html("-"+data.totalEntriesAndOrderDiscount);
        
        updateKlarnaWidget(data.subtotal);
    }

    function updateKlarnaWidget(subtotal) {
    	var enableKlarna = $(".klarna-enable").attr("data-enable-klarna");
    	if (enableKlarna === "true") {
    		var subtotalValue = subtotal.substring(1, subtotal.length).replace(".", "").replace(",", "");
            if ($("#header-cart .cart-footer .cart-subtotal .klarna-emi-price").length > 0) {
            	$("#header-cart .cart-footer .cart-subtotal .klarna-emi-price").remove();
            }
            $("#header-cart .cart-footer .cart-subtotal .shipping-note-text").after('<klarna-placement class="klarna-emi-price" data-key="credit-promotion-auto-size" data-locale="en-US" data-purchase-amount="' + subtotalValue + '"></klarna-placement>');
            window.KlarnaOnsiteService = window.KlarnaOnsiteService || [];
            window.KlarnaOnsiteService.push({ eventName: 'refresh-placements' });

    	}
    }

    function interruptLoading(){
    }

    function cartDataLoadComplete(data, shippingData){

        $("#header-cart .cart-body .crs-gamer-sensei-cart-list ~ .load-icon").removeClass("show");
        _loader_icon.stop();
        _loader_icon.reset();

        if(data.length == 0){
            $("#header-cart .cart-header h2.show").removeClass("show");
            $("#header-cart .cart-header h2.empty").addClass("show");

            $("#header-cart .cart-footer .cart-subtotal .subtotal-amt").html("0.00");
            return;
        }

        $("#header-cart .cart-header h2.show").removeClass("show");
        $("#header-cart .cart-header h2.review").addClass("show");

        cartPopulate(data, shippingData);
        

    }

    function initCartIcon(data){
        var numUnits = 0;

        if (data.length > 9) {
            numUnits = 10;
           }  else {
           for(var i = 0; i < data.length; i++){
               var itemData = data[i];
               
               var itemQuantity = itemData.quantity;

               numUnits += itemQuantity;
        	   
        	   var warrantyProductList = data[i].warrantyProductList;
        	 
        	   if (warrantyProductList.length > 0) {  	
               	for(var j = 0; j < warrantyProductList.length; j++) {	
               		numUnits += warrantyProductList[j].quantity;
               	}
        	   }
        	   
               if (numUnits > 9){
                   break;
               }
           }
           
           /*for (var x=0; x<entries.length;x++) {
               qty += entries[x].quantity;
           }*/
           }
        
        

        // If items in cart, show cart icon amount. If 0, turn display of number off
        if(numUnits > 0){
        	  if(numUnits <= 9)
        	  {
               $("header .header-main .header-right .cart-btn .quantity p").html(numUnits);
            }
        	  else
        	  {
        		  $("header .header-main .header-right .cart-btn .quantity p").html("9+");
        	  }
        	  $("header .header-main .header-right .cart-btn .quantity").addClass("show")
        }else{
            $("header .header-main .header-right .cart-btn .quantity p").html("0");
            $("header .header-main .header-right .cart-btn .quantity").removeClass("show");
        }
    }

    function updateCartIcon(data){

    }
    
    function addFreeshippinglabelForMiniCart(shippingdata)
    {
    	for(var i = 0; i < shippingdata.length; i ++)
    	{
            var itemData = shippingdata[i];
            var freeShippingMessageforMiniCart = '<div class="cart-free-shipping-label-blue"><img src="/_ui/responsive/common/images/shippingTruckIconBlue.png" alt=""><span class="crs-free-shipping-text-label">'+itemData["freeShippingMessageforMiniCart"]+'</span></div>';

            if(((itemData["isCartContainsFreeShippingProduct"] == 'true') || (itemData["isOrderFreeShipping"] =='true')))
            {
            	$("#header-cart .crs-free-shipping-label-cart").html(freeShippingMessageforMiniCart);
            	$("#header-cart .crs-free-shipping-label-cart").show();
            }
           else{
            	$("#header-cart .crs-free-shipping-label-cart").hide();
            }
    	}
    }
/* Bug COR-871, 879*/
    function cartPopulate(data, shippingData){
    	var parent = $("#header-cart .cart-body .cart-list");
    	var isCartContainsFreeShippingProduct = false;
    	var notQualifyEntryFreeShippingMessage = "";
    	for(var j = 0; j < shippingData.length; j ++)
    	{
    		var itemShippingData = shippingData[j];
    		isCartContainsFreeShippingProduct = itemShippingData["isCartContainsFreeShippingProduct"];
    		notQualifyEntryFreeShippingMessage = itemShippingData["notQualifyEntryFreeShippingMessage"];
    	}
    	
    	
        parent.html("");
        var infoFreeShippingLabelforCart = '<li class ="show"><div class = "crs-free-shipping-label-cart"></div></li>'
        parent.append(infoFreeShippingLabelforCart);
        for(var i = 0; i < data.length; i ++){
            var itemData = data[i];

            var unit_price = itemData["item_price"];
            var entryNumber = itemData["entryNumber"];

            var productCode = itemData["product_code"].replace('/', '_');
            
            var warrantyProductList = itemData["warrantyProductList"];
            
            var productBundleGroupList = itemData["productBundleGroupList"];

            var statusCode  = itemData["statusCode"];

            if( itemData["item_price"] === false ){
                unit_price = itemData["original_price"];
            }
            var popupHtml = itemData["popupHtml"];
            
            var displayWarrantyProductButton = itemData["displayWarrantyProductButton"];

            $("body").append(popupHtml);
            parent.append('<li id="cart-item-' + entryNumber + '" class="cart-item cart-bundle-item cart-item-'+productCode+'" data-unitprice="' + unit_price + '" data-entryNumber="'+entryNumber+'"><div class="minicart-bundle-container"></div></li>');

            // THUMB
            $("#header-cart .cart-body .cart-list #cart-item-" + entryNumber + " .minicart-bundle-container").append('<div class="minicart--thumb-border product-thumb"></div>');

            var imgMarkup = '<a href='+itemData["productURL"]+'><img id="primaryImage-' + itemData["img_id"] + '" src="' + itemData["img_url"] + '" alt="' + itemData["title"] + '" title="' + itemData["title"] + '"></a>';

            if(itemData["no_pdp"] == 'true'){
              imgMarkup = '<a href="javascript:;" class="crs-gamer-sensei-recommendation-img" data-sku="'+productCode+'"><img id="primaryImage-' + itemData["img_id"] + '" src="' + itemData["img_url"] + '" alt="' + itemData["title"] + '" title="' + itemData["title"] + '"></a>';
            }
            $("#header-cart .cart-body .cart-list #cart-item-" + entryNumber + " .product-thumb").append(imgMarkup);


            // INFO
            $("#header-cart .cart-body .cart-list #cart-item-" + entryNumber + " .minicart-bundle-container").append('<div class="product-info"></div>');

            var infoTitleMarkup = '<a href='+itemData["productURL"]+'><h2>' + itemData["title"] + '</h2></a>';
            if(itemData["no_pdp"] == 'true'){
               infoTitleMarkup = '<a href="javascript:;" class="crs-gamer-sensei-recommendation-img" data-sku="'+productCode+'"><h2>' + itemData["title"] + '</h2></a>';
            }
            var isEntryQualifyForFreeShipping = itemData["entryQualifyForFreeShipping"];
            //alert(isEntryQualifyForFreeShipping)
            var notQualifyEntryFreeShippingMessageHtml ="";
            if(isCartContainsFreeShippingProduct == "true" && isEntryQualifyForFreeShipping == "false")
            {
            	notQualifyEntryFreeShippingMessageHtml = '<div class="crs-not-qualify-free-shipping-label">'+ notQualifyEntryFreeShippingMessage +'</div>';
            }
            	
          //SUS-1807 & SUS-1937
            /*var infoPromoMarkup = '<div class="promo">' + itemData["promo"] + '</div>';*/
            var infoPromoMarkup = '<div class="promo">' + '</div>';

            var infoInventoryContainer = '<div class="inventory-container"></div>';

            var infoQuantityContainer = '<div class="quantity-container"></div>';

            var infoLoadingContainer = '<div class="loading-container"><img src="/_ui/responsive/common/images/loading-tiny.gif" /></div>';

            //SUS-1807 & SUS-1937
            // var original_price = '<div class="item-original-price item-original-price-entry">' + itemData["original_price"] + '</div> ';
            
            var entryDiscountedPrice = itemData["original_price"];
            var entryWoDiscountedPrice = itemData["actual_Total_Entry_Level_Price"];
            if(entryDiscountedPrice != entryWoDiscountedPrice ) 
            {     	
            	var actual_Total_Entry_Level_Price = '<div class="item-actual-total-entry-level-price">' + itemData["actual_Total_Entry_Level_Price"] + '</div> ';
            	var original_price = '<div class="item-original-price item-original-price-entry">' + itemData["original_price"] + '</div> ';
            }
            else
            {
            	var original_price = '<div class="item-original-price item-original-price-entry crs-product-no-discount">' + itemData["original_price"] + '</div> ';
            	var actual_Total_Entry_Level_Price = '<div class="item-actual-total-entry-level-price crs-space-price">' +""+ '</div> ';
            	
            }
            //End of SUS-1807 & SUS-1937
            
            var special_price = '<div class="item-special-price">' + itemData["item_price"] + '</div> ';

            var special_available = 'special';

            if( itemData["item_price"] === false ){
                special_price = '';
                special_available = '';
            }

            //SUS-1807 & SUS-1937
           // var infoTotalMarkup = '<div class="2 item-price ' + special_available + '">' + original_price + special_price + '</div>';
            var infoTotalMarkup = '<div class="item-price ' + special_available + '">' + original_price + actual_Total_Entry_Level_Price + special_price + '</div>';


            $("#header-cart .cart-body .cart-list #cart-item-" + entryNumber + " .product-info").append(infoTitleMarkup);
            $("#header-cart .cart-body .cart-list #cart-item-" + entryNumber + " .product-info").append(notQualifyEntryFreeShippingMessageHtml);
            $("#header-cart .cart-body .cart-list #cart-item-" + entryNumber + " .product-info").append(infoPromoMarkup);
            $("#header-cart .cart-body .cart-list #cart-item-" + entryNumber + " .product-info").append(infoInventoryContainer);
            $("#header-cart .cart-body .cart-list #cart-item-" + entryNumber + " .product-info .inventory-container").append(infoQuantityContainer);
            $("#header-cart .cart-body .cart-list #cart-item-" + entryNumber + " .product-info .inventory-container").append(infoLoadingContainer);
            $("#header-cart .cart-body .cart-list #cart-item-" + entryNumber + " .product-info .inventory-container").append(infoTotalMarkup);

          //SUS-1807 & SUS-1937
            $(".cart-body.crs-gamer-sensei-cart-body ul.cart-list li .item-price").each(function() {
            	if (entryDiscountedPrice == entryWoDiscountedPrice){
            		$('.item-original-price').addClass('crs-orginal-price-color');
            		
            	}
            });

            //var infoQuantityMarkup = '<p class="quantity">' + itemData["quantitytext"] + ' <span class="quantity-amt">' + itemData["quantity"] + '</span></p>';
            if(itemData["giveAway"] == false){

            if(warrantyProductList.length > 0){
            var restrictQty = '<div class="incrementor"><a class="minus '+productCode+'" href="#" data-direction="minus" data-product="'+productCode+'" data-itemid="' + entryNumber + '" data-entryNumber="'+entryNumber+'">-</a><p class="q-val q-val-parent">' + itemData["quantity"] + '</p><a class="plus plus-parent" href="#" data-direction="plus" data-product="'+productCode+'" data-itemid="' + entryNumber + '" data-entryNumber="'+entryNumber+'">+</a></div>';
            $("#header-cart .cart-body .cart-list #cart-item-" + entryNumber + " .product-info .quantity-container").append(restrictQty);
            $('.plus.plus-parent').addClass('plus-icon-incrementor')
            if(itemData["quantity"]==1){
            	$('.minus.'+productCode).addClass('plus-icon-incrementor')
            }
            }
            else{
             var infoQuantityMarkup = '<div class="incrementor"><a class="minus '+productCode+'" href="#" data-direction="minus" data-product="'+productCode+'" data-itemid="' + entryNumber + '" data-entryNumber="'+entryNumber+'">-</a><p class="q-val q-val-parent">' + itemData["quantity"] + '</p><a class="plus plus-parentt" href="#" data-direction="plus" data-product="'+productCode+'" data-itemid="' + entryNumber + '" data-entryNumber="'+entryNumber+'">+</a></div>';
             $("#header-cart .cart-body .cart-list #cart-item-" + entryNumber + " .product-info .quantity-container").append(infoQuantityMarkup);    
             if(itemData["quantity"]==1){
            	$('.minus.'+productCode).addClass('plus-icon-incrementor')
             }
             
            }
            

            var removeContainer = '<div class="remove-container"></div>';
            $("#header-cart .cart-body .cart-list #cart-item-" + entryNumber + " .product-info").append(removeContainer);


			var deleteBtnMarkup = '<a href="#" class="mini-cart-delete" url="'+ACC.minicartRemoveUrl+'" data-product="'+productCode+'">'+ACC.minicartRemoveMsg+'</a>';

            $("#header-cart .cart-body .cart-list #cart-item-" + entryNumber + " .product-info .remove-container").append(deleteBtnMarkup);
           }
            var messageMarkup = "<p class='message messageParent'></p>";

            $("#header-cart .cart-body .cart-list #cart-item-" + entryNumber + " .product-info .remove-container").append(messageMarkup);
           /* alert(displayWarrantyProductButton)*/
            var wrntyLabel = itemData["warrantyButtonName"];
            var corsairWarrantyName = itemData["corsairWarrantyName"];

            var wrntyFlag = displayWarrantyProductButton[0];
           /* alert(wrntyFlag)*/
            if(wrntyFlag == 'true' && itemData["quantity"] ==1){
        		/*alert(displayWarrantyProductButton[0])*/
        		var warrantyMsg = '<div class="warrantyDisplay"><a href="#" class="displayWarrantyPopUpButton" data-product="'+productCode+'">'+ wrntyLabel+'</a></div>';
        		$("#header-cart .cart-body .cart-list #cart-item-" + entryNumber + " .product-info").append(warrantyMsg);

        	}
            
            if (warrantyProductList.length > 0) {
            	var liString = "";
            	for(var j = 0; j < warrantyProductList.length; j++) {
            		 var actualWarrantyProductPriceWO = warrantyProductList[j].actual_Total_Entry_Level_Price;
            		 var warrantyProductDiscountedPrce = warrantyProductList[j].original_price;
            		 if(actualWarrantyProductPriceWO != warrantyProductDiscountedPrce)
            		{
            			 var actualWarrantyProductPrice_w = '<div class="item-original-price item-original-price-entryChild crs-warranty-entry-product-actual-price"><span>' + warrantyProductList[j].actual_Total_Entry_Level_Price + '</span></div> ';
            		 	 var original_price_w = '<div class="item-original-price item-original-price-entryChild crs-warranty-entry-product-discount-price"><span>' + warrantyProductList[j].original_price + '</span></div> ';
            		}
            		 else
            		{
            			 var actualWarrantyProductPrice_w = '<div class="item-original-price item-original-price-entryChild crs-warranty-product-actual-price">' +""+ '</div> ';
            		 	 var original_price_w = '<div class="item-original-price item-original-price-entryChild crs-warranty-entry-procduct-WO-discount"><span>' + warrantyProductList[j].original_price + '</span></div> ';
            		}
            		 
                     var special_price_w = '<div class="item-special-price">' + warrantyProductList[j].item_price + '</div> ';

                     var special_available_w = 'special';

                     if( warrantyProductList[j].item_price === false ){
                         special_price_w = '';
                         special_available_w = '';
                     }
                    
                     var infoTotalMarkup_w = '<div class="item-price ' + special_available_w + '">' + original_price_w + special_price_w + actualWarrantyProductPrice_w+'</div>';
                    
                     var deleteBtnMarkup = '<a href="#" class="mini-cart-delete" url="'+ACC.minicartRemoveUrl+'" data-product="'+warrantyProductList[j].product_code+'" data-warantyproductRemove="'+productCode+'">'+ACC.minicartRemoveMsg+'</a>';
                     
                     var productCode = warrantyProductList[j].product_code.replace('/', '_');
                     var unit_price = warrantyProductList[j].item_price;
                    if( itemData["item_price"] === false ){
                                   unit_price = warrantyProductList[j].original_price;
                               }
                    var promo = warrantyProductList[j].promo;
                   // promo = "Messaging about special pricing will be displayed here, if applicable";
                    liString += '<li id="cart-item-' + warrantyProductList[j].entryNumber + '" class="cart-item-' + warrantyProductList[j].entryNumber + ' cart-item minicart-bundle-item show cart-item-'+productCode+'" data-unitprice="' + unit_price + '" data-entryNumber="'+warrantyProductList[j].entryNumber+'" data-entryQuantity="'+warrantyProductList[j].quantity+'"><div class="product-thumb minicart-child-product-thumb"><a href='+warrantyProductList[j].productURL+' target="_blank"><img id="' + warrantyProductList[j].img_id + '" src="' + warrantyProductList[j].img_url + '" alt="' + warrantyProductList[j].title + '"></a></div><div class="product-info minicart-child-product-info"><a href='+warrantyProductList[j].productURL+' target="_blank"><h2>' + warrantyProductList[j].title + '</h2></a><div class="promo">' + promo + '</div><div class="quantity-container"><div class="incrementor"><a class="minus plus-icon-incrementor" href="#" data-direction="minus" data-warantyProduct="' + warrantyProductList[j].warantyProduct + '" data-product="' + warrantyProductList[j].product_code + '" data-itemid="' + warrantyProductList[j].entryNumber + '" data-entryNumber="'+warrantyProductList[j].entryNumber+'">-</a><p class="q-val q-val-wChild">' + warrantyProductList[j].quantity + '</p><a class="plus" href="#" data-direction="plus" data-warantyProduct="' + warrantyProductList[j].warantyProduct + '" data-product="' + warrantyProductList[j].product_code + '" data-itemid="' + warrantyProductList[j].entryNumber + '" data-entryNumber="'+warrantyProductList[j].entryNumber+'">+</a></div>' +infoTotalMarkup_w+ '</div><div class="remove-container">' +deleteBtnMarkup+ '<p class="message messageChild"></p></div></div></li>';
            	      $('.plus.addPlus').addClass('plus-icon-incrementor')
            	}
            	var childProductList = '<ul class = "minicart-tree minicart-tree-warranty" data-parentQty=" ' + itemData["quantity"] + ' " >' + liString + '</ul>'

                $("#header-cart .cart-body .cart-list #cart-item-" + entryNumber).append(childProductList);
            }


          if (productBundleGroupList.length > 0) {
            	var liString = "";
            	for(var j = 0; j < productBundleGroupList.length; j++) {
            		liString += '<li class="cart-item minicart-bundle-item show"><div class="product-thumb minicart-child-product-thumb"><img id="' + productBundleGroupList[j].img_id + '" src="' + productBundleGroupList[j].img_url + '" alt="' + productBundleGroupList[j].productName + '"></div><div class="product-info minicart-child-product-info"><h2>' + productBundleGroupList[j].productName + '</h2></li>';
            	}
            	var childProductList = '<ul class = "minicart-tree" >' + liString + '</ul>'

                $("#header-cart .cart-body .cart-list #cart-item-" + entryNumber).append(childProductList);
            }

            var cartItem = "#header-cart .cart-body .cart-list #cart-item-" + entryNumber;

           if (statusCode == ACC.maxQuantityMsg)
           {
            	displayMessage(statusCode, entryNumber,cartItem);
           }
            else if(statusCode == ACC.nowarranty)
            {
            	displayMessage(statusCode, entryNumber,cartItem);
            }
            else if(statusCode == ACC.cannotAddWarranty){
            	displayMessage(statusCode, entryNumber,cartItem);
            }
            else {
            	removeMessage(entryNumber,cartItem);
            }
        }
//Bubg 871,879
        // Display items
        var items = $("#header-cart .cart-body .cart-list .cart-item");
        var itemIndex = 0;
        var delayUnit = 150;

        var appearINT = setInterval(function(){
            var item = items[itemIndex];

            $(item).addClass("show");

            itemIndex++;

            if(itemIndex > items.length){
                clearInterval(appearINT);
            }
        }, delayUnit);

        $(".product-info .mini-cart-delete").click(function() { 
        	$('.load-icon.load-bottom-wrap').addClass('show');
        	var productCode = $(this).data("product").replace("/", "_");
        	var entryNumber = $(this).parents(".cart-item-"+productCode).data("entrynumber");
            
            var id =  $(this).closest(".cart-item").attr("id");
            var url = ACC.config.encodedContextPath + "/corsaircheckout/update";
           
            //GTM code for remove cart - COR 619 @Nikhil 07Oct2020

            var divOriginalPrice = event.target.parentElement.parentElement.getElementsByClassName('item-price')[0].innerText;
            var warantyProduct = $(this).data("warantyproductremove");
            if(warantyProduct != undefined && warantyProduct != ''){
            	var entryImageURL = event.target.parentElement.parentElement.parentElement.parentElement.getElementsByTagName('img')[0].src;
            }else{
            	var entryImageURL = event.target.closest('div.minicart-bundle-container').getElementsByTagName('img')[0].src;
            }
            

            //End

            $.ajax({
                url: url,
                cache: false,
                type: 'POST',
                data:{"entryNumber": entryNumber, "action": "delete", quantity: 0, CSRFToken: ACC.config.CSRFToken},
                success: function(data){
                    $(".cart-item-"+productCode).closest(".cart-item").detach();
                    var callFrom = "removeLink";
                    //GTM for removeCart COR 619
                    trackRemoveCartUsedGTMEvent(data, divOriginalPrice, entryImageURL, callFrom);

                    if (data.CART_DATA.subTotal.value > 0) {
                    
                    //SUS-1807 & SUS-1937
                   // $(".cart-subtotal .subtotal-amt").html(data.CART_DATA.subTotal.formattedValue);
                        $(".cart-subtotal .subtotal-amt").html(data.CART_DATA.actualSubTotalWODiscount.formattedValue);
                        $(".cart-subtotal .crs-estimated-discount-on-entry").html("-"+data.CART_DATA.totalEntryAndOrderLevelDiscount.formattedValue);
                        
                    updateKlarnaWidget(data.CART_DATA.subTotal.formattedValue);
                    if(data.CART_DATA.deliveryCost != null)
                    {
                    	var store = data.CART_DATA.store;
                        if( data.CART_DATA.deliveryCost.value > 0 && store == "corsair-us")

                        {
                            $("#header-cart .cart-footer .shipping-text").html(data.CART_DATA.deliveryCost.value);
                            $(".shipping-note-text").removeAttr("hidden");
                        }
                        else if(store == "corsair-us")
                        {
                        	$("#header-cart .cart-footer .shipping-text").html(ACC.minicartFreeMsg);
                            $(".shipping-note-text").attr("hidden", "hidden")
                        }

                        else if(store != "corsair-us" && data.shippingEstimateTypeCheckValues == 'true' && data.CART_DATA.totalDeliveryWithFreeShipping.value > 0 && data.CART_DATA.totalDeliveryWithFreeShipping.value == data.CART_DATA.discountDelivery.value)
                        {
                        	$("#header-cart .cart-footer .discount-hide").removeClass("hide-discount");
                        	$("#header-cart .cart-footer .shipping-text").html(data.CART_DATA.totalDeliveryWithFreeShipping.formattedValue);
                        	$(".shipping-note-text").removeAttr("hidden");
                            $("#header-cart .cart-footer .shipping-Discount-text").html("-"+data.CART_DATA.totalDeliveryWithFreeShipping.formattedValue);
                            $(".shipping-note-text").removeAttr("hidden");
                        }
                        else if(store != "corsair-us" && data.shippingEstimateTypeCheckValues == 'true' && data.CART_DATA.totalDeliveryWithFreeShipping.value > 0 && data.CART_DATA.totalDeliveryWithFreeShipping.value != data.CART_DATA.discountDelivery.value)
                        {
                        	$("#header-cart .cart-footer .discount-hide").addClass("hide-discount");
                        }
                        
                        
                    }
                        var entries = data.CART_DATA.entries;

                        for (var i=0;i<entries.length;i++) {
                            var entry = entries[i];
                            var code = entry.product.code.replace("/", "_");
                            $(".cart-item-"+code).data("entrynumber", entry.entryNumber);
                            $(".cart-item-"+code +" .minus").data("entrynumber", entry.entryNumber);
                            $(".cart-item-"+code +" .plus").data("entrynumber", entry.entryNumber);
                            //$(".cart-item-"+code +" .minus").data("itemid", entry.entryNumber);
                            //$(".cart-item-"+code +" .plus").data("itemid", entry.entryNumber);
                        }

                        var qty = 0;
                        var text = "";
                        for (var x=0; x<entries.length;x++) {
                            qty += entries[x].quantity;
                        }

                        if (qty > 9) {
                            text =  "9+"
                        }
                        else {
                            text = qty;
                        }
                        $(".cart-btn .quantity.show").html("<p>"+text+"</p>");
                    }
                    else {
                        $(".cart-close").trigger("click");
                        $(".cart-btn .quantity.show").html("<p></p>");
                        $("header .header-main .header-right .cart-btn .quantity").removeClass("show");
                    }
                  startCartLoading();
                  openCart();
                  setTimeout(function(){
                	  $('.load-icon.load-bottom-wrap').removeClass('show');
                  }, 1500);

                }
            });


        });
        
        $(".displayWarrantyPopUpButton").click(function(){
        	var pcode= $(this).data("product")
        	 window.dataLayer = window.dataLayer || [];
             dataLayer.push({
                        'event': 'MiniCartLearnMore',
                        'sku':pcode
                    });
   	     var buildersDetailPage = "/getWarrantyPopUp";
        	//alert(pcode)
           $.ajax({
               type: 'GET',
               url: buildersDetailPage,
               cache: false,
               async: false,
               data: {
               	productCode:pcode
               },
               success: function(data) {

                //alert(data); 
                $("#warrantyPopUpId").html(data);
               // e.stopPropagation();
               // alert(pcode)
                $(".crs-care-popup-main-background-wrnty").data("mainproduct",pcode)
                //alert($(".crs-care-popup-main-background-wrnty").data("mainproduct"))
    			$(".crs-care-popup-main-background-wrnty").addClass("crs-corsair-care-popup-open");
   			$(".crs-corsair-care-popup-price-wrnty").removeClass("selected");
   			$(".crs-corsair-care-atc-btn-popup-wrnty").removeClass("option-selected");
   			
   			if($("#single_warr").val() != undefined &&  $("#single_warr").val() != ""){
   			     $(".crs-corsair-care-atc-btn-popup-wrnty").addClass("option-selected");
   				 $(".crs-corsair-care-atc-btn-popup-wrnty").prop("disabled", false );
   			}
   			else if ($(".crs-warrenty-atc-btn-wrnty").hasClass("crs-corsair-care-atc-selected-wrnty")){
   				var value = $(".crs-corsair-care-atc-selected-wrnty").attr("value");
   				
   				$(".crs-corsair-care-popup-price-wrnty"+"."+value).addClass("selected");
   				$(".crs-corsair-care-atc-btn-popup-wrnty").addClass("option-selected");
   				$(".crs-corsair-care-atc-btn-popup-wrnty").prop( "disabled", false );
   			}
   			else{
   				$(".crs-corsair-care-atc-btn-popup-wrnty").prop( "disabled", true );
   			}
   			$(".crs-corsair-care-atc-btn-popup-wrnty").attr('data-sku',$(".crs-care-popup-main-background-wrnty").data("mainproduct"));
            $(".crs-corsair-care-atc-btn-popup-wrnty").attr('data-warranty',$('.crs-corsair-care-warrenty-period-wrnty').text());
            $(".crs-corsair-care-atc-btn-popup-wrnty").attr('data-name',$('#crs-corsair-care-warrenty-period-wrnty-name').val());
               },
               error: function(e) {
                   console.log(e);
               }
           });
   })
   
        // Activate Incrementors
        $("#header-cart .cart-body ul li .product-info .incrementor a").on("click", function(evt){
            evt.preventDefault();
            var divOriginalPrice = event.target.parentElement.parentElement.parentElement.getElementsByClassName('item-price')[0].innerText
           
            var direction = $(this).data("direction");
            var directionValue = direction;
            var productCode = $(this).data("product").replace("/", "_");
            var warantyProduct = $(this).data("warantyproduct");
            if(warantyProduct != undefined && warantyProduct != ''){
            	var entryImageURL = event.target.parentElement.parentElement.parentElement.parentElement.getElementsByTagName('img')[0].src;
            	var entryNumber =  $(this).data("entrynumber");
                var currentValue = $(".cart-item-"+entryNumber + " .quantity-container .q-val").html(); 
            }else{
            	var entryImageURL = event.target.closest('div.minicart-bundle-container').getElementsByTagName('img')[0].src;
                 var entryNumber =  $(".cart-item-"+productCode).data("entrynumber");
                 var currentValue = $(".cart-item-"+productCode + " .quantity-container .q-val").html();
            }
           
            var id = $(this).data("itemid");
            var cartItem = "#header-cart .cart-body .cart-list #cart-item-" + id;
            var newQuantity = currentValue;

            quantityLoading(id);
            if(direction == "plus"){
            	var action = "plus";
                newQuantity ++;
            }else if(direction == "minus"){
                newQuantity --;
                var action = "minus";
            }
           
            var url = ACC.config.encodedContextPath + "/corsaircheckout/update";
	if (newQuantity > 0) {
            $.ajax({
                url: url,
                cache: false,
                type: 'POST',
                data:{"entryNumber": entryNumber, "action": action, quantity: newQuantity, CSRFToken: ACC.config.CSRFToken},
                success: function(data){
                	console.log(warantyProduct);
                	var cartItemChild ;
                	if(data.CART_MODIFICATION_DATA.statusMessage == "entryToUpdate_Null")
                    {
                        if(warantyProduct != undefined)
                        {
                          $(cartItem+" .product-info .remove-container .messageChild").html(data.CART_MODIFICATION_DATA.statusCode);
                          $(cartItem+" .product-info .remove-container .messageChild").addClass("on");
                        }
                        else
                        {
                         $(cartItem+" .product-info .remove-container .messageParent").html(data.CART_MODIFICATION_DATA.statusCode);
                         $(cartItem+" .product-info .remove-container .messageParent").addClass("on");
                         }
                         quantityLoadingComplete();
                    }
                    if(direction == "plus") {
                        trackAddToCartIncreaseProductQty(data, newQuantity, divOriginalPrice, entryImageURL)
                    }
                    
                    if (data.CART_MODIFICATION_DATA != null &&  data.CART_MODIFICATION_DATA.entry.totalPrice != null )
                    {
                    	if(warantyProduct != undefined)
                    	{
                    		$(cartItem+" .item-original-price-entryChild").html(data.CART_MODIFICATION_DATA.entry.totalPrice.formattedValue)
                    		
                    	}else{
                    		$(cartItem+" .item-original-price-entry").html(data.CART_MODIFICATION_DATA.entry.totalPrice.formattedValue);
                    		if(data.CART_MODIFICATION_DATA.entry.actualTotalEntryLevelPrice.value === data.CART_MODIFICATION_DATA.entry.totalPrice.value)
                            {
                            	$(cartItem+" .item-actual-total-entry-level-price").html("")
                            }
                            else
                            {
                            	$(cartItem+" .item-actual-total-entry-level-price").html(data.CART_MODIFICATION_DATA.entry.actualTotalEntryLevelPrice.formattedValue)
                            }
                    	}
                        
                    }
                    else{
                    	$(cartItem).detach();
                    }
                    if(data.ResponseCartdata != null && data.ResponseCartdata.CART_MODIFICATION_DATA.entry.totalPrice != null){
                    	var childEntryNumber = data.ResponseCartdata.CART_MODIFICATION_DATA.entry.entryNumber ;
                    	cartItemChild = "#header-cart .cart-body .cart-list #cart-item-" + childEntryNumber;
                    	$(cartItemChild+" .item-original-price-entryChild").html(data.ResponseCartdata.CART_MODIFICATION_DATA.entry.totalPrice.formattedValue);
                    	$(cartItemChild + " .quantity-container .q-val-wChild").html(data.ResponseCartdata.CART_MODIFICATION_DATA.entry.quantity);
                    	var price = data.ResponseCartdata.CART_DATA.subTotal.formattedValue;
                    	var priceHtml =  price;
                    }else{
                    	var price = data.CART_DATA.subTotal.formattedValue;
                    	var priceHtml = data.CART_DATA.actualSubTotalWODiscount.formattedValue; 
                    }
                    if(warantyProduct != undefined){
                    	$(cartItem + " .quantity-container .q-val-wChild").html(data.CART_MODIFICATION_DATA.entry.quantity);
                	}else{
                		$(cartItem + " .quantity-container .q-val-parent").html(data.CART_MODIFICATION_DATA.entry.quantity);
                	}
                    
                    $(".cart-subtotal .subtotal-amt").html(priceHtml);
                    $(".cart-subtotal .crs-estimated-discount-on-entry").html("-"+data.CART_DATA.totalEntryAndOrderLevelDiscount.formattedValue);
                    updateKlarnaWidget(price);

                    var store = data.CART_DATA.store;
                    if (data.CART_DATA.deliveryCost != null && store == "corsair-us")
                    {
                        $(".cart-subtotal .shipping-text").html(data.CART_DATA.deliveryCost.formattedValue);
                    }
                    else if(store != "corsair-us" && data.shippingEstimateTypeCheckValues == 'true' && data.CART_DATA.totalDeliveryWithFreeShipping.value > 0 && data.CART_DATA.totalDeliveryWithFreeShipping.value == data.CART_DATA.discountDelivery.value)
                    {
                    	$(".cart-subtotal .shipping-text").html(data.CART_DATA.totalDeliveryWithFreeShipping.formattedValue);
                    	$(".cart-subtotal .shipping-Discount-text").html("-"+data.CART_DATA.discountDelivery.formattedValue);
                    }

                    var callFrom = "incrementor";
                                       if(directionValue === "minus"){
                                       trackRemoveCartUsedGTMEvent(data,divOriginalPrice,entryImageURL,callFrom);
                                       }

                    var entries = data.CART_DATA.entries;
                    var qty = 0;
                    var text = "";
                    for (var x=0; x<entries.length;x++) {
                        qty += entries[x].quantity;
                    }

                    if (qty > 9) {
                        text =  "9+"
                    }
                    else {
                        text = qty;
                    }


                    if (data.CART_MODIFICATION_DATA.statusCode!="success"){
                    	if(warantyProduct != undefined){
                    		displayWarrantyMessage(data.CART_MODIFICATION_DATA.statusCode, id,cartItem);
                    	}else{
                    		displayMessage(data.CART_MODIFICATION_DATA.statusCode, id,cartItem);
                    	}
                    	
                    }
                    else{
                    	if(warantyProduct != undefined){
                    		removeWarrantyMessage(id,cartItem);
                    	}else{
                    		removeMessage(id,cartItem);	
                    	}
                    	
                    }
                        
                    	if(cartItemChild != undefined && cartItemChild != ''){
                    		if (data.ResponseCartdata.CART_MODIFICATION_DATA.statusCode!="success"){
                    			displayWarrantyMessage(data.ResponseCartdata.CART_MODIFICATION_DATA.statusCode, id,cartItemChild);
                            }
                            else{
                            	removeWarrantyMessage(id,cartItemChild);
                            }
                    	}

                    $(".cart-btn .quantity.show").html("<p>"+text+"</p>");
                    quantityLoadingComplete();
                    if(data.ResponseCartdata != null && data.ResponseCartdata.CART_MODIFICATION_DATA.quantityAdded != undefined && data.ResponseCartdata.CART_MODIFICATION_DATA.quantityAdded == -1){
                		startCartLoading();
                        openCart();
                        setTimeout(function(){
                      	  $('.load-icon.load-bottom-wrap').removeClass('show');
                        }, 1500);
                	}else{
                		updateWarnatyQty();
                	}
                }
            });
 }
            else {
                quantityLoadingComplete();
            }
	    
        });

        // Display Footer
        $("#header-cart .cart-footer").addClass("showFlex");

        calculateCartTotal();
    }

    function quantityLoading(id){
        var cartItem = "#header-cart .cart-body .cart-list #cart-item-" + id;
        $( cartItem + " .product-info .loading-container").addClass("on");
    }

    function quantityLoadingComplete(){
        $( "#header-cart .cart-body ul li .product-info .loading-container").removeClass("on");
        startCartLoading();
        openCart();
        
    }

    function displayMessage(mssg, id,cartItem){
        $(cartItem+" .product-info .remove-container .messageParent").html(mssg);
        $(cartItem+" .product-info .remove-container .messageParent").addClass("on");
        $(cartItem+"  .incrementor .plus-parent").css("pointer-events","none");
    }

    function removeMessage(id,cartItem){
        $(cartItem+" .product-info .remove-container .messageParent").html('');
        $(cartItem+" .product-info .remove-container .messageParent").removeClass("on");
        $(cartItem+"  .incrementor .plus-parent").css("pointer-events","all");
    }
    
    function displayWarrantyMessage(mssg, id,cartItem){
        $(cartItem+" .product-info .remove-container .messageChild").html(mssg);
        $(cartItem+" .product-info .remove-container .messageChild").addClass("on");
        $(cartItem+"  .incrementor .plus").css("pointer-events","none");
    }

    function removeWarrantyMessage(id,cartItem){
        $(cartItem+" .product-info .remove-container .messageChild").html('');
        $(cartItem+" .product-info .remove-container .messageChild").removeClass("on");
        $(cartItem+"  .incrementor .plus").css("pointer-events","all");
    }

    function calculateCartTotal(){

    }

    function cartUnpopulate(){
        // Unpopulate (visual) cart when cart window is closed.
        var parent = $("#header-cart .cart-body .cart-list");

        parent.html('');

        $("#header-cart .cart-footer").removeClass("showFlex");
    }

    function updatePotentialPromoMsg(data){
    var promotionList = data.potential_promo;
    if(promotionList !=null && promotionList.length > 0){
                  for(i=0;i<promotionList.length;i++)
                  {
                  var promotionData = promotionList[i];
                  $("#header-cart .cart-footer .potential-message").html(promotionData.potential_msg);
                  }
                  }
    }
    return _this;
}

