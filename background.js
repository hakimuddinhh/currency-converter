
// setting states and definations 

const availableCurrencies = ["GBP","HKD","IDR","ILS","DKK","INR","CHF","MXN","CZK","SGD","THB","HRK","EUR","MYR","NOK","CNY","BGN","PHP","PLN","ZAR","CAD","ISK","BRL","RON","NZD","TRY","JPY","RUB","KRW","USD","AUD","HUF","SEK"];

const mainStorageDefault = {baseCurrency: 'INR', preferredCurrency: 'USD', availableCurrencies}
let mainStorageSaved = null;



const toNumber = string => parseInt(string.replace(/,/g, ""), 10);


///////////////
chrome.runtime.onMessage.addListener(function (message, callback) {
      if(message.type === 'data-updated') {
        chrome.contextMenus.onClicked.removeListener();
        chrome.contextMenus.removeAll();
        mainStorageSaved = message.mainData.currencyConverter;
        createContextMenus();
          addListeners();
      }

});



const createContextMenus = () => {
  let contextMenuItem = {
    id: 'convert-currency',
    title: `Convert %s ${mainStorageSaved.baseCurrency} to ${mainStorageSaved.preferredCurrency}`,
    contexts: ['selection']
  };
  chrome.contextMenus.create(contextMenuItem);
  
}


const addListeners = () => chrome.contextMenus.onClicked.addListener((e) => {
  const {menuItemId, selectionText} = e;
  const {baseCurrency, preferredCurrency} = mainStorageSaved;
  if(menuItemId === 'convert-currency' && selectionText) {
    const amount = toNumber(selectionText);
    // check if the selected text is a valid number, number with currency sign, number with text(regexp later on)
    if(Number(amount)) {
    fetch(`https://api.ratesapi.io/api/latest?base=${baseCurrency}`).then(async (res) => {
      const response = await res.json();
      const convertedAmount = amount * response.rates[preferredCurrency];
      chrome.notifications.create('done', {
        title: 'Conversion done !',
        message: `${amount} ${baseCurrency} is ${convertedAmount} ${preferredCurrency}`,
        iconUrl: '/notification.png',
        type: 'basic'
      }, function(id) { console.log("Last error:", chrome.runtime.lastError); });
      
    })
   
    } else {
      chrome.notifications.create('done', {
        title: 'Cannot convert the selected text',
        message: 'Please select an amount which is only a number.',
        iconUrl: '/notification.png',
        type: 'basic'
      }, function(id) { console.log("Last error:", chrome.runtime.lastError); });
    }
    
  } 

})


// calling the methods



chrome.storage.sync.get('currencyConverter', (mainStorage) => {
  if(Object.keys(mainStorage).length <= 0) {
    chrome.storage.sync.set({currencyConverter: mainStorageDefault}, (mainStorage) => {
        if(Object.keys(mainStorage).length > 0) {
          mainStorageSaved = mainStorage;
          createContextMenus();
          addListeners();
        }
      mainStorageSaved = mainStorage.currencyConverter;
    });
  } else {
    mainStorageSaved = mainStorage.currencyConverter;
    createContextMenus();
    addListeners();
  }
  
});












