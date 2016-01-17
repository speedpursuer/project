angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/tab/player');

  $stateProvider

    .state('tabsController', {
      url: '/tab',
      abstract:true,
      templateUrl: 'templates/tabsController.html',
      resolve: {
    	init: function($stateParams, DBService) {
          return DBService.init();
        },
        /*
        init: function($stateParams, DBService) {
          return DBService.init();
        },        
        init: function($stateParams, FavoriteService) {
          return FavoriteService.setItems();
        }*/
      },
    })
        
    .state('tabsController.player', {
      url: '/player',
      resolve: {
        players: function($stateParams, DBService, init) {
          return DBService.getAllPlayers();
        }
      },
      views: {
        'tab1': {
          templateUrl: 'templates/player.html',
          controller: 'PlayerCtrl'
        }
      }
    })

    .state('tabsController.clips', {
      url: '/clips/:playerID, :playerName',
      /*
      resolve: {
        clips: function($stateParams, DBService) {
          return DBService.getClipsByPlayer($stateParams.playerID);         
        }
      },*/
      views: {
        'tab1': {
          controller: 'ClipsCtrl',
          templateUrl: 'templates/clips.html',
        }
      }
    })

    .state('tabsController.players', {
      url: '/players',
      /*
      resolve: {
        players: function($stateParams, DBService) {
          return DBService.getAllPlayers();
        }
      },*/
      views: {
        'tab2': {
          controller: 'PlayersCtrl',
          templateUrl: 'templates/players.html',
        }
      }
    }) 

    .state('tabsController.tab2Clips', {
      url: '/clips/:playerID, :playerName',    
      /*
      resolve: {
        clips: function($stateParams, DBService) {
          return DBService.getClipsByPlayer($stateParams.playerID);          
        }
      },*/
      views: {
        'tab2': {
          controller: 'ClipsCtrl',
          templateUrl: 'templates/clips.html',
        }
      }
    })   
  
    .state('tabsController.favorite', {
      url: '/favorite',
      /*
      cache: false,
      resolve: {
        clips: function(DBService) {
          return DBService.getFavorite();         
        }
      },*/
      views: {
        'tab3': {
          controller: 'FavorateCtrl',
          templateUrl: 'templates/favorite.html',
        }
      }
    })
});


/*
 .state('tabsController.play', {
      url: '/play/:fileURL, :clipID',      
      resolve: {
        gif: function($stateParams, ClipService) {
          return ClipService.loadFile($stateParams.fileURL);
        }
      },
      //cache: false,
      onExit: function(ClipService, gif){
        ClipService.destroy(gif);           
      },
      views: {
        'tab1': {
          controller: 'PlayCtrl',
          templateUrl: 'templates/play.html',
        }
      }
    })

  .state('tabsController.tab2play', {
      url: '/play/:fileURL, :clipID',     
      
      resolve: {
        gif: function($stateParams, ClipService) {
          //screen.unlockOrientation();
          return ClipService.loadFile($stateParams.fileURL);
        }
      },
      onExit: function(ClipService, gif){
        ClipService.destroy(gif); 
      },
      views: {
        'tab2': {
          controller: 'PlayCtrl',
          templateUrl: 'templates/play.html',
        }
      }
    })

  .state('tabsController.tab3play', {
      url: '/play/:fileURL, :clipID',
      resolve: {
        gif: function($stateParams, ClipService) {
          return ClipService.loadFile($stateParams.fileURL);
        }
      },
      onExit: function(ClipService, gif){
        ClipService.destroy(gif);     
      },
      views: {
        'tab3': {
          controller: 'PlayCtrl',
          templateUrl: 'templates/play.html',
        }
      }
    })

*/