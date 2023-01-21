# URL Shortner Microservice
## fCC Project - Create short URLs

Node.js code for app that can create short URLs.

### Functionality
- POST a URL to `/api/shorturl` via URL input box. Receive JSON response with original_url and short_url properties in the following format.
```
{ original_url: <original_url>, short_url: <short_url> }
```
- When you visit `[project_url]/api/shorturl/<short_url>`, you will be redirected to the original URL.
- Original URL must follow valid `http://www.example.com` format. Otherwise, JSON response will contain `{ error: "invalid url" }`.
- Submitted URLs are verified using the function `dns.lookup(hostname, cb)` from the `dns` built-in node module.