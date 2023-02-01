var defaultdata = {
    "claimant_detail": {
        "name": "Mohd Syafiq",
        "designation": "Supervisor",
        "department": "Account Department",
        "date": "2022-09-05"
    },
    "claim_detail": [
        {
            "wo_no": "SBU/2021/00113",
            "departure_date": "2021-05-01",
            "departure_time": "0800",
            "return_date": "2021-05-15",
            "return_time": "1700",
            "items" : [
				{"type": "lodging", "quantity": 13, "rate": 2500, "value": 35000},
                {"type": "subsistence", "quantity": 14.5, "rate": 4000, "value": 58000},
				{"type": "ticket", "mode": "Express", "ticketno": "Q123", "origin": "Sibu", "destination": "Kapit", "value": 3500},
				{"type": "reload", "telco": "Celcom", "serialno": "111606020011440063", "telno": "0198390727", "monthyear": "2021-05", "value": 1000}
            ]
        },
        {
            "wo_no": "SBU/2021/00114",
            "departure_date": "2021-05-16",
            "departure_time": "0800",
            "return_date": "2021-05-31",
            "return_time": "1700",
            "items" : [
                {"type": "subsistence", "quantity": 14, "rate": 4000, "value": 56000},
                {"type": "lodging", "quantity": 14, "rate": 2500, "value": 35000}
            ]
        },
    ],
	"grandtotal": 0
}


function sortItems() {
    const wo_count = defaultdata.claim_detail.length;
    for (current_wo=0; current_wo<wo_count; current_wo++) {
        var item_count = defaultdata.claim_detail[current_wo].items.length;
        for (var current_item=0; current_item<item_count; current_item++) {
            var min = current_item;
            
            for (var next_item=current_item+1; next_item<item_count; next_item++) {
                if ( getRank(defaultdata.claim_detail[current_wo].items[next_item].type)<getRank(defaultdata.claim_detail[current_wo].items[min].type) ) {
                    min = next_item;
                    //defaultdata.claim_detail[current_wo].items[min] = defaultdata.claim_detail[current_wo].items[next_item];
                }
            }
                
            if (min != current_item) {
                var temp;
                temp = defaultdata.claim_detail[current_wo].items[current_item];
                defaultdata.claim_detail[current_wo].items[current_item] = defaultdata.claim_detail[current_wo].items[min];
                defaultdata.claim_detail[current_wo].items[min] = temp;
            }
        }
    }
}


function getRank(item) {
	var rank = 0;
	switch(item) {
		case "subsistence":
			rank = 1;
			break;
		case "lodging":
			rank = 2;
			break;
		case "ticket":
			rank = 3;
			break;
		case "reload":
			rank = 4;
			break;
		default:
			rank = 5;
	}
	return rank;
}


function repopulateAll() {
	sortItems();
    // populate the form with defaultdata
    document.getElementById("name").value = defaultdata.claimant_detail.name;
    document.getElementById("designation").value = defaultdata.claimant_detail.designation;
    document.getElementById("department").value = defaultdata.claimant_detail.department;
    document.getElementById("date").value = defaultdata.claimant_detail.date;
    var tclm = defaultdata.claim_detail.length; // total WO/Claim set
    var tbody = document.getElementById("claim_detail");
    var full_render = ``;
    var total = 0; // to store incremental subtotals

    for (var i=0; i<tclm; i++) {
        var titm = defaultdata.claim_detail[i].items.length; // titm = total claim items

        var data = {
            indexno: i,
            wo_no: defaultdata.claim_detail[i].wo_no,
            departure_date: reformatDate(defaultdata.claim_detail[i].departure_date),
            departure_time: to12HourFmt(defaultdata.claim_detail[i].departure_time),
            return_date: reformatDate(defaultdata.claim_detail[i].return_date),
            return_time: to12HourFmt(defaultdata.claim_detail[i].return_time),
            rowspan: rowspanRule(titm)
        }
        //tbody.innerHTML = Mustache.render("{{title}}", view);

        var wo_td = `
            <tr>
                <td class="w3-border w3-center" style="line-height: 0.4;" rowspan="{{rowspan}}">
                    <p>{{wo_no}}</p>
                    <p>{{departure_date}}</p>
                    <p>{{departure_time}}</p>
                    <p>to</p>
                    <p>{{return_date}}</p>
                    <p>{{return_time}}</p>
                    <p>
                        <a onclick="openWOModal({{indexno}})" class="w3-margin-right" style="color: gray;"><i class="fa fa-edit"></i></a>
                        <a onclick="deleteWO({{indexno}})" style="color: red;"><i class="fa fa-times"></i></a>
                    </p>
                </td>
        `;

        //tbody.innerHTML = Mustache.render(wo_td, data);
        full_render += Mustache.render(wo_td, data);

        var item = {};

        if (titm==0) {
            item = {
                display: false,
                woindex: "",
                itemindex: "",
                type: "",
                quantity: "",
                rate: "",
                value: "",
                wordings: "please add your claim item first"
            };
        } else {
            item = {
                display: true,
                woindex: i,
                itemindex: 0,
                type: defaultdata.claim_detail[i].items[0].type,
                quantity: defaultdata.claim_detail[i].items[0].quantity,
                rate: reformatRM(defaultdata.claim_detail[i].items[0].rate),
                value: reformatRM(defaultdata.claim_detail[i].items[0].value),
                wordings: genWordings(defaultdata.claim_detail[i].items[0])
            }
            total = total + defaultdata.claim_detail[i].items[0].value;
        }

		item.quantity = setQuantitySuffix(item);
        
		var preitem_td = `
            <td class="w3-border cm-claim-item">{{{wordings}}}</td>
            <td>{{quantity}}</td>
            <td class="w3-border w3-right-align">{{value}}</td>
            <td class="w3-center">
            {{#display}}
                <a onclick="openItem({{woindex}}, {{itemindex}})" class="w3-margin-right" style="color: gray;"><i class="fa fa-edit"></i></a>
                <a onclick="deleteClaimItem({{woindex}}, {{itemindex}})" style="color: red;"><i class="fa fa-times"></i></a>
            {{/display}}
            </td>
        `;
        full_render += Mustache.render(preitem_td, item);
        full_render += `</tr>`; // close the WO
        
        if (titm>1) {
            for (var t=1; t<titm; t++) {
                item = {
                    woindex: i,
                    itemindex: t,
                    type: defaultdata.claim_detail[i].items[t].type,
                    quantity: defaultdata.claim_detail[i].items[t].quantity,
                    rate: reformatRM(defaultdata.claim_detail[i].items[t].rate),
                    value: reformatRM(defaultdata.claim_detail[i].items[t].value),
                    wordings: genWordings(defaultdata.claim_detail[i].items[t])
                }
                total = total + defaultdata.claim_detail[i].items[t].value;
                full_render += genItemTd(item);
            }
        }
    }
    full_render += appendFinalRow(total);
	defaultdata.grandtotal = total;
	console.log(defaultdata.grandtotal);
    tbody.innerHTML = full_render;
}


