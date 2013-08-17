var sections = {ns: [], sp: [], ae: [], op: []};
google.load("feeds", "1");

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function categorize(entry) {
    for (var i = 0; i < entry.categories.length; i++) {
        var c = entry.categories[i].toLowerCase();
        switch(c) {
            case "news":
                sections.ns.push(entry);
                return "ns";

            case "sports":
                sections.sp.push(entry);
                return "sp";

            case "ae" || "lifestyle" || "a&amp;e" || "arts" || "entertainment":
                sections.ae.push(entry);
                return "ae";

            case "opinion" || "columns":
                sections.op.push(entry);
                return "op";
        }
    }
    return "uncategorized";
}

var internal_counter = 0;
// Our callback function, for when a feed is loaded.
function feedLoaded(result) {
    if (!result.error) {
        for (var i = 0; i < result.feed.entries.length; i++) {
            var entry = result.feed.entries[i];
            var category = categorize(entry);
        }
    }
    if (++internal_counter === Object.size(feeds)-1) {
        build();
    }
}

function OnLoad() {
    // Create feed instances
    feeds = {daily_bruin: new google.feeds.Feed("http://dailybruin.com/feed/"), 
             daily_trojan: new google.feeds.Feed("http://feeds.feedburner.com/DailyTrojan-rss/"),
             daily_aztec: new google.feeds.Feed("http://thedailyaztec.com/feed/")};

    for (var feed in feeds) {
        var obj = feeds[feed];
        obj.load(feedLoaded);
    }
}

function comparePublishTime(a,b) {
    if (Date(a.publishedDate) < Date(b.publishedDate))
        return -1;
    if (Date(a.publishedDate) > Date(b.publishedDate))
        return 1;
    return 0;
}

function build() {
    var wire = document.getElementById("wire");
    for (var section in sections) {
        var obj = sections[section];
        obj.sort(comparePublishTime);
        var s = document.getElementById(section);
        for (var j = 0; j < obj.length; j++){
            var entry = obj[j];
            var title_link = document.createElement("a");
            title_link.className = "title";
            title_link.href = entry.link;
            title_link.target = "blank";
            s.appendChild(title_link);
            var title = document.createTextNode(entry.title);
            title_link.appendChild(title);
        }
    }
}

google.setOnLoadCallback(OnLoad);