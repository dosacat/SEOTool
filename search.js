const { JSDOM } = require('jsdom');
const fetch = require("node-fetch");

async function crawler(baseURL, currentURL, pages){
  // fetch and parse the html of the currentURL
  
  // if this is an offsite URL, bail immediately
  const currentUrlObj = new URL(currentURL)
  const baseUrlObj = new URL(baseURL)
  if (currentUrlObj.hostname !== baseUrlObj.hostname){
    return pages
  }

  const normalizedURL = search(currentURL)

  // if we've already visited this page
  // just increase the count and don't repeat
  // the http request
  if (pages[normalizedURL] > 0){
    pages[normalizedURL]++
    return pages
  }

  // initialize this page in the map
  // since it doesn't exist yet
  pages[normalizedURL] = 1

  console.log(`crawling ${currentURL}`)
  let htmlBody = ''

  try {
    const resp = await fetch(currentURL)
    if (resp.status > 399){
      console.log(`Got HTTP error, status code: ${resp.status}`)
      return pages
    }
    const contentType = resp.headers.get('content-type')
    if (!contentType.includes('text/html')){
      console.log(`Got non-html response: ${contentType}`)
      return pages
    }
  htmlBody = await resp.text()
  } catch (err){
    console.log(err.message)
  }


  const nextURLs = getURLsFromHTML(htmlBody, baseURL)
  for (const nextURL of nextURLs){
    pages = await crawler(baseURL, nextURL, pages)
  }


  return pages
}



function getURLsFromHTML(htmlBody, baseURL){
  const urls = []
  const dom = new JSDOM(htmlBody)
  const as = dom.window.document.querySelectorAll('a')

  //we want href property of a links
  //.href property of URL returns string of an entire URL

  for (const a of as){
    // if relative path
    if (a.href.slice(0,1) === '/'){
      try {
        urls.push(new URL(a.href, baseURL).href)
      } catch (err){
        console.log(`${err.message}: ${a.href}`)
      }
    } 
    
    else {
      try {
        urls.push(new URL(a.href).href)
      } catch (err){
        console.log(`${err.message}: ${a.href}`)
      }
    }
  }
  return urls
}


function search(url){
    const urlObj = new URL(url)
    let fullPath = `${urlObj.host}${urlObj.pathname}`
    if (fullPath.length > 0 && fullPath.slice(-1) === '/'){
      fullPath = fullPath.slice(0, -1)
    }
    console.log(fullPath)
    return fullPath

  }

module.exports={search,getURLsFromHTML,crawler}