function genItemTd(item) {
	item.quantity = setQuantitySuffix(item);
	
    var item_tr = `
    <tr>
        <td class="w3-border cm-claim-item" style="white-space: pre-wrap;">{{{wordings}}}</td>
        <td>{{quantity}}</td>
        <td class="w3-border w3-right-align">{{value}}</td>
        <td class="w3-center">
            <a onclick="openItem({{woindex}}, {{itemindex}})" class="w3-margin-right" style="color: gray;"><i class="fa fa-edit"></i></a>
            <a onclick="deleteClaimItem({{woindex}}, {{itemindex}})" style="color: red;"><i class="fa fa-times"></i></a>
        </td>
    </tr>
    `;
    return Mustache.render(item_tr, item);
}


function setQuantitySuffix(item) {
	var str = "";
	var suffix = "";
	switch(item.type) {
		case "subsistence":
			suffix = " days";
			str = item.quantity + suffix;
			break;
		case "lodging":
			suffix = " nights";
			str = item.quantity + suffix;
			break;
		case "other":
			str = item.quantity;
			break;
		default:
			str = "";
			break;
	}
	return str;
}


function appendFinalRow(total) {
    data = {
        total: reformatRM(total)
    };
    var final_row = `
    <tr>
        <td class="cm-bottom-cell"></td>
        <td class="cm-bottom-cell"></td>
        <td class="w3-border"><b>Total</b></td>
        <td class="w3-right-align cm-totalvalue-cell">RM {{total}}</td>
        <td class="cm-final-cell"></td>
    </tr>
    `;
    return Mustache.render(final_row, data);
}


function to12HourFmt(time) {
    // convert "item.*_time" -> "08:00 AM"
    // what we have: 0800
    // what we want: 08:00 AM
    const am = "AM";
    const pm = "PM";
    // detect the first two
    var hour = time.substr(0, 2);
    var hour_int = parseInt(hour);
    var minute = time.substr(2, 2);
    if (hour_int>=12) {
        if (hour_int>12) {
            hour_int = hour_int - 12;
            if (String(hour_int).length==1) {
                return "0" + hour_int + ":" + minute + " " + pm;
            }
            else {
                return hour_int + ":" + minute + " " + pm;
            }
            
        }
        else {
            return hour + ":" + minute + " " + pm;
        }
    }
    else {
        return hour + ":" + minute + " " + am;
    }
}


// function to format date to DD/MM/YYYY
function reformatDate(date) {
	var parts = date.split('-');
	return parts[2]+"/"+parts[1]+"/"+parts[0];
}


// function to convert HHMM to hh:mm:ss aka DOM format
function timeFormatDOM(time) {
    var hour = time.substr(0, 2);
    //var hour_int = parseInt(hour);
    var minute = time.substr(2, 2);
    var seconds = '00'; // we ignore seconds value
    return hour + ":" + minute + ":" + seconds;
}


// function to reverse the timeFormatDOM
function revTimeFormatDOM(time) {
    var hour = time.substr(0, 2);
    var minute = time.substr(3, 2);
    return hour + "" + minute;
}


function standardDate(item) {
    
}


function saveDetail() {
    defaultdata.claimant_detail.name = document.getElementById("name").value;
    defaultdata.claimant_detail.designation = document.getElementById("designation").value;
    defaultdata.claimant_detail.department = document.getElementById("department").value;
    defaultdata.claimant_detail.date = document.getElementById("date").value;
}


function generateSubsistence(item) {
    data = {
        rate: reformatRM(item.rate)
    };
    var str = Mustache.render("Subsistence Allowance @ RM{{rate}} per day", data);
    return str;
}


function generateLodging(item) {
    data = {
        rate: reformatRM(item.rate)
    };
    var str = Mustache.render("Lodging Allowance @ RM{{rate}} per night", data);
    return str;
}


function generateTicket(item) {
	data = {
		mode: item.mode,
		ticketno: item.ticketno,
		origin: item.origin,
		destination: item.destination
	};
	var str = Mustache.render("{{mode}} fare {{origin}} to {{destination}}, Ticket No. {{ticketno}}", data);
	return str;
}


function generateReload(item) {
	data = {
		telco: item.telco,
		serialno: item.serialno,
		telno: item.telno,
		monthyear: convertMonthYear(item.monthyear)
	}
	var str = Mustache.render("Being claim for {{telco}} reload coupon for {{monthyear}}, Receipt no. {{serialno}} ({{telno}})", data);
	return str;
}


function generateOther(item) {
	var str = ``;
	str = item.desc;
	return str; 
}


// convert Cent to RM (eg: 1000 => RM10.00)
function reformatRM(value) {
    return (value/100).toFixed(2);
}


// convert RM to Cent (eg: RM10.00 => 1000)
function reformatCent(value) {
	return parseInt(value*100);
}


function genWordings(item) {
    var str = "";
	switch(item.type) {
		case "subsistence":
			str = generateSubsistence(item);
			break;
		case "lodging":
			str = generateLodging(item);
			break;
		case "ticket":
			str = generateTicket(item);
			break;
		case "reload":
			str = generateReload(item);
			break;
		case "other":
			str = generateOther(item);
			break;
		default:
			str = "no suitable wordings found";
			break;
	}
	return str;
}


function validateStudent(event) {
    document.getElementById("tabTravelling").click(); // assuming validation is successful
}


function deleteWO(indexno) {
    defaultdata.claim_detail.splice(indexno, 1);
    repopulateAll();
}


