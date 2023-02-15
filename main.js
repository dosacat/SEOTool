const { crawler } = require ("./search");
const { printReport } = require('./report.js')

async function main(){

//since we will use npm start <urlName>

    if (process.argv.length < 3){
        console.log('no website provided')
      }
      if (process.argv.length > 3){
        console.log('too many arguments provided')
      }
    
      const baseURL = process.argv[2]
    
      console.log(`starting crawl of: ${baseURL}...`)


      const pages = await crawler(baseURL, baseURL, {})
      printReport(pages)
  }
  main()