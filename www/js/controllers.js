angular.module('app.controllers', [])

.controller('StarsCtrl', function($scope, $ionicSlideBoxDelegate, $state, DBService, ErrorService, stars) {
  	
	(function() {
		renderPlayList(stars);
	}());	  

 	function renderPlayList(results) {
 		$scope.stars = results.docs;
			$ionicSlideBoxDelegate.update();
			$ionicSlideBoxDelegate.slide(0);
			ErrorService.hideSplashScreen();
 	}

 	$scope.showMoves = function(playerID, playerName) {
		$state.go("tabsController.moves", {playerID: playerID, playerName: playerName});
	};	
})
   
.controller('ClipsCtrl', function($scope, $state, $stateParams, $ionicListDelegate, FileCacheService, DBService, ErrorService, AnimationService, clips) {
	
	var clipList = clips;

	$scope.listCanSwipe = true;	
	$scope.clips = clipList;
	$scope.playerName = $stateParams.playerName;
	$scope.moveName = $stateParams.moveName;
	//$scope.playingClipID = "";	
	$scope.playingClipIndex = "";	

	$scope.play = function(index) {	
		$scope.playingClipIndex = index;
		AnimationService.playAnimation(clipList[index].image, clipList[index].favorite, true);
	};

	$scope.updateFavorite = function(index) {
		$ionicListDelegate.closeOptionButtons();
		setFavorite(index);
	};

	$scope.updateFavoriteFromNative = function() {
		setFavorite($scope.playingClipIndex);
	};

	$scope.updateThumbFromNative = function() {
		if(clipList[$scope.playingClipIndex].thumb === "") {
			DBService.updateThumb(clipList[$scope.playingClipIndex]._id, clipList);			
		}
	};

	$scope.updateBothFromNative = function() {
		if(clipList[$scope.playingClipIndex].thumb === "") {
			DBService.updateBoth(clipList[$scope.playingClipIndex]._id, !clipList[$scope.playingClipIndex].favorite, clipList);	
		}else {
			setFavorite($scope.playingClipIndex);
		}		
	};

	function setFavorite(index) {
		DBService.updateFavorite(clipList[index]._id, clipList[index].local, !clipList[index].favorite);
		clipList[index].favorite = !clipList[index].favorite;
	}
})

.controller('FavorateCtrl', function($scope, $state, $ionicListDelegate, ErrorService, DBService, AnimationService) {
	
	//$scope.clips = clips.docs;			
	//$scope.clips = ClipService.groupClips(clips.docs);
	//$scope.shouldShowDelete = false;
 	//$scope.shouldShowReorder = false;

 	$scope.listCanSwipe = true;
	$scope.clips = DBService.getFavoriteList();
	//$scope.playingClipID = "";
	$scope.playingClipIndex = "";
	
	$scope.play = function(index) {		
		$scope.playingClipIndex = index;
		AnimationService.playAnimation($scope.clips[index].image, $scope.clips[index].favorite, false);
	};

	$scope.removeFavorite = function(index) {	
		$ionicListDelegate.closeOptionButtons();		
		setFavorite(index);
	};
	
	$scope.updateThumbFromNative = function() {		
		if($scope.clips[$scope.playingClipIndex].thumb === "") {
			DBService.updateThumb($scope.clips[$scope.playingClipIndex]._id, null);	
		}
	};

	function setFavorite(index) {
		DBService.updateFavorite($scope.clips[index]._id, $scope.clips[index].local, false);		
	}
	
	/*
	$scope.updateFavoriteFromNative = function() {
		if($scope.playingClipIndex !== "") {
			setFavorite($scope.playingClipIndex);
		}
	};

	function groupClips(clips) {		
		var i = clips.length, returnObj = {};		
		while(i--) {
			if(returnObj[clips[i].move]){
	            returnObj[clips[i].move].push(clips[i]);
	        }else{
	            returnObj[clips[i].move] = [clips[i]];
	        }
		}
		return returnObj;			
	}*/
})

