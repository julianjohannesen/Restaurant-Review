// Service worker

if(navigator.serviceWorker){
    const worker = navigator.serviceWorker
    .register("/sw.js", {scope: "127.0.0.1:5500/"})
    .then(doSomething)
    .catch(catchError);
}

function doSomething(reg){
    console.log(reg, worker)
};

function catchError(err){
    console.log(err);
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker
      .register('/sw.js')
      .then(function(registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, function(err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  }