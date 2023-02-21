//the idea to solve 100 or even more images is by building a hash map which store (key/vlaue) pair of image data
//key for each image is the index of based on the the length of the array. i.e. for 100 images, the indexes are (0-99)
//a pointer is created to interact with the left/right button, it is  initalized to point at index 0 that whenever open the UI, the 1st pic pop up is image[0]
//click nextbutton/right the pointer will move to the next image (index+1), left button will make index-1
//out bound cases 1. when index goes negative, pointer will be set a (map.size-1) which is the last index of map 2. index > length, the pointer will be set to 0
//map is a data structure that is efficient to search and retrive the desired data (value), as long as we have the correct key, we can store as many images as we want

//for bonus part, designed the next-page, previous-page button that every click will generate a new page of 100 pictures. The previous button will return back to the previous page
//by experiemnting, api can only generate 1093 pics (10 pages), successfully wrap around the pages from end to the begining (page 10->click next page -> page 1) vis versa
//setPageMap is a method like a 'bookmark' of the carousel, every time a new page is generated, it will add one entry into the map that can be retrive the loctaion of previous page later
//setPageMap is currently set as (page_pointer, 0), so everytime move a new page/go back to pre page, it will start from the 1st picture. If with more time, this function can be prefected
//since I am considering the code can be intergrated for a bigger database in the future (more than 1093 pics) 
//so only the last page generated will show when click the pre-page button at page 1. (for 10 pages, if only 7 pages generated, when click pre at page 1, it will direct to page 7 not page 10 )

const nextbutton =document.querySelector('.carousel__button--right');
const previousbutton =document.querySelector('.carousel__button--left');
const nextpagebutton =document.querySelector('.carousel__page--next');
const previouspagebutton =document.querySelector('.carousel__page--previous');
const img = document.querySelector('.img');

const imageMap = new Map();
const pageMap = new Map()
const imageLength = imageMap.length

var image_pointer = 0 //array index start from 0
var page_pointer = 1 //by API, page starts from 1 

const setupCarousel = async function () {
    const res = await fetch ("https://picsum.photos/v2/list?page=0&limit=100");
    const images = await res.json();
    setupMap(images);
    pageMap.set(1,0)
}

const setupMap = function(images){
    for (let i=0; i<images.length; i++){
        const imageUrl = images[i].download_url
        imageMap.set(i,imageUrl)
    img.src = imageMap.get(image_pointer)}
    
}

const setPageMap = function(){
    pageMap.set(page_pointer, 0)
}

const nextrefresh = function(){
    page_pointer = 1;
    displayCarousel(page_pointer)
}

const prerefresh = function(){
    page_pointer = pageMap.size-1;
    displayCarousel(page_pointer)
}

const displayCarousel = async function (){
    const res = await fetch ("https://picsum.photos/v2/list?page=" + page_pointer +"&limit=100");
    const images = await res.json();
    if (images.length == 0) {
        nextrefresh()
    }
    setupMap(images)
    }
    
nextbutton.addEventListener('click', e=>{
    image_pointer = image_pointer + 1;
    if(image_pointer > imageMap.size - 1){
        image_pointer = 0
        img.src = imageMap.get(image_pointer); 
    }
    else{
        img.src = imageMap.get(image_pointer);
    }
    
})

previousbutton.addEventListener('click', e=>{
    image_pointer = image_pointer-1
    if (image_pointer <0){
        image_pointer = imageMap.size 
        image_pointer = image_pointer -1
        img.src = imageMap.get(image_pointer) 
    }
    else{
        img.src=imageMap.get(image_pointer)
    }
})

nextpagebutton.addEventListener('click', e=>{
    page_pointer = page_pointer + 1;
    setPageMap(page_pointer)
    image_pointer = pageMap.get(page_pointer)
    displayCarousel(image_pointer)
    
})

previouspagebutton.addEventListener('click', e=>{
    page_pointer = page_pointer-1;
    if (page_pointer <= 0){
        prerefresh()
    }
    else{
    setPageMap(page_pointer)
    image_pointer = pageMap.get(page_pointer)
    displayCarousel(image_pointer)
    }
}
    
    
)
setupCarousel()


