# SI Collection Stats

Visualizations of the [Smithsonian Institution](https://www.si.edu/)'s collections.
All data is from [Smithsonian Open Access](https://www.si.edu/openaccess).

TODO: publish and add links

## About

This project tries to break down the composition of the collections by three parts:

* Unit (department, sort of)
* Age
* Country of origin

Not all items have proper notation for the age or country, but I'm making the assumption that it's a representative sample.

If you add `#hover` to the URL you can highlight (filter in the case of the map) the unit you're hovering over.
Note though while this allows you to really see the effect of units in the visualization, it's also _really_ slow.

## Data Processing

When I started working on this, there was no published documentation on the API.
Thankfully, [Matt Miller has a blog post](https://thisismattmiller.com/post/smithsonian-open-access-data-release/) to help me get started.

I used his work to extract the archive and get a general direction for how to get meaningful data from the monstrous amount it there is.

When you're working with 11 million items, the dataset ends up being largely opaque because you can't humanly look through it.
While there is documentation for available now, the existance of a property doesn't mean it's used, or used properly.
The best you can do it to randomly sample and log anomalies.
So a lot of what was done was via trial and error, and there are still a few things to work out.

Like previous pre-processing, I used Python via JupyterLab to do the first part of the data.
And also like past works, I did a lot of string sanitization for the country values, both to account for things like typos and acronyms, and because the data source for country names uses non-standard abbreviations.
Some bash was used as well, since I quickly found that `grep` was faster than Python, and I could use it to find examples of things I was trying to look at.

There are some more things I was working on that didn't quite pan out.
I was able to get taxonomic order for the kindgom and phylum, but it didn't fit well into the page after I started digging into the experience.
I also have the code written for displaying a chart of the composition by unit of items on exhibit, but somewhere in the process of things I accidentally broke the extractor so that is out of order.

I have a list of other things I'd like to look at in the future, such as medium, topic, and language, but I found that those values are lists instead of a single value (for example, something might be a finding guide and a piece of paper), so I need to re-think how I want to approach that.

## The Experience

To continute the About section, here are some of the considerations for the visualization you see.

I used the CSS part of [Fomantic UI](https://fomantic-ui.com/) (a fork of Semantic UI) for the UI components and colors.
Since there are so many units, I had to repeat colors, but I tried to maintain the same (alpha) order of units where possible.
In the age chart, they're in the same order as the legend, but from the bottom up.
I didn't use that order for the composition chart because I was trying to prioritize the "how much"-ness in having the largest first, but I'm reconsidering that and almost definitely going to be changing the order back to unit alpha.
This is also why I added the hover filtering (available via `#hover` in the URL) - so you can quickly _see_ where things come from.
The map uses a grayscale because it's not tied to a unit but rather the sum of all units.

I also limited ages to the last 200 years because if you start going back further you get really small numbers of items and then the intervals start spreading out too.

In some ways, there isn't really a story being told because there isn't much text.
However, the alternative is that you can get some numbers by going to the SI collections search, but it's hard to work with.
It has a couple advantages in that there are a number of items not available in their open access dataset and you can get individual items.
However, if I want to see the National Museum of American Art, there are over 12 thousand items there.
So, it's not useful in that I can't see the overall trends easily.
The story that's getting told through these visualizations is a high-level view of _what_ the Smithsonian has, and _when or where_ it came from.

Some todo items for the experience:
* Look at better contrast in the map (while maintaining the '0' value of a country as distinct from the ocean)
* Optimize the hover code to be faster
  * I need to figure out how this works with d3 since I'm not changing the dataset and I wasn't able to get `merge` working quickly
  * This also leads to some duplicate items, like `<title>`s getting added every update to the pie chart
  * Cache more stuff in the `init` functions for charts and put the cache in global scope
* Publish the experience (this'll be quick)
* Use a friendlier typeface (Semantic/Fomantic specifically chose Lato for being "neutral" - I want something like Open Sans that'll be less formal)

## Going Forward

I currently have multiple overflowing whiteboards surrounding my desk of mocks and status for different data elements I wanted to look at in the future.

One of these is something I've dubbed "tell me" - reframing data views as a human-like request.
For example, if a user wanted to see the countries a unit's collection comes from, instead of hovering over the unit and the map updating they could use a menu to say "tell me about countries at (unit) in the collections".

Another was more thorough linking of metadata.
Metadata is a dark art I've really gotten into lately, and it would be totally possible to create links within it.
For example, I could click a unit and it would bring be to a unit page with a summary.
You could then click a country and it would bring you to a country summary.
Clicking an age period would bring you a summary for that time.
This would enable a total web/wiki-hole of seeing how properties are flowing between each other.

I think that these two things would create a much more engaging experience, but I was struggling in trying to integrate it (both with respect to the experience and computationally) so I had to abandon it.
That was also outside the scope of this project.
I think I'd need a single-page app in something like Nuxt to handle the level of dynamic-ness that this would require, and while I learned a few very nice tricks for using d3 from working on this, I'd still probably want to use a library.
The other trouble is that the list values (such as a topic) would drastically increase the amount of data I'd have to store since this isn't dynamic.
I was trying to create a reusable data format working on this, but I found that I had to optimize for the pre-processing rather than the usage.
I think it's worthwhile to take a look at a subset of the collections data in something like a database, but it's 26GB on-disk right now, and while I think I can reduce that a lot, I'm doubtful that I could reduce it enough to put on my VPS or any of the other platforms I'm currently hosting on, much less load it into a browser.
Working with a massive dataset on a small tech budget for publishing creates some very strong limits.

That all said, it's the end-game I want to go towards eventually and this was a great learning experience for things to consider and avenues for approaching it.