function openItem(woindex, itemindex) {
    itemtype = defaultdata.claim_detail[woindex].items[itemindex].type;
    switch(itemtype) {
        case "subsistence":
            openSubModal(woindex, itemindex);
            break;
        case "lodging":
            openLodModal(woindex, itemindex);
            break;
		case "ticket":
			openTicModal(woindex, itemindex);
			break;
		case "reload":
			openRelModal(woindex, itemindex);
			break;
		case "other":
			openOthModal(woindex, itemindex);
			break;
    }
}


function openWOModal(woindex) {
    document.getElementById('wo_modal_no').value = defaultdata.claim_detail[woindex].wo_no;
    document.getElementById('wo_modal_depdate').value = defaultdata.claim_detail[woindex].departure_date;
    document.getElementById('wo_modal_deptime').value = timeFormatDOM(defaultdata.claim_detail[woindex].departure_time);
    document.getElementById('wo_modal_retdate').value = defaultdata.claim_detail[woindex].return_date;
    document.getElementById('wo_modal_rettime').value = timeFormatDOM(defaultdata.claim_detail[woindex].return_time);
    document.getElementById('wo_modal_save').onclick = function(){saveWO(woindex)};
    document.getElementById('wo_modal').style.display='block';
}


function openSubModal(woindex, itemindex) {
	sub_modal_rate = document.getElementById('sub_modal_rate');
	sub_modal_days = document.getElementById('sub_modal_days');
	sub_modal_total = document.getElementById('sub_modal_total');
	sub_modal_woinput = document.getElementById('sub_modal_woinput');
	if (sub_modal_woinput.dataset.woinput==0) {
		sub_modal_woinput.style.display = "none";
	}
	
	sub_modal_rate.dataset.rate = defaultdata.claim_detail[woindex].items[itemindex].rate;
	sub_modal_days.dataset.days = defaultdata.claim_detail[woindex].items[itemindex].quantity;
	sub_modal_total.dataset.woindex = woindex;
	sub_modal_total.dataset.itemindex = itemindex;
	
	sub_modal_rate.value = reformatRM(sub_modal_rate.dataset.rate);
    sub_modal_days.value = parseInt(sub_modal_days.dataset.days);
	
	if (sub_modal_days.dataset.days % 1 == 0.5) {
		sub_modal_days.dataset.halfday = 1;
		sub_modal_days.value += "½";
	}
	else {
		sub_modal_days.dataset.halfday = 0;
	}

	data = {
		'rate': sub_modal_rate.dataset.rate,
		'days': sub_modal_days.dataset.days
	};
	
	sub_modal_total.innerText = 'RM' + generateSubTotal(data);
	
    document.getElementById('sub_modal_save').onclick = function(){saveSub(woindex, itemindex)};
    document.getElementById('sub_modal').style.display='block';
}


function openLodModal(woindex, itemindex) {
	lod_modal_rate = document.getElementById('lod_modal_rate');
	lod_modal_nights = document.getElementById('lod_modal_nights');
	lod_modal_total = document.getElementById('lod_modal_total');
	lod_modal_woinput = document.getElementById('lod_modal_woinput');
	if (lod_modal_woinput.dataset.woinput==0) {
		lod_modal_woinput.style.display = "none";
	}
	
	lod_modal_rate.dataset.rate = defaultdata.claim_detail[woindex].items[itemindex].rate;
	lod_modal_nights.dataset.nights = defaultdata.claim_detail[woindex].items[itemindex].quantity;
	lod_modal_total.dataset.woindex = woindex;
	lod_modal_total.dataset.itemindex = itemindex;
	
	lod_modal_rate.value = reformatRM(lod_modal_rate.dataset.rate);
    lod_modal_nights.value = parseInt(lod_modal_nights.dataset.nights);

	data = {
		'rate': lod_modal_rate.dataset.rate,
		'nights': lod_modal_nights.dataset.nights
	};
	
	lod_modal_total.innerText = 'RM' + generateLodTotal(data);
	
    document.getElementById('lod_modal_save').onclick = function(){saveLod(woindex, itemindex)};
    document.getElementById('lod_modal').style.display='block';
}


function openTicModal(woindex, itemindex) {
	tic_modal_mode = document.getElementById('tic_modal_mode');
	tic_modal_ticketno = document.getElementById('tic_modal_ticketno');
	tic_modal_origin = document.getElementById('tic_modal_origin');
	tic_modal_destination = document.getElementById('tic_modal_destination');
	tic_modal_price = document.getElementById('tic_modal_price');

	tic_modal_woinput = document.getElementById('tic_modal_woinput');
	if (tic_modal_woinput.dataset.woinput==0) {
		tic_modal_woinput.style.display = "none";
	}
	
	tic_modal_mode.value = defaultdata.claim_detail[woindex].items[itemindex].mode;
	tic_modal_ticketno.value = defaultdata.claim_detail[woindex].items[itemindex].ticketno;
	tic_modal_origin.value = defaultdata.claim_detail[woindex].items[itemindex].origin;
	tic_modal_destination.value = defaultdata.claim_detail[woindex].items[itemindex].destination;
	tic_modal_price.dataset.price = defaultdata.claim_detail[woindex].items[itemindex].value;
	tic_modal_price.value = reformatRM(tic_modal_price.dataset.price);
	
	tic_modal_price.dataset.woindex = woindex;
	tic_modal_price.dataset.itemindex = itemindex;
	
    document.getElementById('tic_modal_save').onclick = function(){saveTic(woindex, itemindex)};
    document.getElementById('tic_modal').style.display='block';
}


function openRelModal(woindex, itemindex) {
	rel_modal_telco = document.getElementById('rel_modal_telco');
	rel_modal_serialno = document.getElementById('rel_modal_serialno');
	rel_modal_telno = document.getElementById('rel_modal_telno');
	rel_modal_monthyear = document.getElementById('rel_modal_monthyear');
	rel_modal_amount = document.getElementById('rel_modal_amount');

	rel_modal_woinput = document.getElementById('rel_modal_woinput');
	if (rel_modal_woinput.dataset.woinput==0) {
		rel_modal_woinput.style.display = "none";
	}
	
	rel_modal_telco.value = defaultdata.claim_detail[woindex].items[itemindex].telco;
	rel_modal_serialno.value = defaultdata.claim_detail[woindex].items[itemindex].serialno;
	rel_modal_telno.value = defaultdata.claim_detail[woindex].items[itemindex].telno;
	rel_modal_monthyear.value = defaultdata.claim_detail[woindex].items[itemindex].monthyear;
	rel_modal_amount.dataset.amount = defaultdata.claim_detail[woindex].items[itemindex].value;
	rel_modal_amount.value = reformatRM(rel_modal_amount.dataset.amount);
	
	
	rel_modal_amount.dataset.woindex = woindex;
	rel_modal_amount.dataset.itemindex = itemindex;
	
    document.getElementById('rel_modal_save').onclick = function(){saveRel(woindex, itemindex)};
    document.getElementById('rel_modal').style.display='block';
}


