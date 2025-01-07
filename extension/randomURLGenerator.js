
/* We have an array of website URLs that will replace the URLs being removed. 
 * You can change these URLs as needed. Additionally, if a URL already exists in the browsing history, 
 * it won't be added again. 
 * The number of URL strings in the 'replaceUrl' array determines how many URLs can replace the ones being deleted.
 */

var replaceUrls = [
    "https://www.youtube.com/watch?v=cY2G3dhW8qc",
    "https://www.youtube.com/watch?v=2A8OqL-nHT8",
    "https://www.youtube.com/watch?v=txqiwrbYGrs",
    "https://www.youtube.com/watch?v=ciOFpMapc6o&list=UUi7GJNg51C3jgmYTUwqoUXA.com",
    "https://www.youtube.com/watch?v=k3wWF6pQgpE&list=UUzWQYUVCpZqtN93H8RR44Qw.com",
    "https://www.youtube.com/watch?v=lx3egn8v4Mg.com",
    "https://www.youtube.com/watch?v=b6hoBp7Hk-A.com",
    "https://www.youtube.com/watch?v=QQ9gs-5lRKc.com",
    "https://www.youtube.com/watch?v=QQ9gs-5lRKc.com",
    "https://www.youtube.com/watch?v=d7qqu9HC7V0.com",
    "https://www.youtube.com/watch?v=fLclGPr7fj4.com",
    "https://www.youtube.com/watch?v=a91oTLx-1No.com"
]

// Function to get a random URL object
function getRandomURL() {
    var randomIndex = Math.floor(Math.random() * replaceUrls.length);
    return replaceUrls[randomIndex];
}