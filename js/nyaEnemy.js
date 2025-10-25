// JavaScript Document
var scaleX = 1.3;
var cOffset = {
	x: 0,
	y: -0.5
};
var powerUpTiming = -1;

function garmadon() {

}
var lightSpot = -1;
//level4Text,headingText
function jitter(inval) {
	return inval + (Math.random() * 0.5 - 0.25);
}

function Lerp(fl1, fl2, delta) {
	return (fl1 * (1 - delta)) + (fl2 * delta);
}
var fxDirections = [new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, -1, 0), new THREE.Vector3(-1, 0, 0)];

function player() {
	// Detect swipes and turn into motions

	this.updatePlayer = function () {

		//var difAngle =  this.targetAngle - this.obj.rotation.y ;
		//if (difAngle>Math.PI/2) difAngle-=2*Math.PI;
		//if (difAngle<-Math.PI) difAngle+=2*Math.PI;

		//this.obj.rotation.set(Math.PI/2, this.obj.rotation.y+difAngle*0.25 ,0);

	}
}

function slingObject() {
	
	this.velocity = new THREE.Vector3(0,0,0);
	this.slingPos = new THREE.Vector3(0,2,0);
	
	var material = new MeshLineMaterial({color: new THREE.Color(0xb22525), sizeAttenuation:true, lineWidth: 0.5});//{ color: 0xff0000, lineWidth: 0.3 });
	//this.slingMaterial.lineWidth = 8;
	//this.slingMaterial.color = new THREE.Color(0xff0000);
	this.slingPoints = new THREE.Geometry();
	this.slingPoints.vertices.push(new THREE.Vector3(  0,   0, -1));
	this.slingPoints.vertices.push(new THREE.Vector3(2.7,-0.8, -1));
	this.slingPoints.vertices.push(new THREE.Vector3(2.5,  -1, -1));
	this.slingPoints.vertices.push(new THREE.Vector3(  0,-0.2, -1));
	this.slingLine = new MeshLine();
	
	this.slingLine.setGeometry(this.slingPoints);//, this.slingMaterial
	//console.log(this.slingLine);
	var mesh = new THREE.Mesh(this.slingLine.geometry, material);
	scene.add(mesh);
	
	this.update = function () {
		
		if (flyState==1){
			this.velocity.copy( this.slingPos.sub(playerPos));
			if (playerPos.x<0) {
				flyState = 2; // Slingshot bounces around
				startAnim("fly", playerObj.obj);
			}
		} 
		if (flyState==1){
			slingShotSeat.position.copy(playerPos);
			this.slingPos.copy( playerPos );
		} else {
			if (thisTouch.x>-100) {
				slingShotSeat.position.copy(playerPos);
				
				this.slingPos.copy( playerPos );
			} else {
				this.velocity.x = (this.velocity.x*0.95)-(0.2*(-1+this.slingPos.x));
				this.velocity.y = (this.velocity.y*0.95)-(0.2*this.slingPos.y);
				this.velocity.add(gravity);
				this.slingPos.add(this.velocity);
				slingShotSeat.position.copy(this.slingPos);
				if (flyState==0) {
					playerPos.copy( this.slingPos );
					playerObj.obj.position.copy(playerPos);
				}
			}
		}
		this.slingPoints.vertices[1].x = 1.5+this.slingPos.x;
		this.slingPoints.vertices[1].y = -0.9+this.slingPos.y;
		this.slingPoints.vertices[2].x = 1.3+this.slingPos.x;
		this.slingPoints.vertices[2].y = -1.1+this.slingPos.y;
		this.slingLine.setGeometry(this.slingPoints);
		
	}
	
}
