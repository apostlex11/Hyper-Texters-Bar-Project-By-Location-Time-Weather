# Sunny Beer Finder

## Description

This web app solves a critical issue for alcohol-fueled sun lovers. It combines the openweather API with Yelp's API to show users when it'll be sunny, and where there are bars currently open for business in the city entered.

During the course of this project, Team 5 – The Hyper Texters – took a crash course in collaborating in github. The main points areas of learning were how to divvy up work and how to solve merge conflicts, which was rather harrowing at first, and is not mildly better.

We also needed instructor/TA assistance to get the Yelp API running as it does not permit CORS. So it's running on corsanywhere deployed in Heroku.

## Usage

The deployed app can be reached here: [https://apostlex11.github.io/Hyper-Texters-Bar-Project-By-Location-Time-Weather](https://apostlex11.github.io/Hyper-Texters-Bar-Project-By-Location-Time-Weather)

The user enters a US city and its two letter state abbreviation, which will populate a 5-day table showing the weather forecast in 3-hour blocks. Acceptably sunny conditions are highlighted in yellow and are clickable. Acceptable conditions include "Clear skies," "Scattered clouds," "Broken clouds," and "Few clouds." All other conditions are greyed out.

Upon clicking the desired sunny time block, a Yelp API call is made and 5 bar results are shown along with their Yelp rating, price range, type of bar, and an image uploaded to Yelp by the business owner.

The user can then click on a bar to visit its Yelp page to learn more, and hopefully grab a refreshing sunny pint.

Demo:  
![gif demonstrating product functionality](./assets/img/sunny-beer-finder-demo.gif)

Our acceptance criteria for this project was:

```
When the user searches for a given city, then the page displays when it will be sunny/clear in that city over the next 5 days, as well as info like temperature and general conditions (partly cloudy, etc.)

When the user clicks on a sunny time block, then the page displays bars in the city that are open during that time.

When the bars are displayed, then we see their yelp rating and a description of the cuisine.

When the bars are displayed, then we can also link out to that bar or their yelp page.

When we refresh the page, the last forecast loads on the screen.
```

## Credits

**Team Members:**  
[Jordan Pace](https://github.com/Jaydonger)  
[Michael Falcon](https://github.com/ZOID415)  
[Terry Sa](https://github.com/apostlex11)  
[Jonathan Gomer](https://github.com/jongomer22)  
[Christopher DuBois](https://github.com/rhubarb414)

**Third-party apps:**  
[OpenWeather API](https://openweathermap.org/api/one-call-3)  
[Yelp API](https://docs.developer.yelp.com/docs/fusion-intro)  
[cors-anywhere](https://github.com/Rob--W/cors-anywhere/)  
[Heroku](https://www.heroku.com/)

## License

App is under the MIT License 2023. See doc in repo.