function openOthModal(woindex, itemindex) {
	oth_modal_desc = document.getElementById('oth_modal_desc');
	oth_modal_quantity = document.getElementById('oth_modal_quantity');
	oth_modal_amount = document.getElementById('oth_modal_amount');
	
	oth_modal_woinput = document.getElementById('oth_modal_woinput');
	if (oth_modal_woinput.dataset.woinput==0) {
		oth_modal_woinput.style.display = "none";
	}
	
	oth_modal_desc.value = defaultdata.claim_detail[woindex].items[itemindex].desc;
	oth_modal_quantity.value = defaultdata.claim_detail[woindex].items[itemindex].quantity;
	oth_modal_amount.dataset.amount = defaultdata.claim_detail[woindex].items[itemindex].value;
	oth_modal_amount.value = reformatRM(oth_modal_amount.dataset.amount);
	
	oth_modal_amount.dataset.woindex = woindex;
	oth_modal_amount.dataset.itemindex = itemindex;
	
	document.getElementById('oth_modal_save').onclick = function() {saveOth(woindex, itemindex)};
	document.getElementById('oth_modal').style.display = 'block';
}


function toggleHalfDay(modal_id) {
	var input_id = "";
	switch (modal_id) {
		case "sub_modal":
			input_id = "sub_modal_days";
			break;
		case "lod_modal":
			input_id = "lod_modal_nights";
			break;
	}
	
	// modify the data halfday
	target_input = document.getElementById(input_id);
	if (target_input.dataset.halfday==0) {
		target_input.dataset.halfday=1;
		target_input.value += "½";
	} else {
		target_input.dataset.halfday=0;
		var tempstr = target_input.value;
		target_input.value = tempstr.replace("½", "");
	}
	updateSubModal();
}


function updateSubModal() {
	sub_modal_rate = document.getElementById('sub_modal_rate');
	sub_modal_days = document.getElementById('sub_modal_days');
	sub_modal_total = document.getElementById('sub_modal_total');
	
	sub_modal_rate.dataset.rate = reformatCent(sub_modal_rate.value);
	
	// rules for days value
	if (sub_modal_days.value.toString().search("½")!=-1) {
		if (sub_modal_days.value.length==1) {
			sub_modal_days.dataset.days = 0.5;
		}
		else {
			sub_modal_days.dataset.days = parseInt(sub_modal_days.value) + 0.5;
		}
		sub_modal_days.dataset.halfday = 1;
	}
	else {
		sub_modal_days.dataset.halfday = 0;
		sub_modal_days.dataset.days = sub_modal_days.value;
	}
	
	data = {
		'rate': sub_modal_rate.dataset.rate,
		'days': sub_modal_days.dataset.days
	};

	sub_modal_total.innerText = 'RM' + generateSubTotal(data);
}


function updateLodModal() {
	lod_modal_rate = document.getElementById('lod_modal_rate');
	lod_modal_nights = document.getElementById('lod_modal_nights');
	lod_modal_total = document.getElementById('lod_modal_total');
	
	lod_modal_rate.dataset.rate = reformatCent(lod_modal_rate.value);
	
	lod_modal_nights.dataset.nights = lod_modal_nights.value;
	
	data = {
		'rate': lod_modal_rate.dataset.rate,
		'nights': lod_modal_nights.dataset.nights
	};

	lod_modal_total.innerText = 'RM' + generateLodTotal(data);
}


function updateTicModal() {
	tic_modal_price = document.getElementById('tic_modal_price');
	tic_modal_price.dataset.price = reformatCent(tic_modal_price.value);
}


function updateRelModal() {
	rel_modal_amount = document.getElementById('rel_modal_amount');
	rel_modal_amount.dataset.amount = reformatCent(rel_modal_amount.value);
}


function updateOthModal() {
	oth_modal_amount = document.getElementById('oth_modal_amount');
	oth_modal_amount.dataset.amount = reformatCent(oth_modal_amount.value);
}


// special function to subsistence and lodging quantity and value
function updateSubLod(woindex) {
	// find item count
	var item_count = defaultdata.claim_detail[woindex].items.length;
	// iterate to find subsistence and lodging
	for (var i=0; i<item_count; i++) {
		switch(defaultdata.claim_detail[woindex].items[i].type) {
			case "subsistence":
				var days = suggestQuantity(woindex);
				defaultdata.claim_detail[woindex].items[i].quantity = days;
				var data = {
					"days": days,
					"rate": defaultdata.claim_detail[woindex].items[i].rate
				};
				defaultdata.claim_detail[woindex].items[i].value = reformatCent(generateSubTotal(data));
				break;
			case "lodging":
				var nights = suggestQuantity(woindex) - 1;
				defaultdata.claim_detail[woindex].items[i].quantity = nights;
				var data = {
					"nights": nights,
					"rate": defaultdata.claim_detail[woindex].items[i].rate
				};
				defaultdata.claim_detail[woindex].items[i].value = reformatCent(generateLodTotal(data));
				break;
		}
	}
}


function generateSubTotal(data) {
	var total = data.days * data.rate;
	return reformatRM(total);
}


function generateLodTotal(data) {
	var total = data.nights * data.rate;
	return reformatRM(total);
}


function saveWO(woindex) {
	if (!defaultdata.claim_detail[woindex]) {
		defaultdata.claim_detail[woindex] = {
			"wo_no": "",
			"departure_date": "",
			"departure_time": "",
			"return_date": "",
			"return_time": "",
			"items": []
		};
	}
    defaultdata.claim_detail[woindex].wo_no = document.getElementById('wo_modal_no').value;
    defaultdata.claim_detail[woindex].departure_date = document.getElementById('wo_modal_depdate').value;
    defaultdata.claim_detail[woindex].departure_time = revTimeFormatDOM(document.getElementById('wo_modal_deptime').value);
    defaultdata.claim_detail[woindex].return_date = document.getElementById('wo_modal_retdate').value;
    defaultdata.claim_detail[woindex].return_time = revTimeFormatDOM(document.getElementById('wo_modal_rettime').value);
    document.getElementById('wo_modal').style.display='none';
	resetWOModal();
	updateSubLod(woindex);
    repopulateAll();
}


