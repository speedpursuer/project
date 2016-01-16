//
//  MyHybridPlugin.m
//  HybridIOSApp
//
//  Created by Holly Schinsky on 6/25/15.
//
//
#import "MyHybridPlugin.h"
#import "MainViewController.h"
#import "YYWebImageExample.h"
#import "YYImageDisplayExample.h"

@implementation MyHybridPlugin
-(void)addBookmark:(CDVInvokedUrlCommand*) command {
    NSString* bookmark = [command.arguments objectAtIndex:0];
    
    if(bookmark) {
        NSLog(@"addBookmark %@", bookmark);
		
        MainViewController* mvc = (MainViewController*)[self viewController];
		
		YYImageDisplayExample *vc = [YYImageDisplayExample new];
		
		vc.clipURL = bookmark;
		
		[mvc.navigationController pushViewController:vc animated:YES];
		[mvc.navigationController setNavigationBarHidden:NO];
		mvc.navigationController.navigationBar.tintColor = [UIColor blackColor];
		mvc.navigationController.navigationBar.barTintColor = [UIColor whiteColor];
		
//		mvc.webView.scrollView.scrollEnabled = NO;
//		mvc.webView.scrollView.bounces = NO;
		//mvc.webView.userInteractionEnabled = NO;
		
		/*
		YYWebImageExample *vc = [YYWebImageExample new];
		
		YYWebImageExample* vc = (YYWebImageExample*)mvc.navigationController.viewControllers[1];
		 
        MyTableViewController* tvc = (MyTableViewController*)mvc.tabBarController.viewControllers[1];
        [tvc.bookmarks addObject:bookmark];
        [tvc.tableView reloadData];
		*/
		 
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    } else {
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
}
@end
