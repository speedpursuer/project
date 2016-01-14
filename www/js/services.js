angular.module('app.services', [])

.factory('DBService', function($q, pouchdb, ErrorService) {

    var service = {};

    //var dbName = "bboy", remoteURL = "http://admin:12341234@localhost:5984/";    
    var dbName = "bboy", remoteURL = "http://121.40.197.226:4984/";
    var db = pouchdb.create(dbName), remoteDB = pouchdb.create(remoteURL + dbName);
            
    var list = [];	
		  
    service.setItems = function(_list) {			 			    			    	
    	list = _list;
    };
	service.getItems = function(){
	    return list;
	};	
	service.addItem = function(clipID) {
		service.getDoc(clipID).then(function(result){
    		list.push(result);
    	});	    	
    };
	service.removeItem = function(clipID) {	    	
    	for(var i=0;i<list.length;i++) {
    		if(list[i]._id == clipID) {
    			list.splice(i,1);
    			return true;
    		}
    	}
    };

    //deleteDB();
    //syncTo();
    
    //test();
    
    db.on('error', function (err) {    	
    	console.log(err);
    });
    
    //add();
    
    //test1();
    
    //find();
    
    function find() {
    	db.find({
        	selector: {
        		type: 'clip',
        		//favorite: true
        	}
        }).then(function(result ){
        	console.log(result);
        }).catch(function(err) {
        	console.log(err)
        }); 
    }
    
    function add() {
    	return db.put(
    		{
    			_id: "local_clip1",
    			favorite: true,
    			type: "local_ref",
    			localURL: "file://abc.gif",
    			//clipID: "clip1"
    		}
    	);
    }
    
    function test1() {
    	db.query(map1, {include_docs : true}).then(function (result) {
    		console.log(result);
    	}).catch(function (err) {
    		console.log(err);
    	});
    }
    
    function map1(doc) {
    	if (doc.type === 'local_ref') {
    	    emit(doc.localURL, {_id: doc.local_clipID});
    	}
    }
        
    function map2(doc) {
    	if (doc.type === 'clip') {
    	    emit({_id : doc.clipID, image : doc.image});
    	}
    }
    
    function test_() {
    	db.query('index/clips_by_playerID_local', {key: "player1", include_docs: true}).then(function (result) {
    		console.log(result);
    	}).catch(function (err) {
    		console.log(err);
    	});
    }
    
    function map(doc) {
    	// join artist data to albums
    	if (doc.type === 'clip') {
    		emit({_id : doc.clipID, favorite : doc.favorite});
    	}
	}
       
    
    function test() {
    	db.query(map, {include_docs : true}).then(function (result) {
    		console.log(result);
    	}).catch(function (err) {
    		console.log(err);
    	});
    }
    
    function installDB() {
    	syncFromRemote()
        .then(setUpIndex1)
        .then(setUpIndex2)
        //.then(setupView)            
        //.then(setUpFavorite)
        .then(markInstalled)
        .then(function(){
        	deferred.resolve("DB Created");
        })
        .catch(function (err){
            console.log(err);
            ErrorService.showModal();
            ErrorService.hideSplashScreen();
            deferred.reject(err);            
        });   
    }
    
    //function 
	
    service.init = function() {
        var deferred = $q.defer();    
        isDBInstalled().then(function(doc){
        		
        	service.getFavorite().then(function(result){
        		service.setItems(result.docs);
 	        	
 	        	syncFromRemote().then(function() {
 	        		deferred.resolve("DB Existed");
 	        	}).catch(function(){
 	        		deferred.resolve("DB Existed, Network disconnected");
 	        		ErrorService.showAlert("Network disconnected");
 	        	});
 	        	 	        	
 	        });
        	
                            
        }).catch(function(err){            
            syncFromRemote()
            .then(setUpIndex1)
            .then(setUpIndex2)
            //.then(setupView)            
            //.then(setUpFavorite)
            .then(markInstalled)
            .then(function(){
            	service.getFavorite().then(function(result){
            		service.setItems(result.docs);
     	        	deferred.resolve("DB Created"); 	        	
     	        });
            })
            .catch(function (err){
                console.log(err);
                ErrorService.showModal();
                ErrorService.hideSplashScreen();
                deferred.reject(err);            
            });   
        });
        return deferred.promise;        
    };

    service.init_ = function() {
        var deferred = $q.defer();    
        syncFromRemote().then(function(doc){
            deferred.resolve("sync successful");                
        }).catch(function(err) {
            deferred.resolve("sync failed");                            
            ErrorService.showAlert("Network disconnected");                 
        });
        return deferred.promise;   
    };

    service.syncRemote = function() {
        return syncFromRemote();
    };
    
    service.getDoc = function(id) {
    	return db.get(id);
    };

    service.getAllPlayers = function() {
        return db.find({
        	selector: {type: 'player'}
        });        
    };
    
    service.getClipsByPlayer = function(id) {
        return db.find({
        	selector: {
        		type: 'clip',
        		playerID: id
        	}
        });
    };
    
    service.getFavorite = function() {
    	return db.find({
        	selector: {
        		type: 'clip',
        		favorite: true
        	}
        }); 
    }
    
    service.getAllPlayers_old = function() {
        return db.query('index/by_type', {key: 'player', include_docs: true});        
    };

    service.getClipsByPlayer_old = function(playerID) {
        return db.query('index/by_playerID', {key: playerID, include_docs: true});
    };

    service.setLocalClip_new = function(clipID, dest, local) {
        db.find({
        	selector: {
        		type: "local", 
        		clipID: clipID        		
        	}
        }).then(function(result) {
        	var doc = result.docs[0];
        	if(doc) {
        		doc.local = local;
        		doc.image = dest;
        	} else {        		
        		doc = {
        			_id: "local_" + clipID,
        			type: "local",
        			clipID: clipID,
        			local: local,
        			image: dest
        		}        		
        	}
        	return db.put(doc);
        });
    };
    
    service.setLocalClip = function(clipID, dest) {
        var deferred = $q.defer();
        db.get(clipID).then(function(clip) {
            clip.image = dest;
            clip.local = true;
            db.put(clip).then(function() {
                deferred.resolve(dest);
            }).catch(function(err) {
                deferred.reject(err);
            });
        }).catch(function(err) {
            deferred.reject(err);
        });
        return deferred.promise;
    };
    
    service.setFavorite = function(clipID, favorite) {        
        db.get(clipID).then(function(clip) {
            clip.favorite = favorite;
            db.put(clip).then(function() {                
                setFavoriteBackup(clipID, favorite);
            });
        });
    };
    
    function setFavoriteBackup(_clipID, flag) {
    	db.find({
        	selector: {
        		type: "favorite", 
        		clipID: _clipID        		
        	}
        }).then(function(result) {
        	var doc = result.docs[0];
        	if(doc) {
        		doc.favorite = flag;
        		db.put(doc);
        	} else {
        		var id = "local";
        		if ( typeof(device) !== "undefined") {
        			id = device.uuid;
        		}
        		var favorite = {
        			_id: id + "_" + _clipID,
        			type: "favorite",
        			clipID: _clipID,
        			user: id,
        			favorite: flag
        		}
        		db.put(favorite);
        	}
        });
    }
    
    function deleteDB() {      
        db.destroy().then(function (response) {
            console.log(response);
        }).catch(function (err) {
            console.log(err);
        });
    }

    function syncFromRemote() {
        return db.replicate.from(remoteURL + dbName);
    }

    function setupView() {
        var ddoc = {
            _id: '_design/index',
            views: {
                clips_favorite: {
                    map: function(doc) {
                    	if (doc.type === 'clip') {
                    		emit(doc.playerID, {_id : doc.clipID, favorite : doc.favorite});
                    	}
                    }.toString()
                }                
            }   
        };
        return db.put(ddoc);
    }
    
    function setupView_old() {
        var ddoc = {
            _id: '_design/index',
            views: {
                by_type: {
                    map: function(doc) {
                        if (doc.type) {
                            emit(doc.type);
                        }
                    }.toString()
                },
                by_playerID: {
                    map: function(doc) {
                        if (doc.playerID && doc.type==='clip') {
                            emit(doc.playerID);
                        }
                    }.toString()
                }
            }   
        };
        return db.put(ddoc);
    }
    
    function setUpIndex1() {
    	return db.createIndex({
    		index: {
    			fields: ['type']
    		}
		});
    }
    
    function setUpIndex2() {
    	return db.createIndex({
    		index: {
    			fields: ['playerID']
    		}
		});
    }

    function setUpFavorite() {
    	return db.post({
	    		type: 'favorite',
	    		clipID: ''
	    	}	
    	)
    }
    
    function markInstalled() {
        return db.put({
            _id: 'DBInstalled',
            status: 'completed'
        });
    }

    function isDBInstalled() {
        return db.get('DBInstalled');
    }

    function syncTo() {
        return db.replicate.to(remoteURL + dbName, {
            live: false,
            retry: false
        });
    }

    return service;    
})

