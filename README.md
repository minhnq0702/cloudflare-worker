# cloudflare-worker

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

npm install @cloudflare/wrangler --save-dev

> update Wrangler

npm install wrangler@latest


## List of workers in this project
### 1. [worker-test](https://worker-test.minhnq-0702.workers.dev/)
#### KV Binding - Expose URL to interact with KV
Enpoint: /test-kv

Method:
- POST


### 2. [Underconstruction](https://my.mingne.dev)