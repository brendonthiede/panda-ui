# panda-ui

> UI for information related to the Sircon CI pipeline (Panda/Bamboo)

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Deployment
This is expected to run on `sir-lp-bamboo01.sircon.com` under the sub directory of `bamboo-tools`.
In order to allow vue-router to work correctly, the following rewrite rule needs to exist for the VirtualHost configuration for `sir-lp-bamboo01.sircon.com`:
```
RewriteRule ^/bamboo-tools/([A-Za-z0-9-]+)/?$ /bamboo-tools/index.html?routeName=$1 [R,NC,L]
```
This configuration is currently stored in `/etc/httpd/conf.d/virtualservers.conf`.
Compiled files should be copied to `sir-lp-bamboo01.sircon.com:/var/www/html/bamboo-tools`.
The folder `sir-lp-bamboo01.sircon.com:/var/www/html/bamboo-tools/static` should be completely replaced.
