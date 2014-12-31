$(document).ready(function() {

	// Hide all food resource tables initially.
	$(".admin-food-resource-type").hide(); 
	$(".admin-food-resource").hide();

	// Also hide pending food resource tables. 
	$(".admin-food-resource-type-pending").hide(); 
	$(".admin-food-resource-pending").hide(); 

	// Expand all resources on admin resources page.
	// Triggered when "Expand All" button pressed on admin resources page.
	$("#expand-all-resources-button").click(function() {
		showAll("-table", "expand-food-resource-type");
		showAll("-table", "expand-food-resource");
	}); 

	// Collapse all resources on admin resources page.
	// Triggered when "Collapse All" button pressed on admin resources page.
	$("#collapse-all-resources-button").click(function() {
		hideAll("-table", "expand-food-resource-type");
		hideAll("-table", "expand-food-resource");
	}); 

	setColorBoxColor(); 

	setPinImageSize();

	// Remove a food resource without reloading page.
	removeFoodResource();

	// Remove a food resource type without reloading page.
	removeFoodResourceType(); 	

	// If an "Expand" button is pressed, either show or hide the associated
	// food resource table.
	toggleAdminFoodResourceTypeVisibility(); 

	// If an "Expand" button is pressed, either show or hide the associated
	// food resource information. 
	toggleAdminFoodResourceVisibility();

	$(".expand-food-resource-type-pending").click(function() {
		var id = $(this).attr('id');  
		var prefix = "food-resource-type-expand-pending-"; 
		var start_index = prefix.length; 
		var resource_type = id.substring(start_index); 
		var table_to_expand = resource_type + "-table-pending"; 		
		toggleExpansion(table_to_expand, "expand-food-resource-type-pending"); 
	}) 

	$(".expand-food-resource-pending").click(function() {
		var id = $(this).attr('id');  
		var prefix = "food-resource-expand-pending-"; 
		var start_index = prefix.length; 
		var resource_id = id.substring(start_index); 
		var table_to_expand = "food-resource-" + resource_id + "-table-pending"; 		
		toggleExpansion(table_to_expand, "expand-food-resource-pending"); 
	}) 

    $(".start-edit").click(function() {
		CKEDITOR.disableAutoInline = true;
    	var editor1 = CKEDITOR.inline("editor1", {
    		startupFocus: true,
    		autoGrow_onStartup: true
    	});
    	$(".start-edit").hide();
    	$(".end-edit").show();
    	$("#editor1").attr("contenteditable","true");
    });

    $(".end-edit").click(function() {
    	if ( editor1 ){
    		var json_data = {
    			page_name: $(".end-edit").attr("id"),
    			edit_data: CKEDITOR.instances.editor1.getData()
    		};
    		$.post(url = $SCRIPT_ROOT + '/_edit', data = json_data);
			CKEDITOR.instances.editor1.destroy();
		}
    	$(".end-edit").hide();
    	$(".start-edit").show();
    	$("#editor1").attr("contenteditable","false");
  	});

	// Hide all open-and-close and time selectors iniially.
	// Used on "Add New / Edit Resource" page.
	$(".time-pickers").hide(); 
	$(".open-or-closed-container").hide(); 
	toggleAreHoursAvailable();
	toggleOpenOrClosed(); 

	// Toggle visibility of time selectors.
	// Used on "Add New / Edit Resource" page.
	$('select[id^="is_open"]').on('change', function (e) {
	    var optionSelected = $("option:selected", this);
	    var valueSelected = this.value;
	    var divToToggle = $(this).parent().parent().parent().parent()
	    	.find(".time-pickers"); 
	    if (valueSelected == "open") {
	    	divToToggle.show(); 
	    } else if (valueSelected == "closed") {
	    	divToToggle.hide(); 
	    }
	});

	// Toggle visibility of open-and-close selectors. 
	// Used on "Add New / Edit Resource" page.
	$('select#are_hours_available').on('change', function (e) {
	    toggleAreHoursAvailable();
	});	
});

function toggleAreHoursAvailable() {
	var element = $('select#are_hours_available')[0];
	if (element) {
		var optionSelected = $("option:selected", element);
	    var valueSelected = element.value;
	    if (valueSelected == "yes") {
	    	$(".open-or-closed-container").show();
	    } else if (valueSelected == "no") {
	    	$(".open-or-closed-container").hide();
	    }
	}
}

function toggleOpenOrClosed() {
	$('select[id^="is_open"]').each(function(index) {
		var optionSelected = $("option:selected", this);
	    var valueSelected = this.value;
	    var divToToggle = $(this).parent().parent().parent().parent()
	    	.find(".time-pickers"); 
	    if (valueSelected == "open") {
	    	divToToggle.show(); 
	    } else if (valueSelected == "closed") {
	    	divToToggle.hide(); 
	    }
	})
}

