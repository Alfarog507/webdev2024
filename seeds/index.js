const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campgrounds");

//Mongoose Setup
mongoose
  .connect("mongodb://localhost:27017/yelp-camp")
  .then(() => {
    console.log("Mongo connection open!");
  })
  .catch((err) => {
    console.log("Oh no, Mongo connection error!");
    console.log(err);
  });

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const rand1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "65f332483b3bc7256c0c6150",
      location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      //   image: "https://source.unsplash.com/collection/483251",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in semper nunc. Sed auctor, libero sit amet vulputate fermentum, ligula turpis facilisis est, at tristique enim odio nec dolor. Nulla facilisi.",
      price,
      images: [
        {
          url: "https://source.unsplash.com/collection/483251",
          filename: "YelpCamp",
        },
        {
          url: "https://source.unsplash.com/collection/483251",
          filename: "YelpCamp",
        },
        {
          url: "https://source.unsplash.com/collection/483251",
          filename: "YelpCamp",
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
