// AdSenseVideoAd.js
import { useEffect } from 'react';

const AdSenseVideoAd = ({adSlot}) => {
  useEffect(() => {
    // Load Google AdSense video ad script
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'inline-block', width: '300px', height: '250px' }}
      data-ad-client="ca-pub-2480119685720701"
      data-ad-slot={adSlot}
      data-ad-format="video"
      data-full-width-responsive="true"
    />
  );
};

export default AdSenseVideoAd;