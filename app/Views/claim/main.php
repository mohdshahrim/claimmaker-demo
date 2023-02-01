<link rel="stylesheet" href="/css/cm.css">
<script>
    function openCity(evt, cityName) {
        var i, x, tablinks;
        x = document.getElementsByClassName("city");
        for (i = 0; i < x.length; i++) {
            x[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tablink");
        for (i = 0; i < x.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" w3-white", "");
        }
        document.getElementById(cityName).style.display = "block";
        evt.currentTarget.className += " w3-white";
    }
</script>
<script src="/js/dayjs.min.js" defer></script>
<script type="module" src="/js/plugin/duration.min.js" defer></script>
<script type="module" src="/js/plugin/customParseFormat.min.js" defer></script>
<script src="/js/mustache.min.js" defer></script>
<script src="/js/claim/claim.js" defer></script>
<script src="/js/minAjax.js" defer></script>


<div class="w3-container" style="margin-top:75px;">
    <h1 class="w3-xxxlarge w3-text-dark-gray"><b>ClaimMaker</b></h1>
    <span class="w3-tag w3-green w3-small">stable</span>
    <span class="w3-tag w3-small">demo version</span>
</div>
<br>
<div class="w3-container">
    <div class="w3-border w3-margin-bottom">
        <div class="w3-bar w3-border-bottom w3-light-grey intronav">
            <a class="w3-bar-item w3-button w3-border-right tablink w3-white" onclick="openCity(event, 'Claimant')" id="myLink"><i class="fa fa-user-alt w3-margin-right"></i>Claimant</a>
            <a class="w3-bar-item w3-button w3-border-right tablink" onclick="openCity(event, 'Travelling')" id="tabTravelling"><i class="fa fa-compass w3-margin-right"></i>Travelling</a>
        </div>


        <!-- Claimant's Detail -->
        <div id="Claimant" class="w3-container city sibumis-form" style="display: block;">
            <h2>Claimant's Detail</h2>
            <div class="w3-row">
                <div class="w3-col l4 s12">
                    <label class="w3-label"><b>Name</b></label>
                    <input id="name" type="text" onchange="saveDetail()" class="w3-input w3-light-gray w3-border w3-round" tabindex="1"></input>
                </div>
            </div>
            <br>
            <div class="w3-row">
                <div class="w3-col l4 s12">
                    <label class="w3-label"><b>Designation</b></label>
                    <input id="designation" type="text" onchange="saveDetail()" class="w3-input w3-light-gray w3-border w3-round" tabindex="2"></input>
                </div>
            </div>
            <br>
            <div class="w3-row">
                <div class="w3-col l4 s12">
                    <label class="w3-label"><b>Department</b></label>
                    <input id="department" type="text" onchange="saveDetail()" class="w3-input w3-light-gray w3-border w3-round" tabindex="2"></input>
                </div>
            </div>
            <br>
            <div class="w3-row">
                <div class="w3-col l4 s12">
                    <label class="w3-label"><b>Date</b></label>
                    <input id="date" type="date" onchange="saveDetail()" class="w3-input w3-light-gray w3-border w3-round" tabindex="2"></input>
                </div>
            </div>
            <br>
            <br>
            <input id="" type="hidden" value="0"></input>
            <button id="student_submit" onclick="validateStudent(event)" class="w3-button w3-red w3-margin-bottom w3-round-large" tabindex="10"><i class="fa fa-arrow-right w3-margin-right"></i>Claim Details</button>
        </div>


        <!-- Travelling -->
        <div id="Travelling" class="w3-container city sibumis-form" style="display: none;">
            <h2>Travelling Claim</h2>
            <br>
            <!-- buttons -->
            <div class="w3-row">
                <div class="w3-col w3-margin-bottom">
                    <button onclick="addWO()" class="w3-button w3-border w3-shadow w3-light-gray w3-round"><i class="fa fa-file-word w3-margin-right"></i>Add WO</button>
                    <button onclick="addSubsistence()" class="w3-button w3-border w3-light-gray w3-round"><i class="fa fa-utensils w3-margin-right"></i>Add Subsistence</button>
                    <button onclick="addLodging()" class="w3-button w3-border w3-light-gray w3-round"><i class="fa fa-bed w3-margin-right"></i>Add Lodging</button>
                    <button onclick="addTicket()" class="w3-button w3-border w3-light-gray w3-round"><i class="fa fa-bus w3-margin-right"></i>Add Ticket</button>
                    <button onclick="addReload()" class="w3-button w3-border w3-light-gray w3-round"><i class="fa fa-phone w3-margin-right"></i>Add Reload</button>
                    <button onclick="addOther()" class="w3-button w3-border w3-light-gray w3-round"><i class="fa fa-question w3-margin-right"></i>Add Other</button>
                </div>
            </div>
            <div class="w3-row">
                <div class="w3-col">
                    <table class="w3-table w3-border w3-bordered cm-font">
                        <tr>
                            <th>WO</th>
                            <th class="w3-border">Description</th>
                            <th>#</th>
                            <th class="w3-border">Value</th>
                            <th>Options</th>
                        </tr>
                        <tbody id="claim_detail">
                            <tr>
                                <td class="w3-center" style="line-height: 0.4;" rowspan="2">
                                    <p>SBU/2021/00216</p>
                                    <p>15/03/2021</p>
                                    <p>08:00 AM</p>
                                    <p>to</p>
                                    <p>30/03/2021</p>
                                    <p>05:00 PM</p>
                                    <p>
                                        <a class="w3-margin-right" style="color: gray;"><i class="fa fa-edit"></i></a>
                                        <a class="w3-margin-right" style="color: gray;"><i class="fa fa-copy"></i></a>
                                        <a style="color: red;"><i class="fa fa-times"></i></a>
                                    </p>
                                </td>
                                <td class="w3-border cm-claim-item">Subsistence Allowance @ RM40.00 per day</td>
                                <td>15 Days</td>
                                <td class="w3-border">375.00</td>
                                <td class="w3-center">
                                    <a class="w3-margin-right" style="color: gray;"><i class="fa fa-edit"></i></a>
                                    <a class="w3-margin-right" style="color: gray;"><i class="fa fa-copy"></i></a>
                                    <a style="color: red;"><i class="fa fa-times"></i></a>
                                </td>
                            </tr>
                            <tr>
                                <td class="w3-border cm-claim-item">Lodging Allowance @ RM40.00 per day</td>
                                <td>15 Days</td>
                                <td class="w3-border">375.00</td>
                                <td class="w3-center">
                                    <a class="w3-margin-right" style="color: gray;"><i class="fa fa-edit"></i></a>
                                    <a class="w3-margin-right" style="color: gray;"><i class="fa fa-copy"></i></a>
                                    <a style="color: red;"><i class="fa fa-times"></i></a>
                                </td>
                            </tr>
                            <tr>
                                <td class="cm-bottom-cell"></td>
                                <td class="cm-bottom-cell"></td>
                                <td class="w3-border"><b>Total</b></td>
                                <td class="w3-right-align cm-totalvalue-cell">RM 300.00</td>
                                <td class="cm-final-cell"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <br>
            <br>
			<form id="claimform" method="post" action="/downloadpdf">
				<input id="claimdata" name="claimdata" type="hidden"></input>
                <div>
                    <button onclick="downloadPDF()" class="w3-button w3-large w3-red w3-margin-bottom w3-round-large" style="margin-bottom: 0px;">
                        <i class="fa fa-file-pdf w3-margin-right"></i>Generate PDF
                    </button>
                    <p class="w3-small w3-text-gray" style="margin-top: 0px; display: inline-block; vertical-align: middle">best printed in A4 size</p>
                </div>
            </form>
        </div>
    </div>
    <!-- br for imaginary footer -->
    <br>
    <br>
    <br>
    <br>
    <br>
</div>


<!-- WO Modals -->
<div id="wo_modal" class="w3-modal">
    <div class="w3-modal-content w3-round-large">
        <header class="w3-container edidik-gradient-ok"> 
            <span onclick="document.getElementById('wo_modal').style.display='none';resetWOModal()" class="w3-button w3-large w3-display-topright">
                <i class="fa fa-times"></i>
            </span>
            <h2>
                <i class="fa fa-file-word w3-margin-right"></i><span id="success_title"></span>WORK ORDER
            </h2>
        </header>
        <div class="w3-container">
            <br>
            <div class="w3-row">
            <div class="w3-col l4 s12">
                <label class="w3-label w3-small">Work Order No.</label>
                <input id="wo_modal_no" type="text" class="w3-input w3-border sibumis-input" tabindex="1"></input>
            </div>
            </div>
            <br>
            <div class="w3-row">
                <div class="w3-col l4 s12 w3-margin-right">
                    <label class="w3-label w3-small">Departure Date</label>
                    <input id="wo_modal_depdate" type="date" class="w3-input w3-border sibumis-input" tabindex="1"></input>
                </div>
                <div class="w3-col l4 s12">
                    <label class="w3-label w3-small">Departure Time</label>
                    <input id="wo_modal_deptime" type="time" class="w3-input w3-border sibumis-input" tabindex="2"></input>
                </div>
            </div>
            <br>
            <div class="w3-row">
                <div class="w3-col l4 s12 w3-margin-right">
                    <label class="w3-label w3-small">Return Date</label>
                    <input id="wo_modal_retdate" type="date" class="w3-input w3-border sibumis-input" tabindex="3"></input>
                </div>
                <div class="w3-col l4 s12">
                    <label class="w3-label w3-small">Return Time</label>
                    <input id="wo_modal_rettime" type="time" class="w3-input w3-border sibumis-input" tabindex="4"></input>
                </div>
            </div>
            <br>
            <div class="w3-row">
                <div class="w3-col l4 s12">
                    <button id="wo_modal_save" class="w3-input w3-button w3-round-large w3-red" tabindex="5">Save</button>
                </div>
            </div>
            <br>
        </div>
        <footer class="w3-container w3-display-container edidik-gradient-ok">
        </footer>
    </div>
</div>


<!-- Subsistence modal -->
<div id="sub_modal" class="w3-modal">
    <div class="w3-modal-content w3-round-large">
        <header class="w3-container edidik-gradient-ok"> 
            <span onclick="document.getElementById('sub_modal').style.display='none';resetSubModal()" class="w3-button w3-large w3-display-topright">
                <i class="fa fa-times"></i>
            </span>
            <h2>
                <i class="fa fa-utensils w3-margin-right"></i><span id="success_title"></span>Subsistence
            </h2>
        </header>
        <div class="w3-container">
            <div id="sub_modal_woinput" data-woinput="0">
				<br>
				<div class="w3-row">
					<div class="w3-col l4 s12">
						<label class="w3-label w3-small">Work Order</label>
						<select id="sub_modal_wo" onchange="setWOIndex('subsistence')" class="w3-input w3-border sibumis-input">
							<option></option>
						</select>
					</div>
				</div>
			</div>
            <br>
            <div class="w3-row">
                <div class="w3-col l4 s12">
                    <label class="w3-label w3-small">Rate</label>
                    <input id="sub_modal_rate" value="0.00" data-rate="0" onkeyup="updateSubModal()" type="text" class="w3-input w3-border sibumis-input" tabindex="1"></input>
                </div>
            </div>
            <br>
            <div class="w3-row">
                <div class="w3-col l4 s12 w3-margin-right">
                    <label class="w3-label w3-small">Total days</label>
                    <input id="sub_modal_days" value="0" onkeyup="updateSubModal()" data-days="0" data-halfday="0" type="text" class="w3-input w3-border sibumis-input" tabindex="2"></input>
                </div>
                <div class="w3-col l2 w3-margin-right">
                    <label class="w3-label w3-small w3-text-white">.</label>
					<button id="sub_modal_halfdays" onclick="toggleHalfDay('sub_modal')" class="w3-input w3-button w3-round-large w3-red">Add half-day</button>
                </div>
            </div>
            <br>
            <div class="w3-row">
                <div class="w3-col">
					<label class="w3-label w3-small">Total</label>
                    <span id="sub_modal_total" data-woindex="" data-itemindex="" class="w3-input w3-border sibumis-input">RM0.00</span>
                </div>
            </div>
            <br>
            <div class="w3-row">
                <div class="w3-col l4 s12">
                    <button id="sub_modal_save" class="w3-input w3-button w3-round-large w3-red" tabindex="4">Save</button>
                </div>
            </div>
            <br>
        </div>
        <footer class="w3-container w3-display-container edidik-gradient-ok">
        </footer>
    </div>
</div>


<!-- Lodging modal -->
<div id="lod_modal" class="w3-modal">
    <div class="w3-modal-content w3-round-large">
        <header class="w3-container edidik-gradient-ok"> 
            <span onclick="document.getElementById('lod_modal').style.display='none';resetLodModal()" class="w3-button w3-large w3-display-topright">
                <i class="fa fa-times"></i>
            </span>
            <h2>
                <i class="fa fa-bed w3-margin-right"></i><span id="success_title"></span>Lodging
            </h2>
        </header>
        <div class="w3-container">
            <div id="lod_modal_woinput" data-woinput="0">
				<br>
				<div class="w3-row">
					<div class="w3-col l4 s12">
						<label class="w3-label w3-small">Work Order</label>
						<select id="lod_modal_wo" onchange="setWOIndex('lodging')" class="w3-input w3-border sibumis-input">
							<option></option>
						</select>
					</div>
				</div>
			</div>
            <br>
            <div class="w3-row">
                <div class="w3-col l4 s12">
                    <label class="w3-label w3-small">Rate</label>
                    <input id="lod_modal_rate" value="0.00" data-rate="0" onkeyup="updateLodModal()" type="text" class="w3-input w3-border sibumis-input" tabindex="1"></input>
                </div>
            </div>
            <br>
            <div class="w3-row">
                <div class="w3-col l4 s12 w3-margin-right">
                    <label class="w3-label w3-small">Total nights</label>
                    <input id="lod_modal_nights" value="0" onkeyup="updateLodModal()" data-nights="0" type="text" class="w3-input w3-border sibumis-input" tabindex="2"></input>
                </div>
            </div>
            <br>
            <div class="w3-row">
                <div class="w3-col">
					<label class="w3-label w3-small">Total</label>
                    <span id="lod_modal_total" data-woindex="" data-itemindex="" class="w3-input w3-border sibumis-input">RM0.00</span>
                </div>
            </div>
            <br>
            <div class="w3-row">
                <div class="w3-col l4 s12">
                    <button id="lod_modal_save" class="w3-input w3-button w3-round-large w3-red" tabindex="4">Save</button>
                </div>
            </div>
            <br>
        </div>
        <footer class="w3-container w3-display-container edidik-gradient-ok">
        </footer>
    </div>
</div>


<!-- Ticket modal -->
<div id="tic_modal" class="w3-modal">
    <div class="w3-modal-content w3-round-large">
        <header class="w3-container edidik-gradient-ok"> 
            <span onclick="document.getElementById('tic_modal').style.display='none';resetTicModal()" class="w3-button w3-large w3-display-topright">
                <i class="fa fa-times"></i>
            </span>
            <h2>
                <i class="fa fa-bus w3-margin-right"></i>Ticket
            </h2>
        </header>
        <div class="w3-container">
            <div id="tic_modal_woinput" data-woinput="0">
				<br>
				<div class="w3-row">
					<div class="w3-col l4 s12">
						<label class="w3-label w3-small">Work Order</label>
						<select id="tic_modal_wo" onchange="setWOIndex('ticket')" class="w3-input w3-border sibumis-input" tabindex="1">
							<option></option>
						</select>
					</div>
				</div>
			</div>
            <br>
            <div class="w3-row">
                <div class="w3-col l4 s12 w3-margin-right">
                    <label class="w3-label w3-small">Mode of Transportation</label>
					<select id="tic_modal_mode" class="w3-input w3-border sibumis-input" tabindex="2">
						<option value="Express">Express</option>
						<option value="Bus">Bus</option>
						<option value="Flight">Flight</option>
						<option value="Taxi">Taxi</option>
						<option value="Grab">Grab</option>
						<option value="Van">Van</option>
						<option value="Boat">Boat</option>
					</select>
                </div>
                <div class="w3-col l4 s12">
                    <label class="w3-label w3-small">Ticket No</label>
                    <input id="tic_modal_ticketno" value="" type="text" class="w3-input w3-border sibumis-input" tabindex="3"></input>
                </div>
            </div>
            <br>
            <div class="w3-row">
                <div class="w3-col l4 s12 w3-margin-right">
					<label class="w3-label w3-small">Origin</label>
                    <input id="tic_modal_origin" class="w3-input w3-border sibumis-input" tabindex="4"></input>
                </div>
                <div class="w3-col l4 s12">
					<label class="w3-label w3-small">Destination</label>
                    <input id="tic_modal_destination" class="w3-input w3-border sibumis-input" tabindex="5"></input>
                </div>
            </div>
            <br>
            <div class="w3-row">
                <div class="w3-col l4 s12">
                    <label class="w3-label w3-small">Price</label>
                    <input id="tic_modal_price" onkeyup="updateTicModal()" data-price="0" data-woindex="" data-itemindex="" type="text" class="w3-input w3-border sibumis-input" tabindex="6"></input>
                </div>
            </div>
			<br>
            <div class="w3-row">
                <div class="w3-col l4 s12">
                    <button id="tic_modal_save" class="w3-input w3-button w3-round-large w3-red" tabindex="7">Save</button>
                </div>
            </div>
            <br>
        </div>
        <footer class="w3-container w3-display-container edidik-gradient-ok">
        </footer>
    </div>
</div>


<!-- Reload modal -->
<div id="rel_modal" class="w3-modal">
    <div class="w3-modal-content w3-round-large">
        <header class="w3-container edidik-gradient-ok"> 
            <span onclick="document.getElementById('rel_modal').style.display='none';resetRelModal()" class="w3-button w3-large w3-display-topright">
                <i class="fa fa-times"></i>
            </span>
            <h2>
                <i class="fa fa-phone w3-margin-right"></i>Prepaid Reload
            </h2>
        </header>
        <div class="w3-container">
            <div id="rel_modal_woinput" data-woinput="0">
				<br>
				<div class="w3-row">
					<div class="w3-col l4 s12">
						<label class="w3-label w3-small">Work Order</label>
						<select id="rel_modal_wo" onchange="setWOIndex('reload')" class="w3-input w3-border sibumis-input" tabindex="1">
							<option></option>
						</select>
					</div>
				</div>
			</div>
            <br>
            <div class="w3-row">
                <div class="w3-col l4 s12 w3-margin-right">
                    <label class="w3-label w3-small">Telco</label>
					<select id="rel_modal_telco" class="w3-input w3-border sibumis-input" tabindex="2">
						<option value="Digi">Digi</option>
						<option value="Celcom">Celcom</option>
						<option value="Maxis">Maxis</option>
						<option value="Umobile">Umobile</option>
						<option value="XOX">XOX</option>
						<option value="Other">Other</option>
					</select>
                </div>
                <div class="w3-col l4 s12">
                    <label class="w3-label w3-small">Serial No</label>
                    <input id="rel_modal_serialno" value="" type="text" class="w3-input w3-border sibumis-input" tabindex="3"></input>
                </div>
            </div>
            <br>
            <div class="w3-row">
                <div class="w3-col l4 s12 w3-margin-right">
					<label class="w3-label w3-small">Tel No</label>
                    <input id="rel_modal_telno" class="w3-input w3-border sibumis-input" tabindex="5"></input>
                </div>
                <div class="w3-col l4 s12">
					<label class="w3-label w3-small">Month</label>
                    <input id="rel_modal_monthyear" type="month" class="w3-input w3-border sibumis-input" tabindex="6"></input>
                </div>
            </div>
            <br>
            <div class="w3-row">
                <div class="w3-col l4 s12">
                    <label class="w3-label w3-small">Amount</label>
                    <input id="rel_modal_amount" onchange="updateRelModal()" data-amount="0" data-woindex="" data-itemindex="" type="text" class="w3-input w3-border sibumis-input" tabindex="6"></input>
                </div>
            </div>
			<br>
            <div class="w3-row">
                <div class="w3-col l4 s12">
                    <button id="rel_modal_save" class="w3-input w3-button w3-round-large w3-red" tabindex="7">Save</button>
                </div>
            </div>
            <br>
        </div>
        <footer class="w3-container w3-display-container edidik-gradient-ok">
        </footer>
    </div>
</div>


<!-- Other modal -->
<div id="oth_modal" class="w3-modal">
    <div class="w3-modal-content w3-round-large">
        <header class="w3-container edidik-gradient-ok"> 
            <span onclick="document.getElementById('oth_modal').style.display='none';resetOthModal()" class="w3-button w3-large w3-display-topright">
                <i class="fa fa-times"></i>
            </span>
            <h2>
                <i class="fa fa-question w3-margin-right"></i>Other
            </h2>
        </header>
        <div class="w3-container">
            <div id="oth_modal_woinput" data-woinput="0">
				<br>
				<div class="w3-row">
					<div class="w3-col l4 s12">
						<label class="w3-label w3-small">Work Order</label>
						<select id="oth_modal_wo" onchange="setWOIndex('other')" class="w3-input w3-border sibumis-input">
							<option></option>
						</select>
					</div>
				</div>
			</div>
            <br>
            <div class="w3-row">
                <div class="w3-col l4 s12 w3-margin-right">
                    <label class="w3-label w3-small">Description</label>
                    <textarea id="oth_modal_desc" style="font-size: 0.8em;" value="" rows="5" class="w3-input w3-border sibumis-input"></textarea>
                </div>
                <div class="w3-col l4 s12">
                    <label class="w3-label w3-small">Example</label>
                    <p class="w3-text-gray">"Being claim for Delivery Order"</p>
                    <p class="w3-text-gray">"Being claim for purchase of X for office use as per attached"</p>
                </div>
            </div>
            <br>
            <div class="w3-row">
                <div class="w3-col l4 s12 w3-margin-right">
					<label class="w3-label w3-small">Quantity (if needed)</label>
                    <input id="oth_modal_quantity" class="w3-input w3-border sibumis-input"></input>
                </div>
            </div>
            <br>
            <div class="w3-row">
                <div class="w3-col l4 s12">
                    <label class="w3-label w3-small">Amount</label>
                    <input id="oth_modal_amount" onkeyup="updateOthModal()" data-amount="0" data-woindex="" data-itemindex="" type="text" class="w3-input w3-border sibumis-input"></input>
                </div>
            </div>
			<br>
            <div class="w3-row">
                <div class="w3-col l4 s12">
                    <button id="oth_modal_save" class="w3-input w3-button w3-round-large w3-red">Save</button>
                </div>
            </div>
            <br>
        </div>
        <footer class="w3-container w3-display-container edidik-gradient-ok">
        </footer>
    </div>
</div>

