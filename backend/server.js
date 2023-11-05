import express from "express";
import path from "path";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import questionRoutes from "./routes/questionsRoute.js";
import { subscribeToService } from "./utils/sms-ussd-api.js";

dotenv.config();
import cookieParser from "cookie-parser";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
const port = 5000;

connectDB();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/users", userRoutes);
app.use("/api/questions", questionRoutes);

//Start of  Africas Talking SMS API
app.use('/ussd/events', (req, res) => {
  console.log(`Request_Endpoint: ${req.method} ${req.url}`)
  res.send('ok')
})

app.use((req, res, next) => {
  console.log(`Request_Endpoint: ${req.method} ${req.url}`)
  next()
})

app.post('/ussd', async (req, res) => {
  const { text } = req.body
  console.log(text)

  let query = ''
  let location = ''
  let collection_id = ''
  let phones = []

  if (text === '') {
    
    response = "CON AI Edu Hub\nPlease enter your query below"
    
  } else if (text.split("*").length == 1) {
    query = text.trim()
         
    response = "CON How would you like to get your response?\n1. Send SMS\n2. Make a Voice Call"
    
  }else if (text.split("*").length == 2 && text.split("*")[1] === '1') {
    response = "CON Enter your phone number below(include country code) ...\n"
    
  }else if (text.split("*").length == 3 && text.split("*")[2]){
  phones.push(text.split('*')[2])

    const res= await subscribeToService(text.split("*")[0],phones);

    // Make sms call

    console.log(phones)
    
     response = `END You query has been received we are preparing a response! You will receive an sms shortly :)`
  } else {
    
    response = 'END Invalid input. Please try again.'
  };

  res.set('Content-Type: text/plain')
  res.send(response)
})

app.use('*', (_req, res) => res.status(400).send('Invalid route. Please check your URL and try again.'))

// End of Africas Talking SMS API

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "frontend/dist")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

app.use(notFound);
app.use(errorHandler);
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
