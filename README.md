# formStore
A encrypted server action formStore used for memStore caching with formData in React. Can take the place of most if not all client side caching and validation structures. Can store any data for duration of form or input. Allows database to only have to be reached at the end of submit. 

First open source project. Quite a few different things that go into making sense of what this is used for an how it is used. Will add walkthrough and sample examples of usage soon getting data out there now and this will evolve rapidly. Versioning is up for debate but in my opinion as of today this can be forked for usage

I will provide an example to make sense of this in the coming days. You can fork for now if interested. Email me to ask questions hit me up on Twitter and soon you will see either an npm or github package associated. Thanks everyone let me know if you see any issues concerns or if you have any feature requests

Coming soon all to be open sourced - as of 04/12/2024 at 6AM

Finish updating this repo get ready for usage by others

Generic server action handle used to deliver formData to the server action that access this formStore

Generic server action used to handle the delivery of the formData and that hands off to formStore

Generic styledcomponent used to handle formdata is able to be used as anything with an outlinedinput or input and is built into the theme and style over rides within MUI. Used for textfield, datepicker, dropdown, phonenumber, searchbar and many more in the future

Auth open source project that uses all of these and enables people to register and login there users without having to use a third party or API. Secure, MFA, email verification, phone number verification, MFA apps, and the ability to use all of that just one type of verification or multiple. This is the big dev project that led these smaller things and I expect more open source projects to spin out of it. 

Auth project will handle tokens, registration, login, validation of user identity, and two auth utilities which can be used on each RSC and server action within your application to provide a custom middleware that validates identity before rendering and each and every action that can force logout if identity is not legit and automatic redirect. 

This lays the foundation for a very strong database and validation structure along side registration and login. Allows for everyone to have increased understanding of each step in that process and will enable us to be able to add features that allow us to have permission controls over users in later versions.

More to come soon this is just the start will update this when I can. Will link each of these projects here and together when the time comes in the next week or two as each of them are very very close to release. MIT license on all of these probably not setup exactly right but the premise stands you can use this for anything the point is to help people all whilst helping myself to build a robust system.

This is my first go at something of this scale. it wont be perfect but within a month it will be a handful of very powerful tools that allow applications to be setup quicker then previous thought possible with full knowledge of security and how auth is intertwined. 

With much love. 

Matthew Goluba
