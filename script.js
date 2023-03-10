"use strict";

const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = {};

// Show modal, focus on input

function showModal() {
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

// Modal event listener
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', ()=> modal.classList.remove('show-modal'));
window.addEventListener('click', (e) => (e.target === modal ? modal.classList.remove('show-modal') : false));   

// validate form
function validate(nameValue, urlValue) {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if(!nameValue||!urlValue) {
        alert('Please submit for both fields!')
        return false;
    }
    if(!urlValue.match(regex)){
        alert('Please provide a valid web address');
        return false;
    }
//Valid
return true;
}

// Build bookmarks DOM
function buildBookmars() {
    // remove all bookmark elemets
    bookmarksContainer.textContent='';
    //build items
   Object.keys(bookmarks).forEach((id) => {
        const {name, url} = bookmarks[id];
        // item
        const item = document.createElement('div');
        item.classList.add('item');
        // Close Icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fa-solid', 'fa-trash');
        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
           // Favicon
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
    
        favicon.setAttribute('alt', 'Favicon');
        //Link
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target','_blank');
        link.textContent = name;
        //Append to bookmarks container
        linkInfo.append(favicon, link);
        item.append(closeIcon,linkInfo);
        bookmarksContainer.appendChild(item);
    });
}

// Fetch bookmarks
function fetchBookmarks() {
    //get bookmarks from local storage if available
    if(localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    } else {
        // create bookmarks array in localStorage
        bookmarks = [];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmars()
}
//delete bookmark
function deleteBookmark(id) {
	// Loop through the bookmarks array
	if (bookmarks[id]) {
		delete bookmarks[id]
	}
	// Update bookmarks array in localStorage, re-populate DOM
	localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
	fetchBookmarks();
}

// Handling data from form
function storeBookmark(e) {
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    if (!urlValue.includes('https://') && !urlValue.includes('http://')) {
     urlValue = `https://${urlValue}`; 
}
    if(!validate(nameValue, urlValue)) {
        return false;
    }   
    const bookmark = {
        name: nameValue,
        url: urlValue,
    };
    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();
}

//Event listener
bookmarkForm.addEventListener('submit', storeBookmark);

// on load fetch Bookmarks
fetchBookmarks();