function saveSub(woindex, itemindex) {
	sub_modal_rate = document.getElementById('sub_modal_rate');
	sub_modal_days = document.getElementById('sub_modal_days');
	sub_modal_total = document.getElementById('sub_modal_total');
	sub_modal_woinput = document.getElementById('sub_modal_woinput');

	// determine if new subsistence
	if (sub_modal_woinput.dataset.woinput==1) {
		defaultdata.claim_detail[woindex].items[itemindex] = {};
	}
	
	defaultdata.claim_detail[woindex].items[itemindex].type = "subsistence";
	defaultdata.claim_detail[woindex].items[itemindex].quantity = sub_modal_days.dataset.days;
	defaultdata.claim_detail[woindex].items[itemindex].rate = sub_modal_rate.dataset.rate;
	
	data = {
		'rate': sub_modal_rate.dataset.rate,
		'days': sub_modal_days.dataset.days
	};
	defaultdata.claim_detail[woindex].items[itemindex].value = reformatCent(generateSubTotal(data));
	document.getElementById('sub_modal').style.display='none';
	resetSubModal();
	repopulateAll();
}


function saveLod(woindex, itemindex) {
	lod_modal_rate = document.getElementById('lod_modal_rate');
	lod_modal_nights = document.getElementById('lod_modal_nights');
	lod_modal_total = document.getElementById('lod_modal_total');
	lod_modal_woinput = document.getElementById('lod_modal_woinput');

	// determine if new lodging
	if (lod_modal_woinput.dataset.woinput==1) {
		defaultdata.claim_detail[woindex].items[itemindex] = {};
	}
	
	defaultdata.claim_detail[woindex].items[itemindex].type = "lodging";
	defaultdata.claim_detail[woindex].items[itemindex].quantity = lod_modal_nights.dataset.nights;
	defaultdata.claim_detail[woindex].items[itemindex].rate = lod_modal_rate.dataset.rate;
	
	data = {
		'rate': lod_modal_rate.dataset.rate,
		'nights': lod_modal_nights.dataset.nights
	};
	defaultdata.claim_detail[woindex].items[itemindex].value = reformatCent(generateLodTotal(data));
	document.getElementById('lod_modal').style.display='none';
	resetLodModal();
	repopulateAll();
}


function saveTic(woindex, itemindex) {
	tic_modal_mode = document.getElementById('tic_modal_mode');
	tic_modal_ticketno = document.getElementById('tic_modal_ticketno');
	tic_modal_origin = document.getElementById('tic_modal_origin');
	tic_modal_destination = document.getElementById('tic_modal_destination');
	tic_modal_price = document.getElementById('tic_modal_price');
	tic_modal_woinput = document.getElementById('tic_modal_woinput');

	// determine if new lodging
	if (tic_modal_woinput.dataset.woinput==1) {
		defaultdata.claim_detail[woindex].items[itemindex] = {};
	}
	
	defaultdata.claim_detail[woindex].items[itemindex].type = "ticket";
	defaultdata.claim_detail[woindex].items[itemindex].mode = tic_modal_mode.value;
	defaultdata.claim_detail[woindex].items[itemindex].ticketno = tic_modal_ticketno.value;
	defaultdata.claim_detail[woindex].items[itemindex].origin = tic_modal_origin.value;
	defaultdata.claim_detail[woindex].items[itemindex].destination = tic_modal_destination.value;
	defaultdata.claim_detail[woindex].items[itemindex].value = parseInt(tic_modal_price.dataset.price);

	document.getElementById('tic_modal').style.display='none';
	resetTicModal();
	repopulateAll();
}


function saveRel(woindex, itemindex) {
	var rel_modal_telco = document.getElementById('rel_modal_telco');
	var rel_modal_serialno = document.getElementById('rel_modal_serialno');
	var rel_modal_telno = document.getElementById('rel_modal_telno');
	var rel_modal_monthyear = document.getElementById('rel_modal_monthyear');
	var rel_modal_amount = document.getElementById('rel_modal_amount');
	var rel_modal_woinput = document.getElementById('rel_modal_woinput');

	// determine if new reload
	if (rel_modal_woinput.dataset.woinput==1) {
		defaultdata.claim_detail[woindex].items[itemindex] = {};
	}

	defaultdata.claim_detail[woindex].items[itemindex].type = "reload";
	defaultdata.claim_detail[woindex].items[itemindex].telco = rel_modal_telco.value;
	defaultdata.claim_detail[woindex].items[itemindex].serialno = rel_modal_serialno.value;
	defaultdata.claim_detail[woindex].items[itemindex].telno = rel_modal_telno.value;
	defaultdata.claim_detail[woindex].items[itemindex].monthyear = rel_modal_monthyear.value;
	defaultdata.claim_detail[woindex].items[itemindex].value = parseInt(rel_modal_amount.dataset.amount);
	
    document.getElementById('rel_modal').style.display='none';
	resetRelModal();
	repopulateAll();
}


function saveOth(woindex, itemindex) {
	var oth_modal_desc = document.getElementById('oth_modal_desc');
	var oth_modal_quantity = document.getElementById('oth_modal_quantity');
	var oth_modal_amount = document.getElementById('oth_modal_amount');
	var oth_modal_woinput = document.getElementById('oth_modal_woinput');

	// determine if new reload
	if (oth_modal_woinput.dataset.woinput==1) {
		defaultdata.claim_detail[woindex].items[itemindex] = {};
	}

	defaultdata.claim_detail[woindex].items[itemindex].type = "other";
	defaultdata.claim_detail[woindex].items[itemindex].desc = oth_modal_desc.value;
	defaultdata.claim_detail[woindex].items[itemindex].quantity = oth_modal_quantity.value;
	defaultdata.claim_detail[woindex].items[itemindex].value = parseInt(oth_modal_amount.dataset.amount);

	document.getElementById('oth_modal').style.display='none';
	resetOthModal();
	repopulateAll();
}


function deleteClaimItem(woindex, itemindex) {
    defaultdata.claim_detail[woindex].items.splice(itemindex, 1);
    repopulateAll();
}


