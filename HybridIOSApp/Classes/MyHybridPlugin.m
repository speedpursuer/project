//
//  MyHybridPlugin.m
//  HybridIOSApp
//
//  Created by Holly Schinsky on 6/25/15.
//
//
#import "MyHybridPlugin.h"
#import "MainViewController.h"
#import "YYImageDisplayExample.h"

@implementation MyHybridPlugin
-(void)addBookmark:(CDVInvokedUrlCommand*) command {
    NSString* bookmark = [command.arguments objectAtIndex:0];
    
    if(bookmark) {
		
        MainViewController* mvc = (MainViewController*)[self viewController];
		
//		NSArray *controllers = [mvc.navigationController viewControllers];
//		
//		MainViewController* a =[controllers objectAtIndex:0];
//		
//		[a.webView stringByEvaluatingJavaScriptFromString:@"javaScriptCall();"];
		
		YYImageDisplayExample *vc = [YYImageDisplayExample new];
		
		vc.clipURL = bookmark;
		
		[mvc.navigationController pushViewController:vc animated:YES];
		[mvc.navigationController setNavigationBarHidden:NO];
		mvc.navigationController.navigationBar.tintColor = [UIColor blackColor];
		mvc.navigationController.navigationBar.barTintColor = [UIColor whiteColor];
		
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    } else {
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
}
@end
