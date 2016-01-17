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
#import "FRDLivelyButton.h"
//#include <CommonCrypto/CommonDigest.h>
#import "SHA1.h"


@interface YYImageDisplayExample()<UIGestureRecognizerDelegate>
@property (nonatomic, strong) UILabel *label;
@property (nonatomic, strong) MBCircularProgressBarView *progressBar;
@end
@implementation YYImageDisplayExample {
    UIScrollView *_scrollView;	
}

- (void)viewDidLoad {
    [super viewDidLoad];
	
//	SHA1 *sha1 = [SHA1 sha1WithString:@"http://celebedition.com/wp-content/uploads/2015/02/rs_634x1141-140613051823-634.Michael-Jordan-JR-61314.jpg"];
//	
//	NSLog(@"sha1 = %@", sha1);
	
//	VBFPopFlatButton *button = [[VBFPopFlatButton alloc] initWithFrame:CGRectMake(0,[UIApplication sharedApplication].statusBarFrame.size.height,36,28) buttonType:buttonMenuType buttonStyle:buttonRoundedStyle animateToInitialState:YES];
//	button.roundBackgroundColor = [UIColor whiteColor];
//	button.lineThickness = 2;
//	//button.tintColor = [UIColor flatPeterRiverColor];
//	[button addTarget:self action:@selector(cancelAction) forControlEvents:UIControlEventTouchUpInside];
	
	
	FRDLivelyButton *button = [[FRDLivelyButton alloc] initWithFrame:CGRectMake(0,[UIApplication sharedApplication].statusBarFrame.size.height,36,28)];
	[button setStyle:kFRDLivelyButtonStyleClose animated:NO];
	[button addTarget:self action:@selector(cancelAction) forControlEvents:UIControlEventTouchUpInside];
	
	[button setOptions:@{ kFRDLivelyButtonLineWidth: @(2.0f)}];
	
	
	/*
	UIButton *button = [UIButton buttonWithType: UIButtonTypeCustom];
	
	[button setFrame: CGRectMake (5, 5,40,40)];
	
	[button setBackgroundColor:[UIColor orangeColor]];
	
	[button addTarget:self action:@selector(cancelAction) forControlEvents:UIControlEventTouchUpInside];
	*/
	
	//UINavigationBar * a = [UINavigationBar new];
	
	
	
    self.view.backgroundColor = [UIColor colorWithWhite:0.863 alpha:1.000];
	
	
	/*
    _scrollView = [UIScrollView new];
    _scrollView.frame = self.view.bounds;
	 
	*/
	
	[self.view addSubview:_scrollView];
	[self loadImageWithURL: self.clipURL];
	
	[self.view addSubview:button];
	
    _scrollView.panGestureRecognizer.cancelsTouchesInView = YES;

	//[self updateClip];
	/*
	self.title = @"Add Article";
	a.navigationController.navigationBar.barTintColor = [UIColor whiteColor];
	Boolean ab = a.navigationController.navigationBar.hidden;
	a.navigationItem.leftBarButtonItem = [[UIBarButtonItem alloc]initWithBarButtonSystemItem:UIBarButtonSystemItemCancel target:self action:@selector(cancelAction)];
	*/
}

- (void)loadImageWithURL:(NSString *)url {
	[self loadImage: url];
}

- (void) updateClip {
	MainViewController* a = (MainViewController*)self.delegate;
	[a.webView stringByEvaluatingJavaScriptFromString:@"updateClipThumb();"];
}

- (void)loadImage: (NSString *)url {
	
	//MainViewController* a = (MainViewController*)self.delegate;
	
	//[a.webView stringByEvaluatingJavaScriptFromString:@"javaScriptCall();"];
	
	YYAnimatedImageView *imageView = [YYAnimatedImageView new];

	/*
	NSLog(@"navigation bar height:%f, status bar height:%f", self.navigationController.navigationBar.frame.size.height, [UIApplication sharedApplication].statusBarFrame.size.height);
	
	NSLog(@"image view height:%f", self.view.size.height - self.navigationController.navigationBar.frame.size.height - [UIApplication sharedApplication].statusBarFrame.size.height);
	*/
	
	imageView.width = self.view.size.width;
//	imageView.height = self.view.size.height - self.navigationController.navigationBar.frame.size.height - [UIApplication sharedApplication].statusBarFrame.size.height;
	
	imageView.height = self.view.size.height;
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
		//transform:nil
		transform:^UIImage *(UIImage *image, NSURL *url) {
			
			UIImage *image1 = [image yy_imageByResizeToSize:CGSizeMake(80, 80) contentMode:UIViewContentModeCenter];
			
			NSString *ext = @".jpg";
			
			SHA1 *sha1 = [SHA1 sha1WithString: [url.absoluteString  stringByAppendingString: ext]];
			
			NSLog(@"absoluteString = %@", url.absoluteString);
			
			NSLog(@"sha1 = %@", sha1);
			
			NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
			
			NSMutableString *string = [NSMutableString stringWithString:@"/imgcache/"];
			
			[string appendFormat: @"%@", sha1];
			
			[string appendString: ext];
			
			NSString *filePath = [[paths objectAtIndex:0] stringByAppendingPathComponent: string];
			
			NSLog(@"filePath = %@", filePath);
			
			[UIImageJPEGRepresentation(image1, 0.8f) writeToFile:filePath atomically:YES];
			
			[self performSelectorOnMainThread:@selector(updateClip) withObject:nil waitUntilDone:NO];
			
			return image;
		}
		completion:^(UIImage *image, NSURL *url, YYWebImageFromType from, YYWebImageStage stage, NSError *error){
			if (stage == YYWebImageStageFinished) {
				[_progressBar setValue: 100 animateWithDuration:1];
				_progressBar.hidden = YES;
			}
		}
	];
	
	[self.view addSubview:imageView];
	[self.view addSubview:_progressBar];
	
	//[_scrollView addSubview:imageView];
	//[_scrollView addSubview:_progressBar];
	
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

/*
-(void) viewWillDisappear:(BOOL)animated {
    if ([self.navigationController.viewControllers indexOfObject:self]==NSNotFound) {
        // back button was pressed.  We know this is true because self is no longer
        // in the navigation stack.
        [self.navigationController setNavigationBarHidden:YES];
    }
    [super viewWillDisappear:animated];
}*/

- (void)cancelAction{
	//[self updateClip];
	[self dismissViewControllerAnimated:YES completion:nil];
}

@end
