# Kwik Talk

Kwik Talk is a simple conversation simulator in a party setting. It was made to show that the more people you add to a conversation, the harder it is to keep them as a group.

## How it works. 

[DEMO](https://idiallo.com/projects/kwiktalk/index.html)

[Blog Post](https://idiallo.com/blog/kwiktalk)

Open it on the browser, select the number of people you want in a group, (optionally add more groups) then click start. A conversation simulation starts. You can increase the speed by dragging the speed slider. Each step is represented as a second, you can jump 30 minutes ahead to see where it goes.

Click on the **Show Report** button to see the how each conversation group scores over time.

You can add people into random groups by clicking on the **New Person** button. 

Click on a person to gain insight about his time in the group.


## Installation. 

Double click on index.html and it will open on your favorite browser.

(Node CLI coming soon)

## Author's comment

I built it after reading comments on [hacker news](https://news.ycombinator.com/item?id=17964657) about an article that asked: **Why are conversations limited to about four people?**

The main goal of the simulator was to see how long it takes for a conversation with a large group breaks up into smaller pieces. There are some values that I have chosen arbitrarily, like `Person.talkLife` which determines how long a person will talk for, or `Group.leaveAfter` that determines how long before a person stays in a group without participating before they leave. These values can be changed.

## To Do

* Mobile Friendly interface.
* Generate a more insightful report from the data generated.
* Make it look like a party please.
* Remove Browser dependency to run on command line.

## Help and support.

When I started this project I was very excited, I enjoyed making the little people and the animation. I was expecting a clear answer at the end, thinking the program will give me insights on how conversations deteriorate with more members. Instead, It generated data that I am not exactly sure how to read. 

I gathered some data points on the Person object and maybe you can come up with a better way to present it to mean something. 

Thank you for reading and happy simulation!

Ibrahim Diallo