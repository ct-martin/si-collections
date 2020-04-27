# met-view

Interactive visualizations about the Metropolitan Museum of Art's collections. Looks at the collection and departments by distribution of objects, cultures, and how much has been made available in the public domain.

View here: https://ct-martin.github.io/met-view/

## About the Experience

I wanted to look at collection data in a meaningful manner. I chose the Met collection because the data is easily available for me to use. In particular, I was curious about how much of the Met collection was available in the public domain and seeing if there was anything interesting in the "Highlights" field, which does not have a clear indication of what i means other than being able to search for it on the Met website. To this end, the project looks to `engage` viewers in what the collection holds by `interpret`ing some simple statistics about it. Large numbers and interactive charts, including by-department, are used to accomplish this.

## About the Technology

[Python](https://www.python.org/) & [Jupyter Lab](https://github.com/jupyterlab/jupyterlab) were used to process data since they're easy and capable of processing the ~1/4GB dataset that the Met has. Doing this work in the browser would almost definitely crash the page. Python & Jupyter Lab export a JSON file that the web page uses. This tooling is also common in data science.

Since this is a web-based project, data display on the page is essentially required to be JavaScript. [Bulma](https://bulma.io/) & [Chart.js](https://www.chartjs.org/) were used to build the page. Chart.js in particular is what is used for the interactive charts and does almost all of the work in making those charts. Bulma and Chart.js were chosen purely for the ability to build this web-based experience efficiently.

## About the Process

I started by getting simple statistics and then adding more data as I could. The very first thing I did was remove columns of the data that did not have a meaningful use to what I was doing or were not consistently filled out. The collection-level statistics were done first, and then the simple statistics for each department were added. I am also involved in doing open source so the first by-department statistic I did was how much of a given department was in the public domain.

After that I was interested in the `Culture` field and attempted to analyze it. While doing so I found that the data has significant issues with consistency and I had to do a lot of work to simplify the data enough that it would be reasonably close to the original but be simple enough to be meaningful to a viewer. This process wasn't perfect and there's more on what I did below.

After looking at the `Culture` field I was curious to see what the `Medium` field held. Unfortunately, it's comparable to the `Culture` field in consistency so I did not end up doing a closer analysis. I did find this data interesting to look at. There are several departments which have almost all `Culture` data as "Unknown" and the Drawings and Paintings department has over 19,000 `Medium`s, which I am skeptical about. I have a couple charts at the end that start to touch on these, however, it's not very developed yet.

I'd be interested to look (at a later time) in to trying to process the `Medium` field and also look at the departments which don't use the `Culture` field in case there's another field that's used instead.

I'd also like to include images of a random public-domain highlight for collections, however, the Met's APIs currently block both real-time retreival of this data and loading the image itself.

## About the Data

Data was downloaded from [https://github.com/metmuseum/openaccess/](https://github.com/metmuseum/openaccess/)

The `data_wrangling/` folder contains the Jupyter Lab notebook used to process the data.

The Met specifically asks the following:

> Whenever you transform, translate or otherwise modify the dataset, you must make it clear that the resulting information has been modified.

To that end, almost all of the data is a subset/summary of the total data and is intended to be as close as possible to the original. The one departure from this is that the `Culture` field of the data lacks meaningful standardization and I have tried to simplify this data. Here are some of the things that were done:

* Simplify "possibly" and "probably" objects to the culture that is likely
  
  * This may misrepresent some objects but without doing this the data becomes much less meaningful. However, even things without this marker could be misidentified and as the dataset is updated this field will become more accurate.

* Remove decriptors of parts
  
  * "French frame" can become "French" as far as this is concerned
  
  * Arms and Armor has a lot of cases for this
  
  * "Chinese for the X market" can become "Chinese" as far as this is concerned
  
  * Remove unrelated or overdescriptive notes
  
  * Note that this does not mean there cannot be multiple cultures; "French and English" is fine

* Clean up typos & inconsistencies
  
  * "china" -> "Chinese" ("Chinese" is more commonly used)
  
  * "Germany" -> "German" ("German" is more commonly used)

* Summate cultures with <1% of objects
  
  * This is clearly noted with "<1% ea."
  
  * There are many values in the `Culture` field to which there is only one object
  
  * Keeps data small so it remains meaningful
  
  * Some of this results from the lack of standardization of the `Culture` field - e.g. if one object is "French and English" but all the rest are "English and French" then "French and English" may get put in the <1%

The code to clean up the `Culture` field does string sanitization and is not very complex. Some amount of error is to be expected. Any usage of this data has been labelled with "Cultures (Simplified)." Any use of "Culture" without the "(Simplified)" label is based on the number of unique values in the `Culture` field.
