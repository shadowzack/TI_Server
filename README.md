# Welcome to Technologies intersection API 
 
# APP and offical API
### APP:
##### https://technologies-intersection-api.herokuapp.com/

# Requests
provided requests: GET / POST / DELETE .
in case of POST user can send JSON file with the supplied structure (bellow) .
RESULT:::
The result will return in JSON File.

## response code

in case of success you will get JSON with success message and 200 response.

in case of an error in a JSON you will get JSON file with the error (validation ec.) and a 500 response.

if the URL is not found you will get 404 response .
## Get Started

the API multiple functions :
###  get all Languges function
URL:
https://technologies-intersection-api.herokuapp.com/languages
Request:
GET request
##### the result is a JSON in this sturture:

 [
{
Years: {
2013: 32323,
2014: 93711,
2015: 23245,
2016: 1123,
2017: 2848,
2018: 11111,
none: 103
},
_id: "5c2ce951fb6fc02c41a456a4",
Source: "javascript",
Count: 1992711
}
]


###  get Language by id function
URL:
https://technologies-intersection-api.herokuapp.com/languages/:id
Request:
GET request
##### the result is a JSON in this sturture:

 {
Years: {
2013: 32323,
2014: 93711,
2015: 23245,
2016: 1123,
2017: 2848,
2018: 11111,
none: 103
},
_id: "5c2ce951fb6fc02c41a456a4",
Source: "javascript",
Count: 1992711
}