.factory('ClipService', function($q, $timeout) {

    var service = {};
    
    function GifWraper() {
       
        var gif = {};
        var gifiddle = {};

        return {
            loadFile: function(fileName) {
                var deferred = $q.defer();
        
                var rawFile = new XMLHttpRequest();
                rawFile.open("GET", fileName, true)
                rawFile.responseType = 'arraybuffer';

                gif = new GifFile();

                rawFile.onload = function(e) {                    
                    gif.load(this.response);        
                };            
                rawFile.send(null);

                gif.events.on('load', function() {
                    deferred.resolve(this);
                }.bind(this));

                gif.events.on('error', function(evt) {
                    deferred.reject(evt);
                }.bind(this));

                return deferred.promise;
            },
            renderView: function() {
                gifiddle = new Gifiddle();
                GifiddleControls(gifiddle);
                GifiddleAutoplay(gifiddle);
                gifiddle.setup(gif);
            },
            destroy: function() {                                                
                gifiddle.destroy();                
                gif = null;
                gifiddle = null;
            },
            stop: function() {
            	gifiddle.stop();
            }
        };
    }

    service.loadFile = function(fileName) {
        var gifWraper = new GifWraper();
        return gifWraper.loadFile(fileName);
    };

    service.renderView = function(gifWraper) {
        gifWraper.renderView();
    };

    service.destroy = function(gifWraper) {
        gifWraper.destroy();
        gifWraper = undefined;
    };
    
    service.stop = function(gifWraper) {
    	gifWraper.stop();    	
    };  
    
    service.groupClips = function(clips) {		
		var i = clips.length, returnObj = {};		
		while(i--) {
			if(returnObj[clips[i].move]){
	            returnObj[clips[i].move].push(clips[i]);
	        }else{
	            returnObj[clips[i].move] = [clips[i]];
	        }
		}
		return returnObj;			
	};
    
    return service;
})

