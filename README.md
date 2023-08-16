# TourismDestinationsWeb
Interactive web site that promotes Queensland tourism using APIs.

## Video
https://github.com/toshimitsu-o/TourismDestinationsWeb/assets/89127228/6abc7e59-3f3d-496b-a76b-b105f4b0a0b7


## Features
### Quality control of photos
After testing multiple search options for Flickr API, I filtered the search by adding “min_taken_date” to limit to photos that were taken within last four years. I also applied “relevance” option to the sort parameter to filter unrelated photos, and “photos” to the media parameter to exclude videos. The safe mode was turned on to exclude rude contents.
### User interface feature
I developed the collapsible multi-layer data viewer to display the point of interest information acquired via the Open Trip API. The feature requires steps of selecting options to display information. To clearly indicate steps for user to select an option and present the next option, sections were hidden until they were needed. The section to list place names is scrollable to minimise the size and the whole box is collapsible so that users can make more space to view other contents such as Flickr photos.
### Web API
Addition to Flickr API, Open Trip Map API was used to display the point of interest information. The API provides place information around the given location. It also provides detailed information by passing an ID. My program stores latitude and longitude values for each destination. It passes the location values with category specified by users to API and acquires a list of locations. After users selecting a place, it receives details of the place via the API to display text information with an image.