/**
@function toggleExpansion Expand or collapse the given ID if it is currently
hidden or visible, respectively.
@param {String} idToToggle - id of the element that should be hidden or shown. 
@param {String} classToToggleExpandSymbol - class of the element whose expand
symbol should be toggled (e.g., "+" to "-" if expanding an element).
*/
function toggleExpansion(idToToggle, classToToggleExpandSymbol) {
	if ($("#"+idToToggle).is(":hidden")) {
		show(idToToggle, classToToggleExpandSymbol);
	} else {
		hide(idToToggle, classToToggleExpandSymbol);
	}
}

/**
@function hide Collapse the element associated with the given ID.
@param {String} idToHide - id of the element that should be hidden. 
@param {String} classToToggleExpandSymbol - class of the element whose expand
symbol should be toggled (e.g., "+" to "-" if expanding an element).
*/
function hide(idToHide, classToToggleExpandSymbol) {
	$("#"+idToHide).slideUp("medium", function() {
		$(this).hide(); 
		$(this).parent().find("." + classToToggleExpandSymbol).html("+"); 
	});
}

/**
@function show Expand the element associated with the given ID.
@param {String} idToShow - id of the element that should be shown. 
@param {String} classToToggleExpandSymbol - class of the element whose expand
symbol should be toggled (e.g., "+" to "-" if expanding an element).
*/
function show(idToShow, classToToggleExpandSymbol) {
	$("#"+idToShow).slideDown("medium", function() {
		$(this).show(); 
		$(this).parent().find("." + classToToggleExpandSymbol).html("-"); 
	});
}

/**
@function hideAll Collapse all elements with the given ID suffix.
@param {String} idToHide - ID suffix of the elements that should be hidden. 
@param {String} classToToggleExpandSymbol - class of the element whose expand
symbol should be toggled (e.g., "+" to "-" if expanding an element).
*/
function hideAll(idToHide, classToToggleExpandSymbol) {
	$("[id$='" + idToHide + "']").each(function() {
		var id = $(this).attr("id");
		hide(id, classToToggleExpandSymbol);
	}); 
}

/**
@function showAll Expand all elements with the given ID suffix.
@param {String} idToShow - ID suffix of the elements that should be shown. 
@param {String} classToToggleExpandSymbol - class of the element whose expand
symbol should be toggled (e.g., "+" to "-" if expanding an element).
*/
function showAll(idToShow, classToToggleExpandSymbol) {
	$("[id$='" + idToShow + "']").each(function() {
		var id = $(this).attr("id");
		show(id, classToToggleExpandSymbol);
	});
}

// If an "Expand" button is pressed, either show or hide the associated
// food resource table.
function toggleAdminFoodResourceTypeVisibility() {
	toggleTable("expand-food-resource-type", 
		"food-resource-type-expand-", "-food-resource-type-table", 
		"expand-food-resource-type");
}

// If an "Expand" button is pressed, either show or hide the associated
// food resource information.
function toggleAdminFoodResourceVisibility() {
	toggleTable("expand-food-resource", 
		"food-resource-expand-", "-food-resource-table", 
		"expand-food-resource");
}

function toggleTable(classThatIsClickedToTriggerExpansion, 
	idPrefixThatIsClicked, tableIdToExpandSuffix, expandSymbolClass) {
		$("." + classThatIsClickedToTriggerExpansion).click(function() {
		var id = $(this).attr('id');  
		var prefix = idPrefixThatIsClicked; 
		var start_index = prefix.length; 
		var resource_type = id.substring(start_index); 
		var table_to_expand = resource_type + tableIdToExpandSuffix; 		
		toggleExpansion(table_to_expand, expandSymbolClass); 
	}) 
}

function setColorBoxColor() {
	$(".color-box").each(function(index) {
		var id = $(this).attr('id');  
		var prefix = "color-box-"
		var start_index = prefix.length;
		var color_hex = id.substring(start_index);
		$(this).css('background', "#" + color_hex);
	});
}

function setPinImageSize() {
	$(".pin-image").each(function(index) {
		$(this).find("img").css('width', "20px");
		$(this).find("img").css('height', "auto");
	});
}

