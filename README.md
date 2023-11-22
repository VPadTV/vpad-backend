# TO BE NAMED

A website dedicated to hosting indie animation and all that relates to it: the films themselves, merch, fundraising and subscriptions, both free and paid.
The main reason I think this is a good idea is because a percentage of the money, currently, goes to YouTube (and by extension Google and Alphabet), merch shop hosts, Patreon and whatever else, and I personally think moving away from that and into a platform that actually cares about its creators is a huge step forward in both of our industries, for indie animation, hopefully higher profits and less money being wasted on MegaCorps, and for software development, if this were to succeed, of actually doing something meaningful in the face of one of the biggest online entities (YouTube).

## Development

### Stack

This is the backend. We are using:

- TypeScript
- express.js
- Prisma
- PostgreSQL

### Project Structure

```c
src/ // Where the source code is
  domain/ // Core functionality
    functions/ // For code that does things
    helpers/ // For helper functions
  infra/ // For infrastructure
    adapters/ // For adapters (such as express middleware, routes)
    gateways/ // For Gateway classes (Database, JWT, File Storage, etc)
    middlewares/ // For middlewares
  main/ // For the code that actually runs the project
    app.ts // App class
    routes.ts // Where routes are registered
    server.dev.ts // Development server entry point
  routes/ // For Route classes
test/` // Where the tests are
```
