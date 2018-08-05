# Express Logging Utility

Express logging utility is a light-weight express middleware that provides a unique transaction id for each request. This unique transaction id can be retrieved anywhere in the request process and can be injected into the logs. Thus helps to identify the logs for each request uniquely. This can be used in [Express](https://expressjs.com/),  [Nestjs](https://nestjs.com/) or any other node.js server side frameworks along with logging libraries like [Winston](https://www.npmjs.com/package/winston), [bunyan](https://www.npmjs.com/package/bunyan) etc.,

It's built on top of [Async Hooks](https://nodejs.org/api/async_hooks.html), a high level api that provides life cycle hooks for asynchronous resources, which can be registered to track asynchronous operations in the node.js request process. This middleware also helps to create and retrieve variables for each request context individually. 

## Getting Started

### Prerequisites
Nodejs version >= 8.2.1

Using npm :

```
npm install -g npm
```

### Installation

```
npm install --save express-logging-utility
```

### Usage

## Express.js
### To get unique logging id for each request : 
```
const express = require('express')
const app = express();

// Express logging utility
const { middleware, get } = require('express-logging-utility');

app.use(middleware); // Inject express logging utility middleware

app.get('/', (req, res) => {
    // Get unique logging transaction id
    const loggingId = get('loggingId'); 
    console.log(`Request logging id : ${loggingId}`);
    res.send('Hello World!')
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
```
### To share variables across each request : 
In `index.js`
```
const express = require('express')
const app = express();

// Express logging utility
const { middleware, set } = require('express-logging-utility');

const service = require('./service');

app.use(middleware); // Inject express logging utility middleware

app.get('/', (req, res) => {
    // Set test variable
    set('test', 'testing_purpose');
    res.send(service());
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
```
In `service.js`
```
// Express logging utility
const { get } = require('express-logging-utility');

module.exports = () => {
    // Get test variable
    const test = get('test'); 
    console.log(`test : ${test}`);
    return 'hello world'
}
```

## Nest.js : 

### To get unique logging id for each request : 

In `main.ts`
```
import { NestFactory } from '@nestjs/core';
// Express logging utility
import { middleware } from 'express-logging-utility';

// Your application module
import { ApplicationModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  app.use(middleware); // Inject express logging utility middleware
  await app.listen(3000);
}
bootstrap();
```
In `app.controller.ts`
```
import { Controller, Get } from '@nestjs/common';
import { get } from 'express-logging-utility'; // import get from express-logging-utility

@Controller('cats')
export class CatsController {
  @Get()
  findAll() {
    const loggingId = get('loggingId'); // Get unique logging transaction id
    console.log(`Request logging id : ${loggingId}`);
    return 'This action returns all cats';
  }
}

```
### To share variables across each request : 

In `main.ts`
```
import { NestFactory } from '@nestjs/core';
// Express logging utility
import { middleware } from 'express-logging-utility';

// Your application module
import { ApplicationModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  app.use(middleware); // Inject express logging utility middleware
  await app.listen(3000);
}
bootstrap();
```
In `app.controller.ts`
```
import { Controller, Get } from '@nestjs/common';
import { set } from 'express-logging-utility'; // import set from express-logging-utility

@Controller('cats')
export class CatsController {
  @Get()
  findAll() {
    const loggingId = set('test', 'testing_purpose'); // set variable that will be shared across the request individually.
    console.log(`Request logging id : ${loggingId}`);
    return 'This action returns all cats';
  }
}

```
In `app.service.ts`
```
import { Injectable } from '@nestjs/common';
import { Cat } from './interfaces/cat.interface';
import { get } from 'express-logging-utility'; // import get from express-logging-utility

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  findAll(): Cat[] {
    // Get the variable 'test'
    const test = get('test'); 
    console.log(`test variable : ${test}`);
    return this.cats;
  }
}

```
## Authors

* **Sai Chandesh Gurramkonda** - [Github](https://github.com/saichandesh)