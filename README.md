Udacity - Neighborhood Map - Project 5 - Filipe Costa
============

This is a Javascript project indended to create a map and display, for some locations markers and informations about this place using some third-part library.
As part of the project, is required to load a map and show some locations on it, implement features like list locations, include markers in the map and open info windows with some representative information about the place.

For this specific project, the implementation is:
Show a list of cities in Europe and for each city, list the best 5 restaurants according to a previous search on Yelp (best rated).
Then, with some hardcoded data, display the cities chosen and the best 5 restaurants, display in the map their location and some information about how many people were there before and how many people evaluated that restaurant (for populatiry).

## Libraries
The important libraries used by this project are:
1. jquery
2. knockoutjs
3. lodash
4. bootstrap
5. font-awesome

Because they are part of the main flow of the application.
Other libraries used for start the project and as part of webpack/babel lib starter
1. webpack (dev-server, merge, grunt)
2. babel (cli, core, loader, polyfill, preset-es-2016)
3. loaders in general (style, url, html)
4. es6-promise


Make sure you have them installed before moving forward. We'll be using Yarn (a powerful lib package manager for Javascript).

The instalation is quite simple, just follow the steps below:
1. Run `yarn install` from the root folder of this project
2. Check that the folder node_modules is now part of the project.

And that's it! All the libs are now available for the project to use.

## Running the project
You can follow these steps (after cloning) to have the application running locally:
1. Open a terminal and check NPM is installed and running properly
   1. You can try `npm --version` in terminal and check the output
2. Check either that NODE is installed as well and install it if not
   1. You can try `node --version` in terminal and check the output
3. Go to `neighborhood_map` folder
4. Run the command `yarn dev` to:
   1. Generate the build.js file, make it available for the index.html
   2. Start a local dev environment that should run in `http://localhost:8080`

And the project should be available locally.

## Design Inspiration
For the main design inspiration, please check [Skelly Nav Side Fixed With Bootstrap](http://codeply.com/go/RmXlEZfi8z)

## Third-part API's
1. Google Maps: to include the whole map in the web app and pinpoints, infowindows and more.
2. Foursquare: to retrieve information about a specific location in the model defined in the file `neighborhood_map/src/app.js`

## [Contacting the Author](mailto:s.costa.filipe@gmail.com)
Click above and feel free to get in touch in case of trouble or suggestions.
