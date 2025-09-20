const contactUS = require("../models/contactUsModel");

const contactDetails = async (req, res) => {
  try {
    const { firstName, lastName, phone, email, subject, address, message } =
      req.body;

    const contactData = new contactUS({
      firstName,
      lastName,
      phone,
      email,
      subject,
      address,
      message,
    });

    const savedContactDetails = await contactData.save();

    res.status(201).send({
      status: true,
      message: "Details of ContactUs page",
      data: savedContactDetails,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const getContactData = async (req, res) => {
  try {
    const contactData = await contactUS.find();
    res.status(200).send({
      status: true,
      message: "Show Contact Data",
      data: contactData,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "Something went wrong ",
    });
  }
};

module.exports = {
  contactDetails,
  getContactData,
};
