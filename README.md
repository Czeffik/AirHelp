# AirHelp

## Requirements
* [Docker](https://www.docker.com/get-started)
* [k6](https://docs.k6.io/docs/installation) - only if you are not using docker

## How to start

### With ladybug server in container
* open command line
* go to directory with app, for example: `cd C:\AirHelp\app`
* `docker build -t app .`
    * `-t app` for adding image alias
* `docker run -p 8080:8080 app`

### When ladybug server is up
* open new command line
* go to directory with project example: `cd C:\AirHelp`
* `docker build -t airhelp .`
    * `-t airhelp` for adding image alias
* `docker run --network host airhelp run ${testName.js}` 
    - *`--network host` is needed for resolve issue with `dial tcp 000.0.0.0:8080: connect: connection refused`*
    ### Flow tests
    * `createOrderAndAccept.js`
    #### Endpoint tests
    * `endpoints/createOrder.js`
    * `endpoints/currentUser.js`
    * `endpoints/login.js`
    * `endpoints/order.js`
    * `endpoints/orders.js`
    * `endpoints/products.js`
    * `endpoints/register.js`
    * `endpoints/updateOrder.js`

Example command for running test when image is build with alias: airhelp: `docker run --network host airhelp run endpoints/createOrder.js`
## Environmental variables
When trying run tests with not default values then:
`k6 run -e ENVIRONMENTAL_VARIABLE_NAME=enviromnentalVariableValue testScript.js`
also you can set it as global for your environment. For more information go [here](https://docs.k6.io/docs/environment-variables). Here I described only variables which was added by me, but k6 has more default options,
for example: `--vus 10` - set Virtual Users to 10, `--duration 30s`. For more information go [here](https://docs.k6.io/docs/options). 

All default values are set in file `scripts/commons/common.js`.
* **BASE_URL** - server address, default: `http://localhost:8080/`
* **USER_LOGIN** - is used to create new client, it is **required to change it** in every time when test will be started on old db, as default is randomly generated for every virtual user

    ### Example commands with environmental variables
    * `docker run --network host airhelp run -e BASE_URL=http://ladybug.server.address.com/ createOrderAndAccept.js`
    * `docker run --network host airhelp run -e USER_LOGIN=clientLogin createOrderAndAccept.js`
    * `docker run --network host airhelp run -e BASE_URL=http://ladybug.server.address.com/ -e USER_LOGIN=clientLogin createOrderAndAccept.js`
    * `k6 run -e BASE_URL=http://ladybug.server.address.com/ USER_LOGIN=clientLogin createOrderAndAccept.js` - if you are not using docker.

**Important!** When you are trying set **BASE_URL** remember that it must be ended with `/`

## Files

* endpoints
    * **createOrder.js** - test for creating order endpoint: client login to shop and create order with 2 products.
    * **currentUser.js** - test for getting current user endpoint: client login to shop and get information about yourself.
    * **login.js** - test for login endpoint: admin login to shop.
    * **order.js** - test for getting order by id: employee login to shop, get 1000 orders, select one order and get id, and send request for order by id.
    * **orders.js** - test for getting orders: employee login to shop and get 1000 orders.
    * **products.js** - test for getting products endpoint: client login to shop and get products.
    * **register.js** - test for register endpoint: user creating account.
    * **updateOrder.js** - test for update order endpoint: employee login to shop, get orders and select one of them, and change order status (from ACCEPTED to DRAFT or from DRAFT to ACCEPTED).
* utils
    * **apiClient.js** - script with methods to call service, currently methods implemented: `get, post, put`.
* commons
    * **common.js** - script with default values and functions used in more than one test.
* **createOrderAndAccept.js** - test for full flow, where every single Virtual User create new account in every test iteration (one VU can create more than one account), login to shop, create order with 2 products, and after it employee login and accept created order. Is only one employee account which accept all orders because it is impossible to create new employee account. 
    
    