// This function prevents rowspan from becoming "0"
// which otherwise will mess up the table structure
function rowspanRule(value) {
    if (value==0) {
        return 1;
    }
    else {
        return value;
    }
}


function addWO() {
	// wo_modal
	resetWOModal();
	var wo_modal_no = document.getElementById('wo_modal_no');
	var wo_modal_depdate = document.getElementById('wo_modal_depdate');
	var wo_modal_deptime = document.getElementById('wo_modal_deptime');
	var wo_modal_retdate = document.getElementById('wo_modal_retdate');
	var wo_modal_rettime = document.getElementById('wo_modal_rettime');
	var woindex = defaultdata.claim_detail.length; // X
	/*defaultdata.claim_detail[woindex] = {
		"wo_no": "",
		"departure_date": "",
		"departure_time": "",
		"return_date": "",
		"return_time": "",
		"items": []
	};*/
	document.getElementById('wo_modal_save').onclick = function(){saveWO(woindex)};
	document.getElementById('wo_modal').style.display='block';
}


function addSubsistence() {
	var sub_modal_woinput = document.getElementById('sub_modal_woinput');
	var sub_modal_total = document.getElementById('sub_modal_total');
	sub_modal_woinput.dataset.woinput= "1"; // 1 is true
	
	var sub_modal_wo = document.getElementById("sub_modal_wo");
	// add this point, at least 1 WO should exist
	var option_list = "";
	var template = `
		<option value="{{wo_index}}">{{wo_no}}</option>
	`;
	var data = {};
	var wo_count = defaultdata.claim_detail.length;
	for (var i=0; i<wo_count; i++) {
		data = {
			'wo_no': defaultdata.claim_detail[i].wo_no,
			'wo_index': i
		};
		option_list += Mustache.render(template, data);
		data = {};
	}
	sub_modal_wo.innerHTML = option_list;
	
	var woindex = sub_modal_wo.options[sub_modal_wo.selectedIndex].value;
	var itemindex = defaultdata.claim_detail[woindex].items.length;
	
	var sub_modal_days = document.getElementById('sub_modal_days');
	var sub_modal_rate = document.getElementById('sub_modal_rate');
	
	sub_modal_days.value = sub_modal_days.dataset.days = suggestQuantity(woindex);
	sub_modal_rate.dataset.rate = suggestRate("subsistence");
	sub_modal_rate.value = reformatRM(sub_modal_rate.dataset.rate);
	data = {
		'rate': sub_modal_rate.dataset.rate,
		'days': sub_modal_days.dataset.days
	};
	sub_modal_total.innerText = 'RM' + generateSubTotal(data);
	
	sub_modal_total.dataset.woindex = woindex;
	sub_modal_total.dataset.itemindex = itemindex;
	
    document.getElementById('sub_modal_save').onclick = function(){saveSub(woindex, itemindex)};
    document.getElementById('sub_modal').style.display='block';
}


function addLodging() {
	var lod_modal_woinput = document.getElementById('lod_modal_woinput');
	var lod_modal_total = document.getElementById('lod_modal_total');
	lod_modal_woinput.dataset.woinput= "1"; // 1 is true
	
	var lod_modal_wo = document.getElementById("lod_modal_wo");
	// add this point, at least 1 WO should exist
	var option_list = "";
	var template = `
		<option value="{{wo_index}}">{{wo_no}}</option>
	`;
	var data = {};
	var wo_count = defaultdata.claim_detail.length;
	for (var i=0; i<wo_count; i++) {
		data = {
			'wo_no': defaultdata.claim_detail[i].wo_no,
			'wo_index': i
		};
		option_list += Mustache.render(template, data);
		data = {};
	}
	lod_modal_wo.innerHTML = option_list;
	
	var woindex = lod_modal_wo.options[lod_modal_wo.selectedIndex].value;
	var itemindex = defaultdata.claim_detail[woindex].items.length;
	
	var lod_modal_nights = document.getElementById('lod_modal_nights');
	var lod_modal_rate = document.getElementById('lod_modal_rate');
	
	lod_modal_nights.value = lod_modal_nights.dataset.nights = suggestQuantity(woindex);
	lod_modal_rate.dataset.rate = suggestRate("lodging");
	lod_modal_rate.value = reformatRM(lod_modal_rate.dataset.rate);
	data = {
		'rate': lod_modal_rate.dataset.rate,
		'nights': lod_modal_nights.dataset.nights
	};
	lod_modal_total.innerText = 'RM' + generateLodTotal(data);
	
	lod_modal_total.dataset.woindex = woindex;
	lod_modal_total.dataset.itemindex = itemindex;
	
    document.getElementById('lod_modal_save').onclick = function(){saveLod(woindex, itemindex)};
    document.getElementById('lod_modal').style.display='block';
}


function addTicket() {
	var tic_modal_woinput = document.getElementById('tic_modal_woinput');
	tic_modal_woinput.dataset.woinput= "1"; // 1 is true
	
	var tic_modal_wo = document.getElementById("tic_modal_wo");
	// add this point, at least 1 WO should exist
	var option_list = "";
	var template = `
		<option value="{{wo_index}}">{{wo_no}}</option>
	`;
	var data = {};
	var wo_count = defaultdata.claim_detail.length;
	for (var i=0; i<wo_count; i++) {
		data = {
			'wo_no': defaultdata.claim_detail[i].wo_no,
			'wo_index': i
		};
		option_list += Mustache.render(template, data);
		data = {};
	}
	tic_modal_wo.innerHTML = option_list;
	
	var woindex = tic_modal_wo.options[tic_modal_wo.selectedIndex].value;
	var itemindex = defaultdata.claim_detail[woindex].items.length;
	
	var tic_modal_mode = document.getElementById('tic_modal_mode');
	var tic_modal_ticketno = document.getElementById('tic_modal_ticketno');
	var tic_modal_origin = document.getElementById('tic_modal_origin');
	var tic_modal_destination = document.getElementById('tic_modal_destination');
	var tic_modal_price = document.getElementById('tic_modal_price');
	
	tic_modal_ticketno = "";
	tic_modal_origin = "";
	tic_modal_destination = "";
	tic_modal_price.value = reformatRM(0);
	tic_modal_price.dataset.price = 0;
	tic_modal_price.dataset.woindex = woindex;
	tic_modal_price.dataset.itemindex = itemindex;
	
    document.getElementById('tic_modal_save').onclick = function(){saveTic(woindex, itemindex)};
    document.getElementById('tic_modal').style.display='block';
}


