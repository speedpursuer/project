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
	
	//_progressBar = [[MBCircularProgressBarView alloc] init];
    [self loadImageWithURL: self.clipURL];
	
    _scrollView.panGestureRecognizer.cancelsTouchesInView = YES;
}

- (void)addImageWithName:(NSString *)name text:(NSString *)text {
    YYImage *image = [YYImage imageNamed:name];
    [self addImage:image size:CGSizeZero text:text];
}

- (void)loadImageWithURL:(NSString *)url {
	[self loadImage: url];
}


- (void)addFrameImageWithText:(NSString *)text {
    
    NSString *basePath = [[NSBundle mainBundle].bundlePath stringByAppendingPathComponent:@"EmoticonWeibo.bundle/com.sina.default"];
    NSMutableArray *paths = [NSMutableArray new];
    [paths addObject:[basePath stringByAppendingPathComponent:@"d_aini@3x.png"]];
    [paths addObject:[basePath stringByAppendingPathComponent:@"d_baibai@3x.png"]];
    [paths addObject:[basePath stringByAppendingPathComponent:@"d_chanzui@3x.png"]];
    [paths addObject:[basePath stringByAppendingPathComponent:@"d_chijing@3x.png"]];
    [paths addObject:[basePath stringByAppendingPathComponent:@"d_dahaqi@3x.png"]];
    [paths addObject:[basePath stringByAppendingPathComponent:@"d_guzhang@3x.png"]];
    [paths addObject:[basePath stringByAppendingPathComponent:@"d_haha@2x.png"]];
    [paths addObject:[basePath stringByAppendingPathComponent:@"d_haixiu@3x.png"]];
    
    UIImage *image = [[YYFrameImage alloc] initWithImagePaths:paths oneFrameDuration:0.1 loopCount:0];
    [self addImage:image size:CGSizeZero text:text];
}

- (void)addSpriteSheetImageWithText:(NSString *)text {
    NSString *path = [[NSBundle mainBundle].bundlePath stringByAppendingPathComponent:@"ResourceTwitter.bundle/fav02l-sheet@2x.png"];
    UIImage *sheet = [[UIImage alloc] initWithData:[NSData dataWithContentsOfFile:path] scale:2];
    NSMutableArray *contentRects = [NSMutableArray new];
    NSMutableArray *durations = [NSMutableArray new];
    
    
    // 8 * 12 sprites in a single sheet image
    CGSize size = CGSizeMake(sheet.size.width / 8, sheet.size.height / 12);
    for (int j = 0; j < 12; j++) {
        for (int i = 0; i < 8; i++) {
            CGRect rect;
            rect.size = size;
            rect.origin.x = sheet.size.width / 8 * i;
            rect.origin.y = sheet.size.height / 12 * j;
            [contentRects addObject:[NSValue valueWithCGRect:rect]];
            [durations addObject:@(1 / 60.0)];
        }
    }
    YYSpriteSheetImage *sprite;
    sprite = [[YYSpriteSheetImage alloc] initWithSpriteSheetImage:sheet
                                                     contentRects:contentRects
                                                   frameDurations:durations
                                                        loopCount:0];
    [self addImage:sprite size:size text:text];
}

- (void)addImage:(UIImage *)image size:(CGSize)size text:(NSString *)text {
    YYAnimatedImageView *imageView = [[YYAnimatedImageView alloc] initWithImage:image];
    
    if (size.width > 0 && size.height > 0) imageView.size = size;
    imageView.centerX = self.view.width / 2;
    imageView.top = [(UIView *)[_scrollView.subviews lastObject] bottom] + 200;
    [_scrollView addSubview:imageView];
    [YYImageExampleHelper addTapControlToAnimatedImageView:imageView];
    [YYImageExampleHelper addPanControlToAnimatedImageView:imageView];
    for (UIGestureRecognizer *g in imageView.gestureRecognizers) {
        g.delegate = self;
    }
    
    UILabel *imageLabel = [UILabel new];
    imageLabel.backgroundColor = [UIColor clearColor];
    imageLabel.frame = CGRectMake(0, 0, self.view.width, 20);
    imageLabel.top = imageView.bottom + 10;
    imageLabel.textAlignment = NSTextAlignmentCenter;
    imageLabel.text = text;
    [_scrollView addSubview:imageLabel];
    
    _scrollView.contentSize = CGSizeMake(self.view.width, imageLabel.bottom + 20);
}

- (void)loadImage: (NSString *)url {
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

	/*
	LLARingSpinnerView *spinnerView = [[LLARingSpinnerView alloc] initWithFrame:CGRectMake(0, 0, 200, 300)];
	
	// Optionally set the current progress
	spinnerView.lineWidth = 1.5f;
	
	// Optionally change the tint color
	spinnerView.tintColor = [UIColor redColor];
	 
	// Add it as a subview

	
	[spinnerView startAnimating];
	*/

	
	imageView.yy_imageURL = [NSURL URLWithString:url];
	
	
//	[_circleProgressBar setProgress:(_circleProgressBar.progress + 0.06f) animated:YES];
	
	[_scrollView addSubview:imageView];
	
	_progressBar = [[MBCircularProgressBarView alloc] initWithFrame:CGRectMake(0, 0, 200, 300)];
	[_progressBar setValue:80.f
	   animateWithDuration:1];
	_progressBar.backgroundColor = [UIColor clearColor];
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

- (BOOL)isSimulator {
    size_t size;
    sysctlbyname("hw.machine", NULL, &size, NULL, 0);
    char *machine = malloc(size);
    sysctlbyname("hw.machine", machine, &size, NULL, 0);
    NSString *model = [NSString stringWithUTF8String:machine];
    free(machine);
    return [model isEqualToString:@"x86_64"] || [model isEqualToString:@"i386"];
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
