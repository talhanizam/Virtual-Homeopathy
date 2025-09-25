// Analytics utility for tracking user interactions
// You can integrate with Google Analytics, Mixpanel, or other analytics services

declare global {
  function gtag(...args: any[]): void;
}

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, properties);
    }
    
    // Console log for development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', eventName, properties);
    }
  }
};

export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined') {
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: url,
      });
    }
  }
};

// Common events for your app
export const analytics = {
  ebookView: (ebookId: string, title: string) => 
    trackEvent('ebook_view', { ebook_id: ebookId, ebook_title: title }),
  
  purchaseInitiated: (ebookId: string, amount: number) => 
    trackEvent('purchase_initiated', { ebook_id: ebookId, amount }),
  
  purchaseCompleted: (ebookId: string, amount: number) => 
    trackEvent('purchase_completed', { ebook_id: ebookId, amount }),
  
  signup: () => trackEvent('signup'),
  
  login: () => trackEvent('login'),
  
  videoView: (videoId: string) => 
    trackEvent('video_view', { video_id: videoId }),
};

