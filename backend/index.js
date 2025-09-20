const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { connect } = require("./config/database");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,                // for local/dev
      "https://ss-zone-frontend.onrender.com",
      "https://sszonetechnologies.com"  // your deployed frontend
    ],
    credentials: true,
  })
);

console.log("frontend url", process.env.FRONTEND_URL);

const cart_route = require("./routes/cartRoute");
const wishlist_route = require("./routes/wishlistRoute");
const contact_route = require("./routes/contactRoute");
const comment_route = require("./routes/commentRouter");
const announcement_route = require("./routes/announcementRoute");
const auth_Routes = require("./routes/auth.Route");
const course_route = require("./routes/CourseRoute");

const adminRouter = require("./routes/adminAuthRoute");
const instructorAuthRoutes = require("./routes/instructorRoute");
const blog_route = require("./routes/blogRoute");
const instructor_setting = require("./routes/Instructorsetting");
const course_instructor = require("./routes/CourseRoute-instructor");
const quiz_route = require('./routes/quizRoute')

const admin_setting = require("./routes/adminSettingRoute");
const overview_route = require("./routes/OverviewRoute");
const introVideo_route = require("./routes/courseIntroVideoRoute");
const moduleLesson_route = require("./routes/ModuleRoute");
const remark_Route = require("./routes/courseRemarkRoute");
const razorpay_routes = require("./routes/razorpay");
const studentSetting_route = require("./routes/studentSettingsRoute");
const studentReview_route = require('./routes/courseReviewRoute')

app.use("/api/auth", auth_Routes); //student
app.use("/api/studentSettings", studentSetting_route);

app.use("/api/cart", cart_route);
app.use("/api/wishlist", wishlist_route);

app.use("/api/contact", contact_route);
app.use("/api/comment", comment_route);

app.use("/api/ancument", announcement_route);

// app.use("/uploads", express.static("uploads"));  //multer
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use("/api/courses", course_route);  this is for admin course
app.use("/api/instructor-courses", course_instructor);
app.use("/api/course-intro-video", introVideo_route);
app.use("/api/overview", overview_route);
app.use("/api/course-structure", moduleLesson_route); //Module and lesson
app.use("/api/remark", remark_Route);
app.use('/api/quiz' , quiz_route)

//razorpay route
app.use("/api/payment", razorpay_routes);
app.use('/api/reviews' , studentReview_route);

// app.use("/api/additional-info", additionalInfo_route);

app.use("/api/blogs", blog_route);

app.use("/api/admin", adminRouter);
app.use("/api/admin-setting", admin_setting);

app.use("/api/instructor", instructorAuthRoutes);
app.use("/api/setting", instructor_setting);

app.use("/", (req, res) => {
  return res.status(200).send({ message: "Welcome to backend" });
});

connect();

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
