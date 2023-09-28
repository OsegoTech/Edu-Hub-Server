import AfricasTalking from "africastalking";
const credentials = {
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME,
};

const africasTalking = AfricasTalking({
  apiKey: "2ce283d5af829ab85a50e74b86a06d4397d5d46fd623fb10a06db450dceca497",
  username: "eduhubbard",
});

// Initialize a service e.g. Voice
export const makeVoice = async (to, message) => {
  try {
    const voice = africasTalking.VOICE;

    // make a call

    const response = await voice.call({
    //   from: "+254711082593",
      callFrom: "+254711082593",
      callTo: to,
      message,
      enqueue: true,
    });

    console.log(response);
    return response;
  } catch (error) {
    console.error("Error making voice call: ", error);
  }
};
