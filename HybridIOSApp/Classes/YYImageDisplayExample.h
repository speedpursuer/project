//
//  YYImageDisplayExample.h
//  YYKitExample
//
//  Created by ibireme on 15/8/9.
//  Copyright (c) 2015 ibireme. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "CircleProgressBar.h"

@interface YYImageDisplayExample : UIViewController
@property (nonatomic, strong) NSString *clipURL;
@property (weak, nonatomic) IBOutlet CircleProgressBar *circleProgressBar;
@end
