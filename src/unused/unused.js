/*AdSterra native
  //Native Ad
  useEffect(() => {
    // Create and append the native ad script
    const script = document.createElement('script');
    script.async = true;
    script['data-cfasync'] = 'false';
    script.src = '//pl24785939.profitablecpmrate.com/10df8c323657c0a9077217509b4857c3/invoke.js';

    const adDiv = document.createElement('div');
    adDiv.id = 'container-10df8c323657c0a9077217509b4857c3';

    const footer = document.querySelector('footer'); // Select the footer element
    footer.parentNode.insertBefore(adDiv, footer);   // Insert adDiv above the footer
    footer.parentNode.insertBefore(script, adDiv);   // Insert script just before the adDiv

    // Clean up the ad script when the component unmounts
    return () => {
      footer.parentNode.removeChild(adDiv);
      footer.parentNode.removeChild(script);
    };
  }, []); // Run once on component mount


  useEffect(() => {
    // Load the ad script dynamically
    const adScript = document.createElement("script");
    adScript.src = "https://a.magsrv.com/ad-provider.js";
    adScript.async = true;
    document.body.appendChild(adScript);

    // Clean up script on component unmount
    return () => {
      document.body.removeChild(adScript);
    };
  }, []);

  useEffect(() => {
    // Detect screen size and load the appropriate ad script
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
  
    const bannerDiv = document.createElement('div'); // Create a div to hold the banner ad
    bannerDiv.style.textAlign = 'center'; // Center the ad
    bannerDiv.style.marginTop = '5px'; // Add margin on top

    const script = document.createElement('script');
    script.type = 'text/javascript';
  
    if (isMobile) {
      // Mobile ad options
      script.innerHTML = `
        atOptions = {
          'key' : '75174f627f857d2c52bd3f6fb3c939b2',
          'format' : 'iframe',
          'height' : 50,
          'width' : 320,
          'params' : {}
        };
      `;
      const srcScript = document.createElement('script');
      srcScript.type = 'text/javascript';
      srcScript.src = "//www.highperformanceformat.com/75174f627f857d2c52bd3f6fb3c939b2/invoke.js";
      bannerDiv.appendChild(script);
      bannerDiv.appendChild(srcScript);
    } else {
      // Desktop ad options
      script.innerHTML = `
        atOptions = {
          'key' : 'b519149682772d21846a7f1961eb39b9',
          'format' : 'iframe',
          'height' : 90,
          'width' : 728,
          'params' : {}
        };
      `;
      const srcScript = document.createElement('script');
      srcScript.type = 'text/javascript';
      srcScript.src = "//www.highperformanceformat.com/b519149682772d21846a7f1961eb39b9/invoke.js";
      bannerDiv.appendChild(script);
      bannerDiv.appendChild(srcScript);
    }
  
    const header = document.querySelector('header'); // Select the header element
    header.parentNode.insertBefore(bannerDiv, header); // Insert the bannerDiv before the header
  
    // Clean up the scripts when the component unmounts
    return () => {
      if (bannerDiv && bannerDiv.parentNode) {
        bannerDiv.parentNode.removeChild(bannerDiv);
      }
    };
  }, []); // Run only once on mount */