.controller('PlayersCtrl', function($scope, $state, DBService) {
	//$scope.players = players;
	$scope.players = DBService.getPlayerList();
	
	/*
	DBService.getAllPlayers().then(function(results) {
		$scope.players = results.docs;
	}).catch(function (err) {              
		ErrorService.showAlert('Trouble in getting data');		
  	});*/

  	$scope.doRefresh = function() {
  		DBService.syncRemote()
  		.then(function(result) {
  			if(result.docs_written > 0) {
				DBService.getAllPlayers().then(function() {
					$scope.players = DBService.getPlayerList();
				}).catch(function (err) {              
		    		ErrorService.showAlert('Trouble in getting data');
		  		}).finally(function() {
	          		$scope.$broadcast('scroll.refreshComplete');
	          	});
  			} else {
				$scope.$broadcast('scroll.refreshComplete');
			}
  		}).catch(function (err){
  			ErrorService.showAlert('Trouble in getting data');
  			$scope.$broadcast('scroll.refreshComplete');
  		});		
	};	
		
	$scope.showMoves = function(playerID, playerName) {
		$state.go("tabsController.tab2Moves", {playerID: playerID, playerName: playerName});
	};
})

.controller('MovesCtrl', function($scope, $state, $stateParams, $ionicListDelegate, FileCacheService, DBService, ErrorService, moves) {
	
	//var clipList = clips.docs;

	$scope.moves = moves;
	$scope.playerName = $stateParams.playerName;

	$scope.showClips = function(moveName) {
		$state.go("tabsController.clips", {playerID: $stateParams.playerID, playerName: $stateParams.playerName, moveName: moveName});
	};

})

.controller('Tab2MovesCtrl', function($scope, $state, $stateParams, $ionicListDelegate, FileCacheService, DBService, ErrorService, moves) {
	
	//var clipList = clips.docs;

	$scope.moves = moves;
	$scope.playerName = $stateParams.playerName;

	$scope.showClips = function(moveName) {
		$state.go("tabsController.tab2Clips", {playerID: $stateParams.playerID, playerName: $stateParams.playerName, moveName: moveName});
	};

})

