**The University of Melbourne**
# INFO30005 – Web Information Technologies

# Group Project Repository

**Welcome to webg100 Group Repository !**
**(Notice: some functions or links present in deliverable 2&3 might not applied to current app version, please refer to the deliverable 4 instruction to get all functions work properly.)**


## Table of contents
* [Team Members](#team-members)
* [General Info](#general-info)
* [Detailed Info](#detailed-info)
* [Instructions of Using code](#instructions-of-Using-code)
* [Handling images](#handling-images)
* [How to access our database](#how-to-access-our-database)
* [Technologies](#technologies)
* [App server mockup(Deliverable 2)](#app-server-mockup-Deliverable-2)
* [Front end and back end (Deliverable 3)](#Front-end-and-back-end-Deliverable-3)
* [Web Application(Deliverable 4)](#Web-Application-Deliverable-4)



## Team Members

| Name | Student ID| Task | State |
| :---         |     :---:      |     :---:      |          ---: |
| Yu-Wen Michael Zhang  |1089117| shopping cart related tasks, order discount   |  Done |
| Ming Zhang   |1068302| login and register, rating      |  Done |
| Yifei Wang    |1001686| vendor location and map functions   |  Done |
| Wanting Zhang    |1080915| vendor app UI and README    |  Done |
| Wanxuan Zhang    |1079686| vendor app UI and testing    |  Done |

## General info
This is project is about creating an vendor app and customer app from scratch. 
* The home page of our website is https://snacks-in-a-van-webg100.herokuapp.com. 
* The customer side application can be accessed by https://snacks-in-a-van-webg100.herokuapp.com/customer.
* The vendor side application can be accessed through https://snacks-in-a-van-webg100.herokuapp.com/vendor.

## Detailed info
The main website entry for the **snacks in a van** app is: https://snacks-in-a-van-webg100.herokuapp.com.</br> 
You can either choose to enter the customer/vendor app by click the **`Customer App`** or **`Vendor App`** on the main web page. Otherwise, you can also directly type the urls https://snacks-in-a-van-webg100.herokuapp.com/customer and https://snacks-in-a-van-webg100.herokuapp.com/vendor to go to the customer/vendor app respectively. </br> 
Features needs to be delivered in **Deliverable 4 – Web Application** can be found here [Web Application(Deliverable 4)](#Web-Application-Deliverable-4).
Just to note that the instructions for **Deliverable 2** and **Deliverable 3** is just there for showing the progress of how we develop the web app step by step. It is not necessary for you to view these at this stage. 
Additionally, we did not implement live page in Deliverable 4.


## Instructions of Using code
clone this repository and install all the dependencies in **package.json** and type **npm start** in terminal to run the code. However, you may not be able to run these codes because you cannot access our database. If you intend to do so, we have provide one of our username and password. And you will need to set a passport key, which could be anything you want. Please refer to here: [How to access our database](#how-to-access-our-database).

## Handling images
the photos for each food are stored as **String** in database (in **Collections: foods**). The photo is retrieved from https://unsplash.com/photos/. If you want to see the photo, simply append the string found in database to this URL: https://unsplash.com/photos. <br />
For example, Cappuccino has photo String: **6o2Dk5Op8VI**, if you want to view the photo, you can go to this URL and view it.https://unsplash.com/photos/6o2Dk5Op8VI.


## How to access our database
Our database name is: **`INFO30005`**<br />
Here is one of the username and password that allow you to access our database:<br />
**`MONGO_USERNAME=Michael`**<br />
**`MONGO_PASSWORD=1234`**<br />
Also, ther is an additional thing that you may need to add in .env file: </br>
**`PASSPORT_KEY=info30005secretkey`**</br>
This PASSPORT_KEY will allow you to use passport.js while you try to run our code.

## Technologies
Project is created with:
* NodeJs 14.16.X
* MongoDB Atlas
* Heroku 

**Now Get ready to complete all the tasks:**

- [x] Read the Project handouts carefully
- [x] User Interface (UI)mockup
- [x] App server mockup
- [x] Front-end + back-end (one feature)
- [x] Complete system + source code
- [x] Report on your work(+ test1 feature)


## App server mockup (Deliverable 2):

**customer features:**

* (1) **`View menu of snacks (including pictures and prices)`**<br />
type this url below<br />
https://snacks-in-a-van-webg100.herokuapp.com/customer/menu

* (2) **`View details of a snack`**<br />
type the foodid after menu, you will be able to see the snack detail of this foodid.<br />
eg:https://snacks-in-a-van-webg100.herokuapp.com/customer/menu/1004

* (3) **`Customer starts a new order by requesting a snack`**<br />
type "add" after the foodid that you want to order, after that this food will be shown at cart array of the current customer (assume the login customer is Michael)<br /> 
eg:https://snacks-in-a-van-webg100.herokuapp.com/customer/menu/1004/add<br />


**vendor features:**

* (1) **`Setting van status (vendor sends location, marks van as ready-for-orders)`**<br />
  In the following link you will be able to see all the vans we currently have in our database: https://snacks-in-a-van-webg100.herokuapp.com/vender/vans 
* (1a) vendor sends location:
type the **vanId** you want to login after this link  https://snacks-in-a-van-webg100.herokuapp.com/vender/vans <br />
eg: https://snacks-in-a-van-webg100.herokuapp.com/vender/vans/0001 <br />
then if you want to send the location in the database(assuming the vendor doesn't change it location), you can type **send_location** like the following: https://snacks-in-a-van-webg100.herokuapp.com/vender/vans/0001/send_location. <br />
If the logined van changes its selling location, they need to change it current location in the database and send its current new location by typing **send_location** like the following: https://snacks-in-a-van-webg100.herokuapp.com/vender/vans/0001/send_location. <br />
but this time, it will be a **POST** request. <br />
you need to use postman to run this.  you can type `{"location": xxxxxxx}` in the text box and set the input format as `raw` and `JSON(application/javascript)` above the text box. After that you will be able to see this change in the database(collection name is **`vans`**). Also, a text will be displayed in postman like: `Van locatioin: "xxxxxx" has been updated and sent successfully`. <br />

* (1b) marks van as ready-for-orders<br />
type **update_status** after the current vanId like: https://snacks-in-a-van-webg100.herokuapp.com/vender/vans/0001, after that, you can change the status of this van(from close to open, or from open to close)<br />
eg: https://snacks-in-a-van-webg100.herokuapp.com/vender/vans/0001/update_status

* (2) **`Show list of all outstanding orders`** <br />
type "orders/outstanding" after vanId to show list of all outstanding orders of the current van <br />
eg: https://snacks-in-a-van-webg100.herokuapp.com/vender/vans/0001/orders/outstanding

* (3) **`Mark an order as "fulfilled" (ready to be picked up by customer)`** <br />
type orderid which is shown at previous feature(Show list of all outstanding orders) behind orders, after that type **update_status**, the status of this order would change to fullfilled.<br />
eg: https://snacks-in-a-van-webg100.herokuapp.com/vender/vans/0001/orders/10005/update_status <br />
This will change the status from outstanding to fullfilled of order 10005 in vans 0001.

## Front end and back end (Deliverable 3)
* (1) **`Customer Login`**<br />
This is the main website of our customer app <br />
https://snacks-in-a-van-webg100.herokuapp.com<br />
(1a) **Register**: you can register by click the "Register" on navigation bar or just go to the below url to register<br />
https://snacks-in-a-van-webg100.herokuapp.com/customer/register<br />
Once register is successful, the useer is automatically login. If the customer do not enter all the mandatory detail in the register page, they won't register successfully.<br />
(2a)**Login**: click the “Login” on navbar or just go to the below url to login<br />
https://snacks-in-a-van-webg100.herokuapp.com/customer/login<br />
Enter the sample username and password in LOGIN DETAIL: <br />
**`EMAIL=123@123.com`**<br />
**`PASSWORD=123`**<br />
After the customer login, the navigation bar will not displaying the `Login` or `Register` button anymore.The navigation bar will then include `Shopping cart` and `Orders` button.<br /> 
In addition, the user can log out at any time by click “Log Out” on navigation bar. <br />

* (2) **`View menu of snacks`**<br />
One can view the menu after login (in the navigation bar), but those who did not sign in can also view the menu. However, they cannot add the food they want to their `shopping cart` as the user hasn't login in.<br />
You can either click “Menu” on the navbar or go straight to the website. <br />
The list of snacks is shown on the below website **`(not login)`**<br />
https://snacks-in-a-van-webg100.herokuapp.com/customer/menu<br />
If the customer login in already, they need to click the `Menu` on the navigation bar and the URL will change accordingly<br />
assume the login customer is:<br />
**`EMAIL=123@123.com`**<br />
**`PASSWORD=123`**<br />
then the URL to access the menu of snacks will be: <br />
https://snacks-in-a-van-webg100.herokuapp.com/customer/608014ef58b68869da398c48/menu<br />
You may view the details of each food by clicking on the food name on the menu page <br />
When you view the details of each food, you can add the current food to `shopping cart` by click `Add to Cart` button.
eg:https://snacks-in-a-van-webg100.herokuapp.com/customer/608014ef58b68869da398c48/menu/1001<br />
This URL will access the detail of `Cappuccino`
If the customer hasn't login, the link below can view the detail of `Cappuccino`<br />
eg:https://snacks-in-a-van-webg100.herokuapp.com/customer/menu/1001

* (3) **`Order three different snacks`**<br />
To be able to order foods, one must be logged in to do so. If one did not log in, when it tries to add something to the shopping cart, it will be directed to the login page. <br />
If you already logged in, go to the menu page and click the food name you are interested in to go to the food detail page, and then you can click the  `add to cart` button to add the item to shopping cart. You can implement the above sentence several times to add other foods you want to cart. <br />
After adding foods to your shopping cart, you can click the `Shopping cart` on the navbar. Then you can see the list of items, you may choose to remove some items from the shopping cart or check out, which is by clicking on the “place order” button. <br />
Next, your new order will go to the database and you can find it in collection named **`neworders`**! The reason why we didn't use the **`orders`** collection is that we change some features but as deliverable 2 need **`orders`**, we cannot change the orders collection, hence we create a collection called **`neworders`** in our database. <br />


* (4) **`View order details`**<br />
After login, click on the “Orders” in the navbar to view all order details of this customer which includes order id, time, order status, items and total price. <br />


## Web Application (Deliverable 4)
### Customer App
Enter the Customer App from this website: https://snacks-in-a-van-webg100.herokuapp.com/customer, then you can see 5 nearest vans with their name, addresses and rating appear on the left of the screen(you can scroll up and down), and the big map visualises the location of each van. Also, if you click on any van which is on the map, you will be able to see some descriptions(rate and their rough location) of each van. Furthermore, you can search for your current location by clicking the top-right icon on the map, and also, **do not forget to authorize the browser to access your location!**<br />

After choosing a van you like by either clicking **`choose the van`** on the van list or just simply click a van on the map, you will be direct to a page that allows you to take a look at the menu, but one thing to notice is that you have to be login to uses the full functionalities, such as clicking the **`add to cart`** or place an order. Therefore, you might like to log in at this stage, or otherwise, we will direct you to the login page when you try to add something to the cart. You can try login by using the account we provided below, but you are also encouraged to register your own account to experience its functions (hint: if you enter something that has invalid formats, it will return an error message). 
Here is a list of account you can use:
| Email | Password|
| :---  |    ---: |
| tom@outlook.com |12345|
| michael@gmail.com |12345|
| claire@gmail.com |12345|
| chloe@gmail.com |12345|
| andy@gmail.com |12345|
| angela@gmail.com |12345|

Now you can access all our functionalities! You might like to go to the menu page, select the food you want, and you can see the details of this food. If you would like to add this food to your cart, you can choose the quantity by clicking **`choose quantity`**, enter the amount you want, it is now in your cart! You can repeat this process a few times until you have added everything that you want. <br />
Now let’s go to the `shopping cart` (on the navbar). Oops, you might think there is something you do not want anymore, or you want to add more. You can also change the quantity of each food by clicking **`Edit`**. After confirming your order, you can **`Place Order`**, now this order should appear on the vendor's  outstanding orders list. <br />
While you are waiting for your order to be completed, by clicking the **`check your order`** botton or click **`Orders`**, you will see a list of orders including the current order and all other orders you previously have. You will be able to change and cancel your order within 10 minutes if the order status is not fulfilled yet. If you cancel or change your order, the order will not be displayed in your list of orders and this order will not be displayed on vender's screen. However, this order is still exist on the database as we need to keep track of this behaviour. <br />
After your order is filfilled,  there should be a **`rating`** button appear on your order detail and you can rate this order from 1 to 5 stars. Each order’s rating will contribute to the van rating. Also, if the order is completed after 15 minutes while you placing it, you will automatically granted a 20% discount. 
The time limit is set under **`public`** folder and you will find a file call **`constant.js`**. <br />
Besides, in your **Profile** (on the navbar), you are able to change your personal detail or log out. <br />

### Vendor App

The website for vendor is https://snacks-in-a-van-webg100.herokuapp.com/vendor . On the vendor login page, you can either use the example van we provided or register your own account. Here are some sample vendors account: <br />
| VanId | Password|
| :---  |    ---: |
| Niceday |12345|
| LittleSeed |12345|
| Happyday |12345|
| JM |12345|
| Morning |12345|
| Mayday |12345|
| Wonder Coffee |12345|
| MM |12345|

You will need to send your location every time you log in. When you are all set and ready to sell, you then can set your location and the system will also  detect your current geo-location and set it on the map on the customer end. After send the location and confirm your rough location, your van status will mark as open automatically. <br/>
**NB: If you did not enter your address, you will not be able to perform further actions.** <br />

In the vendor app, the **`Home`** contains the details of the van and you can open or close the business for the van here. The **`Outstanding Orders`** displays all outstanding orders (if there are customer placed order in your van). For example, if there is an outstanding order and the vendor has finished this order, he can click on **`Complete`**. Such that this order will disappear from the **`Outstanding Order`** list and it will go into **`Order History`**. If the order has passed 15 minutes and still outstanding, the total price of this order will be deducted and there will be a “20% discount” text appear along with the total price. Besides, the customer will be able to rate this order once the order has been marked as “Fulfilled”. In addition, you can log out by clicking **`Log Out`** (on the navbar), at the same time, the van will be set to close spontaneously. <br />
**NB: 1. If you did not log out, the van will still be opening and customer can still placing order for your van. An alternative way to mark your van as close is to go to `Home` page and mark it as close. It is the vendor's responsibility to mark their van as close while they are not selling any more.** </br>
**2. you can still completing your current unfinished order when you change your van status to 'close'.**

### Unit test and integration test
To perform a unit test for the updateVanStatus function, first **`cd __tests__\van_controller_tests`** and then run the test using **`npm test -- setvanstatus_unit.js --forceExit`**<br />
For the integration test, go to the folder **`cd __tests__\integration_tests`** and then **`npm test -- setvanstatus_integration.js --forceExit`**<br />
