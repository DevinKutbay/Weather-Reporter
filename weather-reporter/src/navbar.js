function loadPage(navbarhighlight) {
    $("#navbar").html(`
    <img src="img/logo1.png" width=25 height=25 onclick="window.location.href='index.html'">
    <a href="about.html"`+ ((navbarhighlight == 3) ? `class="active"` : "") + `>/about</a>
    <a href="contact.html"`+ ((navbarhighlight == 4) ? `class="active"` : "") + `>/contact</a>
    <a href="projects.html"`+ ((navbarhighlight == 2) ? `class="active"` : "") + `>/projects</a>
    <a id ="link", href="index.html"` + ((navbarhighlight == 1) ? `class="active"` : "") + `>/home</a>
    <a href="javascript:void(0);" id="navbaricon" class="icon" onclick="showNavbar()">
        <span class="material-icons-round" style="font-size: 100%;">
            menu
        </span>
    </a>
    `);
};
var x = document.getElementById("navbar");

function showNavbar() {
  if (x.className === "topnav") {
    x.className += " responsive";
    $(".responsive").animate({height:300},200);
    document.getElementById("opacity").style.opacity=0.2;
  } else {$
    $(".responsive").animate({height:55},200);
    x.className = "topnav";
    document.getElementById("opacity").style.opacity=1;
  }
};

function hideNavbar(){
  if(x.className ==="topnav responsive"){
    $(".responsive").animate({height:55},200);
    document.getElementById("opacity").style.opacity=1;
  }
};
function showagain(){
  if(x.className ==="topnav responsive"){
    $(".responsive").animate({height:300},200);
    document.getElementById("opacity").style.opacity=0.02;
  }
}

$(window).resize(function() {
    if(window.innerWidth > 600){
      hideNavbar();
    } else if (window.innerWidth < 600){
      showagain();
    }
});


const cursor = document.querySelector('.cursor');

document.addEventListener('mousemove', e => {
    cursor.setAttribute("style", "top: "+(e.pageY - 10)+"px; left: "+(e.pageX - 10)+"px;")
})

document.addEventListener('click', () => {
    cursor.classList.add("expand");

    setTimeout(() => {
        cursor.classList.remove("expand");
    }, 500)
})


$(".move-area").mousemove(function(event) {
  var eye = $(".eye");
  var x = (eye.offset().left) + (eye.width() / 2);
  var y = (eye.offset().top) + (eye.height() / 2);
  var rad = Math.atan2(event.pageX - x, event.pageY - y);
  var rot = (rad * (180 / Math.PI) * -1) + 180;
  eye.css({
    '-webkit-transform': 'rotate(' + rot + 'deg)',
    '-moz-transform': 'rotate(' + rot + 'deg)',
    '-ms-transform': 'rotate(' + rot + 'deg)',
    'transform': 'rotate(' + rot + 'deg)'
  });
});

var tabs = document.getElementById('tabs');
var ps = tabs.getElementsByTagName('p');
var p;
var spans;
var span;
var w;
var wTab = 70;

for (var i = 0; i < ps.length; i++)
{   p = ps.item(i);
    spans = p.getElementsByTagName('span');
    for (var j = 0; j < spans.length - 1; j++)
    {   span = spans.item(j);
        w = span.offsetWidth;
        w = Math.ceil(w / wTab) * wTab - w;
        span.style.paddingRight = w + 'px';
    }
}

