//
//  ViewController.m
//  HybridIOSApp
//
//  Created by 邢磊 on 16/1/14.
//
//

#import "RootViewController.h"
//#import "YYImageExample.h"
#import "MainViewController.h"

@interface RootViewController ()

@end

@implementation RootViewController

- (void)viewDidLoad {
    [super viewDidLoad];
//    YYImageExample *vc = [YYImageExample new];
//    [self pushViewController:vc animated:NO];
    MainViewController *vc = [MainViewController new];
    [self pushViewController:vc animated:NO];
    [self setNavigationBarHidden:YES];
}

@end
