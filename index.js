// const questions = [

// ];

// function writeToFile(fileName, data) {
// }

// function init() {

// }

// init();


const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
var generateHTML = require("./generateHTML");
const pdf = require('html-pdf');



function writeToPDF(html) {
    const options = { format: 'Letter' };
    pdf.create(html, options).toFile('./gitHubSnapShot.pdf', (err) => {
      if (err) throw err;
    });
  } 

async function init() {
    try {
        const usersAnswers = await inquirer.prompt([{
            message: "Enter your GitHub username:",
            name: "username"
            },
        {
            type: "list",
            message: "What is your preferred color?",
            name: "contact",
            choices: ["green", "blue", "pink", "red"]
        }]);
        let username = usersAnswers.username;
        let themeColor = usersAnswers.contact;
        let bio;

        const response = await axios(`https://api.github.com/users/${username}`);
        let userInfo = {
            image: response.data.avatar_url,
            name: response.data.name,
            location: response.data.location,
            profile: response.data.html_url,
            blog: response.data.blog,
            bio: response.data.bio,
            publicrepos: response.data.public_repos,
            followers: response.data.followers,
            following: response.data.following,
        }
        if(userInfo.bio === null)
        { userInfo.bio  = "No bio Available"}

        var userStars = await axios(`https://api.github.com/users/${username}/starred`);
        var totalStars = userStars.data.length;
       
        const html = await generateHTML(themeColor, userInfo, totalStars);  //here starts the issue
        writeToPDF(html);
    } catch (error) {
        throw error;
    }
}

init();