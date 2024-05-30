document.addEventListener('DOMContentLoaded', function() {
    const websiteInput = document.getElementById('website');
    const addButton = document.getElementById('add');
    const blockedSitesList = document.getElementById('blocked-sites');
    const openHenryPageButton = document.getElementById('openHenryPage');
    const displayText = document.getElementById('display-text');
  
    function updateDisplayText() {
      const items = blockedSitesList.getElementsByTagName('li');
      if (items.length < 1) {
        displayText.innerHTML = `
        <div class="empty-blocked-container">
            <h4>No Blocked sites yet</h4>
            <p>When you add sites to block, you will see them here</p>
        </div>
    `;
      
      } else {
        displayText.textContent = 'Henry';
      }
  }
   
  
    // Load and display blocked sites
    chrome.storage.local.get({blockedSites: []}, function(result) {
      result.blockedSites.forEach(site => {
        addSiteToList(site);
      });
    });


    // websiteInput.addEventListener("change", function(event) {
    //   // Log the new value of the input element

    //   console.log("Input value changed:", event.target.value);
    // });

    websiteInput.addEventListener('input', function() {
            if (websiteInput.value.length > 0) {
              addButton.disabled = false;
              addButton.classList.add('active');
            } else {
              addButton.disabled = true;
              addButton.classList.remove('active');
            }
        });
  
    // Add button click event
    addButton.addEventListener('click', function() {
      const website = websiteInput.value.trim();
      if (website) {
        chrome.storage.local.get({blockedSites: []}, function(result) {
          const blockedSites = result.blockedSites;
          if (!blockedSites.includes(website)) {
            blockedSites.push(website);
            chrome.storage.local.set({blockedSites: blockedSites}, function() {
              addSiteToList(website);
              websiteInput.value = '';
            });
            updateDisplayText();
          }
        });
      }
    });

     // Open Henry Page button click event
  openHenryPageButton.addEventListener('click', function() {
    chrome.tabs.create({ url: chrome.runtime.getURL('options.html') });
  });
  
    // Add site to list function
    function addSiteToList(site) {
      const li = document.createElement('li');
      li.textContent = site;
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', function() {
        removeSiteFromList(site);
      });
      const deleteIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      deleteIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      deleteIcon.setAttribute('x', '0px');
      deleteIcon.setAttribute('y', '0px');
      deleteIcon.setAttribute('width', '30');
      deleteIcon.setAttribute('height', '30');
      deleteIcon.setAttribute('viewBox', '0 0 48 48');
      deleteIcon.classList.add('delete-icon');
      deleteIcon.innerHTML = `
          <linearGradient id="nyvBozV7VK1PdF3LtMmOna_pre7LivdxKxJ_gr1" x1="18.405" x2="33.814" y1="10.91" y2="43.484" gradientUnits="userSpaceOnUse">
              <stop offset="0" stop-color="#32bdef"></stop>
              <stop offset="1" stop-color="#1ea2e4"></stop>
          </linearGradient>
          <path fill="url(#nyvBozV7VK1PdF3LtMmOna_pre7LivdxKxJ_gr1)" d="M39,10l-2.835,31.181C36.072,42.211,35.208,43,34.174,43H13.826	c-1.034,0-1.898-0.789-1.992-1.819L9,10H39z"></path>
          <path fill="#0176d0" d="M32,7c0-1.105-0.895-2-2-2H18c-1.105,0-2,0.895-2,2c0,0,0,0.634,0,1h16C32,7.634,32,7,32,7z"></path>
          <path fill="#007ad9" d="M7,9.886L7,9.886C7,9.363,7.358,8.912,7.868,8.8C10.173,8.293,16.763,7,24,7s13.827,1.293,16.132,1.8	C40.642,8.912,41,9.363,41,9.886v0C41,10.501,40.501,11,39.886,11H8.114C7.499,11,7,10.501,7,9.886z"></path>
      `;
      deleteIcon.addEventListener('click', function() {
        removeSiteFromList(site);
      });
      li.appendChild(deleteIcon);
      blockedSitesList.appendChild(li);
      updateDisplayText();
    }
  
    // Remove site from list function
    function removeSiteFromList(site) {
      chrome.storage.local.get({blockedSites: []}, function(result) {
        const blockedSites = result.blockedSites.filter(item => item !== site);
        chrome.storage.local.set({blockedSites: blockedSites}, function() {
          const li = Array.from(blockedSitesList.children).find(li => li.textContent.includes(site));
          if (li) {
            blockedSitesList.removeChild(li);
          }
        });

      });
      updateDisplayText();
    }
  });
  