/*

$scope.doRefresh = function() {
  		DBService.syncRemote()
  		.then(function() {
			DBService.getStars().then(function(results) {
				renderPlayList(results);
			}).catch(function (err) {              
	    		ErrorService.showAlert('Trouble in getting data');
	  		});
  		}).catch(function (err){
  			ErrorService.showAlert('Trouble in getting data');
  		});		
	};	
	function updateListForFavorite(clipID, flag) {
		for(i in clipList) {
        	if(clipList[i]._id == clipID) {                
        		clipList[i].favorite = flag;
        		return;
        	}
    	}
	}

$scope.doRefresh = function() {
		DBService.syncRemote()
		.then(function(result) {
			if(result.docs_written > 0) {
				DBService.getClipsByPlayer($stateParams.playerID, $stateParams.moveName).then(function(result) {
	            	clipList = result;
    				$scope.clips = clipList;
	          	}).catch(function(err){
	           		ErrorService.showAlert('Trouble in getting data');
	          	}).finally(function() {
	          		$scope.$broadcast('scroll.refreshComplete');
	          	});
			} else {
				$scope.$broadcast('scroll.refreshComplete');
			}				
		}).catch(function (err){
  			ErrorService.showAlert('Trouble in getting data');
  			$scope.$broadcast('scroll.refreshComplete');
  		});
	};

.controller('Tab2ClipsCtrl', function($scope, $state, $stateParams, $ionicListDelegate, FileCacheService, DBService, ErrorService, AnimationService, clips) {
	
	$scope.listCanSwipe = true;
	
	$scope.clips = clips.docs;
	//$scope.clips = ClipService.groupClips(clips.docs);
	
	
	DBService.getClipsByPlayer($stateParams.playerID).then(function(result) {
    	$scope.clips = result.docs;
    	//$scope.clips = ClipService.groupClips(result.docs);
  	}).catch(function(err){
   		ErrorService.showAlert('Trouble in getting data');
  	});
	
	$scope.playerName = $stateParams.playerName;

	$scope.doRefresh = function() {
		DBService.syncRemote()
		.then(function(result) {
			if(result.docs_written > 0) {
				DBService.getClipsByPlayer($stateParams.playerID).then(function(result) {
	            	//$scope.clips = ClipService.groupClips(result.docs);
					$scope.clips = result.docs;
	          	}).catch(function(err){
	           		ErrorService.showAlert('Trouble in getting data');
	          	}).finally(function() {
	          		$scope.$broadcast('scroll.refreshComplete');
	          	});   
			} else {
				$scope.$broadcast('scroll.refreshComplete');
			}
		}).catch(function (err){
  			ErrorService.showAlert('Trouble in getting data');
  			$scope.$broadcast('scroll.refreshComplete');
  		});
	};

	$scope.download = function(clipID, src, local, index) {

		if(!local) {	
			ErrorService.showDownLoader();		
			FileCacheService.download(src).then(function(dest) {
				DBService.setLocalClip(clipID, dest).then(function() {
					$scope.clips[index].local = true;
					$scope.clips[index].image = dest;
					ErrorService.hideLoader();
					//$state.go("tabsController.play", {fileURL: src, clipID: clipID});
				}).catch(function(err) {
					console.log(err);
					ErrorService.hideLoader('Download error');
				});
			}).catch(function(err) {
				console.log(err);
				ErrorService.hideLoader('Download error');
			});
		}else {
			ErrorService.showLoader('Loading...');
			$state.go("tabsController.tab2play", {fileURL: src, clipID: clipID});
		}
		
	};
	
	$scope.play = function(clipURL) {
		AnimationService.playAnimation(clipURL);
	};
	
	$scope.test = function() {
		alert("call from navtive app");
	};
	
	$scope.setFavorite = function(clipID) {
		//$scope.favorite = !$scope.favorite;
		DBService.setFavorite(clipID, true);
		DBService.addItem(clipID);
		$ionicListDelegate.closeOptionButtons();
		//$scope.shouldShowDelete = false;

		if($scope.favorite) {
			DBService.addItem(clipID);
		} else {
			DBService.removeItem(clipID);
		}
	};
})

.controller('PlayCtrl', function($scope, $rootScope, $stateParams, $ionicHistory, ClipService, DBService, gif) {

	ClipService.renderView(gif);	
	getFavorite($stateParams.clipID);
	$scope.gif = gif;
	$scope.hideNavBar = false;
	
	$scope.fullScreen = function() {
		$scope.hideNavBar = !$scope.hideNavBar;
	};	
	
	$scope.setFavorite = function() {
		$scope.favorite = !$scope.favorite;
		DBService.setFavorite($stateParams.clipID, $scope.favorite);
		if($scope.favorite) {
			DBService.addItem($stateParams.clipID);
		} else {
			DBService.removeItem($stateParams.clipID);
		}
	};
	
	$scope.goBack = function() {		
		ClipService.stop($scope.gif);
		$ionicHistory.goBack();
	};
	
	function getFavorite(clipID) {
		DBService.getDoc(clipID).then(function(result) {
			if(result.favorite) {
				$scope.favorite = result.favorite;
			} else {
				$scope.favorite = false;
			}
		})
	}
})


.controller('ClipsCtrl', function($scope, $state, $stateParams, $ionicListDelegate, FileCacheService, DBService, ErrorService, AnimationService, clips, ClipService) {
	
	$scope.listCanSwipe = true;
	
	//$scope.clips = DBService.getClipsByPlayer($stateParams.playerID).docs;
	

	DBService.getClipsByPlayer($stateParams.playerID).then(function(result) {
    	$scope.clips = result.docs;
    	//$scope.clips = ClipService.groupClips(result.docs);
  	}).catch(function(err){
   		ErrorService.showAlert('Trouble in getting data');
  	});
	
	$scope.clips = clips.docs;
	
	//$scope.clips = ClipService.groupClips(clips.docs);
	
	$scope.playerName = $stateParams.playerName;

	$scope.playingClipID = "";

	$scope.doRefresh = function() {
		DBService.syncRemote()
		.then(function(result) {
			if(result.docs_written > 0) {
				DBService.getClipsByPlayer($stateParams.playerID).then(function(result) {
	            	$scope.clips = result.docs;
	            	//$scope.clips = ClipService.groupClips(result.docs);
	          	}).catch(function(err){
	           		ErrorService.showAlert('Trouble in getting data');
	          	}).finally(function() {
	          		$scope.$broadcast('scroll.refreshComplete');
	          	});
			} else {
				$scope.$broadcast('scroll.refreshComplete');
			}				
		}).catch(function (err){
  			ErrorService.showAlert('Trouble in getting data');
  			$scope.$broadcast('scroll.refreshComplete');
  		});
	};

	$scope.download = function(clipID, src, local, index) {

		if(!local) {	
			ErrorService.showDownLoader();		
			FileCacheService.download(src).then(function(dest) {
				DBService.setLocalClip(clipID, dest).then(function() {
					$scope.clips[index].local = true;
					$scope.clips[index].image = dest;
					ErrorService.hideLoader();
					//$state.go("tabsController.play", {fileURL: src, clipID: clipID});
				}).catch(function(err) {
					console.log(err);
					ErrorService.hideLoader('Download error');
				});
			}).catch(function(err) {
				console.log(err);
				ErrorService.hideLoader('Download error');
			});
		}else {
			ErrorService.showLoader('Loading...');
			$state.go("tabsController.play", {fileURL: src, clipID: clipID});
		}
		
	};
	
	$scope.play = function(clipURL, clipID) {
		$scope.playingClipID = clipID;
		AnimationService.playAnimation(clipURL);
	};
	
	$scope.setFavorite = function(clipID) {
		//$scope.favorite = !$scope.favorite;
		DBService.setFavorite(clipID, true);
		DBService.addItem(clipID);
		$ionicListDelegate.closeOptionButtons();
		//$scope.shouldShowDelete = false;
		
		if($scope.favorite) {
			DBService.addItem(clipID);
		} else {
			DBService.removeItem(clipID);
		}
	};

	$scope.updateClipThumb = function() {
		if($scope.playingClipID != "") {
			ClipService.updateClipThumb($scope.playingClipID);
		}
	};
})   

*/   
	/*
	var gifiddle = new Gifiddle();

	DBService.getClip($stateParams.clipID).then(function(result) {
		console.log("get clip succes");
		render(result.gif);
	}).catch(function() {
		console.log("get clip error");
	});
	    function render(gif) {        
    }

	$ionicModal.fromTemplateUrl('templates/modal.html', {
		scope: $scope,
	    animation: 'slide-in-up'
	}).then(function(modal) {
	   	$scope.modal = modal;
	});

	function hideSplashScreen()
	{
		$timeout(function() {
        	$cordovaSplashscreen.hide();
        }, 500);     
	}

	$scope.select =function(id) {
  		alert(id);
	};	

	function iniWithSync() {		
		DBService.ini()
		.then(function() {
			sync().then(function(){
				getPlayerList(true);	
			}).catch(function() {
				getPlayerList(true);
				showAlert();
			});
		}).catch(function(){
			$scope.modal.show();
	  		hideSplashScreen();
		});
	}


	function iniWithSync_old() {		
		DBService.ini()
		.then(function() {
			sync().then(function(){
				getPlayerList(true);	
			}).catch(function() {
				getPlayerList(true);
				showAlert();
			});
		}).catch(function(){
			$scope.modal.show();
	  		hideSplashScreen();
		});
	}

	
	function int() {
		DBService.ini().then(function(response){	  		
	  		getPlayerList(true);
	  	}).catch(function(err){
	  		$scope.modal.show();
	  		hideSplashScreen();
	  	});
	}
	
	function sync() {
		return DBService.syncRemote();
	}
	
	function showAlert() {
   		var alertPopup = $ionicPopup.alert({
     		title: 'Network disconnected',
     		template: 'Please try again!'
   		});

   		alertPopup.then(function(res) {     		
   		});
 	};


	function getPlayerList(firstLoad) {
		DBService.getAllPlayers().then(function(results) {
			$scope.players = results.rows;
			$ionicSlideBoxDelegate.update();
			$ionicSlideBoxDelegate.slide(0);
			if(firstLoad) {
				hideSplashScreen();
			}			
		}).catch(function (err) {
	    	console.log(err);
	  	});
	}		

	function hideSplashScreen()
	{
		$timeout(function() {
        	$cordovaSplashscreen.hide();
        }, 500);     
	}
	function setUpdateFlag(flag, invokeApply) {
		$scope.hasUpdate = flag;
		if(invokeApply) {
			$scope.$apply();
		}		
	}
	$scope.doRefresh = function() {
	    
	    DBService.getRemotePlayList().then(function (results) {
            $scope.players = results.rows;		
			$ionicSlideBoxDelegate.update();
			//$scope.$broadcast('scroll.refreshComplete');
        })
	    .finally(function(err) {
	       	console.log(err); 
	       	$scope.$broadcast('scroll.refreshComplete');
	    });
		DBService.syncFrom().on('complete', function () {
            console.log("sync from remote completed"); 
            getPlayerList();
            $scope.$broadcast('scroll.refreshComplete');
            //$scope.hasUpdate = false;
        }).on('error', function (err) {
            console.log(err); 
            $scope.$broadcast('scroll.refreshComplete');
        });
	};

	function setUpdateFlag(flag, invokeApply) {
		$scope.hasUpdate = flag;
		if(invokeApply) {
			$scope.$apply();
		}		
	}

	function syncFromRemote() {
		DBService.syncFrom().on('complete', function () {
            console.log("sync from remote completed"); 
            getPlayerList();
        }).on('error', function (err) {
            console.log(err); 
        });
	}

	function syncToRemote() {
		DBService.syncTo().on('complete', function () {
            console.log("sync to remote completed"); 
            getPlayerList();
        }).on('error', function (err) {
            console.log(err); 
        });
	}

	function syncFromRemoteLive() {
		DBService.syncFromLive()
		.on('change', function (change) {
			setUpdateFlag(true, true);
		}).on('paused', function (info) {
		  	// replication was paused, usually because of a lost connection
		  	//alert("paused");
		}).on('active', function (info) {
		  	// replication was resumed
		}).on('error', function (err) {
		  	// totally unhandled error (shouldn't happen)
		  	//alert("error");
		  	//var delay = 0
		  	
		  	$interval(function() {
		  		syncFromRemoteLive();
		  	}, 10000);
			$scope.showConfirm();
		});
	}

	function getPlayerList() {
		DBService.getAllPlayers().then(function(results) {
			$scope.players = results.rows;	
			setUpdateFlag(false, false);	
			$ionicSlideBoxDelegate.update();
			$ionicSlideBoxDelegate.slide(0);
		}).catch(function (err) {              
	    	console.log(err);
	  	});
	}

	function getPlayerList1() {
		DBService.getPlayerList().then(function(results) {
			
			var list = results.rows;

			//for(var i =0; i < results.rows.length; i++) {
			var i = list.length;
			while(i--) {
				if (list[i].doc.type !== "player") {
					list.splice(i,1);					
				}
			}
			$scope.players = list;	
			setUpdateFlag(false, false);	
			$ionicSlideBoxDelegate.update();
			$ionicSlideBoxDelegate.slide(0);
		}).catch(function (err) {              
	    	console.log(err);
	  	});
	}

	function getStaticList() {
		
	}
 
	function check() {
		DBService.checkChanges().on('change', function (change) {
			console.log('Getting changes');
			//$scope.hasUpdate = true;
			//$scope.showConfirm();
			syncFromRemote();
		}).on('error', function (err) {
			console.log('Error for getting changes');
		});
	}

	function test() {
		DBService.testQuery3();
	}

	function getClipList() {
		DBService.getClipsByPlayer("player2").then(function (result) {           	
           	alert(result);
        }).catch(function (err) {
          	alert(err);
        });
	}
	*/
 