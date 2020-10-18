# SI Collection Stats

Visualizations of the [Smithsonian Institution](https://www.si.edu/)'s collections.
All data is from [Smithsonian Open Access](https://www.si.edu/openaccess).

![Deploy](https://github.com/ct-martin/si-collections/workflows/Deploy/badge.svg?branch=main)
[![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/ct-martin/si-collections/main?urlpath=lab%2Ftree%2Fmultipart.ipynb)

[View Here](https://si.ctmartin.dev/)

## About

Fundamentally, these visualizations aim to provide a high-level view of _what_ the Smithsonian has, and _when or where_ it came from.

This project tries to break down the composition of the collections by three parts:

* Unit (department, sort of)
* Age
* Country of origin

Not all items have proper notation for the age or country, but I'm making the assumption that it's a representative sample.

By hovering/clicking on a unit you can highlight (filter in the case of the map) the unit you're hovering over.

## Data Processing

When I started working on this, there was no published documentation on the API.
Thankfully, Matt Miller has a [blog post](https://thisismattmiller.com/post/smithsonian-open-access-data-release/) that helped me get started (and shout-out to Dr. Decker who spotted it when this dataset was released).
I used his work to extract the archive and get a general direction for how to get meaningful data from the monstrous amount it there is.

When you're working with 11 million items, the dataset ends up being largely opaque because you can't humanly look through it.
While there is documentation for available now, the existance of a property doesn't mean it's used, or used in a standardized fashion.
The best you can do it to randomly sample, make statistics, and log anomalies.
As such, there's a lot of trial & error, and still some things to work out.

Like [previous pre-processing](https://vis.ctmartin.me/museums/met/), I used Python via JupyterLab to do the first part of the data.
And also like past works, I did a lot of string sanitization for the country values, both to account for things like typos and acronyms, and because the visualization library uses non-standard abbreviations.
Some bash was used as well, since I quickly found that `grep` was faster than Python, and I could use it to find examples of things I was trying to look at.

There are some more things I was working on that didn't quite pan out.
I was able to get taxonomic order for the kindgom and phylum, but I couldn't get it to mesh into the experience nicely.
I also have the code written for displaying a chart of items on exhibit, but at some point I accidentally broke the code for getting the data.

I have a list of other things I'd like to look at in the future, such as medium, topic, and language, but I found that those values are lists instead of a single value (for example, something might be a finding guide and a piece of paper), so I need to re-think how I want to approach that.

## The Experience

I used the CSS part of [Fomantic UI](https://fomantic-ui.com/) (a fork of Semantic UI) for the UI components and colors.
Since there are so many units, I had to repeat colors, but I tried to maintain the same (alpha) order of units where possible.
In the age chart, they're in the same order as the legend, but from the bottom up.
This is also why I added filtering - so you can quickly _see_ where things come from.
The map uses a grayscale because it's not tied to a unit but rather the sum of all units.

I limited ages to the last 200 years because if you start going back further you get small numbers of items and the intervals start spreading out too.

## Going Forward

I currently have multiple overflowing whiteboards surrounding my desk of mocks and data elements I wanted to look at in the future.

One of these is something I've dubbed "tell me" - reframing data views as a human-like request.
For example, if a user wanted to see the countries a unit's collection comes from, instead of hovering over the unit and the map updating they could use a menu to say "tell me about countries at (unit) in the collections".

Another was more thorough linking of metadata.
For example, I could click a unit and it would bring be to a unit page with a summary.
You could then click a country and it would bring you to a country summary.
Clicking an age period would bring you a summary for that time.
This would enable a total web/wiki-hole of seeing how properties are flowing between each other.

There are several technical hurdles for handling the dynamicness of the metadata and data size/format (the file I'm working with is 26GB).
I have some ideas for how to accomplish this, but both of these ended up being outside of the feature and time scope for this project.
That all said, it's the end-game I want to go towards eventually and this was a great learning experience for things to consider and avenues for approaching it.

Finally, I've been considering splitting the NMNH from the rest of the data since it's so large it overwhelms the other museums.
I need to think a little about the best way to do this in the experience, it'll probably be a dropdown above the legend though.