function addReload() {
	var rel_modal_woinput = document.getElementById('rel_modal_woinput');
	rel_modal_woinput.dataset.woinput= "1"; // 1 is true
	
	var rel_modal_wo = document.getElementById("rel_modal_wo");
	// add this point, at least 1 WO should exist
	var option_list = "";
	var template = `
		<option value="{{wo_index}}">{{wo_no}}</option>
	`;
	var data = {};
	var wo_count = defaultdata.claim_detail.length;
	for (var i=0; i<wo_count; i++) {
		data = {
			'wo_no': defaultdata.claim_detail[i].wo_no,
			'wo_index': i
		};
		option_list += Mustache.render(template, data);
		data = {};
	}
	rel_modal_wo.innerHTML = option_list;
	
	var woindex = rel_modal_wo.options[rel_modal_wo.selectedIndex].value;
	var itemindex = defaultdata.claim_detail[woindex].items.length;
	
	var rel_modal_telco = document.getElementById('rel_modal_telco');
	var rel_modal_serialno = document.getElementById('rel_modal_serialno');
	var rel_modal_telno = document.getElementById('rel_modal_telco');
	var rel_modal_monthyear = document.getElementById('rel_modal_monthyear');
	var rel_modal_amount = document.getElementById('rel_modal_amount');

	rel_modal_telco.value = "";
	rel_modal_serialno.value = "";
	rel_modal_telno.value = "";
	rel_modal_monthyear = "";

	rel_modal_amount.value = reformatRM(0);
	rel_modal_amount.dataset.amount = 0;
	rel_modal_amount.dataset.woindex = woindex;
	rel_modal_amount.dataset.itemindex = itemindex;

    document.getElementById('rel_modal_save').onclick = function(){saveRel(woindex, itemindex)};
    document.getElementById('rel_modal').style.display='block';
}


function addOther() {
	var oth_modal_woinput = document.getElementById('oth_modal_woinput');
	oth_modal_woinput.dataset.woinput= "1"; // 1 is true
	
	var oth_modal_wo = document.getElementById("oth_modal_wo");
	// at this point, at least 1 WO should exist
	var option_list = "";
	var template = `
		<option value="{{wo_index}}">{{wo_no}}</option>
	`;
	var data = {};
	var wo_count = defaultdata.claim_detail.length;
	for (var i=0; i<wo_count; i++) {
		data = {
			'wo_no': defaultdata.claim_detail[i].wo_no,
			'wo_index': i
		};
		option_list += Mustache.render(template, data);
		data = {};
	}
	oth_modal_wo.innerHTML = option_list;
	
	var woindex = oth_modal_wo.options[oth_modal_wo.selectedIndex].value;
	var itemindex = defaultdata.claim_detail[woindex].items.length;
	
	var oth_modal_desc = document.getElementById('oth_modal_desc');
	var oth_modal_quantity = document.getElementById('oth_modal_quantity');
	var oth_modal_amount = document.getElementById('oth_modal_amount');
	
	oth_modal_desc.value = "";
	oth_modal_quantity.value = "";
	oth_modal_amount.dataset.amount = 0;
	oth_modal_amount.value = "0.00";
	
	oth_modal_amount.dataset.woindex = woindex;
	oth_modal_amount.dataset.itemindex = itemindex;
	
    document.getElementById('oth_modal_save').onclick = function(){saveOth(woindex, itemindex)};
    document.getElementById('oth_modal').style.display='block';
}


function resetWOModal() {
	var wo_modal_no = document.getElementById('wo_modal_no');
	var wo_modal_depdate = document.getElementById('wo_modal_depdate');
	var wo_modal_deptime = document.getElementById('wo_modal_deptime');
	var wo_modal_retdate = document.getElementById('wo_modal_retdate');
	var wo_modal_rettime = document.getElementById('wo_modal_rettime');
	var todaydate = dayjs();
	var twoWeeksForward = dayjs().add(13, 'day');
	
	wo_modal_no.value = "";
	wo_modal_depdate.value = todaydate.format('YYYY-MM-DD');
	wo_modal_deptime.value = "08:00";
	wo_modal_retdate.value = twoWeeksForward.format('YYYY-MM-DD');
	wo_modal_rettime.value = "17:00";
	// TO BE CONTINUED
}


function resetSubModal() {
	var sub_modal_rate = document.getElementById('sub_modal_rate');
	var sub_modal_days = document.getElementById('sub_modal_days');
	var sub_modal_total = document.getElementById('sub_modal_total');
	var sub_modal_woinput = document.getElementById('sub_modal_woinput');
	
	sub_modal_rate.value = "0.00";
	sub_modal_rate.dataset.rate = 0;
	sub_modal_days.value = 0;
	sub_modal_days.dataset.days = 0;
	sub_modal_days.dataset.halfday = 0;
	sub_modal_total.value = "0.00";
	sub_modal_total.dataset.woindex = "";
	sub_modal_total.dataset.itemindex = "";
	document.getElementById('sub_modal_total').innerHTML = "RM0.00";
	var sub_modal_wo = document.getElementById('sub_modal_wo').innerHTML = "";
	sub_modal_woinput.dataset.woinput = 0;
	sub_modal_woinput.style.display = "block";
}


function resetLodModal() {
	var lod_modal_rate = document.getElementById('lod_modal_rate');
	var lod_modal_nights = document.getElementById('lod_modal_nights');
	var lod_modal_total = document.getElementById('lod_modal_total');
	var lod_modal_woinput = document.getElementById('lod_modal_woinput');
	
	lod_modal_rate.value = "0.00";
	lod_modal_rate.dataset.rate = 0;
	lod_modal_nights.value = 0;
	lod_modal_nights.dataset.nights = 0;
	lod_modal_total.value = "0.00";
	lod_modal_total.dataset.woindex = "";
	lod_modal_total.dataset.itemindex = "";
	document.getElementById('lod_modal_total').innerHTML = "RM0.00";
	var lod_modal_wo = document.getElementById('lod_modal_wo').innerHTML = "";
	lod_modal_woinput.dataset.woinput = 0;
	lod_modal_woinput.style.display = "block";	
}


