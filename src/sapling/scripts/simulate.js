if (document.monetization){
    const randomGuid = 'c7ff7da9-8a41-4660-98a8-ca4df0176fbe';
  
    const meta = document.querySelector('meta[name="monetization"]');
    let metaContent = null;
    if (meta){
      metaContent = meta.getAttribute('content');
    }
  
    if (metaContent){
      // setup all the required "simulated" events and their associated
      // data types and values
  
      // setup the appropriate end-point address for the startEvent
      const resolvedEndpoint = metaContent.replace(/^\$/, 'https://');
      // setup the monetization pending Event 
      const monetizationpendingEvent = new CustomEvent('monetizationpending',{detail:{
          "paymentPointer": metaContent,
          "requestId": randomGuid
        }});
      // setup the monetization startEvent with a random id and 
      // the appropriate metaContent payment handle and endpoint
      const monetizationstartEvent = new CustomEvent('monetizationstart',{detail:{
          "requestId": randomGuid,
          "id": randomGuid,
          metaContent,
          resolvedEndpoint
        }});
      // setup the recurring monetization progress event with the 
      // "simulated" micro amount and the appropriate asset type data
      const monetizationprogressEvent = new CustomEvent('monetizationprogress', {detail:{
          "amount": "100000",
          "assetCode": "USD",
          "assetScale": 9
        }});
      // function routine to simulate a simple WM provider
      function simulateWMProvider() {
        console.log("connected to the user's WM provider!");
        // set the monetization state
        document.monetization.state = 'started';
        document.monetization.dispatchEvent(monetizationstartEvent);
        console.log("got the first micro-payment from the client!");
  
        setInterval(() => {
          document.monetization.dispatchEvent(monetizationprogressEvent);
          console.log("received micro-payment!");
        },2000);  
      }
  
      // SIMULATION BEGIN
      // Include a delay here to "simulate" the PaymentRequestEvent to the 
      // users WM Provider and the resulting response
      document.monetization.state = 'stopped';
      console.log("connecting to the user's WM provider...");
      setTimeout(()=> {
        console.log("connection to the user's WM provider pending...");
        document.monetization.state = 'pending';
        document.monetization.dispatchEvent(monetizationpendingEvent);
        setTimeout(simulateWMProvider, 5000);
      }, 5000);
    }
    else{
      console.log('monetization meta tag is not correctly configured.');
    }
  }
  else{
    console.log('could not find a native or installed (eg. coil extension) WM provider present!');
  }
  