.factory('ClipService_old', function($q, $timeout, DBService) {
    var service = {};
    
    var gif = new GifFile();
    var gifiddle = new Gifiddle();

    service.loadFile = function(fileName){    

        var deferred = $q.defer();
        
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", fileName, true)
        rawFile.responseType = 'arraybuffer';
        rawFile.onload = function(e) {     
            gif.byteLength = this.response.byteLength;    
            gif.load(this.response);        
        };            
        rawFile.send(null);

        gif.events.on('load', function() {
            deferred.resolve(gif);
        }.bind(this));

        gif.events.on('error', function(evt) {
            deferred.reject(evt);
        }.bind(this));

        return deferred.promise;
    };

    service.renderView = function(gif) {  	
        GifiddleControls(gifiddle);
        GifiddleAutoplay(gifiddle);
        gifiddle.setup(gif); 
    };

    service.destroy = function() {
    	gifiddle.destroy();        
    };
    
    service.stop = function() {        
        gifiddle.stop();    
    };

    return service;
})

.factory('FileCacheService', function($q, ImgCache) {

    var service = {};

    service.download = function(src) {

        var deferred = $q.defer();
               
        ImgCache.$promise.then(function() {

            ImgCache.cacheFile(src, function() {
                ImgCache.getCachedFileURL(src, function(src, dest) {
                    deferred.resolve(dest);
                });
            },
            function() {
                deferred.reject("download file error");
            },
            function(p) {
            	$("#progress").val(p.loaded/p.total);
            });
        });

        return deferred.promise;
    };

    return service;
}) 

