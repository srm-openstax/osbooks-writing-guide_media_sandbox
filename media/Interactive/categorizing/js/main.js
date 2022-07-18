/*******************************************************/
$(document).ready(function () {

	var setting;
	var rightFeedback, wrongFeedback;
	var arrAllDraggableitem = null;
	var staticImagePath="images/";
	var prevBtn = null;
	var totalDropedItem =0;
	let enterCounter = { };
	const isMobile = detectMob(); 
	/* detect mobile device start*/
	function detectMob() {
		const toMatch = [
			/Android/i,
			/webOS/i,
			/iPhone/i,
			/iPad/i,
			/iPod/i,
			/BlackBerry/i,
			/Windows Phone/i
		];

		return toMatch.some((toMatchItem) => {
			return navigator.userAgent.match(toMatchItem);
		});
		/* detect mobile device ends */
	}
	
	$(document).keyup(function(event) {
		//console.log("--------------");
		//get the id of element on which enter key pressed
		const elemId = $(prevBtn).attr('id');

		event.preventDefault();
		var keycode = (event.keyCode ? event.keyCode : event.which);

		//escape key for deselect 
		if(keycode == 27){
			//prevBtn.removeClass("selected");
			prevBtn = null;
			$(curDiv).find(".clickable-item").removeClass("selected");
			curDiv = null;
			$(".selected").removeClass("selected");
			$(".matching-item").blur();
			$(".clickable-item").blur();
		}

		//if key for enter event
		if (keycode == 13) {
			//get the count of enter pressed on element
			const enterCount = enterCounter[elemId];
			//if enter has pressed two times
			console.log(enterCount, " enter count ", enterCounter);
			if (enterCount > 2) {
				var same = true;
				try{
					same = prevBtn == $(this);
				}catch(err){
					console.log(err);
					same=true;
				}
				if(!same){
					if(prevBtn){
						if($(prevBtn).parent().parent().parent().hasClass("dragableItemContainer")){
							//console.log("SAME......");
						}else{
							totalDropedItem--;
							console.log("BACK.....", totalDropedItem, arrAllDraggableitem.length);
							
							var idd =  prevBtn.attr("id").replace("draggableitem_", "");
							var parent = $(".draggableitemWraper_"+idd);
							parent.append(prevBtn.parent());
							$(prevBtn).removeClass("correct").removeClass("incorrect");
	
							if (totalDropedItem != arrAllDraggableitem.length) {
								$('.submit_btn').prop("disabled", true);
							}
							//$(prevBtn).parent().appendTo($(".dragableItemContainer"));                    
							/* var iid = $(prevBtn).attr("data-placed");*/
							return;
						}
					}
				}
	
				console.log("Normal click....");
				prevBtn = $(this);
			}
			enterCounter[elemId] += 1;
		}
		console.log(keycode, " ************ ");
	}); 

	$("#tempDiv").load("data/data.xml", function (response, status, xhr) {
		if (status != "error") {

			$("#tempSetting").load("data/setting.xml", function (response, status, xhr) {
				if (status != "error") {
					/*Hiding the loading image*/
					$("#loadingImg").hide();
					/*End*/
					displayStaticContent();
					//$('.container').focus();
					//alert('ok');
					//specifyForMobile();
				}
			});
		}
	});

	/*Showing the loading image*/
	$("#loadingImg").show();



	// function specifyForMobile() {
		
	// 	if (isMobile) {
	// 		$(".dragableItemContainer").addClass("mobile-device");
	// 		var top = 0;
	// 		var left = 0;
	// 		var drawCounter = 0;

	// 		$(".container").find(".mobile-device").find(".draggableitemWraper").each(function (index, el) {
	// 			drawCounter = drawCounter + .3;
	// 			top = top + drawCounter;
	// 			left = left + drawCounter;
	// 			$(el).css({
	// 				"position": "absolute",
	// 				"top": top + "px",
	// 				"left": left + "px"
	// 			});
	// 		})

	// 		//$(".container .draggableitem").prop('disabled', true);
	// 		$(".container .draggableitem").last().removeAttr('disabled');
	// 	} else {
	// 		$(".dragableItemContainer").removeClass("mobile-device");
	// 	}
	// 	// $(el).find(".draggableitem").prop('disabled',true);

	// }

	function displayStaticContent() {
		function isMacintosh() {
			return navigator.platform.indexOf('Mac') > -1
		}
		var isMac = isMacintosh();
		if (isMac) {
			$('.content').addClass('contentMac');
		}

		var xmlDoc = $.parseXML($("#tempDiv").html());
		var xml = $(xmlDoc);
		//console.log(xml.find("content"));
		pageLength = xml.find("content").length;
		//objAccessibility=new Accessibility(pageLength); // call Accessibility funcion from accessibilityJs
		var settingDoc = $.parseXML($("#tempSetting").html());
		setting = $(settingDoc);

		//focus setting
		var focusColor = setting.find("focuscolor").attr('color');
		$('body').append('<style>input[type=button]:focus{outline: 1px solid ' + focusColor + '; border: 2px solid transparent;} button:focus{outline: 1px solid ' + focusColor + '; border: 2px solid transparent;}</style>');

		// title style from from setting.xml
		var fontfamily = setting.find("title").attr('fontfamily');
		var color = setting.find("title").attr('color');
		var backgroundcolor = setting.find("title").attr('backgroundcolor');

		// category title
		var categorytitleFontfamily = setting.find("categorytitle").attr('fontfamily');
		var categorytitleColor = setting.find("categorytitle").attr('color');
		var categorytitleBackgroundcolor = setting.find("categorytitle").attr('backgroundcolor');

		var arrSettingStyleItem = setting.find("styleitem")
		// category title
		var draggableitemFontfamily = setting.find("draggableitem").attr('fontfamily');
		var draggableitemColor = setting.find("draggableitem").attr('color');
		var draggableitemBackgroundcolor = setting.find("draggableitem").attr('backgroundcolor');




		// title style from from setting.xml
		var instNormFontFamily = setting.find("instructionnorm").attr('fontfamily');
		var instNormColor = setting.find("instructionnorm").attr('color');
		var instNormBackgroundcolor = setting.find("instructionnorm").attr('backgroundcolor');
		rightFeedback = xml.find("feedback").find("rightans").html();
		wrongFeedback = xml.find("feedback").find("wrongans").html();

		var title = xml.find("title").text();
		var instructionNorm = xml.find("instruction").find("instructionnorm").html();
		//console.log("dgdfgdfgfd=", title, instructionNorm);

		var arrAllCategory = xml.find("category").find("categorytitle");
		var arrAllDraggableitem1 = xml.find("draggableitem").find("item");
		arrAllDraggableitem = shuffleArray(arrAllDraggableitem1);

		$("#title").text(title).css({
			"font-family": fontfamily,
			"color": color,
			"backgroundColor": backgroundcolor
		});
		$("#instructionnorm").html(instructionNorm).css({
			"font-family": instNormFontFamily,
			"color": instNormColor,
			"backgroundColor": instNormBackgroundcolor
		});

		/* generating category view */
		arrAllCategory.each(function (index, el) {
			$(".categoryContainer").append('<div class="category category-' + arrAllCategory.length + '"><div class="categoryTitleCnt categoryTitleCnt_' + index + '"><button aria-label="Category: '+ $(el).html()+'" cat=' + $(el).attr("cat") + ' class="categoryTitle categoryTitle_' + index + '">' + $(el).html() + '</button></div><div class="hidden categoryDroppableCnt categoryDroppableCnt_' + index + '"></div></div><hr class="catHr"/>');
		});

		$('.categoryTitle').css({
			"font-family": categorytitleFontfamily,
			"color": categorytitleColor,
			"backgroundColor": categorytitleBackgroundcolor
		}).off().on("click", selectCategory);

		/* generating draggable items view */
		arrAllDraggableitem.each(function (index, el) {
			var plain = $(el).html().replace("<i>","").replace("</i>","");
			$(".card-wrap").append('<div class="draggableitemWraper draggableitemWraper_' + index + '"><div class="draggableitemCnt draggableitemCnt_' + index + '"><button aria-label="Item to categorize: '+ plain+'"  cat=' + $(el).attr("cat") + ' id="draggableitem_' + index + '" class="draggableitem draggableitem_' + index + '">' + $(el).html() + '</button></div></div>');
			$('.draggableitemWraper_'+ index).css("left", (index*15)+"px");
			enterCounter[`draggableitemWraper_${index}`] = 1;
			
		});
		//console.log(enterCounter);

		$('.draggableitem').css({
			"font-family": draggableitemFontfamily,
			"color": draggableitemColor,
			"backgroundColor": draggableitemBackgroundcolor
		}).off().on("click", selectDraggable);

		//console.log("------------------------");

		$(".draggableitemCnt").click(function(e) {

			var curId = $(e.target).attr("id");
			console.log("DDDD: ", curId);
			var gid = $(".dragableItemContainer").attr("curitem");

			//prevBtn = $(this);
			if(curId == gid){
				$(this).blur();
				$(".dragableItemContainer").attr("curitem", null);
				return;
			}else{
				$(".dragableItemContainer").attr("curitem", curId);
			}
			
			//console.log($(this));
            var same = true;
			console.log(prevBtn, curId);
            try{
                same = prevBtn == $(e.target);
            }catch(err){
                console.log(err);
                same=true;
            }
            if(!same){
                if(prevBtn){
                    if($(prevBtn).parent().parent().parent().hasClass("dragableItemContainer")){
                        //console.log("SAME......");
                    }else{
						totalDropedItem--;
                        console.log("BACK.....", totalDropedItem, arrAllDraggableitem.length);
						console.log("PREV: ", $(prevBtn));
						if($(prevBtn).attr("id").length){
							var idd =  $(prevBtn).attr("id").replace("draggableitem_", "");
						}
						var parent = $(".draggableitemWraper_"+idd);

						parent.append(prevBtn.parent());
						console.log(prevBtn.parent());
						curDiv = null;
						prevBtn= null;
						$(parent).removeClass("mouse-none");
						$(".selected").removeClass("selected").blur();
						$(prevBtn).removeClass("correct").removeClass("incorrect").removeClass("mouse-none");

						if (totalDropedItem != arrAllDraggableitem.length) {
							$('.submit_btn').prop("disabled", true);
						}
                        //$(prevBtn).parent().appendTo($(".dragableItemContainer"));                    
                        /* var iid = $(prevBtn).attr("data-placed");*/
                        return;
                    }
                }
            }
            console.log("Normal click....");
            prevBtn =$(e.target);
        })

		arrSettingStyleItem.each(function(ind,el){
			//console.log("-=-=-=-", $(el).attr("txt"));
			if(ind==0)
			{
			$(".settinToolsContainer .toolsCnt").append('<div class="toolContainer_'+ind+'"><button aria-label="Color Scheme" bg="'+$(el).attr("background")+'" fg="'+$(el).attr("foreground")+'" class="tool tool_'+ind+'">button</button><p l lang="en" class="toolTxt toolTxt_'+ind+'">'+$(el).attr("txt")+'</p></div>');
			}else
			{
				$(".settinToolsContainer .toolsCnt").append('<button aria-pressed= "false" aria-label="' +$(el).attr("txt")+ '" role="settings tool" class="toolContainer toolContainer_'+ind+'" colors="'+$(el).attr("colors")+'"><img alt="' +$(el).attr("txt")+ '" src="'+staticImagePath+$(el).attr("picname")+'" class="tool tool_'+ind+'"/><span l lang="en" class="toolTxt toolTxt_'+ind+'">'+$(el).attr("txt")+'</span></button>');
			}

			if(ind==1){
				var colors=$(el).attr("colors");
				color1=colors.split(",")[0];
				color2=colors.split(",")[1];
				color3=colors.split(",")[2];
				$('.settinToolsContainer').css({backgroundColor:color3});
			}

		});


		$('.settinToolsContainer .toolContainer_0').find('.toolTxt').css({"font-family":$(arrSettingStyleItem[0]).attr('fontfamily'),"color":$(arrSettingStyleItem[0]).attr('color')});

		$('.settinToolsContainer .toolContainer').each(function(index,el){
			var arr = $(arrSettingStyleItem[index]).attr('fontfamily');
			$(el).find('.toolTxt').css({"font-family":$(arrSettingStyleItem[index+1]).attr('fontfamily'),"color":$(arrSettingStyleItem[index+1]).attr('tooltextcolor')});
		});

		//displayDynContent(counter);
		$('.settinToolsContainer .toolContainer').eq(0).attr("aria-pressed", "true");
		$('.settinToolsContainer .toolContainer').off().on("click", changeBgFgOfTemplate);

		function shuffleArray(a) {
			for (let i = a.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[a[i], a[j]] = [a[j], a[i]];
			}
			return a;
		}
		function changeBgFgOfTemplate() {
			//alert("ok");
			$('.settinToolsContainer .toolContainer').eq(0).attr("aria-pressed", "false");
			$(this).attr("aria-pressed", "true");
			color1=$(this).attr('colors').split(",")[0];
			color2=$(this).attr('colors').split(",")[1];
			color3=$(this).attr('colors').split(",")[2];
			
			$('#title').css({
				color: color2
			});
			$('#instructionnorm').css({
				color: color2
			});

			$('.leftContentTitle').css({
				color: color2
			});
			$('.leftSubContainer').css({
				color: color2
			});
			
			$(".draggableitem").css("background", color1);
			$(".draggableitem").css("color",  color2);

			$(".categoryTitle").css("background",color2);
			$(".categoryTitle").css("color",  color1);

			$('.submit_btn,.tryagain_btn,.reset_btn').find("rect").attr('fill', color1);
			$('.submit_btn,.tryagain_btn,.reset_btn').find("rect").attr('fill', color1);
			
				$('.settinToolsContainer').css({backgroundColor:color3});
				$('.setting').find("path").attr('fill',color1);

		}

	}

	function selectDraggable() {
		/* var curId = $(this).attr("id");
		var gid = $(".dragableItemContainer").attr("curitem");

		prevBtn = $(this);
		if(curId == gid){
			$(this).blur();
			$(".dragableItemContainer").attr("curitem", null);
			return;
		}
		$(".dragableItemContainer").attr("curitem", curId);
		console.log(curId); */
	}

	function selectCategory() {
		var id = $(".dragableItemContainer").attr("curitem");
		if (id) {
			var index = id.split("_")[1];
			var categoryDroppableCnt = $(this).parents(".category").find(".categoryDroppableCnt");
			isMobile && $(".draggableitemCnt_" + index).find(".draggableitem").removeAttr('disabled');
			
			if($(categoryDroppableCnt).children().length ==6){
				curDiv = null;
				prevBtn= null;
				return;
			}

			$(".draggableitemCnt_" + index).appendTo(categoryDroppableCnt);
			$(".draggableitemWraper_"+ index).addClass("mouse-none");
			console.log($(categoryDroppableCnt).children().length,"=====")

			enterCounter["draggableitemCnt_" + index] = 1;
			$(".dragableItemContainer").removeAttr("curitem");
			
			isMobile && $(".container .draggableitem").last().removeAttr('disabled');
			curDiv = null;
			prevBtn= null;
			//alert("ok");
			totalDropedItem = 0;
			$('.category').each(function (index, el) {
				var dropedItemLenth = $(el).find(".categoryDroppableCnt").children().length;
				//console.log("cccccc",dropedItemLenth);
				
				totalDropedItem = totalDropedItem + dropedItemLenth

				var catTitle = $(el).find(".categoryTitle").attr("cat");
				$(el).find(".categoryDroppableCnt").children().each(function (ind, ell) {
					$(ell).find(".draggableitem").removeClass("correct").removeClass("incorrect");
					if ($(ell).find(".draggableitem").attr("cat") == catTitle) {
						$(ell).find(".draggableitem").addClass("correct");
					} else {
						$(ell).find(".draggableitem").addClass("incorrect");
					}
				});

			})
			console.log('totalDropedItem=', totalDropedItem);
			if (totalDropedItem == arrAllDraggableitem.length) {
				//$('.nav-container').show()
				$('.submit_btn').prop("disabled", false);
				$('.submit_btn').removeClass("submit-hide");
				$('.submit_btn').off().on("click", submitListener);
			}
		}
	}

	function submitListener() {
		var correctCounter = 0;
		$(".categoryTitle").addClass("inactive");
		$(".draggableitem").addClass("inactive");
		$(".card-wrap").addClass("hidden-feed");
		$('.submit_btn').addClass("submit-hide");
		var feedback = rightFeedback;
		$('.category').each(function (index, el) {
			var catTitle = $(el).find(".categoryTitle").attr("cat");
			var rightCat="right-cat";
			
			$(el).find(".categoryDroppableCnt").children().each(function (ind, ell) {
				if ($(ell).find(".draggableitem").hasClass("correct")) {
					$(ell).find(".draggableitem").css("border", "2px solid #63a524");
					correctCounter++;
				} else {
					$(ell).find(".draggableitem").css("border", "2px solid #c22032");
					rightCat = "wrong-cat";
					feedback = wrongFeedback;
				}
				
			});
			console.log("FINAL CAT: ", rightCat);
			$(".categoryTitleCnt_"+index).addClass(rightCat);
		});
		//console.log('correctCounter=',correctCounter);
		$("header").addClass("pad-0");
		$(".feedback").html(feedback).show();
		$(this).addClass("invisible");
		$('.categoryContainer').addClass("submited");
		//$('.nav-container').removeClass("invisible");
		if (correctCounter == arrAllDraggableitem.length) { 			
			$('.reset_btn').removeClass("invisible").focus().off().on("click", resetCategory).prop("disabled", false);
		} else {
			$('.tryagain_btn').removeClass("invisible").focus().off().on("click", resetCategory).prop("disabled", false);
		}
	}

	function resetCategory() {
		$(".categoryTitle").removeClass("inactive");
		$(".draggableitem").removeClass("inactive");
		$(".right-cat").removeClass("right-cat");
		$(".wrong-cat").removeClass("wrong-cat");
		$(".draggableitem").removeClass("inactive");
		$(".feedback").hide();
		$("header").removeClass("pad-0");
		$(".mouse-none").removeClass("mouse-none");
		$(".card-wrap").removeClass("hidden-feed");
		arrAllDraggableitem.each(function (index, el) {
			$(".categoryContainer").find(".draggableitemCnt_" + index).appendTo(".draggableitemWraper_" + index);
		});
		$('.categoryContainer').removeClass("submited");
		$(".draggableitem").css("border", "0px solid green").removeClass("correct incorrect");
		if (isMobile) {
			//$(".container .draggableitem").prop('disabled', true);
			$(".container .draggableitem").last().removeAttr('disabled');
		}
		$('.reset_btn').addClass("invisible").prop("disabled", true);
		$('.tryagain_btn').addClass("invisible").prop("disabled", true);
		$('.submit_btn').removeClass("invisible").prop("disabled", true);
	}


	$('.setting').off().on('click', settingListener);

	function settingListener() {
		$(".settinToolsContainer").css("zIndex","3");
		$(".settingContainer").css("zIndex","2");
		$(".help-popup").css("zIndex","1");
		$('.settinToolsContainer').addClass('showhide');
		$('.settinToolsContainer .close').off().on('click', closeSetting);

	}

	function closeSetting() {
		$('.settinToolsContainer').removeClass('showhide');
		$(".settinToolsContainer").css("zIndex","unset");
	}

});

