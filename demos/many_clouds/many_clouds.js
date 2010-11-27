var eggenburg = null;
var acorn = null;
var mickey = null;

var r = 0;
var ps = null;

var buttonDown = false;
var zoomed = -50;

var rot =[0, 0];
var curCoords = [0, 0];

function zoom(amt){
  var invert = document.getElementById('invertScroll').checked ? -1: 1;
  zoomed += amt * 2 * invert;
  if(buttonDown){
    addPNG();
  }
}

function mousePressed(){
  curCoords[0] = ps.mouseX;
  curCoords[1] = ps.mouseY;
  buttonDown = true;
}

function mouseReleased(){
  buttonDown = false;
}

function updateStatus(cloud, str){
  var status = document.getElementById(str);
  status.innerHTML = "";
  switch(cloud.getStatus()){
    case 1: status.innerHTML = "STARTED";break;
    case 2: status.innerHTML = "STREAMING";break;
    case 3: status.innerHTML = "COMPLETE";break;
    default:break;
  }
}

function updateProgress(cloud, str){
  var prog = document.getElementById(str);
  prog.innerHTML = Math.floor(cloud.getProgress()*100) + "%";
}

function updatePointCount(cloud, str){
  var numPoints = cloud.getNumPoints();
  if(numPoints >= 0){
    var elem = document.getElementById(str);
    elem.innerHTML = numPoints;
  }
}

function render() {
  r += 0.05;
  
  $('#progressbar1').progressbar( 'value' , acorn.getProgress() * 100 );
  $('#progressbar2').progressbar( 'value' , mickey.getProgress() * 100 );
  $('#progressbar3').progressbar( 'value' , eggenburg.getProgress() * 100 );

  var deltaX = ps.mouseX - curCoords[0];
  var deltaY = ps.mouseY - curCoords[1];
  
  if(buttonDown){
    rot[0] += deltaX / ps.width * 5;
    rot[1] += deltaY / ps.height * 5;
    
    curCoords[0] = ps.mouseX;
    curCoords[1] = ps.mouseY;
  }

  // transform point cloud
  ps.translate(0, 0, zoomed);
    
  ps.rotateY(rot[0]);
  ps.rotateX(rot[1]);

  // clear the canvas
  ps.clear();
  
  // draw mickey
  var c = mickey.getCenter();
  ps.translate(-c[0], -c[1], -c[2]);
  ps.pointSize(8);
  ps.render(mickey);

  ps.translate(0, -17, 0);
  ps.render(eggenburg);

  ps.translate(0, 17, 0);
    
  // draw acorn
  ps.pointSize(5);
  ps.translate(c[0], c[1], c[2]);

  ps.translate(15, 28, -8);
  ps.rotateX(0.5);
  ps.rotateY(r);
  c = acorn.getCenter();
  ps.translate(-c[0], -c[1], -c[2]);
  ps.scale(0.8);

  ps.render(acorn);
  
  updateStatus(acorn, "acornStatus");
  updateStatus(mickey, "mickeyStatus");
  updateStatus(eggenburg, "villageStatus");  

  updatePointCount(acorn, "acornNumPoints");
  updatePointCount(mickey, "mickeyNumPoints");
  updatePointCount(eggenburg, "eggenburgNumPoints");
  
  var fps = Math.floor(ps.frameRate);
  if(fps < 1){
    fps = "< 1";
  }
  
  document.getElementById("fps").innerHTML = fps + " FPS";
}

function start(){
  ps = new PointStream();
  ps.setup(document.getElementById('canvas'));
  ps.background([0, 0, 0, 0.5]);

  ps.onRender = render
  ps.onMouseScroll = zoom;
  ps.onMousePressed = mousePressed;
  ps.onMouseReleased = mouseReleased;
  
  acorn = ps.load("../../clouds/acorn.asc");
  mickey = ps.load("../../clouds/mickey.asc");
  eggenburg = ps.load("../../clouds/eggenburg.asc");
}