function removeFoodResourceType() {
	$("[id$='-remove-food-resource-type']").click(function() {
		var id = $(this).attr('id');
		var dashIndex = id.indexOf("-"); 
		var foodResourceTypeId = id.substring(0, dashIndex); 
		$.getJSON($SCRIPT_ROOT + '/_remove_food_resource_type', {
        		id: foodResourceTypeId
        	},
        	function(data) {
    			// Hide corresponding approved resource table.
        		hide(foodResourceTypeId + "-food-resource-table");
        		hide("food-resource-type-" + foodResourceTypeId);
        	});  
	});	
}

function removeFoodResource() {
	$("[id$='remove']").click(function() {
		var id = $(this).attr('id');
		var dashIndex = id.indexOf("-"); 
		var foodResourceId = id.substring(0, dashIndex); 
		$.getJSON($SCRIPT_ROOT + '/_remove', {
        		id: foodResourceId
        	},
        	function(data) {
        		if (data["is_approved"]) {
        			// Hide corresponding approved resource table.
	        		hide("food-resource-" + foodResourceId);
	        		hide("food-resource-" + foodResourceId + "-table");
	        		
	        		// Reduce total number of food resources.
	        		var currentNumResources = 
	        			$("#all-num-resources").html() - 1;
	        		$("#all-num-resources").html(currentNumResources);

	        		// Reduce individual number of food resources.
	        		var individualNumResources = $("#food-resource-" 
	        			+ foodResourceId).parent().parent().parent()
	        			.find(".total-num-resources").html();
	        		individualNumResources--; 
	        		$("#food-resource-" + foodResourceId).parent().parent()
	        			.parent().find(".total-num-resources")
	        			.html(individualNumResources); 

	        		if (individualNumResources == 0) {
	        			var header = $("#food-resource-" + foodResourceId)
	        				.parent().parent().parent()
	        				.find(".admin-food-resource-type-header");
	        			var headerIndex = header.attr("id").indexOf("-header"); 
	        			var foodResourceType = header.attr("id")
	        				.substring(0, headerIndex);
	        			var html = getNoResourcesHtml(foodResourceType);
	        			header.after(html);
        			}
        		}
        		else {
        			// Hide corresponding pending resource table.
        			hide("food-resource-pending-" + foodResourceId);
	        		hide("food-resource-" + foodResourceId + "-table-pending");
        		}
        	});  
	});	
}

function setTotalNumResources(num) {
	$("#all-num-resources").html(num);
}

function getIndividualNumResources(resourceType) {
	return $("#" + resourceType + "-num-resources").html();
}

function setIndividualNumResources(num, resourceType) {
	$("#" + resourceType + "-num-resources").html(num);
}

function clearTablesOfFoodResources() {
	$(".admin-food-resource-type").remove(); 
	$(".expand-food-resource-type").html("+");
}

function getNoResourcesHtml(resourceInfoId) {
	var html = 
	'<div id="' + resourceInfoId + '-food-resource-type-table" class="admin-food-resource-type">' +
		'<div class="no-resources-message">None to display.</div>' +
	'</div>';
	return html;
}

