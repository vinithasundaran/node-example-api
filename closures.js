function celebrityIDCreator (theCelebrities) {
    var i;
    var uniqueID = 100;
    for (i = 0; i < theCelebrities.length; i++) {

      
      theCelebrities[i]["id"] = function ()  {
        return uniqueID + i;
       
      }
      console.log(theCelebrities[i]["id"] );
    }
    
    return theCelebrities;
}

var a = [{name:"vini",id:0},{name:"pavi",id:0},{name:"surya",id:0}];

var celebs = celebrityIDCreator(a);

console.log(celebs);

