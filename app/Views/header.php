<!DOCTYPE html>
<html lang="en">
    <title>ClaimMaker (demo)</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="/css/w3.css">
    <link rel="stylesheet" href="/css/sibumis.css">
    <link rel="stylesheet" href="/css/fontawesome.min.css">
    <link rel="stylesheet" href="/css/solid.min.css">
    <style>
        body,h1,h2,h3,h4,h5 {font-family: "Poppins", sans-serif}
        body {font-size:16px;}
        .w3-half img{margin-bottom:-6px;margin-top:16px;opacity:0.8;cursor:pointer}
        .w3-half img:hover{opacity:1}
    </style>
<body>

    <!-- Sidebar/menu -->
    <nav class="w3-sidebar w3-collapse w3-top w3-large w3-padding sibumis-gradient-blue" style="z-index:3;width:300px;font-weight:bold;" id="mySidebar"><br>
        <a href="javascript:void(0)" onclick="w3_close()" class="w3-button w3-hide-large w3-display-topleft" style="width:100%;font-size:22px">Close Menu</a>
        <div class="w3-container w3-padding-64">
            <h2 class="w3-center w3-border"><b>ClaimMaker</b></h2>
            <p class="w3-small w3-center w3-text-light-gray">by Mohamad Shahrim</p>
        </div>
        <div class="w3-bar-block">
            <a href="https://github.com/mohdshahrim/claimmaker-demo" onclick="w3_close()" class="w3-bar-item w3-button w3-hover-white">Source Code</a>
            <a onclick="aboutModal()" class="w3-bar-item w3-button w3-hover-white">About</a>
        </div>
    </nav>

    <!-- Top menu on small screens -->
    <header class="w3-container w3-top w3-hide-large sibumis-gradient-blue w3-xlarge w3-padding">
        <a href="javascript:void(0)" class="w3-button w3-margin-right" onclick="w3_open()">☰</a>
        <span>IT Department</span>
    </header>

    <!-- Overlay effect when opening sidebar on small screens -->
    <div class="w3-overlay w3-hide-large" onclick="w3_close()" style="cursor:pointer" title="close side menu" id="myOverlay"></div>

    <!-- !PAGE CONTENT! -->
    <div class="w3-main" style="margin-left:340px;margin-right:40px">
    
    <div id="about_modal" class="w3-modal">
        <div class="w3-modal-content w3-round-large">
            <header class="w3-container edidik-gradient-ok"> 
                <span onclick="document.getElementById('about_modal').style.display='none';resetOthModal()" class="w3-button w3-large w3-display-topright">
                    <i class="fa fa-times"></i>
                </span>
                <h2>
                    <i class="fa fa-question w3-margin-right"></i>About
                </h2>
            </header>
            <div class="w3-container">
                <h3>FOR DEMO PURPOSE ONLY</h3>
                <p>This web application were part of a bigger system, and has been stripped down into this demo version.</p>
                <p>As the name implies, ClaimMaker, is used to generate PDF file of a claim submission form.</p>
                <p>Popular among the users, ClaimMaker offers a quicker and cleaner ways to produce and print the form, than the old manual ways (Excel, Word).</p>
                <p>No license or fee is needed to use or obtain ClaimMaker. It is free and open source. However, in respect with privacy, branding and identity of the organization where it was used from, the author has modified some content to match fiction organization. The author also does not guarantee any quality or be responsible for any damage resulting from this product. In addition, you might want to observe the usage term of the libraries and resources that were used to develop this web app, such as W3CSS, MinAjax, Fontawesome and CodeIgniter 4.</p>
                <br>
                <br>
                <p>Thank you<p>
                <p>M. Shahrim, author</p>
            </div>
            <footer class="w3-container w3-display-container edidik-gradient-ok">
            </footer>
        </div>
    </div>

    <script>
        function aboutModal() {
            document.getElementById('about_modal').style.display='block';
        }
    </script>