function resetTicModal() {
	var tic_modal_ticketno = document.getElementById('tic_modal_ticketno');
	var tic_modal_origin = document.getElementById('tic_modal_origin');
	var tic_modal_destination = document.getElementById('tic_modal_destination');
	var tic_modal_price = document.getElementById('tic_modal_price');
	var tic_modal_woinput = document.getElementById('tic_modal_woinput');
	
	tic_modal_ticketno.value = "";
	tic_modal_origin.value = "";
	tic_modal_destination.value = "";
	tic_modal_price.value = reformatRM(0);
	tic_modal_price.dataset.price = 0;
	
	var tic_modal_wo = document.getElementById('tic_modal_wo').innerHTML = "";
	tic_modal_woinput.dataset.woinput = 0;
	tic_modal_woinput.style.display = "block";
}


function resetRelModal() {
	var rel_modal_telco = document.getElementById('rel_modal_telco');
	var rel_modal_serialno = document.getElementById('rel_modal_serialno');
	var rel_modal_telno = document.getElementById('rel_modal_telno');
	var rel_modal_monthyear = document.getElementById('rel_modal_monthyear');
	var rel_modal_amount = document.getElementById('rel_modal_amount');
	var rel_modal_woinput = document.getElementById('rel_modal_woinput');
	
	rel_modal_telco.value = "Digi";
	rel_modal_serialno.value = "";
	rel_modal_telno.value = "";
	rel_modal_monthyear = "";
	rel_modal_amount.value = reformatRM(0);
	rel_modal_amount.dataset.amount = 0;
	
	var rel_modal_wo = document.getElementById('rel_modal_wo').innerHTML = "";
	rel_modal_woinput.dataset.woinput = 0;
	rel_modal_woinput.style.display = "block";
}


function resetOthModal() {
	var oth_modal_desc = document.getElementById('oth_modal_desc');
	var oth_modal_quantity = document.getElementById('oth_modal_quantity');
	var oth_modal_amount = document.getElementById('oth_modal_amount');
	var oth_modal_woinput = document.getElementById('oth_modal_woinput');
	
	oth_modal_desc.value = "";
	oth_modal_quantity.value = "";
	oth_modal_amount.value = reformatRM(0);
	oth_modal_amount.dataset.amount = 0;
	
	document.getElementById('oth_modal_wo').innerHTML = "";
	oth_modal_woinput.dataset.woinput = 0;
	oth_modal_woinput.style.display = "block";
}


// function to output suggested days/nights
// for subsistence or lodging (and respective modals)
function suggestQuantity(woindex) {
	var departure_date = dayjs(defaultdata.claim_detail[woindex].departure_date);
	var return_date = dayjs(defaultdata.claim_detail[woindex].return_date);
	
	// special dayjs feature: extending with plugin
	dayjs.extend(window.dayjs_plugin_duration);
	return dayjs.duration(return_date.diff(departure_date)).asDays()
}


function suggestRate(itemtype) {
	switch(itemtype) {
		case "subsistence":
			rate = 4000;
			break;
		case "lodging":
			rate = 2500;
			break;
	}
	return rate;
}


// function to convert between monthyear input value to text
function convertMonthYear(monthyear) {
	const d = new Date(monthyear);
	const month = ["Jan","Feb","Mar","Apr","May","June","July","August","Sep","Oct","Nov","Dec"];
	let name = month[d.getMonth()];
	return name + " " + d.getFullYear();
}

// this function are supposedly usable by all types of items
function setWOIndex(type) {
	switch(type){
		case "subsistence":
			var sub_modal_wo = document.getElementById("sub_modal_wo");
			var sub_modal_days = document.getElementById("sub_modal_days");
			var sub_modal_total = document.getElementById("sub_modal_total");
			var woindex = sub_modal_wo.options[sub_modal_wo.selectedIndex].value;
			var itemindex = defaultdata.claim_detail[woindex].items.length;
			sub_modal_days.dataset.days = suggestQuantity(woindex);
			sub_modal_days.value = sub_modal_days.dataset.days;
			sub_modal_total.dataset.woindex = woindex;
			sub_modal_total.dataset.itemindex = itemindex;
			document.getElementById('sub_modal_save').onclick = function(){saveSub(woindex, itemindex)};
			break;
		case "lodging":
			var lod_modal_wo = document.getElementById("lod_modal_wo");
			var lod_modal_nights = document.getElementById("lod_modal_nights");
			var lod_modal_total = document.getElementById("lod_modal_total");
			var woindex = lod_modal_wo.options[lod_modal_wo.selectedIndex].value;
			var itemindex = defaultdata.claim_detail[woindex].items.length;
			lod_modal_nights.dataset.nights = suggestQuantity(woindex);
			lod_modal_nights.value = lod_modal_nights.dataset.nights;
			lod_modal_total.dataset.woindex = woindex;
			lod_modal_total.dataset.itemindex = itemindex;
			document.getElementById('lod_modal_save').onclick = function(){saveLod(woindex, itemindex)};
			break;
		case "ticket":
			var tic_modal_wo = document.getElementById("tic_modal_wo");
			var woindex = tic_modal_wo.options[tic_modal_wo.selectedIndex].value;
			var itemindex = defaultdata.claim_detail[woindex].items.length;
			document.getElementById('tic_modal_save').onclick = function(){saveTic(woindex, itemindex)};
			break;
		case "reload":
			var rel_modal_wo = document.getElementById("rel_modal_wo");
			var woindex = rel_modal_wo.options[rel_modal_wo.selectedIndex].value;
            var itemindex = defaultdata.claim_detail[woindex].items.length;
			var rel_modal_amount = document.getElementById("rel_modal_amount");
            document.getElementById('rel_modal_save').onclick = function(){saveRel(woindex, itemindex)};
			break;
	}
}


function downloadPDF() {
    // function to copy info from claimant detail
    defaultdata.claimant_detail.name = document.getElementById("name").value;
    defaultdata.claimant_detail.designation = document.getElementById("designation").value;
    defaultdata.claimant_detail.department = document.getElementById("department").value;
    defaultdata.claimant_detail.date = document.getElementById("date").value;
	document.getElementById('claimdata').value = JSON.stringify(defaultdata);
	document.getElementById('claimform').submit();
}


// begin initialization
repopulateAll();
// TEST
// console.log(defaultdata) //OK
// document.getElementById("test").innerText=defaultdata.claimant_detail.name; //OK