$(document).ready(function(){

	if(window.innerWidth<529){
		$(".bottom-btn").html("REVIEW YOUR<br>SORTED ANSWERS");
	}
  $(".showText").click(function(){
    $(".help-popup").show();
	$(".settinToolsContainer").css("zIndex","2");
	$(".settingContainer").css("zIndex","3");
	$(".help-popup").css("zIndex","4");
  });
  $(".popup-close").click(function(){
    $(".help-popup").hide();
	//$(".settingContainer").css("zIndex","unset");
  });
  $(".bottom-btn").on("click", function(){
	console.log("-----------------");
	
	if($(".categoryDroppableCnt").hasClass("hidden")){
		$(".categoryDroppableCnt").removeClass("hidden");		
		$(this).html("REVIEW YOUR<br>SORTED ANSWERS");
	}else{
		$(".categoryDroppableCnt").addClass("hidden");		
		$(this).html("COLLAPSE<br>CATEGORIES");
	}
	if($(".categoryDroppableCnt").hasClass("hidden2")){
		$(".categoryDroppableCnt").removeClass("hidden2");		
		$(this).html("REVIEW YOUR<br>SORTED ANSWERS");
	}else{
		$(".categoryDroppableCnt").addClass("hidden2");		
		$(this).html("COLLAPSE<br>CATEGORIES");
	}	
  })
});

