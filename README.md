# cloudflare-worker


## Table of Contents
- [Installation](#installation)
    - [Install Volta](#install-volta)
    - [Install cloudflare Wrangler](#install-cloudflare-wrangler)
    - [Create new cloudflare worker project by CLI](#create-new-cloudflare-worker-project-by-cli)
    - [Install eslint](#install-eslint)
- [List of workers in this project](#list-of-workers-in-this-project)
    - [worker-test](#worker-test)
        - [KV Binding - Expose URL to interact with KV](#kv-binding---expose-url-to-interact-with-kv)
        - [Cron run scheduled action](#cron-run-scheduled-action)
        - [Library](#library)
    - [worker-D1-integration](#worker-d1-integration)
        - [Library](#library-1)

## Installation

### Install Volta

To install Volta, follow these steps:

1. Visit the [Volta website](https://volta.sh/) and download the installer for your operating system.
2. Run the installer and follow the on-screen instructions to complete the installation.
3. Verify that Volta is installed by opening a new terminal window and running the following command:

    ```bash
    volta --version
    ```

    If the command displays the version number, Volta has been successfully installed.

4. You're now ready to use Volta for managing your project's Node.js version!

5. Pin Node Project version: `volta pin npm@18.18.0`


### Install cloudflare Wrangler

> Skip this if your project already installed Wrangler
```bash
npm install @cloudflare/wrangler --save-dev
```

> update Wrangler
```bash 
npm install wrangler@latest
```

### Create new cloudflare worker project by CLI
```bash
cd {SOURCE}/cloudflare-worker

npm create cloudflare@latest {project-name}
```

### Install eslint
```bash
npm install eslint

npx eslint --init
```



## List of workers in this project
### [worker-test](https://worker-test.minhnq-0702.workers.dev/)

#### KV Binding - Expose URL to interact with KV
`Enpoint`: `/test-kv`

Method:
- `GET`: `/test-kv?key=key-to-get-value`
    - Get the value of provided key

- `POST`: `/test-kv`
    - Payload in form-data
    ```javascript
    {
        "key1": "value1",
        "key2": "value2"
    }
    ```
    - data in form will be stored in KV

- `DELETE`: `/test-kv?key=key-to-delete`
    - Delete the key-value of provided key


`Endpoint`: `/redirect?url=redirect-url`

Method:
- `ALL`: `/redirect?url=https%3A%2F%2Fmy.mingne.dev`
    - should escape redirected url

#### Cron run scheduled action

Lear how to setup cron run schedule action in this sample worker
- [Schedule Code](worker-test/src/index.ts)
- [Cron setup](worker-test/wrangler.toml)

#### Library
- [Router library: ITTY-ROUTER](https://itty.dev)

### [worker-D1-integration](https://worker-d1.minhnq-0702.workers.dev/)
> Create Rest API with Hono and integrate with D1 Database (a cloudflare serverless database)

#### Add Hono API
- Setup Hono API App
    ```typescript
    app.route('/sample', router.sample);
    app.route('/auth', router.auth);
    app.route('/api', router.api);


    export default app
    ```

#### Add JWT Authentication
- Add Secret key environment in `{SOURCE}/worker-d1/.dev.vars` file
    ```bash
    JWT_SECRET='dev-ne'
    ```
- Deploy key to Cloudflare worker
    ```bash
    npx wrangler secret put JWT_SECRET
    ```
- Setup JWT Authention middleware for `/api/*`
    > use JWT and get it from cookies
    ```typescript
    // * add JWT Authentification middleware
    app.use(
        '/api/*',
        async (c, next) => {
            const jwtMiddleware = jwt({
                secret: c.env.JWT_SECRET,
                cookie: 'token',
            });
            return jwtMiddleware(c, next)
        }
    )
    ```

#### Integrate with D1
- Update D1 Database Configuration in [wrangler.toml](worker-d1/wrangler.toml)

- Database Schema SQL: [Schema](worker-d1/schema/schema.sql)
    ```bash
    # migrate database
    cd {SOURCE}/cloudflare-worker/worker-d1

    # yarn dev-d1-migrate # (for local environment)
    yarn d1-migrate
    ```

#### Library
- [Hono](https://hono.dev)
- [ZOD Validator](https://zod.dev)