const puppeteer=require('puppeteer');
const cheerio=require('cheerio');
const request=require('request');
const fs=require('fs');
const writeStream=fs.createWriteStream('data.csv');

writeStream.write(`JobTitle,Location \n`);

const baseUrl="https://www.naukri.com/software-developer-jobs?k=software%20developer";

(async ()=>{
    const browser=await puppeteer.launch({headless:false});
    const page=await browser.newPage();
    await page.goto(baseUrl);
  
    request(baseUrl,(error,response,html)=>{
        if(!error&&response.statusCode==200){
       const $=cheerio.load(html);
        
               $('.list').each((i,el)=>{
                const jobTitle=$(el).find('div.info').find('a.title').text();
                const jobLocation=$(el).find('ul.mt-7').find('li:nth-child(3)').find('span.ellipsis').text();
                console.log(jobTitle,jobLocation);
        
                writeStream.write(`${jobTitle},${jobLocation} \n`);
      });

        }
    });

    await browser.close();
})();
