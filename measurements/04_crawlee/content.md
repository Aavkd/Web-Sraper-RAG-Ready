# Extracted Content from crawlee.dev

**Source:** https://crawlee.dev/docs/introduction
**Crawled:** 2026-02-02T05:20:13.872Z
**Pages:** 5 extracted, 6 skipped
**Tokens:** ~5 955 estimated
**Duration:** 6s

---

## Table of Contents

1. [Introduction](#introduction)
2. [Crawlee for Python · Fast, reliable Python web crawlers.](#crawlee-for-python-fast-reliable-python-web-crawle)
3. [Crawlee for JavaScript · Build reliable crawlers. Fast.](#crawlee-for-javascript-build-reliable-crawlers-fas)
4. [Crawlee for JavaScript · Build reliable crawlers. Fast.](#crawlee-for-javascript-build-reliable-crawlers-fas)
5. [Quick Start](#quick-start)

---

## Introduction

> Source: https://crawlee.dev/docs/introduction
> Tokens: ~574

- - Introduction

Version: 3.15

## Introduction

Crawlee covers your crawling and scraping end-to-end and helps you **build reliable scrapers. Fast.**

Your crawlers will appear human-like and fly under the radar of modern bot protections even with the default configuration. Crawlee gives you the tools to crawl the web for links, scrape data and persistently store it in machine-readable formats, without having to worry about the technical details. And thanks to rich configuration options, you can tweak almost any aspect of Crawlee to suit your project's needs if the default settings don't cut it.

### What you will learn​

The goal of the introduction is to provide a step-by-step guide to the most important features of Crawlee. It will walk you through creating the simplest of crawlers that only prints text to console, all the way up to a full-featured scraper that collects links from a website and extracts data.

### 🛠 Features​

- Single interface for **HTTP and headless browser**crawling- Persistent **queue**for URLs to crawl (breadth & depth first)- Pluggable **storage**of both tabular data and files- Automatic **scaling**with available system resources- Integrated **proxy rotation**and session management- Lifecycles customizable with **hooks**- **CLI**to bootstrap your projects- Configurable **routing**, **error handling**and **retries**- **Dockerfiles**ready to deploy- Written in **TypeScript**with generics

#### 👾 HTTP crawling​

- Zero config **HTTP2 support**, even for proxies- Automatic generation of **browser-like headers**- Replication of browser **TLS fingerprints**- Integrated fast **HTML parsers**. Cheerio and JSDOM- Yes, you can scrape **JSON APIs**as well

#### 💻 Real browser crawling​

- JavaScript **rendering**and **screenshots**- **Headless**and **headful**support- Zero-config generation of **human-like fingerprints**- Automatic **browser management**- Use **Playwright**and **Puppeteer**with the same interface- **Chrome**, **Firefox**, **Webkit**and many others

### Next steps​

Next, you will install Crawlee and learn how to bootstrap projects with the Crawlee CLI.

[Edit this page](https://github.com/apify/crawlee/edit/master/website/versioned_docs/version-3.15/introduction/index.mdx)

Last updated on **Jan 30, 2026** by **nikitachapovskii-dev**

---

## Crawlee for Python · Fast, reliable Python web crawlers.

> Source: https://crawlee.dev/python
> Tokens: ~1 495

## Build reliable web scrapers. Fast.

Crawlee is a web scraping library for JavaScript and Python. It handles blocking, crawling, proxies, and browsers for you.

![Crawlee Python](https://crawlee.dev/img/crawlee-python-light.svg)![Crawlee Python](https://crawlee.dev/img/crawlee-python-dark.svg)

[Run on](https://console.apify.com/actors/HH9rhkFXiZbheuq1V?runConfig=eyJ1IjoiRWdQdHczb2VqNlRhRHQ1cW4iLCJ2IjoxfQ.eyJpbnB1dCI6IntcImNvZGVcIjpcImltcG9ydCBhc3luY2lvXFxuXFxuZnJvbSBjcmF3bGVlLmNyYXdsZXJzIGltcG9ydCBQbGF5d3JpZ2h0Q3Jhd2xlciwgUGxheXdyaWdodENyYXdsaW5nQ29udGV4dFxcblxcblxcbmFzeW5jIGRlZiBtYWluKCkgLT4gTm9uZTpcXG4gICAgY3Jhd2xlciA9IFBsYXl3cmlnaHRDcmF3bGVyKFxcbiAgICAgICAgbWF4X3JlcXVlc3RzX3Blcl9jcmF3bD0xMCwgICMgTGltaXQgdGhlIG1heCByZXF1ZXN0cyBwZXIgY3Jhd2wuXFxuICAgICAgICBoZWFkbGVzcz1UcnVlLCAgIyBSdW4gaW4gaGVhZGxlc3MgbW9kZSAoc2V0IHRvIEZhbHNlIHRvIHNlZSB0aGUgYnJvd3NlcikuXFxuICAgICAgICBicm93c2VyX3R5cGU9J2ZpcmVmb3gnLCAgIyBVc2UgRmlyZWZveCBicm93c2VyLlxcbiAgICApXFxuXFxuICAgICMgRGVmaW5lIHRoZSBkZWZhdWx0IHJlcXVlc3QgaGFuZGxlciwgd2hpY2ggd2lsbCBiZSBjYWxsZWQgZm9yIGV2ZXJ5IHJlcXVlc3QuXFxuICAgIEBjcmF3bGVyLnJvdXRlci5kZWZhdWx0X2hhbmRsZXJcXG4gICAgYXN5bmMgZGVmIHJlcXVlc3RfaGFuZGxlcihjb250ZXh0OiBQbGF5d3JpZ2h0Q3Jhd2xpbmdDb250ZXh0KSAtPiBOb25lOlxcbiAgICAgICAgY29udGV4dC5sb2cuaW5mbyhmJ1Byb2Nlc3Npbmcge2NvbnRleHQucmVxdWVzdC51cmx9IC4uLicpXFxuXFxuICAgICAgICAjIEV4dHJhY3QgZGF0YSBmcm9tIHRoZSBwYWdlIHVzaW5nIFBsYXl3cmlnaHQgQVBJLlxcbiAgICAgICAgZGF0YSA9IHtcXG4gICAgICAgICAgICAndXJsJzogY29udGV4dC5yZXF1ZXN0LnVybCxcXG4gICAgICAgICAgICAndGl0bGUnOiBhd2FpdCBjb250ZXh0LnBhZ2UudGl0bGUoKSxcXG4gICAgICAgIH1cXG5cXG4gICAgICAgICMgUHVzaCB0aGUgZXh0cmFjdGVkIGRhdGEgdG8gdGhlIGRlZmF1bHQgZGF0YXNldC5cXG4gICAgICAgIGF3YWl0IGNvbnRleHQucHVzaF9kYXRhKGRhdGEpXFxuXFxuICAgICAgICAjIEV4dHJhY3QgYWxsIGxpbmtzIG9uIHRoZSBwYWdlIGFuZCBlbnF1ZXVlIHRoZW0uXFxuICAgICAgICBhd2FpdCBjb250ZXh0LmVucXVldWVfbGlua3MoKVxcblxcbiAgICAjIFJ1biB0aGUgY3Jhd2xlciB3aXRoIHRoZSBpbml0aWFsIGxpc3Qgb2YgVVJMcy5cXG4gICAgYXdhaXQgY3Jhd2xlci5ydW4oWydodHRwczovL2NyYXdsZWUuZGV2J10pXFxuXFxuICAgICMgRXhwb3J0IHRoZSBlbnRpcmUgZGF0YXNldCB0byBhIENTViBmaWxlLlxcbiAgICBhd2FpdCBjcmF3bGVyLmV4cG9ydF9kYXRhKCdyZXN1bHRzLmNzdicpXFxuXFxuICAgICMgT3IgYWNjZXNzIHRoZSBkYXRhIGRpcmVjdGx5LlxcbiAgICBkYXRhID0gYXdhaXQgY3Jhd2xlci5nZXRfZGF0YSgpXFxuICAgIGNyYXdsZXIubG9nLmluZm8oZidFeHRyYWN0ZWQgZGF0YToge2RhdGEuaXRlbXN9JylcXG5cXG5cXG5pZiBfX25hbWVfXyA9PSAnX19tYWluX18nOlxcbiAgICBhc3luY2lvLnJ1bihtYWluKCkpXFxuXCJ9Iiwib3B0aW9ucyI6eyJidWlsZCI6ImxhdGVzdCIsImNvbnRlbnRUeXBlIjoiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCIsIm1lbW9yeSI6NDA5NiwidGltZW91dCI6MTgwfX0.xkqQZRAs2ksZSltV4qM1so0YP8n-i-KMFQkUnLsqJN4&asrc=run_on_apify)

```python
import asynciofrom crawlee.crawlers import PlaywrightCrawler, PlaywrightCrawlingContextasync def main() -> None: crawler = PlaywrightCrawler( max_requests_per_crawl=10, # Limit the max requests per crawl. headless=True, # Run in headless mode (set to False to see the browser). browser_type='firefox', # Use Firefox browser. ) # Define the default request handler, which will be called for every request. @crawler.router.default_handler async def request_handler(context: PlaywrightCrawlingContext) -> None: context.log.info(f'Processing {context.request.url} ...') # Extract data from the page using Playwright API. data = { 'url': context.request.url, 'title': await context.page.title(), } # Push the extracted data to the default dataset. await context.push_data(data) # Extract all links on the page and enqueue them. await context.enqueue_links() # Run the crawler with the initial list of URLs. await crawler.run(['https://crawlee.dev']) # Export the entire dataset to a CSV file. await crawler.export_data('results.csv') # Or access the data directly. data = await crawler.get_data() crawler.log.info(f'Extracted data: {data.items}')if __name__ == '__main__': asyncio.run(main())
```

Or start with a template from our CLI

` $uvx 'crawlee[cli]' create my-crawler `

Built with 🤍 by Apify. Forever free and open-source.

## What are the benefits?

### Unblock websites by default

Crawlee crawls stealthily with zero configuration, but you can customize its behavior to overcome any protection. Real-world fingerprints included.

[Learn more](https://crawlee.dev/python/docs/guides/avoid-blocking)

```text
fingerprint_generator = DefaultFingerprintGenerator( header_options=HeaderGeneratorOptions( browsers=['chromium', 'firefox'], devices=['mobile'], locales=['en-US'] ),)
```

### Work with your favorite tools

Crawlee integrates BeautifulSoup, Cheerio, Puppeteer, Playwright, and other popular open-source tools. No need to learn new syntax.

[Learn more](https://crawlee.dev/python/docs/quick-start#choose-your-crawler)

![Work with your favorite tools](https://crawlee.dev/python/img/favorite-tools-light.webp)![Work with your favorite tools](https://crawlee.dev/python/img/favorite-tools-dark.webp)

### One API for headless and HTTP

Switch between HTTP and headless without big rewrites thanks to a shared API. Or even let Adaptive crawler decide if JS rendering is needed.

[Learn more](https://crawlee.dev/python/api)

```python
crawler = AdaptivePlaywrightCrawler.with_parsel_static_parser()@crawler.router.default_handlerasync def request_handler(context: AdaptivePlaywrightCrawlingContext) -> None: prices = await context.query_selector_all('span.price') await context.enqueue_links()
```

## What else is in Crawlee?

## Deploy to cloud

Crawlee, by Apify, works anywhere, but Apify offers the best experience. Easily turn your project into an

[Actor](https://apify.com/actors)—a serverless micro-app with built-in infra, proxies, and storage.

[Deploy to Apify](https://docs.apify.com/platform/actors/development/deployment)

Install Apify SDK and Apify CLI.

Add

Actor.init()

to the beginning and

Actor.exit()

to the end of your code.

Use the Apify CLI to push the code to the Apify platform.

## Get started now!

Crawlee won’t fix broken selectors for you (yet), but it makes building and maintaining reliable crawlers faster and easier—so you can focus on what matters most.

---

## Crawlee for JavaScript · Build reliable crawlers. Fast.

> Source: https://crawlee.dev/
> Tokens: ~977

## Build reliable web scrapers. Fast.

Crawlee is a web scraping library for JavaScript and Python. It handles blocking, crawling, proxies, and browsers for you.

![Crawlee JavaScript](https://crawlee.dev/img/crawlee-javascript-light.svg)![Crawlee JavaScript](https://crawlee.dev/img/crawlee-javascript-dark.svg)

`npx crawlee create my-crawler`

![Crawlee Python](https://crawlee.dev/img/crawlee-python-light.svg)![Crawlee Python](https://crawlee.dev/img/crawlee-python-dark.svg)

`uvx 'crawlee[cli]' create my-crawler`

[Run on](https://console.apify.com/actors/6i5QsHBMtm3hKph70?runConfig=eyJ1IjoiRWdQdHczb2VqNlRhRHQ1cW4iLCJ2IjoxfQ.eyJpbnB1dCI6IntcbiAgICBcImNvZGVcIjogXCJpbXBvcnQgeyBQbGF5d3JpZ2h0Q3Jhd2xlciB9IGZyb20gJ2NyYXdsZWUnO1xcblxcbi8vIENyYXdsZXIgc2V0dXAgZnJvbSB0aGUgcHJldmlvdXMgZXhhbXBsZS5cXG5jb25zdCBjcmF3bGVyID0gbmV3IFBsYXl3cmlnaHRDcmF3bGVyKHtcXG4gICAgLy8gVXNlIHRoZSByZXF1ZXN0SGFuZGxlciB0byBwcm9jZXNzIGVhY2ggb2YgdGhlIGNyYXdsZWQgcGFnZXMuXFxuICAgIGFzeW5jIHJlcXVlc3RIYW5kbGVyKHsgcmVxdWVzdCwgcGFnZSwgZW5xdWV1ZUxpbmtzLCBwdXNoRGF0YSwgbG9nIH0pIHtcXG4gICAgICAgIGNvbnN0IHRpdGxlID0gYXdhaXQgcGFnZS50aXRsZSgpO1xcbiAgICAgICAgbG9nLmluZm8oYFRpdGxlIG9mICR7cmVxdWVzdC5sb2FkZWRVcmx9IGlzICcke3RpdGxlfSdgKTtcXG5cXG4gICAgICAgIC8vIFNhdmUgcmVzdWx0cyBhcyBKU09OIHRvIC4vc3RvcmFnZS9kYXRhc2V0cy9kZWZhdWx0XFxuICAgICAgICBhd2FpdCBwdXNoRGF0YSh7IHRpdGxlLCB1cmw6IHJlcXVlc3QubG9hZGVkVXJsIH0pO1xcblxcbiAgICAgICAgLy8gRXh0cmFjdCBsaW5rcyBmcm9tIHRoZSBjdXJyZW50IHBhZ2VcXG4gICAgICAgIC8vIGFuZCBhZGQgdGhlbSB0byB0aGUgY3Jhd2xpbmcgcXVldWUuXFxuICAgICAgICBhd2FpdCBlbnF1ZXVlTGlua3MoKTtcXG4gICAgfSxcXG5cXG4gICAgLy8gVW5jb21tZW50IHRoaXMgb3B0aW9uIHRvIHNlZSB0aGUgYnJvd3NlciB3aW5kb3cuXFxuICAgIC8vIGhlYWRsZXNzOiBmYWxzZSxcXG5cXG4gICAgLy8gQ29tbWVudCB0aGlzIG9wdGlvbiB0byBzY3JhcGUgdGhlIGZ1bGwgd2Vic2l0ZS5cXG4gICAgbWF4UmVxdWVzdHNQZXJDcmF3bDogMjAsXFxufSk7XFxuXFxuLy8gQWRkIGZpcnN0IFVSTCB0byB0aGUgcXVldWUgYW5kIHN0YXJ0IHRoZSBjcmF3bC5cXG5hd2FpdCBjcmF3bGVyLnJ1bihbJ2h0dHBzOi8vY3Jhd2xlZS5kZXYnXSk7XFxuXFxuLy8gRXhwb3J0IHRoZSBlbnRpcmV0eSBvZiB0aGUgZGF0YXNldCB0byBhIHNpbmdsZSBmaWxlIGluXFxuLy8gLi9zdG9yYWdlL2tleV92YWx1ZV9zdG9yZXMvcmVzdWx0LmNzdlxcbmNvbnN0IGRhdGFzZXQgPSBhd2FpdCBjcmF3bGVyLmdldERhdGFzZXQoKTtcXG5hd2FpdCBkYXRhc2V0LmV4cG9ydFRvQ1NWKCdyZXN1bHQnKTtcXG5cXG4vLyBPciB3b3JrIHdpdGggdGhlIGRhdGEgZGlyZWN0bHkuXFxuY29uc3QgZGF0YSA9IGF3YWl0IGNyYXdsZXIuZ2V0RGF0YSgpO1xcbmNvbnNvbGUudGFibGUoZGF0YS5pdGVtcyk7XFxuXCJcbn0iLCJvcHRpb25zIjp7ImNvbnRlbnRUeXBlIjoiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCIsIm1lbW9yeSI6NDA5Nn19.WKB14SjgTceKYyhONw2oXTkiOao6X4-UAS7cIuwqGvo&asrc=run_on_apify)

```javascript
import { PlaywrightCrawler } from 'crawlee';// PlaywrightCrawler crawls the web using a headless browser controlled by the Playwright library.const crawler = new PlaywrightCrawler({ // Use the requestHandler to process each of the crawled pages. async requestHandler({ request, page, enqueueLinks, pushData, log }) { const title = await page.title(); log.info(`Title of ${request.loadedUrl} is '${title}'`); // Save results as JSON to `./storage/datasets/default` directory. await pushData({ title, url: request.loadedUrl }); // Extract links from the current page and add them to the crawling queue. await enqueueLinks(); }, // Uncomment this option to see the browser window. // headless: false, // Comment this option to scrape the full website. maxRequestsPerCrawl: 20,});// Add first URL to the queue and start the crawl.await crawler.run(['https://crawlee.dev']);// Export the whole dataset to a single file in `./result.csv`.await crawler.exportData('./result.csv');// Or work with the data directly.const data = await crawler.getData();console.table(data.items);
```

Or start with a template from our CLI

` $npx crawlee create my-crawler `

Built with 🤍 by Apify. Forever free and open-source.

## Get started now!

Crawlee won’t fix broken selectors for you (yet), but it makes building and maintaining reliable crawlers faster and easier—so you can focus on what matters most.

---

## Crawlee for JavaScript · Build reliable crawlers. Fast.

> Source: https://crawlee.dev/js
> Tokens: ~1 248

## Build reliable web scrapers. Fast.

Crawlee is a web scraping library for JavaScript and Python. It handles blocking, crawling, proxies, and browsers for you.

![Crawlee JavaScript](https://crawlee.dev/img/crawlee-javascript-light.svg)![Crawlee JavaScript](https://crawlee.dev/img/crawlee-javascript-dark.svg)

[Run on](https://console.apify.com/actors/6i5QsHBMtm3hKph70?runConfig=eyJ1IjoiRWdQdHczb2VqNlRhRHQ1cW4iLCJ2IjoxfQ.eyJpbnB1dCI6IntcbiAgICBcImNvZGVcIjogXCJpbXBvcnQgeyBQbGF5d3JpZ2h0Q3Jhd2xlciB9IGZyb20gJ2NyYXdsZWUnO1xcblxcbi8vIENyYXdsZXIgc2V0dXAgZnJvbSB0aGUgcHJldmlvdXMgZXhhbXBsZS5cXG5jb25zdCBjcmF3bGVyID0gbmV3IFBsYXl3cmlnaHRDcmF3bGVyKHtcXG4gICAgLy8gVXNlIHRoZSByZXF1ZXN0SGFuZGxlciB0byBwcm9jZXNzIGVhY2ggb2YgdGhlIGNyYXdsZWQgcGFnZXMuXFxuICAgIGFzeW5jIHJlcXVlc3RIYW5kbGVyKHsgcmVxdWVzdCwgcGFnZSwgZW5xdWV1ZUxpbmtzLCBwdXNoRGF0YSwgbG9nIH0pIHtcXG4gICAgICAgIGNvbnN0IHRpdGxlID0gYXdhaXQgcGFnZS50aXRsZSgpO1xcbiAgICAgICAgbG9nLmluZm8oYFRpdGxlIG9mICR7cmVxdWVzdC5sb2FkZWRVcmx9IGlzICcke3RpdGxlfSdgKTtcXG5cXG4gICAgICAgIC8vIFNhdmUgcmVzdWx0cyBhcyBKU09OIHRvIC4vc3RvcmFnZS9kYXRhc2V0cy9kZWZhdWx0XFxuICAgICAgICBhd2FpdCBwdXNoRGF0YSh7IHRpdGxlLCB1cmw6IHJlcXVlc3QubG9hZGVkVXJsIH0pO1xcblxcbiAgICAgICAgLy8gRXh0cmFjdCBsaW5rcyBmcm9tIHRoZSBjdXJyZW50IHBhZ2VcXG4gICAgICAgIC8vIGFuZCBhZGQgdGhlbSB0byB0aGUgY3Jhd2xpbmcgcXVldWUuXFxuICAgICAgICBhd2FpdCBlbnF1ZXVlTGlua3MoKTtcXG4gICAgfSxcXG5cXG4gICAgLy8gVW5jb21tZW50IHRoaXMgb3B0aW9uIHRvIHNlZSB0aGUgYnJvd3NlciB3aW5kb3cuXFxuICAgIC8vIGhlYWRsZXNzOiBmYWxzZSxcXG5cXG4gICAgLy8gQ29tbWVudCB0aGlzIG9wdGlvbiB0byBzY3JhcGUgdGhlIGZ1bGwgd2Vic2l0ZS5cXG4gICAgbWF4UmVxdWVzdHNQZXJDcmF3bDogMjAsXFxufSk7XFxuXFxuLy8gQWRkIGZpcnN0IFVSTCB0byB0aGUgcXVldWUgYW5kIHN0YXJ0IHRoZSBjcmF3bC5cXG5hd2FpdCBjcmF3bGVyLnJ1bihbJ2h0dHBzOi8vY3Jhd2xlZS5kZXYnXSk7XFxuXFxuLy8gRXhwb3J0IHRoZSBlbnRpcmV0eSBvZiB0aGUgZGF0YXNldCB0byBhIHNpbmdsZSBmaWxlIGluXFxuLy8gLi9zdG9yYWdlL2tleV92YWx1ZV9zdG9yZXMvcmVzdWx0LmNzdlxcbmNvbnN0IGRhdGFzZXQgPSBhd2FpdCBjcmF3bGVyLmdldERhdGFzZXQoKTtcXG5hd2FpdCBkYXRhc2V0LmV4cG9ydFRvQ1NWKCdyZXN1bHQnKTtcXG5cXG4vLyBPciB3b3JrIHdpdGggdGhlIGRhdGEgZGlyZWN0bHkuXFxuY29uc3QgZGF0YSA9IGF3YWl0IGNyYXdsZXIuZ2V0RGF0YSgpO1xcbmNvbnNvbGUudGFibGUoZGF0YS5pdGVtcyk7XFxuXCJcbn0iLCJvcHRpb25zIjp7ImNvbnRlbnRUeXBlIjoiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCIsIm1lbW9yeSI6NDA5Nn19.WKB14SjgTceKYyhONw2oXTkiOao6X4-UAS7cIuwqGvo&asrc=run_on_apify)

```javascript
import { PlaywrightCrawler } from 'crawlee';const crawler = new PlaywrightCrawler({ async requestHandler({ request, page, enqueueLinks, pushData, log }) { const title = await page.title(); log.info(`Title of ${request.loadedUrl} is '${title}'`); await pushData({ title, url: request.loadedUrl }); await enqueueLinks(); }, // Uncomment this option to see the browser window. // headless: false,});await crawler.run(['https://crawlee.dev']);
```

Or start with a template from our CLI

` $npx crawlee create my-crawler `

Built with 🤍 by Apify. Forever free and open-source.

## What are the benefits?

### Unblock websites by default

Crawlee crawls stealthily with zero configuration, but you can customize its behavior to overcome any protection. Real-world fingerprints included.

[Learn more](https://crawlee.dev/js/docs/guides/avoid-blocking)

```text
{ fingerprintOptions: { fingerprintGeneratorOptions: { browsers: ['chrome', 'firefox'], devices: ['mobile'], locales: ['en-US'], }, },},
```

### Work with your favorite tools

Crawlee integrates BeautifulSoup, Cheerio, Puppeteer, Playwright, and other popular open-source tools. No need to learn new syntax.

[Learn more](https://crawlee.dev/js/docs/quick-start#choose-your-crawler)

![Work with your favorite tools](https://crawlee.dev/img/favorite-tools-light.webp)![Work with your favorite tools](https://crawlee.dev/img/favorite-tools-dark.webp)

### One API for headless and HTTP

Switch between HTTP and headless without big rewrites thanks to a shared API. Or even let Adaptive crawler decide if JS rendering is needed.

[Learn more](https://crawlee.dev/js/api/core)

```javascript
const crawler = new AdaptivePlaywrightCrawler({ renderingTypeDetectionRatio: 0.1, async requestHandler({ querySelector, enqueueLinks }) { // The crawler detects if JS rendering is needed // to extract this data. If not, it will use HTTP // for follow-up requests to save time and costs. const $prices = await querySelector('span.price') await enqueueLinks(); },});
```

## What else is in Crawlee?

## Deploy to cloud

Crawlee, by Apify, works anywhere, but Apify offers the best experience. Easily turn your project into an

[Actor](https://apify.com/actors)—a serverless micro-app with built-in infra, proxies, and storage.

[Deploy to Apify](https://crawlee.dev/js/docs/deployment/apify-platform)

Install Apify SDK and Apify CLI.

Add

Actor.init()

to the begining and

Actor.exit()

to the end of your code.

Use the Apify CLI to push the code to the Apify platform.

## Get started now!

Crawlee won’t fix broken selectors for you (yet), but it makes building and maintaining reliable crawlers faster and easier—so you can focus on what matters most.

---

## Quick Start

> Source: https://crawlee.dev/js/docs/quick-start
> Tokens: ~1 661

- - Quick Start

Version: 3.15

## Quick Start

With this short tutorial you can start scraping with Crawlee in a minute or two. To learn in-depth how Crawlee works, read the [Introduction](/js/docs/introduction), which is a comprehensive step-by-step guide for creating your first scraper.

### Choose your crawler​

Crawlee comes with three main crawler classes: [`CheerioCrawler`](/js/api/cheerio-crawler/class/CheerioCrawler), [`PuppeteerCrawler`](/js/api/puppeteer-crawler/class/PuppeteerCrawler) and [`PlaywrightCrawler`](/js/api/playwright-crawler/class/PlaywrightCrawler). All classes share the same interface for maximum flexibility when switching between them.

#### CheerioCrawler​

This is a plain HTTP crawler. It parses HTML using the [Cheerio](https://github.com/cheeriojs/cheerio) library and crawls the web using the specialized [got-scraping](https://github.com/apify/got-scraping) HTTP client which masks as a browser. It's very fast and efficient, but can't handle JavaScript rendering.

#### PuppeteerCrawler​

This crawler uses a headless browser to crawl, controlled by the [Puppeteer](https://github.com/puppeteer/puppeteer) library. It can control Chromium or Chrome. Puppeteer is the de-facto standard in headless browser automation.

#### PlaywrightCrawler​

[Playwright](https://github.com/microsoft/playwright) is a more powerful and full-featured successor to Puppeteer. It can control Chromium, Chrome, Firefox, Webkit and many other browsers. If you're not familiar with Puppeteer already, and you need a headless browser, go with Playwright.

before you start

Crawlee requires [Node.js 16 or later](https://nodejs.org/en/).

### Installation with Crawlee CLI​

The fastest way to try Crawlee out is to use the **Crawlee CLI** and choose the **Getting started example**. The CLI will install all the necessary dependencies and add boilerplate code for you to play with.

```bash
npx crawlee create my-crawler
```

After the installation is complete you can start the crawler like this:

```bash
cd my-crawler &&npm start
```

### Manual installation​

You can add Crawlee to any Node.js project by running:

- CheerioCrawler- PlaywrightCrawler- PuppeteerCrawler

```bash
npminstall crawlee
```

### Crawling​

Run the following example to perform a recursive crawl of the Crawlee website using the selected crawler.

Don't forget about module imports

To run the example, add a `"type": "module"` clause into your `package.json` or copy it into a file with an `.mjs` suffix. This enables `import` statements in Node.js. See [Node.js docs](https://nodejs.org/dist/latest-v16.x/docs/api/esm.html#enabling) for more information.

- CheerioCrawler- PlaywrightCrawler- PuppeteerCrawler

```block
Run onimport{ CheerioCrawler, Dataset }from'crawlee';// CheerioCrawler crawls the web using HTTP requests// and parses HTML using the Cheerio library.const crawler =newCheerioCrawler({// Use the requestHandler to process each of the crawled pages.asyncrequestHandler({ request, $, enqueueLinks, log }){const title =$('title').text(); log.info(`Title of ${request.loadedUrl} is '${title}'`);// Save results as JSON to ./storage/datasets/defaultawait Dataset.pushData({ title, url: request.loadedUrl });// Extract links from the current page// and add them to the crawling queue.awaitenqueueLinks();},// Let's limit our crawls to make our tests shorter and safer. maxRequestsPerCrawl:50,});// Add first URL to the queue and start the crawl.await crawler.run(['https://crawlee.dev']);
```

When you run the example, you will see Crawlee automating the data extraction process in your terminal.

```log
INFOCheerioCrawler: Starting the crawlINFOCheerioCrawler: Title of https://crawlee.dev/ is 'Crawlee · Build reliable crawlers. Fast. | Crawlee'INFOCheerioCrawler: Title of https://crawlee.dev/js/docs/examples is 'Examples | Crawlee'INFOCheerioCrawler: Title of https://crawlee.dev/js/docs/quick-start is 'Quick Start | Crawlee'INFOCheerioCrawler: Title of https://crawlee.dev/js/docs/guides is 'Guides | Crawlee'
```

#### Running headful browsers​

Browsers controlled by Puppeteer and Playwright run headless (without a visible window). You can switch to headful by adding the `headless: false` option to the crawlers' constructor. This is useful in the development phase when you want to see what's going on in the browser.

- PlaywrightCrawler- PuppeteerCrawler

```block
Run onimport{ PlaywrightCrawler, Dataset }from'crawlee';const crawler =newPlaywrightCrawler({asyncrequestHandler({ request, page, enqueueLinks, log }){const title =await page.title(); log.info(`Title of ${request.loadedUrl} is '${title}'`);await Dataset.pushData({ title, url: request.loadedUrl });awaitenqueueLinks();},// When you turn off headless mode, the crawler// will run with a visible browser window. headless:false,// Let's limit our crawls to make our tests shorter and safer. maxRequestsPerCrawl:50,});// Add first URL to the queue and start the crawl.await crawler.run(['https://crawlee.dev']);
```

When you run the example code, you'll see an automated browser blaze through the Crawlee website.

note

For the sake of this show off, we've slowed down the crawler, but rest assured, it's blazing fast in real world usage.

![An image showing off Crawlee scraping the Crawlee website using Puppeteer/Playwright and Chromium](/img/chrome-scrape-light.gif)![An image showing off Crawlee scraping the Crawlee website using Puppeteer/Playwright and Chromium](/img/chrome-scrape-dark.gif)

### Results​

Crawlee stores data to the `./storage` directory in your current working directory. The results of your crawl will be available under `./storage/datasets/default/*.json` as JSON files.

```json
./storage/datasets/default/000000001.json{"url":"https://crawlee.dev/","title":"Crawlee · The scalable web crawling, scraping and automation library for JavaScript/Node.js | Crawlee"}
```

tip

You can override the storage directory by setting the `CRAWLEE_STORAGE_DIR` environment variable.

### Examples and further reading​

You can find more examples showcasing various features of Crawlee in the [Examples](/js/docs/examples) section of the documentation. To better understand Crawlee and its components you should read the [Introduction](/js/docs/introduction) step-by-step guide.

**Related links**

- [Configuration](/js/docs/guides/configuration)
- [Request storage](/js/docs/guides/request-storage)
- [Result storage](/js/docs/guides/result-storage)

[Edit this page](https://github.com/apify/crawlee/edit/master/website/versioned_docs/version-3.15/quick-start/index.mdx)

Last updated on **Jan 30, 2026** by **nikitachapovskii-dev**

[Next

Introduction](/js/docs/introduction)