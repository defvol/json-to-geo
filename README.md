# json-to-geo

Convert JSON objects into GeoJSON features.

Example

```bash
➜ cat test/fixtures/foursquare-venues.json |
	json-to-geo --path 'response.venues.*'
		--lng 'location.lng' --lat 'location.lat' |
	nd-geojson | geojsonio
```
_Opens geojson.io with pins for every venue returned by Foursquare Venues API. Note: [nd-geojson](https://github.com/rodowi/nd-geojson) wraps line-delimited GeoJSON features in a FeatureCollection._

In the box:

- **An accessor function**: You can specify an accessor function to extract coordinates from custom locations, or leave this empty and let the module look for common property names.
- **Path to feature objects**: If the array of objects is in a deep property, you can specify a path string, e.g. `response.rows.*`. See [JSONStream](https://www.npmjs.com/package/jsonstream) for more info.
- **Streaming interface**: For fast command-line pipelines.

Input:

```json
{
	"meta": {
		"code": 200,
		"requestId": "57c63303498e78d449981c2c"
	},
	"response": {
		"venues": [{
			"id": "430d0a00f964a5203e271fe3",
			"name": "Brooklyn Bridge Park",
			"location": {
				"address": "Main St",
				"crossStreet": "Plymouth St",
				"lat": 40.70303245363086,
				"lng": -73.99389265510275
			}
		}, {
			"id": "51eabef6498e10cf3aea7942",
			"name": "Brooklyn Bridge Park - Pier 2",
			"contact": {},
			"location": {
				"address": "Furman St",
				"crossStreet": "Brooklyn Bridge Park Greenway",
				"lat": 40.69957016220183,
				"lng": -73.99793274204788
			}
		}]
	}
}
```

Output:

```json
[{
	"type": "Feature",
	"geometry": {
		"type": "Point",
		"coordinates": [-73.99389265510277, 40.703032453630854]
	},
	"properties": {
		"id": "430d0a00f964a5203e271fe3",
		"name": "Brooklyn Bridge Park",
		"location": {
			"address": "Main St",
			"crossStreet": "Plymouth St",
			"lat": 40.703032453630854,
			"lng": -73.99389265510277
		}
	}
}, {
	"type": "Feature",
	"geometry": {
		"type": "Point",
		"coordinates": [-73.9979327420479, 40.69957016220184]
	},
	"properties": {
		"id": "51eabef6498e10cf3aea7942",
		"name": "Brooklyn Bridge Park - Pier 2",
		"location": {
			"address": "Furman St",
			"crossStreet": "Brooklyn Bridge Park Greenway",
			"lat": 40.69957016220184,
			"lng": -73.9979327420479
		}
	}
}]
```

## Usage:

See [example.js](https://github.com/rodowi/json-to-geo/blob/master/example.js) or run `json-to-geo -h`.

### From Javascript:

```js
var jg = require('json-to-geo');
var accessor = jg.buildAccessor('location.lng', 'location.lat');
var rs = fs.createReadStream(__dirname + '/test/fixtures/foursquare-venues.json');
jg.transform(rs, 'response.venues.*', accessor)
  .pipe(process.stdout);
```

### From the command-line

```bash
% cat file.json | json-to-geo
```
