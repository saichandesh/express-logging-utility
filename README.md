# Express Logging Utility

Express logging utility is a light-weight express middleware that provides a unique transaction id for each request. This unique transaction id can be retrieved anywhere in the request process and can be injected into the logs. Thus helps to identify the logs for each request uniquely. This can be used in [Express](https://expressjs.com/),  [Nestjs](https://nestjs.com/) or any other node.js server side frameworks along with logging libraries like [Winston](https://www.npmjs.com/package/winston), [bunyan](https://www.npmjs.com/package/bunyan) etc.,

It's built on top of [Async Hooks](https://nodejs.org/api/async_hooks.html), a high level api that provides life cycle hooks for asynchronous resources, which can registered to track asynchronous operations in the node.js request process. This middleware also helps to create and retrieve variables for each request context individually. 

## Getting Started

### Prerequisites

Using npm :

```
npm install -g npm
```

### Installation

```
npm install --save express-logging-utility
```

### Usage

In Express : 
```

```

In Nestjs : 
```
import { NestFactory } from '@nestjs/core';
// Express logging utility
import * as ExpressLoggingUtility from 'express-logging-utility';

// Your application module
import { ApplicationModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  app.use(ExpressLoggingUtility); // Inject express logging utility middleware
  await app.listen(3000);
}
bootstrap();
```

## Authors

* **Sai Chandesh Gurramkonda** - [Github](https://github.com/saichandesh)