.factory('ErrorService', function($rootScope, $ionicModal, $cordovaSplashscreen, $ionicPopup, $ionicLoading, $timeout) {
    var service = {};

    $ionicModal.fromTemplateUrl('templates/modal.html', {
        scope: $rootScope,
        animation: 'slide-in-up',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function(modal) {
        $rootScope.modal = modal;
    });

    service.showModal = function() {
        $rootScope.modal.show();
    };

    service.hideSplashScreen = function() {
        $timeout(function() {
            $cordovaSplashscreen.hide();
        }, 500);   
    };

    service.showAlert = function(title) {
        var alertPopup = $ionicPopup.alert({
            title: title,
            template: 'Please try again!'
        });

        alertPopup.then(function(res) {
        });
    };

    service.showDownLoader = function() {
        $ionicLoading.show({     
            template: '<span>Downloading...</span><progress max="1" id="progress"></progress>',
            hideOnStateChange: true
        });
    };
    
    service.showLoader = function(title) {
        $ionicLoading.show({
            template: title,
            hideOnStateChange: true
        });
    };

    service.hideLoader = function(alert) {
        $ionicLoading.hide();
        if (alert) {
            service.showAlert(alert);
        }       
    };

    return service;
})

/*
.factory('ClipService_old', function($q, $timeout, DBService) {
    var service = {};
    var gif = new GifFile();
    var gifiddle = {};

    service.loadFile = function(fileName){    

        var deferred = $q.defer();
        
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", fileName, true)
        rawFile.responseType = 'arraybuffer';
        rawFile.onload = function(e) {     
            gif.byteLength = this.response.byteLength;    
            gif.load(this.response);        
        };            
        rawFile.send(null);

        gif.events.on('load', function() {
            deferred.resolve(gif);
        }.bind(this));

        gif.events.on('error', function(evt) {
            deferred.reject(evt);
        }.bind(this));

        return deferred.promise;
    };

    service.renderView = function(gif) {
        gifiddle = new Gifiddle();
        GifiddleControls(gifiddle);
        GifiddleAutoplay(gifiddle);
        gifiddle.setup(gif); 
    };

    service.destroy = function() {
        gif.destroy();
        gif.destoryEvent();
        gifiddle.destroy();
        gifiddle = {};    
    };

    return service;
})   

.factory('BlankFactory', [function(){

}])

.service('BlankService', [function(){

}])

.factory('DataService', function(){


       
    service.ini_old = function() {
        var deferred = $q.defer();    
        isDBCompleted().then(function(doc){
            deferred.resolve("OK!");                
        }).catch(function(err){            
            syncFromRemote()
            .then(setupView)
            .then(markCompleted)
            .then()
            .then(function(){
                deferred.resolve("OK!");
            })
            .catch(function (err){
                console.log(err);
                deferred.reject(err);
            });   
        });
        return deferred.promise;        
    };
    var moveList = [
        {id: 1, playerID: "player1", playerName: 'Michael Jordan', name: 'Fadeaway', desc: 'desc', image: 'images/1.gif', thumb: "images/1.jpg"},
        {id: 2, playerID: "player1", playerName: 'Michael Jordan', name: 'Crossover', desc: 'desc', image: 'images/2.gif', thumb: "images/2.jpg"},
        {id: 3, playerID: "player1", playerName: 'Michael Jordan', name: 'Double-crossover', desc: 'desc', image: 'images/3.gif', thumb: "images/3.jpg"},
        {id: 4, playerID: "player1", playerName: 'Michael Jordan', name: 'Layup', desc: 'desc', image: 'images/4.gif', thumb: "images/4.jpg"},
        {id: 5, playerID: "player1", playerName: 'Michael Jordan', name: 'Fadeaway', desc: 'desc', image: 'images/5.gif', thumb: "images/5.jpg"},
        {id: 7, playerID: "player3", playerName: 'Allen Iverson', name: 'Layup', desc: 'desc', image: 'images/7.gif', thumb: "images/7.jpg"},
        {id: 8, playerID: "player2", playerName: 'Kobe Bryant', name: 'Reverse-Dunk', desc: 'desc', image: 'images/8.gif', thumb: "images/8.jpg"},
        {id: 9, playerID: "player1", playerName: 'Michael Jordan', name: 'Stay in air', desc: 'desc', image: 'images/9.gif', thumb: "images/9.jpg"},
    ];

    var moveList = [
        {id: 1, playerID: 1, playerName: 'Michael Jordan', name: 'Fadeaway', desc: 'desc', image: 'images/1.gif', thumb: "images/1.jpg"},
        {id: 2, playerID: 1, playerName: 'Michael Jordan', name: 'Crossover', desc: 'desc', image: 'images/2.gif', thumb: "images/2.jpg"},
        {id: 3, playerID: 1, playerName: 'Michael Jordan', name: 'Double-crossover', desc: 'desc', image: 'images/3.gif', thumb: "images/3.jpg"},
        {id: 4, playerID: 1, playerName: 'Michael Jordan', name: 'Layup', desc: 'desc', image: 'images/4.gif', thumb: "images/4.jpg"},
        {id: 5, playerID: 1, playerName: 'Michael Jordan', name: 'Fadeaway', desc: 'desc', image: 'images/5.gif', thumb: "images/5.jpg"},
        {id: 7, playerID: 3, playerName: 'Allen Iverson', name: 'Layup', desc: 'desc', image: 'images/7.gif', thumb: "images/7.jpg"},
        {id: 8, playerID: 2, playerName: 'Kobe Bryant', name: 'Reverse-Dunk', desc: 'desc', image: 'images/8.gif', thumb: "images/8.jpg"},
        {id: 9, playerID: 1, playerName: 'Michael Jordan', name: 'Stay in air', desc: 'desc', image: 'images/9.gif', thumb: "images/9.jpg"},
    ];

    var playerList = [
        {id: 1, name: "Michael Jordan", desc: "The great of all time", image: "images/p1.jpg"},
        {id: 2, name: "Kobe Bryant", desc: "The best player since MJ", image: "images/p2.jpg"},
        {id: 3, name: "Allen Iverson", desc: "The fastest SG", image: "images/p3.jpg"},        
    ]

    return {
        getMoveByID: function(id) {
            var result;
            angular.forEach(moveList, function(item, key){                                
                if (item.id === id) {
                    result = item;
                }
            });
            return result;
        },
        getMoveList: function() {
            return moveList;
        },
        getPlayerList: function() {
            return playerList;
        },
        getPlayerByID: function(id) {
            var result;
            angular.forEach(playerList, function(item, key){                                
                if (item.id === id) {
                    result = item;
                }
            });
            return result;
        },
        getMoveByPlayerID: function(id) {
            var result=[];
            angular.forEach(moveList, function(item, key){                                
                if (item.playerID === id) {
                    result.push(item);
                }
            });
            return result;
        }
    }
})

.factory('DBService', function(pouchdb) {

    //var dbName = "bboy", remoteURL = "http://admin:12341234@localhost:5984/";    
    var dbName = "bboy", remoteURL = "http://121.40.197.226:4984/";
    var db = pouchdb.create(dbName), remoteDB = pouchdb.create(remoteURL + dbName);
    
    setupView();
    //cleanView();

    //var dbName = "bboy", remoteURL = "http://admin:12341234@localhost:5984/";
    //var dbName = "player", remoteURL = "http://121.40.197.226:4984/";

    //var db = pouchdb.create(dbName), remoteDB = pouchdb.create(remoteURL + dbName);

    //createDB(dbName);
    //deleteDB(dbName);
    //createDB(dbName);
    //putDataInBatch();


    /*
    var replicationHandlerTo = db.replicate.to(remoteDB + dbName, {
        live: false,
        retry: false
    });

    var replicationHandlerFrom = db.replicate.from(remoteDB + dbName, {
        live: false,
        retry: false
    });

    function mapFunction(doc) {
        if (doc.type==="clip") {
            //emit(doc.playerID);
            emit(doc.playerID, {_id : doc.playerID, name: doc.name, desc: doc.desc, image: doc.image, thumb: doc.thumb});
        }
    }

    function testMap() {
        db.query(mapFunction, {
          key          : 'player1',
          include_docs : true
        }).then(function (result) {
          alert(result);
        }).catch(function (err) {
          alert(err);
        });
    }


    function setupView() {
        var ddoc = {
            _id: '_design/index',
            views: {
                by_type: {
                    map: function(doc) {
                        if (doc.type) {
                            emit(doc.type);
                        }
                    }.toString()
                },
                by_playerID: {
                    map: function(doc) {
                        if (doc.playerID && doc.type==='clip') {
                            emit(doc.playerID);
                        }
                    }.toString()
                }
            }   
        };
        // save it
        db.put(ddoc).then(function () {
            console.log("index success");
        }).catch(function (err) {
          // some error (maybe a 409, because it already exists?)
            console.log("index error");
            if (err.status == 409) {
                //alert("index already exists");
            }
        });    
    }

    function cleanView() {
        db.viewCleanup().then(function (result) {
            // handle result
        }).catch(function (err) {
            console.log(err);
        });
    }
            
    function deleteDB(dbName) {
        
        db.destroy(dbName).then(function (response) {
            console.log(response);
        }).catch(function (err) {
            console.log(err);
        });
        db.destroy().then(function (response) {
            console.log(response);
        }).catch(function (err) {
            console.log(err);
        });
    }
    function createDB(dbName) {
        db = pouchdb.create(dbName);
    }    
    function putDataInBatch() {
        db.bulkDocs([
            {_id: "player1", name: "Michael Jordan", desc: "The great of all time", image: "images/p1.jpg"},
            {_id: "player2", name: "Kobe Bryant", desc: "The best player since MJ", image: "images/p2.jpg"},
            {_id: "player3", name: "Allen Iverson", desc: "The fastest SG", image: "images/p3.jpg"},        
        ]).then(function (response) {
            console.log(response);
        }).catch(function (err) {
            console.log(err);
        });
    }
    
	return {        
        getPlayerList: function() {
            return db.allDocs({
                include_docs: true,
            });
        },
        getAllPlayers: function() {
            return db.query('index/by_type', {key: 'player', include_docs: true});
        },
        getClipsByPlayer: function(playerID) {
            return db.query('index/by_playerID', {key: playerID, include_docs: true});
        },
        syncTo: function() {
            return db.replicate.to(remoteURL + dbName, {
                live: false,
                retry: false
            });
        },
        syncFrom: function() {
            return db.replicate.from(remoteURL + dbName, {
                live: false,
                retry: false
            });
        },
        syncFromLive: function() {
            return db.replicate.from(remoteURL + dbName, {
                live: true,
                retry: true
            });
        },
        checkChanges: function() {
            return remoteDB.changes({
                since: 'now',
                live: true,
                include_docs: false
            });
        },
        getRemotePlayList: function() {
            db.replicate.from(remoteURL + dbName, {
                live: false,
                retry: false
            }).on('complete', function () {
                console.log("sync to remote completed"); 
                return db.allDocs({
                    include_docs: true,
                });
            }).on('error', function (err) {
                console.log(err);
            });
        },
        testQuery: function() {
            return db.query('index/by_type', {key: 'player', include_docs: true});
        },
        testQuery2: function() {
            return db.query('index/by_playerID', {key: 'player2', include_docs: true});
        },
        testQuery3: function() {
            testMap();
        }
    };	
});
*/
    