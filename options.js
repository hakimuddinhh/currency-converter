window.onload = () => {
    let mainStorageGlobal = null;
    chrome.storage.sync.get('currencyConverter', (mainStorage) => {
        debugger;
        mainStorageGlobal = mainStorage;
        const {availableCurrencies, baseCurrency, preferredCurrency} = mainStorage.currencyConverter;
        
        for(let i=0; i<availableCurrencies.length; i++) {
            const optionBase = document.createElement('option');
            optionBase.value = availableCurrencies[i];
            optionBase.innerHTML = availableCurrencies[i];
            if(availableCurrencies[i] === baseCurrency) {
                optionBase.selected = 'selected';
            }




            const optionPreferred = document.createElement('option');
            optionPreferred.value = availableCurrencies[i];
            optionPreferred.innerHTML = availableCurrencies[i];
            if(availableCurrencies[i] === preferredCurrency) {
                optionPreferred.selected = 'selected';
            }
            document.getElementById('base-currency').append(optionBase);
            document.getElementById('preferred-currency').append(optionPreferred);
        }

        
        
      });

      document.getElementById('save-changes').addEventListener('click', e => {
        e.stopPropagation();
        e.preventDefault();
//if changes are changes
        const {currencyConverter: mainState} = mainStorageGlobal;
        const {value: baseCurrency} = document.getElementById("base-currency");
        const {value: preferredCurrency} = document.getElementById("preferred-currency");
        if(mainState && (mainState.baseCurrency !== baseCurrency || mainState.preferredCurrency !== preferredCurrency)) {
            const finalState = {currencyConverter: {...mainStorageGlobal.currencyConverter, baseCurrency, preferredCurrency}};
            chrome.storage.sync.set(finalState, (data) => {
                chrome.runtime.sendMessage({type: 'data-updated', mainData: finalState}, (response) => {
                    chrome.notifications.create('Saved', {
                        title: 'Updated !',
                        message: 'Base and End currencies are updated',
                        iconUrl: '/notification.png',
                        type: 'basic'
                      }, function(id) { console.log("Last error:", chrome.runtime.lastError); });
                });
            });
        }
    })
}