function getResourcesHtml(resourceInfoId, resourceInfoLowercaseNamePlural, 
	resourcesArray, daysOfWeek) {
	var html = 
	'<div id="' + resourceInfoId + '-food-resource-type-table" ' + 
		'class="admin-food-resource-type">';

	// Iterate through all food resources in the array.
	for (var i = 0; i < resourcesArray.length; i++) {
		var resource = resourcesArray[i]; 
		html += 
		'<div class="resource">' +

			'<!-- Resource header -->' + 
			'<div class= "row" id="food-resource-' + resource["id"] + '">' + 
				'<div class="small-1 columns expand-food-resource" ' + 
					'id="food-resource-expand-' + resource["id"] + '">' + 
					'+' + 
				'</div>' + 
				'<div class="small-7 columns">' + 
					resource["name"] + 
				'</div>' + 
				'<div class="small-2 columns">' + 
					'<a href="/edit/' + resource["id"] + '" ' + 
						'class="food-resource-update-button">Edit</a>' + 
				'</div>' + 
				'<div class="small-2 columns">' + 
					'<div id="' + resource["id"] + '-remove" ' + 
						'class="food-resource-update-button">Remove</div>' + 
					'</div>' + 
			'</div>' + 
			'<!-- Resource content -->' +  
			'<div class="row admin-food-resource" id="' + resource["id"] 
				+ '-food-resource-table">' + 
				'<div class="large-6 small-12 columns">' + 
					'<div class="row">' + 
						'<div class="small-3 columns">' + 
							'Name:' + 
						'</div>' + 
						'<div class="small-9 columns">' + 
							resource["name"] + 
						'</div>' + 
					'</div>' + 
					'<div class="row">' + 
						'<div class="small-3 columns">' + 
							'Address:' + 
						'</div>' + 
						'<div class="small-9 columns">' + 
							resource["address"]["line1"] +  
							'<br>'; 

		// Append line #2 of the food resource's address if it exists. 
		if (resource["address"]["line2"]) {
			html += 
							resource["address"]["line2"] +  
							'<br>'; 
		}

		html += 
							resource["address"]["city"] + ", " +
							resource["address"]["state"] +  " " +
							resource["address"]["zip_code"] +  
						'</div>' + 
					'</div>' + 
					'<div class="row">' + 
						'<div class="small-3 columns">' + 
							'Zip Code:' + 
						'</div>' + 
						'<div class="small-9 columns">' + 
							resource["address"]["zip_code"] +  
						'</div>' + 
					'</div>' + 
					'<div class="row">' + 
						'<div class="small-3 columns">' + 
							'Phone Number:' + 
						'</div>' + 
						'<div class="small-9 columns">' + 
							resource["phone_number"]["number"] +  
						'</div>' + 
					'</div>' + 
					'<div class="row">' + 
						'<div class="small-3 columns">' + 
							'Website:' + 
						'</div>' + 
						'<div class="small-9 columns">';

		// Append URL of the food resource if it exists. 
		if (resource["url"]) {
			html += 
							'<a href="' + resource["url"] + '">' + 
								resource["url"] + '</a>'; 
		} 
		else {
			html +=
							'None listed.'; 
		}

		html += 
						'</div>' + 
					'</div>' + 
					'<div class="row">' + 
						'<div class="small-3 columns">' + 
							'Description:' + 
						'</div>' + 
						'<div class="small-9 columns">' + 
							resource["description"] + 
						'</div>' + 
					'</div>' + 
					'<div class="row">' + 
						'<div class="small-3 columns">' + 
							'Family and children?' + 
						'</div>' + 
						'<div class="small-9 columns">'; 

		// Display whether the food resource is suitable for family and 
		// children. 
		if (resource["is_for_family_and_children"] == true) {
			html += 
							'Yes'; 
		}
		else {
			html += 
							'No'; 
		}

		html += 
						'</div>' + 
					'</div>' + 
					'<div class="row">' + 
						'<div class="small-3 columns">' + 
							'Seniors?' + 
						'</div>' + 
						'<div class="small-9 columns">'; 

		// Display whether the food resource is suitable for seniors. 
		if (resource["is_for_seniors"] == true) {
			html += 
							'Yes'; 
		}
		else {
			html += 
							'No'; 
		}
		
		html +=  
						'</div>' + 
					'</div>' + 
					'<div class="row">' + 
						'<div class="small-3 columns">' + 
							'Wheelchair accessible?' + 
						'</div>' + 
						'<div class="small-9 columns">'; 

		// Display whether the food resource is wheelchair accessible.
		if (resource["is_wheelchair_accessible"] == true) {
			html += 
							'Yes'; 
		}
		else {
			html += 
							'No';  
		}
		
		html += 
						'</div>' + 
					'</div>' + 
					'<div class="row">' + 
						'<div class="small-3 columns">' + 
							'Accepts SNAP?' + 
						'</div>' + 
						'<div class="small-9 columns">'; 

		// Display whether the food resource accepts SNAP.
		if (resource["is_accepts_snap"] == true) {
			html += 
							'Yes';  
		}
		else {
			html += 
							'No'; 
		}

		html += 
						'</div>' + 
					'</div>' + 
				'</div>' + 
				'<div class="large-6 small-12 columns">' + 
					'<div class="row">' + 
						'<div class="small-3 columns">' + 
							'Hours:' + 
						'</div>' + 
						'<div class="small-9 columns">'; 
						
		// If available, display the food resource's hours of operation.			
		if (resource["are_hours_available"] == true) {	 
			for (var j = 0; j < daysOfWeek.length; j++) {
				var day = daysOfWeek[j];
				html += 
							'<div class="row">' + 
								'<div class="small-6 columns">' + 
									day["name"] + 
								'</div>' + 
								'<div class="small-6 columns">';

				for (var k = 0; k < resource["timeslots"].length; k++) {
					var timeslot = resource["timeslots"][k]; 
					if (timeslot["day_of_week"] == day["index"]) {
						html += 
									timeslot["start_time"] + " - " 
										+ timeslot["end_time"];
					}
				}

				html += 
								'</div>' + 
							'</div>'; 
			} 
		}
		else {
			html += 
							'No hours available.';
		}

		html += 
						'</div>' + 
					'</div>' + 
				'</div>' + 
			'</div>' + 
		'</div>'; // resource
	}

	html += '</div>';
	return html;
}