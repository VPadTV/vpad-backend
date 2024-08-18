# VPad

A website dedicated to hosting indie animation and all that relates to it: the films themselves, merch, fundraising and subscriptions, both free and paid.
The main reason I think this is a good idea is because a percentage of the money, currently, goes to YouTube (and by extension Google and Alphabet), merch shop hosts, Patreon and whatever else, and I personally think moving away from that and into a platform that actually cares about its creators is a huge step forward in both of our industries, for indie animation, hopefully higher profits and less money being wasted on MegaCorps, and for software development, if this were to succeed, of actually doing something meaningful in the face of one of the biggest online entities (YouTube).

## Development

### Joining the project

We have a [discord server](https:-discord.gg/CF8vQdShPx)! Feel free to join and message me (jaquiethecat) for developer approval 😄

### Stack

This is the backend. We are using:

- TypeScript
- express.js
- Prisma
- PostgreSQL

### Project Structure

```txt
src/ - Where the source code is
        docs/ - Swagger docs
            paths/ - Each subfolder represents a path, with the file being the route itself
            schemas/ - Reusable bits of code
        functions/ - Core functionality
        infra/ - Infrastructure
            adapters/ - Adapters (such as express middleware, routes)
            gateways/ - Gateway classes (Database, JWT, File Storage, etc)
            middlewares/ - Middlewares
        plugins/ - Helper functions
            http/- Errors and responses
        main/ - The code that actually runs the project
            routes.ts - Where routes are registered
            server.dev.ts - Development server entry point
        routes/ - Route classes
test/ - Where the tests are
```
