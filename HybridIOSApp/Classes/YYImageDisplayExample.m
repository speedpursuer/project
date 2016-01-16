//
//  YYImageDisplayExample.m
//  YYKitExample
//
//  Created by ibireme on 15/8/9.
//  Copyright (c) 2015 ibireme. All rights reserved.
//

#import "YYImageDisplayExample.h"
#import "YYImage.h"
#import "UIView+YYAdd.h"
#import "YYImageExampleHelper.h"
#import <sys/sysctl.h>
#import "MBCircularProgressBarView.h"
#import "MainViewController.h"


@interface YYImageDisplayExample()<UIGestureRecognizerDelegate>
@property (nonatomic, strong) UILabel *label;
@property (nonatomic, strong) MBCircularProgressBarView *progressBar;
@end
@implementation YYImageDisplayExample {
    UIScrollView *_scrollView;	
}

- (void)viewDidLoad {
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor colorWithWhite:0.863 alpha:1.000];
    
    _scrollView = [UIScrollView new];
    _scrollView.frame = self.view.bounds;
    [self.view addSubview:_scrollView];	
    [self loadImageWithURL: self.clipURL];
	
    _scrollView.panGestureRecognizer.cancelsTouchesInView = YES;
}

- (void)loadImageWithURL:(NSString *)url {
	[self loadImage: url];
}

- (void)loadImage: (NSString *)url {
	
	//NSArray *controllers = [self.navigationController viewControllers];
	//MainViewController* a =[controllers objectAtIndex:0];
	//[a.webView stringByEvaluatingJavaScriptFromString:@"javaScriptCall();"];
	//[((MainViewController *)[[self.navigationController viewControllers] objectAtIndex:0]).webView stringByEvaluatingJavaScriptFromString:@"javaScriptCall();"];

	YYAnimatedImageView *imageView = [YYAnimatedImageView new];

	/*
	NSLog(@"navigation bar height:%f, status bar height:%f", self.navigationController.navigationBar.frame.size.height, [UIApplication sharedApplication].statusBarFrame.size.height);
	
	NSLog(@"image view height:%f", self.view.size.height - self.navigationController.navigationBar.frame.size.height - [UIApplication sharedApplication].statusBarFrame.size.height);
	*/
	
	imageView.width = self.view.size.width;
	imageView.height = self.view.size.height - self.navigationController.navigationBar.frame.size.height - [UIApplication sharedApplication].statusBarFrame.size.height;
	imageView.clipsToBounds = YES;
	imageView.contentMode = UIViewContentModeScaleAspectFit;
	imageView.backgroundColor = [UIColor whiteColor];
	
	//imageView.yy_imageURL = [NSURL URLWithString:url];
	
	_progressBar = [[MBCircularProgressBarView alloc] initWithFrame:CGRectMake((imageView.width-100)/2, (imageView.height-100)/2, 100, 100)];
	_progressBar.backgroundColor = [UIColor clearColor];
	_progressBar.hidden = YES;
	
	[imageView yy_setImageWithURL:[NSURL URLWithString:url]
		placeholder:nil
		options:YYWebImageOptionProgressiveBlur | YYWebImageOptionShowNetworkActivity | YYWebImageOptionSetImageWithFadeAnimation
		progress:^(NSInteger receivedSize, NSInteger expectedSize) {
			if (expectedSize > 0 && receivedSize > 0) {
				CGFloat progress = (CGFloat)receivedSize / expectedSize;
				progress = progress < 0 ? 0 : progress > 1 ? 1 : progress;				
				if (_progressBar.hidden && progress != 1) _progressBar.hidden = NO;
				[_progressBar setValue: progress * 100 animateWithDuration:1];
			}
		}
		transform:nil
		completion:^(UIImage *image, NSURL *url, YYWebImageFromType from, YYWebImageStage stage, NSError *error){
			if (stage == YYWebImageStageFinished) {
				[_progressBar setValue: 100 animateWithDuration:1];
				_progressBar.hidden = YES;
			}
		}
	];
	
	[_scrollView addSubview:imageView];
	[_scrollView addSubview:_progressBar];
	
	[YYImageExampleHelper addTapControlToAnimatedImageView:imageView];
	[YYImageExampleHelper addPanControlToAnimatedImageView:imageView];
	for (UIGestureRecognizer *g in imageView.gestureRecognizers) {
		g.delegate = self;
	}
	
	//_scrollView.contentSize = CGSizeMake(self.view.width, 100);
}

- (BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer shouldRecognizeSimultaneouslyWithGestureRecognizer:(UIGestureRecognizer *)otherGestureRecognizer{
    return YES;
}

-(void) viewWillDisappear:(BOOL)animated {
    if ([self.navigationController.viewControllers indexOfObject:self]==NSNotFound) {
        // back button was pressed.  We know this is true because self is no longer
        // in the navigation stack.
        [self.navigationController setNavigationBarHidden:YES];
    }
    [super viewWillDisappear:animated];
}

@end
